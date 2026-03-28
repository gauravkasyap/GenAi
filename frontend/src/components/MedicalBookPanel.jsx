import React from "react";

function statusClasses(status) {
  if (status === "verified") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
  }
  return "border-amber-400/20 bg-amber-500/10 text-amber-100";
}

export function MedicalBookPanel({
  copy,
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
  onFileSelected,
  onUploadProvidedText,
  onSelectBook,
  onUseBook,
  onConfirmBook,
  onRemoveBook,
  composerMode,
}) {
  return (
    <div className="grid gap-5 inset-0 z-50 ">
      <div className="grid gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div>
          <h4 className="text-base font-semibold text-white">{copy.uploadTitle}</h4>
          <p className="mt-1 text-sm leading-6 text-white/55">{copy.uploadSubtitle}</p>
        </div>

        {/* <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-white/65">
            <span>{copy.bookNameLabel}</span>
            <input
              value={bookNameInput}
              onChange={(event) => setBookNameInput(event.target.value)}
              placeholder={copy.bookNamePlaceholder}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/25"
            />
          </label>
          <label className="grid gap-2 text-sm text-white/65">
            <span>{copy.sourceLabel}</span>
            <input
              value={bookSourceInput}
              onChange={(event) => setBookSourceInput(event.target.value)}
              placeholder={copy.sourcePlaceholder}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/25"
            />
          </label>
        </div> */}

        <label className="grid gap-3 rounded-[1.4rem] border border-dashed border-white/12 bg-black/20 px-4 py-4 text-sm text-white/65">
          <span className="font-medium text-white">{copy.uploadFileLabel}</span>
          <span className="text-white/45">{copy.uploadFileHint}</span>
          <input
            type="file"
            accept=".pdf,.txt,.md,.docx"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onFileSelected(file);
              event.target.value = "";
            }}
            className="block w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white file:mr-3 file:rounded-full file:border-0 file:bg-blue-500/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-blue-100 hover:file:bg-blue-500/20"
          />
          {uploadingBook ? <span className="text-xs uppercase tracking-[0.18em] text-blue-100/70">{copy.uploadingLabel}</span> : null}
        </label>

        {/* <div className="grid gap-3">
          <label className="grid gap-2 text-sm text-white/65">
            <span>{copy.pasteTextLabel}</span>
            <textarea
              value={bookTextInput}
              onChange={(event) => setBookTextInput(event.target.value)}
              rows={8}
              placeholder={copy.pasteTextPlaceholder}
              className="w-full rounded-[1.4rem] border border-white/10 bg-black/20 px-4 py-4 text-white outline-none placeholder:text-white/25"
            />
          </label>
          <button
            type="button"
            onClick={onUploadProvidedText}
            disabled={uploadingTextBook}
            className="rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6] disabled:opacity-60"
          >
            {uploadingTextBook ? copy.uploadingTextLabel : copy.saveProvidedText}
          </button>
        </div> */}
      </div>

      <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-white">{copy.libraryTitle}</h4>
            <p className="mt-1 text-sm text-white/55">{copy.librarySubtitle}</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/55">{books.length} {copy.bookCountLabel}</span>
        </div>

        {!books.length ? (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 px-4 py-6 text-sm leading-6 text-white/40">{copy.emptyState}</div>
        ) : (
          <div className="mt-4 grid gap-3">
            {books.map((book) => {
              const isSelected = book.id === selectedBookId;
              const isActiveMode = isSelected && composerMode === "book";
              return (
                <article key={book.id} className={`rounded-[1.3rem] border p-4 transition ${isSelected ? "border-[#3b82f6]/55 bg-[#172036]/65" : "border-white/8 bg-black/20"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h5 className="text-sm font-semibold text-white">{book.name}</h5>
                      <p className="mt-1 text-xs text-white/45">{book.sourceLabel}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${statusClasses(book.sourceStatus)}`}>
                      {book.sourceStatus === "verified" ? copy.verifiedBadge : copy.cautionBadge}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/45">
                    {book.pageCount ? <span>{book.pageCount} {copy.pagesLabel}</span> : null}
                    {book.charCount ? <span>{book.charCount.toLocaleString()} {copy.charactersLabel}</span> : null}
                    {book.fileType ? <span>{book.fileType.toUpperCase()}</span> : null}
                  </div>

                  {book.preview ? <p className="mt-3 text-sm leading-6 text-white/60">{book.preview}</p> : null}
                  {book.sourceReason ? <p className="mt-3 text-xs leading-5 text-white/45">{book.sourceReason}</p> : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectBook(book.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${isSelected ? "border-white/20 bg-white/[0.12] text-white" : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"}`}
                    >
                      {isSelected ? copy.selectedLabel : copy.selectBook}
                    </button>
                    <button
                      type="button"
                      onClick={() => onUseBook(book.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${isActiveMode ? "border-blue-300/40 bg-blue-500/15 text-blue-100" : "border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08]"}`}
                    >
                      {isActiveMode ? copy.activeModeLabel : copy.useForAnswers}
                    </button>
                    {book.requiresConfirmation && !book.confirmed ? (
                      <button
                        type="button"
                        onClick={() => onConfirmBook(book.id)}
                        className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-100 transition hover:bg-amber-500/15"
                      >
                        {confirmingBookId === book.id ? copy.confirmingLabel : copy.proceedWithCaution}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => onRemoveBook(book.id)}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      {removingBookId === book.id ? copy.removingLabel : copy.removeBook}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
