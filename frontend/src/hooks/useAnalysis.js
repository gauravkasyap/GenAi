import { useState } from "react";

import {
  analyzeSymptoms,
  askChatQuestion,
  explainPrescriptionRequest,
  queryBook,
  searchHospitals,
} from "../services/api";

import {
  extractLeadingGreeting,
  stripLeadingGreeting,
  isGreetingOnly,
  needsGreetingConcernFollowUp,
  needsSymptomClarification,
  buildDoctorGreetingReply,
  buildGreetingConcernReply,
  findMentionedSymptomIds,
  findPersonaLabel,
  findSymptomLabel,
  truncateText,
  CLARIFICATION_COPY,
  ASSISTANT_REPLY_TITLE,
  getDoctorGreetingCopy,
} from "../utils/language";

export function useAnalysis({
  language,
  ui,
  bookUi,

  currentUser,

  pushMessage,

  openTool,

  selectedBook,
  setSelectedBookId,

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
}) {

  function isQuestionText(text) {
    const lowered = text.trim().toLowerCase();
    return (
      lowered.endsWith("?") ||
      /^(what|why|how|when|where|who|can|could|should|is|are|do|does|did)\b/.test(lowered)
    );
  }

  /*
  ======================================
              STATE
  ======================================
  */

  const [notes, setNotes] = useState("");

  const [lastAnalysis, setLastAnalysis] = useState(null);

  const [loading, setLoading] = useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const [queryingBook, setQueryingBook] = useState(false);

  const [explainingPrescription, setExplainingPrescription] =
    useState(false);

  const [searchingFacilities, setSearchingFacilities] =
    useState(false);

  /*
  ======================================
      REQUEST SYMPTOM ANALYSIS
  ======================================
  */

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
    setLoading(true);

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

      pushMessage({

        role: "assistant",

        kind: "analysis",

        payload: result,

      });

      return result;

    } catch (error) {

      pushMessage({

        role: "assistant",

        kind: "error",

        payload: {

          title: ui.conversation.analysisFailed,

          text: error.message,

        },

      });

      return null;

    } finally {

      setAnalyzing(false);

      setLoading(false);

    }

  }  /*
  ======================================
          GENERAL CHAT QUESTION
  ======================================
  */

  async function requestGeneralQuestion(question) {

    setAnalyzing(true);
    setLoading(true);
    setToolSheetOpen(false);

    try {

      const result = await askChatQuestion({

        language,

        message: question,

      });

      pushMessage({

        role: "assistant",

        kind: "text",

        title: ASSISTANT_REPLY_TITLE,

        text: result.answer,

      });

      return result;

    } catch (error) {

      pushMessage({

        role: "assistant",

        kind: "error",

        payload: {

          title: ui.conversation.analysisFailed,

          text: error.message,

        },

      });

      return null;

    } finally {

      setAnalyzing(false);

      setLoading(false);

    }

  }  /*
  ======================================
            RUN ANALYSIS
  ======================================
  */

  async function runAnalysis() {

    const trimmedNotes = notes.trim();

    const leadingGreeting =
      extractLeadingGreeting(trimmedNotes);

    const clinicalNotes =
      stripLeadingGreeting(trimmedNotes) ||
      trimmedNotes;

    const locationText =
      [triageDistrict, triageState]
        .filter(Boolean)
        .join(", ");

    const personaLabel =
      persona !== "adult"
        ? findPersonaLabel(
            personas,
            persona,
            language
          )
        : null;

    const mentionedSymptomIds = Array.from(
      new Set([
        ...selectedSymptoms,
        ...findMentionedSymptomIds(
          clinicalNotes,
          symptoms
        ),
      ])
    );

    const mentionedSymptomLabels =
      mentionedSymptomIds
        .map((id) =>
          findSymptomLabel(
            symptoms,
            id,
            language
          )
        )
        .filter(Boolean);

    const summaryParts = [
      personaLabel,
      selectedSymptomLabels.join(", ") ||
        clinicalNotes ||
        trimmedNotes,
      locationText,
    ].filter(Boolean);

    const summary =
      summaryParts.join(" - ") ||
      ui.conversation.noSymptomDetails;

    const greetingCopy =
      getDoctorGreetingCopy(language);

    const greetingOnly =
      isGreetingOnly(trimmedNotes);

    const greetingNeedsFollowUp =
      Boolean(leadingGreeting) &&
      !greetingOnly &&
      needsGreetingConcernFollowUp(
        clinicalNotes,
        selectedSymptoms,
        symptoms
      );

    const shouldClarify =
      !greetingOnly &&
      !greetingNeedsFollowUp &&
      needsSymptomClarification(
        clinicalNotes,
        selectedSymptoms,
        symptoms
      );

    const shouldAskGroq =
      !greetingOnly &&
      !greetingNeedsFollowUp &&
      Boolean(clinicalNotes) &&
      selectedSymptoms.length === 0 &&
      (mentionedSymptomIds.length === 0 || isQuestionText(clinicalNotes));

    if (
      summary !==
      ui.conversation.noSymptomDetails
    ) {
      pushMessage({
        role: "user",
        kind: "text",
        title: greetingOnly
          ? greetingCopy.userTitle
          : ui.conversation.symptomCheck,
        text: summary,
      });
    }

    setNotes("");

    setActionMenuOpen(false);

    if (greetingOnly) {

      const reply =
        buildDoctorGreetingReply(
          language,
          leadingGreeting
        );

      pushMessage({

        role: "assistant",

        kind: "text",

        title: reply.title,

        text: reply.text,

      });

      setToolSheetOpen(false);

      return;

    }

    if (greetingNeedsFollowUp) {

      const reply =
        buildGreetingConcernReply(
          language,
          mentionedSymptomLabels
        );

      pushMessage({

        role: "assistant",

        kind: "text",

        title: reply.title,

        text: reply.text,

      });

      setToolSheetOpen(false);

      return;

    }

    if (shouldAskGroq) {

      await requestGeneralQuestion(clinicalNotes);

      return;

    }

    if (shouldClarify) {

      const clarification =
        CLARIFICATION_COPY[
          language
        ] ??
        CLARIFICATION_COPY.en;

      pushMessage({

        role: "assistant",

        kind: "text",

        title: clarification.title,

        text: clarification.text,

      });

      setToolSheetOpen(false);

      return;

    }

    await requestSymptomAnalysis({

      notesText: clinicalNotes,

      symptomIds: selectedSymptoms,

      personaValue: persona,

      durationValue: duration,

      intensityValue: intensity,

      stateValue:
        triageState || null,

      districtValue:
        triageDistrict || null,

    });

  }

  /*
  ======================================
        ANALYSIS FOLLOW-UP
  ======================================
  */

  async function submitAnalysisFollowUp(
    message,
    followUpText
  ) {

    const trimmed =
      followUpText.trim();

    if (!trimmed)
      return false;

    const payload =
      message.payload ?? {};

    pushMessage({

      role: "user",

      kind: "text",

      title:
        ui.conversation.symptomCheck,

      text: trimmed,

    });

    setNotes("");

    setActionMenuOpen(false);

    await requestSymptomAnalysis({

      notesText: trimmed,

      symptomIds:
        payload.symptomsDetected ??
        [],

      personaValue:
        payload.persona ??
        persona,

      durationValue:
        payload.duration ??
        duration,

      intensityValue:
        payload.intensity ??
        intensity,

      stateValue:
        triageState ||
        payload.locationContext
          ?.state ||
        payload.state ||
        null,

      districtValue:
        triageDistrict ||
        payload.locationContext
          ?.district ||
        payload.district ||
        null,

    });

    return true;

  } 
   /*
  ======================================
            BOOK QUERY
  ======================================
  */

  async function runBookQuery() {

    const question = notes.trim();

    if (!question) return;

    if (!selectedBook?.id) {

      pushMessage({

        role: "assistant",

        kind: "text",

        title: bookUi.sectionTitle,

        text: bookUi.uploadFirstPrompt,

      });

      openTool("books");

      return;

    }

    pushMessage({

      role: "user",

      kind: "text",

      title: bookUi.sectionTitle,

      text: question,

    });

    setNotes("");

    setActionMenuOpen(false);

    setToolSheetOpen(false);

    setQueryingBook(true);

    setLoading(true);

    try {

      const result = await queryBook({

        userEmail: currentUser?.email,

        bookId: selectedBook.id,

        question,

      });

      if (result?.book?.id) {

        setSelectedBookId(result.book.id);

      }

      pushMessage({

        role: "assistant",

        kind: "book",

        payload: result,

      });

    } catch (error) {

      pushMessage({

        role: "assistant",

        kind: "error",

        payload: {

          title: bookUi.queryErrorTitle,

          text: error.message,

        },

      });

    } finally {

      setQueryingBook(false);

      setLoading(false);

    }

  }

  /*
  ======================================
        PRESCRIPTION
  ======================================
  */

  async function runPrescription() {

    const summary =
      prescriptionInput.trim() ||
      prescriptionAttachment?.name ||
      ui.conversation.noPrescriptionText;

    pushMessage({

      role: "user",

      kind: "text",

      title:
        ui.conversation.prescriptionExplainer,

      text: summary,

    });

    setActionMenuOpen(false);

    setToolSheetOpen(false);

    setExplainingPrescription(true);

    setLoading(true);

    try {

      const result =
        await explainPrescriptionRequest({

          language,

          text: prescriptionInput,

          attachment: prescriptionAttachment,

        });

      pushMessage({

        role: "assistant",

        kind: "prescription",

        payload: result,

      });

    } catch (error) {

      pushMessage({

        role: "assistant",

        kind: "error",

        payload: {

          title:
            ui.conversation
              .prescriptionFailed,

          text: error.message,

        },

      });

    } finally {

      setPrescriptionAttachment?.(null);

      setExplainingPrescription(false);

      setLoading(false);

    }

  }

  /*
  ======================================
          HOSPITAL FINDER
  ======================================
  */

  async function runFinder() {

    const summary =
      [finderDistrict, finderState, specialty]
        .filter(Boolean)
        .join(" • ") ||
      "No finder filters selected";

    pushMessage({

      role: "user",

      kind: "text",

      title:
        ui.conversation.facilityFinder,

      text: summary,

    });

    setSearchingFacilities(true);

    setLoading(true);

    try {

      const result =
        await searchHospitals({

          language,

          state: finderState,

          district: finderDistrict,

          specialty,

        });

      pushMessage({

        role: "assistant",

        kind: "finder",

        payload: result,

      });

    } catch (error) {

      pushMessage({

        role: "assistant",

        kind: "error",

        payload: {

          title:
            ui.conversation
              .facilityFailed,

          text: error.message,

        },

      });

    } finally {

      setSearchingFacilities(false);

      setLoading(false);

    }

  }  /*
  ======================================
            CLEAR ANALYSIS
  ======================================
  */

  function clearAnalysis() {

    setNotes("");

    setLastAnalysis(null);

    setLoading(false);

    setAnalyzing(false);

    setQueryingBook(false);

    setExplainingPrescription(false);

    setSearchingFacilities(false);

  }

  /*
  ======================================
              RETURN
  ======================================
  */

  return {

    // State
    notes,
    setNotes,

    lastAnalysis,

    loading,

    analyzing,

    queryingBook,

    explainingPrescription,

    searchingFacilities,

    // Analysis
    runAnalysis,
    submitAnalysisFollowUp,

    // Books
    runBookQuery,

    // Prescription
    runPrescription,

    // Finder
    runFinder,

    // Reset
    clearAnalysis,

  };

}
