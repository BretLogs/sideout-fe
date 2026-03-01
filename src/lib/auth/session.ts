import type { SupabaseClient } from "@supabase/supabase-js";

export const SESSION_COOKIE_NAME = "sideout_session";
// Long-lived so the user stays logged in until they click "Sign out" (no auto-logout)
const SESSION_MAX_AGE_SEC = 10 * 365 * 24 * 60 * 60; // 10 years

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export async function getSessionFromToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ userId: string } | null> {
  if (!token) return null;
  const { data } = await supabase
    .from("sessions")
    .select("user_id")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!data?.user_id) return null;
  return { userId: data.user_id };
}

/** Call from API route only (pass token from crypto.randomBytes). */
export async function createSessionWithToken(
  supabase: SupabaseClient,
  userId: string,
  token: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SEC * 1000).toISOString();
  await supabase.from("sessions").insert({
    user_id: userId,
    token,
    expires_at: expiresAt,
  });
}

export async function deleteSessionByToken(
  supabase: SupabaseClient,
  token: string
): Promise<void> {
  await supabase.from("sessions").delete().eq("token", token);
}
