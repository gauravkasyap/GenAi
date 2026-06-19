import { useMemo, useRef, useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { useConversation } from "../hooks/useConversation";
import { useBooks } from "../hooks/useBooks";
import { useBootstrap } from "../hooks/useBootstrap";
import { useAnalysis } from "../hooks/useAnalysis";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

import Sidebar from "../components/sidebar/Sidebar";
import ChatArea from "../components/workspace/ChatArea";
import Composer from "../components/workspace/Composer";
import ToolSheet from "../components/workspace/ToolSheet";
import BookModal from "../components/books/BookModal";
import LoginCard from "../components/auth/LoginCard";
import SignupCard from "../components/auth/SignupCard";
import WelcomeCard from "../components/auth/WelcomeCard";

import {
  DEFAULT_LANGUAGE_OPTIONS,
  detectSuggestedLanguageCode,
  getLanguageDisplayLabel,
  getMedicalBookCopy,
  getUiCopy,
} from "../utils/language";
import { buildSuggestedLanguageCodes } from "../utils/i18n";
import { findSymptomLabel } from "../utils/toolHelpers";

function optionEntries(labels = {}) {
  return Object.entries(labels).map(([value, label]) => [value, label]);
}

function getAuthErrorMessage(error, ui) {
  switch (error?.code) {
    case "auth/operation-not-allowed":
      return "This Firebase sign-in method is not enabled. Enable it in Firebase Authentication > Sign-in method.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was closed before it finished.";
    case "auth/popup-blocked":
      return "The browser blocked the Google sign-in popup. Allow popups for this site and try again.";
    case "auth/unauthorized-domain":
      return "This domain is not allowed in Firebase Authentication. Add localhost and 127.0.0.1 to Authorized domains.";
    case "auth/email-already-in-use":
      return ui.auth.accountExists;
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return ui.auth.noAccountFound;
    case "auth/wrong-password":
      return ui.auth.incorrectPassword;
    default:
      return error?.message ?? "Authentication failed. Please try again.";
  }
}

export default function WorkspacePage() {
  const auth = useAuth();
  const { currentUser, login, loginWithGoogle, logout, signup } = auth;
  const conversation = useConversation(currentUser?.email ?? "");
  const bootstrap = useBootstrap();

  const languageOptions = bootstrap.languages?.length
    ? bootstrap.languages
    : DEFAULT_LANGUAGE_OPTIONS;

  const [language, setLanguage] = useState(
    () =>
      localStorage.getItem("uiLanguage") ||
      detectSuggestedLanguageCode(languageOptions),
  );
  const [welcomeStep, setWelcomeStep] = useState("language");
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [composerMode, setComposerMode] = useState("triage");
  const [toolSheetOpen, setToolSheetOpen] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [activeTool, setActiveTool] = useState("triage");
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
  const [prescriptionAttachment, setPrescriptionAttachment] = useState(null);

  const threadEndRef = useRef(null);
  const ui = useMemo(() => getUiCopy(language), [language]);
  const bookUi = useMemo(() => getMedicalBookCopy(ui), [ui]);
  const personas = bootstrap.personas ?? [];
  const symptoms = bootstrap.symptoms ?? [];
  const stateMap = bootstrap.states ?? {};
  const finderStates = Object.keys(stateMap);
  const triageDistricts = triageState ? stateMap[triageState] ?? [] : [];
  const finderDistricts = finderState ? stateMap[finderState] ?? [] : [];
  const durationOptions = optionEntries(ui.durationLabels);
  const intensityOptions = optionEntries(ui.intensityLabels);
  const specialtyEntries = optionEntries(bootstrap.specialties);
  const selectedSymptomLabels = selectedSymptoms.map((id) =>
    findSymptomLabel(symptoms, id, language),
  );

  const showBookModal = toolSheetOpen && activeTool === "books";
  const showQuickActionSheet = toolSheetOpen && activeTool !== "books";

  function openTool(tool) {
    setActiveTool(tool);
    setToolSheetOpen(true);
    setActionMenuOpen(false);
  }

  function startNewCase() {
    conversation.createNewConversation();
    setSelectedSymptoms([]);
    setComposerMode("triage");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  function toggleSymptom(symptomId) {
    setSelectedSymptoms((current) =>
      current.includes(symptomId)
        ? current.filter((id) => id !== symptomId)
        : [...current, symptomId],
    );
  }

  const booksHook = useBooks({
    currentUser,
    pushMessage: conversation.pushMessage,
    bookUi,
    setComposerMode,
    setToolSheetOpen,
    setActionMenuOpen,
    setActiveTool,
  });

  const analysis = useAnalysis({
    language,
    ui,
    bookUi,
    currentUser,
    pushMessage: conversation.pushMessage,
    openTool,
    selectedBook: booksHook.selectedBook,
    setSelectedBookId: booksHook.setSelectedBookId,
    persona,
    personas,
    symptoms,
    selectedSymptoms,
    selectedSymptomLabels,
    duration,
    intensity,
    triageState,
    triageDistrict,
    finderState,
    finderDistrict,
    specialty,
    prescriptionInput,
    prescriptionAttachment,
    setPrescriptionAttachment,
    setToolSheetOpen,
    setActionMenuOpen,
  });

  const speech = useSpeechRecognition({
    language: languageOptions.find((item) => item.code === language)?.speech,
    setNotes: analysis.setNotes,
  });

  const composerBusy =
    analysis.loading ||
    analysis.queryingBook ||
    analysis.explainingPrescription ||
    analysis.searchingFacilities;

  const actionMenuItems = [
    ["triage", ui.tools.thinkingTitle, ui.tools.thinkingSubtitle],
    ["prescription", ui.tools.addFilesTitle, ui.tools.addFilesSubtitle],
    ["finder", ui.conversation.facilityFinder, ui.tools.findFacilities],
    ["sources", ui.tools.deepResearchTitle, ui.tools.deepResearchSubtitle],
    ["books", bookUi.openMenuTitle, bookUi.openMenuSubtitle],
  ];

  const suggestedCodes = buildSuggestedLanguageCodes(languageOptions);
  const suggestedLanguages = suggestedCodes
    .map((code) => languageOptions.find((item) => item.code === code))
    .filter(Boolean)
    .slice(0, 4);
  const suggestedLanguage =
    suggestedLanguages[0] ??
    languageOptions.find((item) => item.code === language) ??
    languageOptions[0];
  const selectedLanguage =
    languageOptions.find((item) => item.code === language) ?? suggestedLanguage;

  function handleLanguageChange(code) {
    setLanguage(code);
    localStorage.setItem("uiLanguage", code);
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthError("");

    try {
      if (!email.trim() || !password) {
        setAuthError(ui.auth.enterEmailPassword);
        return;
      }
      if (authMode === "signup") {
        if (!fullName.trim()) {
          setAuthError(ui.auth.enterFullName);
          return;
        }
        if (password.length < 6) {
          setAuthError(ui.auth.passwordTooShort);
          return;
        }
        await signup(fullName.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (error) {
      setAuthError(getAuthErrorMessage(error, ui));
    }
  }

  function handleLogout() {
    logout();
    setComposerMode("triage");
    setToolSheetOpen(false);
    setActionMenuOpen(false);
  }

  async function handleSocialClick(provider) {
    setAuthError("");

    if (provider !== "Google") {
      setAuthError(ui.auth.socialUnavailable(provider, authMode));
      return;
    }

    try {
      await loginWithGoogle();
    } catch (error) {
      setAuthError(getAuthErrorMessage(error, ui));
    }
  }

  if (!currentUser) {
    const onboardingCopy = ui.onboarding;
    const selectedLanguageLabel = getLanguageDisplayLabel(selectedLanguage);

    return (
      <main className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
          {welcomeStep === "language" ? (
            <WelcomeCard
              copy={onboardingCopy}
              suggestedLanguage={suggestedLanguage}
              suggestedLanguages={suggestedLanguages}
              selectedLanguageCode={language}
              languageOptions={languageOptions}
              getLanguageDisplayLabel={getLanguageDisplayLabel}
              onSelectLanguage={handleLanguageChange}
              onUseSuggestion={() => handleLanguageChange(suggestedLanguage.code)}
              onContinue={() => setWelcomeStep("auth")}
            />
          ) : authMode === "signup" ? (
            <SignupCard
              copy={onboardingCopy}
              selectedLanguageLabel={selectedLanguageLabel}
              fullName={fullName}
              email={email}
              password={password}
              authError={authError}
              onChangeLanguage={() => setWelcomeStep("language")}
              onToggleAuthMode={() => {
                setAuthMode("login");
                setAuthError("");
              }}
              onFullNameChange={(event) => setFullName(event.target.value)}
              onEmailChange={(event) => setEmail(event.target.value)}
              onPasswordChange={(event) => setPassword(event.target.value)}
              onSubmit={handleAuthSubmit}
              onSocialClick={handleSocialClick}
            />
          ) : (
            <LoginCard
              copy={onboardingCopy}
              selectedLanguageLabel={selectedLanguageLabel}
              email={email}
              password={password}
              authError={authError}
              onChangeLanguage={() => setWelcomeStep("language")}
              onToggleAuthMode={() => {
                setAuthMode("signup");
                setAuthError("");
              }}
              onEmailChange={(event) => setEmail(event.target.value)}
              onPasswordChange={(event) => setPassword(event.target.value)}
              onSubmit={handleAuthSubmit}
              onSocialClick={handleSocialClick}
            />
          )}
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0b] text-white sm:flex-row">
      <Sidebar
        ui={ui}
        bookUi={bookUi}
        currentUser={currentUser}
        conversations={conversation.conversations}
        activeConversationId={conversation.activeConversationId}
        books={booksHook.books}
        selectedBookId={booksHook.selectedBookId}
        composerMode={composerMode}
        removingBookId={booksHook.removingBookId}
        confirmingBookId={booksHook.confirmingBookId}
        startNewCase={startNewCase}
        loadConversation={conversation.loadConversation}
        handleLogout={handleLogout}
        openTool={openTool}
        selectBook={booksHook.selectBook}
        useBook={booksHook.activateBook}
        removeMedicalBook={booksHook.removeMedicalBook}
        confirmMedicalBook={booksHook.confirmMedicalBook}
      />

      <main className="relative flex min-h-[56vh] flex-1 flex-col gap-4 p-4 sm:h-screen sm:min-h-0 lg:p-6">
        <ChatArea
          thread={conversation.thread}
          threadEndRef={threadEndRef}
          ui={ui}
          analyzing={analysis.analyzing}
          submitAnalysisFollowUp={analysis.submitAnalysisFollowUp}
          showQuickActionSheet={showQuickActionSheet}
          quickActionSheet={
            <ToolSheet
              showQuickActionSheet={showQuickActionSheet}
              ui={ui}
              bookUi={bookUi}
              activeTool={activeTool}
              bootstrap={bootstrap}
              language={language}
              personas={personas}
              persona={persona}
              setPersona={setPersona}
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              toggleSymptom={toggleSymptom}
              duration={duration}
              setDuration={setDuration}
              durationOptions={durationOptions}
              intensity={intensity}
              setIntensity={setIntensity}
              intensityOptions={intensityOptions}
              triageState={triageState}
              setTriageState={setTriageState}
              triageDistrict={triageDistrict}
              setTriageDistrict={setTriageDistrict}
              finderStates={finderStates}
              triageDistricts={triageDistricts}
              prescriptionInput={prescriptionInput}
              setPrescriptionInput={setPrescriptionInput}
              prescriptionAttachment={prescriptionAttachment}
              setPrescriptionAttachment={setPrescriptionAttachment}
              runPrescription={analysis.runPrescription}
              explainingPrescription={analysis.explainingPrescription}
              finderState={finderState}
              setFinderState={setFinderState}
              finderDistrict={finderDistrict}
              setFinderDistrict={setFinderDistrict}
              finderDistricts={finderDistricts}
              specialty={specialty}
              setSpecialty={setSpecialty}
              specialtyEntries={specialtyEntries}
              runFinder={analysis.runFinder}
              searchingFacilities={analysis.searchingFacilities}
              setToolSheetOpen={setToolSheetOpen}
            />
          }
        />

        <div className="absolute inset-x-4 bottom-4 z-30 lg:inset-x-6 lg:bottom-6">
          <div className="mx-auto max-w-4xl">
            <Composer
              notes={analysis.notes}
              setNotes={analysis.setNotes}
              composerMode={composerMode}
              composerBusy={composerBusy}
              ui={ui}
              bookUi={bookUi}
              selectedBook={booksHook.selectedBook}
              selectedSymptomLabels={selectedSymptomLabels}
              listening={speech.listening}
              startListening={speech.startListening}
              runAnalysis={analysis.runAnalysis}
              runBookQuery={analysis.runBookQuery}
              setActionMenuOpen={setActionMenuOpen}
              setComposerMode={setComposerMode}
              actionMenuOpen={actionMenuOpen}
              actionMenuItems={actionMenuItems}
              openTool={openTool}
            />
          </div>
        </div>
      </main>

      <BookModal
        show={showBookModal}
        ui={ui}
        bookUi={bookUi}
        books={booksHook.books}
        selectedBookId={booksHook.selectedBookId}
        bookNameInput={booksHook.bookNameInput}
        setBookNameInput={booksHook.setBookNameInput}
        bookSourceInput={booksHook.bookSourceInput}
        setBookSourceInput={booksHook.setBookSourceInput}
        bookTextInput={booksHook.bookTextInput}
        setBookTextInput={booksHook.setBookTextInput}
        uploadingBook={booksHook.uploadingBook}
        uploadingTextBook={booksHook.uploadingTextBook}
        removingBookId={booksHook.removingBookId}
        confirmingBookId={booksHook.confirmingBookId}
        composerMode={composerMode}
        onClose={() => setToolSheetOpen(false)}
        onFileSelected={booksHook.uploadMedicalBookFile}
        onUploadProvidedText={booksHook.uploadProvidedMedicalText}
        onSelectBook={booksHook.selectBook}
        onUseBook={booksHook.activateBook}
        onConfirmBook={booksHook.confirmMedicalBook}
        onRemoveBook={booksHook.removeMedicalBook}
      />
    </div>
  );
}
