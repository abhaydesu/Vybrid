import type { MetadataRoute } from "next";

import { allGames } from "@/lib/games";
import { absoluteUrl } from "@/lib/site";

/** Public pages only; the /play game screens are kept out of search. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/games"), changeFrequency: "weekly", priority: 0.9 },
    ...allGames.map((game) => ({
      url: absoluteUrl(game.href),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: absoluteUrl("/tools"), changeFrequency: "monthly", priority: 0.5 },
  ];
}
