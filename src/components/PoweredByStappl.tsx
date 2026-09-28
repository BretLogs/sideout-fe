"use client";

import { useAuth } from "@/contexts/AuthContext";
import { recordStapplClick, STAPPL_URL } from "@/lib/api/events";

type PoweredByStapplProps = {
  className?: string;
};

export function PoweredByStappl({ className = "" }: PoweredByStapplProps) {
  const { getIdToken } = useAuth();

  function handleClick() {
    const path = window.location.pathname || "/";
    void getIdToken()
      .catch(() => null)
      .then((token) => recordStapplClick(path, token));
  }

  return (
    <p
      className={`text-center text-[10px] text-sideout-cream/60 ${className}`.trim()}
    >
      Powered by{" "}
      <a
        href={STAPPL_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="underline underline-offset-2 transition-opacity hover:opacity-90"
      >
        Stappl Inc.
      </a>
    </p>
  );
}
