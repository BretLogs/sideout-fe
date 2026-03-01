"use client";

import { useState } from "react";
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

type LoyaltyCard = {
  id: string;
  status: "completed" | "redeemed";
  completed_at: string;
  redeemed_at: string | null;
};

function formatCardDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function DashboardClient({
  profile,
  cards = [],
}: {
  profile: Profile | null;
  cards?: LoyaltyCard[];
}) {
  const [showFullScreenCard, setShowFullScreenCard] = useState(false);

  function handleSignOut() {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/logout";
    document.body.appendChild(form);
    form.submit();
  }
  const stampCount = profile?.stamp_count ?? 0;
  const stampsRemaining = Math.max(0, STAMPS_TOTAL - stampCount);

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
              {stampCount === 0
                ? "Get a stamp with every drink. Full cards go to Card history — show one there to redeem your free coffee."
                : `${stampsRemaining} stamp${stampsRemaining !== 1 ? "s" : ""} until your next free coffee.`}
            </p>
          </div>
        </section>
      </div>

      {/* Full-screen view for showing completed card to barista (for redeeming) */}
      {showFullScreenCard && profile?.id && (
        <div
          className="fixed inset-0 z-50 bg-sideout-beige flex flex-col items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Show loyalty card to barista"
        >
          <p className="text-center text-sideout-green/80 text-sm mb-4">
            Show this screen to the barista to redeem your free coffee.
          </p>
          <div className="bg-white p-6 rounded-2xl border-2 border-sideout-green/20 shadow-lg max-w-sm w-full text-center">
            <div className="flex justify-center mb-4">
              <QRCodeSVG
                value={profile.id}
                size={200}
                level="M"
                includeMargin
                className="rounded-lg"
              />
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-sideout-green/60 mb-2">
              10 of 10 stamps
            </p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded bg-sideout-green text-sideout-beige flex items-center justify-center text-xs font-semibold"
                >
                  ✓
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowFullScreenCard(false)}
            className="mt-6 text-sideout-green font-medium underline underline-offset-4"
          >
            Close
          </button>
        </div>
      )}

      {/* Card history — past completed/redeemed cards */}
      {cards.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-medium text-sideout-green mb-3">
            Card history
          </h2>
          <ul className="space-y-2">
            {cards.map((card) => (
              <li
                key={card.id}
                className="flex flex-wrap items-center justify-between gap-2 p-4 mb-2 bg-white rounded-xl border-2 border-sideout-green/20"
              >
                <span className="text-sm text-sideout-green/80">
                  Card completed {formatCardDate(card.completed_at)}
                  {card.redeemed_at && (
                    <span className="block text-sideout-green/60 text-xs mt-0.5">
                      Redeemed {formatCardDate(card.redeemed_at)}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {card.status === "completed" && (
                    <button
                      type="button"
                      onClick={() => setShowFullScreenCard(true)}
                      className="bg-sideout-green text-sideout-beige px-3 py-2 rounded-lg text-xs font-medium hover:bg-sideout-green/90"
                    >
                      Show to barista
                    </button>
                  )}
                  <span
                    className={`inline-flex items-center py-2 px-2 rounded-full text-xs font-medium ${
                      card.status === "redeemed"
                        ? "bg-sideout-green/20 text-sideout-green"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {card.status === "redeemed" ? "Redeemed" : "Completed"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
