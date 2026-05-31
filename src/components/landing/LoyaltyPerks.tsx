import { ContentColumn } from "@/components/layout/ContentColumn";

import { LOYALTY_BODY_COPY } from "./copy";
import { LoyaltyPerksCta } from "./LoyaltyPerksCta";

export function LoyaltyPerks() {
  return (
    <section
      id="loyalty-perks"
      className="relative -mt-[clamp(2.5rem,6vw,5rem)] w-full bg-sideout-green pb-16 pt-2 text-center text-sideout-cream md:-mt-[clamp(3rem,5vw,4.5rem)] lg:-mt-[clamp(3.5rem,4vw,5.5rem)]"
      aria-labelledby="loyalty-perks-heading"
    >
      <ContentColumn>
        <h1
          id="loyalty-perks-heading"
          data-landing="loyalty-heading"
          className="relative z-10 mb-6 text-5xl font-bold uppercase leading-tight tracking-tight md:mb-8 md:text-7xl lg:text-[clamp(3.5rem,8vw,7rem)]"
        >
          Loyalty perks
        </h1>
        <p
          data-landing="loyalty-body"
          className="relative z-10 text-sm leading-relaxed text-sideout-cream/90 md:text-base"
        >
          {LOYALTY_BODY_COPY}
        </p>
        <LoyaltyPerksCta />
      </ContentColumn>
    </section>
  );
}
