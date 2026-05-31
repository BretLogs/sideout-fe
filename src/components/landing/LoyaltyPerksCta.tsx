"use client";

import { useState } from "react";

import { outlinePillClassName } from "./ctaStyles";
import { LoyaltyRulesModal } from "./LoyaltyRulesModal";

export function LoyaltyPerksCta() {
  const [rulesOpen, setRulesOpen] = useState(false);

  return (
    <>
      <div className="relative z-10 mt-8" data-landing="loyalty-cta">
        <button
          type="button"
          onClick={() => setRulesOpen(true)}
          className={outlinePillClassName}
        >
          Rules
        </button>
      </div>
      <LoyaltyRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
    </>
  );
}
