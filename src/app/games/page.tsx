import type { Metadata } from "next";

import GameCatalogue from "../components/GameCatalogue";
import { allGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "All games | Vybrid",
};

export default function GamesPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-6 sm:px-6 md:pt-10">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">
          The catalogue
        </p>
        <h1 className="mt-1.5 font-display text-[clamp(2.4rem,9vw,4rem)] font-extrabold leading-none tracking-[-0.03em]">
          What are we <span className="scribble-underline">playing?</span>
        </h1>
      </header>
      <GameCatalogue games={allGames} />
    </main>
  );
}
