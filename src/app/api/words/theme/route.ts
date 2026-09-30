import { NextResponse } from "next/server";

/**
 * Builds a themed word deck ("beach", "wedding", "space"…) from Datamuse
 * (https://www.datamuse.com/api/), a free, key-less word API.
 *
 * Datamuse is great at "words that go with X" but noisy, so results are
 * filtered down to common-ish single nouns. The drawer always picks from a
 * hand of options, so an occasional odd word is harmless.
 */

interface DatamuseWord {
  word: string;
  score?: number;
  tags?: string[];
}

const MAX_WORDS = 60;
const WEEK = 60 * 60 * 24 * 7;

// Words that slip through the noun filter but make poor or unsuitable prompts.
const BLOCKLIST = new Set([
  "thing", "things", "stuff", "way", "time", "people", "person", "place",
  "part", "kind", "type", "lot", "area", "use", "case", "fact", "state",
  "number", "system", "group", "world", "life", "day", "year", "man",
  "woman", "sex", "brothel", "drug", "drugs", "murder", "suicide", "rape",
  "cancer", "death", "funeral", "divorce", "pregnant", "affair", "war",
  "terrorism", "terrorist", "porn", "nazi", "slave", "slavery",
]);

async function datamuse(params: Record<string, string>) {
  const qs = new URLSearchParams({ md: "pf", ...params });
  const res = await fetch(`https://api.datamuse.com/words?${qs}`, {
    next: { revalidate: WEEK },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`Datamuse responded ${res.status}`);
  return (await res.json()) as DatamuseWord[];
}

const POS_TAGS = new Set(["n", "v", "adj", "adv", "u"]);
// Abstract-noun endings rarely make drawable prompts ("exploration", "wedlock").
const ABSTRACT = /(tion|sion|ness|ity|ment|ism|ship|ance|ence|ology|hood|dom|lock)$/;

function frequency(tags: string[]) {
  const tag = tags.find((t) => t.startsWith("f:"));
  return tag ? Number(tag.slice(2)) : 0;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const theme = (searchParams.get("q") ?? "").trim().toLowerCase();

  if (!/^[a-z][a-z \-']{1,30}$/.test(theme)) {
    return NextResponse.json(
      { error: "Pick a theme of 2–30 letters, like “beach” or “wedding”." },
      { status: 400 },
    );
  }

  let results: DatamuseWord[];
  try {
    // rel_trg = words that commonly show up alongside the theme. Datamuse's
    // "means like" (ml) skews to abstract synonyms, so it's only a fallback
    // for themes triggers don't know (often multi-word ones).
    results = await datamuse({ rel_trg: theme, max: "200" });
  } catch {
    return NextResponse.json(
      { error: "Couldn't reach the word service. Check your connection." },
      { status: 502 },
    );
  }

  let words = filterWords(results, theme);
  if (words.length < 10) {
    try {
      const related = await datamuse({ ml: theme, max: "200" });
      words = [...new Set([...words, ...filterWords(related, theme)])];
    } catch {
      // Keep whatever triggers gave us.
    }
  }

  return NextResponse.json(
    { theme, words: words.slice(0, MAX_WORDS), source: "datamuse" },
    { headers: { "Cache-Control": `public, s-maxage=${WEEK}` } },
  );
}

function filterWords(results: DatamuseWord[], theme: string) {
  const themeWords = new Set(theme.split(/\s+/));
  const kept = new Set<string>();

  for (const item of results) {
    const word = item.word.toLowerCase();
    const tags = item.tags ?? [];
    const freq = frequency(tags);
    // Datamuse lists parts of speech most-likely first; keep noun-first words.
    if (tags.find((t) => POS_TAGS.has(t)) !== "n") continue;
    if (tags.includes("prop")) continue;
    if (freq < 0.3 || freq > 400) continue;
    if (!/^[a-z][a-z \-]{2,18}$/.test(word)) continue;
    if (word.split(" ").length > 2 || ABSTRACT.test(word)) continue;
    if (BLOCKLIST.has(word) || themeWords.has(word)) continue;
    if (word.split(" ").some((part) => themeWords.has(part))) continue;
    kept.add(word);
  }

  // Drop simple plurals when the singular is also present ("cakes" / "cake").
  return [...kept].filter(
    (w) => !(w.endsWith("s") && kept.has(w.slice(0, -1))),
  );
}
