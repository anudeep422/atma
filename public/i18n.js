// English / Telugu text for the whole site, plus the language switch.
// Mark elements with data-i18n="key" (text), data-i18n-html="key" (allows <br>)
// or data-i18n-ph="key" (placeholder).

const STRINGS = {
  en: {
    switch_to: "తెలుగు",
    tab_ask: "💬 Ask",
    tab_coach: "🎯 Coach",
    tab_journal: "📔 Journal",
    coach_title: "Your scripture coach",
    coach_intro: "Choose an area, write one goal in your own words, and get a 7-day plan with a verse, a daily sankalpa and simple practices. Check in each day.",
    area_relationships: "👨‍👩‍👧 Relationships & family",
    area_emotions: "🧠 Mind & emotions",
    area_discipline: "⏰ Discipline & habits",
    area_career: "💼 Career & purpose",
    area_wealth: "🪔 Wealth",
    wealth_note: "Wealth the dharmic way: honest effort, skill, wise habits, generosity and contentment. This is not financial advice, and no results are promised.",
    goal_ph: "Your goal, e.g. \"I want to stop getting angry with my family\" or \"I want to wake up at 5 am\"",
    create_plan: "Create my 7-day plan",
    creating_plan: "Preparing your plan…",
    sankalpa: "Your sankalpa: repeat it every morning",
    today_action: "Day {n}: today's step",
    checkin_ph: "How did it go? (optional)",
    did_it: "✅ I did it",
    not_today: "Not today",
    come_back: "🙏 You've checked in today. Come back tomorrow for your next step.",
    coach_says: "Your coach",
    plan_done_title: "🎉 You completed your 7-day plan!",
    new_goal: "Start a new goal",
    past_checkins: "Past check-ins",
    no_checkins: "No check-ins yet.",
    end_plan: "End this plan",
    confirm_end_plan: "End this plan? It will be saved in your history.",
    completed: "Completed",
    day_of: "Day {n} of {m}",
    day: "Day",
    min: "min",
    err_coach_need_area: "Please choose an area first.",
    err_coach_need_goal: "Please choose an area and describe your goal.",
    err_coach_tomorrow: "You've already checked in today. Come back tomorrow.",
    helpful_q: "Was this helpful?",
    thanks_feedback: "Thank you for your feedback 🙏",
    stats: "Stats",
    install_app: "📲 Install app on this phone",
    open_app: "Open app",
    contact_owner: "the app owner",
    footer_links: '<a href="/about.html">About Atma</a> · <a href="/privacy.html">Privacy</a>',
    about_html: `<h1>About Atma</h1>
<p>Atma brings the timeless wisdom of the Upanishads into everyday life, in Telugu and English.</p>
<p>When you share what is on your heart, Atma's guide picks one or two verses that speak to your situation, explains them in simple words, and suggests one small practice for your day.</p>
<h2>Real verses, never invented</h2>
<p>The guide can only choose from a carefully selected library of Upanishad verses. The verse you see (reference, Sanskrit and meaning) is shown exactly from that library. The AI never writes scripture itself.</p>
<h2>What Atma is not</h2>
<p>Atma offers spiritual reflection. It is not a doctor, therapist, lawyer or financial adviser. If you are in crisis, please contact a local helpline (in India: Tele-MANAS <b>14416</b>) or emergency services.</p>
<h2>Contact</h2>
<p>Questions, suggestions or corrections to a verse: {contact}.</p>`,
    privacy_html: `<h1>Privacy</h1>
<p>Your trust matters. This page explains simply what Atma stores and why.</p>
<h2>What we store</h2>
<ul>
<li><b>Your account:</b> your email address (and name, if you sign in with Google), through Google Firebase Authentication.</li>
<li><b>Your journal:</b> the questions you ask and the guide's answers, so you can read them again. You can delete any entry in <b>My journal</b>.</li>
<li><b>Usage:</b> how many questions you asked each day.</li>
</ul>
<h2>How answers are created</h2>
<p>To write an answer, your question is sent to an AI service: <b>Google Gemini</b>, or <b>Groq</b> as a backup. While Atma uses the free versions of these services, <b>they may use the text to improve their products</b>. Please don't include very private details such as your full name, phone number, address or medical records in your questions.</p>
<h2>What we never do</h2>
<ul><li>We don't sell your data.</li><li>We don't show ads.</li></ul>
<h2>Deleting your data</h2>
<p>Delete journal entries any time in <b>My journal</b>. To delete your whole account and all its data, write to {contact}.</p>
<p class="muted">Last updated: November 2026</p>`,
    journal: "My journal",
    back_to_guide: "Back to the guide",
    journal_empty: "Your past questions and answers will appear here.",
    delete: "Delete",
    confirm_delete: "Delete this entry from your journal?",
    share: "📤 Share",
    listen: "🔊 Listen",
    stop: "⏹ Stop",
    card_cta: "Ask your question on Atma",
    no_voice: "Sorry, this browser can't read text aloud.",
    no_te_voice: "This phone doesn't have a Telugu voice installed. On Android: Settings > Accessibility > Text-to-speech > install Telugu. Or switch to English.",
    login: "Log in",
    logout: "Log out",
    hero_title: "Ancient wisdom for<br>the questions you carry today",
    hero_sub: "Ask about stress, purpose, relationships or loss, and receive gentle guidance drawn from the Upanishads, with a simple practice for your day.",
    start_free: "Start free",
    todays_verse: "Today's verse",
    loading: "Loading…",
    how: "How it works",
    step1_t: "1. Ask", step1_d: "Share what's on your mind, in your own words.",
    step2_t: "2. Receive", step2_d: "Get guidance rooted in authentic Upanishad verses, explained simply.",
    step3_t: "3. Practice", step3_d: "Leave with one small practice to bring the teaching into your day.",
    pricing: "Pricing",
    free: "Free",
    per_month: "/month",
    f1: "Verse of the day", f2: "3 questions per day",
    seeker: "Seeker",
    s1: "Unlimited questions", s2: "Deeper, continuing conversations", s3: "Cancel anytime",
    get_started: "Get started",
    footer: "Atma offers spiritual reflection, not medical, legal or financial advice.<br>If you are in crisis, please contact a local helpline or emergency services.",
    create_account: "Create your account",
    welcome_back: "Welcome back",
    email: "Email",
    password: "Password (8+ characters)",
    continue: "Continue",
    have_account: "I already have an account",
    new_here: "New here? Create an account",
    upgrade_btn: "Upgrade: $4.99/mo",
    manage: "Manage subscription",
    unlimited: "Unlimited questions",
    free_testing: "✨ Free during testing: ask as many questions as you like",
    f2_testing: "Unlimited questions while we are testing",
    left: "{n} of {m} free questions left today",
    sugg1: "I feel anxious about my future",
    sugg2: "How do I stop comparing myself to others?",
    sugg3: "I lost someone I love",
    sugg4: "I can't stay disciplined",
    upsell_t: "You've used today's free questions",
    upsell_d: "Become a Seeker for unlimited guidance, any time you need it.",
    upsell_btn: "Upgrade for $4.99/month",
    question_ph: "What is on your heart today?",
    ask: "Ask the guide",
    thinking: "Reflecting on the Upanishads…",
    upgraded_demo: "Demo mode: you were upgraded without payment. Add Stripe keys to take real payments.",
    upgraded: "Thank you for becoming a Seeker. Unlimited guidance is now yours. 🙏",
    err_invalid_email: "Please enter a valid email.",
    err_short_password: "Password must be at least 8 characters.",
    err_email_exists: "An account with this email already exists.",
    err_wrong_login: "Wrong email or password.",
    err_busy: "The guide is busy right now. Please try again in a minute.",
    google_btn: "Continue with Google",
    or: "or",
    forgot: "Forgot password?",
    reset_sent: "Password reset email sent. Please check your inbox.",
    reset_need_email: "Type your email above first, then tap \"Forgot password?\".",
    err_too_many: "Too many attempts. Please wait a few minutes and try again.",
    err_payments_soon: "Upgrades are coming soon. Thank you for your patience! 🙏",
    err_unauthorized_domain: "Sign-in isn't enabled for this website address yet. (Owner: add this domain in Firebase > Authentication > Settings > Authorized domains.)",
    err_method_disabled: "This sign-in method isn't turned on yet. (Owner: enable it in Firebase > Authentication > Sign-in method.)",
    err_popup_blocked: "Your browser blocked the Google sign-in window. Please allow pop-ups for this site and try again.",
    err_network: "No internet connection. Please check your connection and try again.",
    err_generic: "Something went wrong. Please try again.",
  },
  te: {
    switch_to: "English",
    tab_ask: "💬 అడగండి",
    tab_coach: "🎯 కోచ్",
    tab_journal: "📔 డైరీ",
    coach_title: "మీ శాస్త్ర కోచ్",
    coach_intro: "ఒక విభాగాన్ని ఎంచుకుని, మీ లక్ష్యాన్ని మీ మాటల్లో రాయండి. ఒక శ్లోకం, రోజువారీ సంకల్పం, సులభమైన సాధనలతో 7 రోజుల ప్రణాళిక పొందండి. ప్రతి రోజు చెక్-ఇన్ చేయండి.",
    area_relationships: "👨‍👩‍👧 అనుబంధాలు & కుటుంబం",
    area_emotions: "🧠 మనసు & భావోద్వేగాలు",
    area_discipline: "⏰ క్రమశిక్షణ & అలవాట్లు",
    area_career: "💼 వృత్తి & లక్ష్యం",
    area_wealth: "🪔 సంపద",
    wealth_note: "ధర్మబద్ధమైన సంపద: నిజాయితీ కృషి, నైపుణ్యం, మంచి అలవాట్లు, దానం, సంతృప్తి. ఇది ఆర్థిక సలహా కాదు, ఫలితాలకు హామీ లేదు.",
    goal_ph: "మీ లక్ష్యం, ఉదా: \"నా కుటుంబంపై కోపం తగ్గించుకోవాలి\" లేదా \"ఉదయం 5 గంటలకు లేవాలి\"",
    create_plan: "నా 7 రోజుల ప్రణాళిక తయారు చేయండి",
    creating_plan: "మీ ప్రణాళిక సిద్ధమవుతోంది…",
    sankalpa: "మీ సంకల్పం: ప్రతి ఉదయం చెప్పుకోండి",
    today_action: "రోజు {n}: ఈ రోజు అడుగు",
    checkin_ph: "ఎలా జరిగింది? (ఐచ్ఛికం)",
    did_it: "✅ చేశాను",
    not_today: "ఈ రోజు కాలేదు",
    come_back: "🙏 ఈ రోజు చెక్-ఇన్ పూర్తయింది. తదుపరి అడుగు కోసం రేపు రండి.",
    coach_says: "మీ కోచ్",
    plan_done_title: "🎉 మీ 7 రోజుల ప్రణాళిక పూర్తయింది!",
    new_goal: "కొత్త లక్ష్యం ప్రారంభించండి",
    past_checkins: "గత చెక్-ఇన్‌లు",
    no_checkins: "ఇంకా చెక్-ఇన్‌లు లేవు.",
    end_plan: "ఈ ప్రణాళికను ముగించండి",
    confirm_end_plan: "ఈ ప్రణాళికను ముగించాలా? ఇది మీ చరిత్రలో భద్రపరచబడుతుంది.",
    completed: "పూర్తయింది",
    day_of: "{m} లో రోజు {n}",
    day: "రోజు",
    min: "ని.",
    err_coach_need_area: "దయచేసి ముందుగా ఒక విభాగాన్ని ఎంచుకోండి.",
    err_coach_need_goal: "దయచేసి ఒక విభాగాన్ని ఎంచుకుని మీ లక్ష్యాన్ని రాయండి.",
    err_coach_tomorrow: "ఈ రోజు ఇప్పటికే చెక్-ఇన్ చేశారు. రేపు రండి.",
    helpful_q: "ఇది ఉపయోగపడిందా?",
    thanks_feedback: "మీ అభిప్రాయానికి ధన్యవాదాలు 🙏",
    stats: "గణాంకాలు",
    install_app: "📲 ఈ ఫోన్‌లో యాప్ ఇన్‌స్టాల్ చేయండి",
    open_app: "యాప్ తెరవండి",
    contact_owner: "యాప్ యజమాని",
    footer_links: '<a href="/about.html">ఆత్మ గురించి</a> · <a href="/privacy.html">గోప్యత</a>',
    about_html: `<h1>ఆత్మ గురించి</h1>
<p>ఉపనిషత్తుల శాశ్వత జ్ఞానాన్ని తెలుగు మరియు ఇంగ్లీష్‌లో మీ రోజువారీ జీవితంలోకి తీసుకువస్తుంది ఆత్మ.</p>
<p>మీ మనసులోని మాటను పంచుకున్నప్పుడు, ఆత్మ మార్గదర్శి మీ పరిస్థితికి సరిపోయే ఒకటి లేదా రెండు శ్లోకాలను ఎంచుకుని, సరళమైన మాటల్లో వివరించి, మీ రోజుకు ఒక చిన్న సాధనను సూచిస్తుంది.</p>
<h2>అసలైన శ్లోకాలు, కల్పితం కాదు</h2>
<p>మార్గదర్శి జాగ్రత్తగా ఎంపిక చేసిన ఉపనిషత్ శ్లోకాల గ్రంథాలయం నుండి మాత్రమే ఎంచుకోగలదు. మీరు చూసే శ్లోకం (మూలం, సంస్కృతం, అర్థం) ఆ గ్రంథాలయం నుండి యథాతథంగా చూపబడుతుంది. AI స్వయంగా ఎప్పుడూ శ్లోకాలను రాయదు.</p>
<h2>ఆత్మ ఏది కాదు</h2>
<p>ఆత్మ ఆధ్యాత్మిక చింతనను అందిస్తుంది. ఇది వైద్యుడు, మానసిక నిపుణుడు, న్యాయవాది లేదా ఆర్థిక సలహాదారు కాదు. మీరు సంక్షోభంలో ఉంటే, దయచేసి స్థానిక హెల్ప్‌లైన్ (భారతదేశంలో: Tele-MANAS <b>14416</b>) లేదా అత్యవసర సేవలను సంప్రదించండి.</p>
<h2>సంప్రదించండి</h2>
<p>ప్రశ్నలు, సూచనలు లేదా శ్లోకంలో సవరణల కోసం: {contact}.</p>`,
    privacy_html: `<h1>గోప్యత</h1>
<p>మీ నమ్మకం మాకు ముఖ్యం. ఆత్మ ఏమి నిల్వ చేస్తుందో, ఎందుకో ఈ పేజీ సరళంగా వివరిస్తుంది.</p>
<h2>మేము నిల్వ చేసేవి</h2>
<ul>
<li><b>మీ ఖాతా:</b> మీ ఈమెయిల్ (Google తో సైన్ ఇన్ చేస్తే మీ పేరు కూడా), Google Firebase Authentication ద్వారా.</li>
<li><b>మీ డైరీ:</b> మీరు అడిగిన ప్రశ్నలు, మార్గదర్శి సమాధానాలు, మీరు మళ్ళీ చదువుకోవడానికి. <b>నా డైరీ</b> లో ఏ ఎంట్రీనైనా తొలగించవచ్చు.</li>
<li><b>వినియోగం:</b> మీరు రోజుకు ఎన్ని ప్రశ్నలు అడిగారు.</li>
</ul>
<h2>సమాధానాలు ఎలా తయారవుతాయి</h2>
<p>సమాధానం రాయడానికి మీ ప్రశ్న ఒక AI సేవకు పంపబడుతుంది: <b>Google Gemini</b>, లేదా బ్యాకప్‌గా <b>Groq</b>. ఆత్మ ఈ సేవల ఉచిత వెర్షన్‌లను వాడుతున్నంత కాలం, <b>అవి తమ సేవలను మెరుగుపరచుకోవడానికి ఆ వచనాన్ని ఉపయోగించవచ్చు</b>. దయచేసి మీ పూర్తి పేరు, ఫోన్ నంబర్, చిరునామా లేదా వైద్య రికార్డుల వంటి చాలా వ్యక్తిగత వివరాలను మీ ప్రశ్నల్లో ఇవ్వకండి.</p>
<h2>మేము ఎప్పుడూ చేయనివి</h2>
<ul><li>మీ డేటాను అమ్మము.</li><li>ప్రకటనలు చూపించము.</li></ul>
<h2>మీ డేటాను తొలగించడం</h2>
<p><b>నా డైరీ</b> లో ఎప్పుడైనా ఎంట్రీలను తొలగించవచ్చు. మీ పూర్తి ఖాతాను, దాని డేటా మొత్తాన్ని తొలగించడానికి {contact} కు రాయండి.</p>
<p class="muted">చివరి నవీకరణ: నవంబర్ 2026</p>`,
    journal: "నా డైరీ",
    back_to_guide: "మార్గదర్శి వద్దకు",
    journal_empty: "మీ పాత ప్రశ్నలు, సమాధానాలు ఇక్కడ కనిపిస్తాయి.",
    delete: "తొలగించు",
    confirm_delete: "ఈ ఎంట్రీని మీ డైరీ నుండి తొలగించాలా?",
    share: "📤 షేర్ చేయండి",
    listen: "🔊 వినండి",
    stop: "⏹ ఆపండి",
    card_cta: "మీ ప్రశ్నను ఆత్మను అడగండి",
    no_voice: "క్షమించండి, ఈ బ్రౌజర్ వచనాన్ని చదివి వినిపించలేదు.",
    no_te_voice: "ఈ ఫోన్‌లో తెలుగు వాయిస్ లేదు. Android లో: Settings > Accessibility > Text-to-speech > తెలుగు ఇన్‌స్టాల్ చేయండి. లేదా English కు మారండి.",
    login: "లాగిన్",
    logout: "లాగ్ అవుట్",
    hero_title: "నేటి మీ ప్రశ్నలకు<br>ప్రాచీన జ్ఞానం",
    hero_sub: "ఒత్తిడి, జీవిత లక్ష్యం, అనుబంధాలు లేదా దుఃఖం గురించి అడగండి. ఉపనిషత్తుల నుండి సున్నితమైన మార్గదర్శనాన్ని, మీ రోజుకు ఒక చిన్న సాధనతో పాటు పొందండి.",
    start_free: "ఉచితంగా ప్రారంభించండి",
    todays_verse: "నేటి శ్లోకం",
    loading: "లోడ్ అవుతోంది…",
    how: "ఇది ఎలా పనిచేస్తుంది",
    step1_t: "1. అడగండి", step1_d: "మీ మనసులో ఉన్నది మీ మాటల్లోనే చెప్పండి.",
    step2_t: "2. పొందండి", step2_d: "అసలైన ఉపనిషత్ శ్లోకాల ఆధారంగా, సరళంగా వివరించిన మార్గదర్శనం పొందండి.",
    step3_t: "3. ఆచరించండి", step3_d: "ఆ బోధను మీ రోజులోకి తెచ్చే ఒక చిన్న సాధనతో ముందుకు సాగండి.",
    pricing: "ధరలు",
    free: "ఉచితం",
    per_month: "/నెలకు",
    f1: "రోజువారీ శ్లోకం", f2: "రోజుకు 3 ప్రశ్నలు",
    seeker: "సాధక",
    s1: "అపరిమిత ప్రశ్నలు", s2: "లోతైన, కొనసాగే సంభాషణలు", s3: "ఎప్పుడైనా రద్దు చేయవచ్చు",
    get_started: "ప్రారంభించండి",
    footer: "ఆత్మ ఆధ్యాత్మిక చింతనను అందిస్తుంది; ఇది వైద్య, న్యాయ లేదా ఆర్థిక సలహా కాదు.<br>మీరు సంక్షోభంలో ఉంటే, దయచేసి స్థానిక హెల్ప్‌లైన్ (Tele-MANAS 14416) లేదా అత్యవసర సేవలను సంప్రదించండి.",
    create_account: "మీ ఖాతాను సృష్టించండి",
    welcome_back: "మళ్ళీ స్వాగతం",
    email: "ఈమెయిల్",
    password: "పాస్‌వర్డ్ (8+ అక్షరాలు)",
    continue: "కొనసాగించండి",
    have_account: "నాకు ఇప్పటికే ఖాతా ఉంది",
    new_here: "కొత్తవారా? ఖాతా సృష్టించండి",
    upgrade_btn: "అప్‌గ్రేడ్: $4.99/నెల",
    manage: "సబ్‌స్క్రిప్షన్ నిర్వహించండి",
    unlimited: "అపరిమిత ప్రశ్నలు",
    free_testing: "✨ పరీక్ష సమయంలో ఉచితం: ఎన్ని ప్రశ్నలైనా అడగండి",
    f2_testing: "పరీక్ష సమయంలో అపరిమిత ప్రశ్నలు",
    left: "ఈ రోజు {m} లో {n} ఉచిత ప్రశ్నలు మిగిలి ఉన్నాయి",
    sugg1: "నా భవిష్యత్తు గురించి ఆందోళనగా ఉంది",
    sugg2: "ఇతరులతో నన్ను నేను పోల్చుకోవడం ఎలా ఆపాలి?",
    sugg3: "నేను ప్రేమించిన వ్యక్తిని కోల్పోయాను",
    sugg4: "నేను క్రమశిక్షణగా ఉండలేకపోతున్నాను",
    upsell_t: "ఈ రోజు ఉచిత ప్రశ్నలు అయిపోయాయి",
    upsell_d: "సాధక ప్లాన్‌తో ఎప్పుడు కావాలన్నా అపరిమిత మార్గదర్శనం పొందండి.",
    upsell_btn: "$4.99/నెలకు అప్‌గ్రేడ్ చేయండి",
    question_ph: "ఈ రోజు మీ మనసులో ఏముంది?",
    ask: "మార్గదర్శిని అడగండి",
    thinking: "ఉపనిషత్తులను మననం చేస్తోంది…",
    upgraded_demo: "డెమో మోడ్: చెల్లింపు లేకుండా అప్‌గ్రేడ్ అయ్యారు. నిజమైన చెల్లింపుల కోసం Stripe కీలు జోడించండి.",
    upgraded: "సాధకులుగా చేరినందుకు ధన్యవాదాలు. ఇప్పుడు మీకు అపరిమిత మార్గదర్శనం లభిస్తుంది. 🙏",
    err_invalid_email: "దయచేసి సరైన ఈమెయిల్ ఇవ్వండి.",
    err_short_password: "పాస్‌వర్డ్ కనీసం 8 అక్షరాలు ఉండాలి.",
    err_email_exists: "ఈ ఈమెయిల్‌తో ఇప్పటికే ఖాతా ఉంది.",
    err_wrong_login: "ఈమెయిల్ లేదా పాస్‌వర్డ్ తప్పు.",
    err_busy: "మార్గదర్శి ప్రస్తుతం బిజీగా ఉంది. ఒక నిమిషం తర్వాత మళ్ళీ ప్రయత్నించండి.",
    google_btn: "Google తో కొనసాగండి",
    or: "లేదా",
    forgot: "పాస్‌వర్డ్ మర్చిపోయారా?",
    reset_sent: "పాస్‌వర్డ్ రీసెట్ ఈమెయిల్ పంపాము. దయచేసి మీ ఇన్‌బాక్స్ చూడండి.",
    reset_need_email: "ముందుగా పైన మీ ఈమెయిల్ ఇచ్చి, తర్వాత \"పాస్‌వర్డ్ మర్చిపోయారా?\" నొక్కండి.",
    err_too_many: "చాలా ప్రయత్నాలు జరిగాయి. కొన్ని నిమిషాలు ఆగి మళ్ళీ ప్రయత్నించండి.",
    err_payments_soon: "అప్‌గ్రేడ్ త్వరలో అందుబాటులోకి వస్తుంది. మీ ఓపికకు ధన్యవాదాలు! 🙏",
    err_unauthorized_domain: "ఈ వెబ్‌సైట్ చిరునామాకు సైన్-ఇన్ ఇంకా ప్రారంభించబడలేదు. (యజమాని: Firebase > Authentication > Settings > Authorized domains లో ఈ డొమైన్ జోడించండి.)",
    err_method_disabled: "ఈ సైన్-ఇన్ విధానం ఇంకా ఆన్ చేయలేదు. (యజమాని: Firebase > Authentication > Sign-in method లో ఆన్ చేయండి.)",
    err_popup_blocked: "మీ బ్రౌజర్ Google సైన్-ఇన్ విండోను అడ్డుకుంది. దయచేసి ఈ సైట్‌కు పాప్-అప్‌లు అనుమతించి మళ్ళీ ప్రయత్నించండి.",
    err_network: "ఇంటర్నెట్ కనెక్షన్ లేదు. దయచేసి కనెక్షన్ చూసి మళ్ళీ ప్రయత్నించండి.",
    err_generic: "ఏదో పొరపాటు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
  },
};

function initialLang() {
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "te") return saved;
  } catch {}
  return (navigator.language || "").startsWith("te") ? "te" : "en";
}

let LANG = initialLang();
const onLangChange = [];

// Anonymous usage counters (shares, listens, installs) for the owner's stats page.
function track(type) {
  fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) }).catch(() => {});
}

let CONTACT = ""; // contact email, set by pages that need it (from /api/config)

function t(key, vars = {}) {
  const s = STRINGS[LANG][key] ?? STRINGS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (m, k) => vars[k] ?? m);
}

function contactHtml() {
  if (!CONTACT) return t("contact_owner");
  const safe = CONTACT.replace(/[^\w.@+-]/g, "");
  return `<a href="mailto:${safe}">${safe}</a>`;
}

function applyLang() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml, { contact: contactHtml() })));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = t(el.dataset.i18nPh)));
  document.querySelectorAll(".verse[data-verse]").forEach(fillVerse);
  onLangChange.forEach((fn) => fn(LANG));
}

function setLang(lang) {
  LANG = lang;
  try { localStorage.setItem("lang", lang); } catch {}
  applyLang();
}

// Verse card: reference, Sanskrit (Telugu or Roman script), meaning in the chosen language.
function fillVerse(box) {
  const v = JSON.parse(box.dataset.verse);
  const te = LANG === "te";
  box.innerHTML = "";
  const rows = [
    ["ref", te ? v.ref_te : v.ref],
    ["sa", te ? v.sanskrit_te : v.sanskrit],
    ["en", te ? v.english_te : v.english],
  ];
  for (const [cls, text] of rows) {
    const el = document.createElement(cls === "ref" ? "div" : "p");
    el.className = cls;
    el.textContent = text;
    box.appendChild(el);
  }
  // Share + Listen buttons (verse-actions.js), on every page that loads it.
  if (typeof shareVerse === "function") {
    const bar = document.createElement("div");
    bar.className = "verse-actions";
    const share = document.createElement("button");
    share.type = "button";
    share.textContent = t("share");
    share.onclick = () => shareVerse(v, share);
    const listen = document.createElement("button");
    listen.type = "button";
    listen.textContent = t("listen");
    listen.onclick = () => speakVerse(v, listen);
    bar.append(share, listen);
    box.appendChild(bar);
  }
}

function verseEl(v) {
  const box = document.createElement("div");
  box.className = "verse";
  box.dataset.verse = JSON.stringify(v);
  fillVerse(box);
  return box;
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("lang-toggle");
  if (btn) btn.onclick = () => setLang(LANG === "en" ? "te" : "en");
  applyLang();
});
