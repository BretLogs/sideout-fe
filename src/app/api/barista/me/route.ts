import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { BARISTA_SESSION_COOKIE_NAME, getBaristaSessionFromToken } from "@/lib/barista/session";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(BARISTA_SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ barista: null }, { status: 401 });
    }
    const supabase = await createClient();
    const session = await getBaristaSessionFromToken(supabase, token);
    if (!session) {
      return NextResponse.json({ barista: null }, { status: 401 });
    }
    return NextResponse.json({
      barista: { id: session.baristaId, name: session.baristaName },
    });
  } catch {
    return NextResponse.json({ barista: null }, { status: 500 });
  }
}
