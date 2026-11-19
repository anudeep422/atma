import { createClient } from "@libsql/client";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// Locally: a plain SQLite file (no setup needed).
// Online: a free Turso database, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:atma.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.executeMultiple(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    pass_hash TEXT NOT NULL,
    premium INTEGER NOT NULL DEFAULT 0,
    stripe_customer_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS usage (
    user_id INTEGER NOT NULL,
    day TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, day)
  );
`);

const SESSION_DAYS = 30;
const one = async (sql, args = []) => (await db.execute({ sql, args })).rows[0] ?? null;
const run = (sql, args = []) => db.execute({ sql, args });

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

export async function createUser(email, password) {
  const info = await run("INSERT INTO users (email, pass_hash) VALUES (?, ?)", [email, hashPassword(password)]);
  return Number(info.lastInsertRowid);
}

export const findUserByEmail = (email) => one("SELECT * FROM users WHERE email = ?", [email]);
export const findUserById = (id) => one("SELECT * FROM users WHERE id = ?", [id]);

export async function createSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  await run("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)", [token, userId, expires]);
  return { token, maxAge: SESSION_DAYS * 86_400 };
}

export async function userForSession(token) {
  if (!token) return null;
  const row = await one("SELECT user_id, expires_at FROM sessions WHERE token = ?", [token]);
  if (!row || Number(row.expires_at) < Date.now()) return null;
  return findUserById(row.user_id);
}

export const deleteSession = (token) => run("DELETE FROM sessions WHERE token = ?", [token ?? ""]);

const today = () => new Date().toISOString().slice(0, 10);

export async function questionsUsedToday(userId) {
  const row = await one("SELECT count FROM usage WHERE user_id = ? AND day = ?", [userId, today()]);
  return Number(row?.count ?? 0);
}

export const recordQuestion = (userId) =>
  run(`INSERT INTO usage (user_id, day, count) VALUES (?, ?, 1)
       ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1`, [userId, today()]);

export function setPremium(userId, premium, stripeCustomerId) {
  return stripeCustomerId
    ? run("UPDATE users SET premium = ?, stripe_customer_id = ? WHERE id = ?", [premium ? 1 : 0, stripeCustomerId, userId])
    : run("UPDATE users SET premium = ? WHERE id = ?", [premium ? 1 : 0, userId]);
}

export const setPremiumByCustomer = (stripeCustomerId, premium) =>
  run("UPDATE users SET premium = ? WHERE stripe_customer_id = ?", [premium ? 1 : 0, stripeCustomerId]);
