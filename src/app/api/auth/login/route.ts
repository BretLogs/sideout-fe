import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { createClient } from "@/lib/supabase/server";
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
  createSessionWithToken,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const usernameOrEmailRaw = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const redirectTo = (formData.get("next")?.toString()?.trim()) || "/dashboard";

    const value = usernameOrEmailRaw?.trim();
    if (!value || !password) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "invalid");
      loginUrl.searchParams.set("next", redirectTo);
      return NextResponse.redirect(loginUrl, { status: 302 });
    }

    const supabase = await createClient();
    const isEmail = value.includes("@");
    const { data: profile } = isEmail
      ? await supabase
          .from("profiles")
          .select("id, password_hash")
          .eq("email", value)
          .maybeSingle()
      : await supabase
          .from("profiles")
          .select("id, password_hash")
          .eq("username", value.toLowerCase())
          .maybeSingle();

    if (!profile?.password_hash) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "invalid");
      loginUrl.searchParams.set("next", redirectTo);
      return NextResponse.redirect(loginUrl, { status: 302 });
    }

    const valid = await bcrypt.compare(password, profile.password_hash);
    if (!valid) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "invalid");
      loginUrl.searchParams.set("next", redirectTo);
      return NextResponse.redirect(loginUrl, { status: 302 });
    }

    const token = randomBytes(32).toString("hex");
    await createSessionWithToken(supabase, profile.id, token);

    const response = NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("error", "server");
    return NextResponse.redirect(loginUrl, { status: 302 });
  }
}
