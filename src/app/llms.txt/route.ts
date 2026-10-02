import { faqs } from "@/lib/faq";
import { allGames } from "@/lib/games";
import { absoluteUrl, SITE } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt: a plain-text map of the site for AI assistants and answer
 * engines (https://llmstxt.org), built from the same data as the pages.
 */
export function GET() {
  const games = allGames
    .map(
      (g) =>
        `- [${g.title}](${absoluteUrl(g.href)}): ${g.tagline} ${g.players} players, ${g.duration}.`,
    )
    .join("\n");
  const questions = faqs.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n");

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is for playing party games in person. One phone runs the game: rules, timers, word decks and scores. Each game page lists what you need and how to play, step by step.

## Games

${games}

## Other pages

- [All games](${absoluteUrl("/games")}): the full catalogue, filterable by how you play and what you have.
- [Tools](${absoluteUrl("/tools")}): a standalone game timer and random word deck.

## FAQ

${questions}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
