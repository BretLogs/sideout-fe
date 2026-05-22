"use client";

import { useRef, useState } from "react";
import {
  MOCK_CARD_HISTORY,
  MOCK_COUNTER_QR_VALUE,
  MOCK_STAMP_PROGRESS,
  MOCK_USER,
} from "@/lib/loyalties/mockData";
import { CardHistoryItem } from "./CardHistoryItem";
import { DevCounterScanFab } from "./DevStampFab";
import { MockQrCode } from "./MockQrCode";
import { RedeemModal } from "./RedeemModal";
import { StampGrid, type StampGridHandle } from "./StampGrid";

function formatToday(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  return `${month}-${day}-${year}`;
}

export function LoyaltiesView() {
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemedDate, setRedeemedDate] = useState<string | null>(
    MOCK_CARD_HISTORY.redeemedDate,
  );
  const [filledCount, setFilledCount] = useState(
    MOCK_STAMP_PROGRESS.filledCount,
  );
  const [hoveringSlot, setHoveringSlot] = useState<number | null>(null);
  const stampGridRef = useRef<StampGridHandle>(null);
  const counterQrRef = useRef<HTMLDivElement>(null);

  const handleRedeem = () => {
    setRedeemedDate(formatToday());
    setRedeemOpen(true);
  };

  const handleDevStampAdded = (slot: number) => {
    setFilledCount(slot);
    setHoveringSlot(slot);
  };

  return (
    <>
      <div className="flex flex-col gap-8 pb-12">
        <section className="space-y-2 text-center">
          <h1 className="text-4xl font-medium uppercase tracking-tight">
            Show at the counter
          </h1>
          <p className="text-sm text-sideout-cream/80">
            Show this QR code to the counter after your purchase to get your
            stamp
          </p>
        </section>

        <div
          ref={counterQrRef}
          className="flex justify-center rounded-2xl bg-sideout-cream p-6"
        >
          <MockQrCode
            value={MOCK_COUNTER_QR_VALUE}
            label="QR code for counter stamp"
          />
        </div>

        <section className="space-y-4 text-center">
          <div className="space-y-1">
            <h2 className="text-left text-lg font-medium uppercase tracking-tight">
              Loyalty card
            </h2>
            <p className="text-left text-sm text-sideout-cream/80">
              @{MOCK_USER.displayName}
            </p>
          </div>

          <div className="rounded-2xl bg-sideout-cream p-4 text-sideout-green">
            <StampGrid
              ref={stampGridRef}
              filledCount={filledCount}
              hoveringSlot={hoveringSlot}
            />
          </div>

          <p className="text-[11px] uppercase leading-relaxed tracking-wide text-sideout-cream/90">
            Get a stamp with every drink.
            <br />
            Completed cards will go directly to your card history.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-left text-xl font-medium uppercase tracking-tight">
            Card history
          </h2>

          <CardHistoryItem
            completedDate={MOCK_CARD_HISTORY.completedDate}
            redeemedDate={redeemedDate}
            onRedeem={handleRedeem}
          />
        </section>
      </div>

      <RedeemModal open={redeemOpen} onClose={() => setRedeemOpen(false)} />

      <DevCounterScanFab
        filledCount={filledCount}
        counterQrRef={counterQrRef}
        stampGridRef={stampGridRef}
        onStampAdded={handleDevStampAdded}
      />
    </>
  );
}
