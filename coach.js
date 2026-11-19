// The Coach: a real conversation. It asks questions first, then offers a fitting verse and
// tailored options, helps the user choose ONE small step (with a sankalpa), and follows up next day.
import { runAI, parseJson } from "./guide.js";
import { matchTopics, recommendations, isStrongMatch } from "./topics.js";
import { VERSES, VERSE_BY_ID } from "./verses.js";
import { PRACTICES, PRACTICE_BY_ID } from "./practices.js";
import { TEACHINGS, TEACHING_BY_ID } from "./teachings.js";

const MAX_HISTORY = 16; // messages sent to the AI (older ones are summarised by the commitment)

const COACH_PROMPT = `You are Atma Coach: a warm, wise and practical life coach. Your wisdom comes from the Upanishads and the Bhagavad Gita, supported by simple practices. You talk WITH the person, like a caring human coach, never AT them.

HOW YOU COACH (follow these stages):
1. UNDERSTAND first. Ask ONE short, caring question at a time (never two). Learn the specifics: what exactly happens, who is involved (age, relationship), how often, what they already tried, how they feel, what they want instead.
   Usually ask 2–3 questions before advising; ask fewer if they already gave details. Never more than 4.
2. GUIDE: in one sentence, reflect back what you understood (using THEIR details). Then share ONE verse whose meaning directly fits their situation (put its id in verse_ids; the app shows it just above your message) and explain in 1–2 plain sentences how it applies to THEM. Then offer 2–3 concrete, small options tailored to their details (numbered), and ask which one they'd like to try. You may add one practice (practice_ids) if it truly helps. You may also add ONE teaching of a modern master (teaching_ids) that complements the verse, and mention it naturally in your own words ("In a similar spirit, Krishnamurti taught..."); the app shows the teaching card.
3. AGREE: when they choose, confirm warmly and fill "commitment" with:
   - "action": one specific step for today/tomorrow, using their details ("When Ravi ignores you, say it once at eye level and wait 10 seconds").
   - "sankalpa": one short first-person, present-tense sentence naming their situation and new behaviour ("When my son doesn't listen, I speak once, calmly, and wait.").
   Tell them you'll ask tomorrow how it went.
4. FOLLOW UP: when they report back, respond to what actually happened, celebrate effort or make the step easier without guilt, ask what helped or blocked them, then suggest the next small step (a new commitment when agreed).

STYLE: short messages (40–110 words). Warm, respectful, simple words. Always use the person's own details; never generic advice like "be patient". No lectures. Only one question per message.
VERSES: only when sharing guidance, normally once per problem; never in every message. Choose by the verse's MEANING. If the request lists RECOMMENDED VERSES (chosen by our teachers), choose from them. Never quote or invent scripture yourself; the app shows the verse text.
QUICK REPLIES: give 2–4 short tap-able replies the person might send next (max 6 words each, in the person's language), e.g. the options you offered, or "Yes", "Not really". Use [] if a free answer is needed.

SAFETY: never promise results (money, love, health). Wealth: honest effort, skill, wise money habits, generosity, contentment; no financial, investment, tax or legal advice. You are not a therapist or doctor: if someone mentions self-harm, abuse, violence or a medical emergency, respond with care and urge them to contact emergency services or a helpline (India: Tele-MANAS 14416) and someone they trust.
Modern masters (Neville Goddard, Osho, Gurdjieff, J. Krishnamurti, José Silva, Eckhart Tolle, Ramana Maharshi, Swami Vivekananda): only use teachings from the TEACHINGS LIBRARY, described in your own words. Never invent quotes or teachings and never attribute anything else to them. Scripture stays at the centre; masters are supporting voices.

VERSE LIBRARY (id | reference | themes). Full meanings of the best-fitting verses are given in the coach notes:
${VERSES.map((v) => `${v.id} | ${v.ref} | ${v.theme}`).join("\n")}

TEACHINGS LIBRARY of modern masters (id | master | teaching). Summaries of the best-fitting ones are given in the coach notes:
${TEACHINGS.map((t) => `${t.id} | ${t.master} | ${t.title}`).join("\n")}

PRACTICE LIBRARY (id | source | name | good for):
${PRACTICES.map((p) => `${p.id} | ${p.source} | ${p.name} | ${p.areas}`).join("\n")}`;

const REPLY_SCHEMA = {
  type: "object",
  properties: {
    message: { type: "string" },
    verse_ids: { type: "array", items: { type: "string", enum: VERSES.map((v) => v.id) } },
    practice_ids: { type: "array", items: { type: "string", enum: PRACTICES.map((p) => p.id) } },
    teaching_ids: { type: "array", items: { type: "string", enum: TEACHINGS.map((t) => t.id) } },
    quick_replies: { type: "array", items: { type: "string" } },
    commitment: {
      type: "object",
      properties: { action: { type: "string" }, sankalpa: { type: "string" } },
      required: ["action", "sankalpa"],
      additionalProperties: false,
    },
  },
  required: ["message", "verse_ids", "practice_ids", "teaching_ids", "quick_replies"],
  additionalProperties: false,
};

function schemaFor(verseIds) {
  if (!verseIds) return REPLY_SCHEMA;
  const s = structuredClone(REPLY_SCHEMA);
  s.properties.verse_ids.items.enum = verseIds;
  return s;
}

/**
 * The coach's next message.
 * @param conv {messages: [{role:"user"|"coach", text}], commitment}
 * @returns {message, verseIds, practiceIds, quickReplies, commitment|null, topics, provider}
 */
export async function coachTurn(conv, userText, lang) {
  const userSoFar = conv.messages.filter((m) => m.role === "user").map((m) => m.text).concat(userText).join(" \n ");
  const topics = matchTopics(userSoFar);
  const rec = recommendations(topics);
  const strong = isStrongMatch(topics);
  // Only the part of the conversation after the person's first message (skips the fixed greeting).
  const firstUser = conv.messages.findIndex((m) => m.role === "user");
  const talk = firstUser >= 0 ? conv.messages.slice(firstUser) : [];
  const questionsAsked = talk.filter((m) => m.role === "coach" && m.text.includes("?")).length;

  const context = [
    rec.verses.length
      ? `RECOMMENDED VERSES for this situation (best first):\n${rec.verses.map((id) => `- ${id} (${VERSE_BY_ID[id].ref}): ${VERSE_BY_ID[id].english}`).join("\n")}\nRECOMMENDED PRACTICES: ${rec.practices.join(", ")}\nRECOMMENDED TEACHINGS (modern masters):\n${rec.teachings.map((id) => `- ${id} (${TEACHING_BY_ID[id].master}: ${TEACHING_BY_ID[id].title}): ${TEACHING_BY_ID[id].idea}`).join("\n")}`
      : "",
    conv.commitment
      ? `The person's current step (agreed earlier): "${conv.commitment.action}". Sankalpa: "${conv.commitment.sankalpa}".`
      : "",
    `Coach questions asked so far in this conversation: ${questionsAsked}.`,
  ].filter(Boolean).join("\n");

  // AI services expect the history to start with the person and alternate roles: merge neighbours.
  const history = [];
  for (const m of talk.slice(-MAX_HISTORY)) {
    const role = m.role === "coach" ? "assistant" : "user";
    if (history.at(-1)?.role === role) history.at(-1).content += `\n\n${m.text}`;
    else history.push({ role, content: m.text });
  }
  while (history[0]?.role === "assistant") history.shift();
  if (history.at(-1)?.role === "user") { // the new message is sent separately, so end on the coach
    const last = history.pop();
    userText = `${last.content}\n\n${userText}`;
  }
  const question = `${userText}\n\n(Coach notes, not from the person:\n${context})`;

  const { raw, provider } = await runAI({
    system: COACH_PROMPT,
    schema: schemaFor(rec.verses.length && strong ? rec.verses : null),
    question,
    history,
    lang,
  });
  const topicIds = topics.map((t) => t.id);
  if (provider === "demo") return { ...demoTurn(conv, lang, rec), topics: topicIds, provider };
  if (raw === null) {
    return {
      message: lang === "te"
        ? "క్షమించండి, దీనికి నేను సహాయం చేయలేను. మీరు కష్టంలో ఉంటే, దయచేసి Tele-MANAS 14416 లేదా మీరు నమ్మే వ్యక్తిని సంప్రదించండి. 🙏"
        : "I'm sorry, I can't help with that. If you are going through something difficult, please reach out to Tele-MANAS 14416 or someone you trust. 🙏",
      verseIds: ["shvetashvatara-6.11"], practiceIds: [], teachingIds: [], quickReplies: [], commitment: null, topics: topicIds, provider,
    };
  }
  const r = parseJson(raw);
  const c = r.commitment;
  return {
    message: String(r.message ?? ""),
    verseIds: [...new Set(r.verse_ids ?? [])].filter((id) => VERSE_BY_ID[id]).slice(0, 1),
    practiceIds: [...new Set(r.practice_ids ?? [])].filter((id) => PRACTICE_BY_ID[id]).slice(0, 1),
    teachingIds: [...new Set(r.teaching_ids ?? [])].filter((id) => TEACHING_BY_ID[id]).slice(0, 1),
    quickReplies: (r.quick_replies ?? []).map(String).filter(Boolean).slice(0, 4),
    commitment: c?.action && c?.sankalpa ? { action: String(c.action), sankalpa: String(c.sankalpa) } : null,
    topics: topicIds,
    provider,
  };
}

/** Next-day check-in message (no AI needed). */
export function followUpMessage(commitment, lang) {
  return lang === "te"
    ? { text: `నమస్తే! 🙏 మీరు ఈ అడుగు వేయాలనుకున్నారు: "${commitment.action}". ఎలా జరిగింది?`,
        quickReplies: ["✅ చేశాను", "😐 కొంచెం", "❌ ఇంకా లేదు"] }
    : { text: `Namaste! 🙏 You decided to try this: "${commitment.action}". How did it go?`,
        quickReplies: ["✅ I did it", "😐 Partly", "❌ Not yet"] };
}

/** First message of a new conversation (no AI needed). */
export function greeting(lang) {
  return lang === "te"
    ? { text: "నమస్తే 🙏 నేను మీ ఆత్మ కోచ్‌ని. ఈ రోజు మీ మనసులో ఏముంది? మీ పరిస్థితి గురించి నాకు చెప్పండి.",
        quickReplies: ["పిల్లలు మాట వినడం లేదు", "కోపం తగ్గించుకోవాలి", "ఉద్యోగ ఒత్తిడి", "చెడు అలవాటు మానుకోవాలి"] }
    : { text: "Namaste 🙏 I'm your Atma coach. What's on your mind today? Tell me about your situation.",
        quickReplies: ["My child doesn't listen", "I get angry easily", "Stress at work", "I want to break a habit"] };
}

/** Adds verse and practice objects for the browser. */
export function hydrateMessage(m) {
  return {
    ...m,
    verses: (m.verseIds ?? []).map((id) => VERSE_BY_ID[id]).filter(Boolean),
    practices: (m.practiceIds ?? []).map((id) => PRACTICE_BY_ID[id]).filter(Boolean),
    teachings: (m.teachingIds ?? []).map((id) => TEACHING_BY_ID[id]).filter(Boolean),
  };
}

// ---- Demo mode (no AI key): a scripted conversation so the screen can be tried ----
function demoTurn(conv, lang, rec) {
  const te = lang === "te";
  const userCount = conv.messages.filter((m) => m.role === "user").length; // before this message
  const verse = rec.verses[0] ?? "gita-6.35";
  if (conv.commitment) {
    return { message: te ? "(డెమో) మీ ప్రయత్నానికి అభినందనలు! ఏది సహాయపడింది?" : "(Demo) Well done for trying! What helped you most?",
      verseIds: [], practiceIds: [], quickReplies: [], commitment: null };
  }
  if (userCount === 0) {
    return { message: te ? "(డెమో) అర్థమైంది. ఇది ఎంత తరచుగా జరుగుతుంది, అప్పుడు మీరు ఏమి చేస్తారు?" : "(Demo) I understand. How often does this happen, and what do you usually do then?",
      verseIds: [], practiceIds: [], quickReplies: te ? ["రోజూ", "అప్పుడప్పుడు"] : ["Every day", "Sometimes"], commitment: null };
  }
  if (userCount === 1) {
    return { message: te ? "(డెమో) ధన్యవాదాలు. పై శ్లోకం మీ పరిస్థితికి సరిపోతుంది. ఈ రెండు ఎంపికలలో ఏది ప్రయత్నిస్తారు? 1) ఒక శ్వాస ఆగండి 2) ఒక్కసారి ప్రశాంతంగా చెప్పండి" : "(Demo) Thank you. The verse above fits your situation. Which would you like to try? 1) Pause for one breath 2) Say it once, calmly",
      verseIds: [verse], practiceIds: ["kind-speech"], teachingIds: rec.teachings.slice(0, 1), quickReplies: te ? ["1", "2"] : ["Option 1", "Option 2"], commitment: null };
  }
  return { message: te ? "(డెమో) అద్భుతం! రేపు ఎలా జరిగిందో అడుగుతాను." : "(Demo) Wonderful! I'll ask you tomorrow how it went.",
    verseIds: [], practiceIds: [], quickReplies: [],
    commitment: te ? { action: "ఒక్కసారి ప్రశాంతంగా చెప్పి వేచి ఉండండి", sankalpa: "నేను ఒక్కసారి, ప్రశాంతంగా చెప్పి వేచి ఉంటాను." }
                   : { action: "Say it once, calmly, and wait", sankalpa: "I speak once, calmly, and wait." } };
}
