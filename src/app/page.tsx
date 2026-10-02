import type { Metadata } from "next";
import Link from "next/link";

import Mascot, { type MascotKind, type MascotMood } from "./components/Mascot";
import Faq from "./components/Faq";
import GameCard from "./components/GameCard";
import HeroShowcase from "./components/HeroShowcase";
import JsonLd from "./components/JsonLd";
import LegoBuilder from "./components/LegoBuilder";
import LegoButton from "./components/LegoButton";
import SectionHeading from "./components/SectionHeading";
import { faqJsonLd, faqs } from "@/lib/faq";
import { allGames } from "@/lib/games";
import { absoluteUrl, SITE } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const steps: Array<{
  mascot: MascotKind;
  mood: MascotMood;
  color?: string;
  title: string;
  body: string;
}> = [
  {
    mascot: "kulfi",
    mood: "happy",
    color: "#1fbf6a",
    title: "Pick a game",
    body: "Imposter, Pictionary, a Family Feud-style survey game and more. Each one tells you exactly what you need.",
  },
  {
    mascot: "didi",
    mood: "wink",
    color: "#7c5cff",
    title: "Pass the phone",
    body: "Secret words and roles show up for one person at a time. Everyone else, eyes off the screen.",
  },
  {
    mascot: "samosa",
    mood: "cheer",
    title: "Play, we keep score",
    body: "Timers, turns and points are handled, so nobody has to sit out to run the game.",
  },
];

/** The three games that run start to finish on one phone. */
const FEATURED = ["imposter", "pictionary", "top-9"];

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: absoluteUrl("/"),
      description: SITE.description,
      inLanguage: SITE.language,
    },
    {
      "@type": "ItemList",
      name: `Party games on ${SITE.name}`,
      itemListElement: allGames.map((game, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: game.title,
        url: absoluteUrl(game.href),
      })),
    },
  ],
};

export default function Home() {
  const featured = FEATURED.map((slug) => allGames.find((g) => g.slug === slug)!);

  return (
    <main>
      <JsonLd data={siteJsonLd} />
      <JsonLd data={faqJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-8 lg:pb-24 lg:pt-6">
          <div>
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[5.25rem] lg:leading-[0.98]">
              Party games for every{" "}
              <span className="marker whitespace-nowrap">baithak.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[1.08rem] leading-relaxed text-ink-soft sm:text-xl lg:mt-6">
              Imposter, Pictionary, a Family Feud-style quiz and more. Pass one
              phone around and it deals the words, runs the timer and keeps
              score, so everyone just plays.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-6">
              <LegoButton href="/games" size="lg" className="w-full sm:w-auto">
                Pick a game
              </LegoButton>
              <Link
                href="#how"
                className="self-center font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-ink sm:mt-2"
              >
                How it works
              </Link>
            </div>
          </div>

          <HeroShowcase />
        </div>
      </section>

      {/* How it works */}
      <section id="how" aria-labelledby="how-title" className="scroll-mt-20 bg-paper-deep">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            id="how-title"
            title="One phone. Everyone in."
            description="No boards, no cards, no setup. Just the people you're with."
          />
          <ol className="mt-12 grid gap-10 sm:grid-cols-3 lg:mt-16 lg:gap-12">
            {steps.map((step, i) => (
              // "group": hovering a step boings its mascot, like the game cards.
              <li key={step.title} className="group">
                <Mascot
                  kind={step.mascot}
                  mood={step.mood}
                  color={step.color}
                  className="h-20 w-20"
                  delay={i * 1.1}
                />
                <h3 className="mt-4 font-display text-2xl font-bold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-lg leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured games */}
      <section aria-labelledby="games-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            id="games-title"
            title="Start with a favourite"
            description="These three run start to finish on one phone."
          />
          <Link
            href="/games"
            className="font-semibold text-ink underline decoration-line decoration-2 underline-offset-[6px] transition-colors hover:decoration-ink"
          >
            All {allGames.length} games →
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3 lg:mt-16">
          {featured.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </section>

      {/* LEGO corner */}
      <section aria-labelledby="lego-title" className="bg-paper-deep">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:gap-16 lg:px-8 lg:py-28">
          <div>
            <SectionHeading
              id="lego-title"
              title="Waiting for everyone to turn up?"
              description="Build something while the chai brews. Drag bricks onto the plate, stack them up, tap one to paint it."
            />
          </div>
          <LegoBuilder />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.7fr] lg:gap-16 lg:px-8 lg:py-28">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="faq-title"
              title="Questions, answered"
              description="What people ask before their first game night."
            />
            <div className="mt-8 hidden items-end gap-2 lg:flex">
              {(
                [
                  { kind: "uncle", mood: "shifty", color: "#2f7bff", size: "h-20 w-20" },
                  { kind: "golgappa", mood: "sweaty", size: "h-16 w-16" },
                  { kind: "jalebi", mood: "wink", size: "h-16 w-16" },
                ] as const
              ).map((m, i) => (
                <span key={m.kind} className="group">
                  <Mascot
                    kind={m.kind}
                    mood={m.mood}
                    color={"color" in m ? m.color : undefined}
                    className={m.size}
                    delay={i * 0.6}
                  />
                </span>
              ))}
            </div>
          </div>
          <Faq items={faqs} />
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-paper-deep px-6 py-14 text-center sm:px-12 lg:py-20">
          <div aria-hidden="true" className="mx-auto flex w-fit items-end gap-3">
            <Mascot kind="uncle" mood="cheer" color="#ffc21a" className="h-16 w-16" delay={0.4} />
            <Mascot kind="laddoo" mood="happy" className="h-16 w-16" />
            <Mascot kind="didi" mood="wink" color="#ff4f9a" className="h-16 w-16" delay={1.8} />
          </div>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-4xl lg:text-[3.25rem]">
            Everyone&apos;s on the sofa. Let&apos;s play.
          </h2>
          <LegoButton href="/games" color="yellow" size="lg" className="mt-8">
            Pick a game
          </LegoButton>
        </div>
      </section>
    </main>
  );
}
