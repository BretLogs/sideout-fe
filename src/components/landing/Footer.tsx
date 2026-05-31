import Link from "next/link";

import { ContentColumn } from "@/components/layout/ContentColumn";

import { SocialIcons } from "./SocialIcons";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-landing="footer"
      className="bg-sideout-green pb-12 pt-10 text-center text-sideout-cream"
    >
      <ContentColumn>
        <p
          data-landing="footer-part"
          className="mb-6 text-[10px] leading-relaxed font-medium uppercase tracking-wide md:text-xs"
        >
          Follow us on social media
        </p>
        <SocialIcons />
        <nav
          data-landing="footer-part"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium uppercase tracking-wide"
          aria-label="Footer"
        >
          <Link
            href="/signup"
            className="text-sideout-gold transition-opacity hover:opacity-90"
          >
            Join loyalty
          </Link>
          <Link
            href="#find-us"
            className="transition-opacity hover:opacity-90"
          >
            Find us
          </Link>
        </nav>
        <p
          data-landing="footer-part"
          className="mt-6 text-[10px] text-sideout-cream/60 md:text-xs"
        >
          © {year} Sideout Café · Lumban, Laguna
        </p>
      </ContentColumn>
    </footer>
  );
}
