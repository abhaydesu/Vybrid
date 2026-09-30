import Link from "next/link";
import type { ReactNode } from "react";

import { BackIcon } from "./Icons";

/** The /play page every game shares: a way back to the rules, then the game. */
export default function GamePlayShell({
  title,
  detailsHref,
  children,
}: {
  title: string;
  detailsHref: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-4 sm:px-6 md:pt-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={detailsHref}
          className="keycap tone-white h-10 shrink-0 px-3 text-sm"
        >
          <BackIcon width={18} height={18} /> Rules & kit
        </Link>
        <h1 className="truncate font-display text-2xl font-extrabold tracking-tight">
          {title}
        </h1>
      </div>
      {children}
    </main>
  );
}
