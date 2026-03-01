"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const STAMPS_TOTAL = 10;
const QR_SIZE = 220;

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  stamp_count: number;
};

export function DashboardClient({
  profile,
}: {
  profile: Profile | null;
}) {
  function handleSignOut() {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/logout";
    document.body.appendChild(form);
    form.submit();
  }
  const stampCount = profile?.stamp_count ?? 0;
  const stampsRemaining = Math.max(0, STAMPS_TOTAL - stampCount);
  const canRedeem = stampCount >= STAMPS_TOTAL;

  return (
    <div className="min-h-screen bg-sideout-beige text-sideout-green px-6 py-8 md:px-12 md:py-10 lg:px-24">
      <header className="flex justify-between items-center mb-8">
        <Link href="/" className="text-xl font-normal tracking-tight">
          Sideout
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-sideout-green/70 hover:underline"
          >
            Back to home
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm text-sideout-green/70 hover:underline"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Loyalty card — one container: QR at top, then divider, then stamps */}
      <div className="bg-white rounded-2xl border-2 border-sideout-green/20 shadow-sm overflow-hidden">
        {/* QR section — show to barista */}
        <section className="p-6 md:p-8 text-center border-b border-sideout-green/20">
          <h2 className="text-lg font-medium text-sideout-green">
            Show at the counter
          </h2>
          <p className="mt-2 text-sm text-sideout-green/80 max-w-xs mx-auto">
            Show this QR code to the barista when you order to get your stamp.
          </p>
          <div className="mt-6 flex justify-center">
            <div
              className="inline-flex items-center justify-center bg-white p-4 rounded-xl border-2 border-sideout-green/10"
              aria-hidden="true"
            >
              {profile?.id ? (
                <QRCodeSVG
                  value={profile.id}
                  size={QR_SIZE}
                  level="M"
                  includeMargin
                  className="rounded-lg"
                />
              ) : (
                <span className="text-sideout-green/50 text-sm">Loading…</span>
              )}
            </div>
          </div>
        </section>

        {/* Stamp card section — same div, below divider */}
        <section className="p-6 md:p-8">
          <h1 className="text-2xl font-normal tracking-tight">Loyalty card</h1>
          <p className="mt-2 text-sideout-green/80">
            {profile?.username
              ? `@${profile.username}`
              : profile?.full_name || profile?.email || "—"}
          </p>

          <div className="mt-6">
            <p className="text-xs font-medium uppercase tracking-wider text-sideout-green/60 mb-3">
              {stampCount} of {STAMPS_TOTAL} stamps
            </p>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
              {Array.from({ length: STAMPS_TOTAL }, (_, i) => {
                const filled = i < stampCount;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md flex items-center justify-center text-sm font-semibold transition-colors ${
                      filled
                        ? "bg-sideout-green text-sideout-beige border-2 border-sideout-green shadow-inner"
                        : "bg-sideout-beige/50 text-sideout-green/70 border-2 border-dashed border-sideout-green/50"
                    }`}
                    title={filled ? "Stamped" : `Slot ${i + 1}`}
                  >
                    {filled ? "✓" : i + 1}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-sideout-green/70">
              {canRedeem
                ? "You've earned a free coffee. Ask the barista to redeem."
                : `${stampsRemaining} stamp${stampsRemaining !== 1 ? "s" : ""} until your next free coffee.`}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
