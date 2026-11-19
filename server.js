import express from "express";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";
import * as store from "./db.js";
import { askGuide } from "./guide.js";
import { verseOfTheDay } from "./verses.js";

const PORT = Number(process.env.PORT || 3000);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const FREE_PER_DAY = Number(process.env.FREE_QUESTIONS_PER_DAY || 3);
const IS_PROD = process.env.NODE_ENV === "production";

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
if (IS_PROD && !stripe) throw new Error("STRIPE_SECRET_KEY is required in production");

const app = express();

// ---- Stripe webhook (needs the raw body, so it is registered before express.json) ----
app.post("/api/stripe-webhook", express.raw({ type: "application/json" }), (req, res) => {
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
      if (obj.client_reference_id) store.setPremium(Number(obj.client_reference_id), true, obj.customer);
      break;
    case "customer.subscription.updated":
      store.setPremiumByCustomer(obj.customer, ["active", "trialing"].includes(obj.status));
      break;
    case "customer.subscription.deleted":
      store.setPremiumByCustomer(obj.customer, false);
      break;
  }
  res.json({ received: true });
});

app.use(express.json({ limit: "50kb" }));
app.use(express.static("public"));

// ---- auth helpers ----
function getCookie(req, name) {
  const match = (req.headers.cookie || "").split(/;\s*/).find((c) => c.startsWith(name + "="));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function startSession(res, userId) {
  const { token, maxAge } = store.createSession(userId);
  res.setHeader("Set-Cookie",
    `sid=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}${IS_PROD ? "; Secure" : ""}`);
}

function requireUser(req, res, next) {
  const user = store.userForSession(getCookie(req, "sid"));
  if (!user) return res.status(401).json({ error: "Please log in." });
  req.user = user;
  next();
}

const publicUser = (u) => {
  const used = store.questionsUsedToday(u.id);
  return {
    email: u.email,
    premium: Boolean(u.premium),
    freePerDay: FREE_PER_DAY,
    remainingToday: u.premium ? null : Math.max(0, FREE_PER_DAY - used),
  };
};

// ---- routes ----
app.get("/api/verse-of-the-day", (_req, res) => res.json(verseOfTheDay()));

app.post("/api/signup", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.status(400).json({ error: "Please enter a valid email." });
  if (password.length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });
  if (store.findUserByEmail(email)) return res.status(409).json({ error: "An account with this email already exists." });
  const id = store.createUser(email, password);
  startSession(res, id);
  res.json(publicUser(store.findUserById(id)));
});

app.post("/api/login", (req, res) => {
  const user = store.findUserByEmail(String(req.body.email || "").trim().toLowerCase());
  if (!user || !store.checkPassword(String(req.body.password || ""), user.pass_hash)) {
    return res.status(401).json({ error: "Wrong email or password." });
  }
  startSession(res, user.id);
  res.json(publicUser(user));
});

app.post("/api/logout", (req, res) => {
  store.deleteSession(getCookie(req, "sid"));
  res.setHeader("Set-Cookie", "sid=; Path=/; Max-Age=0");
  res.json({ ok: true });
});

app.get("/api/me", requireUser, (req, res) => res.json(publicUser(req.user)));

app.post("/api/ask", requireUser, async (req, res) => {
  const question = String(req.body.question || "").trim().slice(0, 2000);
  if (!question) return res.status(400).json({ error: "Please write your question." });

  if (!req.user.premium && store.questionsUsedToday(req.user.id) >= FREE_PER_DAY) {
    return res.status(402).json({ error: "limit", message: `You've used your ${FREE_PER_DAY} free questions today.` });
  }

  const history = Array.isArray(req.body.history)
    ? req.body.history
        .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    : [];

  try {
    const result = await askGuide(question, history);
    store.recordQuestion(req.user.id);
    res.json({ ...result, me: publicUser(req.user) });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return res.status(503).json({ error: "The guide is busy right now. Please try again in a minute." });
    }
    console.error("askGuide failed:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.post("/api/checkout", requireUser, async (req, res) => {
  if (!stripe) {
    // Demo mode (local only): upgrade instantly so you can test the premium experience.
    store.setPremium(req.user.id, true);
    return res.json({ url: "/app.html?upgraded=demo" });
  }
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    client_reference_id: String(req.user.id),
    ...(req.user.stripe_customer_id ? { customer: req.user.stripe_customer_id } : { customer_email: req.user.email }),
    success_url: `${APP_URL}/app.html?upgraded=1`,
    cancel_url: `${APP_URL}/app.html`,
  });
  res.json({ url: session.url });
});

app.post("/api/billing-portal", requireUser, async (req, res) => {
  if (!stripe || !req.user.stripe_customer_id) return res.status(400).json({ error: "No subscription to manage." });
  const portal = await stripe.billingPortal.sessions.create({
    customer: req.user.stripe_customer_id,
    return_url: `${APP_URL}/app.html`,
  });
  res.json({ url: portal.url });
});

app.listen(PORT, () => {
  console.log(`Atma running at ${APP_URL}`);
  console.log(`  AI guide: ${process.env.ANTHROPIC_API_KEY ? "Claude (live)" : "DEMO mode (set ANTHROPIC_API_KEY)"}`);
  console.log(`  Payments: ${stripe ? "Stripe" : "DEMO mode (set STRIPE_SECRET_KEY)"}`);
});
