"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SocialSignIn } from "@/components/signup/SocialSignIn";
import { useAuth } from "@/contexts/AuthContext";

const inputClassName =
  "w-full rounded-lg border border-sideout-cream/40 bg-sideout-green px-3 py-2 text-sm text-sideout-cream outline-none placeholder:text-sideout-cream/50 focus:border-sideout-cream";

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

export function SignUpForm() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const normalizedUsername = username.trim().toLowerCase();
    if (!USERNAME_PATTERN.test(normalizedUsername)) {
      setError(
        "Username must be 3–30 characters: lowercase letters, numbers, underscore.",
      );
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const result = await signUpWithEmail(normalizedUsername, email, password);
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/loyalties");
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
            placeholder="Choose a username"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
            placeholder="you@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            placeholder="Create a password"
          />
        </div>
        {error ? (
          <p className="text-center text-sm text-red-300">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-sideout-cream py-2.5 text-sm font-medium uppercase tracking-wide text-sideout-green transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
      <SocialSignIn mode="signup" />
      <p className="mt-6 text-center text-sm text-sideout-cream/80">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-sideout-cream underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
