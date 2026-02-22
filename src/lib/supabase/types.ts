export type TransactionType = "stamp_added" | "reward_redeemed";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  stamp_count: number;
  study_hub_credits: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  created_at: string;
}
