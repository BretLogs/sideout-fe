import type { Metadata } from "next";
import "./globals.css";
import { DevStampButton } from "@/components/DevStampButton";

export const metadata: Metadata = {
  title: "Sideout — Empty Pools Filled with Stories",
  description:
    "Coffee for the court. A sit-and-chill spot for pickleball players and coffee lovers.",
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
        <DevStampButton />
      </body>
    </html>
  );
}
