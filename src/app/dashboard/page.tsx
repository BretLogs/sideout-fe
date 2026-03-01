import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/server";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const supabase = await createClient();
  const [{ data: profile }, { data: cards }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, full_name, email, stamp_count")
      .eq("id", session.userId)
      .single(),
    supabase
      .from("loyalty_cards")
      .select("id, status, completed_at, redeemed_at")
      .eq("user_id", session.userId)
      .order("completed_at", { ascending: false }),
  ]);

  if (!profile) {
    redirect("/login?next=/dashboard");
  }

  return (
    <DashboardClient
      profile={{
        id: profile.id,
        username: profile.username ?? null,
        full_name: profile.full_name ?? null,
        email: profile.email ?? null,
        stamp_count: profile.stamp_count ?? 0,
      }}
      cards={(cards ?? []).map((c) => ({
        id: c.id,
        status: c.status as "completed" | "redeemed",
        completed_at: c.completed_at ?? "",
        redeemed_at: c.redeemed_at ?? null,
      }))}
    />
  );
}
