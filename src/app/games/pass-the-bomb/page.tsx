import GameHero from "@/app/components/GameHero";
import RandomWordGenerator from "@/app/components/RandomWordGenerator";
import Timer from "@/app/components/Timer";
import { onScreenGames } from "@/lib/games";

const game = onScreenGames.find((g) => g.slug === "pass-the-bomb")!;

export default function PassTheBombPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-4 sm:px-6 md:pt-8">
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
