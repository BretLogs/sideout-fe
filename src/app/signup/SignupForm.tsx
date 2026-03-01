"use client";

import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Username and password are required.",
  username:
    "Username must be 3–30 characters: letters, numbers, underscore, or hyphen.",
  password: "Password must be at least 6 characters.",
  taken: "This username is already taken.",
  email_taken: "This email is already registered.",
  server: "Something went wrong. Please try again.",
};

type Props = { redirectTo?: string; errorParam?: string };

export function SignupForm({ redirectTo = "/dashboard", errorParam }: Props) {
  const error = errorParam ? ERROR_MESSAGES[errorParam] ?? "Something went wrong." : null;

  return (
    <form
      action="/api/auth/signup"
      method="POST"
      className="mt-8 space-y-4"
    >
      <input type="hidden" name="next" value={redirectTo} />
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="signup-username" className="block text-sm font-medium text-sideout-green/80">
          Username
        </label>
        <input
          id="signup-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          maxLength={30}
          className="mt-1 w-full border border-sideout-green/30 bg-white px-3 py-2 text-sideout-green placeholder:text-sideout-green/50 focus:outline-none focus:ring-2 focus:ring-sideout-green/50"
          placeholder="Letters, numbers, _ or - (3–30 chars)"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-sideout-green/80">
          Email <span className="text-sideout-green/50">(optional)</span>
          <span
            className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-sideout-green/40 bg-sideout-green/10 text-sideout-green text-xs font-medium"
            title="We use this to send you news, events, and promos."
            aria-label="Optional: add email to receive news, events, and promos"
          >
            i
          </span>
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full border border-sideout-green/30 bg-white px-3 py-2 text-sideout-green placeholder:text-sideout-green/50 focus:outline-none focus:ring-2 focus:ring-sideout-green/50"
          placeholder="you@example.com"
        />
        <p className="mt-1 text-xs text-sideout-green/60">
          Add your email if you’d like to receive news, events, and promos.
        </p>
      </div>
      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-sideout-green/80">
          Password
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="mt-1 w-full border border-sideout-green/30 bg-white px-3 py-2 text-sideout-green placeholder:text-sideout-green/50 focus:outline-none focus:ring-2 focus:ring-sideout-green/50"
          placeholder="At least 6 characters"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-sideout-green text-sideout-beige py-3 text-sm font-medium hover:bg-sideout-green/90 transition-colors"
      >
        Sign up
      </button>
      <p className="text-sm text-sideout-green/70">
        <Link href="/" className="underline underline-offset-4 hover:no-underline">
          Back to home
        </Link>
      </p>
    </form>
  );
}
