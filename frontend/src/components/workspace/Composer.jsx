import React from "react";
import ActionMenu from "./ActionMenu";
export default function Composer({
  notes,
  setNotes,

  composerMode,
  composerBusy,

  ui,
  bookUi,

  selectedBook,

  selectedSymptomLabels,

  listening,

  startListening,

  runAnalysis,
  runBookQuery,

  setActionMenuOpen,

  setComposerMode,
  actionMenuOpen,
  actionMenuItems,

  openTool,
}) {
  return (
    <div className="rounded-[1.9rem] border border-white/10 bg-white/[0.05] px-3 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        {/* Action Button */}
        <ActionMenu
          actionMenuOpen={actionMenuOpen}
          actionMenuItems={actionMenuItems}
          openTool={openTool}
        />
        {/* <button
          type="button"
          onClick={() => setActionMenuOpen((current) => !current)}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.06] text-2xl text-white/75 transition hover:bg-white/[0.1]"
        >
          +
        </button> */}

        {/* Text Area */}

        <div className="min-w-0 flex-1">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={1}
            placeholder={
              composerMode === "book"
                ? bookUi.composerPlaceholder
                : ui.tools.describeSymptoms
            }
            className="max-h-28 min-h-11 w-full resize-none border-none bg-transparent px-2 py-2 text-[15px] text-white outline-none placeholder:text-white/30"
          />
        </div>

        {/* Voice */}

        <button
          type="button"
          onClick={startListening}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg transition ${
            listening
              ? "bg-[#2563eb] text-white"
              : "bg-white/[0.06] text-white/75 hover:bg-white/[0.1]"
          }`}
        >
          🎤
        </button>

        {/* Send */}

        <button
          type="button"
          onClick={composerMode === "book" ? runBookQuery : runAnalysis}
          disabled={composerBusy}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] text-white shadow-[0_18px_50px_rgba(37,99,235,0.34)] transition hover:brightness-110 disabled:opacity-60"
        >
          ➜
        </button>
      </div>

      {/* Book Mode */}

      {composerMode === "book" ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="rounded-full border border-blue-300/25 bg-blue-500/10 px-3 py-1 text-xs text-blue-100">
            {selectedBook?.name ?? bookUi.composerChip}
          </span>

          <span className="text-xs text-white/45">{bookUi.composerHint}</span>

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

          {selectedSymptomLabels.length > 3 && (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/55">
              +{selectedSymptomLabels.length - 3} {ui.conversation.more}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
