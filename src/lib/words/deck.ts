import {
  CUSTOM_CATEGORY_ID,
  pictionaryCategories,
  THEME_CATEGORY_ID,
  type WordDifficulty,
} from "./pictionary";

export type DifficultySetting = WordDifficulty | "mix";

export interface WordCard {
  word: string;
  categoryId: string;
  difficulty: WordDifficulty | "theme" | "custom";
}

export interface PoolOptions {
  categories: string[];
  difficulty: DifficultySetting;
  theme: { name: string; words: string[] } | null;
}

export const normalize = (word: string) => word.trim().toLowerCase();

export function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Every card matching the settings, de-duplicated across categories. */
export function buildPool({ categories, difficulty, theme }: PoolOptions) {
  const seen = new Set<string>();
  const pool: WordCard[] = [];

  function add(card: WordCard) {
    const key = normalize(card.word);
    if (seen.has(key)) return;
    seen.add(key);
    pool.push(card);
  }

  const levels: WordDifficulty[] =
    difficulty === "mix" ? ["easy", "medium", "hard"] : [difficulty];

  for (const category of pictionaryCategories) {
    if (!categories.includes(category.id)) continue;
    for (const level of levels) {
      for (const word of category.words[level]) {
        add({ word, categoryId: category.id, difficulty: level });
      }
    }
  }

  if (theme && categories.includes(THEME_CATEGORY_ID)) {
    for (const word of theme.words) {
      add({ word, categoryId: THEME_CATEGORY_ID, difficulty: "theme" });
    }
  }

  return pool;
}

export function categoryMeta(id: string, themeName?: string) {
  if (id === CUSTOM_CATEGORY_ID) {
    return { label: "Written in", tone: "white" as const };
  }
  if (id === THEME_CATEGORY_ID) {
    return { label: themeName ? `Theme: ${themeName}` : "Theme", tone: "pink" as const };
  }
  const category = pictionaryCategories.find((c) => c.id === id);
  return { label: category?.label ?? id, tone: category?.tone ?? "white" };
}
