import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";

import NavDock from "./components/NavDock";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vybrid | Game night, sorted",
  description:
    "A one-stop shop for party games with friends and family. Rules, timers, word lists and scorekeeping, all in one place.",
};

export const viewport: Viewport = {
  themeColor: "#f6f3ed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${dmSans.variable}`}>
        <NavDock />
        <div className="pb-32 md:pb-16">{children}</div>
      </body>
    </html>
  );
}
