import Link from "next/link";
import type { ReactNode } from "react";

import type { CharacterKind, Tone } from "@/lib/games";
import Character from "./Character";
import { BackIcon, ClockIcon, PhoneIcon, UsersIcon } from "./Icons";
import KitChecklist from "./KitChecklist";
import PlayLink from "./PlayLink";
import Studs from "./Studs";

export interface GameDetailsProps {
  title: string;
  description: string;
  details?: string;
  tone: Tone;
  character: CharacterKind;
  players: string;
  duration: string;
  onScreen?: boolean;
  /** Things to gather. */
  kit: string[];
  /** Kit items the site already provides. */
  builtIn?: string[];
  steps: string[];
  /** Small print under the rules. */
  note?: string;
  /** Games with a full play mode get a "Play now" flow to their /play page. */
  play?: { href: string; storageKey: string; pitch: string };
  /** Loose tools, for games without a play mode yet. */
  tools?: ReactNode;
}

/** Splits "Setup: do the thing" into a bold label and body. */
function splitStep(step: string) {
  const match = step.match(/^([^:]{2,28}):\s*(.*)$/);
  if (!match) return { label: null, body: step };
  const body = match[2].charAt(0).toUpperCase() + match[2].slice(1);
  return { label: match[1], body };
}

/**
 * The details page every game shares: hero, what you need, how to play, and
 * either a "Play now" button (games with a play mode) or loose tools.
 */
export default function GameDetails(props: GameDetailsProps) {
  const { title, tone, play, tools } = props;

  const kitSection = (
    <section className="brick tone-white p-5 sm:p-6">
      <Studs />
      <h2 className="font-display text-2xl font-extrabold tracking-tight">
        What you need
      </h2>
      <p className="mb-4 mt-1 text-sm text-ink/60">
        Tick things off as you gather them.
      </p>
      <KitChecklist items={props.kit} builtIn={props.builtIn} />
    </section>
  );

  const rulesSection = (
    <section
      id="rules"
      className="brick tone-white scroll-mt-24 overflow-hidden"
    >
      <Studs count={3} />
      <h2 className="px-5 pt-5 font-display text-2xl font-extrabold tracking-tight sm:px-6 sm:pt-6">
        How to play
      </h2>
      <ol className="mt-4">
        {props.steps.map((step, i) => {
          const { label, body } = splitStep(step);
          return (
            <li key={step}>
              {i > 0 && <div className="brick-divider mx-0" />}
              <div className="flex gap-4 px-5 py-4 sm:px-6">
                <span
                  className={`tone-${tone} grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border-2 border-[var(--tone-dark)] bg-[var(--tone)] font-display text-sm font-extrabold shadow-[inset_0_2px_0_rgb(255_255_255/0.6),0_3px_0_var(--tone-dark)]`}
                >
                  {i + 1}
                </span>
                <p className="pt-1 leading-relaxed text-ink/75">
                  {label && (
                    <strong className="font-bold text-ink">{label}. </strong>
                  )}
                  {body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      {props.note && (
        <>
          <div className="brick-divider" />
          <p className="px-5 py-4 text-sm text-ink/55 sm:px-6">{props.note}</p>
        </>
      )}
    </section>
  );

  const startCard = play && (
    <section
      className={`brick tone-${tone} flex flex-col items-center gap-4 p-6 text-center`}
    >
      <Studs count={3} />
      <h2 className="font-display text-2xl font-extrabold tracking-tight">
        Got the kit? Know the rules?
      </h2>
      <p className="-mt-2 text-ink/70">{play.pitch}</p>
      <PlayLink
        href={play.href}
        storageKey={play.storageKey}
        className={`btn tone-${tone} min-h-14 w-full text-lg`}
      />
    </section>
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-4 sm:px-6 md:pt-8">
      <Link href="/games" className="keycap tone-white h-10 w-fit px-3 text-sm">
        <BackIcon width={18} height={18} /> All games
      </Link>

      <header className={`brick tone-${tone} p-5 sm:p-8`}>
        <Studs count={4} />
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <span className="chip">
              {props.onScreen ? (
                <>
                  <PhoneIcon width={13} height={13} /> Plays on screen
                </>
              ) : (
                "Play in person"
              )}
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.3rem,10vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              {title}
            </h1>
          </div>
          <Character
            kind={props.character}
            tone={tone}
            bare
            className="-mt-2 h-28 w-24 shrink-0 animate-bob sm:h-40 sm:w-36"
          />
        </div>
        <p className="mt-3 max-w-xl text-lg leading-snug text-ink/80">
          {props.description}
        </p>
        {props.details && (
          <p className="mt-2 max-w-xl text-sm text-ink/60">{props.details}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="chip">
            <UsersIcon width={14} height={14} /> {props.players} players
          </span>
          <span className="chip">
            <ClockIcon width={14} height={14} /> {props.duration}
          </span>
        </div>
        <div className="brick-divider my-5" />
        <nav className="flex gap-2" aria-label="Jump to">
          <a href="#rules" className="btn btn-sm tone-white">
            Rules
          </a>
          {play ? (
            <PlayLink
              href={play.href}
              storageKey={play.storageKey}
              className={`btn btn-sm tone-${tone}`}
            />
          ) : (
            tools && (
              <a href="#tools" className={`btn btn-sm tone-${tone}`}>
                Open the tools
              </a>
            )
          )}
        </nav>
      </header>

      {play ? (
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div className="flex flex-col gap-10">
            {kitSection}
            <div className="hidden lg:block">{startCard}</div>
          </div>
          <div className="flex flex-col gap-10">
            {rulesSection}
            <div className="lg:hidden">{startCard}</div>
          </div>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div className="flex flex-col gap-10">
            {kitSection}
            {rulesSection}
          </div>
          {tools && (
            <section id="tools" className="flex scroll-mt-24 flex-col gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">
                  Game tools
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight">
                  Everything on the table
                </h2>
              </div>
              {tools}
            </section>
          )}
        </div>
      )}
    </main>
  );
}
