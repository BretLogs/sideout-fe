import { Nav } from "@/components/Nav";
import { FindUs } from "@/components/landing/FindUs";
import { Footer } from "@/components/landing/Footer";
import { HeroIntro } from "@/components/landing/HeroIntro";
import { SecondaryVisual } from "@/components/landing/SecondaryVisual";
import { VisualStack } from "@/components/landing/VisualStack";

export default function LandingPage() {
  return (
    <div className="bg-sideout-green">
      <Nav variant="dark" />
      <main>
        <HeroIntro />
        <VisualStack />
        <SecondaryVisual />
        <FindUs />
        <Footer />
      </main>
    </div>
  );
}
