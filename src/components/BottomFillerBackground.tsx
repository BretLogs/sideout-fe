const FILLER_SRC = "/assets/images/sideout_bg_filler.png";

/**
 * PNG has empty black padding below the artwork; shift down so the drawing
 * sits on the viewport bottom and the matte is clipped off-screen.
 */
const FILLER_Y_OFFSET = "15%";

export function BottomFillerBackground() {
  return (
    <div
      className="pointer-events-none fixed bottom-0 left-1/2 z-0 h-[55vh] max-h-[520px] w-full max-w-app -translate-x-1/2 overflow-hidden md:h-[45vh] lg:h-[38vh]"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={FILLER_SRC}
        alt=""
        className="absolute bottom-0 left-0 w-full min-h-full object-cover object-bottom mix-blend-screen opacity-50"
        style={{ transform: `translateY(${FILLER_Y_OFFSET})` }}
        decoding="async"
      />
    </div>
  );
}
