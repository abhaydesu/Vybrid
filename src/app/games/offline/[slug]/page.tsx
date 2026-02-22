import Link from "next/link";
import { notFound } from "next/navigation";

import { offlineGames } from "@/lib/offlineGames";
import RandomWordGenerator from "@/app/components/RandomWordGenerator";
import Timer from "@/app/components/Timer";

interface OfflineGamePageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return offlineGames.map((game) => ({ slug: game.slug }));
}

export default async function OfflineGamePage({
  params,
}: OfflineGamePageProps) {
  const { slug } = await params;
  const game = offlineGames.find((item) => item.slug === slug);

  if (!game) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 pb-16 pt-10 sm:px-8 lg:px-10">
      <Link
        href="/"
        className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700"
      >
        ← Back to Hub
      </Link>

      <header className="rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-neon">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/50">
          Offline Game
        </p>
        <h1 className="mt-3 text-hero font-semibold text-ink">{game.title}</h1>
        <p className="mt-3 text-base text-ink/70">{game.description}</p>
        <p className="mt-2 text-sm text-ink/60">{game.details}</p>
      </header>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
        <h2 className="text-lg font-semibold text-ink">Props Needed</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {game.props.map((prop) => (
            <span
              key={prop}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              {prop}
            </span>
          ))}
        </div>
      </section>

      {(game.slug === "pictionary" ||
        game.extraComponents.includes("Random word generator")) && (
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
          <RandomWordGenerator />
        </section>
      )}

      {(game.slug === "pictionary" ||
        game.extraComponents.includes("Sketch timer")) && (
        <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
          <Timer initialSeconds={60} />
        </section>
      )}

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
        <h2 className="text-lg font-semibold text-ink">How to Play</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm text-ink/70">
          {game.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-6 shadow-neon">
        <h2 className="text-lg font-semibold text-ink">Extra Components</h2>
        <p className="mt-2 text-sm text-ink/60">
          Optional tools or helpers that can enhance this game.
        </p>
        {game.extraComponents.length === 0 ? (
          <p className="mt-3 text-sm font-semibold text-ink/60">
            None required.
          </p>
        ) : (
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-ink/70">
            {game.extraComponents.map((component) => (
              <li key={component}>{component}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
