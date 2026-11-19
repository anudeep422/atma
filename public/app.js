// Uses t(), LANG, verseEl() and onLangChange from i18n.js.
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let signupMode = params.has("signup");
let history = []; // recent turns sent to the guide for context
let me = null;

async function api(path, body) {
  const token = await AtmaAuth.token();
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const errorText = (data) => (data.code ? t("err_" + data.code) : data.error) || t("err_generic");

// Firebase error codes -> our messages
const FIREBASE_ERRORS = {
  "auth/email-already-in-use": "email_exists",
  "auth/invalid-email": "invalid_email",
  "auth/weak-password": "short_password",
  "auth/invalid-credential": "wrong_login",
  "auth/wrong-password": "wrong_login",
  "auth/user-not-found": "wrong_login",
  "auth/too-many-requests": "too_many",
  "auth/unauthorized-domain": "unauthorized_domain",
  "auth/operation-not-allowed": "method_disabled",
  "auth/popup-blocked": "popup_blocked",
  "auth/network-request-failed": "network",
};
const showAuthError = (err) => {
  if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") return;
  console.error(err);
  $("auth-error").className = "error";
  const known = FIREBASE_ERRORS[err?.code];
  // Unknown problems show their code, e.g. "(auth/internal-error)", to make fixing easier.
  $("auth-error").textContent = known ? t("err_" + known) : `${t("err_generic")} (${err?.code || err?.message || "unknown"})`;
};

// ---------- auth ----------
function renderAuthText() {
  $("auth-title").textContent = t(signupMode ? "create_account" : "welcome_back");
  $("auth-toggle").textContent = t(signupMode ? "have_account" : "new_here");
}

function showAuth() {
  me = null;
  $("auth").classList.remove("hidden");
  $("main").classList.add("hidden");
  $("logout").classList.add("hidden");
  renderAuthText();
}

$("auth-toggle").onclick = () => { signupMode = !signupMode; renderAuthText(); };

$("auth-form").onsubmit = async (e) => {
  e.preventDefault();
  $("auth-error").textContent = "";
  const email = $("email").value.trim();
  const password = $("password").value;
  if (signupMode && password.length < 8) return showAuthError({ code: "auth/weak-password" });
  try {
    await (signupMode ? AtmaAuth.signUp(email, password) : AtmaAuth.logIn(email, password));
    // onSignInChange (below) takes it from here.
  } catch (err) {
    showAuthError(err);
  }
};

$("google").onclick = async () => {
  $("auth-error").textContent = "";
  try { await AtmaAuth.google(); } catch (err) { showAuthError(err); }
};

$("forgot").onclick = async () => {
  const email = $("email").value.trim();
  const box = $("auth-error");
  if (!email) { box.className = "error"; box.textContent = t("reset_need_email"); return; }
  try {
    await AtmaAuth.resetPassword(email);
  } catch (err) {
    if (err?.code !== "auth/user-not-found") return showAuthError(err);
  }
  // Same message whether or not the account exists, so emails can't be probed.
  box.className = "info";
  box.textContent = t("reset_sent");
};

$("logout").onclick = async () => { await AtmaAuth.logOut(); signupMode = false; };

async function onSignInChange(user) {
  if (!user) return showAuth();
  const { ok, data } = await api("/api/me");
  if (ok) showMain(data);
  else showAuth();
}

// ---------- main ----------
function renderPlan() {
  if (!me) return;
  $("plan").innerHTML = "";
  if (me.unlimited && !me.premium) {
    $("plan").textContent = t("free_testing");
    $("upgrade").classList.add("hidden");
    $("manage").classList.add("hidden");
    $("upsell").classList.add("hidden");
    $("ask").classList.remove("hidden");
    return;
  }
  if (me.premium) {
    const b = document.createElement("span");
    b.className = "badge"; b.textContent = t("seeker");
    $("plan").append(b, " " + t("unlimited"));
  } else {
    $("plan").textContent = t("left", { n: me.remainingToday, m: me.freePerDay });
  }
  $("upgrade").classList.toggle("hidden", me.premium);
  $("manage").classList.toggle("hidden", !me.premium);
  const outOfQuestions = !me.premium && me.remainingToday === 0;
  $("upsell").classList.toggle("hidden", !outOfQuestions);
  $("ask").classList.toggle("hidden", outOfQuestions);
  if (outOfQuestions) $("suggestions").classList.add("hidden");
}

function renderNotice() {
  const upgraded = params.get("upgraded");
  if (!upgraded) return;
  $("notice").classList.remove("hidden");
  $("notice").textContent = t(upgraded === "demo" ? "upgraded_demo" : "upgraded");
}

function showMain(user) {
  me = user;
  $("auth").classList.add("hidden");
  $("main").classList.remove("hidden");
  $("logout").classList.remove("hidden");
  renderPlan();
  renderNotice();
}

onLangChange.push(() => {
  if (me) { renderPlan(); renderNotice(); } else renderAuthText();
});

function addMessage(role, text, verses = []) {
  const el = document.createElement("div");
  el.className = `msg ${role}`;
  if (role === "user") {
    el.textContent = text;
  } else {
    verses.forEach((v) => el.appendChild(verseEl(v)));
    const p = document.createElement("p");
    p.textContent = text;
    if (role === "thinking") { el.className = "msg guide"; p.className = "thinking"; }
    el.appendChild(p);
  }
  $("chat").appendChild(el);
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return el;
}

$("ask").onsubmit = async (e) => {
  e.preventDefault();
  const question = $("question").value.trim();
  if (!question) return;
  $("suggestions").classList.add("hidden");
  $("question").value = "";
  $("send").disabled = true;
  addMessage("user", question);
  const waiting = addMessage("thinking", t("thinking"));

  const { ok, status, data } = await api("/api/ask", { question, history, lang: LANG });
  waiting.remove();
  $("send").disabled = false;

  if (status === 401) return showAuth();
  if (status === 402) {
    $("upsell").classList.remove("hidden");
    $("ask").classList.add("hidden");
    return;
  }
  if (!ok) return addMessage("guide", errorText(data));

  addMessage("guide", data.answer, data.verses);
  history.push({ role: "user", content: question }, { role: "assistant", content: data.answer });
  history = history.slice(-6);
  me = data.me;
  renderPlan();
};

document.querySelectorAll("#suggestions button").forEach((b) => {
  b.onclick = () => { $("question").value = b.textContent; $("question").focus(); };
});

async function goToCheckout() {
  const { ok, data } = await api("/api/checkout", {});
  if (ok && data.url) location.href = data.url;
  else alert(errorText(data));
}
$("upgrade").onclick = goToCheckout;
document.querySelector("[data-upgrade]").onclick = goToCheckout;
$("manage").onclick = async () => {
  const { ok, data } = await api("/api/billing-portal", {});
  if (ok && data.url) location.href = data.url;
  else alert(errorText(data));
};

// ---------- start ----------
AtmaAuth.init(onSignInChange);
