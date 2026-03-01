import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import {
  BARISTA_SESSION_COOKIE_NAME,
  getBaristaSessionCookieOptions,
  createBaristaSessionWithToken,
} from "@/lib/barista/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body as { pin?: string };

    const raw = typeof pin === "string" ? pin.replace(/\D/g, "") : "";
    if (raw.length !== 6) {
      return NextResponse.json(
        { valid: false, error: "Enter 6 digits" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: barista } = await supabase
      .from("baristas")
      .select("id, name")
      .eq("pin", raw)
      .maybeSingle();

    if (!barista) {
      return NextResponse.json({ valid: false, error: "Wrong PIN" });
    }

    const token = randomBytes(32).toString("hex");
    await createBaristaSessionWithToken(supabase, barista.id, token);

    const response = NextResponse.json({
      valid: true,
      barista: { id: barista.id, name: barista.name ?? "Barista" },
    });
    response.cookies.set(
      BARISTA_SESSION_COOKIE_NAME,
      token,
      getBaristaSessionCookieOptions()
    );
    return response;
  } catch {
    return NextResponse.json(
      { valid: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
