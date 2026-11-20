// Guided meditations library (English + Telugu), written in our own words.
// Each meditation has steps; the player shares the chosen session time between them by "w" (weight).
// "breath" (optional) drives the breathing circle: seconds for in / hold / out / hold2.
// "goodFor" tags power the filters and suggestions. Please have the content reviewed before launch.

const S = (w, en, te) => ({ w, en, te });

export const MEDITATIONS = [
  // ---- Buddha ----
  {
    id: "anapanasati", source: "The Buddha (Ānāpānasati)", source_te: "బుద్ధుడు (ఆనాపానసతి)",
    name: "Ānāpānasati: mindfulness of breathing", name_te: "ఆనాపానసతి: శ్వాసపై ఎరుక",
    goodFor: ["calm", "focus", "anxiety", "awareness"], minutes: 10,
    steps: [
      S(1, "Sit comfortably with your back upright. Close your eyes and let the body settle.", "వెన్ను నిటారుగా ఉంచి సౌకర్యంగా కూర్చోండి. కళ్ళు మూసుకుని శరీరాన్ని స్థిరపడనివ్వండి."),
      S(3, "Feel the natural breath at the nostrils. Don't control it. Simply know: breathing in… breathing out.", "ముక్కు దగ్గర సహజ శ్వాసను అనుభవించండి. దానిని నియంత్రించకండి. కేవలం తెలుసుకోండి: శ్వాస లోపలికి… శ్వాస బయటికి."),
      S(2, "Notice a long breath as long, and a short breath as short. Just know it, without changing it.", "దీర్ఘ శ్వాసను దీర్ఘమని, చిన్న శ్వాసను చిన్నదని గమనించండి. మార్చకుండా కేవలం తెలుసుకోండి."),
      S(2, "Now feel the whole body breathing, from head to toe, alive and calm.", "ఇప్పుడు తల నుండి కాలి వరకు శరీరమంతా శ్వాసిస్తున్నట్లు అనుభవించండి, సజీవంగా, ప్రశాంతంగా."),
      S(2, "With each out-breath, let the body relax a little more.", "ప్రతి బయటి శ్వాసతో శరీరాన్ని ఇంకొంచెం విశ్రాంతిగా వదలండి."),
      S(3, "Rest in this calm. When the mind wanders, gently return to the breath, without blame.", "ఈ ప్రశాంతతలో విశ్రాంతి తీసుకోండి. మనసు పక్కకు వెళ్తే, నిందించకుండా మెల్లగా శ్వాసకు తిరిగి రండి."),
      S(1, "Slowly open your eyes. Carry this calm with you.", "నెమ్మదిగా కళ్ళు తెరవండి. ఈ ప్రశాంతతను మీతో తీసుకువెళ్ళండి."),
    ],
  },
  {
    id: "body-scan", source: "Buddhist Vipassana tradition", source_te: "బౌద్ధ విపశ్యన సంప్రదాయం",
    name: "Body scan (Vipassana)", name_te: "శరీర పరిశీలన (విపశ్యన)",
    goodFor: ["calm", "sleep", "awareness", "anxiety"], minutes: 10,
    steps: [
      S(1, "Sit or lie down comfortably. Close your eyes and take three slow breaths.", "సౌకర్యంగా కూర్చోండి లేదా పడుకోండి. కళ్ళు మూసుకుని మూడు సార్లు నెమ్మదిగా శ్వాస తీసుకోండి."),
      S(2, "Bring attention to the top of your head. Notice any sensation: warmth, tingling, pressure, or nothing at all.", "తల పైభాగంపై దృష్టి పెట్టండి. ఏ అనుభూతినైనా గమనించండి: వెచ్చదనం, జలదరింపు, ఒత్తిడి, లేదా ఏమీ లేకపోవడం."),
      S(2, "Slowly move down: face, neck, shoulders, arms and hands. Just observe, without liking or disliking.", "నెమ్మదిగా కిందకు రండి: ముఖం, మెడ, భుజాలు, చేతులు. ఇష్టం, అయిష్టం లేకుండా కేవలం గమనించండి."),
      S(2, "Now the chest, stomach and back. Notice the breath moving the body.", "ఇప్పుడు ఛాతీ, పొట్ట, వీపు. శ్వాస శరీరాన్ని కదిలించడాన్ని గమనించండి."),
      S(2, "Move down through the hips, legs and feet, to the tips of the toes.", "నడుము, కాళ్ళు, పాదాల ద్వారా కాలి వేళ్ళ కొనల వరకు దిగండి."),
      S(2, "Feel the whole body at once. Every sensation arises and passes. Everything changes.", "శరీరాన్నంతా ఒకేసారి అనుభవించండి. ప్రతి అనుభూతి పుడుతుంది, పోతుంది. అన్నీ మారుతూ ఉంటాయి."),
      S(1, "Take a deep breath, move your fingers gently, and open your eyes.", "లోతుగా శ్వాస తీసుకుని, వేళ్ళను మెల్లగా కదిలించి, కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "metta", source: "The Buddha (Mettā)", source_te: "బుద్ధుడు (మైత్రి)",
    name: "Mettā: loving-kindness", name_te: "మైత్రి: ప్రేమపూర్వక దయ",
    goodFor: ["love", "anger", "forgiveness", "calm"], minutes: 10,
    steps: [
      S(1, "Sit comfortably, close your eyes and place a hand on your heart.", "సౌకర్యంగా కూర్చుని, కళ్ళు మూసుకుని, చేతిని గుండెపై ఉంచండి."),
      S(2, "Silently wish yourself well: May I be happy. May I be healthy. May I be at peace.", "మనసులో మీకు మీరు శుభం కోరుకోండి: నేను సంతోషంగా ఉండాలి. ఆరోగ్యంగా ఉండాలి. శాంతిగా ఉండాలి."),
      S(2, "Now picture someone you love. May you be happy. May you be healthy. May you be at peace.", "ఇప్పుడు మీరు ప్రేమించే వ్యక్తిని ఊహించండి. మీరు సంతోషంగా ఉండాలి. ఆరోగ్యంగా ఉండాలి. శాంతిగా ఉండాలి."),
      S(2, "Picture someone neutral, perhaps a shopkeeper or neighbour, and send them the same wishes.", "ఒక సాధారణ వ్యక్తిని, ఉదాహరణకు దుకాణదారుడిని లేదా పొరుగువారిని ఊహించి, వారికీ అవే శుభాకాంక్షలు పంపండి."),
      S(2, "Now, gently, someone difficult. If it is hard, start small: May you be free from suffering.", "ఇప్పుడు మెల్లగా, కష్టమైన వ్యక్తిని. కష్టంగా అనిపిస్తే చిన్నగా ప్రారంభించండి: మీరు బాధ నుండి విముక్తులు కావాలి."),
      S(2, "Let the wishes spread to all beings everywhere: May all beings be happy and free.", "ఈ శుభాకాంక్షలు అంతటా ఉన్న అన్ని జీవులకు వ్యాపించనివ్వండి: సర్వే జనాః సుఖినో భవంతు."),
      S(1, "Rest in this warmth for a moment, then slowly open your eyes.", "ఈ వెచ్చదనంలో ఒక్క క్షణం ఉండి, నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "walking", source: "Buddhist tradition", source_te: "బౌద్ధ సంప్రదాయం",
    name: "Walking meditation", name_te: "నడక ధ్యానం",
    goodFor: ["focus", "energy", "awareness"], minutes: 10, eyesOpen: true,
    steps: [
      S(1, "Stand still for a moment. Feel your feet on the ground and the weight of your body.", "ఒక్క క్షణం నిశ్చలంగా నిలబడండి. నేలపై పాదాలను, శరీర బరువును అనుభవించండి."),
      S(3, "Walk very slowly. Notice each part of the step: lifting… moving… placing.", "చాలా నెమ్మదిగా నడవండి. అడుగులో ప్రతి భాగాన్ని గమనించండి: ఎత్తడం… కదలడం… పెట్టడం."),
      S(3, "Keep your eyes softly ahead. When the mind wanders, come back to the feeling of the feet.", "కళ్ళను మెల్లగా ముందుకు ఉంచండి. మనసు పక్కకు వెళ్తే, పాదాల అనుభూతికి తిరిగి రండి."),
      S(2, "Now notice the breath and the steps together, calm and steady.", "ఇప్పుడు శ్వాసను, అడుగులను కలిపి గమనించండి, ప్రశాంతంగా, స్థిరంగా."),
      S(1, "Stand still again. Feel the whole body, alive and present.", "మళ్ళీ నిశ్చలంగా నిలబడండి. శరీరాన్నంతా సజీవంగా, వర్తమానంలో అనుభవించండి."),
    ],
  },

  // ---- Yoga & Vedic ----
  {
    id: "om-chanting", source: "Vedic tradition (Māṇḍūkya Upanishad)", source_te: "వైదిక సంప్రదాయం (మాండూక్యోపనిషత్)",
    name: "Om chanting", name_te: "ఓంకార జపం",
    goodFor: ["calm", "energy", "spiritual"], minutes: 5,
    steps: [
      S(1, "Sit upright, close your eyes and take a deep breath.", "నిటారుగా కూర్చుని, కళ్ళు మూసుకుని, లోతుగా శ్వాస తీసుకోండి."),
      S(4, "Chant Om slowly on each out-breath: Aaa… Ooo… Mmm. Feel the sound move from the belly to the chest to the head.", "ప్రతి బయటి శ్వాసపై ఓంకారాన్ని నెమ్మదిగా జపించండి: అ… ఉ… మ్. శబ్దం పొట్ట నుండి ఛాతీకి, తలకు కదలడాన్ని అనుభవించండి."),
      S(3, "Let the chanting become softer and softer, until it is only inside.", "జపం మెల్లగా, ఇంకా మెల్లగా అయి, లోపల మాత్రమే మిగిలే వరకు తగ్గనివ్వండి."),
      S(2, "Now sit in the silence after the sound. This silence is the fourth state, beyond A, U and M.", "ఇప్పుడు శబ్దం తర్వాతి నిశ్శబ్దంలో కూర్చోండి. ఈ నిశ్శబ్దమే అ, ఉ, మ్ లకు అతీతమైన నాలుగో స్థితి (తురీయం)."),
      S(1, "Rub your palms together, place them on your eyes, and slowly open them.", "అరచేతులను రుద్ది, కళ్ళపై ఉంచి, నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "so-ham", source: "Yoga tradition (Ajapa japa)", source_te: "యోగ సంప్రదాయం (అజపా జపం)",
    name: "So-Ham breath mantra", name_te: "సోహం శ్వాస మంత్రం",
    goodFor: ["anxiety", "focus", "calm", "spiritual"], minutes: 10, breath: { in: 4, hold: 0, out: 6, hold2: 0 },
    steps: [
      S(1, "Sit comfortably and close your eyes. Let the breath become slow and easy.", "సౌకర్యంగా కూర్చుని కళ్ళు మూసుకోండి. శ్వాసను నెమ్మదిగా, సులభంగా ఉండనివ్వండి."),
      S(4, "As you breathe in, silently hear \"So\". As you breathe out, hear \"Ham\". So-Ham: I am That.", "శ్వాస లోపలికి తీసుకుంటూ మనసులో \"సో\" అని వినండి. బయటికి వదులుతూ \"హం\" అని వినండి. సోహం: నేనే అది."),
      S(3, "Let the mantra and the breath become one. No effort, just gentle listening.", "మంత్రం, శ్వాస ఒక్కటయ్యేలా ఉండనివ్వండి. ప్రయత్నం లేదు, కేవలం మెల్లగా వినడం."),
      S(1, "Let go of the mantra and rest in stillness. Then open your eyes slowly.", "మంత్రాన్ని వదిలి నిశ్చలతలో విశ్రాంతి తీసుకోండి. తర్వాత నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "japa-meditation", source: "Bhakti tradition", source_te: "భక్తి సంప్రదాయం",
    name: "Japa meditation", name_te: "జప ధ్యానం",
    goodFor: ["spiritual", "focus", "calm"], minutes: 10,
    steps: [
      S(1, "Choose a name or mantra dear to you: Om Namah Shivaya, Sri Rama, Om Namo Narayanaya, or simply Om.", "మీకు ప్రియమైన నామం లేదా మంత్రాన్ని ఎంచుకోండి: ఓం నమః శివాయ, శ్రీరామ, ఓం నమో నారాయణాయ, లేదా ఓం."),
      S(4, "Repeat it slowly, aloud or silently, with love. If you have a mala, move one bead with each repetition.", "దానిని ప్రేమతో, నెమ్మదిగా, బయటకు లేదా మనసులో జపించండి. జపమాల ఉంటే ప్రతి జపానికి ఒక పూస కదపండి."),
      S(3, "When the mind wanders, return to the name without blame. Each return is the practice.", "మనసు పక్కకు వెళ్తే, నిందించకుండా నామానికి తిరిగి రండి. ప్రతి తిరిగి రావడమే సాధన."),
      S(1, "Stop the repetition and feel the quiet it leaves behind. Offer it with gratitude.", "జపం ఆపి, అది మిగిల్చిన నిశ్శబ్దాన్ని అనుభవించండి. కృతజ్ఞతతో అర్పించండి."),
    ],
  },
  {
    id: "trataka", source: "Hatha Yoga tradition", source_te: "హఠయోగ సంప్రదాయం",
    name: "Trāṭaka: candle gazing", name_te: "త్రాటకం: దీపంపై దృష్టి",
    goodFor: ["focus"], minutes: 5, eyesOpen: true,
    caution: "Keep the flame at arm's length, at eye level. Blink when needed; stop if your eyes hurt. Avoid if you have epilepsy or eye conditions.",
    caution_te: "దీపాన్ని చేయి దూరంలో, కంటి స్థాయిలో ఉంచండి. అవసరమైతే కనురెప్పలు ఆర్పండి; కళ్ళు నొప్పిగా ఉంటే ఆపండి. మూర్ఛ లేదా కంటి సమస్యలు ఉంటే చేయకండి.",
    steps: [
      S(1, "Light a lamp or candle at arm's length, at eye level, in a dim room. Sit upright.", "మసక వెలుతురు గదిలో, చేయి దూరంలో, కంటి స్థాయిలో దీపం వెలిగించండి. నిటారుగా కూర్చోండి."),
      S(3, "Gaze softly at the tip of the flame. Keep the eyes relaxed and the body still.", "దీపం కొనపై మెల్లగా చూడండి. కళ్ళను విశ్రాంతిగా, శరీరాన్ని నిశ్చలంగా ఉంచండి."),
      S(2, "Close your eyes and watch the after-image of the flame between the eyebrows.", "కళ్ళు మూసుకుని, కనుబొమ్మల మధ్య దీపం ప్రతిబింబాన్ని గమనించండి."),
      S(2, "When it fades, open your eyes and gaze again, gently.", "అది మసకబారాక, కళ్ళు తెరిచి మళ్ళీ మెల్లగా చూడండి."),
      S(1, "Close your eyes, cup your palms over them, and rest.", "కళ్ళు మూసుకుని, అరచేతులను వాటిపై ఉంచి విశ్రాంతి తీసుకోండి."),
    ],
  },
  {
    id: "bhramari", source: "Yoga tradition (Prāṇāyāma)", source_te: "యోగ సంప్రదాయం (ప్రాణాయామం)",
    name: "Bhrāmarī: humming bee breath", name_te: "భ్రామరి: తుమ్మెద శ్వాస",
    goodFor: ["anger", "anxiety", "sleep", "calm"], minutes: 5, breath: { in: 4, hold: 0, out: 8, hold2: 0, outLabel: "hum" },
    caution: "Breathe gently; never force. Stop if you feel dizzy.", caution_te: "మెల్లగా శ్వాసించండి; బలవంతం చేయకండి. తల తిరిగితే ఆపండి.",
    steps: [
      S(1, "Sit upright and close your eyes. You may gently close your ears with your thumbs.", "నిటారుగా కూర్చుని కళ్ళు మూసుకోండి. బొటనవేళ్ళతో చెవులను మెల్లగా మూయవచ్చు."),
      S(5, "Breathe in through the nose. Breathe out slowly while humming like a bee: mmmm. Feel the vibration in your head.", "ముక్కుతో శ్వాస లోపలికి తీసుకోండి. తుమ్మెదలా \"మ్మ్మ్\" అని హమ్ చేస్తూ నెమ్మదిగా వదలండి. తలలో కంపనాన్ని అనుభవించండి."),
      S(2, "Stop humming and sit in silence. Notice how quiet the mind has become.", "హమ్మింగ్ ఆపి నిశ్శబ్దంగా కూర్చోండి. మనసు ఎంత నిశ్శబ్దమైందో గమనించండి."),
      S(1, "Slowly open your eyes.", "నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "nadi-shodhana", source: "Yoga tradition (Prāṇāyāma)", source_te: "యోగ సంప్రదాయం (ప్రాణాయామం)",
    name: "Nāḍī śodhana: alternate nostril breathing", name_te: "నాడీ శోధన: అనులోమ-విలోమ",
    goodFor: ["calm", "anxiety", "focus"], minutes: 5, breath: { in: 4, hold: 0, out: 6, hold2: 0 },
    caution: "No breath-holding here. Stop if you feel dizzy.", caution_te: "ఇక్కడ శ్వాస ఆపడం లేదు. తల తిరిగితే ఆపండి.",
    steps: [
      S(1, "Sit upright. Rest your left hand on your knee and bring your right hand to your nose.", "నిటారుగా కూర్చోండి. ఎడమ చేతిని మోకాలిపై ఉంచి, కుడి చేతిని ముక్కు దగ్గరకు తెండి."),
      S(5, "Close the right nostril and breathe in through the left. Close the left, breathe out through the right. In through the right, out through the left. Keep going with the circle.", "కుడి ముక్కును మూసి ఎడమతో శ్వాస తీసుకోండి. ఎడమను మూసి కుడితో వదలండి. కుడితో తీసుకుని ఎడమతో వదలండి. వృత్తంతో పాటు కొనసాగించండి."),
      S(2, "Lower your hand and breathe naturally through both nostrils. Feel the balance.", "చేతిని దించి రెండు ముక్కులతో సహజంగా శ్వాసించండి. సమతుల్యతను అనుభవించండి."),
      S(1, "Slowly open your eyes.", "నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "yoga-nidra", source: "Yoga tradition (Yoga Nidrā)", source_te: "యోగ సంప్రదాయం (యోగ నిద్ర)",
    name: "Yoga Nidrā: deep relaxation", name_te: "యోగ నిద్ర: గాఢ విశ్రాంతి",
    goodFor: ["sleep", "calm", "anxiety"], minutes: 20,
    steps: [
      S(1, "Lie on your back, arms by your sides, palms up. Let the body become heavy.", "వెల్లకిలా పడుకోండి, చేతులు పక్కన, అరచేతులు పైకి. శరీరాన్ని బరువుగా వదలండి."),
      S(1, "Make a short sankalpa, a heartfelt intention, and repeat it three times silently.", "ఒక చిన్న సంకల్పం చేసుకుని, మనసులో మూడు సార్లు చెప్పుకోండి."),
      S(3, "Move your attention quickly around the body: right hand thumb, fingers, palm, arm… left hand… right leg… left leg… back… front… face.", "దృష్టిని శరీరమంతా వేగంగా తిప్పండి: కుడి చేతి బొటనవేలు, వేళ్ళు, అరచేయి, చేయి… ఎడమ చేయి… కుడి కాలు… ఎడమ కాలు… వీపు… ముందు భాగం… ముఖం."),
      S(2, "Feel the whole body lying here, relaxed, while you remain awake and aware.", "మీరు మెలకువగా, ఎరుకతో ఉంటూనే, శరీరమంతా ఇక్కడ విశ్రాంతిగా పడుకుని ఉన్నట్లు అనుభవించండి."),
      S(2, "Count your breaths backwards from 27 to 1. If you lose count, start again gently.", "శ్వాసలను 27 నుండి 1 వరకు వెనక్కి లెక్కించండి. లెక్క తప్పితే మెల్లగా మళ్ళీ ప్రారంభించండి."),
      S(2, "Picture a calm image: a temple at dawn, a river, a lotus. Rest in it.", "ఒక ప్రశాంత దృశ్యాన్ని ఊహించండి: తెల్లవారుజామున ఒక ఆలయం, ఒక నది, ఒక తామర. అందులో విశ్రాంతి తీసుకోండి."),
      S(1, "Repeat your sankalpa three times. Slowly move your fingers and toes, and come back.", "మీ సంకల్పాన్ని మూడు సార్లు చెప్పుకోండి. నెమ్మదిగా వేళ్ళను కదిలించి తిరిగి రండి."),
    ],
  },
  {
    id: "hridaya", source: "Vedic tradition (Hṛdaya dhyāna)", source_te: "వైదిక సంప్రదాయం (హృదయ ధ్యానం)",
    name: "Heart meditation", name_te: "హృదయ ధ్యానం",
    goodFor: ["love", "spiritual", "calm"], minutes: 10,
    steps: [
      S(1, "Sit comfortably, close your eyes and bring your attention to the centre of your chest.", "సౌకర్యంగా కూర్చుని, కళ్ళు మూసుకుని, ఛాతీ మధ్యలో దృష్టి పెట్టండి."),
      S(3, "Imagine a small, soft light there, like a lamp in a temple. With each breath it glows a little brighter.", "అక్కడ ఆలయంలో దీపంలా ఒక చిన్న, మృదువైన కాంతిని ఊహించండి. ప్రతి శ్వాసతో అది ఇంకొంచెం ప్రకాశిస్తుంది."),
      S(3, "Let the light fill your whole body, then spread around you to your family, your home and the whole world.", "ఆ కాంతి మీ శరీరమంతా నిండి, తర్వాత మీ కుటుంబానికి, ఇంటికి, ప్రపంచమంతటికీ వ్యాపించనివ్వండి."),
      S(2, "Rest as that light. The Upanishads say the Divine lives in the cave of the heart.", "ఆ కాంతిగా విశ్రాంతి తీసుకోండి. భగవంతుడు హృదయ గుహలో నివసిస్తాడని ఉపనిషత్తులు చెబుతాయి."),
      S(1, "Slowly open your eyes, keeping the light with you.", "కాంతిని మీతో ఉంచుకుని, నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },

  // ---- Modern masters (inspired by, in our own words) ----
  {
    id: "who-am-i", source: "Inspired by Ramana Maharshi", source_te: "రమణ మహర్షి స్ఫూర్తితో",
    name: "\"Who am I?\" self-inquiry", name_te: "\"నేను ఎవరు?\" ఆత్మ విచారణ",
    goodFor: ["spiritual", "awareness", "anxiety"], minutes: 10,
    steps: [
      S(1, "Sit quietly and close your eyes. Let the body and breath settle.", "నిశ్శబ్దంగా కూర్చుని కళ్ళు మూసుకోండి. శరీరం, శ్వాస స్థిరపడనివ్వండి."),
      S(3, "When any thought comes, don't follow it. Ask gently: \"To whom does this thought come?\" The answer is: \"To me.\"", "ఏ ఆలోచన వచ్చినా దాని వెంట వెళ్ళకండి. మెల్లగా అడగండి: \"ఈ ఆలోచన ఎవరికి వస్తోంది?\" జవాబు: \"నాకు.\""),
      S(3, "Then ask: \"Who am I?\" Don't answer with words. Turn your attention back to the feeling of \"I\" itself.", "తర్వాత అడగండి: \"నేను ఎవరు?\" మాటలతో జవాబు చెప్పకండి. దృష్టిని \"నేను\" అనే భావన పైకే తిప్పండి."),
      S(3, "Rest in that simple sense of being, before any thought. Stay there as long as it is natural.", "ఏ ఆలోచనకూ ముందున్న ఆ సరళమైన ఉనికి భావనలో విశ్రాంతి తీసుకోండి. సహజంగా ఉన్నంత సేపు అక్కడే ఉండండి."),
      S(1, "Slowly open your eyes.", "నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "choiceless", source: "Inspired by the teachings of J. Krishnamurti", source_te: "జిడ్డు కృష్ణమూర్తి బోధనల స్ఫూర్తితో",
    name: "Choiceless awareness", name_te: "ఎంపిక లేని ఎరుక",
    goodFor: ["awareness", "anxiety"], minutes: 10,
    steps: [
      S(1, "Sit comfortably with eyes closed or softly open.", "కళ్ళు మూసుకుని లేదా మెల్లగా తెరిచి సౌకర్యంగా కూర్చోండి."),
      S(3, "Notice whatever is here: sounds, sensations, thoughts, feelings. Don't choose one; let everything be noticed.", "ఇక్కడ ఉన్న దేనినైనా గమనించండి: శబ్దాలు, అనుభూతులు, ఆలోచనలు, భావాలు. దేనినీ ఎంచుకోకండి; అన్నీ గమనించబడనివ్వండి."),
      S(3, "When the mind judges (\"this is good, this is bad\"), notice the judging too, without fighting it.", "మనసు తీర్పు చెప్పినప్పుడు (\"ఇది మంచి, ఇది చెడు\"), దానితో పోరాడకుండా ఆ తీర్పును కూడా గమనించండి."),
      S(2, "Simply look, without a goal and without trying to change anything.", "లక్ష్యం లేకుండా, ఏదీ మార్చడానికి ప్రయత్నించకుండా కేవలం చూడండి."),
      S(1, "Slowly return to the room.", "నెమ్మదిగా గదిలోకి తిరిగి రండి."),
    ],
  },
  {
    id: "self-remembering-sit", source: "Inspired by G. I. Gurdjieff", source_te: "గుర్జియెఫ్ స్ఫూర్తితో",
    name: "Self-remembering", name_te: "స్వీయ స్మరణ",
    goodFor: ["awareness", "focus", "energy"], minutes: 5,
    steps: [
      S(1, "Sit upright with eyes open. Look at an object in front of you.", "కళ్ళు తెరిచి నిటారుగా కూర్చోండి. మీ ముందున్న ఒక వస్తువును చూడండి."),
      S(3, "Divide your attention: see the object, and at the same time feel yourself sitting here. \"I am here, seeing this.\"", "దృష్టిని రెండుగా పంచండి: వస్తువును చూడండి, అదే సమయంలో మీరు ఇక్కడ కూర్చున్నట్లు అనుభవించండి. \"నేను ఇక్కడ ఉన్నాను, ఇది చూస్తున్నాను.\""),
      S(3, "Add the feeling of your feet, hands and breath, while still seeing the object. Hold all of it together.", "వస్తువును చూస్తూనే మీ పాదాలు, చేతులు, శ్వాస అనుభూతిని కలపండి. అన్నింటినీ కలిపి పట్టుకోండి."),
      S(1, "Carry this \"I am here\" into the rest of your day.", "ఈ \"నేను ఇక్కడ ఉన్నాను\" భావనను మిగతా రోజంతా తీసుకువెళ్ళండి."),
    ],
  },
  {
    id: "nadabrahma", source: "Inspired by Osho (Nadabrahma)", source_te: "ఓషో (నాదబ్రహ్మ) స్ఫూర్తితో",
    name: "Humming meditation", name_te: "హమ్మింగ్ ధ్యానం",
    goodFor: ["calm", "energy", "anxiety"], minutes: 10,
    steps: [
      S(1, "Sit comfortably with eyes closed and lips gently closed.", "కళ్ళు, పెదవులు మెల్లగా మూసి సౌకర్యంగా కూర్చోండి."),
      S(5, "Hum a steady, low \"mmm\" sound, loud enough to feel it. Let the vibration fill your body. Breathe whenever you need.", "స్థిరంగా, తక్కువ స్వరంలో \"మ్మ్మ్\" అని హమ్ చేయండి. కంపనం శరీరమంతా నిండనివ్వండి. అవసరమైనప్పుడు శ్వాస తీసుకోండి."),
      S(2, "Keep humming, and imagine energy flowing out from your palms to the world, then flowing back into you.", "హమ్ చేస్తూనే, మీ అరచేతుల నుండి ప్రపంచానికి శక్తి ప్రవహించి, తిరిగి మీలోకి వస్తున్నట్లు ఊహించండి."),
      S(2, "Stop humming. Sit completely silent and still.", "హమ్మింగ్ ఆపండి. పూర్తిగా మౌనంగా, నిశ్చలంగా కూర్చోండి."),
    ],
  },
  {
    id: "witnessing", source: "Inspired by Osho", source_te: "ఓషో స్ఫూర్తితో",
    name: "Witnessing", name_te: "సాక్షి ధ్యానం",
    goodFor: ["awareness", "anger", "anxiety"], minutes: 10,
    steps: [
      S(1, "Sit quietly and close your eyes.", "నిశ్శబ్దంగా కూర్చుని కళ్ళు మూసుకోండి."),
      S(3, "Watch the breath come and go, without changing it.", "శ్వాస వస్తూ పోవడాన్ని మార్చకుండా గమనించండి."),
      S(3, "Thoughts will come. Watch them like traffic on a road, without getting into any car.", "ఆలోచనలు వస్తాయి. రోడ్డుపై వాహనాలను చూసినట్లు, ఏ వాహనంలోనూ ఎక్కకుండా వాటిని గమనించండి."),
      S(2, "You are the watcher, always untouched. Rest as the witness.", "మీరు గమనించేవారు, ఎప్పుడూ అంటనివారు. సాక్షిగా విశ్రాంతి తీసుకోండి."),
      S(1, "Slowly open your eyes.", "నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "inner-body", source: "Inspired by Eckhart Tolle", source_te: "ఎకార్ట్ టోల్ స్ఫూర్తితో",
    name: "Inner-body awareness", name_te: "లోపలి శరీర ఎరుక",
    goodFor: ["anxiety", "calm", "awareness"], minutes: 5,
    steps: [
      S(1, "Sit comfortably and close your eyes.", "సౌకర్యంగా కూర్చుని కళ్ళు మూసుకోండి."),
      S(3, "Feel the aliveness inside your hands: a gentle tingling or warmth. Don't look, just feel.", "మీ చేతుల లోపలి జీవశక్తిని అనుభవించండి: మెల్లని జలదరింపు లేదా వెచ్చదనం. చూడకండి, కేవలం అనుభవించండి."),
      S(3, "Now feel the aliveness in your feet, then your chest, then the whole body at once.", "ఇప్పుడు పాదాలలో, తర్వాత ఛాతీలో, తర్వాత శరీరమంతా ఒకేసారి జీవశక్తిని అనుభవించండి."),
      S(2, "Stay present in the body. This moment is all there is.", "శరీరంలో వర్తమానంలో ఉండండి. ఈ క్షణమే అంతా."),
      S(1, "Open your eyes, keeping some attention in the body.", "కొంత దృష్టిని శరీరంలో ఉంచుకుంటూ కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "countdown", source: "Inspired by José Silva", source_te: "జోస్ సిల్వా స్ఫూర్తితో",
    name: "Countdown relaxation", name_te: "కౌంట్‌డౌన్ విశ్రాంతి",
    goodFor: ["calm", "focus", "goals", "sleep"], minutes: 10,
    steps: [
      S(1, "Sit or lie down and close your eyes. Take a deep breath.", "కూర్చుని లేదా పడుకుని కళ్ళు మూసుకోండి. లోతుగా శ్వాస తీసుకోండి."),
      S(3, "Count down slowly from 10 to 1, relaxing more with each number: 10… 9… 8… down to 1.", "10 నుండి 1 వరకు నెమ్మదిగా లెక్కించండి, ప్రతి సంఖ్యతో మరింత విశ్రాంతి పొందండి: 10… 9… 8… 1 వరకు."),
      S(3, "Picture a calm place you love. See its colours, hear its sounds, feel its peace.", "మీకు నచ్చిన ప్రశాంత ప్రదేశాన్ని ఊహించండి. దాని రంగులను చూడండి, శబ్దాలు వినండి, శాంతిని అనుభవించండి."),
      S(2, "From this calm, see yourself handling tomorrow's task easily and well.", "ఈ ప్రశాంతత నుండి, రేపటి పనిని సులభంగా, బాగా చేస్తున్నట్లు మిమ్మల్ని చూడండి."),
      S(1, "Count up from 1 to 5 and open your eyes, feeling fresh and alert.", "1 నుండి 5 వరకు లెక్కించి, తాజాగా, ఉత్సాహంగా కళ్ళు తెరవండి."),
    ],
  },
  {
    id: "feeling-it-done", source: "Inspired by Neville Goddard", source_te: "నెవిల్ గొడ్డార్డ్ స్ఫూర్తితో",
    name: "Feeling it done (before sleep)", name_te: "నెరవేరినట్లు అనుభూతి (నిద్రకు ముందు)",
    goodFor: ["goals", "sleep"], minutes: 10,
    steps: [
      S(1, "Lie down in bed, relaxed and drowsy. Let the body feel heavy.", "మంచంపై విశ్రాంతిగా, మగతగా పడుకోండి. శరీరం బరువుగా అనిపించనివ్వండి."),
      S(2, "Think of one goal. Ask: \"What would happen if it were already done?\"", "ఒక లక్ష్యాన్ని ఆలోచించండి. అడగండి: \"ఇది ఇప్పటికే నెరవేరితే ఏమి జరుగుతుంది?\""),
      S(4, "Imagine a short, simple scene from after it is done, like a friend saying \"congratulations\". Replay it and feel it as real.", "అది నెరవేరిన తర్వాతి ఒక చిన్న దృశ్యాన్ని ఊహించండి: ఉదాహరణకు ఒక స్నేహితుడు \"అభినందనలు\" అనడం. దానిని మళ్ళీ మళ్ళీ ఊహించి నిజమైనట్లు అనుభవించండి."),
      S(2, "Feel the gratitude and peace of it. Let yourself drift to sleep in that feeling.", "దాని కృతజ్ఞతను, శాంతిని అనుభవించండి. ఆ భావనలోనే నిద్రలోకి జారిపోండి."),
      S(1, "Tomorrow, take one practical step towards it. Intention and action go together.", "రేపు దాని వైపు ఒక ఆచరణాత్మక అడుగు వేయండి. సంకల్పం, కర్మ కలిసి నడుస్తాయి."),
    ],
  },
  {
    id: "hooponopono", source: "Inspired by the Hawaiian practice of Ho'oponopono", source_te: "హవాయి హొఓపొనొపొనొ సాధన స్ఫూర్తితో",
    name: "Ho'oponopono: forgiveness", name_te: "హొఓపొనొపొనొ: క్షమ",
    goodFor: ["forgiveness", "love", "calm"], minutes: 5,
    steps: [
      S(1, "Sit quietly and close your eyes. Bring to mind a person, a situation, or yourself.", "నిశ్శబ్దంగా కూర్చుని కళ్ళు మూసుకోండి. ఒక వ్యక్తిని, ఒక పరిస్థితిని, లేదా మిమ్మల్నే మనసులోకి తెచ్చుకోండి."),
      S(5, "Repeat slowly, with feeling: I'm sorry. Please forgive me. Thank you. I love you.", "భావంతో నెమ్మదిగా చెప్పండి: నన్ను క్షమించండి. దయచేసి నన్ను మన్నించండి. ధన్యవాదాలు. నేను మిమ్మల్ని ప్రేమిస్తున్నాను."),
      S(2, "Let any hurt soften. You don't have to fix anything; just keep the words flowing.", "ఏ బాధనైనా మెత్తబడనివ్వండి. ఏదీ సరిదిద్దనవసరం లేదు; మాటలు ప్రవహిస్తూ ఉండనివ్వండి."),
      S(1, "Rest in the lightness. Slowly open your eyes.", "ఆ తేలికదనంలో విశ్రాంతి తీసుకోండి. నెమ్మదిగా కళ్ళు తెరవండి."),
    ],
  },

  // ---- Simple breathing ----
  {
    id: "box-breathing", source: "Modern breathing practice", source_te: "ఆధునిక శ్వాస సాధన",
    name: "Box breathing (4-4-4-4)", name_te: "బాక్స్ శ్వాస (4-4-4-4)",
    goodFor: ["anxiety", "focus", "anger", "calm"], minutes: 5, breath: { in: 4, hold: 4, out: 4, hold2: 4 },
    caution: "If holding the breath is uncomfortable (or you are pregnant or have heart or blood-pressure problems), skip the holds and just breathe slowly.",
    caution_te: "శ్వాస ఆపడం అసౌకర్యంగా ఉంటే (లేదా గర్భిణీ, గుండె లేదా బీపీ సమస్యలు ఉంటే), ఆపకుండా నెమ్మదిగా శ్వాసించండి.",
    steps: [
      S(1, "Sit upright and relax your shoulders.", "నిటారుగా కూర్చుని భుజాలను విశ్రాంతిగా వదలండి."),
      S(6, "Follow the circle: breathe in for 4, hold for 4, breathe out for 4, hold for 4.", "వృత్తాన్ని అనుసరించండి: 4 లెక్కలు లోపలికి, 4 ఆపండి, 4 బయటికి, 4 ఆపండి."),
      S(1, "Breathe normally and notice how calm and clear you feel.", "సాధారణంగా శ్వాసించి, ఎంత ప్రశాంతంగా, స్పష్టంగా ఉన్నారో గమనించండి."),
    ],
  },
  {
    id: "breath-478", source: "Modern breathing practice", source_te: "ఆధునిక శ్వాస సాధన",
    name: "4-7-8 breathing for sleep", name_te: "నిద్రకు 4-7-8 శ్వాస",
    goodFor: ["sleep", "anxiety", "calm"], minutes: 5, breath: { in: 4, hold: 7, out: 8, hold2: 0 },
    caution: "If the hold feels uncomfortable, shorten it. Skip holds if pregnant or with heart or blood-pressure problems.",
    caution_te: "ఆపడం అసౌకర్యంగా ఉంటే తగ్గించండి. గర్భిణీ లేదా గుండె, బీపీ సమస్యలు ఉంటే ఆపకండి.",
    steps: [
      S(1, "Sit or lie down comfortably. Rest the tip of your tongue behind your upper teeth.", "సౌకర్యంగా కూర్చోండి లేదా పడుకోండి. నాలుక కొనను పై పళ్ళ వెనుక ఉంచండి."),
      S(6, "Follow the circle: breathe in through the nose for 4, hold for 7, breathe out slowly through the mouth for 8.", "వృత్తాన్ని అనుసరించండి: ముక్కుతో 4 లెక్కలు లోపలికి, 7 ఆపండి, నోటితో 8 లెక్కలు నెమ్మదిగా బయటికి."),
      S(1, "Let the breath return to normal and let sleep come.", "శ్వాస సాధారణ స్థితికి రానివ్వండి, నిద్రను రానివ్వండి."),
    ],
  },
];

export const MEDITATION_BY_ID = Object.fromEntries(MEDITATIONS.map((m) => [m.id, m]));

// Filters shown in the Meditate tab (tag -> label).
export const MEDITATION_TAGS = {
  calm: ["Calm", "ప్రశాంతత"], anxiety: ["Anxiety", "ఆందోళన"], sleep: ["Sleep", "నిద్ర"], focus: ["Focus", "ఏకాగ్రత"],
  anger: ["Anger", "కోపం"], love: ["Love", "ప్రేమ"], forgiveness: ["Forgiveness", "క్షమ"], energy: ["Energy", "శక్తి"],
  awareness: ["Awareness", "ఎరుక"], spiritual: ["Spiritual", "ఆధ్యాత్మికం"], goals: ["Goals", "లక్ష్యాలు"],
};
