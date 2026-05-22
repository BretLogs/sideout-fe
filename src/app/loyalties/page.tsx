import Link from "next/link";
import { Nav } from "@/components/Nav";

export const metadata = {
  title: "Loyalties — Sideout",
};

export default function LoyaltiesPage() {
  return (
    <div className="min-h-dvh bg-sideout-green text-sideout-cream">
      <Nav variant="dark" />
      <main className="flex min-h-[calc(100dvh-49px)] flex-col px-6 py-16">
        <div className="mb-10 space-y-2">
          <h1 className="text-2xl font-medium uppercase tracking-tight">
            Loyalties
          </h1>
          <p className="text-sm text-sideout-cream/80">
            Your stamp card and reward progress will appear here once you are
            signed in.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-sideout-cream/30 px-6 py-20 text-center">
          <p className="mb-1 text-sm font-medium uppercase">No loyalty card yet</p>
          <p className="mb-6 max-w-sm text-sm text-sideout-cream/80">
            Sign in or create an account to start collecting stamps toward your
            next reward.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-full bg-sideout-cream px-5 py-2 text-sm font-medium uppercase tracking-wide text-sideout-green transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-sideout-cream px-5 py-2 text-sm font-medium uppercase tracking-wide transition-colors hover:bg-sideout-cream/10"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
