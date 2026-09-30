import type { Top9Answer } from "./types";

const FILLER = new Set([
  "a",
  "an",
  "the",
  "my",
  "your",
  "some",
  "their",
  "his",
  "her",
]);

function singular(word: string) {
  if (word.length <= 3) return word;
  if (/(ch|sh|x|o)es$/.test(word)) return word.slice(0, -2); // matches, tomatoes
  if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

/** Lowercase, strip accents, punctuation and filler words; optionally singularise. */
export function normalizeGuess(text: string, singularise = true) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w))
    .map((w) => (singularise ? singular(w) : w))
    .join(" ");
}

/** Plain and singularised spellings, so "chees" still reaches "cheese". */
function variants(text: string) {
  return [
    ...new Set([normalizeGuess(text, false), normalizeGuess(text)]),
  ].filter(Boolean);
}

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const temp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diag = temp;
    }
  }
  return prev[b.length];
}

/** Typos allowed, scaled to the length of the answer. */
function allowedTypos(length: number) {
  if (length <= 4) return 0;
  if (length <= 8) return 1;
  return 2;
}

function forms(answer: Top9Answer) {
  return [answer.text, ...(answer.aliases ?? [])].flatMap(variants);
}

/**
 * Finds which answer a typed guess refers to. Tries exact and near-exact
 * matches across every answer first, then falls back to whole-word
 * containment ("a phone charger" → "charger").
 *
 * Answers in `exclude` (already on the board) still take part in matching, so
 * "sick" finds the revealed "Sick" rather than sliding onto "Grandma is sick".
 * If the best match is excluded, the result is null.
 */
export function matchGuess(
  guess: string,
  answers: Top9Answer[],
  exclude: number[] = [],
): number | null {
  const guesses = variants(guess);
  if (!guesses.length) return null;
  const g = normalizeGuess(guess);
  const pick = (index: number) => (exclude.includes(index) ? null : index);

  const candidates = answers.map((answer, index) => ({
    index,
    forms: forms(answer),
  }));

  for (const c of candidates) {
    const close = c.forms.some((f) =>
      guesses.some(
        (v) => v === f || levenshtein(f, v) <= allowedTypos(f.length),
      ),
    );
    if (close) return pick(c.index);
  }

  const guessWords = g.split(" ");
  for (const c of candidates) {
    const hit = c.forms.some((f) => {
      const formWords = f.split(" ");
      // A multi-word guess that contains the whole answer, or a guess that is
      // one meaningful word of a longer answer.
      const answerInGuess = f.length >= 3 && ` ${g} `.includes(` ${f} `);
      const guessInAnswer =
        guessWords.length === 1 && g.length >= 4 && formWords.includes(g);
      return answerInGuess || guessInAnswer;
    });
    if (hit) return pick(c.index);
  }

  return null;
}

/** True when the guess matches an answer that's already on the board. */
export function isAlreadyRevealed(
  guess: string,
  answers: Top9Answer[],
  revealed: number[],
) {
  const index = matchGuess(guess, answers);
  return index !== null && revealed.includes(index);
}
