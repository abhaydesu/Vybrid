import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import Mascot from "../components/Mascot";
import RandomWordGenerator from "../components/RandomWordGenerator";
import Timer from "../components/Timer";

export const metadata: Metadata = pageMetadata({
  title: "Game timer and random word generator",
  description:
    "A standalone game timer and random word deck for any party game you make up. Works in your phone's browser, no app needed.",
  path: "/tools",
  siteCard: true,
});

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 sm:px-6 md:gap-12 md:pt-14 lg:px-8">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-ink">
            Bring your <span className="marker">own game.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">
            Playing something that isn&apos;t on the list? Grab a timer or a
            word deck and make up the rules as you go.
          </p>
        </div>
        <div aria-hidden="true" className="hidden shrink-0 items-end gap-2 sm:flex">
          <Mascot kind="kulfi" color="#1fbf6a" mood="happy" className="h-16 w-16" />
          <Mascot kind="dice" color="#2f7bff" mood="cheer" className="h-20 w-20" delay={0.8} />
        </div>
      </header>
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <RandomWordGenerator tone="yellow" />
        <Timer tone="green" />
      </div>
    </main>
  );
}
