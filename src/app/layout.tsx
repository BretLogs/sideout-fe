import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sideout — Empty Pools Filled with Stories",
  description:
    "Coffee for the court. A sit-and-chill spot for pickleball players and coffee lovers.",
  icons: {
    icon: "/assets/side_out_logo_white_bg.png",
    apple: "/assets/sideout_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-white text-sideout-green">
        {children}
      </body>
    </html>
  );
}
