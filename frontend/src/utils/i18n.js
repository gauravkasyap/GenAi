export const LANGUAGE_NATIVE_LABELS_OVERRIDES = {
  en: "English",
  hi: "हिन्दी",
  bn: "বাংলা",
  mr: "मराठी",
  ta: "தமிழ்",
  te: "తెలుగు",
};

export const CLARIFICATION_COPY_OVERRIDES = {
  hi: {
    title: "लक्षण बताइए",
    text: "कृपया बताएं क्या लक्षण हैं, कितने समय से हैं, और किसे मदद चाहिए। उदाहरण: 2 दिन से बुखार और खांसी।",
  },
  bn: {
    title: "লক্ষণ বলুন",
    text: "অনুগ্রহ করে বলুন কী লক্ষণ আছে, কতদিন ধরে আছে, এবং কার সাহায্য দরকার। উদাহরণ: 2 দিন ধরে জ্বর ও কাশি।",
  },
  mr: {
    title: "लक्षण सांगा",
    text: "कृपया कोणती लक्षणे आहेत, किती दिवसांपासून आहेत, आणि कोणाला मदत हवी आहे ते सांगा. उदाहरण: 2 दिवसांपासून ताप आणि खोकला.",
  },
  ta: {
    title: "அறிகுறிகளை சொல்லுங்கள்",
    text: "என்ன அறிகுறிகள் உள்ளன, எத்தனை நாட்களாக உள்ளன, யாருக்கு உதவி வேண்டும் என்பதை சொல்லுங்கள். உதாரணம்: 2 நாட்களாக காய்ச்சல் மற்றும் இருமல்.",
  },
  te: {
    title: "లక్షణాలు చెప్పండి",
    text: "దయచేసి ఏ లక్షణాలు ఉన్నాయి, ఎన్ని రోజులుగా ఉన్నాయి, ఎవరికి సహాయం కావాలో చెప్పండి. ఉదాహరణ: 2 రోజులుగా జ్వరం మరియు దగ్గు.",
  },
};

export const UI_COPY_OVERRIDES = {
  hi: {
    onboarding: {
      suggestedFromDevice: "आपके डिवाइस से सुझाया गया",
      welcomeTitle: "Health AI में आपका स्वागत है",
      selectLanguageFirst: "पहले अपनी भाषा चुनें, फिर आगे बढ़ने के लिए साइन अप या लॉग इन करें।",
      recommended: "सुझाई गई भाषाएं",
      basedOnDevice: "आपकी ब्राउज़र भाषा और डिवाइस क्षेत्र के आधार पर।",
      useSuggestion: "शीर्ष सुझाव चुनें",
      selectLanguage: "भाषा चुनें",
      continue: "आगे बढ़ें",
      changeLanguage: "भाषा बदलें",
      welcomeBack: "फिर से स्वागत है",
      createAccount: "खाता बनाएं",
      alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
      noAccount: "क्या आपके पास खाता नहीं है?",
      logIn: "लॉग इन",
      signUp: "साइन अप",
      privateHistory: "इस डिवाइस पर आपकी निजी चैट हिस्ट्री इसी खाते के साथ रहेगी।",
      fullName: "पूरा नाम",
      email: "ईमेल",
      password: "पासवर्ड",
      createAccountButton: "खाता बनाएं",
      loginButton: "लॉग इन",
      or: "या",
    },
    auth: {
      socialUnavailable: (provider, mode) => `${provider} साइन-इन अभी जुड़ा नहीं है। अभी के लिए ईमेल से ${mode === "signup" ? "साइन अप" : "लॉग इन"} करें।`,
      enterEmailPassword: "आगे बढ़ने के लिए अपना ईमेल और पासवर्ड भरें।",
      enterFullName: "खाता बनाने के लिए अपना पूरा नाम भरें।",
      passwordTooShort: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
      accountExists: "इस ईमेल से पहले से एक खाता मौजूद है। कृपया लॉग इन करें।",
      noAccountFound: "इस ईमेल से कोई खाता नहीं मिला। पहले साइन अप करें।",
      incorrectPassword: "पासवर्ड सही नहीं है। फिर से कोशिश करें।",
    },
    shell: {
      appName: "Health AI",
      workspace: "ग्रामीण देखभाल कार्यक्षेत्र",
      multilingual: "बहुभाषी",
      newChat: "नई चैट",
      searchChats: "चैट खोजें",
      searchHistory: "हिस्ट्री खोजें",
      chatHistory: "चैट हिस्ट्री",
      noChatHistory: "अभी कोई चैट हिस्ट्री नहीं है।",
      logout: "लॉग आउट",
      language: "भाषा",
      ready: "जब आप तैयार हों।",
      readySubtitle: "अपनी भाषा में लक्षण लिखें या बोलें",
    },
    tools: {
      quickActions: "त्वरित क्रियाएं",
      close: "बंद करें",
      whoNeedsHelp: "किसे मदद चाहिए?",
      quickSymptoms: "झटपट लक्षण",
      howLong: "कब से?",
      howSerious: "यह कितना गंभीर लग रहा है?",
      state: "राज्य",
      district: "जिला",
      neededSpecialty: "ज़रूरी विशेषज्ञता",
      selectState: "राज्य चुनें",
      selectDistrict: "जिला चुनें",
      selectSpecialty: "विशेषज्ञता चुनें",
      pastePrescription: "यहां पर्चे का पाठ चिपकाएं",
      explainPrescription: "पर्चा समझाएं",
      working: "काम हो रहा है...",
      searching: "खोजा जा रहा है...",
      findFacilities: "सुविधाएं खोजें",
      describeSymptoms: "अपने लक्षण लिखें...",
      addFilesTitle: "फोटो और फाइलें जोड़ें",
      addFilesSubtitle: "पर्चे, रिपोर्ट या नोट जोड़ें",
      thinkingTitle: "लक्षण जांच",
      thinkingSubtitle: "लक्षणों को कदम-दर-कदम समझें",
      deepResearchTitle: "विश्वसनीय जानकारी",
      deepResearchSubtitle: "सार्वजनिक स्वास्थ्य स्रोत खोलें",
      openSource: "स्रोत खोलें",
    },
    conversation: {
      symptomCheck: "लक्षण जांच",
      prescriptionExplainer: "पर्चा समझाने वाला",
      facilityFinder: "सुविधा खोजक",
      noSymptomDetails: "कोई लक्षण विवरण नहीं",
      noPrescriptionText: "कोई पर्चे का पाठ नहीं दिया गया",
      noFinderFilters: "कोई खोज फ़िल्टर नहीं चुना गया",
      analysisFailed: "विश्लेषण विफल हुआ",
      prescriptionFailed: "पर्चा अनुरोध विफल हुआ",
      facilityFailed: "सुविधा अनुरोध विफल हुआ",
      more: "और",
    },
    durationLabels: {
      today: "आज",
      "1_3_days": "1-3 दिन",
      "4_7_days": "4-7 दिन",
      more_than_week: "एक हफ्ते से अधिक",
    },
    intensityLabels: {
      mild: "हल्का",
      moderate: "मध्यम",
      severe: "गंभीर",
    },
    toolTitles: {
      prescription: "फोटो और फाइलें जोड़ें",
      finder: "सुविधा खोजक",
      sources: "विश्वसनीय जानकारी",
      triage: "लक्षण जांच",
    },
    messages: {
      you: "आप",
      specialty: "विशेषज्ञता",
      firstStop: "पहला केंद्र",
      whatToDoNow: "अभी क्या करें",
      homeCareNotes: "घर पर देखभाल",
      goSoonerIf: "इनमें से कुछ हो तो जल्दी जाएं",
      suggestedFacilities: "सुझाई गई सुविधाएं",
      trustedSourceCards: "विश्वसनीय स्रोत",
      openSource: "स्रोत खोलें",
      prescriptionExplainer: "पर्चा समझाने वाला",
      times: "समय",
      mealRelation: "खाने से संबंध",
      decodedAs: "अर्थ",
      abbreviationLegend: "संक्षिप्त रूप सूची",
      safetyReminders: "सुरक्षा याद दिलाने वाली बातें",
      facilityFinder: "सुविधा खोजक",
    },
  },
};

const INDIA_LANGUAGE_PRIORITY = ["hi", "bn", "mr", "ta", "te", "en"];

export function buildSuggestedLanguageCodes(languageList = []) {
  const fallbackCode = languageList[0]?.code ?? "en";
  if (typeof window === "undefined") return [fallbackCode];

  const supportedCodes = new Map(
    languageList
      .filter((item) => item?.code)
      .map((item) => [String(item.code).toLowerCase(), item.code]),
  );

  const ordered = [];
  const seen = new Set();

  const addCode = (candidate) => {
    if (!candidate) return;
    const normalized = String(candidate).toLowerCase();
    const resolved = supportedCodes.get(normalized);
    if (!resolved || seen.has(resolved)) return;
    seen.add(resolved);
    ordered.push(resolved);
  };

  const localeCandidates = [
    ...(navigator.languages ?? []),
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().locale,
  ].filter(Boolean);

  let hasIndiaSignal = false;

  for (const locale of localeCandidates) {
    const normalized = String(locale).toLowerCase();
    const parts = normalized.split(/[-_]/);
    const baseCode = parts[0];
    const regionCode = parts[1]?.toUpperCase();

    addCode(normalized);
    addCode(baseCode);

    if (regionCode === "IN") {
      hasIndiaSignal = true;
    }
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() ?? "";
  if (timezone.includes("kolkata") || timezone.includes("calcutta")) {
    hasIndiaSignal = true;
  }

  if (hasIndiaSignal) {
    INDIA_LANGUAGE_PRIORITY.forEach(addCode);
  }

  addCode("en");
  return ordered.length ? ordered : [fallbackCode];
}
