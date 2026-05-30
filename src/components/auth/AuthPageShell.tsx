const FILLER_SRC = "/assets/images/sideout_bg_filler.png";

/** Visible height of the bottom filler band (covers social sign-in area) */
const FILLER_BAND_HEIGHT = "55vh";

/**
 * PNG has empty black padding below the artwork; shift down so the drawing
 * sits on the viewport bottom and the matte is clipped off-screen.
 */
const FILLER_Y_OFFSET = "15%";

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative min-h-dvh w-full bg-sideout-green text-sideout-cream">
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 z-0 w-full max-w-[430px] -translate-x-1/2 overflow-hidden"
        style={{ height: FILLER_BAND_HEIGHT }}
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
      <div className="relative z-10">{children}</div>
    </div>
  );
}
