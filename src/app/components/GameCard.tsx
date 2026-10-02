import Link from "next/link";

import type { CatalogGame } from "@/lib/games";
import Character from "./Character";
import { ArrowIcon, ClockIcon, UsersIcon } from "./Icons";

interface GameCardProps {
  game: CatalogGame;
  className?: string;
}

/**
 * A game as a neutral LEGO brick: studs on top, a chunky edge that presses
 * down when tapped. The mascot is the only colour on it.
 */
export default function GameCard({ game, className = "" }: GameCardProps) {
  return (
    <Link
      href={game.href}
      className={`lego-card group flex h-full flex-col p-6 lg:p-7 ${className}`}
    >
      <span className="lego-card-studs" aria-hidden="true">
        <span />
        <span />
      </span>

      <div className="flex items-start justify-between gap-3">
        <h3 className="pt-1 font-display text-2xl font-bold leading-tight tracking-[-0.01em] text-ink lg:text-[1.65rem]">
          {game.title}
        </h3>
        <Character
          kind={game.character}
          tone={game.tone}
          className="-mr-1 -mt-2 h-[4.5rem] w-[4.5rem] shrink-0"
        />
      </div>
      <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-soft">
        {game.tagline}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <div className="flex flex-wrap gap-1.5">
          <span className="lego-chip">
            <UsersIcon width={14} height={14} /> {game.players}
          </span>
          <span className="lego-chip">
            <ClockIcon width={14} height={14} /> {game.duration}
          </span>
        </div>
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-[1.5px] border-[#e4e2dc] bg-white text-ink transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          <ArrowIcon width={18} height={18} />
        </span>
      </div>
    </Link>
  );
}
