"use client";

import Link from "next/link";

type Props = { redirectTo?: string; errorParam?: string };

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Invalid username or password.",
  server: "Something went wrong. Please try again.",
  auth: "Authentication failed. Please try again.",
};

export function LoginForm({ redirectTo = "/dashboard", errorParam }: Props) {
  const error = errorParam ? ERROR_MESSAGES[errorParam] ?? "Something went wrong." : null;

  return (
    <form
      action="/api/auth/login"
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
        <label htmlFor="login-username" className="block text-sm font-medium text-sideout-green/80">
          Username or email
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-1 w-full border border-sideout-green/30 bg-white px-3 py-2 text-sideout-green placeholder:text-sideout-green/50 focus:outline-none focus:ring-2 focus:ring-sideout-green/50"
          placeholder="Your username or email"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-sideout-green/80">
          Password
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full border border-sideout-green/30 bg-white px-3 py-2 text-sideout-green placeholder:text-sideout-green/50 focus:outline-none focus:ring-2 focus:ring-sideout-green/50"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-sideout-green text-sideout-beige py-3 text-sm font-medium hover:bg-sideout-green/90 transition-colors"
      >
        Sign in
      </button>
      <p className="text-sm text-sideout-green/70">
        <Link href="/" className="underline underline-offset-4 hover:no-underline">
          Back to home
        </Link>
      </p>
    </form>
  );
}
