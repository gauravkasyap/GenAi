import React from "react";

const DEFAULT_MESSAGES = {
  you: "You",
  specialty: "Specialty",
  firstStop: "First stop",
  whatToDoNow: "What to do now",
  homeCareNotes: "Home care notes",
  goSoonerIf: "Go sooner if",
  suggestedFacilities: "Suggested facilities",
  trustedSourceCards: "Trusted source cards",
  openSource: "Open source",
  prescriptionExplainer: "Prescription explainer",
  times: "Times",
  mealRelation: "Meal relation",
  decodedAs: "Decoded as",
  abbreviationLegend: "Abbreviation legend",
  safetyReminders: "Safety reminders",
  facilityFinder: "Facility finder",
  medicalBookAnswer: "Medical book answer",
  supportingExcerpts: "Supporting excerpts",
  basedOnBook: "Based on",
  verifiedSource: "Verified source",
  cautionSource: "Use with caution",
  sourceReason: "Source review",
  noBookFound: "Medical book required",
  notInBook: "Not found in the uploaded book",
  cautionRequired: "Confirmation required",
  pageLabel: "Page",
  bookSafetyNote: "Safety note",
  possibleCondition: "Possible Condition",
  explanation: "Explanation",
  commonSymptoms: "Common Symptoms",
  whenToSeekHelp: "When to Seek Help",
  followUp: "Follow-up",
  followUpPlaceholder: "Share how you are feeling now or mention any additional symptoms",
  sendFollowUp: "Continue",
  sendingFollowUp: "Sending...",
  disclaimerLabel: "Disclaimer",
  noHospitals: "Nearby hospital suggestions are not available right now.",
};

function resolveMessages(ui) {
  return { ...DEFAULT_MESSAGES, ...(ui?.messages ?? {}) };
}

function sourceBadgeClass(status) {
  if (status === "verified") {
    return "border-emerald-400/20 bg-emerald-500/10 text-emerald-100";
  }
  return "border-amber-400/20 bg-amber-500/10 text-amber-100";
}

function iconToneClasses(tone) {
  if (tone === "emerald") {
    return "border-emerald-400/25 bg-emerald-500/12 text-emerald-100";
  }
  if (tone === "amber") {
    return "border-amber-400/25 bg-amber-500/12 text-amber-100";
  }
  if (tone === "sky") {
    return "border-sky-400/25 bg-sky-500/12 text-sky-100";
  }
  return "border-blue-400/25 bg-blue-500/12 text-blue-100";
}

function SectionHeading({ icon, title, subtitle, tone = "blue" }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border text-lg ${iconToneClasses(tone)}`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{title}</h4>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-white/50">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function ConditionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4.75 12.25h4.5l1.75-4 2.5 7 1.75-3h4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FollowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8.25 9.25h7.5M8.25 13h4.5" strokeLinecap="round" />
      <path d="M6.25 5.75h11.5a2 2 0 0 1 2 2v6.5a2 2 0 0 1-2 2H11l-4.75 3v-3H6.25a2 2 0 0 1-2-2v-6.5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExplanationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7.5 5.75h9a1.5 1.5 0 0 1 1.5 1.5v9.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-9.5a1.5 1.5 0 0 1 1.5-1.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10h6M9 13h6" strokeLinecap="round" />
    </svg>
  );
}

function SymptomsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 7.75h8M9 12h8M9 16.25h8" strokeLinecap="round" />
      <path d="M6.25 7.75h.5M6.25 12h.5M6.25 16.25h.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 8.5v4.5M12 16.5h.01" strokeLinecap="round" />
      <path d="M10.43 4.97L4.6 15.02a1.5 1.5 0 0 0 1.3 2.25h11.2a1.5 1.5 0 0 0 1.3-2.25L12.57 4.97a1.5 1.5 0 0 0-2.14 0Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/35">
        {label}
      </div>
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  emptyLabel = "Select option",
}) {
  return (
    <label className="grid gap-2 text-sm text-white/60">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
      >
        <option value="">{emptyLabel}</option>
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue} className="text-black">
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Avatar({ label, muted = false }) {
  return (
    <div
      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border ${muted ? "border-white/10 bg-[#181818]/95 text-white/60" : "border-[#2563eb]/25 bg-[#2563eb]/16 text-white"}`}
    >
      {label}
    </div>
  );
}

export function Tag({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-[#181818]/95 px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

export function DetailCard({ title, items }) {
  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
        {items.map((item, index) => (
          <li key={`${title}-${index}`} className="ml-4 list-disc pl-1">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FacilityCard({ hospital }) {
  return (
    <article className="rounded-[1.3rem] border border-white/8 bg-black/20 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-[#7dd3fc]">
            {hospital.typeLabel || hospital.type}
          </div>
          <h4 className="mt-2 text-base font-semibold text-white">{hospital.name}</h4>
        </div>
        {hospital.distanceLabel ? (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-white/65">
            {hospital.distanceLabel}
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-white/60">
        {hospital.district}, {hospital.state}
      </p>
      <p className="mt-1 text-sm leading-6 text-white/45">{hospital.address}</p>
      <p className="mt-1 text-sm leading-6 text-white/45">{hospital.phone}</p>
    </article>
  );
}

export function TextMessage({ role, title, text, ui }) {
  const copy = resolveMessages(ui);
  const isUser = role === "user";
  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser ? <Avatar label="GA" /> : null}
      <div
        className={`max-w-3xl rounded-[1.75rem] border px-5 py-4 ${isUser ? "border-white/10 bg-[#181818]/95" : "border-white/10 bg-[#111111]/85"}`}
      >
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white/70">
          {text}
        </div>
      </div>
      {isUser ? <Avatar label={copy.you} muted /> : null}
    </div>
  );
}

export function AnalysisMessage({
  message,
  ui,
  onFollowUpSubmit,
  followUpBusy = false,
}) {
  const copy = resolveMessages(ui);
  const data = message.payload;
  const [followUpText, setFollowUpText] = React.useState("");
  const commonSymptoms = data.display.commonSymptoms ?? [];

  async function handleFollowUpSubmit(event) {
    event.preventDefault();
    const trimmed = followUpText.trim();
    if (!trimmed || !onFollowUpSubmit || followUpBusy) return;
    const didSubmit = await onFollowUpSubmit(message, trimmed);
    if (didSubmit !== false) {
      setFollowUpText("");
    }
  }

  return (
    <div className="flex gap-4">
      <Avatar label="GA" />
      <div className="max-w-3xl flex-1 rounded-[1.75rem] border border-white/10 bg-[#111111]/90 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="grid gap-4">
          <section className="rounded-[1.5rem] border border-blue-400/18 bg-blue-500/10 p-4 backdrop-blur-xl">
            <SectionHeading
              icon={<ConditionIcon />}
              title={copy.possibleCondition}
              tone="blue"
            />
            <p className="mt-4 text-sm leading-7 text-white/75">
              {data.display.possibleCondition}
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
            <SectionHeading
              icon={<ExplanationIcon />}
              title={copy.explanation}
              tone="sky"
            />
            <p className="mt-4 text-sm leading-7 text-white/70">
              {data.display.illnessExplanation || data.display.explanation}
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
            <SectionHeading
              icon={<SymptomsIcon />}
              title={copy.commonSymptoms}
              tone="emerald"
            />
            <ul className="mt-4 space-y-2 text-sm leading-6 text-white/68">
              {commonSymptoms.map((item, index) => (
                <li key={`${item}-${index}`} className="ml-4 list-disc pl-1">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.5rem] border border-amber-400/15 bg-amber-500/10 p-4 backdrop-blur-xl">
            <SectionHeading
              icon={<WarningIcon />}
              title={copy.whenToSeekHelp}
              tone="amber"
            />
            <p className="mt-4 text-sm leading-7 text-amber-100">
              {data.display.whenToSeekHelp}
            </p>
          </section>

          <section className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
            <SectionHeading
              icon={<FollowUpIcon />}
              title={copy.followUp}
              subtitle={data.display.followUpQuestion}
              tone="sky"
            />
            <form
              onSubmit={handleFollowUpSubmit}
              className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]"
            >
              <textarea
                value={followUpText}
                onChange={(event) => setFollowUpText(event.target.value)}
                rows={2}
                placeholder={copy.followUpPlaceholder}
                className="min-h-[88px] w-full rounded-[1.3rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25"
              />
              <button
                type="submit"
                disabled={followUpBusy || !followUpText.trim()}
                className="rounded-[1.3rem] bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(37,99,235,0.28)] transition hover:brightness-110 disabled:opacity-60"
              >
                {followUpBusy ? copy.sendingFollowUp : copy.sendFollowUp}
              </button>
            </form>
          </section>
        </div>

        <div className="mt-4 rounded-[1.3rem] border border-amber-400/15 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-100">
          <span className="font-semibold text-amber-50">{copy.disclaimerLabel}: </span>
          {data.display.disclaimer}
        </div>
      </div>
    </div>
  );
}

export function PrescriptionMessage({ message, ui }) {
  const copy = resolveMessages(ui);
  return (
    <div className="flex gap-4">
      <Avatar label="GA" />
      <div className="max-w-3xl flex-1 rounded-[1.75rem] border border-white/10 bg-[#111111]/90 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-white">{copy.prescriptionExplainer}</h3>
        <div className="mt-4 grid gap-3">
          {message.payload.lines.map((line, index) => (
            <article
              key={`${line.medicine}-${index}`}
              className="rounded-[1.3rem] border border-white/8 bg-white/[0.04] p-4"
            >
              <h4 className="text-sm font-semibold text-white">{line.medicine}</h4>
              <div className="mt-2 text-sm leading-6 text-white/65">
                {[
                  line.display.times?.length
                    ? `${copy.times}: ${line.display.times.join(" / ")}`
                    : null,
                  line.display.mealRelation
                    ? `${copy.mealRelation}: ${line.display.mealRelation}`
                    : null,
                  line.display.abbreviations?.length
                    ? `${copy.decodedAs}: ${line.display.abbreviations.join(", ")}`
                    : null,
                  line.durationDays
                    ? `${line.durationDays} day${line.durationDays === 1 ? "" : "s"}`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" - ") || line.raw}
              </div>
            </article>
          ))}
          {message.payload.legend?.length ? (
            <DetailCard
              title={copy.abbreviationLegend}
              items={message.payload.legend.map(
                (item) => `${item.abbr}: ${item.meaning}`,
              )}
            />
          ) : null}
          {message.payload.warnings?.length ? (
            <DetailCard title={copy.safetyReminders} items={message.payload.warnings} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function FinderMessage({ message, ui }) {
  const copy = resolveMessages(ui);
  return (
    <div className="flex gap-4">
      <Avatar label="GA" />
      <div className="max-w-3xl flex-1 rounded-[1.75rem] border border-white/10 bg-[#111111]/90 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <h3 className="text-xl font-semibold text-white">{copy.facilityFinder}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(message.payload.results ?? []).map((hospital) => (
            <FacilityCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MedicalBookMessage({ message, ui }) {
  const copy = resolveMessages(ui);
  const data = message.payload;
  const book = data.book;

  let heading = copy.medicalBookAnswer;
  if (data.status === "not_found") heading = copy.notInBook;
  if (data.status === "requires_confirmation") heading = copy.cautionRequired;
  if (data.status === "no_book") heading = copy.noBookFound;

  return (
    <div className="flex gap-4">
      <Avatar label="GA" />
      <div className="max-w-3xl flex-1 rounded-[1.75rem] border border-white/10 bg-[#111111]/90 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl">
        <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.04] px-4 py-4">
          <div className="flex flex-wrap items-center gap-2">
            {book?.name ? <Tag>{`${copy.basedOnBook}: ${book.name}`}</Tag> : null}
            {book?.sourceStatus ? (
              <span
                className={`rounded-full border px-3 py-1 text-xs ${sourceBadgeClass(book.sourceStatus)}`}
              >
                {book.sourceStatus === "verified"
                  ? copy.verifiedSource
                  : copy.cautionSource}
              </span>
            ) : null}
          </div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{heading}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{data.answer}</p>
          {book?.sourceReason ? (
            <p className="mt-3 text-xs leading-6 text-white/45">
              {`${copy.sourceReason}: ${book.sourceReason}`}
            </p>
          ) : null}
        </div>

        {data.excerpts?.length ? (
          <div className="mt-4 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-white">{copy.supportingExcerpts}</h4>
            <div className="mt-3 grid gap-3">
              {data.excerpts.map((excerpt, index) => (
                <article
                  key={`${excerpt.location}-${index}`}
                  className="rounded-[1.2rem] border border-white/8 bg-black/20 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-white/35">
                    {excerpt.page ? `${copy.pageLabel} ${excerpt.page}` : excerpt.location}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/65">{excerpt.text}</p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {data.safetyNote ? (
          <div className="mt-4 rounded-[1.3rem] border border-amber-400/15 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
            <div className="text-xs uppercase tracking-[0.18em] text-amber-100/75">
              {copy.bookSafetyNote}
            </div>
            <p className="mt-2">{data.safetyNote}</p>
          </div>
        ) : null}

        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/35">
          {data.disclaimer}
        </p>
      </div>
    </div>
  );
}
