import type { Metadata } from "next";

import GameDetails from "@/app/components/GameDetails";
import { onScreenGames } from "@/lib/games";
import { top9Guide } from "@/lib/top9/guide";
import { playProps } from "../playable";

export const metadata: Metadata = {
  title: "Top 9 | Vybrid",
};

const game = onScreenGames.find((g) => g.slug === "top-9")!;

export default function TopNinePage() {
  return (
    <GameDetails
      title={game.title}
      description={game.tagline}
      details={top9Guide.details}
      tone={game.tone}
      character={game.character}
      players={game.players}
      duration={game.duration}
      onScreen
      kit={top9Guide.kit}
      builtIn={top9Guide.builtIn}
      steps={top9Guide.steps}
      note={top9Guide.note}
      play={playProps("top-9")}
    />
  );
}
