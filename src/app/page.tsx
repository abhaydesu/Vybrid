import Link from "next/link";

import GameCard from "./components/GameCard";
import { offlineGames } from "@/lib/offlineGames";

const games = [
  {
    title: "Top 9",
    description:
      "Family Feud-style rounds with hidden answers and hype reveals.",
    href: "/games/top-9",
    accent: "blue",
  },
  {
    title: "Pass the Bomb",
    description: "Rapid-fire word guessing with a ticking timer and chaos.",
    href: "/games/pass-the-bomb",
    accent: "sky",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-12 sm:px-10">
      <header className="flex flex-col gap-6">
        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-ink/60">
          Vybrid Control Hub
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-mega font-semibold tracking-tight text-ink">
            Digital Game Master for high-energy party nights.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-ink/70 sm:text-lg">
            Launch a game, keep score, and trigger timers from one screen. Built
            for offline play with a bold, readable UI.
          </p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.title} {...game} />
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-ink">Offline Games</h2>
          <p className="text-sm text-ink/60">
            Ready-to-play classics with clear rules and minimal setup.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {offlineGames.map((game) => (
            <Link
              key={game.title}
              href={`/games/offline/${game.slug}`}
              className="flex h-full flex-col gap-3 rounded-3xl border border-blue-100 bg-white p-5 shadow-neon transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/40">
                  Offline
                </span>
                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[0.65rem] font-semibold text-blue-700">
                  Rules →
                </span>
              </div>
              <h3 className="text-lg font-semibold text-ink">{game.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/70">
                {game.description}
              </p>
              <p className="mt-3 text-sm text-ink/60">{game.details}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-surface/80 p-6 backdrop-blur">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-ink">Host Controls</h2>
          <p className="text-sm text-ink/60">
            Scores, timers, and sound effects will appear here once game logic
            is wired up.
          </p>
        </div>
      </section>
    </main>
  );
}
