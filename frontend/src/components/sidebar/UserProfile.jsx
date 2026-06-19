import React from "react";

export default function UserProfile({
  currentUser,
  appName,
  logoutLabel,
  onLogout,
}) {
  const initials = (
    currentUser?.name ||
    currentUser?.email ||
    "HA"
  )
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mt-15 shrink-0 rounded-[1.25rem] border border-white/10 bg-white/[0.05] px-3 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl flex items-center">
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.08] text-sm font-semibold text-white">
          {initials}
        </div>
      < div className="ml-3 min-w-0 flex-1">
      <button
        type="button"
        onClick={onLogout}
        className="mt-1 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white"
      >
        {logoutLabel}
      </button>
       </div>
    </div>
  );
}
