import Image from "next/image";
import Link from "next/link";

import { ContentColumn } from "@/components/layout/ContentColumn";
import { navGhostLinkClassName, navJoinCtaClassName } from "@/components/landing/ctaStyles";
import { LoyaltyIcon, MapPinIcon } from "@/components/nav/NavIcons";

type NavProps = {
  /**
   * `marketing` — landing & public pages: Find us + Join loyalty.
   * `app` — signed-in flows: logo only (avoid redundant signup CTA).
   */
  mode?: "marketing" | "app";
};

export function Nav({ mode = "marketing" }: NavProps) {
  return (
    <nav
      className="border-b border-sideout-cream/20 bg-sideout-green"
      aria-label="Main"
      data-landing="nav"
    >
      <ContentColumn className="flex items-center justify-between gap-3 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-sideout-cream transition-opacity hover:opacity-90"
        >
          <Image
            src="/assets/svg/sideout_logo_light.svg"
            alt="Sideout"
            width={50}
            height={50}
            className="h-8 w-8 shrink-0"
            priority
          />
        </Link>

        {mode === "marketing" ? (
          <div className="flex items-center gap-3">
            <Link
              href="#find-us"
              className={navGhostLinkClassName}
              aria-label="Find us"
            >
              <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden min-[360px]:inline">Find us</span>
            </Link>
            <Link
              href="/signup"
              className={navJoinCtaClassName}
              aria-label="Join the loyalty program"
            >
              <LoyaltyIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="inline">Join loyalty</span>
            </Link>
          </div>
        ) : null}
      </ContentColumn>
    </nav>
  );
}
