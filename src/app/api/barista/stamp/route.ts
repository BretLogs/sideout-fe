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

      if (!profile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const { data: cardToRedeem } = await supabase
        .from("loyalty_cards")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const now = new Date().toISOString();
      let shouldResetStampCount = false;

      if (cardToRedeem) {
        // Redeeming a card from history: only mark the card redeemed, do not reset current stamp count
        await supabase
          .from("loyalty_cards")
          .update({ status: "redeemed", redeemed_at: now })
          .eq("id", cardToRedeem.id);
      } else if ((profile.stamp_count ?? 0) >= 10) {
        // Redeeming the current full card (no completed row yet): create redeemed card and reset count
        await supabase.from("loyalty_cards").insert({
          user_id: userId,
          status: "redeemed",
          completed_at: now,
          redeemed_at: now,
        });
        shouldResetStampCount = true;
      } else {
        return NextResponse.json(
          { error: "No completed card to redeem" },
          { status: 400 }
        );
      }

      if (shouldResetStampCount) {
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

      const currentStampCount = shouldResetStampCount ? 0 : (profile.stamp_count ?? 0);
      return NextResponse.json({
        success: true,
        message: "Reward redeemed",
        stamp_count: currentStampCount,
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, stamp_count, username, full_name, email")
      .eq("id", userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const customerName =
      profile.username
        ? `@${profile.username}`
        : (profile.full_name ?? profile.email ?? "Customer");

    const current = profile.stamp_count ?? 0;

    if (current >= 10) {
      const { data: existingCompleted } = await supabase
        .from("loyalty_cards")
        .select("id")
        .eq("user_id", userId)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!existingCompleted) {
        await supabase.from("loyalty_cards").insert({
          user_id: userId,
          status: "completed",
          completed_at: new Date().toISOString(),
        });
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
        stamp_count: 0,
        reward_available: false,
        customer_name: customerName,
      });
    }

    const newCount = Math.min(current + 1, 10);
    const clearAfterTen = newCount === 10;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stamp_count: clearAfterTen ? 0 : newCount })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    if (newCount === 10) {
      await supabase.from("loyalty_cards").insert({
        user_id: userId,
        status: "completed",
        completed_at: new Date().toISOString(),
      });
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
      stamp_count: clearAfterTen ? 0 : newCount,
      reward_available: false,
      customer_name: customerName,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
