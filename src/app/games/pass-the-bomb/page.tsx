import type { Metadata } from "next";

import GameHero from "@/app/components/GameHero";
import JsonLd from "@/app/components/JsonLd";
import RandomWordGenerator from "@/app/components/RandomWordGenerator";
import Timer from "@/app/components/Timer";
import { onScreenGames } from "@/lib/games";
import { gameJsonLd, pageMetadata } from "@/lib/seo";

const game = onScreenGames.find((g) => g.slug === "pass-the-bomb")!;
export const metadata: Metadata = pageMetadata({
  title: "Pass the Bomb: word game with a ticking timer",
  description: `${game.tagline} A word prompt and a fuse timer on one phone. ${game.players} players.`,
  path: game.href,
});

export default function PassTheBombPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 pt-6 sm:px-6 md:pt-10 lg:px-8">
      <JsonLd
        data={gameJsonLd({
          title: game.title,
          description: game.tagline,
          path: game.href,
          players: game.players,
          duration: game.duration,
          kit: [],
          steps: [],
        })}
      />
      <GameHero game={game} />
      <div className="grid gap-10 md:grid-cols-2 md:items-start">
        <RandomWordGenerator tone="yellow" title="Say something about…" />
        <Timer
          initialSeconds={45}
          presets={[30, 45, 60, 90]}
          tone="red"
          title="The fuse"
        />
      </div>
    </main>
  );
}
