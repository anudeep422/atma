import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import { VERSES, VERSE_BY_ID } from "./verses.js";

// Which AI answers questions:
//   ANTHROPIC_API_KEY -> Claude (paid, best quality); used alone when set
//   GEMINI_API_KEY    -> Google Gemini (free tier), tried first
//   GROQ_API_KEY      -> Groq (free tier), backup when Gemini is busy or fails
//   none              -> demo answers
const CLAUDE_MODEL = "claude-opus-5-5";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const claude = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
const gemini = !claude && process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const GROQ_MODELS = (process.env.GROQ_MODEL || "openai/gpt-oss-120b,openai/gpt-oss-20b").split(",").map((m) => m.trim());
// Optional: different Groq model(s) for Telugu answers, e.g. GROQ_MODEL_TE=<model id>.
const GROQ_MODELS_TE = process.env.GROQ_MODEL_TE ? process.env.GROQ_MODEL_TE.split(",").map((m) => m.trim()) : GROQ_MODELS;
const groq = !claude && process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY, maxRetries: 1 }) : null;

export const AI_PROVIDER = claude
  ? `Claude (${CLAUDE_MODEL})`
  : [gemini && `Gemini (${GEMINI_MODEL}, free tier)`, groq && `Groq (${GROQ_MODELS[0]}, free tier)`].filter(Boolean).join(" + backup ") || null;

/** Thrown when the AI is rate-limited (e.g. Gemini free-tier daily/minute limits). */
export class GuideBusyError extends Error {}

/** Short, safe description of an AI error (status + Google's/Anthropic's message), shown to help fix problems. */
export function describeAiError(err) {
  let msg = String(err?.message ?? err);
  try { msg = JSON.parse(msg)?.error?.message ?? msg; } catch {}
  return `${err?.status ?? ""} ${msg}`.trim().replace(/\s+/g, " ").slice(0, 300);
}

// Kept byte-identical between requests so prompt caching works.
const SYSTEM_PROMPT = `You are Atma, a warm and wise spiritual guide rooted in the Upanishads.
People come to you with real-life questions: stress, work, relationships, grief, purpose, fear, discipline.

How to answer:
- Speak like a kind teacher: calm, simple, practical. No jargon without explaining it.
- Pick the 1 or 2 verses from the VERSE LIBRARY below that best fit the person's situation and return their ids in "verse_ids". The app displays the verse text itself, so do NOT quote verses or invent any scripture in your answer; refer to the idea instead ("The Katha Upanishad compares the mind to reins...").
- In "answer", write 120–220 words: acknowledge their feeling, explain the teaching in plain words, connect it to their life, and end with one small practice they can do today (a reflection, a breathing pause, a journaling question).
- Never claim certainty about what any text "really" means; you offer one traditional reading.
- You are not a doctor, therapist, lawyer or financial adviser. For medical, legal or financial matters, gently suggest a qualified professional as well.
- If the person mentions wanting to harm themselves or others, or being in danger, respond with care first: encourage them to contact local emergency services or a crisis helpline right now (for example 988 in the US, Tele-MANAS 14416 in India, or findahelpline.com), and to reach out to someone they trust. Choose a gentle comforting verse.
- If the question has nothing to do with life, spirit or self-growth, kindly steer back to what you can help with.

VERSE LIBRARY (id | reference | themes | meaning):
${VERSES.map((v) => `${v.id} | ${v.ref} | ${v.theme} | ${v.english}`).join("\n")}`;

const OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    answer: { type: "string" },
    verse_ids: {
      type: "array",
      items: { type: "string", enum: VERSES.map((v) => v.id) },
    },
  },
  required: ["answer", "verse_ids"],
  additionalProperties: false,
};

const GEMINI_SCHEMA = {
  type: "object",
  properties: OUTPUT_SCHEMA.properties,
  required: OUTPUT_SCHEMA.required,
};

const LANGUAGE_NOTE = {
  te: "Write the \"answer\" in simple, warm, natural Telugu (Telugu script), the way a respected elder would speak. Keep well-known Sanskrit terms (ఆత్మ, బ్రహ్మం, ధర్మం) as Telugu speakers normally use them.",
  en: "Write the \"answer\" in English.",
};

/**
 * @param {string} question
 * @param {{role: "user"|"assistant", content: string}[]} history recent turns (plain text)
 * @param {"en"|"te"} lang language of the answer
 * @returns {Promise<{answer: string, verses: object[], demo?: boolean}>}
 */
export async function askGuide(question, history = [], lang = "en") {
  const note = `(App note: ${LANGUAGE_NOTE[lang] ?? LANGUAGE_NOTE.en})`;
  let raw;
  let provider;
  if (claude) { raw = await askClaude(question, history, note); provider = "claude"; }
  else if (gemini) {
    try {
      raw = await askGemini(question, history, note, lang);
      provider = "gemini";
    } catch (err) {
      if (!groq) throw err;
      console.warn("Gemini unavailable, using Groq backup");
      try {
        raw = await askGroq(question, history, note, lang);
        provider = "groq";
      } catch (groqErr) {
        const both = groqErr instanceof GuideBusyError ? groqErr : err;
        both.detail = `${err.detail ?? describeAiError(err)} || Groq: ${groqErr.detail ?? describeAiError(groqErr)}`;
        throw both;
      }
    }
  } else if (groq) { raw = await askGroq(question, history, note, lang); provider = "groq"; }
  else return { ...demoAnswer(question, lang), provider: "demo" };

  if (raw === null) return { ...declined(lang), provider };

  let parsed;
  try {
    const cleaned = raw.replace(/^```(?:json)?\s*|\s*```$/g, "");
    const firstBrace = cleaned.indexOf("{"), lastBrace = cleaned.lastIndexOf("}");
    parsed = JSON.parse(firstBrace >= 0 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned);
  } catch {
    throw new Error("Guide returned unparseable output");
  }
  const verses = [...new Set(parsed.verse_ids ?? [])]
    .map((id) => VERSE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 2);
  return { answer: String(parsed.answer ?? ""), verses, provider };
}

// Returns the JSON text, or null if the model declined.
async function askClaude(question, history, note) {
  const messages = [
    ...history.slice(-6),
    // Reply language goes in the turn (not the system prompt) so the cached system prompt stays identical.
    { role: "user", content: [{ type: "text", text: question }, { type: "text", text: note }] },
  ];
  try {
    const response = await claude.beta.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16000,
      // If a safety classifier declines, the API retries on a fallback model automatically.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "medium", format: { type: "json_schema", schema: OUTPUT_SCHEMA } },
      messages,
    });
    if (response.stop_reason === "refusal") return null;
    return response.content.find((b) => b.type === "text")?.text ?? "";
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) throw new GuideBusyError(err.message);
    throw err;
  }
}

// Gemini free tier: retries, a lighter backup model, and low "thinking" for speed and quota.
let geminiThinking = (process.env.GEMINI_THINKING || "LOW").toUpperCase(); // "LOW", "MINIMAL" or "OFF"
let backupModel; // found automatically: the newest "flash-lite" model available to this key

async function findBackupModel() {
  if (backupModel !== undefined) return backupModel;
  backupModel = process.env.GEMINI_FALLBACK_MODEL || null;
  if (backupModel) return backupModel;
  try {
    const names = [];
    for await (const m of await gemini.models.list()) names.push(String(m.name).replace(/^models\//, ""));
    backupModel = names
      .filter((n) => /flash-lite/.test(n) && !/preview|exp|tts|image|live|audio/.test(n) && n !== GEMINI_MODEL)
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0] ?? null;
  } catch (err) {
    console.warn("Gemini: could not list models:", err?.status, String(err?.message).slice(0, 200));
    backupModel = null;
  }
  console.log(`Gemini backup model: ${backupModel ?? "none"}`);
  return backupModel;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isBusy = (err) => err?.status === 429 || err?.status === 503 || err?.status === 500;

async function geminiCall(model, contents) {
  const config = {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: "application/json",
    responseJsonSchema: GEMINI_SCHEMA,
  };
  if (geminiThinking !== "OFF") config.thinkingConfig = { thinkingLevel: geminiThinking };
  try {
    return await gemini.models.generateContent({ model, contents, config });
  } catch (err) {
    // Some models don't accept a thinking level: stop sending it and try once more.
    if (err?.status === 400 && /think/i.test(String(err?.message)) && config.thinkingConfig) {
      console.warn(`Gemini: ${model} rejected thinkingLevel, continuing without it`);
      geminiThinking = "OFF";
      return geminiCall(model, contents);
    }
    throw err;
  }
}

async function askGemini(question, history, note, lang) {
  const contents = [
    ...history.slice(-6).map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
    { role: "user", parts: [{ text: question }, { text: note }] },
  ];
  // Plan: main model -> backup (lighter) model -> main model again after a short pause.
  // (With a Groq backup available, skip the slow third try and hand over to Groq sooner.)
  // Telugu always gets every Gemini attempt, because Gemini writes much better Telugu than Groq.
  const attempts = groq && lang !== "te" ? [GEMINI_MODEL, "backup"] : [GEMINI_MODEL, "backup", GEMINI_MODEL];
  let lastErr;
  const tried = [];
  for (let i = 0; i < attempts.length; i++) {
    const model = attempts[i] === "backup" ? await findBackupModel() : attempts[i];
    if (!model) continue;
    try {
      const started = Date.now();
      const response = await geminiCall(model, contents);
      console.log(`Gemini answered with ${model} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      return response.text || null; // empty when Gemini's safety filter blocks the reply
    } catch (err) {
      lastErr = err;
      tried.push(`${model}: ${describeAiError(err)}`);
      console.warn(`Gemini ${model} failed: status=${err?.status} ${String(err?.message).slice(0, 300)}`);
      if (!isBusy(err)) { err.detail = tried.join(" | "); throw err; }
      if (i === 1) await sleep(2500);
    }
  }
  const busy = new GuideBusyError(String(lastErr?.message));
  busy.detail = (tried.length ? tried : ["no backup model found"]).join(" | ");
  throw busy;
}

// Groq (free tier, OpenAI-style API). Tries each model in GROQ_MODELS.
const GROQ_JSON_RULES = `

OUTPUT FORMAT: reply with ONLY a JSON object, no other text:
{"answer": "<your answer>", "verse_ids": ["<id from the VERSE LIBRARY>"]}`;

const GROQ_TELUGU_RULES = `

TELUGU WRITING RULES (very important):
- Write the "answer" in clear, natural, spoken Telugu, the way a kind elder speaks to family. Use Telugu script only.
- Use SHORT, simple sentences (8–15 words each). Correct Telugu grammar matters more than length; 100–150 words is enough.
- Do not mix in English words. Do not translate English idioms word for word.
- Use common words that every Telugu reader knows: మనసు, ప్రశాంతత, ధైర్యం, ఆత్మ, సాధన, శ్వాస, ప్రేమ.
- Address the reader respectfully with "మీరు".
- Example of the right tone: "మీ మనసులోని బాధను నేను అర్థం చేసుకోగలను. ఈ రోజు ఐదు నిమిషాలు ప్రశాంతంగా కూర్చోండి. నెమ్మదిగా శ్వాస తీసుకోండి."`;

async function askGroq(question, history, note, lang) {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT + (lang === "te" ? GROQ_TELUGU_RULES : "") + GROQ_JSON_RULES },
    ...history.slice(-6),
    { role: "user", content: `${question}\n\n${note}` },
  ];
  const tried = [];
  let busy = true;
  for (const model of lang === "te" ? GROQ_MODELS_TE : GROQ_MODELS) {
    try {
      const started = Date.now();
      const completion = await groq.chat.completions.create({
        model,
        messages,
        response_format: { type: "json_object" },
        max_completion_tokens: 4000,
      });
      console.log(`Groq answered with ${model} in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      return completion.choices[0]?.message?.content || null;
    } catch (err) {
      tried.push(`${model}: ${describeAiError(err)}`);
      console.warn(`Groq ${model} failed: status=${err?.status} ${String(err?.message).slice(0, 300)}`);
      if (!(err?.status === 429 || err?.status >= 500)) busy = false;
    }
  }
  const e = busy ? new GuideBusyError("Groq busy") : new Error("Groq failed");
  e.detail = tried.join(" | ");
  throw e;
}

function declined(lang) {
  return {
    answer: lang === "te"
      ? "ఈ ప్రశ్నకు నేను సహాయం చేయలేను. మీరు కష్టకాలంలో ఉంటే, దయచేసి మీరు నమ్మే వ్యక్తిని లేదా స్థానిక హెల్ప్‌లైన్‌ను (Tele-MANAS 14416) సంప్రదించండి. మీ మనసులో ఉన్న మరే విషయమైనా నన్ను అడగవచ్చు."
      : "I'm not able to help with that question. If you are going through something difficult, please consider reaching out to someone you trust or a local helpline (Tele-MANAS 14416 in India). You're welcome to ask me about anything on your heart.",
    verses: [VERSE_BY_ID["shvetashvatara-6.11"]],
  };
}

// Used when no AI key is set, so the app can be tried end-to-end for free.
function demoAnswer(question, lang) {
  const q = question.toLowerCase();
  const pick = VERSES.find((v) =>
    v.theme.split(/[ ,]+/).some((word) => word.length > 3 && q.includes(word.replace(/s$/, ""))),
  ) ?? VERSE_BY_ID["katha-1.3.3"];
  if (lang === "te") {
    return {
      demo: true,
      answer:
        "(డెమో మోడ్: నిజమైన, వ్యక్తిగత మార్గదర్శనం కోసం GEMINI_API_KEY (ఉచితం) జోడించండి.)\n\n" +
        "మీ మనసులోని మాట పంచుకున్నందుకు ధన్యవాదాలు. పైన ఉన్న శ్లోకాన్ని నెమ్మదిగా ఒకసారి చదవండి. " +
        "మిమ్మల్ని మీరు అడగండి: నా పరిస్థితిలో నేను దేనిని వదిలేయగలను, ఈ రోజు నేను ఏ పని చేయాలి?",
      verses: [pick],
    };
  }
  return {
    demo: true,
    answer:
      "(Demo mode: add a free GEMINI_API_KEY to get real, personal guidance.)\n\n" +
      `Thank you for sharing this. The ${pick.ref.split(" ")[0]} Upanishad speaks to exactly this kind of moment. ` +
      "Take a slow breath and read the verse above. Ask yourself: which part of my situation can I let go of, and which part is asking for my action today?",
    verses: [pick],
  };
}
