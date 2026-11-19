import express from "express";
import { readFileSync } from "node:fs";
import Stripe from "stripe";
import * as store from "./store.js";
import { askGuide, GuideBusyError, AI_PROVIDER, describeAiError } from "./guide.js";
import { verseOfTheDay, VERSE_BY_ID } from "./verses.js";

const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
// Daily free questions. Not set (or 0) = no limit, used while testing.
// To bring the limit back, set FREE_QUESTIONS_PER_DAY=3 on Render.
const FREE_PER_DAY = Number(process.env.FREE_QUESTIONS_PER_DAY || 0);
const UNLIMITED = !(FREE_PER_DAY > 0);
// Who can open the private stats page (comma-separated emails), e.g. ADMIN_EMAILS=you@gmail.com
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
const isAdmin = (u) => Boolean(u.email) && ADMIN_EMAILS.includes(u.email.toLowerCase());
const IS_PROD = process.env.NODE_ENV === "production";
// Free "demo" upgrades are only allowed on your own computer, never on a live site.
const ONLINE = IS_PROD || Boolean(process.env.RENDER);

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
if (ONLINE && !store.firebaseReady) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT is missing. Add it in Render > Environment (see README).");
}

// Public Firebase web settings (safe to publish). Filled in from your Firebase project.
const firebaseWebConfig = store.firebaseEmulator
  ? { apiKey: "demo-key", authDomain: "localhost", projectId: process.env.GCLOUD_PROJECT || "demo-atma" }
  : JSON.parse(readFileSync(new URL("./firebase-config.json", import.meta.url), "utf8"));

const app = express();

// ---- Stripe webhook (needs the raw body, so it is registered before express.json) ----
app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe) return res.sendStatus(404);
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  const obj = event.data.object;
  switch (event.type) {
    case "checkout.session.completed":
      if (obj.client_reference_id) await store.setPremium(obj.client_reference_id, true, obj.customer);
      break;
    case "customer.subscription.updated":
      await store.setPremiumByCustomer(obj.customer, ["active", "trialing"].includes(obj.status));
      break;
    case "customer.subscription.deleted":
      await store.setPremiumByCustomer(obj.customer, false);
      break;
  }
  res.json({ received: true });
});

app.use(express.json({ limit: "50kb" }));
app.use(express.static("public"));

// ---- auth: the browser signs in with Firebase and sends its ID token ----
async function requireUser(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  const who = token && (await store.verifyToken(token));
  if (!who) return res.status(401).json({ error: "Please log in." });
  req.user = await store.getOrCreateUser(who.uid, who.email);
  next();
}

const publicUser = async (u) => {
  if (UNLIMITED) return { email: u.email, premium: Boolean(u.premium), unlimited: true, remainingToday: null, admin: isAdmin(u) };
  const used = await store.questionsUsedToday(u.id);
  return {
    email: u.email,
    premium: Boolean(u.premium),
    freePerDay: FREE_PER_DAY,
    admin: isAdmin(u),
    remainingToday: u.premium ? null : Math.max(0, FREE_PER_DAY - used),
  };
};

// ---- routes ----
app.get("/api/config", (_req, res) => res.json({ firebase: firebaseWebConfig, emulator: store.firebaseEmulator, unlimited: UNLIMITED, contactEmail: process.env.CONTACT_EMAIL || "" }));

app.get("/api/verse-of-the-day", (_req, res) => res.json(verseOfTheDay()));

app.get("/api/me", requireUser, async (req, res) => res.json(await publicUser(req.user)));

app.post("/api/ask", requireUser, async (req, res) => {
  const question = String(req.body.question || "").trim().slice(0, 2000);
  if (!question) return res.status(400).json({ error: "Please write your question." });

  if (!UNLIMITED && !req.user.premium && await store.questionsUsedToday(req.user.id) >= FREE_PER_DAY) {
    return res.status(402).json({ error: "limit", message: `You've used your ${FREE_PER_DAY} free questions today.` });
  }

  const history = Array.isArray(req.body.history)
    ? req.body.history
        .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];

  try {
    const lang = req.body.lang === "te" ? "te" : "en";
    const result = await askGuide(question, history, lang);
    await store.recordQuestion(req.user.id);
    // Save to the user's journal (a failure here shouldn't lose the answer).
    const entryId = await store
      .addEntry(req.user.id, { question, answer: result.answer, verseIds: result.verses.map((v) => v.id), lang, provider: result.provider })
      .catch((err) => console.error("journal save failed:", err.message));
    store.bumpStats({ questions: 1, [`q_${lang}`]: 1, [`by_${result.provider}`]: 1 }).catch(() => {});
    res.json({ ...result, entryId, me: await publicUser(req.user) });
  } catch (err) {
    // "detail" shows the AI provider's reason (e.g. quota or model problems) so it can be fixed quickly.
    const detail = err.detail ?? describeAiError(err);
    if (err instanceof GuideBusyError) {
      console.warn("Guide busy:", detail);
      return res.status(503).json({ error: "The guide is busy right now. Please try again in a minute.", code: "busy", detail });
    }
    console.error("askGuide failed:", err);
    res.status(500).json({ error: "Something went wrong. Please try again.", code: "generic", detail });
  }
});

app.get("/api/journal", requireUser, async (req, res) => {
  const list = await store.listEntries(req.user.id);
  res.json(list.map((e) => ({ ...e, verses: (e.verseIds ?? []).map((id) => VERSE_BY_ID[id]).filter(Boolean) })));
});

app.delete("/api/journal/:id", requireUser, async (req, res) => {
  await store.deleteEntry(req.user.id, String(req.params.id));
  res.json({ ok: true });
});

// 👍 / 👎 on an answer
app.post("/api/feedback", requireUser, async (req, res) => {
  const rating = req.body.rating === "up" ? "up" : req.body.rating === "down" ? "down" : null;
  if (!rating || !req.body.entryId) return res.status(400).json({ error: "Bad feedback" });
  const r = await store.rateEntry(req.user.id, String(req.body.entryId), rating);
  if (!r) return res.status(404).json({ error: "Not found" });
  if (r.previous !== rating) {
    const counts = { [rating]: 1, [`${rating}_${r.provider}`]: 1 };
    if (r.previous) Object.assign(counts, { [r.previous]: -1, [`${r.previous}_${r.provider}`]: -1 });
    await store.bumpStats(counts);
  }
  res.json({ ok: true });
});

// Anonymous counters: verse shares, listens, app installs.
const EVENT_TYPES = new Set(["share", "listen", "install"]);
app.post("/api/event", async (req, res) => {
  const type = String(req.body.type || "");
  if (EVENT_TYPES.has(type)) await store.bumpStats({ [`${type}s`]: 1 }).catch(() => {});
  res.json({ ok: true });
});

// Private stats for the owner (ADMIN_EMAILS).
app.get("/api/stats", requireUser, async (req, res) => {
  if (!isAdmin(req.user)) return res.status(403).json({ error: "Only the app owner can see stats." });
  res.json(await store.getStats(14));
});

app.post("/api/checkout", requireUser, async (req, res) => {
  if (!stripe) {
    // Online without Stripe: payments are not set up yet, so never upgrade for free.
    if (ONLINE) return res.status(503).json({ error: "Payments are coming soon.", code: "payments_soon" });
    // Demo mode (your own computer only): upgrade instantly to test the premium experience.
    await store.setPremium(req.user.id, true);
    return res.json({ url: "/app.html?upgraded=demo" });
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    client_reference_id: req.user.id,
    ...(req.user.stripeCustomerId ? { customer: req.user.stripeCustomerId } : { customer_email: req.user.email || undefined }),
    success_url: `${APP_URL}/app.html?upgraded=1`,
    cancel_url: `${APP_URL}/app.html`,
  });
  res.json({ url: session.url });
});

app.post("/api/billing-portal", requireUser, async (req, res) => {
  if (!stripe || !req.user.stripeCustomerId) return res.status(400).json({ error: "No subscription to manage." });
  const portal = await stripe.billingPortal.sessions.create({
    customer: req.user.stripeCustomerId,
    return_url: `${APP_URL}/app.html`,
  });
  res.json({ url: portal.url });
});

app.listen(PORT, () => {
  console.log(`Atma running at ${APP_URL}`);
  console.log(`  AI guide: ${AI_PROVIDER ?? "DEMO mode (set GEMINI_API_KEY for free AI answers)"}`);
  console.log(`  Payments: ${stripe ? "Stripe" : ONLINE ? "NOT SET UP (upgrade button shows 'coming soon')" : "DEMO mode (set STRIPE_SECRET_KEY)"}`);
  console.log(`  Daily limit: ${UNLIMITED ? "none (free testing mode)" : FREE_PER_DAY + " free questions"}`);
  console.log(`  Accounts: ${store.firebaseEmulator ? "Firebase EMULATOR" : store.firebaseReady ? "Firebase" : "NOT CONFIGURED (set FIREBASE_SERVICE_ACCOUNT)"}`);
});
