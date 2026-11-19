// Topic map: common life situations -> verses, practices and masters' teachings CHOSEN BY PEOPLE (not by the AI).
// When a question matches a topic, the AI may only pick verses from that topic's list.
// To improve answers: add keywords (English + Telugu) or change the verse order (best first).
// Keywords are matched as lowercase text fragments, so a stem like "కోప" matches కోపం, కోపంగా, ...
import { VERSE_BY_ID } from "./verses.js";
import { PRACTICE_BY_ID } from "./practices.js";
import { TEACHING_BY_ID } from "./teachings.js";

export const TOPICS = [
  { id: "parenting", label: "Children & parenting", label_te: "పిల్లలు & పెంపకం",
    keywords: ["child", "children", " kid", "kids", " son ", "my son", "daughter", "teenager", "parenting", "not listening", "doesn't listen", "does not listen", "disobey", "పిల్ల", "కొడుకు", "కూతుర", "మాట విన", "బిడ్డ"],
    verses: ["gita-3.21", "gita-17.15", "gita-12.13", "taittiriya-1.11.1", "saha-navavatu"],
    teachings: ["jk-relationship-mirror", "jk-listening", "neville-others"],
    practices: ["kind-speech", "neville-revision", "pranayama"] },
  { id: "anger", label: "Anger", label_te: "కోపం",
    keywords: ["anger", "angry", "temper", "shout", "yell", "irritat", " rage", "frustrat", "కోప", "అరుస్త", "చిరాకు", "అసహన"],
    verses: ["gita-2.62", "gita-16.21", "gita-17.15", "gita-2.56", "brihad-5.2.3"],
    teachings: ["osho-understand-not-suppress", "gurdjieff-negative-emotions", "tolle-pain-body"],
    practices: ["kind-speech", "jk-observe", "pranayama"] },
  { id: "anxiety", label: "Anxiety & fear", label_te: "ఆందోళన & భయం",
    keywords: ["anxious", "anxiety", "worry", "worried", "fear", "afraid", "scared", "panic", "nervous", "tension", "future", "ఆందోళన", "భయ", "టెన్షన్", "భవిష్యత్", "దిగులు"],
    verses: ["gita-2.47", "gita-9.22", "taittiriya-2.9.1", "gita-2.56", "gita-2.14"],
    teachings: ["tolle-now", "jk-observer-observed", "silva-alpha"],
    practices: ["pranayama", "osho-witness", "silva-countdown"] },
  { id: "exams", label: "Exams & studies", label_te: "పరీక్షలు & చదువు",
    keywords: ["exam", "study", "studies", "studying", "student", "marks", "test ", "entrance", "neet", "jee", "upsc", "appsc", "tspsc", "పరీక్ష", "చదువ", "మార్కులు", "విద్యార్థ"],
    verses: ["gita-4.39", "gita-2.47", "mundaka-2.2.4", "katha-1.3.14", "gita-6.26"],
    teachings: ["vivek-concentration", "vivek-one-idea", "silva-alpha"],
    practices: ["silva-countdown", "svadhyaya", "osho-witness"] },
  { id: "work-stress", label: "Work stress & career", label_te: "ఉద్యోగ ఒత్తిడి & వృత్తి",
    keywords: ["job", "career", "boss", "office", "workplace", "work stress", "work pressure", "promotion", "interview", "colleague", "manager", "deadline", "ఉద్యోగ", "ఆఫీస", "బాస్", "కెరీర్", "పని ఒత్తిడ"],
    verses: ["gita-2.47", "gita-2.48", "gita-2.50", "gita-5.10", "gita-3.35"],
    teachings: ["osho-now-totally", "tolle-acceptance", "vivek-work-worship"],
    practices: ["silva-countdown", "osho-witness", "gurdjieff-self-remembering"] },
  { id: "failure", label: "Failure & setbacks", label_te: "అపజయం & ఎదురుదెబ్బలు",
    keywords: ["fail", "failure", "failed", "lost my job", "fired", "rejected", "rejection", "setback", "defeat", "ఓడిప", "విఫల", "ఫెయిల", "ఉద్యోగం పోయ", "తిరస్కర"],
    verses: ["gita-2.48", "gita-2.3", "gita-6.5", "gita-2.14", "katha-1.3.14"],
    teachings: ["vivek-strength", "neville-persistence", "tolle-acceptance"],
    practices: ["neville-revision", "sankalpa", "gratitude"] },
  { id: "comparison", label: "Comparison & jealousy", label_te: "పోలిక & అసూయ",
    keywords: ["compar", "jealous", "envy", "not good enough", "inferior", "better than me", "others are", "పోల్చ", "అసూయ", "ఈర్ష్య"],
    verses: ["gita-3.35", "chandogya-6.8.7", "purnam", "gita-18.47", "isha-1"],
    teachings: ["jk-comparison", "osho-accept-yourself", "vivek-faith-yourself"],
    practices: ["gratitude", "jk-observe", "gurdjieff-habit-watch"] },
  { id: "confidence", label: "Confidence & courage", label_te: "ఆత్మవిశ్వాసం & ధైర్యం",
    keywords: ["confidence", "confident", "weak", "give up", "giving up", "hopeless", "motivation", "motivate", "courage", "self doubt", "self-doubt", "ఆత్మవిశ్వాస", "ధైర్య", "నిరాశ", "వదిలేయ", "నమ్మకం లేదు"],
    verses: ["gita-2.3", "gita-6.5", "brihad-1.4.10", "katha-1.3.14", "chandogya-6.8.7"],
    teachings: ["vivek-faith-yourself", "vivek-strength", "neville-self-concept"],
    practices: ["sankalpa", "neville-end", "silva-countdown"] },
  { id: "grief", label: "Grief & loss", label_te: "దుఃఖం & కోల్పోవడం",
    keywords: ["died", "death", "passed away", "lost someone", "lost my", "grief", "grieving", "funeral", "miss my", "చనిపో", "మరణ", "కోల్పో", "దుఃఖ", "చావు"],
    verses: ["katha-1.2.18", "gita-2.22", "isha-7", "shvetashvatara-6.11", "brihad-1.3.28"],
    teachings: ["tolle-acceptance", "ramana-who-am-i", "jk-observer-observed"],
    practices: ["japa", "gratitude", "osho-humming"] },
  { id: "loneliness", label: "Loneliness", label_te: "ఒంటరితనం",
    keywords: ["lonely", "loneliness", "alone", "no friends", "isolated", "nobody understands", "ఒంటరి", "ఎవరూ లేరు"],
    verses: ["shvetashvatara-6.11", "isha-6", "chandogya-3.14.1", "gita-6.5"],
    teachings: ["ramana-happiness-nature", "tolle-inner-body", "vivek-work-worship"],
    practices: ["seva", "japa", "gratitude"] },
  { id: "marriage", label: "Marriage & spouse", label_te: "దాంపత్యం",
    keywords: ["husband", "wife", "spouse", "marriage", "married", "partner", "divorce", "in-law", "భర్త", "భార్య", "పెళ్ల", "దాంపత్య", "విడాకు"],
    verses: ["gita-12.13", "gita-17.15", "brihad-2.4.5", "gita-12.15", "isha-6"],
    teachings: ["osho-love-freedom", "jk-relationship-mirror", "neville-others"],
    practices: ["kind-speech", "neville-revision", "seva"] },
  { id: "heartbreak", label: "Love & heartbreak", label_te: "ప్రేమ & హృదయ వేదన",
    keywords: ["breakup", "break up", "girlfriend", "boyfriend", "heartbroken", "heart broken", "crush", "love failure", "attachment", "ప్రేమ", "బ్రేకప", "లవ్"],
    verses: ["brihad-2.4.5", "gita-2.62", "katha-2.3.14", "gita-2.70", "mundaka-3.2.8"],
    teachings: ["osho-love-freedom", "tolle-pain-body", "jk-observer-observed"],
    practices: ["jk-observe", "osho-witness", "gratitude"] },
  { id: "parents-elders", label: "Parents & elders", label_te: "తల్లిదండ్రులు & పెద్దలు",
    keywords: ["my parents", "my mother", "my father", "my mom", "my dad", "mother-in-law", "father-in-law", "elders", "అమ్మ", "నాన్న", "తల్లి", "తండ్రి", "అత్తగార", "మామగార", "పెద్దవార"],
    verses: ["taittiriya-1.11.1", "gita-12.13", "gita-17.15", "gita-12.15"],
    teachings: ["jk-listening", "neville-others", "gurdjieff-intentional-suffering"],
    practices: ["kind-speech", "seva", "neville-revision"] },
  { id: "forgiveness", label: "Hurt & forgiveness", label_te: "బాధ & క్షమ",
    keywords: ["forgive", "forgiveness", "hurt me", "betray", "cheated", "hate ", "revenge", "insulted", "క్షమ", "ద్రోహ", "మోసం", "ద్వేష", "అవమాన"],
    verses: ["gita-12.13", "isha-6", "gita-12.15", "mundaka-3.1.1"],
    teachings: ["neville-others", "tolle-pain-body", "gurdjieff-intentional-suffering"],
    practices: ["neville-revision", "jk-observe", "japa"] },
  { id: "habits", label: "Breaking bad habits", label_te: "చెడు అలవాట్లు మానుకోవడం",
    keywords: ["habit", "break the pattern", "habit pattern", "patterns", "quit", "stop doing", "can't stop", "cannot stop", "keep doing", "again and again", "అలవాట", "మానుకో", "మానేయ", "ఆపలేక", "మళ్ళీ మళ్ళీ"],
    verses: ["gita-6.35", "gita-2.62", "katha-1.2.2", "gita-6.5", "gita-6.26"],
    teachings: ["gurdjieff-machines", "gurdjieff-many-is", "jk-observer-observed"],
    practices: ["gurdjieff-habit-watch", "gurdjieff-self-remembering", "sankalpa"] },
  { id: "discipline", label: "Laziness & procrastination", label_te: "బద్ధకం & వాయిదా",
    keywords: ["lazy", "laziness", "procrastinat", "postpon", "discipline", "consistent", "consistency", "wake up early", "routine", "motivation to start", "బద్ధక", "క్రమశిక్షణ", "సోమరి", "వాయిదా"],
    verses: ["gita-3.8", "gita-6.5", "katha-1.3.14", "gita-6.16", "gita-6.35"],
    teachings: ["vivek-one-idea", "gurdjieff-many-is", "vivek-strength"],
    practices: ["sankalpa", "mitahara", "gurdjieff-habit-watch"] },
  { id: "addiction", label: "Phone & addictions", label_te: "ఫోన్ & వ్యసనాలు",
    keywords: ["phone", "mobile", "social media", "instagram", "reels", "youtube", "addict", "scrolling", "porn", "drinking", "alcohol", "smoking", "gaming", "ఫోన", "వ్యసన", "తాగుడు", "సిగరెట"],
    verses: ["gita-6.26", "gita-2.62", "katha-1.3.3", "katha-2.1.1", "gita-6.35"],
    teachings: ["gurdjieff-machines", "tolle-not-your-mind", "silva-three-fingers"],
    practices: ["gurdjieff-habit-watch", "gurdjieff-self-remembering", "pranayama"] },
  { id: "overthinking", label: "Overthinking & a restless mind", label_te: "అతిగా ఆలోచించడం",
    keywords: ["overthink", "over think", "too many thoughts", "racing thoughts", "restless", "can't focus", "cannot focus", "concentrat", "meditat", "peace of mind", "ఆలోచన", "ధ్యాన", "ఏకాగ్రత", "ప్రశాంతత"],
    verses: ["gita-6.35", "gita-6.26", "mundaka-3.1.1", "katha-1.3.3", "katha-2.1.1"],
    teachings: ["tolle-not-your-mind", "ramana-to-whom", "jk-choiceless"],
    practices: ["osho-witness", "osho-humming", "jk-observe"] },
  { id: "money", label: "Money & wealth", label_te: "డబ్బు & సంపద",
    keywords: ["money", "wealth", " rich", "debt", "loan", "salary", "financial", "finance", " poor", "business", "earn money", "earning", "income", "savings", "డబ్బు", "సంపద", "అప్పు", "జీతం", "వ్యాపార", "ధనం", "సంపాదన"],
    verses: ["gita-18.78", "taittiriya-3.9", "taittiriya-1.11.3", "gita-2.70", "isha-1", "gita-9.22"],
    teachings: ["neville-assumption", "vivek-work-worship", "osho-zorba-buddha"],
    practices: ["neville-end", "seva", "silva-mirror"] },
  { id: "contentment", label: "Desire, greed & happiness", label_te: "కోరికలు & సంతోషం",
    keywords: ["greed", "greedy", "desire", "want more", "never satisfied", "not happy", "unhappy", "happiness", "contentment", "కోరిక", "ఆశ", "సంతోష", "తృప్తి", "లోభ"],
    verses: ["chandogya-7.23.1", "gita-2.70", "isha-1", "katha-2.3.14", "gita-16.21"],
    teachings: ["osho-zorba-buddha", "ramana-happiness-nature", "tolle-ego"],
    practices: ["gratitude", "mitahara", "jk-observe"] },
  { id: "purpose", label: "Purpose & meaning", label_te: "జీవిత లక్ష్యం",
    keywords: ["purpose", "meaning of life", "meaningless", "why am i", "who am i", "direction", "lost in life", "what should i do with my life", "జీవితానికి అర్థం", "నేను ఎవరు", "లక్ష్యం"],
    verses: ["chandogya-6.8.7", "brihad-1.4.10", "gita-18.47", "taittiriya-3.6.1", "isha-2"],
    teachings: ["ramana-who-am-i", "vivek-one-idea", "jk-light-to-yourself"],
    practices: ["svadhyaya", "sankalpa", "osho-witness"] },
  { id: "decision", label: "Decisions & confusion", label_te: "నిర్ణయాలు & గందరగోళం",
    keywords: ["decide", "decision", "confused", "confusion", "which career", "which job", "dilemma", "should i", "నిర్ణయ", "గందరగోళ", "అయోమయ"],
    verses: ["gita-3.35", "gita-18.47", "katha-1.2.2", "gita-2.50"],
    teachings: ["silva-glass-of-water", "silva-mental-screen", "jk-light-to-yourself"],
    practices: ["silva-mirror", "svadhyaya", "pranayama"] },
  { id: "health", label: "Illness & pain", label_te: "అనారోగ్యం & నొప్పి",
    keywords: ["sick", "illness", "disease", "pain", "hospital", "health", "diagnos", "surgery", "cancer", "ఆరోగ్య", "జబ్బు", "నొప్పి", "వ్యాధి", "ఆసుపత్ర"],
    verses: ["gita-2.14", "katha-1.2.18", "taittiriya-2.9.1", "gita-6.16"],
    teachings: ["tolle-acceptance", "silva-better-and-better", "tolle-inner-body"],
    practices: ["pranayama", "japa", "gratitude"] },
  { id: "sleep-balance", label: "Sleep, food & balance", label_te: "నిద్ర, ఆహారం & సమతుల్యత",
    keywords: ["sleep", "insomnia", "tired", "diet", "overeat", "weight", "exercise", "నిద్ర", "ఆహార", "అలసట", "బరువు"],
    verses: ["gita-6.16", "gita-3.8", "gita-6.5"],
    teachings: ["silva-glass-of-water", "tolle-inner-body", "osho-now-totally"],
    practices: ["mitahara", "silva-countdown", "pranayama"] },
  { id: "honesty", label: "Honesty & right action", label_te: "నిజాయితీ & ధర్మం",
    keywords: [ " lie", " lies", "lying", "lied", "honest", "honesty", "truth", "guilt", "guilty", "wrong thing", "ethic", "నిజాయితీ", "అబద్ధ", "సత్య", "అపరాధ"],
    verses: ["mundaka-3.1.6", "taittiriya-1.11.1", "gita-17.15", "gita-3.35"],
    teachings: ["gurdjieff-many-is", "jk-light-to-yourself", "jk-conditioning"],
    practices: ["svadhyaya", "kind-speech", "gurdjieff-habit-watch"] },
  { id: "success", label: "Success & results", label_te: "విజయం & ఫలితాలు",
    keywords: ["success", "successful", "result", "achieve", "expectation", "pressure to perform", "విజయ", "ఫలిత", "సాధించ"],
    verses: ["gita-2.47", "gita-2.48", "brihad-4.4.5", "gita-5.10", "gita-18.78"],
    teachings: ["neville-live-in-end", "vivek-one-idea", "osho-celebration"],
    practices: ["sankalpa", "neville-end", "silva-mirror"] },
  { id: "manifestation", label: "Intention & manifestation", label_te: "సంకల్పం",
    keywords: ["manifest", "law of attraction", "attract", "intention", "visualiz", "visualis", "affirmation", "sankalpa", "సంకల్ప", "ఆకర్షణ"],
    verses: ["brihad-4.4.5", "gita-6.5", "mundaka-2.2.4", "gita-2.47"],
    teachings: ["neville-assumption", "neville-live-in-end", "neville-persistence", "silva-mental-screen"],
    practices: ["sankalpa", "neville-end", "silva-mirror"] },
  { id: "faith", label: "God, faith & spiritual practice", label_te: "దైవం, భక్తి & సాధన",
    keywords: ["god", "faith", "prayer", "pray", "spiritual", "devotion", "doubt", "temple", "moksha", "enlighten", "దేవుడ", "దైవ", "భక్తి", "ప్రార్థన", "ఆధ్యాత్మ", "మోక్ష"],
    verses: ["katha-1.2.23", "gita-9.22", "kena-1.5", "mandukya-2", "shvetashvatara-6.11"],
    teachings: ["ramana-surrender", "ramana-who-am-i", "jk-light-to-yourself"],
    practices: ["japa", "osho-witness", "svadhyaya"] },
  { id: "giving", label: "Giving & helping others", label_te: "దానం & సేవ",
    keywords: ["give back", "charity", "donate", "donation", "help others", "helping others", "seva", "volunteer", "దానం", "సేవ", "సహాయం చేయ"],
    verses: ["taittiriya-1.11.3", "taittiriya-3.9", "isha-6", "brihad-5.2.3"],
    teachings: ["vivek-work-worship", "osho-celebration", "osho-zorba-buddha"],
    practices: ["seva", "gratitude"] },
  { id: "hard-times", label: "Hard times & change", label_te: "కష్టకాలం & మార్పు",
    keywords: ["hard time", "difficult time", "struggl", "suffering", "uncertain", "crisis", "too many problems", "everything is going wrong", "కష్ట", "సమస్యలు", "బాధల"],
    verses: ["gita-2.14", "gita-2.48", "gita-2.3", "isha-7", "purnam"],
    teachings: ["tolle-acceptance", "vivek-strength", "gurdjieff-intentional-suffering"],
    practices: ["pranayama", "gratitude", "neville-end"] },
  { id: "leadership", label: "Leadership & responsibility", label_te: "నాయకత్వం & బాధ్యత",
    keywords: ["leader", "leadership", "my team", "responsibility", "responsible", "lead a team", "బాధ్యత", "నాయకత్వ"],
    verses: ["gita-3.21", "gita-3.8", "gita-2.50", "gita-12.13"],
    teachings: ["vivek-work-worship", "gurdjieff-fourth-way", "vivek-strength"],
    practices: ["gurdjieff-self-remembering", "kind-speech", "svadhyaya"] },
];

export const TOPIC_BY_ID = Object.fromEntries(TOPICS.map((t) => [t.id, t]));

/**
 * Finds the best-matching topics for a question (up to 2), by counting keyword matches.
 * Returns [] when nothing matches; the AI then chooses from the whole library.
 */
export function matchTopics(text, max = 2) {
  const q = ` ${String(text).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ")} `;
  return TOPICS
    .map((t, order) => ({ t, order, score: t.keywords.filter((k) => q.includes(k)).length }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, max)
    .map((x) => ({ ...x.t, score: x.score }));
}

/** A "strong" match (2+ keywords of the best topic) limits the AI to the topic's verses;
 *  a weak match (1 keyword) only recommends them, because one word can be misleading. */
export const isStrongMatch = (topics) => (topics[0]?.score ?? 0) >= 2;

/** Verses (best first) and practices recommended for the matched topics. */
export function recommendations(topics) {
  const verses = [...new Set(topics.flatMap((t) => t.verses))];
  const practices = [...new Set(topics.flatMap((t) => t.practices))];
  const teachings = [...new Set(topics.flatMap((t) => t.teachings ?? []))];
  return { verses, practices, teachings };
}

// Safety check at startup: every id in the map must exist in the libraries.
for (const t of TOPICS) {
  for (const v of t.verses) if (!VERSE_BY_ID[v]) throw new Error(`topics.js: unknown verse "${v}" in topic "${t.id}"`);
  for (const p of t.practices) if (!PRACTICE_BY_ID[p]) throw new Error(`topics.js: unknown practice "${p}" in topic "${t.id}"`);
  for (const x of t.teachings ?? []) if (!TEACHING_BY_ID[x]) throw new Error(`topics.js: unknown teaching "${x}" in topic "${t.id}"`);
}
