import { LoyaltyPerks } from "./LoyaltyPerks";

const BG_SRC = "/assets/images/sideout_bg.png";
const LAYOVER_SRC = "/assets/images/sideout_bg_layover.png";

/** Native bg asset dimensions */
const BG_WIDTH = 3200;
const BG_HEIGHT = 4019;

/**
 * Native img (not next/image) so the optimizer never flattens alpha to a white matte.
 * Width-locked (w-full h-auto) so the layover scales with the shell up to iPad Pro width.
 */
const OVERLAY_IMG_CLASS =
  "pointer-events-none absolute left-0 top-0 z-50 w-full h-auto max-w-full origin-top visual-stack-overlay";

export function VisualStack() {
  return (
    <div
      className="relative w-full overflow-visible bg-sideout-green"
      data-landing="visual-stack"
    >
      {/* Background band — clipped to mobile viewport height */}
      <div
        className="relative z-0 h-[54vh] w-full overflow-hidden"
        aria-hidden
      >
        <div
          data-landing="visual-bg-inner"
          className="absolute inset-x-0 top-0 h-[120%] w-full bg-top bg-no-repeat will-change-transform"
          style={{
            backgroundImage: `url(${BG_SRC})`,
            backgroundSize: "100% auto",
            aspectRatio: `${BG_WIDTH} / ${BG_HEIGHT}`,
          }}
        />
      </div>

      {/* Layover — same width scale as bg */}
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
