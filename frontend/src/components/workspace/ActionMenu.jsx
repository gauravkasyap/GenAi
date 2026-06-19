import React from "react";

export default function ActionMenu({
  actionMenuOpen,
  actionMenuItems,
  openTool,
}) {
  if (!actionMenuOpen) {
    return null;
  }

  return (
    <div className="absolute bottom-24 left-0 z-30 w-80 rounded-[1.5rem] border border-white/10 bg-[#111111]/92 p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-2xl">

      {actionMenuItems.map(([panel, title, subtitle]) => (

        <button
          key={panel}
          type="button"
          onClick={() => openTool(panel)}
          className="flex w-full flex-col rounded-2xl px-4 py-3 text-left transition hover:bg-white/[0.06]"
        >

          <span className="text-sm font-medium text-white">
            {title}
          </span>

          <span className="mt-1 text-xs text-white/45">
            {subtitle}
          </span>

        </button>

      ))}

    </div>
  );
}