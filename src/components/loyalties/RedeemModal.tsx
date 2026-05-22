"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MOCK_REDEEM_QR_VALUE } from "@/lib/loyalties/mockData";
import { MockQrCode } from "./MockQrCode";
import { playRedeemCelebration } from "./redeemCelebration";
import { StampGrid } from "./StampGrid";

const IS_DEV = process.env.NODE_ENV === "development";

type RedeemModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RedeemModal({ open, onClose }: RedeemModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const stampCardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const celebrationCleanupRef = useRef<(() => void) | null>(null);
  const isCelebratingRef = useRef(false);

  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setRedeemed(false);
      celebrationCleanupRef.current?.();
      celebrationCleanupRef.current = null;
      isCelebratingRef.current = false;
    }
  }, [open]);

  const runRedeemCelebration = () => {
    if (isCelebratingRef.current) return;
    isCelebratingRef.current = true;

    celebrationCleanupRef.current?.();
    celebrationCleanupRef.current = playRedeemCelebration(
      {
        qrEl: qrRef.current,
        stampCardEl: stampCardRef.current,
        badgeEl: badgeRef.current,
      },
      () => {
        setRedeemed(true);
        isCelebratingRef.current = false;
      },
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-sideout-green/80 backdrop-blur-[2px]"
        aria-label="Close redeem dialog"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[92dvh] w-full max-w-[430px] overflow-y-auto overscroll-y-contain rounded-t-3xl bg-sideout-cream text-sideout-green shadow-[0_-8px_40px_rgba(2,51,47,0.35)] [-webkit-overflow-scrolling:touch] sm:mx-6 sm:max-h-[90dvh] sm:rounded-3xl sm:shadow-[0_16px_48px_rgba(2,51,47,0.4)]"
      >
        <div className="sticky top-0 z-20 bg-sideout-cream pt-3">
          <div
            className="mx-auto mb-3 h-1 w-10 rounded-full bg-sideout-green/20 sm:hidden"
            aria-hidden
          />
          <div className="flex justify-end px-4 pb-2">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sideout-green/10 text-sideout-green transition-colors hover:bg-sideout-green/15"
              aria-label="Close"
            >
              <span className="text-xl leading-none" aria-hidden>
                ×
              </span>
            </button>
          </div>
        </div>

        <div className="relative px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-8">
          <div
            ref={badgeRef}
            className={`mx-auto mb-4 flex w-fit items-center justify-center rounded-full bg-sideout-green px-6 py-2 shadow-md ${
              redeemed ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!redeemed}
          >
            <span className="text-sm font-bold uppercase tracking-[0.15em] text-sideout-gold">
              Redeemed
            </span>
          </div>

          <header className="space-y-3 text-center">
            <div className="space-y-2">
              <h2
                id={titleId}
                className="text-2xl font-bold uppercase leading-tight tracking-tight"
              >
                {redeemed ? "You're all set" : "Redeem at the counter"}
              </h2>
              <p className="text-xs leading-relaxed text-sideout-green/70">
                {redeemed
                  ? "Your card has been redeemed. Show this to the counter staff if needed."
                  : "Show this QR code to the counter to redeem your completed card."}
              </p>
            </div>
          </header>

          <div
            ref={qrRef}
            className={`mt-6 flex justify-center rounded-2xl bg-sideout-green p-6 transition-opacity ${
              redeemed ? "opacity-40" : "opacity-100"
            }`}
          >
            <div className="rounded-lg bg-sideout-cream p-3 shadow-inner">
              <MockQrCode
                value={MOCK_REDEEM_QR_VALUE}
                size={300}
                label="QR code for redeeming loyalty card"
              />
            </div>
          </div>

          <div
            className="my-6 h-px bg-sideout-green/10"
            role="separator"
            aria-hidden
          />

          <section className="space-y-3">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-sideout-green/55">
              Your completed card
            </p>
            <div
              ref={stampCardRef}
              className="rounded-2xl border border-sideout-green/8 bg-sideout-cream p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] ring-1 ring-sideout-green/5"
            >
              <StampGrid filledCount={9} compact />
            </div>
          </section>

          {IS_DEV && !redeemed && (
            <button
              type="button"
              onClick={runRedeemCelebration}
              className="mt-4 w-full rounded-full border border-dashed border-sideout-gold/60 bg-sideout-green/5 py-2.5 text-[10px] font-bold uppercase tracking-wide text-sideout-green transition-colors hover:bg-sideout-green/10"
            >
              Dev — Simulate counter scan
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="mt-6 mb-2 w-full rounded-full bg-sideout-green py-3 text-sm font-bold uppercase tracking-wide text-sideout-gold transition-opacity hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
