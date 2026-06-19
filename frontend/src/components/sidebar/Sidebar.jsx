import React from "react";

import ChatHistory from "./ChatHistory";
import PrescriptionSidebar from "./PrescriptionSidebar";
import UserProfile from "./UserProfile";
import { MedicalBookSidebar } from "./MedicalBookSidebar";

export default function Sidebar({
  ui,
  bookUi,

  currentUser,

  conversations,
  activeConversationId,

  books,
  selectedBookId,

  composerMode,

  removingBookId,
  confirmingBookId,

  startNewCase,
  loadConversation,
  handleLogout,

  openTool,

  selectBook,
  useBook,

  removeMedicalBook,
  confirmMedicalBook,
}) {
  return (
    <aside className="flex max-h-[44vh] w-full shrink-0 flex-col overflow-hidden border-b border-white/10 bg-black/45 px-3 py-4 backdrop-blur-2xl sm:h-screen sm:max-h-none sm:w-[260px] sm:border-b-0 sm:border-r">
      <div className="shrink-0">
        <div className="flex items-center gap-3 px-1">
          <img
            src="/icons/icon.svg"
            alt={ui.shell.appName}
            className="h-11 w-11 rounded-2xl border border-white/10 bg-white/[0.08] p-2"
          />

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-white">
              {ui.shell.appName}
            </div>
            <div className="truncate text-xs text-white/45">
              {ui.shell.workspace}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={startNewCase}
          className="mt-5 flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-left text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition hover:bg-white/[0.14]"
        >
          <span>{ui.shell.newChat}</span>
          <span className="text-lg leading-none text-white/55">+</span>
        </button>
      </div>

      <ChatHistory
        ui={ui}
        conversations={conversations}
        activeConversationId={activeConversationId}
        loadConversation={loadConversation}
      />

      <PrescriptionSidebar
        ui={ui}
        onOpenPrescription={() => openTool("prescription")}
      />

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

      <UserProfile
        currentUser={currentUser}
        logoutLabel={ui.shell.logout}
        appName={ui.shell.appName}
        onLogout={handleLogout}
      />

    </aside>
  );
}
