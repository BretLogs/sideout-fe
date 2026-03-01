import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE_NAME, getSessionFromToken } from "./session";

/** Use in Server Components / Route Handlers to get current user id or null. */
export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const supabase = await createClient();
  return getSessionFromToken(supabase, token);
}
