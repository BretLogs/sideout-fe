import { createClient } from "@/lib/supabase/server";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";

type Props = { searchParams: Promise<{ from?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const supabase = await createClient();

  let { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, stamp_count")
    .eq("id", DEMO_USER_ID)
    .single();

  if (!profile) {
    await supabase.from("profiles").upsert(
      {
        id: DEMO_USER_ID,
        full_name: "Demo",
        email: "demo@sideout.local",
        stamp_count: 0,
        study_hub_credits: 0,
      },
      { onConflict: "id" }
    );
    const res = await supabase
      .from("profiles")
      .select("id, full_name, email, stamp_count")
      .eq("id", DEMO_USER_ID)
      .single();
    profile = res.data;
  }

  return (
    <DashboardClient
      profile={
        profile
          ? {
              id: profile.id,
              full_name: profile.full_name ?? null,
              email: profile.email ?? null,
              stamp_count: profile.stamp_count ?? 0,
            }
          : null
      }
      fromDevStamp={params.from === "dev-stamp"}
    />
  );
}
