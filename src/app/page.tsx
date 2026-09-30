import Link from "next/link";

import Character from "./components/Character";
import GameCard from "./components/GameCard";
import { GridIcon } from "./components/Icons";
import SectionHeading from "./components/SectionHeading";
import Studs from "./components/Studs";
import SurpriseButton from "./components/SurpriseButton";
import { allGames, onScreenGames } from "@/lib/games";

const steps = [
  {
    tone: "blue",
    title: "Pick a game",
    body: "Browse by how you want to play and what you have lying around.",
  },
  {
    tone: "yellow",
    title: "Check the kit",
    body: "Every game lists exactly what you need. Usually just this phone.",
  },
  {
    tone: "green",
    title: "Play right here",
    body: "Timers, word decks, rules and scores live on the page.",
  },
] as const;

export default function Home() {
  const inPerson = allGames.filter((game) => game.kind === "offline");

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pt-6 sm:px-6 md:pt-10">
      {/* Hero */}
      <section className="grid items-center gap-8 md:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="chip tone-green mb-5 bg-white">
            <span className="h-2 w-2 rounded-full bg-[#25b35f]" />
            {allGames.length} games, zero setup
          </p>
          <h1 className="font-display text-[clamp(2.75rem,11vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            <span className="tone-yellow brick brick-flat inline-block -rotate-2 px-3 py-0.5">
              Game
            </span>{" "}
            night,
            <br />
            <span className="scribble-underline">sorted.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Rules, timers, word decks and scorekeeping for your next hangout.
            Everything the game needs is on this one page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/games" className="btn tone-red">
              <GridIcon width={18} height={18} />
              Browse games
            </Link>
            <SurpriseButton className="btn tone-yellow" />
          </div>
        </div>

        <HeroCrew />
      </section>

      {/* How it works */}
      <section>
        <SectionHeading eyebrow="How it works" title="Three taps to chaos" />
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={`brick brick-flat tone-${step.tone} flex items-start gap-4 p-5`}
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-[var(--tone-dark)] bg-white font-display text-lg font-extrabold shadow-[0_3px_0_var(--tone-dark)]">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-1 text-sm leading-snug text-ink/70">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* On-screen games */}
      <section>
        <SectionHeading
          eyebrow="Plays on screen"
          title="Pass the phone around"
          description="The whole game runs on your device. Just gather everyone round."
        />
        <div className="mt-8 grid gap-7 md:grid-cols-2">
          {onScreenGames.map((game) => (
            <GameCard key={game.slug} game={game} featured />
          ))}
        </div>
      </section>

      {/* In-person games */}
      <section>
        <SectionHeading
          eyebrow="Play in person"
          title="Classics, with a co-host"
          description="Clear rules plus built-in timers and prompt decks, so nobody has to be the one on their phone."
        />
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {inPerson.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="brick tone-purple mt-2 overflow-visible p-6 sm:p-10">
        <Studs count={4} />
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Can&apos;t decide?
            </h2>
            <p className="mt-2 max-w-sm text-ink/75">
              Let fate pick. Tap the button and we&apos;ll drop you straight
              into a game.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Character
              kind="fibber"
              tone="purple"
              bare
              className="h-24 w-20 animate-wobble"
            />
            <SurpriseButton className="btn tone-purple" label="Roll a game" />
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroCrew() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-md">
      {/* Floating bricks */}
      <span className="brick brick-flat tone-blue absolute left-[4%] top-[6%] h-12 w-20 rotate-[-10deg]" />
      <span className="brick brick-flat tone-pink absolute right-[2%] top-[2%] h-10 w-10 rotate-12" />
      <span className="brick brick-flat tone-green absolute bottom-[6%] right-[10%] h-9 w-16 rotate-6" />

      <Character
        kind="host"
        tone="yellow"
        className="animate-bob absolute left-[30%] top-[4%] w-[40%]"
      />
      <Character
        kind="artist"
        tone="blue"
        className="animate-bob absolute bottom-0 left-0 w-[38%] [animation-delay:-1.2s]"
      />
      <Character
        kind="bomber"
        tone="red"
        className="animate-bob absolute bottom-[2%] right-0 w-[38%] [animation-delay:-2.4s]"
      />
    </div>
  );
}
