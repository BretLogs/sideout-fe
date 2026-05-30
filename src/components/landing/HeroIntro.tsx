import { SideoutHeroBand } from "@/components/SideoutHeroBand";
import { LOYALTY_BODY_COPY } from "./copy";

export function HeroIntro() {
  return (
    <SideoutHeroBand priority>
      <p className="text-[11px] leading-relaxed font-normal uppercase tracking-wide">
        {LOYALTY_BODY_COPY}
      </p>
    </SideoutHeroBand>
  );
}
