"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type SocialSignInProps = {
  mode: "signin" | "signup";
  disabled?: boolean;
  disabledReason?: string;
};

export function SocialSignIn({
  mode,
  disabled = false,
  disabledReason,
}: SocialSignInProps) {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    const result = await signInWithGoogle();
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/loyalties");
  };

  return (
    <div className="pt-2">
      <p className="my-8 text-center text-xs font-base uppercase tracking-wide text-sideout-cream/80">
        or continue with
      </p>
      <div className="flex justify-center">
        <button
          type="button"
          disabled={submitting || disabled}
          aria-label={mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
          onClick={handleGoogle}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-sideout-cream transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <GoogleIcon />
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-center text-sm text-red-300">{error}</p>
      ) : null}
      {!error && disabledReason ? (
        <p className="mt-3 text-center text-xs text-sideout-cream/75">{disabledReason}</p>
      ) : null}
    </div>
  );
}
