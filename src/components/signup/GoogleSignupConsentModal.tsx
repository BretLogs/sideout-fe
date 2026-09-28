"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";

type GoogleSignupConsentModalProps = {
  open: boolean;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onContinue: () => void;
};

export function GoogleSignupConsentModal({
  open,
  submitting,
  error,
  onClose,
  onContinue,
}: GoogleSignupConsentModalProps) {
  const titleId = useId();
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    continueButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, submitting]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="presentation">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close Google sign up"
        disabled={submitting}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 flex w-full max-w-app -translate-x-1/2 items-end">
        <div className="absolute inset-0 bg-black/55" aria-hidden />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="pointer-events-auto relative z-10 w-full rounded-t-3xl border border-sideout-cream/40 bg-sideout-green px-6 py-8 text-sideout-cream shadow-[0_-8px_40px_rgba(0,0,0,0.45)]"
        >
          <h2
            id={titleId}
            className="mb-3 text-xl font-medium uppercase tracking-tight"
          >
            Sign up with Google
          </h2>
          <p className="text-sm leading-relaxed text-sideout-cream/85">
            By continuing with Google, you accept the{" "}
            <Link
              href="/terms"
              className="font-medium text-sideout-cream underline underline-offset-2 hover:opacity-90"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="font-medium text-sideout-cream underline underline-offset-2 hover:opacity-90"
            >
              Privacy Policy
            </Link>
            .
          </p>
          {error ? (
            <p className="mt-4 text-center text-sm text-red-300">{error}</p>
          ) : null}
          <button
            ref={continueButtonRef}
            type="button"
            onClick={onContinue}
            disabled={submitting}
            className="mt-8 w-full rounded-full bg-sideout-cream py-2.5 text-sm font-medium uppercase tracking-wide text-sideout-green transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Continuing…" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
