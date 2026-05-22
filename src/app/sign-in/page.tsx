import Image from "next/image";
import Link from "next/link";
import { BackButton } from "@/components/auth/BackButton";
import { SocialSignIn } from "@/components/signup/SocialSignIn";

export const metadata = {
  title: "Sign in — Sideout",
};

const inputClassName =
  "w-full rounded-lg border border-sideout-cream/40 bg-sideout-green px-3 py-2 text-sm text-sideout-cream outline-none placeholder:text-sideout-cream/50 focus:border-sideout-cream";

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-sideout-green text-sideout-cream">
      <header className="px-5 pt-5">
        <BackButton />
      </header>
      <main className="flex flex-col justify-center px-6 pb-16 pt-4">
        <div className="mb-8 space-y-4 text-center">
          <Image
            src="/assets/svg/sideout_logo_light.svg"
            alt="Sideout"
            width={810}
            height={810}
            className="mx-auto h-auto w-full max-w-[55%]"
            priority
          />
          <div className="space-y-2">
            <h1 className="text-2xl font-medium uppercase tracking-tight">
              Sign in
            </h1>
            <p className="text-sm text-sideout-cream/80">
              Welcome back. Sign in to view your loyalty card.
            </p>
          </div>
        </div>
        <form className="space-y-4" action="#" method="post">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className={inputClassName}
              placeholder="Your username"
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
              className={inputClassName}
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-sideout-cream py-2.5 text-sm font-medium uppercase tracking-wide text-sideout-green transition-opacity hover:opacity-90"
          >
            Sign in
          </button>
        </form>
        <SocialSignIn />
        <p className="mt-6 text-center text-sm text-sideout-cream/80">
          New here?{" "}
          <Link
            href="/signup"
            className="font-medium text-sideout-cream underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
