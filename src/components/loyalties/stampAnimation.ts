import gsap from "gsap";

const BALL_SRC = "/assets/svg/sideout_ball.svg";

function getQrSvg(container: HTMLElement): SVGSVGElement | null {
  return container.querySelector("svg");
}

function getCenter(rect: DOMRect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Simulates counter scan: QR dissolves → large ball emerges →
 * one smooth arc into the stamp slot → crossfade into the grid ball.
 */
export function animateQrScanToStamp(
  qrContainerEl: HTMLElement,
  slotEl: HTMLElement,
  onComplete: () => void,
): void {
  const qrSvg = getQrSvg(qrContainerEl);
  const qrRect =
    qrSvg?.getBoundingClientRect() ?? qrContainerEl.getBoundingClientRect();
  const slotRect = slotEl.getBoundingClientRect();

  const qrCenter = getCenter(qrRect);
  const slotCenter = getCenter(slotRect);

  const largeSize = Math.min(qrRect.width, qrRect.height) * 0.92;
  const endSize = Math.min(slotRect.width, slotRect.height) * 0.58;
  const endScale = endSize / largeSize;

  const flyer = document.createElement("img");
  flyer.src = BALL_SRC;
  flyer.alt = "";
  flyer.setAttribute("aria-hidden", "true");
  document.body.appendChild(flyer);

  gsap.set(flyer, {
    position: "fixed",
    left: qrCenter.x - largeSize / 2,
    top: qrCenter.y - largeSize / 2,
    width: largeSize,
    height: largeSize,
    zIndex: 9999,
    pointerEvents: "none",
    transformOrigin: "50% 50%",
    x: 0,
    y: 0,
    scale: 0,
    opacity: 0,
  });

  if (qrSvg) {
    gsap.set(qrSvg, { transformOrigin: "50% 50%" });
  }

  const deltaX = slotCenter.x - qrCenter.x;
  const deltaY = slotCenter.y - qrCenter.y;
  const arcLift = Math.min(48, Math.abs(deltaY) * 0.28 + 20);

  const tl = gsap.timeline({
    onComplete: () => {
      flyer.remove();
      if (qrSvg) {
        gsap.set(qrSvg, { clearProps: "opacity,scale,transform,filter" });
      }
    },
  });

  // QR scanned → dissolves
  if (qrSvg) {
    tl.to(qrSvg, { scale: 1.04, duration: 0.14, ease: "power2.out" }, 0).to(
      qrSvg,
      {
        scale: 0.12,
        opacity: 0,
        filter: "blur(5px)",
        duration: 0.3,
        ease: "power2.in",
      },
      0.08,
    );
  }

  // Large ball emerges (single pop — no extra bounce before flight)
  tl.to(
    flyer,
    {
      scale: 1,
      opacity: 1,
      duration: 0.48,
      ease: "back.out(2.2)",
    },
    0.16,
  );

  // One continuous arc into the slot (no second leg)
  tl.to(
    flyer,
    {
      keyframes: [
        {
          x: deltaX * 0.45,
          y: deltaY * 0.45 - arcLift,
          scale: endScale * 1.06,
          duration: 0.38,
          ease: "power2.out",
        },
        {
          x: deltaX,
          y: deltaY,
          scale: endScale,
          duration: 0.42,
          ease: "power2.inOut",
        },
      ],
    },
    0.58,
  );

  // Settle at slot, then crossfade into the real stamp (no pop-to-zero)
  tl.to(
    flyer,
    {
      scale: endScale * 1.04,
      duration: 0.1,
      ease: "power1.out",
    },
    1.35,
  )
    .call(
      () => {
        onComplete();
      },
      [],
      1.38,
    )
    .to(
      flyer,
      {
        opacity: 0,
        scale: endScale,
        duration: 0.16,
        ease: "power2.in",
      },
      1.4,
    );

  // QR returns after stamp is in place
  if (qrSvg) {
    tl.fromTo(
      qrSvg,
      { scale: 0.9, opacity: 0, filter: "blur(2px)" },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.38,
        ease: "power2.out",
      },
      1.55,
    );
  }
}

/** Soft fade-in at the slot — no second bounce after the flying ball lands. */
export function playBallSettle(ballEl: HTMLElement): () => void {
  gsap.set(ballEl, { opacity: 0, scale: 0.94, y: 0, transformOrigin: "50% 50%" });

  const ctx = gsap.context(() => {
    gsap.to(ballEl, {
      opacity: 1,
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
    gsap.to(ballEl, {
      y: -4,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.35,
    });
  }, ballEl);

  return () => ctx.revert();
}
