import Link from "next/link";

import { Nav } from "@/components/Nav";
import { ContentColumn } from "@/components/layout/ContentColumn";

export const metadata = {
  title: "Terms and Conditions — Sideout",
};

export default function TermsPage() {
  return (
    <div className="bg-sideout-green text-sideout-cream">
      <Nav />
      <main className="pb-16 pt-8">
        <ContentColumn className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-tight">
              Terms and Conditions
            </h1>
            <p className="text-sm text-sideout-cream/80">
              Please read these terms before creating an account.
            </p>
          </header>

          <section className="space-y-3 text-sm leading-relaxed text-sideout-cream/90">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              Account use
            </h2>
            <p>
              You agree to provide accurate information and to keep your login
              credentials secure. You are responsible for activity under your
              account.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sideout-cream/90">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              Loyalty program
            </h2>
            <p>
              Loyalty points and rewards are subject to current Sideout program
              rules and may change over time.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sideout-cream/90">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              Campaign and promotional emails
            </h2>
            <p>
              By signing up, you agree that Sideout may use your email address
              to send campaign announcements, promotions, and loyalty-related
              updates.
            </p>
          </section>

          <p className="text-xs text-sideout-cream/70">
            Related document:{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </ContentColumn>
      </main>
    </div>
  );
}
