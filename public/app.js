// Uses t(), LANG, verseEl() and onLangChange from i18n.js.
const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let signupMode = params.has("signup");
let history = []; // recent turns sent to the guide for context
let me = null;

async function api(path, body, method) {
  const token = await AtmaAuth.token();
  const res = await fetch(path, {
    method: method ?? (body === undefined ? "GET" : "POST"),
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
  ["tabs", "coach", "journal"].forEach((id) => $(id).classList.add("hidden"));
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
  $("tabs").classList.remove("hidden");
  showTab(currentTab);
  $("stats-link").classList.toggle("hidden", !user.admin);
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
  if (!ok) {
    const el = addMessage("guide", errorText(data));
    if (data.detail && params.has("debug")) { // open the app with ?debug=1 to see the reason
      const d = document.createElement("p");
      d.className = "detail";
      d.textContent = `Reason: ${data.detail}`;
      el.appendChild(d);
    }
    return;
  }

  const answerEl = addMessage("guide", data.answer, data.verses);
  if (data.entryId) answerEl.appendChild(feedbackRow(data.entryId));
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

// 👍 / 👎 under each answer
function feedbackRow(entryId) {
  const row = document.createElement("div");
  row.className = "feedback";
  const label = document.createElement("span");
  label.textContent = t("helpful_q");
  row.appendChild(label);
  for (const [rating, emoji] of [["up", "👍"], ["down", "👎"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = emoji;
    b.setAttribute("aria-label", rating === "up" ? "Helpful" : "Not helpful");
    b.onclick = async () => {
      row.querySelectorAll("button").forEach((x) => (x.disabled = true));
      const { ok } = await api("/api/feedback", { entryId, rating });
      if (ok) label.textContent = t("thanks_feedback");
      row.querySelectorAll("button").forEach((x) => { x.disabled = false; x.classList.toggle("chosen", x === b); });
    };
    row.appendChild(b);
  }
  return row;
}

// ---------- journal ----------
function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString(LANG === "te" ? "te-IN" : "en-IN", { dateStyle: "medium", timeStyle: "short" });
}

async function openJournal() {
  $("main").classList.add("hidden");
  $("journal").classList.remove("hidden");
  const list = $("journal-list");
  list.innerHTML = "";
  const loading = document.createElement("p");
  loading.className = "thinking";
  loading.textContent = t("loading");
  list.appendChild(loading);

  const { ok, data } = await api("/api/journal");
  list.innerHTML = "";
  if (!ok) { list.textContent = errorText(data); return; }
  $("journal-empty").classList.toggle("hidden", data.length > 0);

  for (const e of data) {
    const item = document.createElement("details");
    item.className = "msg guide journal-item";
    const summary = document.createElement("summary");
    const date = document.createElement("span");
    date.className = "jdate";
    date.textContent = formatDate(e.createdAt);
    const q = document.createElement("span");
    q.className = "jq";
    q.textContent = e.question;
    summary.append(date, q);
    item.appendChild(summary);
    e.verses.forEach((v) => item.appendChild(verseEl(v)));
    const p = document.createElement("p");
    p.textContent = e.answer;
    item.appendChild(p);
    const del = document.createElement("button");
    del.className = "link";
    del.textContent = t("delete");
    del.onclick = async () => {
      if (!confirm(t("confirm_delete"))) return;
      const r = await api(`/api/journal/${encodeURIComponent(e.id)}`, undefined, "DELETE");
      if (r.ok) item.remove();
      if (!list.children.length) $("journal-empty").classList.remove("hidden");
    };
    item.appendChild(del);
    list.appendChild(item);
  }
}

// ---------- tabs ----------
let currentTab = "main";
function showTab(name) {
  currentTab = name;
  for (const id of ["main", "coach", "journal"]) $(id).classList.toggle("hidden", id !== name);
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  if (name === "journal") openJournal();
  if (name === "coach") loadCoach();
}
document.querySelectorAll("#tabs button").forEach((b) => (b.onclick = () => showTab(b.dataset.tab)));

// ---------- coach ----------
let coachState = null;
let chosenArea = null;

function practiceEl(p) {
  const te = LANG === "te";
  const box = document.createElement("div");
  box.className = "practice";
  const head = document.createElement("div");
  head.className = "practice-head";
  head.textContent = `🧘 ${te ? p.name_te : p.name} · ${p.minutes} ${t("min")}`;
  const src = document.createElement("div");
  src.className = "practice-src";
  src.textContent = te ? p.source_te : p.source;
  const steps = document.createElement("p");
  steps.textContent = te ? p.steps_te : p.steps;
  box.append(head, src, steps);
  return box;
}

async function loadCoach() {
  $("coach-loading").classList.remove("hidden");
  $("coach-start").classList.add("hidden");
  $("coach-plan").classList.add("hidden");
  const { ok, data } = await api("/api/coach");
  $("coach-loading").classList.add("hidden");
  if (!ok) return;
  coachState = data;
  renderCoach();
}

function renderCoach() {
  const st = coachState;
  if (!st?.program) {
    $("coach-start").classList.remove("hidden");
    $("coach-plan").classList.add("hidden");
    return;
  }
  const pg = st.program;
  $("coach-start").classList.add("hidden");
  $("coach-plan").classList.remove("hidden");
  $("plan-title").textContent = pg.title;
  $("plan-day").textContent = st.completed ? t("completed") : t("day_of", { n: st.day, m: pg.days.length });
  $("plan-sankalpa").textContent = pg.sankalpa;
  $("plan-why").textContent = pg.why;

  // Progress dots: ✓ done, · not done, ○ upcoming
  const dots = $("plan-dots");
  dots.innerHTML = "";
  pg.days.forEach((_, i) => {
    const c = pg.checkins[i];
    const d = document.createElement("span");
    d.className = "dot " + (c ? (c.done ? "done" : "missed") : i + 1 === st.day && !st.completed ? "today" : "");
    d.textContent = c ? (c.done ? "✓" : "–") : i + 1;
    dots.appendChild(d);
  });

  const vbox = $("plan-verses");
  vbox.innerHTML = "";
  pg.verses.forEach((v) => vbox.appendChild(verseEl(v)));

  // Today's action (or the last day's, once complete)
  const idx = Math.min(st.day, pg.days.length) - 1;
  const today = pg.days[idx];
  $("today-box").classList.toggle("hidden", st.completed);
  $("today-label").textContent = t("today_action", { n: st.day });
  $("today-action").textContent = today.action;
  const tp = $("today-practice");
  tp.innerHTML = "";
  const practice = today.practice ?? pg.practices[idx % Math.max(pg.practices.length, 1)];
  if (practice) tp.appendChild(practiceEl(practice));
  $("checkin-box").classList.toggle("hidden", st.checkedInToday);
  $("checkin-wait").classList.toggle("hidden", !st.checkedInToday);

  // Latest coach reply
  const last = pg.checkins.at(-1);
  const reply = $("coach-reply");
  reply.classList.toggle("hidden", !last);
  if (last) {
    reply.innerHTML = "";
    const label = document.createElement("div");
    label.className = "lbl";
    label.textContent = t("coach_says");
    const p = document.createElement("p");
    p.textContent = last.reply;
    reply.append(label, p);
  }
  $("plan-complete").classList.toggle("hidden", !st.completed);

  const hist = $("plan-history");
  hist.innerHTML = "";
  pg.checkins.forEach((c) => {
    const item = document.createElement("div");
    item.className = "hist-item";
    const h = document.createElement("b");
    h.textContent = `${t("day")} ${c.day}: ${c.done ? "✅" : "–"} ${c.note ? "· " + c.note : ""}`;
    const p = document.createElement("p");
    p.textContent = c.reply;
    item.append(h, p);
    hist.appendChild(item);
  });
  if (!pg.checkins.length) hist.textContent = t("no_checkins");
}

document.querySelectorAll("#area-chips button").forEach((b) => {
  b.onclick = () => {
    chosenArea = b.dataset.area;
    document.querySelectorAll("#area-chips button").forEach((x) => x.classList.toggle("chosen", x === b));
    $("wealth-note").classList.toggle("hidden", chosenArea !== "wealth");
  };
});

$("coach-form").onsubmit = async (e) => {
  e.preventDefault();
  $("coach-error").textContent = "";
  if (!chosenArea) { $("coach-error").textContent = t("err_coach_need_area"); return; }
  const btn = $("coach-create");
  btn.disabled = true;
  btn.textContent = t("creating_plan");
  const { ok, data } = await api("/api/coach/start", { area: chosenArea, goal: $("coach-goal").value, lang: LANG });
  btn.disabled = false;
  btn.textContent = t("create_plan");
  if (!ok) { $("coach-error").textContent = errorText(data); return; }
  $("coach-goal").value = "";
  coachState = data;
  renderCoach();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

async function checkin(done) {
  $("checkin-error").textContent = "";
  ["checkin-done", "checkin-skip"].forEach((id) => ($(id).disabled = true));
  $("checkin-wait").classList.add("hidden");
  const { ok, data } = await api("/api/coach/checkin", { done, note: $("checkin-note").value, lang: LANG });
  ["checkin-done", "checkin-skip"].forEach((id) => ($(id).disabled = false));
  if (!ok) { $("checkin-error").textContent = errorText(data); return; }
  $("checkin-note").value = "";
  coachState = data;
  renderCoach();
  $("coach-reply").scrollIntoView({ behavior: "smooth", block: "center" });
}
$("checkin-done").onclick = () => checkin(true);
$("checkin-skip").onclick = () => checkin(false);

async function stopPlan() {
  await api("/api/coach/stop", {});
  coachState = { program: null };
  renderCoach();
}
$("coach-stop").onclick = () => { if (confirm(t("confirm_end_plan"))) stopPlan(); };
$("coach-new").onclick = stopPlan;

onLangChange.push(() => { if (currentTab === "coach" && coachState) renderCoach(); });

// ---------- start ----------
AtmaAuth.init(onSignInChange);
