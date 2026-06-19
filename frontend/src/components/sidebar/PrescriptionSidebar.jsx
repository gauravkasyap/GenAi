import React from "react";

export default function PrescriptionSidebar({ ui, onOpenPrescription }) {
  return (
    <section className="mt-4 shrink-0 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-blue-300/20 bg-blue-500/10 text-sm font-semibold text-blue-100">
          RX
        </div>

        <div className="min-w-0">
          {/* <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
            {ui.conversation.prescriptionExplainer}
          </p> */}
          <h3 className="mt-1 truncate text-sm font-semibold text-white">
            Doctor prescription
          </h3>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenPrescription}
        className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/[0.1] hover:text-white"
      >
        Upload or paste
      </button>
    </section>
  );
}
