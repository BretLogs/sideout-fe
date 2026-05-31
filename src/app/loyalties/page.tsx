import { AuthGuard } from "@/components/auth/AuthGuard";
import { BottomFillerBackground } from "@/components/BottomFillerBackground";
import { ContentColumn } from "@/components/layout/ContentColumn";
import { LoyaltiesView } from "@/components/loyalties/LoyaltiesView";
import { Nav } from "@/components/Nav";

export const metadata = {
  title: "Loyalties — Sideout",
};

export default function LoyaltiesPage() {
  return (
    <div className="relative min-h-dvh bg-sideout-green text-sideout-cream">
      <BottomFillerBackground />
      <div className="relative z-10">
        <Nav mode="app" />
        <main className="py-8">
          <ContentColumn>
            <AuthGuard>
              <LoyaltiesView />
            </AuthGuard>
          </ContentColumn>
        </main>
      </div>
    </div>
  );
}
