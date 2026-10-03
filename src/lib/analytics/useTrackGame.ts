"use client";

import { useEffect, useRef } from "react";

import { track } from "./client";

/**
 * Reports game_start (leaving setup) and game_over (reaching gameover) from a
 * game's `phase`. The first hydrated phase is only a baseline, so resuming a
 * saved game doesn't count as a new start.
 */
export function useTrackGame(game: string, phase: string, hydrated: boolean) {
  const prev = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const last = prev.current;
    prev.current = phase;
    if (last === null || last === phase) return;
    if (phase === "gameover") track("game_over", { game });
    else if (last === "setup") track("game_start", { game });
  }, [game, phase, hydrated]);
}
