import { apiRequest } from "@/lib/api/client";

export type LoyaltyCard = {
  id: string;
  pointCount: number;
  pointsRequired: number;
  state: "in_progress" | "completed" | "redeemed";
  redeemEligibleAt: string | null;
  redeemStatus?: {
    canRedeemNow: boolean;
    redeemEligibleAt: string;
    customerMessage: string;
  } | null;
};

export type LoyaltyResponse = {
  counter_token: string;
  username: string | null;
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

export async function getLoyalty(token: string): Promise<LoyaltyResponse> {
  return apiRequest<LoyaltyResponse>("/me/loyalty", { token });
}

export async function createRedeemToken(
  loyaltyCardId: string,
  token: string,
): Promise<RedeemTokenResponse> {
  return apiRequest<RedeemTokenResponse>("/me/loyalty/redeem-tokens", {
    method: "POST",
    body: { loyalty_card_id: loyaltyCardId },
    token,
  });
}

export type DevStampResponse = {
  success: boolean;
  message: string | null;
  point_count: number | null;
  rejection_code: string | null;
};

/** DEV-only: emulate a mobile counter scan (bypasses hours + daily limit). */
export async function awardDevStamp(token: string): Promise<DevStampResponse> {
  return apiRequest<DevStampResponse>("/me/loyalty/dev-stamp", {
    method: "POST",
    token,
  });
}
