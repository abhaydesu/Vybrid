import Link from "next/link";
import type { ReactNode } from "react";

export type LegoColor =
  | "red"
  | "yellow"
  | "blue"
  | "green"
  | "orange"
  | "pink"
  | "purple"
  | "black"
  | "white";

/** The studs on top of a LEGO button or card. */
export function LegoStuds({ count = 3, className = "lego-studs" }: { count?: number; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}

const TONE_COLORS = new Set(["red", "yellow", "blue", "green", "orange", "pink", "purple"]);

/** LEGO colour for a game tone; anything else gets black. */
export const legoFor = (tone: string): LegoColor =>
  TONE_COLORS.has(tone) ? (tone as LegoColor) : "black";

/**
 * The one primary action on a page: a chunky LEGO brick, studs and all.
 * Keep it to one per view so it stays the obvious thing to tap.
 */
export default function LegoButton({
  href,
  children,
  color = "red",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  color?: LegoColor;
  size?: "md" | "lg";
  className?: string;
}) {
  const studs = size === "lg" ? 4 : 3;
  return (
    <Link
      href={href}
      className={`lego-btn lego-${color} ${size === "lg" ? "lego-lg" : ""} ${className}`}
    >
      <LegoStuds count={studs} />
      {children}
    </Link>
  );
}
