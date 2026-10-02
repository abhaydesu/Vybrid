import Link from "next/link";

import { allGames } from "@/lib/games";
import { SITE } from "@/lib/site";
import Mascot, { type MascotKind, type MascotMood } from "./Mascot";
import { LogoMark } from "./Logo";

const FRIENDS: Array<{ kind: MascotKind; mood: MascotMood; color?: string }> = [
  { kind: "uncle", mood: "happy", color: "#2f7bff" },
  { kind: "samosa", mood: "cheer" },
  { kind: "chai", mood: "wink" },
  { kind: "laddoo", mood: "happy" },
  { kind: "didi", mood: "happy", color: "#ff4f9a" },
  { kind: "golgappa", mood: "sweaty" },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-ink pb-28 text-white md:mt-32 md:pb-12">
      {/* The gang, peeking over the edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-[3.1rem] mx-auto flex max-w-6xl justify-end gap-1 px-6 lg:px-8"
      >
        {FRIENDS.map((f, i) => (
          <Mascot
            key={f.kind}
            kind={f.kind}
            mood={f.mood}
            color={f.color}
            className="h-14 w-14 sm:h-16 sm:w-16"
            delay={i * 0.7}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8 lg:pt-20">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="Baithak home">
            <LogoMark className="h-10" />
            <span className="font-display text-[1.7rem] font-bold leading-none tracking-[-0.02em]">
              baithak
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-white/70">
            Party games for friends and family, run from one phone. Rules,
            timers, words and scores, ready when everyone is.
          </p>
        </div>

        <nav aria-label="Games">
          <h2 className="font-display text-lg font-semibold">Games</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-white/70 lg:grid-cols-1">
            {allGames.map((game) => (
              <li key={game.slug}>
                <Link href={game.href} className="transition-colors hover:text-white">
                  {game.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Baithak">
          <h2 className="font-display text-lg font-semibold">{SITE.name}</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-white/70">
            <li>
              <Link href="/games" className="transition-colors hover:text-white">
                All games
              </Link>
            </li>
            <li>
              <Link href="/tools" className="transition-colors hover:text-white">
                Timer &amp; word deck
              </Link>
            </li>
            <li>
              <Link href="/#faq" className="transition-colors hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col gap-2 border-t border-white/10 px-6 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between lg:px-8">
        <p>
          © {new Date().getFullYear()} {SITE.name}
        </p>
        <p>Made for game nights across India.</p>
      </div>
    </footer>
  );
}
