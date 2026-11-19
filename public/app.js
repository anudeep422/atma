// Uses t(), LANG, verseEl() and onLangChange from i18n.js.
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let signupMode = params.has("signup");
let history = []; // recent turns sent to the guide for context
let me = null;

async function api(path, body) {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

const errorText = (data) => (data.code ? t("err_" + data.code) : data.error) || t("err_generic");

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
  const { ok, data } = await api(signupMode ? "/api/signup" : "/api/login", {
    email: $("email").value, password: $("password").value,
  });
  if (!ok) return ($("auth-error").textContent = errorText(data));
  showMain(data);
};

$("logout").onclick = async () => { await api("/api/logout", {}); signupMode = false; showAuth(); };

// ---------- main ----------
function renderPlan() {
  if (!me) return;
  $("plan").innerHTML = "";
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
api("/api/me").then(({ ok, data }) => (ok ? showMain(data) : showAuth()));
