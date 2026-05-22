import { SocialIcons } from "./SocialIcons";

export function Footer() {
  return (
    <footer className="bg-sideout-green px-6 pb-12 pt-10 text-center text-sideout-cream">
      <p className="mb-6 text-[10px] leading-relaxed font-medium uppercase tracking-wide">
        FOLLOW US ON OUR SOCIAL MEDIA ACCOUNTS
      </p>
      <SocialIcons />
    </footer>
  );
}
