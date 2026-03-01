import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SESSION_COOKIE_NAME, getSessionCookieOptions, deleteSessionByToken } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    const supabase = await createClient();
    await deleteSessionByToken(supabase, token);
  }
  const response = NextResponse.redirect(new URL("/", request.url), { status: 302 });
  response.cookies.set(SESSION_COOKIE_NAME, "", { ...getSessionCookieOptions(), maxAge: 0 });
  return response;
}
