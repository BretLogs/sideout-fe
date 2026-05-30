import Image from "next/image";

import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { BackButton } from "@/components/auth/BackButton";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata = {
  title: "Sign in — Sideout",
};

export default function SignInPage() {
  return (
    <AuthPageShell>
      <header className="px-5 pt-5">
        <BackButton />
      </header>
      <main className="flex flex-col px-6 pb-16 pt-4">
        <div className="mb-8 space-y-4 text-center">
          <Image
            src="/assets/svg/sideout_logo_light.svg"
            alt="Sideout"
            width={810}
            height={810}
            className="h-auto w-full"
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
        <SignInForm />
      </main>
    </AuthPageShell>
  );
}
