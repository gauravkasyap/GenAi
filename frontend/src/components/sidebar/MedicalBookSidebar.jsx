import React from "react";

function statusClasses(status) {
  if (status === "verified") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
  }
  return "border-amber-400/20 bg-amber-500/10 text-amber-100";
}

export function MedicalBookSidebar({
  copy,
  books,
  selectedBookId,
  composerMode,
  onOpenManager,
  onSelectBook,
  onUseBook,
  onRemoveBook,
  onConfirmBook,
  removingBookId,
  confirmingBookId,
}) {
  return (
    <section className="mt-4 flex min-h-[10px] flex-03 flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="flex shrink-0 items-center justify-between gap-1">
        <div>
          <h3 className="mt-1 text-sm font-semibold text-white">{copy.sectionTitle}</h3>
        </div>
        <button
          type="button"
          onClick={onOpenManager}
          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-white/70 transition hover:bg-white/[0.1] hover:text-white"
        >
          {copy.manageButton}
        </button>
      </div>

      {/* {!books.length ? (
        <div className="mt-4 min-h-0 overflow-y-auto rounded-2xl border border-dashed border-white/10 bg-black/20 px-3 py-4 text-sm leading-6 text-white/45">
          {copy.emptyState}
        </div>
      ) : (
        <div className="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
          {books.map((book) => {
            const isSelected = book.id === selectedBookId;
            const isActiveMode = isSelected && composerMode === "book";
            return (
              <article
                key={book.id}
                className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
                  isSelected ? "border-[#3b82f6]/60 bg-[#172036]" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.07]"
                }`}
              >
                <button type="button" onClick={() => onSelectBook(book.id)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-white">{book.name}</div>
                        <div className="mt-1 truncate text-xs text-white/45">{book.sourceLabel}</div>
                      </div>
                    <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${statusClasses(book.sourceStatus)}`}>
                      {book.sourceStatus === "verified" ? copy.verifiedBadge : copy.cautionBadge}
                    </span>
                  </div>

                  {book.preview ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/50">{book.preview}</p> : null}
                </button>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onUseBook(book.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      isActiveMode
                        ? "border-blue-300/40 bg-blue-500/15 text-blue-100"
                        : "border-white/10 bg-white/[0.05] text-white/70 hover:bg-white/[0.1]"
                    }`}
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
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition hover:bg-white/[0.09] hover:text-white"
                  >
                    {removingBookId === book.id ? copy.removingLabel : copy.removeBook}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )} */}
    </section>
  );
}
