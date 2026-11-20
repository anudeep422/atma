// "Share" (WhatsApp image card) and "Listen" (read aloud) for verse cards.
// Uses t() and LANG from i18n.js.

const CARD_W = 1080;
const CARD_H = 1350;

function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  for (const para of String(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

// Draws text blocks, shrinking the font until everything fits the available height.
function fitBlock(ctx, text, font, startSize, minSize, maxWidth, maxHeight, lineHeight) {
  for (let size = startSize; size >= minSize; size -= 2) {
    ctx.font = font(size);
    const lines = wrapLines(ctx, text, maxWidth);
    if (lines.length * size * lineHeight <= maxHeight) return { lines, size };
  }
  ctx.font = font(minSize);
  return { lines: wrapLines(ctx, text, maxWidth), size: minSize };
}

async function renderVerseCard(v) {
  const te = LANG === "te";
  const ref = te ? v.ref_te : v.ref;
  const sanskrit = te ? v.sanskrit_te : v.sanskrit;
  const meaning = te ? v.english_te : v.english;

  const serif = te ? '"Noto Serif Telugu", serif' : '"Cormorant Garamond", "Noto Serif Telugu", serif';
  const sans = '"Inter", "Noto Sans Telugu", sans-serif';
  await Promise.all([
    document.fonts.load(`600 60px ${serif}`, meaning),
    document.fonts.load(`500 40px ${serif}`, sanskrit),
    document.fonts.load(`600 30px ${sans}`, ref),
  ]).catch(() => {});

  const c = document.createElement("canvas");
  c.width = CARD_W;
  c.height = CARD_H;
  const ctx = c.getContext("2d");

  // Background: warm cream to soft saffron, with a thin border.
  const bg = ctx.createLinearGradient(0, 0, 0, CARD_H);
  bg.addColorStop(0, "#fdf8ef");
  bg.addColorStop(1, "#fbe3c4");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = "#d9771f";
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, CARD_W - 80, CARD_H - 80);

  const x = 110;
  const maxW = CARD_W - 2 * x;
  ctx.textBaseline = "top";

  // Om symbol + brand
  ctx.fillStyle = "#d9771f";
  ctx.font = `600 64px ${serif}`;
  ctx.textAlign = "center";
  ctx.fillText("ॐ", CARD_W / 2, 100);
  ctx.textAlign = "left";

  // Measure first, then center the text block between the Om and the footer.
  const top = 210;
  const footerTop = CARD_H - 230;
  const sa = fitBlock(ctx, sanskrit, (s) => `${te ? "" : "italic "}500 ${s}px ${serif}`, 42, 28, maxW, 300, 1.5);
  const saH = sa.lines.length * sa.size * 1.5;
  const fixedH = 70 + saH + 40 + 50; // reference, Sanskrit, gap, divider
  const me = fitBlock(ctx, meaning, (s) => `600 ${s}px ${serif}`, te ? 56 : 64, 30, maxW, footerTop - 20 - top - fixedH, 1.45);
  const totalH = fixedH + me.lines.length * me.size * 1.45;
  let y = top + Math.max(0, (footerTop - 20 - top - totalH) / 2);

  // Reference
  ctx.fillStyle = "#b35d10";
  ctx.font = `600 32px ${sans}`;
  ctx.fillText(ref.toUpperCase(), x, y);
  y += 70;

  // Sanskrit
  ctx.font = `${te ? "" : "italic "}500 ${sa.size}px ${serif}`;
  ctx.fillStyle = "#7a6a5a";
  for (const line of sa.lines) { ctx.fillText(line, x, y); y += sa.size * 1.5; }
  y += 40;

  // Divider
  ctx.fillStyle = "#d9771f";
  ctx.fillRect(x, y, 90, 5);
  y += 50;

  // Meaning (the main text)
  ctx.font = `600 ${me.size}px ${serif}`;
  ctx.fillStyle = "#2b2118";
  for (const line of me.lines) { ctx.fillText(line, x, y); y += me.size * 1.45; }

  // Footer: call to action + link
  ctx.textAlign = "center";
  ctx.fillStyle = "#2b2118";
  ctx.font = `600 34px ${sans}`;
  ctx.fillText(t("card_cta"), CARD_W / 2, footerTop + 40);
  ctx.fillStyle = "#b35d10";
  ctx.font = `600 34px ${sans}`;
  ctx.fillText(location.host, CARD_W / 2, footerTop + 95);

  return new Promise((resolve) => c.toBlob(resolve, "image/png"));
}

async function shareVerse(v, button) {
  const label = button?.textContent;
  if (button) { button.disabled = true; button.textContent = "…"; }
  try {
    const blob = await renderVerseCard(v);
    const file = new File([blob], "atma-verse.png", { type: "image/png" });
    const te = LANG === "te";
    const text = `${te ? v.english_te : v.english}\n— ${te ? v.ref_te : v.ref}\n\n${t("card_cta")}: ${location.origin}`;
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text }).then(() => track("share")).catch(() => {}); // user may cancel
    } else {
      track("share");
      // Computers: download the image instead.
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "atma-verse.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }
  } finally {
    if (button) { button.disabled = false; button.textContent = label; }
  }
}

// ---- Listen (read aloud with the phone's/computer's built-in voice) ----
let speakingButton = null;

function pickVoice(lang) {
  const voices = speechSynthesis.getVoices();
  return voices.find((vo) => vo.lang?.toLowerCase().startsWith(lang)) ?? null;
}

function speakVerse(v, button) {
  const te = LANG === "te";
  // Telugu: the Sanskrit (in Telugu script) then the meaning. English: reference and meaning.
  speakParts(te ? [v.sanskrit_te.replace(/[।॥|]/g, ". "), v.english_te] : [v.ref, v.english], button);
}

/** Reads any text aloud (e.g. an affirmation), optionally repeated. Language follows the text. */
function speakText(text, button, times = 1) {
  speakParts(Array(times).fill(text), button, /[\u0C00-\u0C7F]/.test(text) ? "te" : "en");
}

function speakParts(parts, button, lang = LANG) {
  if (!("speechSynthesis" in window)) return alert(t("no_voice"));
  if (speakingButton) { // second tap stops
    speechSynthesis.cancel();
    const was = speakingButton;
    speakingButton.textContent = speakingButton.dataset.label;
    speakingButton = null;
    if (was === button) return;
  }
  const te = lang === "te";
  const voice = pickVoice(te ? "te" : "en");
  if (te && !voice) return alert(t("no_te_voice"));
  button.dataset.label = button.textContent;
  parts.filter(Boolean).forEach((text, i, arr) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = te ? "te-IN" : "en-IN";
    if (voice) u.voice = voice;
    u.rate = 0.85;
    if (i === arr.length - 1) u.onend = u.onerror = () => {
      if (speakingButton === button) { button.textContent = button.dataset.label; speakingButton = null; }
    };
    speechSynthesis.speak(u);
  });
  speakingButton = button;
  button.textContent = t("stop");
  track("listen");
}

// Voices load asynchronously in some browsers.
if ("speechSynthesis" in window) speechSynthesis.getVoices();
