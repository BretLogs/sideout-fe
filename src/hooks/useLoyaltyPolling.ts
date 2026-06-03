"use client";

import { useEffect } from "react";

/** How often to check for new stamps while the loyalty page is open. */
export const LOYALTY_POLL_INTERVAL_MS = 6_000;

/**
 * Polls loyalty data while the tab is visible. Pauses when the user switches
 * away, then checks once when they return.
 */
export function useLoyaltyPolling(
  enabled: boolean,
  poll: () => void | Promise<void>,
) {
  useEffect(() => {
    if (!enabled) return;

    const tick = () => {
      if (document.visibilityState === "visible") {
        void poll();
      }
    };

    const intervalId = window.setInterval(tick, LOYALTY_POLL_INTERVAL_MS);
    document.addEventListener("visibilitychange", tick);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [enabled, poll]);
}
