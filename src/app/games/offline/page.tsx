import Link from "next/link";

import { offlineGames } from "@/lib/offlineGames";

export default function OfflineGamesIndexPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 pb-16 pt-10 sm:px-8 lg:px-10">
      <header className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-neon">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          Offline Games
        </p>
        <h1 className="mt-3 text-hero font-semibold text-ink">Play Offline</h1>
        <p className="mt-3 text-base text-ink/70">
          Choose a game to see full rules, props, and optional helpers.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {offlineGames.map((game) => (
          <Link
            key={game.slug}
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
            <p className="text-sm leading-6 text-ink/70">{game.description}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-ink/40">
              {game.details}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
