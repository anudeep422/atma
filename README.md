# Atma: Wisdom of the Upanishads

An AI spiritual guide. Users ask life questions and get gentle guidance grounded in
real Upanishad verses, plus one small daily practice.

- **Free:** verse of the day + 3 questions/day
- **Seeker ($4.99/month):** unlimited questions (Stripe subscription)
- **English + Telugu:** switch at the top of every page; Sanskrit verses shown in Telugu script, Telugu meanings, AI answers in Telugu.
- **Accuracy:** the AI only *chooses* verses from a curated library (`verses.js`);
  the app displays the verse text itself, so scripture is never invented.

## Run it on your computer

1. Install Node.js 20.12 or newer from https://nodejs.org
2. In this folder:
   ```bash
   npm install
   ```
   ```bash
   cp .env.example .env
   ```
   ```bash
   npm start
   ```
3. Open http://localhost:3000

Without keys it runs in **demo mode** (sample answers, free upgrades), so you can try everything.

## Make it real

### 1. Claude API key (for real answers)
- Sign up at https://platform.claude.com, add billing, and create an API key.
- Put it in `.env` as `ANTHROPIC_API_KEY=...`
- Cost: roughly 1–3 US cents per answer. A subscriber asking ~2 questions a day costs ~$1–2/month, against $4.99 of revenue.
  If you need to cut costs later, switch `MODEL` in `guide.js` to a cheaper model.

### 2. Stripe (to get paid)
1. Create an account at https://stripe.com (Stripe India is available, or use a supported country).
2. In **test mode**: Product catalog → Add product "Atma Seeker", recurring, $4.99/month. Copy the **price ID** (`price_...`).
3. Developers → API keys → copy the **secret key** (`sk_test_...`).
4. Developers → Webhooks → add endpoint `https://YOUR-SITE/api/stripe-webhook` with events
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the **signing secret** (`whsec_...`).
5. Settings → Billing → Customer portal → activate it (lets users cancel on their own).
6. Fill `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` in `.env`.
7. Test with card `4242 4242 4242 4242`, any future date, any CVC. When it works, switch Stripe to live mode and use live keys.

### 3. Put it online
Easiest: push this folder to GitHub, then create a **Web Service** on https://render.com (or Railway):
- Build command: `npm install` · Start command: `npm start`
- Add the `.env` values as environment variables, plus `NODE_ENV=production` and `APP_URL=https://your-app.onrender.com`
- Render's free plan works. Accounts are stored in a free **Turso** database (next section), not on Render's disk.

### 4. Free database (Turso)
1. Sign up at https://turso.tech with GitHub (free plan: 5 GB, plenty for this app).
2. Click **Create Database**, name it `atma`, pick the region closest to your users.
3. Copy the database URL (`libsql://atma-<you>.turso.io`) → `TURSO_DATABASE_URL`.
4. Click **Create Token** → copy it → `TURSO_AUTH_TOKEN`.
5. Add both on Render under Environment. The tables are created automatically on first start.

Locally you can leave these empty: the app uses a file called `atma.db`.

## Files
| File | What it does |
|---|---|
| `server.js` | Web server: accounts, daily limit, Stripe checkout & webhook |
| `guide.js` | The AI guide (Claude) and its instructions |
| `verses.js` | The curated Upanishad verse library: add more verses here |
| `db.js` | Database (users, sessions, usage): local file or Turso |
| `translit.js` | Converts Sanskrit (Roman letters) to Telugu script |
| `public/i18n.js` | All English/Telugu website text: edit wording here |
| `public/` | Landing page and app UI |

## Before launching publicly
- Have someone knowledgeable review the verse references and English/Telugu meanings in `verses.js`.
- Add a privacy policy and terms page (Stripe requires them).
- Consider rate limiting on login (e.g. `express-rate-limit`).
