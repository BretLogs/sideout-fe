import Image from "next/image";
import { LoyaltyPerks } from "./LoyaltyPerks";

/** Tune overlay display size here (% width, vh height) */
const OVERLAY_WIDTH = "100%";
const OVERLAY_HEIGHT = "90vh";

/** Follows PNG alpha — shadows only the visible cup/hand, not the empty area */
const OVERLAY_DROP_SHADOW =
  "drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)] drop-shadow-[0_12px_36px_rgba(0,0,0,0.35)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]";

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

      {/* Overlay — centered horizontally; image centered in box */}
      <div
        className="pointer-events-none absolute top-0 z-30 mx-auto"
        style={{
          width: OVERLAY_WIDTH,
          height: OVERLAY_HEIGHT,
          left: 0,
          right: 0,
        }}
      >
        <Image
          src="/assets/images/sideout_bg_layover.png"
          alt=""
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className={`object-contain object-top ${OVERLAY_DROP_SHADOW}`}
          priority
        />
      </div>

      <LoyaltyPerks />
    </div>
  );
}
