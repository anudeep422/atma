import Anthropic from "@anthropic-ai/sdk";
import { VERSES, VERSE_BY_ID } from "./verses.js";

const MODEL = "claude-opus-5-5";
const hasClaude = Boolean(process.env.ANTHROPIC_API_KEY);
const client = hasClaude ? new Anthropic() : null;

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

/**
 * @param {string} question
 * @param {{role: "user"|"assistant", content: string}[]} history recent turns (plain text)
 * @returns {Promise<{answer: string, verses: object[], demo?: boolean}>}
 */
export async function askGuide(question, history = []) {
  if (!client) return demoAnswer(question);

  const messages = [
    ...history.slice(-6),
    { role: "user", content: question },
  ];

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    // If a safety classifier declines, the API retries on a fallback model automatically.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: OUTPUT_SCHEMA },
    },
    messages,
  });

  if (response.stop_reason === "refusal") {
    return {
      answer: "I'm not able to help with that question. If you are going through something difficult, please consider reaching out to someone you trust or a local helpline. You're welcome to ask me about anything on your heart.",
      verses: [VERSE_BY_ID["shvetashvatara-6.11"]],
    };
  }

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`Guide returned unparseable output (stop_reason=${response.stop_reason})`);
  }

  const verses = [...new Set(parsed.verse_ids)]
    .map((id) => VERSE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 2);
  return { answer: parsed.answer, verses };
}

// Used when ANTHROPIC_API_KEY is not set, so the app can be tried end-to-end for free.
function demoAnswer(question) {
  const q = question.toLowerCase();
  const pick = VERSES.find((v) =>
    v.theme.split(/[ ,]+/).some((word) => word.length > 3 && q.includes(word.replace(/s$/, ""))),
  ) ?? VERSE_BY_ID["katha-1.3.3"];
  return {
    demo: true,
    answer:
      "(Demo mode: add your ANTHROPIC_API_KEY to get real, personal guidance.)\n\n" +
      `Thank you for sharing this. The ${pick.ref.split(" ")[0]} Upanishad speaks to exactly this kind of moment. ` +
      "Take a slow breath and read the verse above. Ask yourself: which part of my situation can I let go of, and which part is asking for my action today?",
    verses: [pick],
  };
}
