import { useEffect, useRef, useState } from "react";
import { useAutoScroll } from "../hooks/useAutoScroll.js";
import {
  AnalysisMessage,
  FinderMessage,
  MedicalBookMessage,
  PrescriptionMessage,
  SelectField,
  TextMessage,
} from "../components/Messages.jsx";
import LoginCard from "../components/LoginCard.jsx";
import { MedicalBookPanel } from "../components/MedicalBookPanel.jsx";
import { MedicalBookSidebar } from "../components/MedicalBookSidebar.jsx";
import SignupCard from "../components/SignupCard.jsx";
import WelcomeCard from "../components/WelcomeCard.jsx";
import {
  analyzeSymptoms,
  confirmBook,
  explainPrescriptionRequest,
  fetchBooks,
  fetchBootstrap,
  queryBook,
  removeBook,
  searchHospitals,
  uploadBook,
} from "../services/api.js";
import {
  findPersonaLabel,
  findSymptomLabel,
  toolTitle,
} from "../utils/display.js";
import {
  buildSuggestedLanguageCodes,
  CLARIFICATION_COPY_OVERRIDES,
  LANGUAGE_NATIVE_LABELS_OVERRIDES,
  UI_COPY_OVERRIDES,
} from "../utils/i18n.js";
const DEFAULT_LANGUAGE_OPTIONS = [
  { code: "en", label: "English", speech: "en-IN" },
  { code: "hi", label: "Hindi", speech: "hi-IN" },
  { code: "bn", label: "Bengali", speech: "bn-IN" },
  { code: "mr", label: "Marathi", speech: "mr-IN" },
  { code: "ta", label: "Tamil", speech: "ta-IN" },
  { code: "te", label: "Telugu", speech: "te-IN" },
];
const GREETING_TOKENS = [
  "hello",
  "hi",
  "hey",
  "hello doctor",
  "hi doctor",
  "namaste",
  "namaskar",
  "salaam",
  "salam",
  "good morning",
  "good evening",
  "good afternoon",
  "नमस्ते",
  "नमस्कार",
  "হ্যালো",
  "নমস্কার",
  "வணக்கம்",
  "ஹலோ",
  "హలో",
  "నమస్తే",
];
const CLARIFICATION_COPY = {
  en: {
    title: "Tell me the symptoms",
    text: "Please share the symptom, how long it has been happening, and who needs help. Example: 2 days fever and cough.",
  },
  hi: {
    title: "????? ?????",
    text: "????? ?????, ????? ??? ?? ???, ?? ???? ??????? ?? ?? ?????? ??????: 2 ??? ?? ????? ?? ??????",
  },
  bn: {
    title: "????? ????",
    text: "?????, ????? ??? ???, ??? ??? ?????? ????? ?? ?????? ??????: ? ??? ??? ???? ? ?????",
  },
  mr: {
    title: "????? ?????",
    text: "????? ?????, ???? ??????????? ????, ??? ?????? ????? ??? ?? ?????. ??????: 2 ???? ??? ??? ?????.",
  },
  ta: {
    title: "?????????? ???????????",
    text: "???? ??????? ??????, ?????? ????? ??????, ???????? ???????? ?????? ?????? ???????????. ???????: 2 ???????? ????????? ??????? ??????.",
  },
  te: {
    title: "???????? ????????",
    text: "? ?????? ????, ????????? ????, ?????? ????? ???? ????????. ??????: 2 ???????? ????? ????? ?????.",
  },
};

const DOCTOR_GREETING_COPY = {
  en: {
    userTitle: "Greeting",
    title: "Doctor reply",
    defaultGreeting: "Hello. How are you feeling today? How can I assist you?",
    morningGreeting:
      "Good morning. I hope you're feeling well today. What can I assist you with?",
    eveningGreeting:
      "Good evening. I hope you're feeling well today. How can I help you?",
    afternoonGreeting:
      "Good afternoon. I hope you're doing well. How can I assist you today?",
    concernSingle: (symptom) =>
      `Hello. I'm sorry to hear that you're experiencing ${symptom}. Could you tell me when it started, how severe it feels, and whether you have any other symptoms?`,
    concernMultiple:
      "Hello. I'm sorry to hear you're dealing with these symptoms. Could you tell me when they started, how severe they feel, and whether anything is getting worse?",
    concernGeneric:
      "Hello. I'm here to help. Could you tell me more about what you're feeling and when it started?",
  },
  hi: {
    userTitle: "???????",
    title: "?????? ?? ????",
    defaultGreeting:
      "??????? ?? ?? ???? ????? ?? ??? ???? ??? ???? ???? ??? ?? ???? ????",
    morningGreeting:
      "????????? ??? ?? ?? ?? ??? ????? ?? ??? ???? ??? ???? ??? ??? ??? ?? ???? ????",
    eveningGreeting:
      "??? ??????? ??? ?? ?? ??? ???? ????? ????? ??? ???? ???? ??? ?? ???? ????",
    afternoonGreeting:
      "??????? ??? ?? ?? ??? ???? ??? ???? ???? ?????? ?? ???? ????",
    concernSingle: (symptom) =>
      `??????? ????? ??? ??? ?? ???? ${symptom} ??? ????? ????? ?? ?? ?? ??, ????? ??? ??, ?? ???? ??? ???? ????? ?? ????`,
    concernMultiple:
      "??????? ????? ??? ??? ?? ???? ?? ????? ???? ????? ????? ?? ?? ?? ???, ????? ????? ???, ?? ???? ????? ??????? ?? ??? ???",
    concernGeneric:
      "??????? ??? ??? ?? ??? ???? ???? ????? ????? ???? ???? ??????? ?? ?? ?? ?? ?? ???",
  },
  bn: {
    userTitle: "???????",
    title: "????????? ?????",
    defaultGreeting:
      "??????? ?? ???? ???? ????? ?????? ??? ?????? ??????? ???? ?????",
    morningGreeting:
      "????????? ??? ??? ?? ???? ???? ????? ??? ?????? ??????? ???? ?????",
    eveningGreeting:
      "??? ???????? ??? ??? ???? ???? ????? ??? ?????? ??????? ???? ?????",
    afternoonGreeting:
      "???????? ??? ??? ???? ???? ????? ?? ??? ?????? ??????? ???? ?????",
    concernSingle: (symptom) =>
      `??????? ?????? ?? ????? ${symptom} ?????? ??? ???? ???? ?????, ???? ?????, ?? ???? ???? ????? ??? ??, ??????`,
    concernMultiple:
      "??????? ?????? ?? ???? ?? ??????????? ???? ???????? ??? ???? ???? ?????, ???? ?????, ?? ????? ?? ?? ??????",
    concernGeneric:
      "??????? ??? ??????? ???? ????????? ???? ?? ????? ????? ??? ??? ???? ?????, ??????",
  },
  mr: {
    userTitle: "???????",
    title: "?????????? ?????",
    defaultGreeting: "???????. ?? ???????? ??? ???? ???? ?? ??? ??? ??? ?????",
    morningGreeting:
      "??? ??????. ??? ??? ???????? ?? ??? ???? ???. ?? ??? ??? ??? ?????",
    eveningGreeting:
      "??? ??????. ??? ??? ?????? ??? ????. ?? ??? ??? ??? ?????",
    afternoonGreeting:
      "???????. ??? ??? ?????? ??? ????. ?? ?? ??? ??? ??? ?????",
    concernSingle: (symptom) =>
      `???????. ???????? ${symptom} ??? ???????? ???? ???? ?????. ?? ???????? ???, ???? ????? ???, ??? ??? ???? ?????? ???? ?? ?? ?????.`,
    concernMultiple:
      "???????. ???????? ?? ?????? ???? ?? ???? ???? ?????. ?? ???????? ????, ???? ????? ????, ??? ???? ???? ?? ?? ?????.",
    concernGeneric:
      "???????. ?? ???????? ???? ???. ???????? ??? ????? ??? ??? ?? ???????? ??? ?? ?????.",
  },
  ta: {
    userTitle: "????????",
    title: "?????????? ?????",
    defaultGreeting:
      "???????. ????? ??????? ?????? ?????????????? ???? ?????? ????????",
    morningGreeting:
      "???? ???????. ????? ??????? ????? ???????????? ????? ???????????. ???? ?????? ????????",
    eveningGreeting:
      "???? ???????. ??????? ????? ???????????? ????? ???????????. ???? ?????? ????????",
    afternoonGreeting:
      "???????. ??????? ????? ???????????? ????? ???????????. ????? ???? ?????? ????????",
    concernSingle: (symptom) =>
      `???????. ?????????? ${symptom} ????????? ?????? ?????????????. ??? ??????? ??????????, ??????? ???????? ??????, ?????? ???? ?????????? ??????? ????? ???????????.`,
    concernMultiple:
      "???????. ???? ?????????? ?????? ???????????? ????? ?????? ?????????????. ??? ??????? ????????, ??????? ???????? ?????, ?????? ?????????? ????? ???????????.",
    concernGeneric:
      "???????. ???? ??? ?????? ???????????. ??????? ???? ?????????????, ??? ??????? ?????????? ????? ???????????.",
  },
  te: {
    userTitle: "???????",
    title: "??????? ??????",
    defaultGreeting:
      "???. ???? ? ???? ??? ????????????????? ???? ??? ???????????",
    morningGreeting:
      "???????. ???? ? ???? ???? ???????? ?????????????. ???? ??? ???????????",
    eveningGreeting:
      "??? ????????. ???? ???? ???????? ?????????????. ???? ??? ???????????",
    afternoonGreeting:
      "????????. ???? ???? ???????? ?????????????. ???? ? ???? ??? ???????????",
    concernSingle: (symptom) =>
      `???. ???? ${symptom} ????? ???? ????? ????. ??? ?????? ????? ????, ??? ???????? ????, ???? ??? ???????? ??????? ??????????`,
    concernMultiple:
      "???. ? ???????? ????????? ??????? ????????????? ???? ????? ????. ??? ?????? ????? ???????, ??? ???????? ???????, ???? ???????????????? ??????????",
    concernGeneric:
      "???. ???? ????? ????????? ???????? ???????. ???? ??? ????????????????, ??? ?????? ????? ???? ??????????",
  },
};

const DETAIL_HINT_TOKENS = [
  "since",
  "today",
  "yesterday",
  "morning",
  "evening",
  "afternoon",
  "day",
  "days",
  "week",
  "weeks",
  "hour",
  "hours",
  "mild",
  "moderate",
  "severe",
  "worse",
  "worsening",
  "started",
  "start",
  "??",
  "??",
  "???",
  "????",
  "????",
  "?????",
  "?????",
  "?????",
  "??",
  "???",
  "???",
  "?????",
  "??????",
  "?????",
  "??????",
  "?????",
  "????",
  "???",
  "???",
  "????",
  "?????",
  "?????",
  "??????",
  "????",
  "???",
  "?????",
  "?????",
  "??????",
  "????????",
  "?????",
  "?????",
  "????",
  "???",
  "????",
  "?????",
  "???????",
  "?????",
];

const ACCOUNT_STORAGE_KEY = "healthAIAccounts";
const SESSION_STORAGE_KEY = "healthAISession";
const LANGUAGE_NATIVE_LABELS = {
  en: "English",
  hi: "?????",
  bn: "?????",
  mr: "?????",
  ta: "?????",
  te: "??????",
};
const UI_COPY = {
  en: {
    onboarding: {
      suggestedFromDevice: "Suggested from your device",
      welcomeTitle: "Welcome to Health AI",
      selectLanguageFirst:
        "Select your language first, then sign up or log in to continue.",
      recommended: "Recommended",
      basedOnDevice: "Based on your browser language and device region.",
      useSuggestion: "Use suggestion",
      selectLanguage: "Select language",
      continue: "Continue",
      changeLanguage: "Change language",
      welcomeBack: "Welcome Back",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      logIn: "Log in",
      signUp: "Sign up",
      privateHistory:
        "Private chat history stays with this account on this device.",
      fullName: "Full name",
      email: "Email",
      password: "Password",
      createAccountButton: "Create account",
      loginButton: "Login",
      or: "OR",
    },
    auth: {
      socialUnavailable: (provider, mode) =>
        `${provider} sign-in is not connected yet. Use email ${mode === "signup" ? "sign up" : "login"} for now.`,
      enterEmailPassword: "Enter your email and password to continue.",
      enterFullName: "Enter your full name to create an account.",
      passwordTooShort: "Use at least 6 characters for the password.",
      accountExists:
        "An account with this email already exists. Please log in instead.",
      noAccountFound:
        "No account was found with this email. Please sign up first.",
      incorrectPassword: "Incorrect password. Please try again.",
    },
    shell: {
      appName: "Health AI",
      workspace: "Rural care workspace",
      multilingual: "Multilanguage",
      newChat: "New Chat",
      searchChats: "Search chats",
      searchHistory: "Search history",
      chatHistory: "Chat history",
      noChatHistory: "No chat history yet.",
      logout: "Logout",
      language: "Language",
      ready: "Ready when you are.",
      readySubtitle: "Describe your symptoms in your language",
    },
    tools: {
      quickActions: "Quick actions",
      close: "Close",
      whoNeedsHelp: "Who needs help?",
      quickSymptoms: "Quick symptoms",
      howLong: "How long?",
      howSerious: "How serious does it feel?",
      state: "State",
      district: "District",
      neededSpecialty: "Needed specialty",
      selectState: "Select state",
      selectDistrict: "Select district",
      selectSpecialty: "Select specialty",
      pastePrescription: "Paste prescription text here",
      explainPrescription: "Explain prescription",
      working: "Working...",
      searching: "Searching...",
      findFacilities: "Find facilities",
      describeSymptoms: "Describe your symptoms...",
      addFilesTitle: "Add photos & files",
      addFilesSubtitle: "Bring in prescriptions, reports, or notes",
      thinkingTitle: "Thinking",
      thinkingSubtitle: "Guide the symptom check step by step",
      deepResearchTitle: "Deep research",
      deepResearchSubtitle: "Open trusted public health guidance",
      openSource: "Open source",
    },
    conversation: {
      symptomCheck: "Symptom check",
      prescriptionExplainer: "Prescription explainer",
      facilityFinder: "Facility finder",
      noSymptomDetails: "No symptom details",
      noPrescriptionText: "No prescription text entered",
      noFinderFilters: "No finder filters selected",
      analysisFailed: "Analysis failed",
      prescriptionFailed: "Prescription request failed",
      facilityFailed: "Facility request failed",
      more: "more",
    },
    durationLabels: {
      today: "Today",
      "1_3_days": "1-3 days",
      "4_7_days": "4-7 days",
      more_than_week: "More than a week",
    },
    intensityLabels: {
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",
    },
    toolTitles: {
      prescription: "Add photos & files",
      finder: "Facility finder",
      sources: "Deep research",
      triage: "Thinking",
    },
    messages: {
      you: "You",
      specialty: "Specialty",
      firstStop: "First stop",
      whatToDoNow: "What to do now",
      homeCareNotes: "Home care notes",
      goSoonerIf: "Go sooner if",
      suggestedFacilities: "Suggested facilities",
      trustedSourceCards: "Trusted source cards",
      openSource: "Open source",
      prescriptionExplainer: "Prescription explainer",
      times: "Times",
      mealRelation: "Meal relation",
      decodedAs: "Decoded as",
      abbreviationLegend: "Abbreviation legend",
      safetyReminders: "Safety reminders",
      facilityFinder: "Facility finder",
    },
  },
  hi: {
    onboarding: {
      suggestedFromDevice: "???? ?????? ?? ???? ??",
      welcomeTitle: "Health AI ??? ???? ?????? ??",
      selectLanguageFirst:
        "???? ???? ???? ?????, ??? ???? ?? ?? ??? ?? ???? ??? ??????",
      recommended: "????? ?? ????",
      basedOnDevice: "?? ???? ???????? ???? ?? ?????? ??????? ?? ???? ?? ???",
      useSuggestion: "????? ?????",
      selectLanguage: "???? ?????",
      continue: "??? ?????",
      changeLanguage: "???? ?????",
      welcomeBack: "??? ?? ?????? ??",
      createAccount: "???? ?????",
      alreadyHaveAccount: "???? ???? ???? ?? ???? ???",
      noAccount: "???? ???? ???? ???? ???",
      logIn: "??? ??",
      signUp: "???? ??",
      privateHistory: "?? ?????? ?? ??? ?????? ??? ???? ?? ??? ???????? ??????",
      fullName: "???? ???",
      email: "????",
      password: "???????",
      createAccountButton: "???? ?????",
      loginButton: "??? ??",
      or: "??",
    },
    auth: {
      socialUnavailable: (provider, mode) =>
        `${provider} ????-?? ??? ?????? ???? ??? ?????? ???? ${mode === "signup" ? "???? ??" : "??? ??"} ?? ????? ?????`,
      enterEmailPassword: "??? ????? ?? ??? ???? ???? ?? ??????? ???? ?????",
      enterFullName: "???? ????? ?? ??? ???? ???? ??? ???? ?????",
      passwordTooShort: "??????? ?? ?? ?? 6 ??????? ?? ???? ??????",
      accountExists: "?? ???? ?? ???? ???? ?? ????? ??? ????? ??? ?? ?????",
      noAccountFound: "?? ???? ?? ??? ???? ???? ????? ???? ???? ?? ?????",
      incorrectPassword: "??????? ??? ??? ????? ??? ?? ????? ?????",
    },
    shell: {
      appName: "Health AI",
      workspace: "??????? ????????? ????????????",
      multilingual: "???????",
      newChat: "?? ???",
      searchChats: "??? ?????",
      searchHistory: "?????? ?????",
      chatHistory: "??? ??????",
      noChatHistory: "??? ??? ??? ?????? ???? ???",
      logout: "??? ???",
      language: "????",
      ready: "?? ?? ????? ????",
      readySubtitle: "???? ????? ???? ???? ??? ?????",
    },
    tools: {
      quickActions: "?????? ??????",
      close: "??? ????",
      whoNeedsHelp: "???? ??? ??????",
      quickSymptoms: "?????? ?????",
      howLong: "????? ??? ???",
      howSerious: "?????? ????? ????? ?? ??? ???",
      state: "?????",
      district: "????",
      neededSpecialty: "?????? ??????????",
      selectState: "????? ?????",
      selectDistrict: "???? ?????",
      selectSpecialty: "?????????? ?????",
      pastePrescription: "???? ????? ?? ??? ????? ????",
      explainPrescription: "????? ??????",
      working: "??? ?? ??? ??...",
      searching: "??? ??? ???...",
      findFacilities: "?????? ?????",
      describeSymptoms: "???? ????? ?????...",
      addFilesTitle: "???? ?? ??????? ??????",
      addFilesSubtitle: "?????, ??????? ?? ??? ??????",
      thinkingTitle: "??? ??? ???",
      thinkingSubtitle: "????? ???? ?? ???-??-??? ???? ????",
      deepResearchTitle: "????? ?? ???????",
      deepResearchSubtitle: "????????? ????????? ????????? ?????????? ?????",
      openSource: "????? ?????",
    },
    conversation: {
      symptomCheck: "????? ????",
      prescriptionExplainer: "????? ?????? ????",
      facilityFinder: "?????? ???",
      noSymptomDetails: "??? ????? ????? ????",
      noPrescriptionText: "??? ????? ??? ???? ???? ???? ???",
      noFinderFilters: "??? ??? ??????? ???? ???? ???",
      analysisFailed: "???????? ????",
      prescriptionFailed: "????? ?????? ????",
      facilityFailed: "?????? ?????? ????",
      more: "??",
    },
    durationLabels: {
      today: "??",
      "1_3_days": "1-3 ???",
      "4_7_days": "4-7 ???",
      more_than_week: "?? ?????? ?? ????",
    },
    intensityLabels: {
      mild: "?????",
      moderate: "?????",
      severe: "?????",
    },
    toolTitles: {
      prescription: "???? ?? ??????? ??????",
      finder: "?????? ???",
      sources: "????? ?? ???????",
      triage: "??? ??? ???",
    },
    messages: {
      you: "??",
      specialty: "??????????",
      firstStop: "???? ??????",
      whatToDoNow: "?? ???? ????",
      homeCareNotes: "?? ?? ??????",
      goSoonerIf: "?? ????????? ??? ????? ????",
      suggestedFacilities: "????? ?? ??????",
      trustedSourceCards: "????????? ????? ?????",
      openSource: "????? ?????",
      prescriptionExplainer: "????? ?????? ????",
      times: "???",
      mealRelation: "???? ?????",
      decodedAs: "????",
      abbreviationLegend: "??????? ???? ????",
      safetyReminders: "??????? ?????",
      facilityFinder: "?????? ???",
    },
  },
};

Object.assign(CLARIFICATION_COPY, CLARIFICATION_COPY_OVERRIDES);
Object.assign(LANGUAGE_NATIVE_LABELS, LANGUAGE_NATIVE_LABELS_OVERRIDES);
Object.assign(UI_COPY, UI_COPY_OVERRIDES);

function getUiCopy(language) {
  const baseCode = (language || "en").split(/[-_]/)[0].toLowerCase();
  return UI_COPY[baseCode] ?? UI_COPY.en;
}

const DEFAULT_MEDICAL_BOOK_COPY = {
  sectionEyebrow: "Grounded reference",
  sectionTitle: "Read Medical Book",
  manageButton: "Manage",
  emptyState:
    "Upload a trusted medical book or guideline to answer questions from it.",
  verifiedBadge: "Verified source",
  cautionBadge: "Use with caution",
  activeModeLabel: "Book mode on",
  useForAnswers: "Use for answers",
  proceedWithCaution: "Proceed with caution",
  removingLabel: "Removing...",
  confirmingLabel: "Confirming...",
  removeBook: "Remove",
  uploadTitle: "Upload a medical book",
  uploadSubtitle:
    "Add a PDF, DOCX, TXT, or pasted medical text. Answers will stay grounded in the selected book.",
  bookNameLabel: "Book name",
  bookNamePlaceholder: "Gray's Anatomy.pdf",
  sourceLabel: "Source or publisher",
  sourcePlaceholder: "WHO, Elsevier, Oxford, university, etc.",
  uploadFileLabel: "Upload file",
  uploadFileHint: "Supported in this demo: PDF, DOCX, TXT, and Markdown.",
  uploadingLabel: "Uploading medical book...",
  pasteTextLabel: "Or paste medical text",
  pasteTextPlaceholder:
    "Paste a chapter, guideline excerpt, or textbook section here...",
  uploadingTextLabel: "Saving text...",
  saveProvidedText: "Save provided text",
  libraryTitle: "Book library",
  librarySubtitle:
    "Choose which uploaded medical book should ground the answers.",
  bookCountLabel: "books",
  pagesLabel: "pages",
  charactersLabel: "characters",
  selectedLabel: "Selected",
  selectBook: "Select",
  composerPlaceholder: "Ask something from the selected medical book...",
  composerHint:
    "Answers will use only the selected medical book when possible.",
  composerChip: "Read Medical Book",
  exitBookMode: "Exit book mode",
  uploadFirstPrompt: "Please upload or select a medical book first.",
  uploadErrorTitle: "Book upload failed",
  queryErrorTitle: "Medical book answer unavailable",
  sourceWarningTitle: "Source check",
  removeErrorTitle: "Unable to remove book",
  confirmErrorTitle: "Unable to confirm source",
  openMenuTitle: "Read Medical Book",
  openMenuSubtitle: "Upload a PDF, document, or text for grounded answers",
};

function getMedicalBookCopy(ui) {
  return {
    ...DEFAULT_MEDICAL_BOOK_COPY,
    sectionTitle:
      ui?.toolTitles?.books ?? DEFAULT_MEDICAL_BOOK_COPY.sectionTitle,
    verifiedBadge:
      ui?.messages?.verifiedSource ?? DEFAULT_MEDICAL_BOOK_COPY.verifiedBadge,
    cautionBadge:
      ui?.messages?.cautionSource ?? DEFAULT_MEDICAL_BOOK_COPY.cautionBadge,
  };
}

function getLanguageDisplayLabel(item) {
  return (
    LANGUAGE_NATIVE_LABELS[item?.code] ?? item?.label ?? item?.code ?? "English"
  );
}

function detectSuggestedLanguageCode(languageList = DEFAULT_LANGUAGE_OPTIONS) {
  return (
    buildSuggestedLanguageCodes(languageList)[0] ??
    languageList[0]?.code ??
    "en"
  );
}

function readStoredJson(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeEmailAddress(value) {
  return (value || "").trim().toLowerCase();
}

function getUserStorageKey(userEmail, suffix) {
  return `healthai:${normalizeEmailAddress(userEmail)}:${suffix}`;
}

function buildConversationId() {
  return `chat-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function truncateText(value, maxLength) {
  const text = (value || "").trim();
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(maxLength - 3, 1)).trimEnd()}...`;
}

function deriveConversationMeta(thread, fallback = {}) {
  const latestUserMessage = [...thread]
    .reverse()
    .find((item) => item.role === "user");
  const title = truncateText(
    fallback.title || latestUserMessage?.title || "New chat",
    40,
  );
  const subtitleSource =
    fallback.subtitle ||
    latestUserMessage?.text ||
    latestUserMessage?.payload?.display?.headline ||
    "Continue the conversation";

  return {
    title,
    subtitle: truncateText(subtitleSource, 96),
  };
}

function buildLegacyConversationCollection() {
  const stored = readStoredJson("chatSessions", null);
  if (Array.isArray(stored) && stored.length) {
    return stored.map((item) => ({
      ...item,
      thread: Array.isArray(item.thread) ? item.thread : [],
    }));
  }

  const legacyThread = readStoredJson("threadCache", []);
  const legacyHistory = readStoredJson("caseHistory", []);
  if (legacyThread.length) {
    const fallback = legacyHistory[0] ?? {};
    return [
      {
        id: "legacy-thread",
        updatedAt: Date.now(),
        thread: legacyThread,
        ...deriveConversationMeta(legacyThread, {
          title: fallback.title || "Recent chat",
          subtitle: fallback.subtitle || "Restored conversation",
        }),
      },
    ];
  }

  return [];
}

function buildConversationStateForUser(userEmail) {
  if (!userEmail || typeof window === "undefined") {
    return { conversations: [], activeConversationId: null, thread: [] };
  }

  const normalizedEmail = normalizeEmailAddress(userEmail);
  const stored = readStoredJson(
    getUserStorageKey(normalizedEmail, "chatSessions"),
    null,
  );
  let conversations = Array.isArray(stored)
    ? stored.map((item) => ({
        ...item,
        thread: Array.isArray(item.thread) ? item.thread : [],
      }))
    : [];

  if (!conversations.length) {
    const legacyEmail = normalizeEmailAddress(
      window.localStorage.getItem("healthAIEmail") || "",
    );
    if (legacyEmail && legacyEmail === normalizedEmail) {
      conversations = buildLegacyConversationCollection();
    }
  }

  const storedActiveConversationId = window.localStorage.getItem(
    getUserStorageKey(normalizedEmail, "activeConversationId"),
  );
  const activeConversationId =
    storedActiveConversationId &&
    conversations.some((item) => item.id === storedActiveConversationId)
      ? storedActiveConversationId
      : (conversations[0]?.id ?? null);

  return {
    conversations,
    activeConversationId,
    thread:
      conversations.find((item) => item.id === activeConversationId)?.thread ??
      [],
  };
}

function buildInitialSession() {
  if (typeof window === "undefined") return null;

  const stored = readStoredJson(SESSION_STORAGE_KEY, null);
  if (stored?.email) {
    const normalizedEmail = normalizeEmailAddress(stored.email);
    return {
      name: stored.name || normalizedEmail.split("@")[0],
      email: normalizedEmail,
    };
  }

  const legacyEmail = normalizeEmailAddress(
    window.localStorage.getItem("healthAIEmail") || "",
  );
  if (window.localStorage.getItem("welcomeSeen") === "true" && legacyEmail) {
    return {
      name: legacyEmail.split("@")[0],
      email: legacyEmail,
    };
  }

  return null;
}

function selectNextBookId(books, preferredId = null) {
  if (!Array.isArray(books) || !books.length) return null;
  if (preferredId && books.some((book) => book.id === preferredId)) {
    return preferredId;
  }
  return books[0]?.id ?? null;
}

function resolveUploadedBookName(file, typedName) {
  const trimmed = (typedName || "").trim();
  if (!trimmed) return file.name;
  if (/\.[^.]+$/.test(trimmed)) return trimmed;
  const extensionMatch = /\.[^.]+$/.exec(file.name || "");
  return extensionMatch ? `${trimmed}${extensionMatch[0]}` : trimmed;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () =>
      reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

function normalizeFreeText(value) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const LEADING_GREETING_REGEX = new RegExp(
  `^(?:${[...GREETING_TOKENS]
    .sort((left, right) => right.length - left.length)
    .map((token) => escapeRegExp(token.toLowerCase()))
    .join("|")})(?:[\\s,!.?:;-]+|$)`,
  "iu",
);

function getDoctorGreetingCopy(language) {
  const baseCode = (language || "en").split(/[-_]/)[0].toLowerCase();
  return DOCTOR_GREETING_COPY[baseCode] ?? DOCTOR_GREETING_COPY.en;
}

function extractLeadingGreeting(notes) {
  const trimmed = (notes || "").trim();
  const match = trimmed.match(LEADING_GREETING_REGEX);
  return match ? match[0].replace(/[\s,!.?:;-]+$/u, "").trim() : "";
}

function stripLeadingGreeting(notes) {
  const trimmed = (notes || "").trim();
  return trimmed
    .replace(LEADING_GREETING_REGEX, "")
    .replace(/^[,!.?:;\-\s]+/u, "")
    .trim();
}

function findMentionedSymptomIds(notes, symptoms) {
  const normalized = normalizeFreeText(notes);
  if (!normalized) return [];

  return symptoms
    .filter((symptom) => {
      const keywords = symptom.keywords ?? [];
      const labels = symptom.labels ? Object.values(symptom.labels) : [];
      return [...keywords, ...labels].some((token) => {
        const normalizedToken = normalizeFreeText(token);
        return normalizedToken && normalized.includes(normalizedToken);
      });
    })
    .map((symptom) => symptom.id);
}

function containsKnownSymptom(notes, symptoms) {
  return findMentionedSymptomIds(notes, symptoms).length > 0;
}

function hasClinicalDetailSignals(notes) {
  const normalized = normalizeFreeText(notes);
  if (!normalized) return false;
  if (/\d/u.test(normalized)) return true;
  return DETAIL_HINT_TOKENS.some((token) => normalized.includes(token));
}

function isGreetingOnly(notes) {
  return Boolean(extractLeadingGreeting(notes)) && !stripLeadingGreeting(notes);
}

function needsGreetingConcernFollowUp(notes, selectedIds, symptoms) {
  const normalized = normalizeFreeText(notes);
  if (!normalized) return false;

  const mentionedIds = selectedIds.length
    ? selectedIds
    : findMentionedSymptomIds(normalized, symptoms);
  if (!mentionedIds.length) return false;
  if (mentionedIds.length > 1) return false;
  if (hasClinicalDetailSignals(normalized)) return false;

  return normalized.split(" ").filter(Boolean).length <= 8;
}

function needsSymptomClarification(notes, selectedIds, symptoms) {
  const normalized = normalizeFreeText(notes);
  if (selectedIds.length) return false;
  if (!normalized) return true;
  if (containsKnownSymptom(normalized, symptoms)) return false;
  if (isGreetingOnly(normalized)) return true;
  return normalized.split(" ").filter(Boolean).length <= 6;
}

function buildDoctorGreetingReply(language, leadingGreeting) {
  const copy = getDoctorGreetingCopy(language);
  const normalizedGreeting = normalizeFreeText(leadingGreeting);
  if (normalizedGreeting.includes("good morning"))
    return { title: copy.title, text: copy.morningGreeting };
  if (normalizedGreeting.includes("good evening"))
    return { title: copy.title, text: copy.eveningGreeting };
  if (normalizedGreeting.includes("good afternoon"))
    return { title: copy.title, text: copy.afternoonGreeting };
  return { title: copy.title, text: copy.defaultGreeting };
}

function formatSymptomLabelForReply(label, language) {
  if (!label) return "";
  const baseCode = (language || "en").split(/[-_]/)[0].toLowerCase();
  return baseCode === "en" ? label.toLowerCase() : label;
}

function buildGreetingConcernReply(language, symptomLabels) {
  const copy = getDoctorGreetingCopy(language);
  if (symptomLabels.length > 1)
    return { title: copy.title, text: copy.concernMultiple };
  if (symptomLabels.length === 1) {
    return {
      title: copy.title,
      text: copy.concernSingle(
        formatSymptomLabelForReply(symptomLabels[0], language),
      ),
    };
  }
  return { title: copy.title, text: copy.concernGeneric };
}

function App() {
  const [initialSession] = useState(() => buildInitialSession());
  const [initialConversationState] = useState(() =>
    buildConversationStateForUser(initialSession?.email),
  );

  const [bootstrap, setBootstrap] = useState(null);
  const [currentUser, setCurrentUser] = useState(initialSession);
  const [language, setLanguage] = useState(
    () =>
      localStorage.getItem("uiLanguage") ||
      detectSuggestedLanguageCode(DEFAULT_LANGUAGE_OPTIONS),
  );
  const [showWelcome, setShowWelcome] = useState(!initialSession?.email);
  const [welcomeStep, setWelcomeStep] = useState(
    initialSession?.email ? "auth" : "language",
  );
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [fullName, setFullName] = useState(initialSession?.name || "");
  const [email, setEmail] = useState(initialSession?.email || "");
  const [password, setPassword] = useState("");
  const [accounts, setAccounts] = useState(() => {
    const storedAccounts = readStoredJson(ACCOUNT_STORAGE_KEY, []);
    return Array.isArray(storedAccounts) ? storedAccounts : [];
  });
  const [conversations, setConversations] = useState(
    initialConversationState.conversations,
  );
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversationState.activeConversationId,
  );
  const [thread, setThread] = useState(initialConversationState.thread);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [persona, setPersona] = useState("adult");
  const [duration, setDuration] = useState("today");
  const [intensity, setIntensity] = useState("mild");
  const [triageState, setTriageState] = useState("");
  const [triageDistrict, setTriageDistrict] = useState("");
  const [finderState, setFinderState] = useState("");
  const [finderDistrict, setFinderDistrict] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [prescriptionInput, setPrescriptionInput] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [composerMode, setComposerMode] = useState("triage");
  const [bookNameInput, setBookNameInput] = useState("");
  const [bookSourceInput, setBookSourceInput] = useState("");
  const [bookTextInput, setBookTextInput] = useState("");
  const [toolSheetOpen, setToolSheetOpen] = useState(false);
  const [uploadingBook, setUploadingBook] = useState(false);
  const [uploadingTextBook, setUploadingTextBook] = useState(false);
  const [queryingBook, setQueryingBook] = useState(false);
  const [removingBookId, setRemovingBookId] = useState("");
  const [confirmingBookId, setConfirmingBookId] = useState("");
  const [activeTool, setActiveTool] = useState("triage");
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [explainingPrescription, setExplainingPrescription] = useState(false);
  const [searchingFacilities, setSearchingFacilities] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(() =>
    initialSession?.email
      ? readStoredJson(
          getUserStorageKey(initialSession.email, "lastAnalysis"),
          null,
        )
      : null,
  );

  const threadEndRef = useAutoScroll([thread]);
  const showBookModal = toolSheetOpen && activeTool === "books";
  const showQuickActionSheet = toolSheetOpen && activeTool !== "books";
  const recognitionRef = useRef(null);
  const activeConversationIdRef = useRef(
    initialConversationState.activeConversationId,
  );

  useEffect(() => {
    let cancelled = false;
    fetchBootstrap("bootstrapCache")
      .then((data) => {
        if (!cancelled) setBootstrap(data);
      })
      .catch(() => {
        const cached = localStorage.getItem("bootstrapCache");
        if (cached && !cancelled) setBootstrap(JSON.parse(cached));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => localStorage.setItem("uiLanguage", language), [language]);
  useEffect(
    () => localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts)),
    [accounts],
  );
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(currentUser));
      localStorage.setItem("welcomeSeen", "true");
      localStorage.setItem("healthAIEmail", currentUser.email);
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem("welcomeSeen");
      localStorage.removeItem("healthAIEmail");
    }
  }, [currentUser]);
  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);
  useEffect(() => {
    const nextConversationState = buildConversationStateForUser(
      currentUser?.email,
    );
    activeConversationIdRef.current =
      nextConversationState.activeConversationId;
    setConversations(nextConversationState.conversations);
    setActiveConversationId(nextConversationState.activeConversationId);
    setThread(nextConversationState.thread);
    setLastAnalysis(
      currentUser?.email
        ? readStoredJson(
            getUserStorageKey(currentUser.email, "lastAnalysis"),
            null,
          )
        : null,
    );
    setSearchTerm("");
    setNotes("");
    clearCurrentInput();
    setPrescriptionInput("");
    setFinderState("");
    setFinderDistrict("");
    setSpecialty("");
    setBooks([]);
    setSelectedBookId(null);
    setComposerMode("triage");
    setBookNameInput("");
    setBookSourceInput("");
    setBookTextInput("");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }, [currentUser?.email]);
  useEffect(() => {
    if (!currentUser?.email) return;

    let cancelled = false;
    fetchBooks(currentUser.email)
      .then((data) => {
        if (cancelled) return;
        const nextBooks = Array.isArray(data?.books) ? data.books : [];
        setBooks(nextBooks);
        setSelectedBookId((current) => selectNextBookId(nextBooks, current));
        if (!nextBooks.length) {
          setComposerMode("triage");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setBooks([]);
        setSelectedBookId(null);
        setComposerMode("triage");
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.email]);
  useEffect(() => {
    if (!currentUser?.email) return;
    localStorage.setItem(
      getUserStorageKey(currentUser.email, "chatSessions"),
      JSON.stringify(conversations),
    );
  }, [conversations, currentUser?.email]);
  useEffect(() => {
    if (!currentUser?.email) return;
    const storageKey = getUserStorageKey(
      currentUser.email,
      "activeConversationId",
    );
    if (activeConversationId) {
      localStorage.setItem(storageKey, activeConversationId);
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [activeConversationId, currentUser?.email]);
  useEffect(() => {
    if (!currentUser?.email) return;
    const storageKey = getUserStorageKey(currentUser.email, "threadCache");
    if (activeConversationId && thread.length) {
      localStorage.setItem(storageKey, JSON.stringify(thread));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [activeConversationId, currentUser?.email, thread]);
  useEffect(() => {
    if (!currentUser?.email) return;
    const lightweightHistory = conversations.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
    }));
    localStorage.setItem(
      getUserStorageKey(currentUser.email, "caseHistory"),
      JSON.stringify(lightweightHistory),
    );
  }, [conversations, currentUser?.email]);
  useEffect(() => {
    if (!currentUser?.email) return;
    const storageKey = getUserStorageKey(currentUser.email, "lastAnalysis");
    if (lastAnalysis) {
      localStorage.setItem(storageKey, JSON.stringify(lastAnalysis));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [currentUser?.email, lastAnalysis]);
  useEffect(() => {
    setAuthError("");
  }, [authMode]);

  const languageOptions = bootstrap?.languages?.length
    ? bootstrap.languages
    : DEFAULT_LANGUAGE_OPTIONS;
  const symptoms = bootstrap?.symptoms ?? [];
  const personas = bootstrap?.personas ?? [];
  const states = bootstrap?.states ?? {};
  const finderStates = Object.keys(states);
  const triageDistricts = states[triageState] ?? [];
  const finderDistricts = states[finderState] ?? [];
  const specialtyEntries = Object.entries(bootstrap?.specialties ?? {});
  const suggestedLanguageCodes = buildSuggestedLanguageCodes(languageOptions);
  const suggestedLanguages = suggestedLanguageCodes
    .map((code) => languageOptions.find((item) => item.code === code))
    .filter(Boolean);
  const suggestedLanguageCode =
    suggestedLanguages[0]?.code ?? detectSuggestedLanguageCode(languageOptions);
  const suggestedLanguage =
    suggestedLanguages[0] ??
    languageOptions.find((item) => item.code === suggestedLanguageCode) ??
    languageOptions[0];
  const selectedLanguage =
    languageOptions.find((item) => item.code === language) ??
    suggestedLanguage ??
    languageOptions[0];
  const ui = getUiCopy(language);
  const bookUi = getMedicalBookCopy(ui);
  const durationOptions = Object.entries(ui.durationLabels);
  const intensityOptions = Object.entries(ui.intensityLabels);
  const selectedBook =
    books.find((book) => book.id === selectedBookId) ?? books[0] ?? null;
  const composerBusy = composerMode === "book" ? queryingBook : analyzing;
  const actionMenuItems = [
    ["books", bookUi.openMenuTitle, bookUi.openMenuSubtitle],
    ["prescription", ui.tools.addFilesTitle, ui.tools.addFilesSubtitle],
    ["triage", ui.tools.thinkingTitle, ui.tools.thinkingSubtitle],
    ["sources", ui.tools.deepResearchTitle, ui.tools.deepResearchSubtitle],
  ];
  const filteredHistory = conversations.filter((item) => {
    const haystack = [item.title, item.subtitle]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });
  const selectedSymptomLabels = selectedSymptoms.map((id) =>
    findSymptomLabel(symptoms, id, language),
  );

  function persistConversation(nextThread, metadata = null) {
    const existingId = activeConversationIdRef.current;
    const resolvedId = existingId ?? buildConversationId();

    if (!existingId) {
      activeConversationIdRef.current = resolvedId;
      setActiveConversationId(resolvedId);
    }

    setConversations((current) => {
      const existingConversation = current.find(
        (item) => item.id === resolvedId,
      );
      const nextConversation = {
        id: resolvedId,
        updatedAt: Date.now(),
        thread: nextThread,
        ...deriveConversationMeta(nextThread, {
          title: metadata?.title ?? existingConversation?.title,
          subtitle: metadata?.subtitle ?? existingConversation?.subtitle,
        }),
      };

      return [
        nextConversation,
        ...current.filter((item) => item.id !== resolvedId),
      ].slice(0, 20);
    });
  }

  function applyBookList(nextBooks, preferredId = null) {
    const resolvedBooks = Array.isArray(nextBooks) ? nextBooks : [];
    setBooks(resolvedBooks);
    setSelectedBookId((current) =>
      selectNextBookId(resolvedBooks, preferredId ?? current),
    );
    if (!resolvedBooks.length) {
      setComposerMode("triage");
    }
  }

  function handleLanguageContinue() {
    setAuthError("");
    setWelcomeStep("auth");
  }

  function completeAuthentication(account) {
    const nextUser = {
      name:
        account.name?.trim() ||
        normalizeEmailAddress(account.email).split("@")[0],
      email: normalizeEmailAddress(account.email),
    };

    setCurrentUser(nextUser);
    setShowWelcome(false);
    setWelcomeStep("auth");
    setAuthMode("login");
    setAuthError("");
    setFullName(nextUser.name);
    setEmail(nextUser.email);
    setPassword("");
  }

  function handleSocialPlaceholder(provider) {
    setAuthError(ui.auth.socialUnavailable(provider, authMode));
  }

  function handleWelcomeSubmit(event) {
    event.preventDefault();
    const normalizedEmail = normalizeEmailAddress(email);
    const trimmedName = fullName.trim();
    setAuthError("");

    if (!normalizedEmail || !password) {
      setAuthError(ui.auth.enterEmailPassword);
      return;
    }

    if (authMode === "signup") {
      if (!trimmedName) {
        setAuthError(ui.auth.enterFullName);
        return;
      }
      if (password.length < 6) {
        setAuthError(ui.auth.passwordTooShort);
        return;
      }

      const existingAccount = accounts.find(
        (account) => normalizeEmailAddress(account.email) === normalizedEmail,
      );
      if (existingAccount) {
        setAuthError(ui.auth.accountExists);
        return;
      }

      const nextAccount = {
        id: `acct-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
        name: trimmedName,
        email: normalizedEmail,
        password,
      };
      setAccounts((current) => [...current, nextAccount]);
      completeAuthentication(nextAccount);
      return;
    }

    const existingAccount = accounts.find(
      (account) => normalizeEmailAddress(account.email) === normalizedEmail,
    );
    if (!existingAccount) {
      setAuthError(ui.auth.noAccountFound);
      return;
    }
    if (existingAccount.password !== password) {
      setAuthError(ui.auth.incorrectPassword);
      return;
    }

    completeAuthentication(existingAccount);
  }

  function pushMessage(entry, options = {}) {
    const message = { id: `${Date.now()}-${Math.random()}`, ...entry };
    setThread((current) => {
      const nextThread = [...current, message];
      if (options.persist !== false) {
        persistConversation(nextThread, options.metadata);
      }
      return nextThread;
    });
    return message;
  }

  function clearCurrentInput() {
    setNotes("");
    setSelectedSymptoms([]);
    setPersona("adult");
    setDuration("today");
    setIntensity("mild");
    setTriageState("");
    setTriageDistrict("");
  }

  function loadConversation(conversationId) {
    const selectedConversation = conversations.find(
      (item) => item.id === conversationId,
    );
    if (!selectedConversation) return;

    activeConversationIdRef.current = conversationId;
    setActiveConversationId(conversationId);
    setThread(selectedConversation.thread ?? []);
    clearCurrentInput();
    setPrescriptionInput("");
    setFinderState("");
    setFinderDistrict("");
    setSpecialty("");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  function selectBook(bookId) {
    setSelectedBookId(bookId);
  }

  function useBook(bookId) {
    setSelectedBookId(bookId);
    setComposerMode("book");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  async function uploadMedicalBookFile(file) {
    if (!currentUser?.email || !file) return;

    setUploadingBook(true);
    try {
      const contentBase64 = await fileToDataUrl(file);
      const result = await uploadBook({
        userEmail: currentUser.email,
        name: resolveUploadedBookName(file, bookNameInput),
        sourceLabel: bookSourceInput.trim(),
        mimeType: file.type || null,
        contentBase64,
      });

      applyBookList(result.books, result.book?.id ?? null);
      setComposerMode("book");
      setBookNameInput("");
      setBookSourceInput("");
      setBookTextInput("");
      setToolSheetOpen(true);
      setActiveTool("books");

      if (result.warning) {
        pushMessage(
          {
            role: "assistant",
            kind: "text",
            title: bookUi.sourceWarningTitle,
            text: result.warning,
          },
          { persist: false },
        );
      }
    } catch (error) {
      pushMessage(
        {
          role: "assistant",
          kind: "error",
          payload: { title: bookUi.uploadErrorTitle, text: error.message },
        },
        { persist: false },
      );
    } finally {
      setUploadingBook(false);
    }
  }

  async function uploadProvidedMedicalText() {
    if (!currentUser?.email) return;
    if (!bookTextInput.trim()) {
      pushMessage(
        {
          role: "assistant",
          kind: "error",
          payload: {
            title: bookUi.uploadErrorTitle,
            text: bookUi.uploadFirstPrompt,
          },
        },
        { persist: false },
      );
      return;
    }

    setUploadingTextBook(true);
    try {
      const result = await uploadBook({
        userEmail: currentUser.email,
        name:
          (bookNameInput || "Provided medical text.txt").trim() ||
          "Provided medical text.txt",
        sourceLabel: bookSourceInput.trim(),
        text: bookTextInput,
      });

      applyBookList(result.books, result.book?.id ?? null);
      setComposerMode("book");
      setBookNameInput("");
      setBookSourceInput("");
      setBookTextInput("");
      setToolSheetOpen(true);
      setActiveTool("books");

      if (result.warning) {
        pushMessage(
          {
            role: "assistant",
            kind: "text",
            title: bookUi.sourceWarningTitle,
            text: result.warning,
          },
          { persist: false },
        );
      }
    } catch (error) {
      pushMessage(
        {
          role: "assistant",
          kind: "error",
          payload: { title: bookUi.uploadErrorTitle, text: error.message },
        },
        { persist: false },
      );
    } finally {
      setUploadingTextBook(false);
    }
  }

  async function removeMedicalBook(bookId) {
    if (!currentUser?.email || !bookId) return;

    setRemovingBookId(bookId);
    try {
      const result = await removeBook({ userEmail: currentUser.email, bookId });
      applyBookList(
        result.books,
        bookId === selectedBookId ? null : selectedBookId,
      );
    } catch (error) {
      pushMessage(
        {
          role: "assistant",
          kind: "error",
          payload: { title: bookUi.removeErrorTitle, text: error.message },
        },
        { persist: false },
      );
    } finally {
      setRemovingBookId("");
    }
  }

  async function confirmMedicalBook(bookId) {
    if (!currentUser?.email || !bookId) return;

    setConfirmingBookId(bookId);
    try {
      const result = await confirmBook({
        userEmail: currentUser.email,
        bookId,
      });
      applyBookList(result.books, result.book?.id ?? bookId);
      setComposerMode("book");
    } catch (error) {
      pushMessage(
        {
          role: "assistant",
          kind: "error",
          payload: { title: bookUi.confirmErrorTitle, text: error.message },
        },
        { persist: false },
      );
    } finally {
      setConfirmingBookId("");
    }
  }

  function startNewCase() {
    activeConversationIdRef.current = null;
    setActiveConversationId(null);
    setThread([]);
    clearCurrentInput();
    setPrescriptionInput("");
    setFinderState("");
    setFinderDistrict("");
    setSpecialty("");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  function handleLogout() {
    activeConversationIdRef.current = null;
    setCurrentUser(null);
    setShowWelcome(true);
    setWelcomeStep("language");
    setAuthMode("login");
    setAuthError("");
    setFullName("");
    setEmail("");
    setPassword("");
    setThread([]);
    setConversations([]);
    setActiveConversationId(null);
    setLastAnalysis(null);
    setSearchTerm("");
    setNotes("");
    clearCurrentInput();
    setPrescriptionInput("");
    setFinderState("");
    setFinderDistrict("");
    setSpecialty("");
    setBooks([]);
    setSelectedBookId(null);
    setComposerMode("triage");
    setBookNameInput("");
    setBookSourceInput("");
    setBookTextInput("");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  function openTool(panel) {
    setActiveTool(panel);
    setToolSheetOpen(true);
    setActionMenuOpen(false);
  }

  async function requestSymptomAnalysis({
    notesText,
    symptomIds,
    personaValue,
    durationValue,
    intensityValue,
    stateValue,
    districtValue,
  }) {
    setAnalyzing(true);
    setToolSheetOpen(false);
    try {
      const result = await analyzeSymptoms({
        language,
        persona: personaValue,
        symptoms: symptomIds,
        notes: notesText,
        duration: durationValue,
        intensity: intensityValue,
        state: stateValue,
        district: districtValue,
      });
      setLastAnalysis(result);
      pushMessage({ role: "assistant", kind: "analysis", payload: result });
      return result;
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: ui.conversation.analysisFailed, text: error.message },
      });
      return null;
    } finally {
      setAnalyzing(false);
    }
  }

  async function runAnalysis() {
    const trimmedNotes = notes.trim();
    const leadingGreeting = extractLeadingGreeting(trimmedNotes);
    const clinicalNotes = stripLeadingGreeting(trimmedNotes) || trimmedNotes;
    const locationText = [triageDistrict, triageState]
      .filter(Boolean)
      .join(", ");
    const personaLabel =
      persona !== "adult"
        ? findPersonaLabel(personas, persona, language)
        : null;
    const mentionedSymptomIds = Array.from(
      new Set([
        ...selectedSymptoms,
        ...findMentionedSymptomIds(clinicalNotes, symptoms),
      ]),
    );
    const mentionedSymptomLabels = mentionedSymptomIds
      .map((id) => findSymptomLabel(symptoms, id, language))
      .filter(Boolean);
    const summaryParts = [
      personaLabel,
      selectedSymptomLabels.join(", ") || clinicalNotes || trimmedNotes,
      locationText,
    ].filter(Boolean);
    const summary =
      summaryParts.join(" - ") || ui.conversation.noSymptomDetails;
    const greetingCopy = getDoctorGreetingCopy(language);
    const greetingOnly = isGreetingOnly(trimmedNotes);
    const greetingNeedsFollowUp =
      Boolean(leadingGreeting) &&
      !greetingOnly &&
      needsGreetingConcernFollowUp(clinicalNotes, selectedSymptoms, symptoms);
    const shouldClarify =
      !greetingOnly &&
      !greetingNeedsFollowUp &&
      needsSymptomClarification(clinicalNotes, selectedSymptoms, symptoms);

    if (summary !== ui.conversation.noSymptomDetails) {
      pushMessage(
        {
          role: "user",
          kind: "text",
          title: greetingOnly
            ? greetingCopy.userTitle
            : ui.conversation.symptomCheck,
          text: summary,
        },
        greetingOnly || shouldClarify
          ? { persist: false }
          : {
              metadata: {
                title: ui.conversation.symptomCheck,
                subtitle: summary,
              },
            },
      );
    }

    setNotes("");
    setActionMenuOpen(false);

    if (greetingOnly) {
      const reply = buildDoctorGreetingReply(language, leadingGreeting);
      pushMessage(
        {
          role: "assistant",
          kind: "text",
          title: reply.title,
          text: reply.text,
        },
        { persist: false },
      );
      setToolSheetOpen(false);
      return;
    }

    if (greetingNeedsFollowUp) {
      const reply = buildGreetingConcernReply(language, mentionedSymptomLabels);
      pushMessage({
        role: "assistant",
        kind: "text",
        title: reply.title,
        text: reply.text,
      });
      setToolSheetOpen(false);
      return;
    }

    if (shouldClarify) {
      const clarification =
        CLARIFICATION_COPY[language] ?? CLARIFICATION_COPY.en;
      pushMessage(
        {
          role: "assistant",
          kind: "text",
          title: clarification.title,
          text: clarification.text,
        },
        { persist: false },
      );
      setToolSheetOpen(false);
      return;
    }

    await requestSymptomAnalysis({
      notesText: clinicalNotes,
      symptomIds: selectedSymptoms,
      personaValue: persona,
      durationValue: duration,
      intensityValue: intensity,
      stateValue: triageState || null,
      districtValue: triageDistrict || null,
    });
  }

  async function submitAnalysisFollowUp(message, followUpText) {
    const trimmed = followUpText.trim();
    if (!trimmed) return false;

    const payload = message.payload ?? {};
    pushMessage(
      {
        role: "user",
        kind: "text",
        title: ui.conversation.symptomCheck,
        text: trimmed,
      },
      {
        metadata: {
          title: ui.conversation.symptomCheck,
          subtitle: trimmed.slice(0, 80),
        },
      },
    );

    setNotes("");
    setActionMenuOpen(false);

    await requestSymptomAnalysis({
      notesText: trimmed,
      symptomIds: payload.symptomsDetected ?? [],
      personaValue: payload.persona ?? persona,
      durationValue: payload.duration ?? duration,
      intensityValue: payload.intensity ?? intensity,
      stateValue:
        triageState || payload.locationContext?.state || payload.state || null,
      districtValue:
        triageDistrict ||
        payload.locationContext?.district ||
        payload.district ||
        null,
    });

    return true;
  }

  async function runBookQuery() {
    const question = notes.trim();
    if (!question) return;

    if (!selectedBook?.id) {
      pushMessage(
        {
          role: "assistant",
          kind: "text",
          title: bookUi.sectionTitle,
          text: bookUi.uploadFirstPrompt,
        },
        { persist: false },
      );
      openTool("books");
      return;
    }

    pushMessage(
      {
        role: "user",
        kind: "text",
        title: bookUi.sectionTitle,
        text: question,
      },
      {
        metadata: {
          title: bookUi.sectionTitle,
          subtitle: `${truncateText(question, 60)} ? ${selectedBook.name}`,
        },
      },
    );

    setNotes("");
    setActionMenuOpen(false);
    setToolSheetOpen(false);
    setQueryingBook(true);
    try {
      const result = await queryBook({
        userEmail: currentUser?.email,
        bookId: selectedBook.id,
        question,
      });
      if (result?.book?.id) {
        setSelectedBookId(result.book.id);
      }
      pushMessage({ role: "assistant", kind: "book", payload: result });
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: bookUi.queryErrorTitle, text: error.message },
      });
    } finally {
      setQueryingBook(false);
    }
  }

  async function runPrescription() {
    const summary =
      prescriptionInput.trim() || ui.conversation.noPrescriptionText;
    pushMessage(
      {
        role: "user",
        kind: "text",
        title: ui.conversation.prescriptionExplainer,
        text: summary,
      },
      {
        metadata: {
          title: ui.conversation.prescriptionExplainer,
          subtitle: summary.slice(0, 80),
        },
      },
    );
    setExplainingPrescription(true);
    try {
      const result = await explainPrescriptionRequest({
        language,
        text: prescriptionInput,
      });
      pushMessage({ role: "assistant", kind: "prescription", payload: result });
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: {
          title: ui.conversation.prescriptionFailed,
          text: error.message,
        },
      });
    } finally {
      setExplainingPrescription(false);
    }
  }

  async function runFinder() {
    const summary =
      [finderDistrict, finderState, specialty].filter(Boolean).join(" • ") ||
      "No finder filters selected";
    pushMessage(
      {
        role: "user",
        kind: "text",
        title: ui.conversation.facilityFinder,
        text: summary,
      },
      {
        metadata: { title: ui.conversation.facilityFinder, subtitle: summary },
      },
    );
    setSearchingFacilities(true);
    try {
      const result = await searchHospitals({
        language,
        state: finderState,
        district: finderDistrict,
        specialty,
      });
      pushMessage({ role: "assistant", kind: "finder", payload: result });
    } catch (error) {
      pushMessage({
        role: "assistant",
        kind: "error",
        payload: { title: ui.conversation.facilityFailed, text: error.message },
      });
    } finally {
      setSearchingFacilities(false);
    }
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (recognitionRef.current) recognitionRef.current.stop();
    const recognition = new SpeechRecognition();
    recognition.lang =
      languageOptions.find((item) => item.code === language)?.speech ?? "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      setNotes((current) =>
        [current.trim(), transcript.trim()].filter(Boolean).join(" "),
      );
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
  }

  function toggleSymptom(id) {
    setSelectedSymptoms((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function renderMessage(message) {
    if (message.kind === "analysis")
      return (
        <AnalysisMessage
          key={message.id}
          message={message}
          ui={ui}
          onFollowUpSubmit={submitAnalysisFollowUp}
          followUpBusy={analyzing}
        />
      );
    if (message.kind === "prescription")
      return <PrescriptionMessage key={message.id} message={message} ui={ui} />;
    if (message.kind === "finder")
      return <FinderMessage key={message.id} message={message} ui={ui} />;
    if (message.kind === "book")
      return <MedicalBookMessage key={message.id} message={message} ui={ui} />;
    if (message.kind === "error")
      return (
        <TextMessage
          key={message.id}
          role="assistant"
          title={message.payload.title}
          text={message.payload.text}
          ui={ui}
        />
      );
    return (
      <TextMessage
        key={message.id}
        role={message.role}
        title={message.title}
        text={message.text}
        ui={ui}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f7fb]">
      {showWelcome ? (
        <div className="fixed inset-0 z-50 overflow-hidden bg-[#020617]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(160deg,_#030712_0%,_#0b1120_52%,_#020617_100%)]" />
          <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-12 right-16 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="relative grid min-h-screen place-items-center px-4 py-10">
{welcomeStep === "language" ? (
  <WelcomeCard
    copy={ui.onboarding}
    suggestedLanguage={suggestedLanguage}
    suggestedLanguages={suggestedLanguages}
    selectedLanguageCode={selectedLanguage?.code ?? language}
    languageOptions={languageOptions}
    getLanguageDisplayLabel={getLanguageDisplayLabel}
    onSelectLanguage={setLanguage}
    onUseSuggestion={() =>
      setLanguage(suggestedLanguage?.code ?? "en")
    }
    onContinue={handleLanguageContinue}
  />
) : authMode === "signup" ? (
  <SignupCard
    copy={ui.onboarding}
    selectedLanguageLabel={getLanguageDisplayLabel(selectedLanguage)}
    fullName={fullName}
    email={email}
    password={password}
    authError={authError}
    onChangeLanguage={() => setWelcomeStep("language")}
    onToggleAuthMode={() => setAuthMode("login")}
    onFullNameChange={(event) => setFullName(event.target.value)}
    onEmailChange={(event) => setEmail(event.target.value)}
    onPasswordChange={(event) => setPassword(event.target.value)}
    onSubmit={handleWelcomeSubmit}
    onSocialClick={handleSocialPlaceholder}
  />
) : (
  <LoginCard
    copy={ui.onboarding}
    selectedLanguageLabel={getLanguageDisplayLabel(selectedLanguage)}
    email={email}
    password={password}
    authError={authError}
    onChangeLanguage={() => setWelcomeStep("language")}
    onToggleAuthMode={() => setAuthMode("signup")}
    onEmailChange={(event) => setEmail(event.target.value)}
    onPasswordChange={(event) => setPassword(event.target.value)}
    onSubmit={handleWelcomeSubmit}
    onSocialClick={handleSocialPlaceholder}
  />
)}
          </div>
        </div>
      ) : null}

      {showBookModal ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/72 px-4 py-8 backdrop-blur-sm"
          onClick={() => setToolSheetOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={bookUi.sectionTitle}
            className="relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111]/96 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4 md:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                  {bookUi.sectionEyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {bookUi.sectionTitle}
                </h3>
                <p className="mt-2 text-sm text-white/55">
                  {bookUi.librarySubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToolSheetOpen(false)}
                className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-white/70 transition hover:bg-white/[0.08] hover:text-white"
              >
                {ui.tools.close}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6 md:py-6">
              <MedicalBookPanel
                copy={bookUi}
                books={books}
                selectedBookId={selectedBookId}
                bookNameInput={bookNameInput}
                setBookNameInput={setBookNameInput}
                bookSourceInput={bookSourceInput}
                setBookSourceInput={setBookSourceInput}
                bookTextInput={bookTextInput}
                setBookTextInput={setBookTextInput}
                uploadingBook={uploadingBook}
                uploadingTextBook={uploadingTextBook}
                removingBookId={removingBookId}
                confirmingBookId={confirmingBookId}
                onFileSelected={uploadMedicalBookFile}
                onUploadProvidedText={uploadProvidedMedicalText}
                onSelectBook={selectBook}
                onUseBook={useBook}
                onConfirmBook={confirmMedicalBook}
                onRemoveBook={removeMedicalBook}
                composerMode={composerMode}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
        <aside className="w-full shrink-0 border-b border-white/10 bg-black/35 px-4 py-5 backdrop-blur-2xl lg:flex lg:h-screen lg:w-[260px] lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white">
                HA
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {ui.shell.appName}
                </div>
                <div className="text-xs text-white/45">
                  {ui.shell.workspace}
                </div>
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/50">
              {ui.shell.multilingual}
            </span>
          </div>

          <button
            type="button"
            onClick={startNewCase}
            className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-left text-base font-medium text-white shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl transition hover:bg-white/[0.14]"
          >
            {ui.shell.newChat}
          </button>

          <label className="mt-4 block rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-xl">
            <span className="text-xs uppercase tracking-[0.22em] text-white/40">
              {ui.shell.searchChats}
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={ui.shell.searchHistory}
              className="mt-2 w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/25"
            />
          </label>

          <div className="mt-6 lg:flex-1 lg:overflow-y-auto lg:pr-1">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-white/40">
              {ui.shell.chatHistory}
            </p>
            <div className="space-y-2">
              {filteredHistory.length ? (
                filteredHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => loadConversation(item.id)}
                    className={`w-full rounded-2xl border px-3 py-3 text-left shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition ${item.id === activeConversationId ? "border-[#3b82f6]/60 bg-[#172036] text-white" : "border-white/8 bg-white/[0.04] text-white hover:bg-white/[0.08]"}`}
                  >
                    <div className="text-sm font-medium">{item.title}</div>
                    <div
                      className={`mt-1 line-clamp-2 text-xs leading-5 ${item.id === activeConversationId ? "text-blue-100/75" : "text-white/45"}`}
                    >
                      {item.subtitle}
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-6 text-sm text-white/30">
                  {ui.shell.noChatHistory}
                </div>
              )}
            </div>

            <MedicalBookSidebar
              copy={bookUi}
              books={books}
              selectedBookId={selectedBookId}
              composerMode={composerMode}
              onOpenManager={() => openTool("books")}
              onSelectBook={selectBook}
              onUseBook={useBook}
              onRemoveBook={removeMedicalBook}
              onConfirmBook={confirmMedicalBook}
              removingBookId={removingBookId}
              confirmingBookId={confirmingBookId}
            />
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.05] px-3 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-xl lg:mt-auto">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white">
                {(currentUser?.name || currentUser?.email || "HA")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-white">
                  {currentUser?.name || ui.shell.appName}
                </div>
                <div className="truncate text-xs text-white/45">
                  {currentUser?.email || "healthai@workspace.local"}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white"
            >
              {ui.shell.logout}
            </button>
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pb-4 pt-4 md:px-6 lg:h-screen lg:px-8 lg:overflow-hidden">
          {/* <header className="mb-6 flex items-center justify-end gap-3">
            <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
              <span>{ui.shell.language}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="border-none bg-transparent text-white outline-none"
              >
                {languageOptions.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                    className="bg-[#0f0f0f] text-white"
                  >
                    {getLanguageDisplayLabel(item)}
                  </option>
                ))}
              </select>
            </label>
          </header> */}

          <section className="relative min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212]/70 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            {thread.length === 0 ? (
              <div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center">
                <div className="animate-fade-up">
                  <h2 className="text-3xl font-semibold text-white md:text-5xl">
                    {ui.shell.ready}
                  </h2>
                  <p className="mt-3 text-lg text-white/70 md:text-2xl">
                    {ui.shell.readySubtitle}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="relative h-full overflow-y-auto px-4 pb-44 pt-6 md:px-8">
              <div className="mx-auto flex max-w-4xl flex-col gap-4">
                {thread.map(renderMessage)}
                <div ref={threadEndRef} />
              </div>
            </div>

            {showQuickActionSheet ? (
              <div className="absolute inset-x-4 bottom-15 z-20 md:inset-x-8">
                <div className="mx-auto max-w-3xl rounded-[1.6rem] border border-white/10 bg-[#111111]/92 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
                  <div className="mb-4 flex items-start justify-between gap-4 border-b border-white/8 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                        {ui.tools.quickActions}
                      </p>
                      <h3 className="text-xl font-semibold text-white">
                        {toolTitle(activeTool, {
                          ...ui.toolTitles,
                          books: bookUi.sectionTitle,
                        })}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setToolSheetOpen(false)}
                      className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-white/70"
                    >
                      {ui.tools.close}
                    </button>
                  </div>

                  <div className="max-h-[55vh] overflow-y-auto pr-1">
                    {activeTool === "triage" ? (
                      <div className="grid gap-4 lg:grid-cols-2">
                        <div className="lg:col-span-2">
                          <p className="mb-2 text-sm text-white/55">
                            {ui.tools.whoNeedsHelp}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {personas.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setPersona(item.id)}
                                className={`rounded-2xl px-4 py-2 text-sm transition ${persona === item.id ? "bg-white text-[#171514]" : "bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"}`}
                              >
                                {findPersonaLabel(personas, item.id, language)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-2">
                          <p className="mb-2 text-sm text-white/55">
                            {ui.tools.quickSymptoms}
                          </p>
                          <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto pr-1">
                            {symptoms.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleSymptom(item.id)}
                                className={`rounded-2xl px-4 py-2 text-sm transition ${selectedSymptoms.includes(item.id) ? "bg-[#2563eb] text-white" : "bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"}`}
                              >
                                {findSymptomLabel(symptoms, item.id, language)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <SelectField
                          label={ui.tools.howLong}
                          value={duration}
                          onChange={setDuration}
                          options={durationOptions}
                        />
                        <SelectField
                          label={ui.tools.howSerious}
                          value={intensity}
                          onChange={setIntensity}
                          options={intensityOptions}
                        />
                        <SelectField
                          label={ui.tools.state}
                          value={triageState}
                          onChange={(value) => {
                            setTriageState(value);
                            setTriageDistrict("");
                          }}
                          options={finderStates.map((item) => [item, item])}
                          emptyLabel={ui.tools.selectState}
                        />
                        <SelectField
                          label={ui.tools.district}
                          value={triageDistrict}
                          onChange={setTriageDistrict}
                          options={triageDistricts.map((item) => [item, item])}
                          emptyLabel={ui.tools.selectDistrict}
                        />
                      </div>
                    ) : null}

                    {activeTool === "prescription" ? (
                      <div className="grid gap-4">
                        <textarea
                          value={prescriptionInput}
                          onChange={(event) =>
                            setPrescriptionInput(event.target.value)
                          }
                          rows={6}
                          className="w-full rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-white/25"
                          placeholder={ui.tools.pastePrescription}
                        />
                        <button
                          type="button"
                          onClick={runPrescription}
                          disabled={explainingPrescription}
                          className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6] disabled:opacity-60"
                        >
                          {explainingPrescription
                            ? ui.tools.working
                            : ui.tools.explainPrescription}
                        </button>
                      </div>
                    ) : null}

                    {activeTool === "finder" ? (
                      <div className="grid gap-4 md:grid-cols-3">
                        <SelectField
                          label={ui.tools.state}
                          value={finderState}
                          onChange={(value) => {
                            setFinderState(value);
                            setFinderDistrict("");
                          }}
                          options={finderStates.map((item) => [item, item])}
                          emptyLabel={ui.tools.selectState}
                        />
                        <SelectField
                          label={ui.tools.district}
                          value={finderDistrict}
                          onChange={setFinderDistrict}
                          options={finderDistricts.map((item) => [item, item])}
                          emptyLabel={ui.tools.selectDistrict}
                        />
                        <SelectField
                          label={ui.tools.neededSpecialty}
                          value={specialty}
                          onChange={setSpecialty}
                          options={specialtyEntries}
                          emptyLabel={ui.tools.selectSpecialty}
                        />
                        <div className="md:col-span-3">
                          <button
                            type="button"
                            onClick={runFinder}
                            disabled={searchingFacilities}
                            className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6] disabled:opacity-60"
                          >
                            {searchingFacilities
                              ? ui.tools.searching
                              : ui.tools.findFacilities}
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {activeTool === "sources" ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        {(bootstrap?.knowledgeTopics ?? []).map((topic) => (
                          <article
                            key={topic.id}
                            className="rounded-[1.4rem] border border-white/8 bg-white/[0.04] p-4"
                          >
                            <p className="text-xs uppercase tracking-[0.2em] text-white/35">
                              {topic.source_name}
                            </p>
                            <h4 className="mt-2 text-lg font-semibold text-white">
                              {topic.title}
                            </h4>
                            <p className="mt-2 text-sm leading-6 text-white/65">
                              {topic.summary}
                            </p>
                            <a
                              className="mt-3 inline-flex text-sm font-medium text-[#7dd3fc]"
                              href={topic.source_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {ui.tools.openSource}
                            </a>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <section className="relative mx-auto mt-4 w-full max-w-4xl shrink-0 animate-fade-up">
            {actionMenuOpen ? (
              <div className="absolute bottom-24 left-0 z-30 w-80 rounded-[1.5rem] border border-white/10 bg-[#111111]/92 p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
                {actionMenuItems.map(([panel, title, subtitle]) => (
                  <button
                    key={panel}
                    type="button"
                    onClick={() => openTool(panel)}
                    className="flex w-full flex-col rounded-2xl px-4 py-3 text-left transition hover:bg-white/[0.06]"
                  >
                    <span className="text-sm font-medium text-white">
                      {title}
                    </span>
                    <span className="mt-1 text-xs text-white/45">
                      {subtitle}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.05] px-3 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActionMenuOpen((current) => !current)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-2xl text-white/75 transition hover:bg-white/[0.1]"
                >
                  +
                </button>
                <div className="min-w-0 flex-1">
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={1}
                    placeholder={
                      composerMode === "book"
                        ? bookUi.composerPlaceholder
                        : ui.tools.describeSymptoms
                    }
                    className="max-h-28 min-h-11 w-full resize-none border-none bg-transparent px-2 py-2 text-[15px] text-white outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={startListening}
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg transition ${listening ? "bg-[#2563eb] text-white" : "bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 640 640">
                    <path fill="#ffff" d="M320 64C267 64 224 107 224 160L224 288C224 341 267 384 320 384C373 384 416 341 416 288L416 160C416 107 373 64 320 64zM176 248C176 234.7 165.3 224 152 224C138.7 224 128 234.7 128 248L128 288C128 385.9 201.3 466.7 296 478.5L296 528L248 528C234.7 528 224 538.7 224 552C224 565.3 234.7 576 248 576L392 576C405.3 576 416 565.3 416 552C416 538.7 405.3 528 392 528L344 528L344 478.5C438.7 466.7 512 385.9 512 288L512 248C512 234.7 501.3 224 488 224C474.7 224 464 234.7 464 248L464 288C464 367.5 399.5 432 320 432C240.5 432 176 367.5 176 288L176 248z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={composerMode === "book" ? runBookQuery : runAnalysis}
                  disabled={composerBusy}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] text-white shadow-[0_18px_50px_rgba(37,99,235,0.34)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {composerBusy ? ">" : ">"}
                </button>
              </div>

              {composerMode === "book" ? (
                <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
                  <span className="rounded-full border border-blue-300/25 bg-blue-500/10 px-3 py-1 text-xs text-blue-100">
                    {selectedBook?.name ?? bookUi.composerChip}
                  </span>
                  <span className="text-xs text-white/45">
                    {bookUi.composerHint}
                  </span>
                  <button
                    type="button"
                    onClick={() => setComposerMode("triage")}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    {bookUi.exitBookMode}
                  </button>
                </div>
              ) : selectedSymptomLabels.length ? (
                <div className="mt-3 flex flex-wrap gap-2 px-1">
                  {selectedSymptomLabels.slice(0, 3).map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/55"
                    >
                      {label}
                    </span>
                  ))}
                  {selectedSymptomLabels.length > 3 ? (
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/55">
                      +{selectedSymptomLabels.length - 3} {ui.conversation.more}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
