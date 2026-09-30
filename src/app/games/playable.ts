import type { ComponentType } from "react";

import PictionaryGame from "@/app/components/pictionary/PictionaryGame";
import Top9Game from "@/app/components/top9/Top9Game";
import { STORAGE_KEYS } from "@/lib/storageKeys";

export interface PlayableGame {
  Game: ComponentType;
  /** Where the game saves progress, used to offer "Resume game". */
  storageKey: string;
  /** The details page; the game itself lives at `${detailsHref}/play`. */
  detailsHref: string;
  /** One line on the "Play now" card. */
  pitch: string;
}

/**
 * Games with a full play mode. Each one follows the same structure: a details
 * page (what you need + how to play + "Play now"), and the game on /play.
 */
export const playableGames: Record<string, PlayableGame> = {
  pictionary: {
    Game: PictionaryGame,
    storageKey: STORAGE_KEYS.pictionary,
    detailsHref: "/games/offline/pictionary",
    pitch: "Set up teams and let this phone run the game.",
  },
  "top-9": {
    Game: Top9Game,
    storageKey: STORAGE_KEYS.top9,
    detailsHref: "/games/top-9",
    pitch: "Name your teams, pick a host (or don't), and bring up the board.",
  },
};

export function playProps(slug: string) {
  const game = playableGames[slug];
  if (!game) return undefined;
  return {
    href: `${game.detailsHref}/play`,
    storageKey: game.storageKey,
    pitch: game.pitch,
  };
}
