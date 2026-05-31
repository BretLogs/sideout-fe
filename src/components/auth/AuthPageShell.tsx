import { BottomFillerBackground } from "@/components/BottomFillerBackground";

type AuthPageShellProps = {
  children: React.ReactNode;
};

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative min-h-dvh w-full bg-sideout-green text-sideout-cream">
      <BottomFillerBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
