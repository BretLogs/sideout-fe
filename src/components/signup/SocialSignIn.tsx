const iconClass = "h-5 w-5";

function GmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${iconClass} fill-sideout-green`}
      aria-hidden
    >
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={`${iconClass} fill-sideout-green`} aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

const providers = [
  { label: "Gmail", icon: <GmailIcon /> },
  { label: "Facebook", icon: <FacebookIcon /> },
] as const;

export function SocialSignIn() {
  return (
    <div className="pt-2">
      <p className="my-8 text-xs text-center font-base uppercase tracking-wide text-sideout-cream/80">
        or continue with
      </p>
      <ul className="flex items-center justify-center gap-4">
        {providers.map(({ label, icon }) => (
          <li key={label}>
            <button
              type="button"
              aria-label={`Continue with ${label}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-sideout-cream transition-opacity hover:opacity-90"
            >
              {icon}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
