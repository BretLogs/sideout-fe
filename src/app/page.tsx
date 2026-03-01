import Link from "next/link";
import Image from "next/image";

const MENU_ITEMS = [
  { name: "Espresso", price: "—" },
  { name: "Americano", price: "—" },
  { name: "Latte", price: "—" },
  { name: "Cappuccino", price: "—" },
  { name: "Cold Brew", price: "—" },
  { name: "Pastries", price: "—" },
];

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    alt: "Coffee cup",
  },
  {
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    alt: "Coffee shop",
  },
  {
    src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    alt: "Café interior",
  },
];

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
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            className="object-cover opacity-25"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-sideout-green/85" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-sideout-beige">
            Sideout
          </h1>
          <p className="mt-6 text-lg md:text-xl text-sideout-beige/95 max-w-md font-normal">
            Empty Pools Filled with Stories
          </p>
          <p className="mt-4 text-base text-sideout-beige/80 max-w-sm">
            Coffee for the court. A sit-and-chill spot for pickleball players
            and coffee lovers.
          </p>
          <nav className="mt-12 flex flex-wrap gap-4 text-sm">
            <a
              href="#menu"
              className="text-sideout-beige underline underline-offset-4 hover:text-white hover:no-underline"
            >
              Menu
            </a>
            <a
              href="#gallery"
              className="text-sideout-beige underline underline-offset-4 hover:text-white hover:no-underline"
            >
              Gallery
            </a>
            <Link
              href="/dashboard"
              className="text-sideout-beige underline underline-offset-4 hover:text-white hover:no-underline"
            >
              Loyalty
            </Link>
            <Link
              href="/login"
              className="text-sideout-beige underline underline-offset-4 hover:text-white hover:no-underline"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </section>

      {/* Menu — white/beige section with strong green headings */}
      <section
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
      </section>

      {/* Gallery — Unsplash placeholders */}
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
        <span>Sideout — Empty Pools Filled with Stories</span>
        <div className="flex gap-4">
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
