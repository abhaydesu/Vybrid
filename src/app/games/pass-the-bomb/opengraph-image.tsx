import { onScreenGames } from "@/lib/games";
import { OG_SIZE, shareCard } from "@/lib/og/card";

export const size = OG_SIZE;
export const contentType = "image/png";

const game = onScreenGames.find((g) => g.slug === "pass-the-bomb")!;
export const alt = `${game.title}, on Baithak`;

export default function Image() {
  return shareCard({
    eyebrow: "Plays on one phone",
    lines: [game.title],
    subtitle: `${game.players} players · ${game.duration}`,
    tone: game.tone,
  });
}
