import gsap from "gsap";

const GOLD = "#ffbd59";
const CREAM = "#d3ccc2";
const GREEN = "#02332f";

type CelebrationTarget = {
  qrEl?: HTMLElement | null;
  stampCardEl?: HTMLElement | null;
  badgeEl?: HTMLElement | null;
};

function getCenter(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * SideOut-style redeem celebration: gold ball burst, cream confetti,
 * “REDEEMED!” badge pop, stamp card glow.
 */
export function playRedeemCelebration(
  targets: CelebrationTarget,
  onComplete?: () => void,
): () => void {
  const originRect =
    targets.stampCardEl?.getBoundingClientRect() ??
    targets.qrEl?.getBoundingClientRect();
  if (!originRect) {
    onComplete?.();
    return () => {};
  }

  const origin = getCenter(originRect);
  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.className = "pointer-events-none fixed inset-0 z-[60] overflow-hidden";
  document.body.appendChild(layer);

  const particles: HTMLElement[] = [];
  const particleCount = 28;

  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement("div");
    const isBall = i % 4 === 0;
    const isGreen = i % 7 === 0;

    if (isBall) {
      el.style.cssText = `position:absolute;width:${randomBetween(10, 18)}px;height:${randomBetween(10, 18)}px;border-radius:50%;background:${GOLD};`;
    } else {
      const w = randomBetween(4, 8);
      const h = randomBetween(10, 18);
      el.style.cssText = `position:absolute;width:${w}px;height:${h}px;border-radius:2px;background:${isGreen ? GREEN : i % 2 === 0 ? GOLD : CREAM};`;
    }

    layer.appendChild(el);
    particles.push(el);

    const angle = (i / particleCount) * Math.PI * 2 + randomBetween(-0.3, 0.3);
    const distance = randomBetween(70, 160);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance - randomBetween(30, 80);
    const rotation = randomBetween(-220, 220);

    gsap.set(el, {
      left: origin.x,
      top: origin.y,
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
      scale: randomBetween(0.6, 1),
    });

    gsap.to(el, {
      x: dx,
      y: dy,
      rotation,
      opacity: 0,
      scale: randomBetween(0.2, 0.5),
      duration: randomBetween(0.75, 1.15),
      ease: "power2.out",
      delay: randomBetween(0, 0.12),
    });
  }

  // Expanding gold ring from stamp card
  if (targets.stampCardEl) {
    const ring = document.createElement("div");
    ring.style.cssText = `position:absolute;left:${origin.x}px;top:${origin.y}px;width:24px;height:24px;border-radius:50%;border:2px solid ${GOLD};transform:translate(-50%,-50%);`;
    layer.appendChild(ring);
    gsap.fromTo(
      ring,
      { scale: 0.5, opacity: 0.9 },
      { scale: 8, opacity: 0, duration: 0.85, ease: "power2.out" },
    );
    gsap.fromTo(
      targets.stampCardEl,
      { boxShadow: `0 0 0 0 ${GOLD}99` },
      {
        boxShadow: `0 0 0 14px ${GOLD}00`,
        duration: 0.7,
        ease: "power2.out",
      },
    );
    gsap.to(targets.stampCardEl, {
      scale: 1.02,
      duration: 0.25,
      yoyo: true,
      repeat: 1,
      ease: "sine.inOut",
      transformOrigin: "50% 50%",
    });
  }

  // QR flash on scan
  if (targets.qrEl) {
    gsap.fromTo(
      targets.qrEl,
      { scale: 1, filter: "brightness(1)" },
      {
        scale: 1.03,
        filter: "brightness(1.15)",
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
        transformOrigin: "50% 50%",
      },
    );
    gsap.to(targets.qrEl, {
      opacity: 0.35,
      scale: 0.96,
      duration: 0.35,
      delay: 0.35,
      ease: "power2.in",
      transformOrigin: "50% 50%",
    });
  }

  // Badge pop
  if (targets.badgeEl) {
    gsap.set(targets.badgeEl, { scale: 0, opacity: 0, y: 12 });
    gsap
      .timeline()
      .to(targets.badgeEl, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(2.4)",
      })
      .to(targets.badgeEl, {
        scale: 1.04,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut",
      }, "-=0.1");
  }

  const cleanup = gsap.delayedCall(1.35, () => {
    layer.remove();
    if (targets.stampCardEl) {
      gsap.set(targets.stampCardEl, {
        clearProps: "scale,boxShadow,transform",
      });
    }
    if (targets.qrEl) {
      gsap.set(targets.qrEl, { clearProps: "opacity,scale,filter,transform" });
    }
    if (targets.badgeEl) {
      gsap.set(targets.badgeEl, { clearProps: "scale,opacity,y,transform" });
    }
    onComplete?.();
  });

  return () => {
    cleanup.kill();
    layer.remove();
    particles.forEach((p) => gsap.killTweensOf(p));
  };
}
