import type { Metadata, Viewport } from "next";
import { Baloo_2, Kalam, Mukta } from "next/font/google";

import { SITE } from "@/lib/site";
import Footer from "./components/Footer";
import NavDock from "./components/NavDock";
import "./globals.css";

// Both from Ek Type, an Indian foundry: Baloo 2 is warm and rounded for
// headings, Mukta is a calm humanist sans for reading. Both cover Devanagari.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  display: "swap",
});

// Handwritten notes, also by an Indian foundry (Indian Type Foundry).
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name}: party games for friends and family, on one phone`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "party games",
    "game night",
    "games to play with friends",
    "family games",
    "imposter game",
    "pictionary words",
    "family feud game",
    "desi party games",
    "Bollywood games",
    "games for Indian families",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    url: "/",
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name}: ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
    // Font variables go on <html> so the theme tokens on :root can see them.
    <html lang={SITE.language} className={`${baloo.variable} ${mukta.variable} ${kalam.variable}`}>
      <body>
        <NavDock />
        {children}
        <Footer />
      </body>
    </html>
  );
}
