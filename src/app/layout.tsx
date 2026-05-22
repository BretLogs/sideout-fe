import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sideout",
  description: "Sideout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-sideout-green">
          {children}
        </div>
      </body>
    </html>
  );
}
