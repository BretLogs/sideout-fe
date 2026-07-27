import gsap from "gsap";

/**
 * Soft fade-in, then a looping bounce with squash & stretch
 * so the SVG ball compresses on impact and elongates in flight.
 */
export function playBallSettle(ballEl: HTMLElement): () => void {
  gsap.set(ballEl, {
    opacity: 0,
    scale: 0.94,
    scaleX: 1,
    scaleY: 1,
    y: 0,
    // Bottom-center so squash reads as pressing into the slot
    transformOrigin: "50% 100%",
  });

  const ctx = gsap.context(() => {
    const tl = gsap.timeline({ delay: 0.35, repeat: -1 });

    gsap.to(ballEl, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });

    // Rise — stretch vertically (airborne)
    tl.to(ballEl, {
      y: "-28%",
      scaleX: 0.88,
      scaleY: 1.14,
      duration: 0.85,
      ease: "cubic-bezier(0.8, 0, 1, 1)",
    });

    // Fall — keep stretch, then squash hard on impact
    tl.to(ballEl, {
      y: "0%",
      scaleX: 1.22,
      scaleY: 0.78,
      duration: 0.75,
      ease: "cubic-bezier(0, 0, 0.2, 1)",
    });

    // Recover from squash to rest
    tl.to(ballEl, {
      scaleX: 1,
      scaleY: 1,
      duration: 0.25,
      ease: "power2.out",
    });

    // Hold still, then loop (bounce → 2s → bounce → 2s)
    tl.to({}, { duration: 2 });
  }, ballEl);

  return () => ctx.revert();
}
