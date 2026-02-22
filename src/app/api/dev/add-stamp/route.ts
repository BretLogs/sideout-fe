import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, stamp_count")
    .eq("id", DEMO_USER_ID)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Demo profile not found" }, { status: 404 });
  }

  const newCount = Math.min((profile.stamp_count ?? 0) + 1, 10);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ stamp_count: newCount })
    .eq("id", DEMO_USER_ID);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await supabase.from("transactions").insert({
    user_id: DEMO_USER_ID,
    type: "stamp_added",
  });

  return NextResponse.json({ stamp_count: newCount });
}
