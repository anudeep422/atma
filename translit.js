// Converts Sanskrit in IAST (Roman letters with diacritics) to Telugu script.
// e.g. "tat tvam asi" -> "తత్ త్వమ్ అసి"

const VOWELS = { // [independent letter, vowel sign after a consonant]
  a: ["అ", ""], "ā": ["ఆ", "ా"], i: ["ఇ", "ి"], "ī": ["ఈ", "ీ"], u: ["ఉ", "ు"], "ū": ["ఊ", "ూ"],
  "ṛ": ["ఋ", "ృ"], "ṝ": ["ౠ", "ౄ"], e: ["ఏ", "ే"], ai: ["ఐ", "ై"], o: ["ఓ", "ో"], au: ["ఔ", "ౌ"],
};
const CONSONANTS = {
  k: "క", kh: "ఖ", g: "గ", gh: "ఘ", "ṅ": "ఙ", c: "చ", ch: "ఛ", j: "జ", jh: "ఝ", "ñ": "ఞ",
  "ṭ": "ట", "ṭh": "ఠ", "ḍ": "డ", "ḍh": "ఢ", "ṇ": "ణ", t: "త", th: "థ", d: "ద", dh: "ధ", n: "న",
  p: "ప", ph: "ఫ", b: "బ", bh: "భ", m: "మ", y: "య", r: "ర", l: "ల", v: "వ",
  "ś": "శ", "ṣ": "ష", s: "స", h: "హ", "ḷ": "ళ",
};
const OTHER = { "ṁ": "ం", "ṃ": "ం", "ḥ": "ః", "'": "ఽ", "||": "॥", "|": "।" };
const VIRAMA = "్";

const TOKENS = [...Object.keys(VOWELS), ...Object.keys(CONSONANTS), ...Object.keys(OTHER)]
  .sort((a, b) => b.length - a.length); // longest match first ("kh" before "k")

function tokenize(text) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    const tok = TOKENS.find((t) => text.startsWith(t, i));
    if (tok) { out.push(tok); i += tok.length; }
    else { out.push(text[i]); i += 1; }
  }
  return out;
}

export function iastToTelugu(iast) {
  // Compound words: IAST shows "karma-phala", Telugu script writes them joined (కర్మఫల).
  const tokens = tokenize(iast.normalize("NFC").toLowerCase().replace(/-/g, ""));
  let out = "";
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (CONSONANTS[t]) {
      out += CONSONANTS[t];
      const next = tokens[i + 1];
      if (VOWELS[next]) { out += VOWELS[next][1]; i++; } // consonant + vowel sign
      else out += VIRAMA;                                  // consonant cluster or word end
    } else if (VOWELS[t]) {
      out += VOWELS[t][0];
    } else {
      out += OTHER[t] ?? t;
    }
  }
  return out;
}
