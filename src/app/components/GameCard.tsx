import Link from "next/link";

import type { CatalogGame } from "@/lib/games";
import Character from "./Character";
import { ArrowIcon, ClockIcon, PhoneIcon, UsersIcon } from "./Icons";
import Studs from "./Studs";

interface GameCardProps {
  game: CatalogGame;
  featured?: boolean;
}

export default function GameCard({ game, featured = false }: GameCardProps) {
  return (
    <Link
      href={game.href}
      className={`brick brick-press tone-${game.tone} group mt-3 flex h-full flex-col p-5 ${
        featured ? "sm:p-6" : ""
      }`}
    >
      <Studs count={featured ? 3 : 2} />

      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <span className="chip">
            {game.kind === "on-screen" ? (
              <>
                <PhoneIcon width={13} height={13} /> Plays on screen
              </>
            ) : (
              "Play in person"
            )}
          </span>
          <h3
            className={`mt-3 font-display font-extrabold leading-[1.05] tracking-tight ${
              featured ? "text-3xl sm:text-4xl" : "text-2xl"
            }`}
          >
            {game.title}
          </h3>
        </div>
        <Character
          kind={game.character}
          tone={game.tone}
          bare
          className={`shrink-0 -mb-2 -mt-1 transition-transform duration-300 ease-[var(--ease-bounce)] group-hover:-rotate-6 group-hover:scale-105 ${
            featured ? "h-28 w-24 sm:h-32 sm:w-28" : "h-24 w-20"
          }`}
        />
      </div>

      <p className="mt-2 text-[0.95rem] leading-snug text-ink/75">
        {game.tagline}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div className="flex flex-wrap gap-1.5">
          <span className="chip">
            <UsersIcon width={13} height={13} /> {game.players}
          </span>
          <span className="chip">
            <ClockIcon width={13} height={13} /> {game.duration}
          </span>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-[var(--tone-dark)] bg-white/80 shadow-[inset_0_1px_0_#fff] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowIcon width={18} height={18} />
        </span>
      </div>
    </Link>
  );
}
