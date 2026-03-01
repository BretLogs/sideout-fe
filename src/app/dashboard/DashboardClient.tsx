"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

const STAMPS_TOTAL = 10;

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
  const [showQR, setShowQR] = useState(false);

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
    <div className="min-h-screen bg-sideout-beige text-sideout-green px-6 py-12 md:px-12 lg:px-24">
      <header className="flex justify-between items-center mb-12">
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

      <h1 className="text-2xl font-normal tracking-tight">Loyalty card</h1>
      <p className="mt-2 text-sideout-green/80">
        {profile?.username
          ? `@${profile.username}`
          : profile?.full_name || profile?.email || "—"}
      </p>

      {/* Stamp card — filled = solid green + check; empty = outline + number */}
      <div className="mt-8 p-6 border-2 border-sideout-green/30 bg-white rounded-lg shadow-sm">
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

      {/* Get stamped */}
      <div className="mt-8">
        <button
          type="button"
          onClick={() => setShowQR(true)}
          className="bg-sideout-green text-sideout-beige px-6 py-3 text-sm font-medium hover:bg-sideout-green/90 transition-colors"
        >
          Get stamped
        </button>
      </div>

      {/* QR modal — opens when "Get stamped" is pressed */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-sideout-green/80 p-4"
          onClick={() => setShowQR(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowQR(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Show QR code to barista"
        >
          <div
            className="bg-sideout-beige p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-sideout-green/80 mb-4">
              Show this to the barista to get a stamp.
            </p>
            <div className="flex justify-center bg-white p-4 min-h-[200px] items-center">
              {profile?.id ? (
                <QRCodeSVG value={profile.id} size={200} level="M" />
              ) : (
                <span className="text-sideout-green/50 text-sm">Loading…</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowQR(false)}
              className="mt-6 text-sm text-sideout-green underline underline-offset-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
