import { apiRequest } from "@/lib/api/client";

export type LoyaltyCard = {
  id: string;
  pointCount: number;
  pointsRequired: number;
  state: "in_progress" | "completed" | "redeemed";
  redeemEligibleAt: string | null;
};

export type LoyaltyResponse = {
  counter_token: string;
  display_name: string | null;
  active_card: LoyaltyCard;
  card_history: Array<{
    id: string;
    pointCount: number;
    state: string;
    completedAt: string | null;
    redeemedAt: string | null;
  }>;
  earn_status: {
    pointsEarnedThisPeriod: number;
    maxPointsPerPeriod: number;
    limitReached: boolean;
    message: string | null;
  };
};

export type RedeemTokenResponse = {
  token: string;
  can_redeem_now: boolean;
  redeem_eligible_at: string;
  message: string | null;
};

export async function getLoyalty(): Promise<LoyaltyResponse> {
  const displayName =
    process.env.NEXT_PUBLIC_DEV_DISPLAY_NAME ?? "devuser";
  return apiRequest<LoyaltyResponse>(
    `/me/loyalty?displayName=${encodeURIComponent(displayName)}`,
  );
}

export async function createRedeemToken(
  loyaltyCardId: string,
): Promise<RedeemTokenResponse> {
  return apiRequest<RedeemTokenResponse>("/me/loyalty/redeem-tokens", {
    method: "POST",
    body: { loyalty_card_id: loyaltyCardId },
  });
}
