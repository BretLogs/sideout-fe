export function SecondaryVisual() {
  return (
    <section
      data-landing="secondary-visual"
      className="relative w-full min-h-[45vh] max-h-[720px] overflow-hidden bg-sideout-green md:min-h-[38vh] lg:min-h-[32vh]"
      aria-label="Sideout café atmosphere"
    >
      <div
        data-landing="secondary-visual-bg"
        className="absolute inset-0 origin-center bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url(/assets/images/sideout_bg_secondary.png)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-linear-to-b from-transparent to-sideout-green md:h-28"
        aria-hidden
      />
    </section>
  );
}
