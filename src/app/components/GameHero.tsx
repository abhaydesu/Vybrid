import Link from "next/link";

import type { CatalogGame } from "@/lib/games";
import Character from "./Character";
import { BackIcon, ClockIcon, PhoneIcon, UsersIcon } from "./Icons";

/** Header for game pages that are just tools for now (no full play mode). */
export default function GameHero({ game }: { game: CatalogGame }) {
  return (
    <div>
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 font-semibold text-ink-soft transition-colors hover:text-ink"
      >
        <BackIcon width={18} height={18} /> All games
      </Link>
      <header className="mt-8 grid items-center gap-8 lg:mt-12 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-1.5 font-medium text-ink-soft">
            <PhoneIcon width={16} height={16} /> Plays on screen
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.75rem,8vw,5rem)] font-bold leading-[0.95] tracking-[-0.035em] text-ink">
            {game.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink">
            {game.tagline}
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-medium text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <UsersIcon width={18} height={18} /> {game.players} players
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon width={18} height={18} /> {game.duration}
            </span>
          </p>
        </div>
        <Character
          kind={game.character}
          tone={game.tone}
          className="hidden h-48 w-48 animate-bob lg:inline-grid"
        />
      </header>
    </div>
  );
}
