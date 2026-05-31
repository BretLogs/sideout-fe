import { LoyaltyPerks } from "./LoyaltyPerks";

const BG_SRC = "/assets/images/sideout_bg.png";
const LAYOVER_SRC = "/assets/images/sideout_bg_layover.png";

/**
 * Native img (not next/image) so the optimizer never flattens alpha to a white matte.
 * Both layers use width-locked scaling (w-full h-auto) so the layover stays
 * pixel-aligned with the background at the 430px mobile shell width.
 */
const LAYER_IMG_CLASS =
  "pointer-events-none absolute left-0 top-0 w-full h-auto max-w-full origin-top";

const OVERLAY_IMG_CLASS = `${LAYER_IMG_CLASS} z-50 visual-stack-overlay`;

export function VisualStack() {
  return (
    <div
      className="relative w-full overflow-visible bg-sideout-green"
      data-landing="visual-stack"
    >
      {/* Background band — clipped; same width scale as layover */}
      <div
        className="relative z-0 h-[54vh] w-full overflow-hidden"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BG_SRC}
          alt=""
          className={LAYER_IMG_CLASS}
          decoding="async"
        />
      </div>

      {/* Layover — sibling, unclipped, bridges into Loyalty Perks */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LAYOVER_SRC}
        alt=""
        className={OVERLAY_IMG_CLASS}
        style={{
          filter:
            "drop-shadow(0 4px 12px rgba(0,0,0,0.35)) drop-shadow(0 10px 28px rgba(0,0,0,0.45))",
        }}
        decoding="async"
        fetchPriority="high"
      />

      <LoyaltyPerks />
    </div>
  );
}
