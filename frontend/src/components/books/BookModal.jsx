import React from "react";
import MedicalBookPanel from "./MedicalBookPanel";

export default function BookModal({
  show,

  ui,
  bookUi,

  books,
  selectedBookId,

  bookNameInput,
  setBookNameInput,

  bookSourceInput,
  setBookSourceInput,

  bookTextInput,
  setBookTextInput,

  uploadingBook,
  uploadingTextBook,

  removingBookId,
  confirmingBookId,

  composerMode,

  onClose,

  onFileSelected,
  onUploadProvidedText,

  onSelectBook,
  onUseBook,

  onConfirmBook,
  onRemoveBook,
}) {

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/72 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={bookUi.sectionTitle}
        className="relative z-10 flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111]/96 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
        onClick={(event) => event.stopPropagation()}
      >

        {/* Header */}

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
            onClick={onClose}
            className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            {ui.tools.close}
          </button>

        </div>

        {/* Body */}

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

            onFileSelected={onFileSelected}
            onUploadProvidedText={onUploadProvidedText}

            onSelectBook={onSelectBook}
            onUseBook={onUseBook}

            onConfirmBook={onConfirmBook}
            onRemoveBook={onRemoveBook}

            composerMode={composerMode}

          />

        </div>

      </div>
    </div>
  );

}