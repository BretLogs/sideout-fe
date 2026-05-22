import Image from "next/image";
import Link from "next/link";

type NavVariant = "light" | "dark";

type NavProps = {
  variant?: NavVariant;
};

export function Nav({ variant: _variant = "light" }: NavProps) {
  return (
    <nav className="border-b border-sideout-cream/20 bg-sideout-green">
      <div className="flex items-center justify-between gap-3 px-5 py-3">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-sideout-cream transition-opacity hover:opacity-90"
        >
          <Image
            src="/assets/svg/sideout_logo_light.svg"
            alt=""
            width={50}
            height={50}
            className="h-8 w-8 shrink-0"
            priority
          />
        </Link>

        <Link
          href="/signup"
          className="shrink-0 rounded-full border border-sideout-cream px-4 py-2 text-[10px] font-medium uppercase leading-none tracking-wide text-sideout-cream transition-opacity hover:opacity-90"
        >
          Get Loyalty points
        </Link>
      </div>
    </nav>
  );
}
