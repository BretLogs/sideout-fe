import Image from "next/image";
import Link from "next/link";

import { ContentColumn } from "@/components/layout/ContentColumn";

import { creamPillClassName } from "./ctaStyles";

const MAPS_URL = "https://maps.app.goo.gl/VgeENftnCvKG2f7T9";

function MapsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 fill-current"
      aria-hidden
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}

export function FindUs() {
  return (
    <section
      id="find-us"
      data-landing="find-us"
      className="bg-sideout-green pt-16 pb-10 text-center text-sideout-cream"
      aria-label="Find us"
    >
      <ContentColumn>
        <h2
          data-landing-part
          className="mb-3 text-4xl font-bold uppercase tracking-tight md:text-5xl"
        >
          FIND US
        </h2>
        <p
          data-landing-part
          className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-sideout-cream/90"
        >
          LUMBAN, PHILIPPINES, 4014
        </p>
      </ContentColumn>

      {/* Map scales with app shell (up to iPad Pro width), not the narrow content column */}
      <div
        data-landing-part
        className="mx-auto w-full max-w-app px-6 md:px-8 lg:px-10"
      >
        <Image
          src="/assets/images/map_view.png"
          alt="Map to Sideout Café in Lumban, Laguna"
          width={2738}
          height={3416}
          sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1023px) calc(100vw - 4rem), 1024px"
          className="mx-auto h-auto w-full max-w-full"
          priority={false}
        />
      </div>

      <ContentColumn className="mt-6">
        <Link
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-landing-part
          className={creamPillClassName}
        >
          <MapsIcon />
          Go to Sideout
        </Link>
      </ContentColumn>
    </section>
  );
}
