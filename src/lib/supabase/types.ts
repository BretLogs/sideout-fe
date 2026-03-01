export type TransactionType = "stamp_added" | "reward_redeemed";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  password_hash?: string | null;
  stamp_count: number;
  study_hub_credits: number;
  created_at?: string;
  updated_at?: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  barista_id?: string | null;
  created_at: string;
}

export interface Barista {
  id: string;
  name: string;
  pin: string;
}

export interface BaristaSession {
  id: string;
  barista_id: string;
  token: string;
  expires_at: string;
}
