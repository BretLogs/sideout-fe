import { Nav } from "@/components/Nav";
import { LoyaltiesView } from "@/components/loyalties/LoyaltiesView";

export const metadata = {
  title: "Loyalties — Sideout",
};

export default function LoyaltiesPage() {
  return (
    <div className="min-h-dvh bg-sideout-green text-sideout-cream">
      <Nav variant="dark" />
      <main className="px-6 py-8">
        <LoyaltiesView />
      </main>
    </div>
  );
}
