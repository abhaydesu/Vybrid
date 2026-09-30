import { notFound } from "next/navigation";

import GamePlayShell from "@/app/components/GamePlayShell";
import { offlineGames } from "@/lib/offlineGames";
import { playableGames } from "../../../playable";

interface PlayPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return offlineGames
    .filter((game) => playableGames[game.slug])
    .map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = offlineGames.find((item) => item.slug === slug);
  return { title: game ? `Play ${game.title} | Vybrid` : "Vybrid" };
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = offlineGames.find((item) => item.slug === slug);
  const playable = playableGames[slug];

  if (!game || !playable) {
    notFound();
  }

  const { Game } = playable;
  return (
    <GamePlayShell title={game.title} detailsHref={playable.detailsHref}>
      <Game />
    </GamePlayShell>
  );
}
