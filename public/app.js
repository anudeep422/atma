const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
let signupMode = params.has("signup");
let history = []; // recent turns sent to the guide for context

async function api(path, body) {
  const res = await fetch(path, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ---------- auth ----------
function showAuth() {
  $("auth").classList.remove("hidden");
  $("main").classList.add("hidden");
  $("logout").classList.add("hidden");
  $("auth-title").textContent = signupMode ? "Create your account" : "Welcome back";
  $("auth-toggle").textContent = signupMode ? "I already have an account" : "New here? Create an account";
}

$("auth-toggle").onclick = () => { signupMode = !signupMode; showAuth(); };

$("auth-form").onsubmit = async (e) => {
  e.preventDefault();
  $("auth-error").textContent = "";
  const { ok, data } = await api(signupMode ? "/api/signup" : "/api/login", {
    email: $("email").value, password: $("password").value,
  });
  if (!ok) return ($("auth-error").textContent = data.error || "Something went wrong.");
  showMain(data);
};

$("logout").onclick = async () => { await api("/api/logout", {}); signupMode = false; showAuth(); };

// ---------- main ----------
function renderPlan(me) {
  $("plan").innerHTML = "";
  if (me.premium) {
    const b = document.createElement("span");
    b.className = "badge"; b.textContent = "Seeker";
    $("plan").append(b, " Unlimited questions");
  } else {
    $("plan").textContent = `${me.remainingToday} of ${me.freePerDay} free questions left today`;
  }
  $("upgrade").classList.toggle("hidden", me.premium);
  $("manage").classList.toggle("hidden", !me.premium);
  const outOfQuestions = !me.premium && me.remainingToday === 0;
  $("upsell").classList.toggle("hidden", !outOfQuestions);
  $("ask").classList.toggle("hidden", outOfQuestions);
}

function showMain(me) {
  $("auth").classList.add("hidden");
  $("main").classList.remove("hidden");
  $("logout").classList.remove("hidden");
  renderPlan(me);
  const upgraded = params.get("upgraded");
  if (upgraded) {
    $("notice").classList.remove("hidden");
    $("notice").textContent = upgraded === "demo"
      ? "Demo mode: you were upgraded without payment. Add Stripe keys to take real payments."
      : "Thank you for becoming a Seeker. Unlimited guidance is now yours. 🙏";
  }
}

function verseEl(v) {
  const box = document.createElement("div");
  box.className = "verse";
  for (const [cls, text] of [["ref", v.ref], ["sa", v.sanskrit], ["en", v.english]]) {
    const el = document.createElement(cls === "ref" ? "div" : "p");
    el.className = cls; el.textContent = text; box.appendChild(el);
  }
  return box;
}

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
  const waiting = addMessage("thinking", "Reflecting on the Upanishads…");

  const { ok, status, data } = await api("/api/ask", { question, history });
  waiting.remove();
  $("send").disabled = false;

  if (status === 401) return showAuth();
  if (status === 402) {
    $("upsell").classList.remove("hidden");
    $("ask").classList.add("hidden");
    return;
  }
  if (!ok) return addMessage("guide", data.error || "Something went wrong. Please try again.");

  addMessage("guide", data.answer, data.verses);
  history.push({ role: "user", content: question }, { role: "assistant", content: data.answer });
  history = history.slice(-6);
  renderPlan(data.me);
};

document.querySelectorAll("#suggestions button").forEach((b) => {
  b.onclick = () => { $("question").value = b.textContent; $("question").focus(); };
});

async function goToCheckout() {
  const { ok, data } = await api("/api/checkout", {});
  if (ok && data.url) location.href = data.url;
  else alert(data.error || "Could not start checkout.");
}
$("upgrade").onclick = goToCheckout;
document.querySelector("[data-upgrade]").onclick = goToCheckout;
$("manage").onclick = async () => {
  const { ok, data } = await api("/api/billing-portal", {});
  if (ok && data.url) location.href = data.url;
  else alert(data.error || "Could not open billing.");
};

// ---------- start ----------
api("/api/me").then(({ ok, data }) => (ok ? showMain(data) : showAuth()));
