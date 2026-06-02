import Link from "next/link";

import { Nav } from "@/components/Nav";
import { ContentColumn } from "@/components/layout/ContentColumn";

export const metadata = {
  title: "Privacy Policy — Sideout",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-sideout-green text-sideout-cream">
      <Nav />
      <main className="pb-16 pt-8">
        <ContentColumn className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-sideout-cream/80">
              This page explains how Sideout handles your data.
            </p>
          </header>

          <section className="space-y-3 text-sm leading-relaxed text-sideout-cream/90">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              Information we collect
            </h2>
            <p>
              We collect account details such as username and email, plus
              loyalty activity needed to provide your rewards experience.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sideout-cream/90">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              How we use your information
            </h2>
            <p>
              Your information is used to authenticate your account, track
              loyalty points, and support service communications.
            </p>
            <p>
              Your email may also be used for campaign and promotional
              communications, including special offers and product updates.
            </p>
          </section>

          <section className="space-y-3 text-sm leading-relaxed text-sideout-cream/90">
            <h2 className="text-lg font-semibold uppercase tracking-wide">
              Data protection
            </h2>
            <p>
              We apply reasonable technical and organizational safeguards to
              protect personal data.
            </p>
          </section>

          <p className="text-xs text-sideout-cream/70">
            Related document:{" "}
            <Link href="/terms" className="underline underline-offset-2">
              Terms and Conditions
            </Link>
          </p>
        </ContentColumn>
      </main>
    </div>
  );
}
