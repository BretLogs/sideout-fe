import Image from "next/image";
import { LoyaltyPerks } from "./LoyaltyPerks";

/** Tune overlay display size here (% width, vh height) */
const OVERLAY_WIDTH = "100%";
const OVERLAY_HEIGHT = "90vh";

/** Applied to wrapper so shadow follows PNG alpha, not a white box */
const OVERLAY_SHADOW_FILTER =
  "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.35)) drop-shadow(0 10px 28px rgba(0, 0, 0, 0.45)) drop-shadow(0 18px 48px rgba(0, 0, 0, 0.4))";

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

      {/* Overlay — blend removes white PNG fringe on green; shadow on wrapper follows alpha */}
      <div
        className="pointer-events-none absolute top-0 z-30 mx-auto"
        style={{
          width: OVERLAY_WIDTH,
          height: OVERLAY_HEIGHT,
          left: 0,
          right: 0,
        }}
      >
        <div
          className="relative h-full w-full"
          style={{ filter: OVERLAY_SHADOW_FILTER }}
        >
          <Image
            src="/assets/images/sideout_bg_layover.png"
            alt=""
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            className="block object-contain object-top mix-blend-darken bg-transparent"
            priority
          />
        </div>
      </div>

      <LoyaltyPerks />
    </div>
  );
}
