import Image from "next/image";
import Link from "next/link";

const MAPS_URL = "https://maps.app.goo.gl/VgeENftnCvKG2f7T9";

const pillClassName =
  "inline-flex items-center justify-center gap-2 rounded-full bg-sideout-cream px-10 py-2.5 text-sm font-medium uppercase tracking-wide text-sideout-green transition-opacity hover:opacity-90";

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
      className="bg-sideout-green px-6 pt-16 pb-10 text-center text-sideout-cream"
      aria-label="Find us"
    >
      <h2 className="mb-3 text-4xl font-bold uppercase tracking-tight">
        FIND US
      </h2>
      <p className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-sideout-cream/90">
        LUMBAN, PHILIPPINES, 4014
      </p>

      <Image
        src="/assets/images/map_view.png"
        alt="Map to Sideout Café in Lumban, Laguna"
        width={2738}
        height={3416}
        sizes="(max-width: 430px) 100vw, 430px"
        className="h-auto w-full"
        priority={false}
      />
      <Link
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-6 ${pillClassName}`}
      >
        <MapsIcon />
        Go to Sideout
      </Link>
    </section>
  );
}
