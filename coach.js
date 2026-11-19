// The Coach: a 7-day plan for one goal, with daily check-ins, grounded in scripture + practices.
import { runAI, parseJson, withVerseChoices } from "./guide.js";
import { matchTopics, recommendations, isStrongMatch } from "./topics.js";
import { VERSES, VERSE_BY_ID } from "./verses.js";
import { PRACTICES, PRACTICE_BY_ID } from "./practices.js";

export const AREAS = ["relationships", "emotions", "discipline", "career", "wealth"];
export const PLAN_DAYS = 7;

const COACH_PROMPT = `You are Atma Coach, a warm, practical life coach whose wisdom comes from the Upanishads and the Bhagavad Gita, supported by simple practices.
Your coaching style: kind, encouraging, specific and realistic. Small daily steps, never lectures.

Rules:
- Ground every plan in 1–2 verses from the VERSE LIBRARY (by id) and 1–3 practices from the PRACTICE LIBRARY (by id). Choose verses whose MEANING directly fits the goal; when the request lists RECOMMENDED VERSES / PRACTICES (chosen by our teachers), use those. Never quote or invent scripture or teachings yourself; the app shows verse and practice text from the libraries.
- Daily actions must be small, concrete and doable in 5–20 minutes ("Before replying to your mother today, take one breath"), not vague ("be patient").
- Never promise results (money, love, health, success). Teach that intention + right action + acceptance bring change; outcomes are not guaranteed.
- WEALTH: speak about honest effort, skill, discipline with money, generosity and contentment (dharma). Never give specific financial, investment, tax or legal advice; for those, suggest a qualified professional.
- You are not a therapist or doctor. If the user mentions self-harm, violence, abuse or a medical crisis, respond with care and urge them to contact local emergency services or a helpline (India: Tele-MANAS 14416) and someone they trust.
- Practices "inspired by" modern teachers (Neville Goddard, Osho, Gurdjieff, J. Krishnamurti, José Silva) are offered as simple exercises, not as religious authority.

VERSE LIBRARY (id | reference | themes):
${VERSES.map((v) => `${v.id} | ${v.ref} | ${v.theme}`).join("\n")}

PRACTICE LIBRARY (id | source | name | good for | minutes):
${PRACTICES.map((p) => `${p.id} | ${p.source} | ${p.name} | ${p.areas} | ${p.minutes}`).join("\n")}`;

const verseIds = VERSES.map((v) => v.id);
const practiceIds = PRACTICES.map((p) => p.id);

const PLAN_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    sankalpa: { type: "string" },
    why: { type: "string" },
    verse_ids: { type: "array", items: { type: "string", enum: verseIds } },
    practice_ids: { type: "array", items: { type: "string", enum: practiceIds } },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: { action: { type: "string" }, practice_id: { type: "string", enum: practiceIds } },
        required: ["action"],
        additionalProperties: false,
      },
    },
  },
  required: ["title", "sankalpa", "why", "verse_ids", "practice_ids", "days"],
  additionalProperties: false,
};

const CHECKIN_SCHEMA = {
  type: "object",
  properties: { message: { type: "string" } },
  required: ["message"],
  additionalProperties: false,
};

const AREA_LABEL = {
  relationships: "Relationships & family", emotions: "Mind & emotions", discipline: "Discipline & habits",
  career: "Career & purpose", wealth: "Wealth (the dharmic way)",
};

/** Creates a 7-day plan for a goal. */
export async function createPlan({ area, goal, lang }) {
  const question = `Create a ${PLAN_DAYS}-day coaching plan.
Area: ${AREA_LABEL[area]}
My goal, in my own words: """${goal}"""

Return: "title" (short, max 8 words), "sankalpa" (one short present-tense intention sentence the user repeats daily, first person),
"why" (2–3 sentences linking the chosen verse to the goal), 1–2 "verse_ids", 1–3 "practice_ids",
and exactly ${PLAN_DAYS} "days", each with one small concrete "action" (1–2 sentences) and optionally the "practice_id" used that day.
Day 1 should be very easy; build up gently.`;
  const topics = matchTopics(goal);
  const rec = recommendations(topics);
  const schema = rec.verses.length && isStrongMatch(topics) ? withVerseChoices(PLAN_SCHEMA, rec.verses) : PLAN_SCHEMA;
  const prompt = rec.verses.length
    ? `${question}\n\nRECOMMENDED VERSES (best first): ${rec.verses.join(", ")}\nRECOMMENDED PRACTICES: ${rec.practices.join(", ")}`
    : question;
  const { raw, provider } = await runAI({ system: COACH_PROMPT, schema, question: prompt, lang });
  if (provider === "demo") {
    const demo = demoPlan(area, goal, lang);
    if (rec.verses.length) demo.verseIds = [rec.verses[0]];
    return { ...demo, topics: topics.map((t) => t.id), provider };
  }
  if (raw === null) throw Object.assign(new Error("declined"), { declined: true });
  const p = parseJson(raw);
  const days = (p.days ?? []).slice(0, PLAN_DAYS).map((d) => ({
    action: String(d.action ?? ""),
    practiceId: PRACTICE_BY_ID[d.practice_id] ? d.practice_id : null,
  }));
  while (days.length < PLAN_DAYS) days.push({ action: days.at(-1)?.action ?? "", practiceId: null });
  return {
    title: String(p.title ?? ""),
    sankalpa: String(p.sankalpa ?? ""),
    why: String(p.why ?? ""),
    verseIds: [...new Set(p.verse_ids ?? [])].filter((id) => VERSE_BY_ID[id]).slice(0, 2),
    practiceIds: [...new Set(p.practice_ids ?? [])].filter((id) => PRACTICE_BY_ID[id]).slice(0, 3),
    days,
    topics: topics.map((t) => t.id),
    provider,
  };
}

/** The coach's reply to a daily check-in. */
export async function coachReply({ program, day, done, note, lang }) {
  const last = day >= PLAN_DAYS;
  const history = (program.checkins ?? [])
    .map((c) => `Day ${c.day}: ${c.done ? "done" : "not done"}${c.note ? ` (note: ${c.note})` : ""}`)
    .join("\n");
  const question = `The user is on a ${PLAN_DAYS}-day plan.
Goal: """${program.goal}"""  Sankalpa: "${program.sankalpa}"
Earlier check-ins:
${history || "(none)"}

Today is day ${day}. Today's action was: "${program.days[day - 1]?.action}"
They report: ${done ? "DONE" : "NOT DONE"}. Their note: """${note || "(no note)"}"""

Write "message" (60–120 words): respond warmly to what they shared, ${done ? "celebrate the effort" : "no guilt; normalise it and make the step easier"}, ${
    last
      ? "and since this is the LAST day, summarise their journey in 2–3 sentences, name one thing to keep doing, and suggest choosing a next goal."
      : `and encourage tomorrow's action: "${program.days[day]?.action}".`
  } You may mention the verse or practice idea, but don't quote scripture.`;
  const { raw, provider } = await runAI({ system: COACH_PROMPT, schema: CHECKIN_SCHEMA, question, lang });
  if (provider === "demo") return { message: demoReply(done, last, lang), provider };
  if (raw === null) return { message: lang === "te" ? "మీ ప్రయత్నాన్ని కొనసాగించండి. రేపు మళ్ళీ కలుద్దాం. 🙏" : "Keep going gently. See you tomorrow. 🙏", provider };
  return { message: String(parseJson(raw).message ?? ""), provider };
}

/** Adds the full verse and practice objects for the browser. */
export function hydrate(program) {
  return {
    ...program,
    verses: (program.verseIds ?? []).map((id) => VERSE_BY_ID[id]).filter(Boolean),
    practices: (program.practiceIds ?? []).map((id) => PRACTICE_BY_ID[id]).filter(Boolean),
    days: (program.days ?? []).map((d) => ({ ...d, practice: d.practiceId ? PRACTICE_BY_ID[d.practiceId] : null })),
  };
}

// ---- Demo mode (no AI key): a simple fixed plan so the screen can be tried ----
const DEMO = {
  relationships: ["gita-17.15", "kind-speech"], emotions: ["gita-2.56", "pranayama"], discipline: ["gita-6.35", "gurdjieff-habit-watch"],
  career: ["gita-2.47", "silva-countdown"], wealth: ["taittiriya-1.11.3", "seva"],
};

function demoPlan(area, goal, lang) {
  const [verseId, practiceId] = DEMO[area] ?? DEMO.emotions;
  const te = lang === "te";
  return {
    title: te ? "(డెమో) 7 రోజుల ప్రణాళిక" : "(Demo) 7-day plan",
    sankalpa: te ? "నేను ప్రతి రోజు ఒక చిన్న అడుగు వేస్తున్నాను." : "Each day, I take one small step.",
    why: te ? "డెమో మోడ్: నిజమైన వ్యక్తిగత ప్రణాళిక కోసం AI కీ జోడించండి." : "Demo mode: add an AI key for a real, personal plan.",
    verseIds: [verseId],
    practiceIds: [practiceId, "gratitude"],
    days: Array.from({ length: PLAN_DAYS }, (_, i) => ({
      action: te ? `రోజు ${i + 1}: "${goal}" వైపు 10 నిమిషాల చిన్న అడుగు వేయండి.` : `Day ${i + 1}: spend 10 minutes on one small step towards "${goal}".`,
      practiceId: i % 2 ? "gratitude" : practiceId,
    })),
  };
}

function demoReply(done, last, lang) {
  const te = lang === "te";
  if (last) return te ? "(డెమో) 7 రోజులు పూర్తయ్యాయి! మీ ప్రయత్నానికి అభినందనలు. 🙏" : "(Demo) You finished all 7 days! Well done for showing up. 🙏";
  return done
    ? (te ? "(డెమో) చాలా బాగుంది! రేపు కూడా ఇలాగే కొనసాగించండి." : "(Demo) Wonderful! Keep the same rhythm tomorrow.")
    : (te ? "(డెమో) పర్వాలేదు. రేపు చిన్న అడుగుతో మళ్ళీ ప్రారంభించండి." : "(Demo) That's okay. Start again tomorrow with a smaller step.");
}
