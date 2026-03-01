import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { createClient } from "@/lib/supabase/server";
import {
  SESSION_COOKIE_NAME,
  getSessionCookieOptions,
  createSessionWithToken,
} from "@/lib/auth/session";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,30}$/;
const BCRYPT_ROUNDS = 10;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const usernameRaw = formData.get("username")?.toString();
    const emailRaw = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const redirectTo = (formData.get("next")?.toString()?.trim()) || "/dashboard";

    const normalized = usernameRaw?.trim().toLowerCase();
    const email = emailRaw?.trim() || null;

    if (!normalized || !password) {
      return NextResponse.redirect(
        new URL("/signup?error=invalid&next=" + encodeURIComponent(redirectTo), request.url),
        { status: 302 }
      );
    }
    if (!USERNAME_REGEX.test(normalized)) {
      return NextResponse.redirect(
        new URL("/signup?error=username&next=" + encodeURIComponent(redirectTo), request.url),
        { status: 302 }
      );
    }
    if (password.length < 6) {
      return NextResponse.redirect(
        new URL("/signup?error=password&next=" + encodeURIComponent(redirectTo), request.url),
        { status: 302 }
      );
    }

    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalized)
      .maybeSingle();
    if (existing) {
      return NextResponse.redirect(
        new URL("/signup?error=taken&next=" + encodeURIComponent(redirectTo), request.url),
        { status: 302 }
      );
    }
    if (email) {
      const { data: existingEmail } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existingEmail) {
        return NextResponse.redirect(
          new URL("/signup?error=email_taken&next=" + encodeURIComponent(redirectTo), request.url),
          { status: 302 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const id = crypto.randomUUID();
    const { error: insertError } = await supabase.from("profiles").insert({
      id,
      username: normalized,
      email,
      password_hash: passwordHash,
      stamp_count: 0,
      study_hub_credits: 0,
    });
    if (insertError) {
      return NextResponse.redirect(
        new URL("/signup?error=server&next=" + encodeURIComponent(redirectTo), request.url),
        { status: 302 }
      );
    }

    const token = randomBytes(32).toString("hex");
    await createSessionWithToken(supabase, id, token);

    const response = NextResponse.redirect(new URL(redirectTo, request.url), { status: 302 });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.redirect(new URL("/signup?error=server", request.url), { status: 302 });
  }
}
