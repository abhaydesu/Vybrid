"use client";

import { useRouter } from "next/navigation";

import { allGames } from "@/lib/games";
import { ShuffleIcon } from "./Icons";

interface SurpriseButtonProps {
  className?: string;
  compact?: boolean;
  label?: string;
}

export default function SurpriseButton({
  className,
  compact = false,
  label,
}: SurpriseButtonProps) {
  const router = useRouter();

  function pick() {
    const game = allGames[Math.floor(Math.random() * allGames.length)];
    router.push(game.href);
  }

  return (
    <button type="button" onClick={pick} className={className}>
      <ShuffleIcon width={compact ? 22 : 18} height={compact ? 22 : 18} />
      {label ?? (compact ? "Random" : "Surprise me")}
    </button>
  );
}
