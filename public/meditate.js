// Meditate tab + guided meditation player. Uses t(), LANG, api(), $() from i18n.js / app.js,
// and AtmaSound from music.js.

let MED = null; // { meditations, tags }
let medFilter = "all";

// Real audio files (public/audio/manifest.json): music tracks and recorded guided meditations.
let AUDIO = null;
async function loadAudioManifest() {
  if (AUDIO) return AUDIO;
  try { AUDIO = await (await fetch("/audio/manifest.json")).json(); } catch { AUDIO = { music: [], guided: {} }; }
  AUDIO.music ??= [];
  AUDIO.guided ??= {};
  return AUDIO;
}
const recordingFor = (m) => AUDIO?.guided?.[m.id]?.[LANG] ?? null;

async function loadMeditations() {
  await loadAudioManifest();
  if (MED) return MED;
  const res = await fetch("/api/meditations");
  MED = await res.json();
  return MED;
}

const medName = (m) => (LANG === "te" ? m.name_te : m.name);
const medSource = (m) => (LANG === "te" ? m.source_te : m.source);
const tagLabel = (tag) => (MED?.tags[tag] ? MED.tags[tag][LANG === "te" ? 1 : 0] : tag);

/** A small card with name, source, tags and a Start button. */
function meditationCard(m) {
  const card = document.createElement("div");
  card.className = "med-card";
  const head = document.createElement("div");
  head.className = "med-name";
  head.textContent = `🧘 ${medName(m)}`;
  const src = document.createElement("div");
  src.className = "med-src";
  src.textContent = `${medSource(m)} · ${m.minutes} ${t("min")}`;
  const tags = document.createElement("div");
  tags.className = "med-tags";
  m.goodFor.forEach((g) => {
    const s = document.createElement("span");
    s.textContent = tagLabel(g);
    tags.appendChild(s);
  });
  const go = document.createElement("button");
  go.type = "button";
  go.className = "btn med-start";
  go.textContent = t("med_start");
  go.onclick = () => openPlayer(m);
  card.append(head, src, tags, go);
  return card;
}

async function loadMeditate() {
  await loadMeditations();
  renderMeditate();
}

function renderMeditate() {
  if (!MED) return;
  const chips = $("med-filters");
  chips.innerHTML = "";
  ["all", ...Object.keys(MED.tags)].forEach((tag) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = tag === "all" ? t("med_all") : tagLabel(tag);
    b.classList.toggle("chosen", medFilter === tag);
    b.onclick = () => { medFilter = tag; renderMeditate(); };
    chips.appendChild(b);
  });
  const list = $("med-list");
  list.innerHTML = "";
  MED.meditations
    .filter((m) => medFilter === "all" || m.goodFor.includes(medFilter))
    .forEach((m) => list.appendChild(meditationCard(m)));
}

// ---------------- Player ----------------
// A suitable default sound for each meditation (the user's own choice is remembered).
const DEFAULT_SOUND = {
  anapanasati: "bowls", "body-scan": "ocean", metta: "om", walking: "none", "om-chanting": "none", "so-ham": "tanpura",
  "japa-meditation": "tanpura", trataka: "none", bhramari: "none", "nadi-shodhana": "bowls", "yoga-nidra": "ocean",
  hridaya: "om", "who-am-i": "none", choiceless: "rain", "self-remembering-sit": "none", nadabrahma: "none",
  witnessing: "rain", "inner-body": "bowls", countdown: "ocean", "feeling-it-done": "rain", hooponopono: "om",
  "box-breathing": "bowls", "breath-478": "ocean",
};
// Meditations that should start with a real music track (by track id in manifest.json), when it exists.
const TRACK_DEFAULT = { "yoga-nidra": "sleep", "breath-478": "sleep", "body-scan": "sleep", "feeling-it-done": "sleep" };
function defaultSound(m) {
  const track = (AUDIO?.music ?? []).find((tr) => tr.id === TRACK_DEFAULT[m.id]);
  return track ? `file:/audio/${track.file}` : DEFAULT_SOUND[m.id] || "bowls";
}
const savedSound = (id) => { try { return localStorage.getItem(`medsound:${id}`); } catch { return null; } };
const saveSound = (id, name) => { try { localStorage.setItem(`medsound:${id}`, name); } catch {} };
const savedVoice = () => { try { return localStorage.getItem("medvoice") === "on"; } catch { return false; } };
const saveVoice = (on) => { try { localStorage.setItem("medvoice", on ? "on" : "off"); } catch {} };

const player = { m: null, minutes: 5, music: "none", voice: false, timer: null, elapsed: 0, running: false, schedule: [], stepIdx: -1, phase: null };

function playerEl() {
  let el = document.getElementById("med-player");
  if (el) return el;
  el = document.createElement("div");
  el.id = "med-player";
  el.className = "med-player hidden";
  el.innerHTML = `
    <button class="med-close" type="button" aria-label="Close">✕</button>
    <div class="med-setup">
      <h2 class="mp-title"></h2>
      <div class="mp-src"></div>
      <p class="mp-caution hidden"></p>
      <div class="mp-label mp-l-len"></div>
      <div class="mp-chips mp-lengths"></div>
      <div class="mp-label mp-l-music"></div>
      <div class="mp-chips mp-music"></div>
      <label class="mp-rec hidden"><input type="checkbox" checked> <span></span></label>
      <label class="mp-voice"><input type="checkbox"> <span></span></label>
      <p class="mp-voice-note"></p>
      <button class="btn mp-go" type="button" style="width:100%"></button>
    </div>
    <div class="med-run hidden">
      <div class="mp-remaining"></div>
      <div class="breath-wrap"><div class="breath-circle"></div><div class="breath-label"></div></div>
      <p class="mp-cue"></p>
      <p class="mp-credit"></p>
      <div class="mp-controls">
        <button class="btn ghost mp-pause" type="button"></button>
        <button class="btn ghost mp-end" type="button"></button>
      </div>
    </div>
    <div class="med-done hidden">
      <div style="font-size:48px">🙏</div>
      <h2 class="mp-done-title"></h2>
      <p class="mp-done-sub"></p>
      <div class="mood-row"></div>
      <button class="btn mp-finish" type="button" style="width:100%"></button>
    </div>`;
  document.body.appendChild(el);
  el.querySelector(".med-close").onclick = closePlayer;
  el.querySelector(".mp-go").onclick = startSession;
  el.querySelector(".mp-pause").onclick = togglePause;
  el.querySelector(".mp-end").onclick = () => finishSession(true);
  el.querySelector(".mp-finish").onclick = closePlayer;
  return el;
}

function show(part) {
  const el = playerEl();
  ["med-setup", "med-run", "med-done"].forEach((c) => el.querySelector("." + c).classList.toggle("hidden", c !== part));
}

function openPlayer(m, minutes) {
  const el = playerEl();
  player.m = m;
  player.minutes = minutes ?? m.minutes;
  player.music = savedSound(m.id) || defaultSound(m);
  el.querySelector(".mp-voice input").checked = savedVoice();
  el.querySelector(".mp-voice-note").textContent = t("med_voice_note");
  el.querySelector(".mp-title").textContent = medName(m);
  el.querySelector(".mp-src").textContent = medSource(m);
  const caution = LANG === "te" ? m.caution_te : m.caution;
  el.querySelector(".mp-caution").classList.toggle("hidden", !caution);
  el.querySelector(".mp-caution").textContent = caution ? `⚠️ ${caution}` : "";
  el.querySelector(".mp-l-len").textContent = t("med_length");
  el.querySelector(".mp-l-music").textContent = t("med_music");
  el.querySelector(".mp-voice span").textContent = t("med_voice");
  el.querySelector(".mp-go").textContent = t("med_begin");

  const lens = el.querySelector(".mp-lengths");
  lens.innerHTML = "";
  [2, 5, 10, 20].forEach((n) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${n} ${t("min")}`;
    b.classList.toggle("chosen", n === player.minutes);
    b.onclick = () => { player.minutes = n; lens.querySelectorAll("button").forEach((x) => x.classList.toggle("chosen", x === b)); };
    lens.appendChild(b);
  });
  const mus = el.querySelector(".mp-music");
  mus.innerHTML = "";
  const tracks = (AUDIO?.music ?? []).map((tr) => ({ name: `file:/audio/${tr.file}`, label: `🎵 ${LANG === "te" && tr.name_te ? tr.name_te : tr.name}` }));
  [...tracks, ...AtmaSound.names.map((name) => ({ name, label: t(`music_${name}`) }))].forEach(({ name, label }) => {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.classList.toggle("chosen", name === player.music);
    b.onclick = () => {
      player.music = name;
      saveSound(m.id, name);
      mus.querySelectorAll("button").forEach((x) => x.classList.toggle("chosen", x === b));
      AtmaSound.play(name); // preview
      setTimeout(() => { if (!player.running) AtmaSound.stop(); }, 4000);
    };
    mus.appendChild(b);
  });
  // Recorded guidance, when a recording exists for this meditation in this language
  const rec = recordingFor(m);
  el.querySelector(".mp-rec").classList.toggle("hidden", !rec);
  el.querySelector(".mp-rec span").textContent = t("med_recorded");
  el.querySelector(".mp-rec input").checked = Boolean(rec);
  show("med-setup");
  el.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function closePlayer() {
  clearInterval(player.timer);
  player.running = false;
  AtmaSound.stop();
  AtmaSound.stopVoice();
  speechSynthesis?.cancel?.();
  playerEl().classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

// Share the session between steps by weight; the closing step gets at most 30 seconds.
function buildSchedule(m, totalSec) {
  const steps = m.steps;
  const last = steps.at(-1);
  const closing = Math.min(30, Math.max(10, totalSec * 0.12));
  const rest = totalSec - closing;
  const wsum = steps.slice(0, -1).reduce((a, s) => a + s.w, 0);
  let t0 = 0;
  const sched = steps.slice(0, -1).map((s) => { const start = t0; t0 += (rest * s.w) / wsum; return { start, step: s }; });
  sched.push({ start: rest, step: last });
  return sched;
}

function speak(text) {
  if (!player.voice || !("speechSynthesis" in window)) return;
  const lang = LANG === "te" ? "te" : "en";
  const voice = speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith(lang));
  if (lang === "te" && !voice) return; // no Telugu voice on this phone: text only
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang === "te" ? "te-IN" : "en-IN";
  if (voice) u.voice = voice;
  u.rate = 0.78;
  u.pitch = 0.95;
  u.volume = 0.9;
  u.onstart = () => AtmaSound.duck(true);
  u.onend = u.onerror = () => AtmaSound.duck(false);
  speechSynthesis.speak(u);
}

async function startSession() {
  const el = playerEl();
  // Make sure real audio files are fully downloaded first, so playback never stops halfway.
  const files = [];
  if (player.music?.startsWith("file:")) files.push(player.music.slice(5));
  const recFile = recordingFor(player.m);
  if (recFile && el.querySelector(".mp-rec input").checked) files.push(`/audio/${recFile.file}`);
  if (files.length) {
    const go = el.querySelector(".mp-go");
    go.disabled = true;
    go.textContent = t("med_loading");
    await Promise.all(files.map((f) => AtmaSound.preload(f)));
    go.disabled = false;
    go.textContent = t("med_begin");
  }
  player.voice = el.querySelector(".mp-voice input").checked;
  saveVoice(player.voice);
  const rec = recordingFor(player.m);
  player.recorded = Boolean(rec) && el.querySelector(".mp-rec input").checked;
  if (player.recorded) player.voice = false; // the recording replaces the phone voice
  player.schedule = buildSchedule(player.m, player.minutes * 60);
  player.elapsed = 0;
  player.stepIdx = -1;
  player.phase = null;
  player.running = true;
  el.querySelector(".mp-pause").textContent = t("med_pause");
  el.querySelector(".mp-end").textContent = t("med_end");
  const circle = el.querySelector(".breath-circle");
  circle.className = "breath-circle" + (player.m.breath ? "" : " pulse");
  el.querySelector(".breath-label").textContent = "";
  show("med-run");
  AtmaSound.play(player.music);
  AtmaSound.bell(0.22);
  const musicTrack = (AUDIO?.music ?? []).find((tr) => player.music === `file:/audio/${tr.file}`);
  el.querySelector(".mp-credit").textContent = [musicTrack?.credit && `${t("med_music")}: ${musicTrack.credit}`, player.recorded && rec.credit].filter(Boolean).join(" · ");
  if (player.recorded) {
    // The recording sets the length; the session ends a few seconds after it finishes.
    setTimeout(() => AtmaSound.playVoice(`/audio/${rec.file}`, {
      onDuration: (d) => { if (isFinite(d)) { player.minutes = (d + 8) / 60; player.schedule = buildSchedule(player.m, player.minutes * 60); } },
      onEnded: () => { player.elapsed = Math.max(player.elapsed, player.minutes * 60 - 6); },
    }), 2500);
  }
  let last = performance.now();
  clearInterval(player.timer);
  player.timer = setInterval(() => {
    const now = performance.now();
    if (player.running) player.elapsed += (now - last) / 1000;
    last = now;
    tick();
  }, 200);
  tick();
}

function tick() {
  const el = playerEl();
  const total = player.minutes * 60;
  const remaining = Math.max(0, total - player.elapsed);
  el.querySelector(".mp-remaining").textContent = `${Math.floor(remaining / 60)}:${String(Math.floor(remaining % 60)).padStart(2, "0")}`;

  // Step changes
  let idx = 0;
  player.schedule.forEach((s, i) => { if (player.elapsed >= s.start) idx = i; });
  if (idx !== player.stepIdx) {
    if (player.stepIdx >= 0) AtmaSound.bell(0.1);
    player.stepIdx = idx;
    const text = LANG === "te" ? player.schedule[idx].step.te : player.schedule[idx].step.en;
    const cue = el.querySelector(".mp-cue");
    cue.classList.remove("fade-in");
    void cue.offsetWidth;
    cue.textContent = text;
    cue.classList.add("fade-in");
    speak(text);
  }

  // Breathing circle
  const b = player.m.breath;
  if (b) {
    const phases = [["in", b.in], ["hold", b.hold], ["out", b.out], ["hold2", b.hold2]].filter(([, s]) => s > 0);
    const cycle = phases.reduce((a, [, s]) => a + s, 0);
    let pos = player.elapsed % cycle;
    let phase = phases[0];
    let left = 0;
    for (const p of phases) { if (pos < p[1]) { phase = p; left = p[1] - pos; break; } pos -= p[1]; }
    const label = el.querySelector(".breath-label");
    const name = phase[0] === "out" && b.outLabel ? b.outLabel : phase[0];
    label.textContent = `${t("breath_" + name)} ${Math.ceil(left)}`;
    if (player.phase !== phase[0]) {
      player.phase = phase[0];
      const circle = el.querySelector(".breath-circle");
      circle.style.transition = `transform ${phase[1]}s ease-in-out`;
      if (phase[0] === "in") circle.style.transform = "scale(1)";
      if (phase[0] === "out") circle.style.transform = "scale(0.55)";
    }
  }

  if (player.elapsed >= total) finishSession(false);
}

function togglePause() {
  const el = playerEl();
  player.running = !player.running;
  el.querySelector(".mp-pause").textContent = player.running ? t("med_pause") : t("med_resume");
  el.querySelector(".breath-circle").style.animationPlayState = player.running ? "running" : "paused";
  if (player.running) { AtmaSound.resume(); speechSynthesis?.resume?.(); } else { AtmaSound.pause(); speechSynthesis?.pause?.(); }
}

async function finishSession(early) {
  clearInterval(player.timer);
  player.running = false;
  AtmaSound.stopVoice();
  AtmaSound.resume();
  AtmaSound.stop();
  speechSynthesis?.cancel?.();
  const minutes = Math.round(player.elapsed / 60);
  const counts = !early || player.elapsed >= Math.min(60, player.minutes * 30);
  if (early && !counts) return closePlayer();
  AtmaSound.bell(0.22);
  setTimeout(() => AtmaSound.bell(0.16), 2500);
  const el = playerEl();
  el.querySelector(".mp-done-title").textContent = t("med_done_title");
  el.querySelector(".mp-done-sub").textContent = t("med_done_sub");
  el.querySelector(".mp-finish").textContent = t("med_close");
  const row = el.querySelector(".mood-row");
  row.innerHTML = "";
  ["😞", "😕", "😐", "🙂", "😊"].forEach((emoji, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = emoji;
    btn.onclick = async () => {
      row.querySelectorAll("button").forEach((x) => x.classList.toggle("chosen", x === btn));
      await api("/api/today", { action: "mood", value: i + 1 });
      el.querySelector(".mp-done-sub").textContent = t("thanks_feedback");
    };
    row.appendChild(btn);
  });
  show("med-done");
  await api("/api/today", { action: "meditate", id: player.m.id, minutes: Math.max(1, minutes || player.minutes) });
  if (typeof loadToday === "function" && todayData) loadToday(); // refresh streak
}

onLangChange.push(() => { if (currentTab === "meditate") renderMeditate(); });
