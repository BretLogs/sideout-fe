import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  BARISTA_SESSION_COOKIE_NAME,
  getBaristaSessionFromToken,
} from "@/lib/barista/session";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(BARISTA_SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Not signed in. Please enter your PIN." },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const baristaSession = await getBaristaSessionFromToken(supabase, token);
    if (!baristaSession) {
      return NextResponse.json(
        { error: "Session expired. Please enter your PIN again." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, redeem } = body as {
      userId?: string;
      redeem?: boolean;
    };

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    const baristaId = baristaSession.baristaId;

    if (redeem) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, stamp_count")
        .eq("id", userId)
        .single();

      if (!profile || profile.stamp_count < 10) {
        return NextResponse.json(
          { error: "Not enough stamps to redeem" },
          { status: 400 }
        );
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ stamp_count: 0 })
        .eq("id", userId);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      const { error: txError } = await supabase.from("transactions").insert({
        user_id: userId,
        type: "reward_redeemed",
        barista_id: baristaId,
      });

      if (txError) {
        return NextResponse.json(
          { error: txError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Reward redeemed",
        stamp_count: 0,
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, stamp_count")
      .eq("id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newCount = Math.min((profile.stamp_count ?? 0) + 1, 10);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stamp_count: newCount })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    const { error: txError } = await supabase.from("transactions").insert({
      user_id: userId,
      type: "stamp_added",
      barista_id: baristaId,
    });

    if (txError) {
      return NextResponse.json(
        { error: txError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stamp_count: newCount,
      reward_available: newCount >= 10,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
