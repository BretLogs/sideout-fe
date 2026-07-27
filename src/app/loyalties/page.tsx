import { AuthGuard } from "@/components/auth/AuthGuard";
import { BottomFillerBackground } from "@/components/BottomFillerBackground";
import { ContentColumn } from "@/components/layout/ContentColumn";
import { LoyaltiesView } from "@/components/loyalties/LoyaltiesView";
import { Nav } from "@/components/Nav";
import { PoweredByStappl } from "@/components/PoweredByStappl";

export const metadata = {
  title: "Loyalties — Sideout",
};

export default function LoyaltiesPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-sideout-green text-sideout-cream">
      <BottomFillerBackground />
      <div className="relative z-10 flex-1">
        <Nav mode="app" />
        <main className="py-8">
          <ContentColumn>
            <AuthGuard>
              <LoyaltiesView />
            </AuthGuard>
          </ContentColumn>
        </main>
      </div>
      <PoweredByStappl className="relative z-10 pb-8 pt-4" />
    </div>
  );
}
