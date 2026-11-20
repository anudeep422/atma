// Daily affirmations library (English + Telugu), grouped by life area.
// Short, first person, present tense, positive. No promises of specific results.
// Please have a native Telugu speaker review before launch.

const A = (area, en, te) => ({ area, en, te });

export const AFFIRMATIONS = [
  // ---- general (for everyone) ----
  A("general", "I begin this day with a calm and open heart.", "ప్రశాంతమైన, విశాలమైన హృదయంతో ఈ రోజును ప్రారంభిస్తున్నాను."),
  A("general", "I do my best today and let go of the rest.", "ఈ రోజు నా వంతు ఉత్తమంగా చేసి, మిగతాది వదిలేస్తున్నాను."),
  A("general", "I am whole, just as I am.", "నేను ఉన్నట్లుగానే సంపూర్ణుడిని."),
  A("general", "Every breath brings me back to peace.", "ప్రతి శ్వాస నన్ను శాంతికి తిరిగి తీసుకువస్తుంది."),
  A("general", "I choose kindness in my words and actions.", "నా మాటల్లో, చేతల్లో దయను ఎంచుకుంటున్నాను."),
  A("general", "I live fully today, without clinging.", "ఈ రోజు ఆసక్తి లేకుండా, సంపూర్ణంగా జీవిస్తున్నాను."),
  A("general", "I take one small step forward today.", "ఈ రోజు ఒక చిన్న అడుగు ముందుకు వేస్తున్నాను."),
  A("general", "The divine light within me guides my way.", "నాలోని దివ్య కాంతి నా మార్గాన్ని చూపిస్తుంది."),
  A("general", "I am grateful for this new day.", "ఈ కొత్త రోజుకు నేను కృతజ్ఞుడిని."),
  A("general", "I meet whatever comes today with courage.", "ఈ రోజు ఏది వచ్చినా ధైర్యంగా ఎదుర్కొంటున్నాను."),
  A("general", "I am the witness; my thoughts come and go.", "నేను సాక్షిని; నా ఆలోచనలు వస్తాయి, పోతాయి."),
  A("general", "I act with full heart and leave the results to the Divine.", "మనస్ఫూర్తిగా కర్మ చేస్తూ, ఫలితాన్ని భగవంతునికి వదిలేస్తున్నాను."),
  A("general", "Today I notice the good around me.", "ఈ రోజు నా చుట్టూ ఉన్న మంచిని గమనిస్తున్నాను."),
  A("general", "I am growing a little wiser every day.", "ప్రతి రోజు నేను కొంచెం జ్ఞానవంతుడిని అవుతున్నాను."),
  A("general", "My mind is calm, my heart is light.", "నా మనసు ప్రశాంతంగా, నా హృదయం తేలికగా ఉంది."),

  // ---- parenting ----
  A("parenting", "I guide my children more by my example than by my words.", "నా మాటల కంటే నా ఆచరణతోనే నా పిల్లలకు మార్గం చూపిస్తున్నాను."),
  A("parenting", "I speak to my child once, calmly, and I listen.", "నా బిడ్డతో ఒక్కసారి ప్రశాంతంగా చెప్పి, వింటున్నాను."),
  A("parenting", "I see the best in my child and speak to it.", "నా బిడ్డలోని మంచిని చూసి, దానితో మాట్లాడుతున్నాను."),
  A("parenting", "Patience is my gift to my family today.", "ఈ రోజు నా కుటుంబానికి నా బహుమతి ఓర్పు."),
  A("parenting", "My home is filled with respect and warmth.", "నా ఇల్లు గౌరవం, ఆప్యాయతతో నిండి ఉంది."),
  A("parenting", "I correct with love, never with anger.", "కోపంతో కాదు, ప్రేమతో సరిదిద్దుతున్నాను."),
  A("parenting", "I give my children my full attention, even for a few minutes.", "కొన్ని నిమిషాలైనా నా పిల్లలకు నా పూర్తి శ్రద్ధను ఇస్తున్నాను."),
  A("parenting", "My children are learning, and so am I.", "నా పిల్లలు నేర్చుకుంటున్నారు, నేను కూడా."),

  // ---- relationships & family ----
  A("relationships", "I listen fully before I reply.", "జవాబు చెప్పే ముందు పూర్తిగా వింటున్నాను."),
  A("relationships", "I give love that gives freedom.", "స్వేచ్ఛనిచ్చే ప్రేమను ఇస్తున్నాను."),
  A("relationships", "My words are true, kind and helpful.", "నా మాటలు సత్యంగా, దయగా, ఉపయోగకరంగా ఉంటాయి."),
  A("relationships", "I forgive, and I set myself free.", "నేను క్షమిస్తున్నాను, నన్ను నేను విముక్తం చేసుకుంటున్నాను."),
  A("relationships", "I see the same Self in everyone I meet.", "నేను కలిసే ప్రతి ఒక్కరిలో ఒకే ఆత్మను చూస్తున్నాను."),
  A("relationships", "I honour my parents and elders with gentle words.", "మృదువైన మాటలతో నా తల్లిదండ్రులను, పెద్దలను గౌరవిస్తున్నాను."),
  A("relationships", "I let go of the need to be right.", "నేనే సరైనవాడిని అనే ఆరాటాన్ని వదిలేస్తున్నాను."),
  A("relationships", "My relationships are a mirror; I learn from each one.", "నా అనుబంధాలు ఒక అద్దం; ప్రతి దానినుండి నేర్చుకుంటున్నాను."),
  A("relationships", "I bring peace, not conflict, into my home.", "నా ఇంట్లోకి సంఘర్షణను కాదు, శాంతిని తెస్తున్నాను."),
  A("relationships", "I appreciate my partner and say it aloud.", "నా భాగస్వామిని మెచ్చుకుని, బయటకు చెబుతున్నాను."),

  // ---- anger & calm ----
  A("calm", "I pause and breathe before I respond.", "స్పందించే ముందు ఆగి శ్వాస తీసుకుంటున్నాను."),
  A("calm", "I understand my anger; it does not control me.", "నా కోపాన్ని అర్థం చేసుకుంటున్నాను; అది నన్ను నియంత్రించదు."),
  A("calm", "I stay steady like the deep ocean.", "లోతైన సముద్రంలా స్థిరంగా ఉంటున్నాను."),
  A("calm", "Peace is my natural state.", "శాంతి నా సహజ స్థితి."),
  A("calm", "I choose calm words, even when I feel upset.", "కలత చెందినప్పుడు కూడా ప్రశాంతమైన మాటలు ఎంచుకుంటున్నాను."),
  A("calm", "I let irritation pass like a cloud.", "చిరాకును మేఘంలా దాటిపోనిస్తున్నాను."),
  A("calm", "I am patient with others and with myself.", "ఇతరులతో, నాతో నేను ఓర్పుగా ఉంటున్నాను."),
  A("calm", "Each breath softens my heart.", "ప్రతి శ్వాస నా హృదయాన్ని మృదువుగా చేస్తుంది."),

  // ---- anxiety & fear ----
  A("peace", "I am safe in this present moment.", "ఈ క్షణంలో నేను సురక్షితంగా ఉన్నాను."),
  A("peace", "I do my part and trust the rest.", "నా వంతు చేసి, మిగతాది నమ్ముతున్నాను."),
  A("peace", "I release worry about what I cannot control.", "నా చేతిలో లేని వాటి గురించి ఆందోళనను వదిలేస్తున్నాను."),
  A("peace", "My breath is slow, my mind is quiet.", "నా శ్వాస నెమ్మదిగా, నా మనసు నిశ్శబ్దంగా ఉంది."),
  A("peace", "I take life one step at a time.", "జీవితాన్ని ఒక్కో అడుగు వేస్తూ తీసుకుంటున్నాను."),
  A("peace", "Fear is a feeling; it is not the truth.", "భయం ఒక భావన మాత్రమే; అది సత్యం కాదు."),
  A("peace", "I am held by something greater than my worries.", "నా ఆందోళనల కంటే గొప్ప శక్తి నన్ను కాపాడుతోంది."),
  A("peace", "Right now, all is well.", "ఈ క్షణం, అంతా బాగుంది."),
  A("peace", "I return to now, again and again.", "మళ్ళీ మళ్ళీ ఈ క్షణానికి తిరిగి వస్తున్నాను."),

  // ---- confidence & strength ----
  A("confidence", "I believe in myself and in the strength within me.", "నన్ను, నాలోని శక్తిని నేను నమ్ముతున్నాను."),
  A("confidence", "I lift myself up; I am my own best friend.", "నన్ను నేను ఉద్ధరించుకుంటున్నాను; నాకు నేనే మంచి మిత్రుడిని."),
  A("confidence", "I am enough, and I am growing.", "నేను సరిపోతాను, ఎదుగుతున్నాను."),
  A("confidence", "I walk my own path with courage.", "నా సొంత మార్గంలో ధైర్యంగా నడుస్తున్నాను."),
  A("confidence", "Mistakes help me learn; they do not define me.", "తప్పులు నాకు నేర్పుతాయి; అవి నన్ను నిర్వచించవు."),
  A("confidence", "Strength is my nature, not weakness.", "బలహీనత కాదు, బలమే నా స్వభావం."),
  A("confidence", "I stop comparing and start creating.", "పోల్చుకోవడం ఆపి, సృష్టించడం మొదలుపెడుతున్నాను."),
  A("confidence", "I speak kindly to myself today.", "ఈ రోజు నాతో నేను దయగా మాట్లాడుకుంటున్నాను."),
  A("confidence", "I rise every time I fall.", "పడిన ప్రతిసారీ లేచి నిలబడుతున్నాను."),
  A("confidence", "The infinite is within me.", "అనంతం నాలోనే ఉంది."),

  // ---- discipline & habits ----
  A("discipline", "I keep my small promises to myself.", "నాకు నేను ఇచ్చిన చిన్న మాటలను నిలబెట్టుకుంటున్నాను."),
  A("discipline", "Steady practice makes my mind strong.", "నిరంతర అభ్యాసం నా మనసును బలంగా చేస్తుంది."),
  A("discipline", "I choose what is good over what is merely pleasant.", "కేవలం ఆహ్లాదకరమైన దానికంటే మంచినే ఎంచుకుంటున్నాను."),
  A("discipline", "When an old habit calls, I pause and choose again.", "పాత అలవాటు పిలిచినప్పుడు, ఆగి మళ్ళీ ఎంచుకుంటున్నాను."),
  A("discipline", "I start now, with one small action.", "ఇప్పుడే, ఒక చిన్న పనితో ప్రారంభిస్తున్నాను."),
  A("discipline", "I am the master of my habits, not their servant.", "నేను నా అలవాట్లకు యజమానిని, బానిసను కాదు."),
  A("discipline", "I use my phone with awareness, not by habit.", "అలవాటుతో కాదు, ఎరుకతో ఫోన్ వాడుతున్నాను."),
  A("discipline", "I eat, sleep and work in balance.", "ఆహారం, నిద్ర, పనిలో సమతుల్యతతో ఉంటున్నాను."),
  A("discipline", "Each day I get a little more consistent.", "ప్రతి రోజు నేను కొంచెం ఎక్కువ క్రమబద్ధంగా అవుతున్నాను."),
  A("discipline", "I watch my habits clearly, and they lose their hold.", "నా అలవాట్లను స్పష్టంగా గమనిస్తున్నాను, అవి పట్టు కోల్పోతున్నాయి."),
  A("discipline", "I wake up with purpose and energy.", "లక్ష్యంతో, ఉత్సాహంతో నిద్ర లేస్తున్నాను."),

  // ---- work, career & studies ----
  A("work", "I give my full attention to the work in front of me.", "నా ముందున్న పనికి నా పూర్తి శ్రద్ధను ఇస్తున్నాను."),
  A("work", "I work with skill and let go of anxiety about results.", "నైపుణ్యంతో పని చేస్తూ, ఫలితాల ఆందోళనను వదిలేస్తున్నాను."),
  A("work", "My work is my worship.", "నా పనే నా పూజ."),
  A("work", "I learn something new every day.", "ప్రతి రోజు కొత్తది నేర్చుకుంటున్నాను."),
  A("work", "I stay calm and clear under pressure.", "ఒత్తిడిలో కూడా ప్రశాంతంగా, స్పష్టంగా ఉంటున్నాను."),
  A("work", "I study with focus, and knowledge stays with me.", "ఏకాగ్రతతో చదువుతున్నాను, జ్ఞానం నాతో నిలుస్తుంది."),
  A("work", "I follow my own path, not someone else's.", "వేరొకరి మార్గం కాదు, నా సొంత మార్గాన్ని అనుసరిస్తున్నాను."),
  A("work", "Success and failure do not shake my peace.", "విజయం, అపజయం నా శాంతిని కదిలించవు."),
  A("work", "I take one idea and give it my whole heart.", "ఒక ఆలోచనను తీసుకుని దానికి నా మనసంతా ఇస్తున్నాను."),
  A("work", "I bring honesty and excellence to everything I do.", "నేను చేసే ప్రతి పనిలో నిజాయితీ, శ్రేష్ఠత తెస్తున్నాను."),

  // ---- money & abundance (dharmic) ----
  A("abundance", "I earn honestly and use money wisely.", "నిజాయితీగా సంపాదిస్తూ, డబ్బును తెలివిగా వాడుతున్నాను."),
  A("abundance", "I am open to abundance through right effort.", "సరైన కృషి ద్వారా సమృద్ధికి నేను సిద్ధంగా ఉన్నాను."),
  A("abundance", "I give generously, and life flows through me.", "ఉదారంగా ఇస్తున్నాను, జీవితం నా ద్వారా ప్రవహిస్తుంది."),
  A("abundance", "I am grateful for what I already have.", "ఇప్పటికే నాకున్న దానికి కృతజ్ఞుడిని."),
  A("abundance", "My skills grow, and so does my value.", "నా నైపుణ్యాలు పెరుగుతున్నాయి, నా విలువ కూడా."),
  A("abundance", "I spend with awareness and save with discipline.", "ఎరుకతో ఖర్చు చేస్తూ, క్రమశిక్షణతో పొదుపు చేస్తున్నాను."),
  A("abundance", "Wealth comes to me through dharma, and I share it.", "సంపద ధర్మం ద్వారా నాకు వస్తుంది, దాన్ని పంచుకుంటున్నాను."),
  A("abundance", "I feel the joy of my goal already fulfilled, and I act for it today.", "నా లక్ష్యం నెరవేరిన ఆనందాన్ని అనుభవిస్తూ, ఈ రోజు దాని కోసం పని చేస్తున్నాను."),
  A("abundance", "I enjoy what I have without being owned by it.", "నాకున్నదాన్ని దానికి బానిస కాకుండా ఆస్వాదిస్తున్నాను."),

  // ---- health & body ----
  A("health", "I care for my body with good food, rest and movement.", "మంచి ఆహారం, విశ్రాంతి, వ్యాయామంతో నా శరీరాన్ని చూసుకుంటున్నాను."),
  A("health", "I listen to my body with kindness.", "దయతో నా శరీరం చెప్పేది వింటున్నాను."),
  A("health", "Each breath fills me with life and calm.", "ప్రతి శ్వాస నన్ను జీవశక్తితో, ప్రశాంతతతో నింపుతుంది."),
  A("health", "I accept this moment and do what helps me heal.", "ఈ క్షణాన్ని అంగీకరించి, నయం కావడానికి సహాయపడేది చేస్తున్నాను."),
  A("health", "I am more than this body; my spirit is strong.", "నేను ఈ శరీరం కంటే ఎక్కువ; నా ఆత్మ బలమైనది."),
  A("health", "I sleep peacefully and wake up refreshed.", "ప్రశాంతంగా నిద్రించి, తాజాగా లేస్తున్నాను."),

  // ---- grief & healing ----
  A("healing", "Love never dies; it lives on in my heart.", "ప్రేమ ఎప్పటికీ చావదు; అది నా హృదయంలో జీవిస్తుంది."),
  A("healing", "I allow myself to grieve and to heal, gently.", "దుఃఖించడానికి, మెల్లగా నయం కావడానికి నన్ను అనుమతించుకుంటున్నాను."),
  A("healing", "The Self is eternal; nothing real is ever lost.", "ఆత్మ శాశ్వతం; నిజమైనదేదీ ఎప్పటికీ కోల్పోబడదు."),
  A("healing", "I carry forward the love I was given.", "నాకు లభించిన ప్రేమను ముందుకు తీసుకువెళ్తున్నాను."),
  A("healing", "Each day, my heart grows a little lighter.", "ప్రతి రోజు, నా హృదయం కొంచెం తేలికవుతోంది."),
  A("healing", "I am never truly alone; the Divine is with me.", "నేను ఎప్పుడూ నిజంగా ఒంటరిని కాను; భగవంతుడు నాతో ఉన్నాడు."),

  // ---- gratitude & joy ----
  A("joy", "I celebrate the small joys of today.", "ఈ రోజు చిన్న చిన్న ఆనందాలను వేడుక చేసుకుంటున్నాను."),
  A("joy", "Happiness is my nature; I return to it.", "ఆనందమే నా స్వభావం; దానికి తిరిగి వస్తున్నాను."),
  A("joy", "I laugh easily and take life lightly.", "సులభంగా నవ్వుతూ, జీవితాన్ని తేలికగా తీసుకుంటున్నాను."),
  A("joy", "I am thankful for the people in my life.", "నా జీవితంలోని వ్యక్తులకు కృతజ్ఞుడిని."),
  A("joy", "Joy grows when I share it.", "పంచుకున్నప్పుడు ఆనందం పెరుగుతుంది."),
  A("joy", "Today I serve someone without expecting anything back.", "ఈ రోజు ప్రతిఫలం ఆశించకుండా ఎవరికైనా సేవ చేస్తున్నాను."),
  A("joy", "Contentment is my true wealth.", "సంతృప్తే నా నిజమైన సంపద."),

  // ---- spiritual & awareness ----
  A("spirit", "I am not my thoughts; I am the awareness that sees them.", "నేను నా ఆలోచనలు కాదు; వాటిని చూసే ఎరుకను."),
  A("spirit", "Tat tvam asi: the infinite is my true Self.", "తత్ త్వమ్ అసి: అనంతమే నా నిజ స్వరూపం."),
  A("spirit", "I rest in the stillness within.", "లోపలి నిశ్చలతలో విశ్రాంతి తీసుకుంటున్నాను."),
  A("spirit", "I see the Divine in all beings.", "అన్ని జీవులలో భగవంతుడిని చూస్తున్నాను."),
  A("spirit", "I remember myself in every action today.", "ఈ రోజు ప్రతి పనిలో నన్ను నేను గుర్తుంచుకుంటున్నాను."),
  A("spirit", "I am a light unto myself.", "నాకు నేనే దీపం."),
  A("spirit", "Lead me from darkness to light, from fear to peace.", "చీకటి నుండి వెలుగుకు, భయం నుండి శాంతికి నన్ను నడిపించు."),
  A("spirit", "I live in the world, and the world does not bind me.", "నేను లోకంలో జీవిస్తున్నాను, లోకం నన్ను బంధించదు."),
  A("spirit", "Like a lotus leaf, I stay untouched by worry.", "తామరాకులా, ఆందోళన నన్ను అంటదు."),
  A("spirit", "Om, peace, peace, peace.", "ఓం శాంతిః శాంతిః శాంతిః."),
];

// Which affirmation group fits each topic of the topic map.
export const TOPIC_TO_AREA = {
  parenting: "parenting", marriage: "relationships", "parents-elders": "relationships", forgiveness: "relationships",
  heartbreak: "healing", loneliness: "healing", grief: "healing",
  anger: "calm", anxiety: "peace", overthinking: "peace", "hard-times": "peace", health: "health", "sleep-balance": "health",
  confidence: "confidence", comparison: "confidence", failure: "confidence",
  habits: "discipline", discipline: "discipline", addiction: "discipline",
  "work-stress": "work", exams: "work", decision: "work", success: "work", leadership: "work", purpose: "spirit",
  money: "abundance", manifestation: "abundance", giving: "joy", contentment: "joy",
  faith: "spirit", honesty: "spirit",
};

/** Number of the day (same for everyone on a date), used to rotate content. */
export const dayNumber = (date = new Date()) => Math.floor(date.getTime() / 86_400_000);

/** Today's library affirmation for an area (falls back to "general"). */
export function affirmationFor(area, date = new Date()) {
  const list = AFFIRMATIONS.filter((a) => a.area === area);
  const pool = list.length ? list : AFFIRMATIONS.filter((a) => a.area === "general");
  return pool[dayNumber(date) % pool.length];
}
