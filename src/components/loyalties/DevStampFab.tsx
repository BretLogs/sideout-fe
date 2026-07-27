"use client";

import { useRef, useState } from "react";

const POINTS_REQUIRED = 10;
const IS_DEV = process.env.NODE_ENV === "development";

type DevCounterScanFabProps = {
  filledCount: number;
  onStamp: () => Promise<void>;
};

/**
 * DEV-only control: emulates a mobile counter scan awarding one stamp
 * (no animation; backend bypasses business hours + daily limit).
 */
export function DevCounterScanFab({
  filledCount,
  onStamp,
}: DevCounterScanFabProps) {
  const [busy, setBusy] = useState(false);
  const inFlightRef = useRef(false);

  if (!IS_DEV) return null;

  const isFull = filledCount >= POINTS_REQUIRED;

  const handleClick = async () => {
    if (isFull || inFlightRef.current) return;
    inFlightRef.current = true;
    setBusy(true);
    try {
      await onStamp();
    } finally {
      inFlightRef.current = false;
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      disabled={isFull || busy}
      title={
        isFull
          ? "Card complete (dev)"
          : "Dev: emulate mobile counter scan"
      }
      className="fixed bottom-6 z-40 flex flex-col items-center gap-0.5 rounded-full bg-sideout-green px-3 py-2.5 shadow-[0_4px_20px_rgba(2,51,47,0.45)] ring-2 ring-sideout-gold/50 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 right-[max(1.25rem,calc((100vw-min(100vw,var(--app-max-width)))/2+1.25rem))]"
      aria-label="Dev: emulate mobile counter scan"
    >
      <span className="text-[9px] font-bold uppercase tracking-wider text-sideout-gold">
        Dev
      </span>
      <span className="text-[10px] font-bold uppercase leading-none tracking-wide text-sideout-cream">
        {busy ? "…" : "Scan QR"}
      </span>
    </button>
  );
}
