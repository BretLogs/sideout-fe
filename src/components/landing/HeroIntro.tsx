import Image from "next/image";
import { LOYALTY_BODY_COPY } from "./copy";

export function HeroIntro() {
  return (
    <section className="bg-sideout-green px-6 py-10 text-center text-sideout-cream">
      <Image
        src="/assets/svg/sideout_logo_light.svg"
        alt="Sideout"
        width={810}
        height={810}
        className="mx-auto mb-8 h-auto w-full max-w-[70%]"
        priority
      />
      <p className="text-[11px] leading-relaxed font-normal uppercase tracking-wide">
        {LOYALTY_BODY_COPY}
      </p>
    </section>
  );
}
