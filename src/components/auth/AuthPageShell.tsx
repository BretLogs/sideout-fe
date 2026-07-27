import { BottomFillerBackground } from "@/components/BottomFillerBackground";
import { PoweredByStappl } from "@/components/PoweredByStappl";

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-sideout-green text-sideout-cream">
      <BottomFillerBackground />
      <div className="relative z-10 flex-1">{children}</div>
      <PoweredByStappl className="relative z-10 pb-8 pt-4" />
    </div>
  );
}
