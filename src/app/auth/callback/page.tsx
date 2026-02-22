import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CallbackClient } from "./CallbackClient";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ code?: string; next?: string }> };

export default async function AuthCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const code = params.code;
  const next = params.next ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
  }

  return <CallbackClient next={next} />;
}
