import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, pin, redeem } = body as {
      userId?: string;
      pin?: string;
      redeem?: boolean;
    };

    const expectedPin = process.env.BARISTA_PIN;
    if (!expectedPin || pin !== expectedPin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
    }

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid userId" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

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
