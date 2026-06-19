import React from "react";

import MessageList from "./MessageList";

export default function ChatArea({
  thread,
  threadEndRef,
  ui,
  analyzing,
  submitAnalysisFollowUp,
  showQuickActionSheet,
  quickActionSheet,
}) {
  return (
    <section className="relative min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-[#121212]/70 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">

      {/* Empty State */}

      {thread.length === 0 && (
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
      )}

      {/* Messages */}

      <div className="relative h-full overflow-y-auto px-4 pb-44 pt-6 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">

          <MessageList
            thread={thread}
            ui={ui}
            analyzing={analyzing}
            submitAnalysisFollowUp={submitAnalysisFollowUp}
            threadEndRef={threadEndRef}
          />

        </div>
      </div>

      {/* Tool Sheet */}

      {showQuickActionSheet && quickActionSheet}

    </section>
  );
}
