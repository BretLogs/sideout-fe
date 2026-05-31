"use client";

import { useEffect, useId, useRef } from "react";

import { LOYALTY_RULES_ITEMS } from "./copy";

type LoyaltyRulesModalProps = {
  open: boolean;
  onClose: () => void;
};

export function LoyaltyRulesModal({ open, onClose }: LoyaltyRulesModalProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-sideout-green/70"
        aria-label="Close rules"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 max-h-[85dvh] w-full max-w-content overflow-y-auto rounded-t-3xl bg-sideout-cream px-6 py-8 text-sideout-green shadow-[0_-8px_40px_rgba(2,51,47,0.35)] sm:mx-6 sm:rounded-3xl sm:shadow-[0_16px_48px_rgba(2,51,47,0.4)]"
      >
        <h2
          id={titleId}
          className="mb-4 text-xl font-bold uppercase tracking-tight"
        >
          Loyalty rules
        </h2>
        <ul className="space-y-3 text-left text-sm leading-relaxed">
          {LOYALTY_RULES_ITEMS.map((rule) => (
            <li key={rule} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sideout-green" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-sideout-green py-3 text-sm font-bold uppercase tracking-wide text-sideout-gold transition-opacity hover:opacity-90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
