"use client";

import { useRef } from "react";
import { animateQrScanToStamp } from "./stampAnimation";
import type { StampGridHandle } from "./StampGrid";

const MAX_STAMPS = 9;
const IS_DEV = process.env.NODE_ENV === "development";

type DevCounterScanFabProps = {
  filledCount: number;
  counterQrRef: React.RefObject<HTMLElement | null>;
  stampGridRef: React.RefObject<StampGridHandle | null>;
  onStampAdded: (slot: number) => void;
};

/**
 * DEV-only control: simulates the counter scanning the user’s QR,
 * then awards the next stamp on the loyalty card.
 */
export function DevCounterScanFab({
  filledCount,
  counterQrRef,
  stampGridRef,
  onStampAdded,
}: DevCounterScanFabProps) {
  const isAnimatingRef = useRef(false);

  if (!IS_DEV) return null;

  const isFull = filledCount >= MAX_STAMPS;

  const handleClick = async () => {
    if (isFull || isAnimatingRef.current) return;

    const targetSlot = filledCount + 1;
    if (targetSlot > MAX_STAMPS) return;

    const qrEl = counterQrRef.current;
    const slotEl = stampGridRef.current?.getSlotElement(targetSlot);
    if (!qrEl || !slotEl) return;

    isAnimatingRef.current = true;

    animateQrScanToStamp(qrEl, slotEl, () => {
      onStampAdded(targetSlot);
      isAnimatingRef.current = false;
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isFull}
      title={
        isFull
          ? "All stamp slots filled (dev)"
          : "Dev: simulate counter scanning your QR"
      }
      className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-0.5 rounded-full bg-sideout-green px-3 py-2.5 shadow-[0_4px_20px_rgba(2,51,47,0.45)] ring-2 ring-sideout-gold/50 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:right-[max(1.25rem,calc(50%-215px+1.25rem))]"
      aria-label="Dev: simulate counter QR scan"
    >
      <span className="text-[9px] font-bold uppercase tracking-wider text-sideout-gold">
        Dev
      </span>
      <span className="text-[10px] font-bold uppercase leading-none tracking-wide text-sideout-cream">
        Scan QR
      </span>
    </button>
  );
}
