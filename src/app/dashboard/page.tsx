import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/server";
import { DashboardClient } from "./DashboardClient";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ from?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, full_name, email, stamp_count")
    .eq("id", session.userId)
    .single();

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
      fromDevStamp={params.from === "dev-stamp"}
    />
  );
}
