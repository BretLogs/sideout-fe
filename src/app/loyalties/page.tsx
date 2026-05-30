import { AuthGuard } from "@/components/auth/AuthGuard";
import { Nav } from "@/components/Nav";
import { LoyaltiesView } from "@/components/loyalties/LoyaltiesView";
import { SideoutHeroBand } from "@/components/SideoutHeroBand";

export const metadata = {
  title: "Loyalties — Sideout",
};

export default function LoyaltiesPage() {
  return (
    <div className="min-h-dvh bg-sideout-green text-sideout-cream">
      <Nav variant="dark" />
      <SideoutHeroBand />
      <main className="px-6 py-8">
        <AuthGuard>
          <LoyaltiesView />
        </AuthGuard>
      </main>
    </div>
  );
}
