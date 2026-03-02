import Link from "next/link";
import Image from "next/image";
import { HeroVideo } from "./HeroVideo";

// Menu — commented out for later use
// const MENU_ITEMS = [
//   { name: "Espresso", price: "—" },
//   { name: "Americano", price: "—" },
//   { name: "Latte", price: "—" },
//   { name: "Cappuccino", price: "—" },
//   { name: "Cold Brew", price: "—" },
//   { name: "Pastries", price: "—" },
// ];

const GALLERY_IMAGES = [
  { src: "/assets/whole_view_sideout.JPG", alt: "Sideout — whole view" },
  { src: "/assets/coffee_with_model.jpeg", alt: "Coffee with model" },
  { src: "/assets/waffle_and_coffee.jpeg", alt: "Waffle and coffee" },
  // { src: "/assets/arbats.JPG", alt: "Waffle and coffee" },
];

/** Fallback hero image when video doesn’t load or play */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=80";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero — primary green dominant, text on green */}
      <section
        id="hero"
        className="relative min-h-[85vh] flex flex-col justify-center px-6 py-20 md:px-12 lg:px-24 bg-sideout-green text-sideout-beige"
      >
        <div className="absolute inset-0 overflow-hidden">
          <HeroVideo fallbackImage={HERO_IMAGE} />
        </div>
        <div className="relative z-10">
          <h1 className="flex items-center">
            <Image
              src="/assets/sideout_logo_white.png"
              alt="Sideout"
              width={240}
              height={72}
              className="h-12 w-auto md:h-14 lg:h-16 object-contain object-left"
              priority
            />
          </h1>
          <p className="mt-6 text-lg md:text-xl text-sideout-beige/95 max-w-md font-normal">
            Empty Pools Filled with Stories
          </p>
          <p className="mt-4 text-base text-sideout-beige/80 max-w-sm">
            Coffee for the court. A sit-and-chill spot for pickleball players
            and coffee lovers.
          </p>
          <p className="mt-2 text-sm text-sideout-beige/80 max-w-sm">
            Every cup fills the story. Earn stamps with each visit — your next coffee could be on us.
          </p>
          <nav className="mt-12 flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/signup"
              className="bg-sideout-beige text-sideout-green px-5 py-2.5 font-medium hover:bg-white transition-colors"
            >
              Earn free coffee
            </Link>
            <a
              href="#gallery"
              className="text-sideout-beige underline underline-offset-4 hover:text-white hover:no-underline"
            >
              Gallery
            </a>
            <Link
              href="/login"
              className="text-sideout-beige/90 underline underline-offset-4 hover:text-white hover:no-underline"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </section>

      {/* Menu — commented out for later use */}
      {/* <section
        id="menu"
        className="border-t-4 border-sideout-green bg-sideout-beige px-6 py-20 md:px-12 lg:px-24"
      >
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-sideout-green">
          Menu
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.name}
              className="flex justify-between py-2 border-b border-sideout-green/20 text-sideout-green"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sideout-green/70">{item.price}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-sideout-green/70">
          Prices at the counter. Ask about our seasonal offerings.
        </p>
      </section> */}

      {/* Gallery */}
      <section
        id="gallery"
        className="border-t-4 border-sideout-green bg-white px-6 py-20 md:px-12 lg:px-24"
      >
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-sideout-green">
          Gallery
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_IMAGES.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] overflow-hidden border-2 border-sideout-green/20"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Location — map below Gallery */}
      <section
        id="location"
        className="border-t-4 border-sideout-green bg-sideout-beige px-6 py-20 md:px-12 lg:px-24"
      >
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-sideout-green">
          Find us
        </h2>
        <p className="mt-2 text-sideout-green/80">
          Lumban, Philippines, 4014
        </p>
        <div className="mt-6 relative w-full overflow-hidden rounded-xl border-2 border-sideout-green/20 bg-sideout-green/5">
          <div className="relative w-full aspect-[16/9] min-h-[280px]">
            <iframe
              src="https://www.google.com/maps?q=Lumban,+Philippines+4014&output=embed"
              title="Sideout location — Lumban, Philippines"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <a
          href="https://maps.app.goo.gl/es5TKK6CAWiLBxat7?g_st=ic"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-sideout-green underline underline-offset-4 hover:no-underline"
        >
          Open in Google Maps →
        </a>
      </section>

      {/* Join Loyalty — green CTA block */}
      <section
        id="loyalty"
        className="border-t-4 border-sideout-green bg-sideout-green px-6 py-20 md:px-12 lg:px-24 text-sideout-beige"
      >
        <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-sideout-beige">
          Loyalty
        </h2>
        <p className="mt-4 max-w-md text-sideout-beige/90">
          Get a stamp with every drink. Collect 10 and your next coffee is on
          us.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-block bg-sideout-beige text-sideout-green px-6 py-3 text-sm font-medium hover:bg-white transition-colors"
        >
          Join loyalty program
        </Link>
      </section>

      <footer className="border-t-4 border-sideout-green bg-sideout-beige px-6 py-8 md:px-12 lg:px-24 text-sm text-sideout-green/70 flex flex-wrap items-center justify-between gap-4">
        <span className="flex items-center gap-2">
          <Image
            src="/assets/sideout_logo.png"
            alt="Sideout"
            width={120}
            height={36}
            className="h-6 w-auto object-contain"
          />
          <span>— Empty Pools Filled with Stories</span>
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://maps.app.goo.gl/es5TKK6CAWiLBxat7?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sideout-green font-medium hover:underline"
          >
            Lumban, Philippines, 4014
          </a>
          <Link href="/login" className="text-sideout-green font-medium hover:underline">
            Sign in
          </Link>
          <Link href="/barista" className="text-sideout-green font-medium hover:underline">
            Staff
          </Link>
        </div>
      </footer>
    </div>
  );
}
