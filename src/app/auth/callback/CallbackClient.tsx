"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CallbackClient({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const handleHash = async () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash) {
        // Magic link: Supabase stores session from hash when we call getSession
        await supabase.auth.getSession();
        router.replace(next);
        return;
      }
      router.replace(`/dashboard/login?error=auth`);
    };

    handleHash();
  }, [router, next]);

  return (
    <div className="min-h-screen bg-sideout-beige flex items-center justify-center text-sideout-green">
      <p className="text-sm">Signing you in…</p>
    </div>
  );
}
