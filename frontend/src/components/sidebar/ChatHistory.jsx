import React from "react";

export default function ChatHistory({
  ui,
  conversations,
  activeConversationId,
  loadConversation,
}) {
  return (
    <section className="mt-4 flex min-h-[90px] max-h-[100px] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-3 sm:max-h-[180px]">
      <p className="mb-2 shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/40">
        {ui.shell.chatHistory}
      </p>

      <div className="min-h-0 space-y-2 overflow-y-auto pr-1">
        {conversations.length ? (
          conversations.map((item) => {
            const isActive = item.id === activeConversationId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => loadConversation(item.id)}
                className={`w-full rounded-2xl border px-3 py-2.5 text-left transition ${
                  isActive
                    ? "border-[#3b82f6]/60 bg-[#172036] text-white"
                    : "border-white/8 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                }`}
              >
                <div className="truncate text-sm font-medium">
                  {item.title}
                </div>

                <div
                  className={`mt-1 line-clamp-1 text-xs leading-5 ${
                    isActive
                      ? "text-blue-100/75"
                      : "text-white/45"
                  }`}
                >
                  {item.subtitle}
                </div>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-3 py-4 text-sm text-white/30">
            {ui.shell.noChatHistory}
          </div>
        )}
      </div>
    </section>
  );
}
