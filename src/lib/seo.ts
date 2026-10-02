import type { Metadata } from "next";

import { absoluteUrl, SITE } from "./site";

/** "3–15" → {min 3, max 15}; "4+" → {min 4}. */
function playerRange(players: string) {
  const [min, max] = players.split(/[–-]/).map((n) => parseInt(n, 10));
  return {
    "@type": "QuantitativeValue",
    minValue: Number.isFinite(min) ? min : undefined,
    maxValue: Number.isFinite(max) ? max : undefined,
  };
}

/** "20–40 min" → "PT20M" (the shortest game). */
function isoMinutes(duration: string) {
  const min = parseInt(duration, 10);
  return Number.isFinite(min) ? `PT${min}M` : undefined;
}

/** Splits "Setup: do the thing" into a step name and text. */
function stepParts(step: string) {
  const match = step.match(/^([^:]{2,28}):\s*(.*)$/);
  return match
    ? { name: match[1], text: match[2] }
    : { name: step.split(/[.!?]/)[0], text: step };
}

export interface GameSeoInput {
  title: string;
  description: string;
  path: string;
  players: string;
  duration: string;
  kit: string[];
  steps: string[];
}

/**
 * Structured data for a game's details page: the game itself, how to play it
 * (rules as steps, kit as supplies), and where it sits on the site.
 */
export function gameJsonLd(game: GameSeoInput) {
  const url = absoluteUrl(game.path);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Game",
        "@id": `${url}#game`,
        name: game.title,
        description: game.description,
        url,
        numberOfPlayers: playerRange(game.players),
        timeRequired: isoMinutes(game.duration),
        inLanguage: SITE.language,
        isPartOf: { "@id": `${SITE.url}/#website` },
      },
      ...(game.steps.length
        ? [
            {
              "@type": "HowTo",
              "@id": `${url}#how-to-play`,
              name: `How to play ${game.title}`,
              description: game.description,
              totalTime: isoMinutes(game.duration),
              supply: game.kit.map((name) => ({ "@type": "HowToSupply", name })),
              step: game.steps.map((step, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                ...stepParts(step),
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Games", item: absoluteUrl("/games") },
          { "@type": "ListItem", position: 3, name: game.title, item: url },
        ],
      },
    ],
  };
}

/** One-line description for a game page's <meta name="description">. */
export function gameMetaDescription(game: {
  description: string;
  players: string;
  duration: string;
  playable: boolean;
}) {
  const extra = game.playable
    ? "Rules, kit and a built-in game for one phone."
    : "Rules and what you need.";
  return `${game.description} ${extra} ${game.players} players, ${game.duration}.`;
}

/**
 * Title, description, canonical and share-card text for a page.
 */
export function pageMetadata({
  title,
  description,
  path,
  siteCard = false,
}: {
  title: string;
  description: string;
  path: string;
  /**
   * Use the site-wide share card. Leave off for pages with their own
   * opengraph-image file, since setting images here would override it.
   */
  siteCard?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      ...(siteCard && { images: ["/opengraph-image"] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(siteCard && { images: ["/opengraph-image"] }),
    },
  };
}
