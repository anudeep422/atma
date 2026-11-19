// English / Telugu text for the whole site, plus the language switch.
// Mark elements with data-i18n="key" (text), data-i18n-html="key" (allows <br>)
// or data-i18n-ph="key" (placeholder).

const STRINGS = {
  en: {
    switch_to: "తెలుగు",
    login: "Log in",
    logout: "Log out",
    hero_title: "Ancient wisdom for<br>the questions you carry today",
    hero_sub: "Ask about stress, purpose, relationships or loss, and receive gentle guidance drawn from the Upanishads, with a simple practice for your day.",
    start_free: "Start free",
    todays_verse: "Today's verse",
    loading: "Loading…",
    how: "How it works",
    step1_t: "1. Ask", step1_d: "Share what's on your mind, in your own words.",
    step2_t: "2. Receive", step2_d: "Get guidance rooted in authentic Upanishad verses, explained simply.",
    step3_t: "3. Practice", step3_d: "Leave with one small practice to bring the teaching into your day.",
    pricing: "Pricing",
    free: "Free",
    per_month: "/month",
    f1: "Verse of the day", f2: "3 questions per day",
    seeker: "Seeker",
    s1: "Unlimited questions", s2: "Deeper, continuing conversations", s3: "Cancel anytime",
    get_started: "Get started",
    footer: "Atma offers spiritual reflection, not medical, legal or financial advice.<br>If you are in crisis, please contact a local helpline or emergency services.",
    create_account: "Create your account",
    welcome_back: "Welcome back",
    email: "Email",
    password: "Password (8+ characters)",
    continue: "Continue",
    have_account: "I already have an account",
    new_here: "New here? Create an account",
    upgrade_btn: "Upgrade: $4.99/mo",
    manage: "Manage subscription",
    unlimited: "Unlimited questions",
    left: "{n} of {m} free questions left today",
    sugg1: "I feel anxious about my future",
    sugg2: "How do I stop comparing myself to others?",
    sugg3: "I lost someone I love",
    sugg4: "I can't stay disciplined",
    upsell_t: "You've used today's free questions",
    upsell_d: "Become a Seeker for unlimited guidance, any time you need it.",
    upsell_btn: "Upgrade for $4.99/month",
    question_ph: "What is on your heart today?",
    ask: "Ask the guide",
    thinking: "Reflecting on the Upanishads…",
    upgraded_demo: "Demo mode: you were upgraded without payment. Add Stripe keys to take real payments.",
    upgraded: "Thank you for becoming a Seeker. Unlimited guidance is now yours. 🙏",
    err_invalid_email: "Please enter a valid email.",
    err_short_password: "Password must be at least 8 characters.",
    err_email_exists: "An account with this email already exists.",
    err_wrong_login: "Wrong email or password.",
    err_busy: "The guide is busy right now. Please try again in a minute.",
    google_btn: "Continue with Google",
    or: "or",
    forgot: "Forgot password?",
    reset_sent: "Password reset email sent. Please check your inbox.",
    reset_need_email: "Type your email above first, then tap \"Forgot password?\".",
    err_too_many: "Too many attempts. Please wait a few minutes and try again.",
    err_payments_soon: "Upgrades are coming soon. Thank you for your patience! 🙏",
    err_generic: "Something went wrong. Please try again.",
  },
  te: {
    switch_to: "English",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    hero_title: "నేటి మీ ప్రశ్నలకు<br>ప్రాచీన జ్ఞానం",
    hero_sub: "ఒత్తిడి, జీవిత లక్ష్యం, అనుబంధాలు లేదా దుఃఖం గురించి అడగండి. ఉపనిషత్తుల నుండి సున్నితమైన మార్గదర్శనాన్ని, మీ రోజుకు ఒక చిన్న సాధనతో పాటు పొందండి.",
    start_free: "ఉచితంగా ప్రారంభించండి",
    todays_verse: "నేటి శ్లోకం",
    loading: "లోడ్ అవుతోంది…",
    how: "ఇది ఎలా పనిచేస్తుంది",
    step1_t: "1. అడగండి", step1_d: "మీ మనసులో ఉన్నది మీ మాటల్లోనే చెప్పండి.",
    step2_t: "2. పొందండి", step2_d: "అసలైన ఉపనిషత్ శ్లోకాల ఆధారంగా, సరళంగా వివరించిన మార్గదర్శనం పొందండి.",
    step3_t: "3. ఆచరించండి", step3_d: "ఆ బోధను మీ రోజులోకి తెచ్చే ఒక చిన్న సాధనతో ముందుకు సాగండి.",
    pricing: "ధరలు",
    free: "ఉచితం",
    per_month: "/నెలకు",
    f1: "రోజువారీ శ్లోకం", f2: "రోజుకు 3 ప్రశ్నలు",
    seeker: "సాధక",
    s1: "అపరిమిత ప్రశ్నలు", s2: "లోతైన, కొనసాగే సంభాషణలు", s3: "ఎప్పుడైనా రద్దు చేయవచ్చు",
    get_started: "ప్రారంభించండి",
    footer: "ఆత్మ ఆధ్యాత్మిక చింతనను అందిస్తుంది; ఇది వైద్య, న్యాయ లేదా ఆర్థిక సలహా కాదు.<br>మీరు సంక్షోభంలో ఉంటే, దయచేసి స్థానిక హెల్ప్‌లైన్ (Tele-MANAS 14416) లేదా అత్యవసర సేవలను సంప్రదించండి.",
    create_account: "మీ ఖాతాను సృష్టించండి",
    welcome_back: "మళ్ళీ స్వాగతం",
    email: "ఈమెయిల్",
    password: "పాస్‌వర్డ్ (8+ అక్షరాలు)",
    continue: "కొనసాగించండి",
    have_account: "నాకు ఇప్పటికే ఖాతా ఉంది",
    new_here: "కొత్తవారా? ఖాతా సృష్టించండి",
    upgrade_btn: "అప్‌గ్రేడ్: $4.99/నెల",
    manage: "సబ్‌స్క్రిప్షన్ నిర్వహించండి",
    unlimited: "అపరిమిత ప్రశ్నలు",
    left: "ఈ రోజు {m} లో {n} ఉచిత ప్రశ్నలు మిగిలి ఉన్నాయి",
    sugg1: "నా భవిష్యత్తు గురించి ఆందోళనగా ఉంది",
    sugg2: "ఇతరులతో నన్ను నేను పోల్చుకోవడం ఎలా ఆపాలి?",
    sugg3: "నేను ప్రేమించిన వ్యక్తిని కోల్పోయాను",
    sugg4: "నేను క్రమశిక్షణగా ఉండలేకపోతున్నాను",
    upsell_t: "ఈ రోజు ఉచిత ప్రశ్నలు అయిపోయాయి",
    upsell_d: "సాధక ప్లాన్‌తో ఎప్పుడు కావాలన్నా అపరిమిత మార్గదర్శనం పొందండి.",
    upsell_btn: "$4.99/నెలకు అప్‌గ్రేడ్ చేయండి",
    question_ph: "ఈ రోజు మీ మనసులో ఏముంది?",
    ask: "మార్గదర్శిని అడగండి",
    thinking: "ఉపనిషత్తులను మననం చేస్తోంది…",
    upgraded_demo: "డెమో మోడ్: చెల్లింపు లేకుండా అప్‌గ్రేడ్ అయ్యారు. నిజమైన చెల్లింపుల కోసం Stripe కీలు జోడించండి.",
    upgraded: "సాధకులుగా చేరినందుకు ధన్యవాదాలు. ఇప్పుడు మీకు అపరిమిత మార్గదర్శనం లభిస్తుంది. 🙏",
    err_invalid_email: "దయచేసి సరైన ఈమెయిల్ ఇవ్వండి.",
    err_short_password: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
    err_email_exists: "ఈ ఈమెయిల్‌తో ఇప్పటికే ఖాతా ఉంది.",
    err_wrong_login: "ఈమెయిల్ లేదా పాస్‌వర్డ్ తప్పు.",
    err_busy: "మార్గదర్శి ప్రస్తుతం బిజీగా ఉంది. ఒక నిమిషం తర్వాత మళ్ళీ ప్రయత్నించండి.",
    google_btn: "Google తో కొనసాగండి",
    or: "లేదా",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    reset_sent: "పాస్‌వర్డ్ రీసెట్ ఈమెయిల్ పంపాము. దయచేసి మీ ఇన్‌బాక్స్ చూడండి.",
    reset_need_email: "ముందుగా పైన మీ ఈమెయిల్ ఇచ్చి, తర్వాత \"పాస్‌వర్డ్ మర్చిపోయారా?\" నొక్కండి.",
    err_too_many: "చాలా ప్రయత్నాలు జరిగాయి. కొన్ని నిమిషాలు ఆగి మళ్ళీ ప్రయత్నించండి.",
    err_payments_soon: "అప్‌గ్రేడ్ త్వరలో అందుబాటులోకి వస్తుంది. మీ ఓపికకు ధన్యవాదాలు! 🙏",
    err_generic: "ఏదో పొరపాటు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  },
};

function initialLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "te") return saved;
  } catch {}
  return (navigator.language || "").startsWith("te") ? "te" : "en";
}

let LANG = initialLang();
const onLangChange = [];

function t(key, vars = {}) {
  const s = STRINGS[LANG][key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k]);
}

function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll(".verse[data-verse]").forEach(fillVerse);
  onLangChange.forEach((fn) => fn(LANG));
}

function setLang(lang) {
  LANG = lang;
  try { localStorage.setItem("lang", lang); } catch {}
  applyLang();
}

// Verse card: reference, Sanskrit (Telugu or Roman script), meaning in the chosen language.
function fillVerse(box) {
  const v = JSON.parse(box.dataset.verse);
  const te = LANG === "te";
  box.innerHTML = "";
  const rows = [
    ["ref", te ? v.ref_te : v.ref],
    ["sa", te ? v.sanskrit_te : v.sanskrit],
    ["en", te ? v.english_te : v.english],
  ];
  for (const [cls, text] of rows) {
    const el = document.createElement(cls === "ref" ? "div" : "p");
    el.className = cls;
    el.textContent = text;
    box.appendChild(el);
  }
}

function verseEl(v) {
  const box = document.createElement("div");
  box.className = "verse";
  box.dataset.verse = JSON.stringify(v);
  fillVerse(box);
  return box;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.onclick = () => setLang(LANG === "en" ? "te" : "en");
  applyLang();
});
