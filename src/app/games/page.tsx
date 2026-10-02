import type { Metadata } from "next";

import GameCatalogue from "../components/GameCatalogue";
import { allGames } from "@/lib/games";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "All party games",
  description:
    "Every game on Baithak: Imposter, Pictionary, Top 9 (Family Feud-style), Mafia, Charades, Hot Seat and more. Pick one and play from a single phone.",
  path: "/games",
  siteCard: true,
});

export default function GamesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 sm:px-6 md:pt-14 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[clamp(2.6rem,7vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-ink">
            What are we <span className="marker">playing?</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-soft">
            Every game lists what you need and how to play. Filter by
            what&apos;s lying around.
          </p>
        </div>
      </header>
      <GameCatalogue games={allGames} />
    </main>
  );
}
