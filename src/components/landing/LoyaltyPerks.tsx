import { LOYALTY_BODY_COPY } from "./copy";

export function LoyaltyPerks() {
  return (
    <section className="relative -mt-[4.5rem] bg-sideout-green px-6 pb-16 pt-2 text-center text-sideout-cream">
      {/* z-10 so overlay (z-30) covers roughly the top half of the heading */}
      <h1 className="relative z-10 mb-8 text-7xl font-bold uppercase tracking-tight leading-tight">
        LOYALTY PERKS
      </h1>
      {/* Body stays above the overlay */}
      <p className="relative z-40 text-[11px] leading-relaxed tracking-wide">
        {LOYALTY_BODY_COPY}
      </p>
      <button
        type="button"
        className="relative z-40 mt-8 rounded-full bg-sideout-cream px-10 py-2.5 text-sm font-medium uppercase tracking-wide text-sideout-green"
      >
        Rules
      </button>
    </section>
  );
}
