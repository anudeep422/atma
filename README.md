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
2. Fill in `firebase-config.json` and `.env` (see "Firebase" below), then in this folder:
   ```bash
   npm install
   ```
   ```bash
   npm start
   ```
3. Open http://localhost:3000

Without Claude/Stripe keys the guide gives sample answers and upgrades are free (demo mode).

## Make it real

### 1. Firebase (sign-in + database), free Spark plan
1. https://console.firebase.google.com → **Create a project** → name `atma` → Analytics off.
2. **Build → Authentication → Get started** → enable **Google** and **Email/Password**.
3. **Build → Firestore Database → Create database** → `asia-south1 (Mumbai)` → **production mode**.
   (Production mode blocks direct browser access; only this app's server reads/writes data.)
4. **⚙️ Project settings → Your apps → `</>` Web** → register `atma-web` → copy `apiKey`, `authDomain`,
   `projectId`, `appId` into `firebase-config.json` (these are public, safe to commit).
5. **⚙️ Project settings → Service accounts → Generate new private key** → a JSON file downloads.
   Put its contents in the `FIREBASE_SERVICE_ACCOUNT` environment variable. **This is secret: never commit or share it.**
6. After deploying: **Authentication → Settings → Authorized domains → Add domain** → your Render domain
   (e.g. `atma-xxxx.onrender.com`), otherwise Google sign-in is blocked.

### 2. AI answers: free with Gemini, or paid with Claude
**Free (start here):** https://aistudio.google.com/apikey → sign in with Google → **Create API key** →
add it on Render as `GEMINI_API_KEY`. No card needed.
- The free tier has daily/per-minute limits; when hit, users see "busy, try again in a minute".
- On the free tier Google may use prompts to improve its products. Mention this in your privacy policy,
  and switch to a paid tier (or Claude) once you have paying subscribers.
- When Gemini is busy, the app retries automatically and falls back to the newest lighter "flash-lite" model.
  Render's Logs show `Gemini answered with <model> in <n>s` or the reason for each failure.
- Optional settings: `GEMINI_MODEL` (default `gemini-3.8-flash`), `GEMINI_FALLBACK_MODEL` (default: picked automatically),
  `GEMINI_THINKING` = `LOW` (default, faster), `MINIMAL` (fastest) or `OFF`.

**Paid, best quality:** create a key at https://platform.claude.com and add it as `ANTHROPIC_API_KEY`
(roughly 1–3 US cents per answer). If both keys are set, Claude is used.

### 3. Stripe (to get paid)
1. Create an account at https://stripe.com (Stripe India is available, or use a supported country).
2. In **test mode**: Product catalog → Add product "Atma Seeker", recurring, $4.99/month. Copy the **price ID** (`price_...`).
3. Developers → API keys → copy the **secret key** (`sk_test_...`).
4. Developers → Webhooks → add endpoint `https://YOUR-SITE/api/stripe-webhook` with events
   `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Copy the **signing secret** (`whsec_...`).
5. Settings → Billing → Customer portal → activate it (lets users cancel on their own).
6. Fill `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET` in `.env`.
7. Test with card `4242 4242 4242 4242`, any future date, any CVC. When it works, switch Stripe to live mode and use live keys.

### 4. Put it online (Render, auto-deploys from GitHub)
1. https://render.com → sign in with GitHub → **New → Web Service** → pick this repo.
2. Build command: `npm install` · Start command: `npm start` · Instance: Free.
3. Environment: add `FIREBASE_SERVICE_ACCOUNT`, `GEMINI_API_KEY` (or `ANTHROPIC_API_KEY`), the 3 Stripe values,
   `APP_URL=https://your-app.onrender.com`, and finally `NODE_ENV=production`.
4. Every push to the `main` branch on GitHub redeploys the site automatically.

### Testing locally without a Firebase project
Run the Firebase emulators (`npx firebase-tools emulators:start --only auth,firestore --project demo-atma`), then:
```bash
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 GCLOUD_PROJECT=demo-atma npm start
```

## Files
| File | What it does |
|---|---|
| `server.js` | Web server: daily limit, Stripe checkout & webhook |
| `guide.js` | The AI guide (Gemini free / Claude paid) and its instructions |
| `verses.js` | The curated Upanishad verse library: add more verses here |
| `store.js` | Firebase: checks sign-ins, stores users and usage in Firestore |
| `client/firebase-auth.js` | Browser sign-in code (Google, email, password reset); built into `public/` on `npm install` |
| `firebase-config.json` | Your Firebase project's public web settings |
| `translit.js` | Converts Sanskrit (Roman letters) to Telugu script |
| `public/i18n.js` | All English/Telugu website text: edit wording here |
| `public/` | Landing page and app UI |

## Before launching publicly
- Have someone knowledgeable review the verse references and English/Telugu meanings in `verses.js`.
- Add a privacy policy and terms page (Stripe requires them).
- Firebase protects sign-in against password guessing automatically.
