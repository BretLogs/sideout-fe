"use client";

import { useState } from "react";

// Show in dev: NODE_ENV from Next.js, or explicit NEXT_PUBLIC_DEV_TOOLS in .env
const isDev =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_DEV_TOOLS === "true";

export function DevStampButton() {
  const [loading, setLoading] = useState(false);

  if (!isDev) return null;

  async function addStamp() {
    setLoading(true);
    try {
      const res = await fetch("/api/dev/add-stamp", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        // Cache-bust so dashboard refetches from Supabase and shows new stamp
        window.location.href = `/dashboard?from=dev-stamp&_t=${Date.now()}`;
        return;
      }
      // API failed (e.g. demo profile missing, Supabase not set up)
      window.alert(`DEV: Add stamp failed. ${data.error || res.statusText}\n\nCheck Supabase .env and that you ran supabase-schema.sql (demo profile).`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1">
      <span className="rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
        DEV
      </span>
      <button
        type="button"
        onClick={addStamp}
        disabled={loading}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg hover:bg-amber-600 disabled:opacity-50"
        title="Add 1 stamp to demo profile, then open dashboard"
        aria-label="DEV: Add stamp"
      >
        {loading ? (
          <span className="text-lg">…</span>
        ) : (
          <span className="text-lg font-bold">+1</span>
        )}
      </button>
    </div>
  );
}
