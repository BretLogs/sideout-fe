import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_DEFAULTS = {
  y: 28,
  opacity: 0,
  duration: 0.75,
  ease: "power2.out",
} as const;

function revealOnScroll(
  elements: gsap.TweenTarget,
  trigger: Element,
  options: gsap.TweenVars = {},
) {
  if (!elements || (elements instanceof NodeList && elements.length === 0)) {
    return;
  }

  gsap.fromTo(
    elements,
    { y: REVEAL_DEFAULTS.y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: REVEAL_DEFAULTS.duration,
      ease: REVEAL_DEFAULTS.ease,
      stagger: 0.12,
      clearProps: "transform",
      scrollTrigger: {
        trigger,
        start: "top 78%",
        once: true,
      },
      ...options,
    },
  );
}

/**
 * Landing-page motion: hero entrance, scroll reveals, and subtle parallax.
 * Overlay/layover alignment is intentionally untouched.
 */
export function initLandingMotion(root: HTMLElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    const nav = root.querySelector<HTMLElement>("[data-landing='nav']");
    const heroLogo = root.querySelector<HTMLElement>("[data-landing='hero-logo']");
    const heroTagline = root.querySelector<HTMLElement>(
      "[data-landing='hero-tagline']",
    );
    const heroCtaPrimary = root.querySelector<HTMLElement>(
      "[data-landing='hero-cta-primary']",
    );
    const heroCtaSecondary = root.querySelector<HTMLElement>(
      "[data-landing='hero-cta-secondary']",
    );

    if (nav) {
      heroTl.fromTo(
        nav,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, clearProps: "transform" },
      );
    }
    if (heroLogo) {
      heroTl.fromTo(
        heroLogo,
        { y: 28, opacity: 0, scale: 0.94, transformOrigin: "50% 50%" },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          clearProps: "transform",
        },
        nav ? "-=0.1" : 0,
      );
    }
    if (heroTagline) {
      heroTl.fromTo(
        heroTagline,
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, clearProps: "transform" },
        "-=0.5",
      );
    }
    // Transform-only on CTAs so they stay visible even if motion is interrupted
    if (heroCtaPrimary) {
      heroTl.fromTo(
        heroCtaPrimary,
        { y: 14 },
        { y: 0, duration: 0.5, clearProps: "transform" },
        "-=0.35",
      );
    }
    if (heroCtaSecondary) {
      heroTl.fromTo(
        heroCtaSecondary,
        { y: 10 },
        { y: 0, duration: 0.45, clearProps: "transform" },
        "-=0.4",
      );
    }

    const visualStack = root.querySelector<HTMLElement>(
      "[data-landing='visual-stack']",
    );
    const visualBg = root.querySelector<HTMLElement>(
      "[data-landing='visual-bg-inner']",
    );
    if (visualStack && visualBg) {
      gsap.to(visualBg, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: visualStack,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }

    const secondary = root.querySelector<HTMLElement>(
      "[data-landing='secondary-visual']",
    );
    const secondaryBg = root.querySelector<HTMLElement>(
      "[data-landing='secondary-visual-bg']",
    );
    if (secondary && secondaryBg) {
      gsap.fromTo(
        secondaryBg,
        { scale: 1.1 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: secondary,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        },
      );
    }

    const loyalty = root.querySelector<HTMLElement>("#loyalty-perks");
    if (loyalty) {
      revealOnScroll(
        root.querySelectorAll(
          "[data-landing='loyalty-heading'], [data-landing='loyalty-body'], [data-landing='loyalty-cta']",
        ),
        loyalty,
      );
    }

    const findUs = root.querySelector<HTMLElement>("[data-landing='find-us']");
    if (findUs) {
      revealOnScroll(
        root.querySelectorAll("[data-landing-part]"),
        findUs,
        { y: 24, duration: 0.65, stagger: 0.1 },
      );
    }

    const footer = root.querySelector<HTMLElement>("[data-landing='footer']");
    if (footer) {
      const socialIcons = root.querySelectorAll("[data-landing='social-icon']");
      if (socialIcons.length) {
        gsap.fromTo(
          socialIcons,
          { scale: 0.75, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: footer,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      const footerParts = root.querySelectorAll("[data-landing='footer-part']");
      if (footerParts.length) {
        gsap.fromTo(
          footerParts,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.12,
            clearProps: "transform",
            scrollTrigger: {
              trigger: footer,
              start: "top 88%",
              once: true,
            },
          },
        );
      }
    }
  }, root);

  const refresh = () => ScrollTrigger.refresh();
  window.addEventListener("load", refresh);

  return () => {
    window.removeEventListener("load", refresh);
    ctx.revert();
  };
}
