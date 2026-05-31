import Image from "next/image";
import type { ReactNode } from "react";

import { ContentColumn } from "@/components/layout/ContentColumn";

const FILLER_SRC = "/assets/images/sideout_bg_filler.png";
const LOGO_SRC = "/assets/svg/sideout_logo_light.svg";

type SideoutHeroBandProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  priority?: boolean;
};

export function SideoutHeroBand({
  children,
  className = "",
  contentClassName = "",
  priority = false,
}: SideoutHeroBandProps) {
  return (
    <section
      data-landing="hero"
      className={`relative isolate w-full overflow-x-hidden bg-sideout-green text-center text-sideout-cream ${className}`.trim()}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FILLER_SRC}
          alt=""
          className="h-full w-full object-cover object-top mix-blend-screen opacity-50"
          decoding="async"
        />
      </div>
      <ContentColumn className={`relative z-10 pb-12 pt-10 ${contentClassName}`.trim()}>
        <Image
          src={LOGO_SRC}
          alt="Sideout"
          width={810}
          height={810}
          data-landing="hero-logo"
          className={`mx-auto h-auto w-full max-w-content${children ? " mb-8" : ""}`}
          priority={priority}
        />
        {children}
      </ContentColumn>
    </section>
  );
}
