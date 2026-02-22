import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vybrid | Digital Game Master",
  description:
    "Vybrid is a digital game master for offline party games with timers, sound cues, and scorekeeping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased bg-cloud text-ink`}
      >
        <div className="min-h-screen bg-radial-glow vybrid-grid">
          {children}
        </div>
      </body>
    </html>
  );
}
