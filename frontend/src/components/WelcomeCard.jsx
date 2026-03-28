function SuggestedLanguageChip({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-blue-300/60 bg-white/[0.14] text-white"
          : "border-white/10 bg-white/[0.06] text-white/70 hover:bg-white/[0.1]"
      }`}
    >
      {label}
    </button>
  );
}

export default function WelcomeCard({
  copy,
  suggestedLanguage,
  suggestedLanguages,
  selectedLanguageCode,
  languageOptions,
  getLanguageDisplayLabel,
  onSelectLanguage,
  onUseSuggestion,
  onContinue,
}) {
  return (
    <div className="w-full max-w-xl rounded-[2.25rem] border border-white/12 bg-white/[0.08] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-5">
      <div className="text-center">
        {/* <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
          {copy.suggestedFromDevice}
        </p> */}
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-[3.35rem]">
          {copy.welcomeTitle}
        </h1>
        {/* <p className="mt-3 text-sm text-white/65 sm:text-base">
          {copy.selectLanguageFirst}
        </p> */}
      </div>

      <div className="mt-8 rounded-[1.8rem] border border-blue-400/20 bg-blue-500/10 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-blue-100/60">
              {copy.recommended}
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {getLanguageDisplayLabel(suggestedLanguage)}
            </p>
            <p className="mt-1 text-sm text-white/55">{copy.basedOnDevice}</p>
            {suggestedLanguages.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {suggestedLanguages.map((item) => (
                  <SuggestedLanguageChip
                    key={item.code}
                    active={selectedLanguageCode === item.code}
                    label={getLanguageDisplayLabel(item)}
                    onClick={() => onSelectLanguage(item.code)}
                  />
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onUseSuggestion}
            className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.12]"
          >
            {copy.useSuggestion}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label className="block">
          <span className="mb-3 block text-sm font-medium text-white/70">
            {copy.selectLanguage}
          </span>
          <select
            value={selectedLanguageCode}
            onChange={(event) => onSelectLanguage(event.target.value)}
            className="w-full rounded-[1.6rem] border border-white/14 bg-black/25 px-5 py-4 text-base text-white outline-none transition focus:border-blue-300/50"
          >
            {languageOptions.map((item) => (
              <option
                key={item.code}
                value={item.code}
                className="bg-[#0f0f0f] text-white"
              >
                {getLanguageDisplayLabel(item)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(37,99,235,0.38)] transition hover:brightness-110"
      >
        {copy.continue}
      </button>
    </div>
  );
}
