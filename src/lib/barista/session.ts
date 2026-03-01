import type { SupabaseClient } from "@supabase/supabase-js";

export const BARISTA_SESSION_COOKIE_NAME = "sideout_barista_session";
const BARISTA_SESSION_MAX_AGE_SEC = 8 * 60 * 60; // 8 hours

export function getBaristaSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: BARISTA_SESSION_MAX_AGE_SEC,
  };
}

export async function getBaristaSessionFromToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ baristaId: string; baristaName: string } | null> {
  if (!token) return null;
  const { data: session } = await supabase
    .from("barista_sessions")
    .select("barista_id")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (!session?.barista_id) return null;
  const { data: barista } = await supabase
    .from("baristas")
    .select("id, name")
    .eq("id", session.barista_id)
    .single();
  if (!barista) return null;
  return { baristaId: barista.id, baristaName: barista.name ?? "Barista" };
}

export async function createBaristaSessionWithToken(
  supabase: SupabaseClient,
  baristaId: string,
  token: string
): Promise<void> {
  const expiresAt = new Date(
    Date.now() + BARISTA_SESSION_MAX_AGE_SEC * 1000
  ).toISOString();
  await supabase.from("barista_sessions").insert({
    barista_id: baristaId,
    token,
    expires_at: expiresAt,
  });
}

export async function deleteBaristaSessionByToken(
  supabase: SupabaseClient,
  token: string
): Promise<void> {
  await supabase.from("barista_sessions").delete().eq("token", token);
}
