"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  awardDevStamp,
  createRedeemToken,
  getLoyalty,
  type LoyaltyResponse,
} from "@/lib/api/loyalty";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLoyaltyPolling } from "@/hooks/useLoyaltyPolling";
import { CardHistoryItem } from "./CardHistoryItem";
import { DevCounterScanFab } from "./DevStampFab";
import { MockQrCode } from "./MockQrCode";
import { RedeemModal } from "./RedeemModal";
import { StampGrid } from "./StampGrid";

const IS_DEV = process.env.NODE_ENV === "development";
const UI_STAMP_SLOTS = 9;

function isoToDisplayDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

export function LoyaltiesView() {
  const { getIdToken } = useAuth();
  const [loyalty, setLoyalty] = useState<LoyaltyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [redeemToken, setRedeemToken] = useState<string | null>(null);
  const [redeemMessage, setRedeemMessage] = useState<string | null>(null);
  const [canRedeemNow, setCanRedeemNow] = useState(true);
  const [hoveringSlot, setHoveringSlot] = useState<number | null>(null);
  const loyaltySnapshotRef = useRef<{ cardId: string; pointCount: number } | null>(
    null,
  );

  const applyLoyaltyUpdate = useCallback(
    (data: LoyaltyResponse, options?: { detectNewStamp?: boolean }) => {
      const prev = loyaltySnapshotRef.current;
      if (
        options?.detectNewStamp &&
        prev &&
        prev.cardId === data.active_card.id &&
        data.active_card.pointCount > prev.pointCount
      ) {
        setHoveringSlot(
          Math.min(data.active_card.pointCount, UI_STAMP_SLOTS),
        );
      }

      loyaltySnapshotRef.current = {
        cardId: data.active_card.id,
        pointCount: data.active_card.pointCount,
      };
      setLoyalty(data);
    },
    [],
  );

  const loadLoyalty = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setLoading(true);
        setError(null);
      }

      try {
        const token = await getIdToken();
        if (!token) {
          if (!options?.silent) {
            setError("Please sign in to view your loyalty card.");
          }
          return;
        }
        const data = await getLoyalty(token);
        applyLoyaltyUpdate(data, { detectNewStamp: options?.silent });
      } catch (err) {
        if (!options?.silent) {
          setError(
            err instanceof ApiError
              ? err.message
              : "We're under maintenance. We'll get you back online soon.",
          );
        }
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [applyLoyaltyUpdate, getIdToken],
  );

  const pollLoyalty = useCallback(
    () => loadLoyalty({ silent: true }),
    [loadLoyalty],
  );

  useEffect(() => {
    void loadLoyalty();
  }, [loadLoyalty]);

  useLoyaltyPolling(!loading && !error && loyalty !== null, pollLoyalty);

  const filledCount = loyalty?.active_card.pointCount ?? 0;
  const handle = loyalty?.username ?? loyalty?.display_name ?? "guest";
  const counterToken = loyalty?.counter_token ?? "";

  const handleRedeem = async (loyaltyCardId: string) => {
    try {
      const token = await getIdToken();
      if (!token) return;
      const result = await createRedeemToken(loyaltyCardId, token);
      setRedeemToken(result.token);
      setRedeemMessage(result.message);
      setCanRedeemNow(result.can_redeem_now);
      setRedeemOpen(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not create redeem QR.",
      );
    }
  };

  const handleDevStamp = async () => {
    try {
      const token = await getIdToken();
      if (!token) return;
      const result = await awardDevStamp(token);
      if (!result.success) {
        setError(result.message ?? "Dev stamp failed.");
        return;
      }
      await loadLoyalty({ silent: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Dev stamp failed.",
      );
    }
  };

  if (loading) {
    return (
      <p className="text-center text-sm text-sideout-cream/80">
        Loading your loyalty card…
      </p>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-sideout-cream/90">{error}</p>
        <button
          type="button"
          onClick={() => void loadLoyalty()}
          className="rounded-full bg-sideout-cream px-6 py-2 text-sm font-medium text-sideout-green"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!loyalty) return null;

  const activeCompleted =
    loyalty.active_card.state === "completed" &&
    loyalty.active_card.pointCount >= 10;

  return (
    <>
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col gap-8">
          <section className="space-y-2 text-center">
            <h1 className="text-4xl font-medium uppercase tracking-tight">
              Show at the counter
            </h1>
            <p className="text-sm text-sideout-cream/80">
              Show this QR code to the counter after your purchase to get your
              stamp
            </p>
            {loyalty.earn_status.limitReached && loyalty.earn_status.message ? (
              <p className="text-xs text-sideout-gold">
                {loyalty.earn_status.message}
              </p>
            ) : null}

            <div className="mt-6 flex justify-center rounded-2xl bg-sideout-cream p-6">
              <MockQrCode
                value={counterToken}
                label="QR code for counter stamp"
              />
            </div>
          </section>

          <section className="space-y-4 text-center">
            <div className="space-y-1">
              <h2 className="text-lg font-medium uppercase tracking-tight">
                Loyalty card
              </h2>
              <p className="text-sm text-sideout-cream/80">@{handle}</p>
            </div>

            <div className="rounded-2xl bg-sideout-cream p-4 text-sideout-green">
              <StampGrid
                filledCount={filledCount}
                hoveringSlot={hoveringSlot}
              />
            </div>

            {activeCompleted ? (
              <div className="space-y-2">
                {loyalty.active_card.redeemStatus &&
                !loyalty.active_card.redeemStatus.canRedeemNow ? (
                  <p className="text-xs leading-relaxed text-sideout-gold">
                    {loyalty.active_card.redeemStatus.customerMessage}
                  </p>
                ) : loyalty.active_card.redeemStatus?.canRedeemNow ? (
                  <p className="text-xs leading-relaxed text-sideout-cream/80">
                    {loyalty.active_card.redeemStatus.customerMessage}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleRedeem(loyalty.active_card.id)}
                  className="w-full rounded-full bg-sideout-gold px-6 py-3 text-sm font-bold uppercase tracking-wide text-sideout-green"
                >
                  Redeem completed card
                </button>
              </div>
            ) : null}

            <p className="text-[11px] uppercase leading-relaxed tracking-wide text-sideout-cream/90">
              Get a stamp with every drink.
              <br />
              Completed cards will go directly to your card history.
            </p>
          </section>
        </div>

        <section className="space-y-4">
          <h2 className="text-left text-xl font-medium uppercase tracking-tight">
            Card history
          </h2>

          {loyalty.card_history.length === 0 ? (
            <p className="text-sm text-sideout-cream/70">No completed cards yet.</p>
          ) : (
            loyalty.card_history.map((card) => (
              <CardHistoryItem
                key={card.id}
                completedDate={
                  isoToDisplayDate(card.completedAt) ?? "—"
                }
                redeemedDate={isoToDisplayDate(card.redeemedAt)}
                onRedeem={
                  card.state === "completed"
                    ? () => void handleRedeem(card.id)
                    : undefined
                }
              />
            ))
          )}
        </section>
      </div>

      <RedeemModal
        open={redeemOpen}
        onClose={() => {
          setRedeemOpen(false);
          void loadLoyalty();
        }}
        redeemToken={redeemToken}
        redeemMessage={redeemMessage}
        canRedeemNow={canRedeemNow}
      />

      {IS_DEV ? (
        <DevCounterScanFab
          filledCount={filledCount}
          onStamp={handleDevStamp}
        />
      ) : null}
    </>
  );
}
