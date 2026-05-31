const FILLER_SRC = "/assets/images/sideout_bg_filler.png";

/**
 * PNG has empty padding below the artwork; nudge down so the drawing
 * sits on the viewport bottom. Width-locked to match the 430px app shell.
 */
const FILLER_Y_OFFSET = "15%";

export function BottomFillerBackground() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 left-1/2 z-0 w-full max-w-app -translate-x-1/2 overflow-hidden"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FILLER_SRC}
        alt=""
        className="w-full h-auto max-w-full origin-bottom mix-blend-screen opacity-50"
        style={{ transform: `translateY(${FILLER_Y_OFFSET})` }}
        decoding="async"
      />
    </div>
  );
}
