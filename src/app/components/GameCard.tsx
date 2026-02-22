"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GameCardProps {
  title: string;
  description: string;
  href: string;
  accent: "blue" | "sky" | "ice" | "navy";
}

const accentMap: Record<GameCardProps["accent"], string> = {
  blue: "from-blue-100 via-surface to-surface",
  sky: "from-blue-50 via-surface to-surface",
  ice: "from-blue-100/70 via-surface to-surface",
  navy: "from-blue-300/40 via-surface to-surface",
};

export default function GameCard({
  title,
  description,
  href,
  accent,
}: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="h-full"
    >
      <Link
        href={href}
        className={`flex h-full flex-col gap-4 rounded-3xl border border-blue-100 bg-gradient-to-br ${accentMap[accent]} p-6 shadow-neon`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink/60">
            Game
          </span>
          <span className="rounded-full border border-blue-100 px-3 py-1 text-[0.65rem] font-semibold text-ink/70">
            Ready
          </span>
        </div>
        <div>
          <h3 className="text-hero font-semibold text-ink">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            {description}
          </p>
        </div>
        <div className="mt-auto text-sm font-semibold text-blue-700">
          Launch →
        </div>
      </Link>
    </motion.div>
  );
}
