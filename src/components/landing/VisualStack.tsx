import { LoyaltyPerks } from "./LoyaltyPerks";

/** Tune overlay display size here (% width, vh height) */
const OVERLAY_WIDTH = "100%";
const OVERLAY_HEIGHT = "90vh";

const LAYOVER_SRC = "/assets/images/sideout_bg_layover.png";

/**
 * Native img (not next/image) so the optimizer never flattens alpha to a white matte.
 * darken on #02332f knocks out near-white fringe without tinting the subject green.
 */
const OVERLAY_IMG_CLASS =
  "pointer-events-none absolute inset-0 h-full w-full object-contain object-top mix-blend-darken";

export function VisualStack() {
  return (
    <div className="relative flex w-full flex-col items-center bg-sideout-green">
      {/* Section 2 — background, centered */}
      <div className="relative z-0 h-[54vh] w-full overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/assets/images/sideout_bg.png)",
            backgroundSize: "100%",
            backgroundPosition: "center top",
          }}
        />
      </div>

      {/* Overlay — no wrapper filter; asset defringed; multiply blends on green */}
      <div
        className="pointer-events-none absolute top-0 z-30 mx-auto isolate"
        style={{
          width: OVERLAY_WIDTH,
          height: OVERLAY_HEIGHT,
          left: 0,
          right: 0,
        }}
      >
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
      </div>

      <LoyaltyPerks />
    </div>
  );
}
