import { NextResponse, type NextRequest } from "next/server";
import { createEdgeClient } from "@/lib/supabase/edge";
import { SESSION_COOKIE_NAME, getSessionCookieOptions, getSessionFromToken } from "@/lib/auth/session";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const supabase = createEdgeClient();
    const session = await getSessionFromToken(supabase, token);
    if (!session) {
      response.cookies.set(SESSION_COOKIE_NAME, "", { ...getSessionCookieOptions(), maxAge: 0 });
    }
  }

  return response;
}
