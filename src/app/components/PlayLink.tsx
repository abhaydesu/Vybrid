"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

interface PlayLinkProps {
  href: string;
  storageKey: string;
  className?: string;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function hasGameInProgress(storageKey: string) {
  try {
    const phase = JSON.parse(localStorage.getItem(storageKey) ?? "null")?.state
      ?.phase;
    return Boolean(phase) && phase !== "setup" && phase !== "gameover";
  } catch {
    return false;
  }
}

/** "Play now", or "Resume game" when a saved game is mid-way. */
export default function PlayLink({
  href,
  storageKey,
  className,
}: PlayLinkProps) {
  const inProgress = useSyncExternalStore(
    subscribe,
    () => hasGameInProgress(storageKey),
    () => false,
  );

  return (
    <Link href={href} className={className}>
      {inProgress ? "Resume game" : "Play now"}
    </Link>
  );
}
