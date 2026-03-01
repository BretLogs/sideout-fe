import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BARISTA_SESSION_COOKIE_NAME,
  getBaristaSessionCookieOptions,
  deleteBaristaSessionByToken,
} from "@/lib/barista/session";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(BARISTA_SESSION_COOKIE_NAME)?.value;
  if (token) {
    const supabase = await createClient();
    await deleteBaristaSessionByToken(supabase, token);
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(BARISTA_SESSION_COOKIE_NAME, "", {
    ...getBaristaSessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
