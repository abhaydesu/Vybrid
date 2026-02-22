import GameCard from "./components/GameCard";

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
