import Link from "next/link";

import { SideoutHeroBand } from "@/components/SideoutHeroBand";

import { goldPillClassName } from "./ctaStyles";
import { HERO_TAGLINE } from "./copy";

export function HeroIntro() {
  return (
    <SideoutHeroBand priority>
      <p
        data-landing="hero-tagline"
        className="text-sm leading-relaxed text-sideout-cream/90"
      >
        {HERO_TAGLINE}
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="/signup"
          data-landing="hero-cta-primary"
          className={goldPillClassName}
        >
          Join the program
        </Link>
        <p
          data-landing="hero-cta-secondary"
          className="text-xs text-sideout-cream/75"
        >
          <Link
            href="/sign-in"
            className="underline-offset-2 transition-opacity hover:underline hover:opacity-90"
          >
            Already a member? Sign in
          </Link>
        </p>
      </div>
    </SideoutHeroBand>
  );
}
