import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Sideout",
  description: "Sideout",
  icons: {
    icon: "/assets/svg/sideout_logo_light.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Providers>
          <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-sideout-green">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
