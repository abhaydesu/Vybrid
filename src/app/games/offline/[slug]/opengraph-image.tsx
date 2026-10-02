import { OG_SIZE, shareCard } from "@/lib/og/card";
import { offlineGames } from "@/lib/offlineGames";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "How to play this game, on Baithak";

export function generateStaticParams() {
  return offlineGames.map((game) => ({ slug: game.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = offlineGames.find((g) => g.slug === slug);
  return shareCard({
    eyebrow: "How to play",
    lines: [game?.title ?? "Baithak"],
    subtitle: game
      ? `${game.players} players · ${game.duration} · rules and tools on one phone`
      : "Party games on one phone.",
    tone: game?.tone,
  });
}
