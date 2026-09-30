"use client";

import { useState } from "react";

import type { CatalogGame } from "@/lib/games";
import GameCard from "./GameCard";

const filters = [
  { id: "all", label: "All", tone: "yellow", test: () => true },
  {
    id: "on-screen",
    label: "On screen",
    tone: "blue",
    test: (g: CatalogGame) => g.kind === "on-screen",
  },
  {
    id: "offline",
    label: "In person",
    tone: "orange",
    test: (g: CatalogGame) => g.kind === "offline",
  },
  {
    id: "no-props",
    label: "Nothing to grab",
    tone: "green",
    test: (g: CatalogGame) => g.needs.length === 0,
  },
] as const;

type FilterId = (typeof filters)[number]["id"];

export default function GameCatalogue({ games }: { games: CatalogGame[] }) {
  const [active, setActive] = useState<FilterId>("all");
  const filter = filters.find((f) => f.id === active) ?? filters[0];
  const visible = games.filter(filter.test);

  return (
    <>
      <div
        role="toolbar"
        aria-label="Filter games"
        className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-3 pt-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={active === f.id}
            onClick={() => setActive(f.id)}
            className={`keycap tone-${f.tone} h-11 shrink-0 px-4 text-sm`}
          >
            {f.label}
            <span className="rounded-md bg-black/5 px-1.5 text-xs tabular-nums">
              {games.filter(f.test).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((game) => (
          <GameCard key={game.slug} game={game} />
        ))}
      </div>
    </>
  );
}
