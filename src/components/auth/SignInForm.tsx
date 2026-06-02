"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SocialSignIn } from "@/components/signup/SocialSignIn";
import { useAuth } from "@/contexts/AuthContext";

const inputClassName =
  "w-full rounded-lg border border-sideout-cream/40 bg-sideout-green px-3 py-2 text-sm text-sideout-cream outline-none placeholder:text-sideout-cream/50 focus:border-sideout-cream";

export function SignInForm() {
  const router = useRouter();
  const { signInWithEmail, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/loyalties");
    }
  }, [isLoading, user, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signInWithEmail(email, password);
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            placeholder="Your password"
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
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <SocialSignIn mode="signin" />
      <p className="mt-6 text-center text-sm text-sideout-cream/80">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-sideout-cream underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
