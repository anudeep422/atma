import { DatabaseSync } from "node:sqlite";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export const db = new DatabaseSync(process.env.DB_PATH || "atma.db");

db.exec(`
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

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function checkPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const candidate = scryptSync(password, salt, 64);
  return timingSafeEqual(candidate, Buffer.from(hash, "hex"));
}

export function createUser(email, password) {
  const info = db.prepare("INSERT INTO users (email, pass_hash) VALUES (?, ?)").run(email, hashPassword(password));
  return Number(info.lastInsertRowid);
}

export const findUserByEmail = (email) => db.prepare("SELECT * FROM users WHERE email = ?").get(email);
export const findUserById = (id) => db.prepare("SELECT * FROM users WHERE id = ?").get(id);

export function createSession(userId) {
  const token = randomBytes(32).toString("hex");
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  db.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, userId, expires);
  return { token, maxAge: SESSION_DAYS * 86_400 };
}

export function userForSession(token) {
  if (!token) return null;
  const row = db.prepare("SELECT user_id, expires_at FROM sessions WHERE token = ?").get(token);
  if (!row || row.expires_at < Date.now()) return null;
  return findUserById(row.user_id);
}

export const deleteSession = (token) => db.prepare("DELETE FROM sessions WHERE token = ?").run(token);

const today = () => new Date().toISOString().slice(0, 10);

export function questionsUsedToday(userId) {
  return db.prepare("SELECT count FROM usage WHERE user_id = ? AND day = ?").get(userId, today())?.count ?? 0;
}

export function recordQuestion(userId) {
  db.prepare(`INSERT INTO usage (user_id, day, count) VALUES (?, ?, 1)
              ON CONFLICT(user_id, day) DO UPDATE SET count = count + 1`).run(userId, today());
}

export function setPremium(userId, premium, stripeCustomerId) {
  if (stripeCustomerId) {
    db.prepare("UPDATE users SET premium = ?, stripe_customer_id = ? WHERE id = ?").run(premium ? 1 : 0, stripeCustomerId, userId);
  } else {
    db.prepare("UPDATE users SET premium = ? WHERE id = ?").run(premium ? 1 : 0, userId);
  }
}

export function setPremiumByCustomer(stripeCustomerId, premium) {
  db.prepare("UPDATE users SET premium = ? WHERE stripe_customer_id = ?").run(premium ? 1 : 0, stripeCustomerId);
}
