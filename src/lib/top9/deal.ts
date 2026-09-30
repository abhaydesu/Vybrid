import { shuffle } from "../words/deck";
import { questionCategories } from "./categories";
import type { Top9Question } from "./types";

export interface DealOptions {
  categories: string[];
  /** Question ids already played; avoided unless a category runs dry. */
  exclude: string[];
  perCategory: number;
}

/**
 * Deals up to `perCategory` fresh questions for each chosen category, with no
 * question dealt twice. A category whose fresh questions are used up is
 * refilled from its played ones, so the game never stalls.
 */
export function dealDeck(
  pool: Top9Question[],
  { categories, exclude, perCategory }: DealOptions,
) {
  const excluded = new Set(exclude);
  const byCategory = new Map<
    string,
    { fresh: Top9Question[]; played: Top9Question[] }
  >(categories.map((c) => [c, { fresh: [], played: [] }]));

  for (const q of pool) {
    for (const c of questionCategories(q)) {
      const bucket = byCategory.get(c);
      if (!bucket) continue;
      (excluded.has(q.id) ? bucket.played : bucket.fresh).push(q);
    }
  }

  const dealt = new Set<string>();
  const deck: Top9Question[] = [];
  const recycled: string[] = [];

  for (const [category, bucket] of byCategory) {
    let taken = 0;
    const take = (list: Top9Question[]) => {
      for (const q of shuffle(list)) {
        if (taken >= perCategory) return;
        if (dealt.has(q.id)) continue;
        dealt.add(q.id);
        deck.push(q);
        taken++;
      }
    };
    take(bucket.fresh);
    if (taken < perCategory && bucket.played.length) {
      take(bucket.played);
      recycled.push(category);
    }
  }

  return { deck: shuffle(deck), recycled };
}
