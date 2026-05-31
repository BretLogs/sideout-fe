import Image from "next/image";

import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { BackButton } from "@/components/auth/BackButton";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { ContentColumn } from "@/components/layout/ContentColumn";

export const metadata = {
  title: "Sign up — Sideout",
};

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <ContentColumn>
        <header className="pt-5">
          <BackButton />
        </header>
        <main className="flex flex-col pb-16 pt-4">
          <div className="mb-8 space-y-4 text-center">
            <Image
              src="/assets/svg/sideout_logo_light.svg"
              alt="Sideout"
              width={810}
              height={810}
              className="mx-auto h-auto w-full max-w-content"
              priority
            />
            <div className="space-y-2">
              <h1 className="text-2xl font-medium uppercase tracking-tight md:text-3xl">
                Sign up
              </h1>
              <p className="text-sm text-sideout-cream/80">
                Create an account to join the loyalty program.
              </p>
            </div>
          </div>
          <SignUpForm />
        </main>
      </ContentColumn>
    </AuthPageShell>
  );
}
