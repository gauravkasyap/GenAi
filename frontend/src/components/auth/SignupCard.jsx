function AuthInput({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-white/25 focus-within:bg-white/[0.08]">
      <span className="text-white/45">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-white/35"
      />
    </label>
  );
}

function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white/85 shadow-[0_14px_30px_rgba(0,0,0,0.28)] transition hover:bg-white/[0.1]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 19.5a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3 8 7.824 5.216a2.1 2.1 0 0 0 2.352 0L21 8"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V7.875a4.5 4.5 0 1 0-9 0V10.5"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.25 10.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M15.09 3.53c.84-1.02 1.41-2.4 1.26-3.53-1.22.05-2.7.82-3.57 1.85-.78.91-1.47 2.29-1.29 3.63 1.35.1 2.74-.68 3.6-1.95Zm3.3 8.64c-.03-2.58 2.11-3.82 2.2-3.88-1.2-1.75-3.08-1.99-3.73-2.02-1.59-.16-3.11.93-3.92.93-.81 0-2.06-.91-3.38-.89-1.74.03-3.34 1.01-4.23 2.57-1.81 3.13-.46 7.77 1.3 10.31.86 1.24 1.88 2.63 3.22 2.58 1.29-.05 1.77-.83 3.32-.83 1.55 0 1.98.83 3.35.8 1.39-.02 2.27-1.26 3.12-2.51.98-1.42 1.38-2.8 1.4-2.87-.03-.01-2.67-1.03-2.7-4.19Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.82 12.21c0-.64-.06-1.25-.16-1.84H12v3.48h5.53a4.73 4.73 0 0 1-2.05 3.1v2.57h3.32c1.95-1.8 3.02-4.46 3.02-7.31Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.75 0 5.05-.91 6.74-2.48l-3.32-2.57c-.92.62-2.1.99-3.42.99-2.63 0-4.85-1.78-5.64-4.16H2.93v2.64A10.18 10.18 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.36 13.78A6.1 6.1 0 0 1 6.04 12c0-.62.11-1.22.32-1.78V7.58H2.93A10 10 0 0 0 2 12c0 1.61.39 3.14 1.08 4.42l3.28-2.64Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.06c1.49 0 2.82.51 3.87 1.51l2.9-2.9C17.04 3.05 14.74 2 12 2 8.07 2 4.68 4.25 2.93 7.58l3.43 2.64C7.15 7.84 9.37 6.06 12 6.06Z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-7.03L5.9 22H2.8l7.24-8.28L.8 2h6.41l4.43 6.35L18.9 2Zm-1.1 18h1.73L6.24 3.9H4.38L17.8 20Z" />
    </svg>
  );
}

export default function SignupCard({
  copy,
  selectedLanguageLabel,
  fullName,
  email,
  password,
  authError,
  onChangeLanguage,
  onToggleAuthMode,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSocialClick,
}) {
  return (
    <div className="w-full max-w-md rounded-[2rem] border border-white/12 bg-white/[0.08] p-8 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onChangeLanguage}
          className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/[0.09]"
        >
          {copy.changeLanguage}
        </button>
        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-blue-100/85">
          {selectedLanguageLabel}
        </span>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-[3.25rem]">
          {copy.createAccount}
        </h1>
        <p className="mt-3 text-sm text-white/65 sm:text-base">
          {copy.alreadyHaveAccount}{" "}
          <button
            type="button"
            onClick={onToggleAuthMode}
            className="font-medium text-white transition hover:text-blue-300"
          >
            {copy.logIn}
          </button>
        </p>
        {/* <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/35">
          {copy.privateHistory}
        </p> */}
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <AuthInput
          icon={<UserIcon />}
          placeholder={copy.fullName}
          value={fullName}
          onChange={onFullNameChange}
          autoComplete="name"
        />
        <AuthInput
          icon={<MailIcon />}
          type="email"
          placeholder={copy.email}
          value={email}
          onChange={onEmailChange}
          autoComplete="email"
        />
        <AuthInput
          icon={<LockIcon />}
          type="password"
          placeholder={copy.password}
          value={password}
          onChange={onPasswordChange}
          autoComplete="new-password"
        />
        {authError ? (
          <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {authError}
          </p>
        ) : null}
        <button
          type="submit"
          className="w-full rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#60a5fa] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(37,99,235,0.38)] transition hover:brightness-110"
        >
          {copy.createAccountButton}
        </button>
      </form>

      <div className="mt-7 flex items-center gap-3 text-xs uppercase tracking-[0.26em] text-white/35">
        <div className="h-px flex-1 bg-white/10" />
        <span>{copy.or}</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <SocialButton
          icon={<AppleIcon />}
          label="Apple"
          onClick={() => onSocialClick("Apple")}
        />
        <SocialButton
          icon={<GoogleIcon />}
          label="Google"
          onClick={() => onSocialClick("Google")}
        />
        <SocialButton
          icon={<XIcon />}
          label="X"
          onClick={() => onSocialClick("X")}
        />
      </div>
    </div>
  );
}
