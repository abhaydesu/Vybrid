import Link from "next/link";

import type { CatalogGame } from "@/lib/games";
import Character from "./Character";
import { BackIcon, ClockIcon, PhoneIcon, UsersIcon } from "./Icons";
import Studs from "./Studs";

export default function GameHero({ game }: { game: CatalogGame }) {
  return (
    <>
      <Link href="/games" className="keycap tone-white h-10 w-fit px-3 text-sm">
        <BackIcon width={18} height={18} /> All games
      </Link>
      <header className={`brick tone-${game.tone} p-5 sm:p-8`}>
        <Studs count={4} />
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <span className="chip">
              <PhoneIcon width={13} height={13} /> Plays on screen
            </span>
            <h1 className="mt-3 font-display text-[clamp(2.3rem,10vw,4rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
              {game.title}
            </h1>
          </div>
          <Character
            kind={game.character}
            tone={game.tone}
            bare
            className="-mt-2 h-28 w-24 shrink-0 animate-bob sm:h-40 sm:w-36"
          />
        </div>
        <p className="mt-3 max-w-xl text-lg leading-snug text-ink/80">
          {game.tagline}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip">
            <UsersIcon width={14} height={14} /> {game.players} players
          </span>
          <span className="chip">
            <ClockIcon width={14} height={14} /> {game.duration}
          </span>
        </div>
      </header>
    </>
  );
}
