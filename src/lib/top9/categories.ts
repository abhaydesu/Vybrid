import meta from "@/data/top9/survey-meta.json";
import type { Tone } from "../games";
import { originalQuestions } from "./originals";
import type { Top9Question } from "./types";

export const ADULT_CATEGORY = "adult";

export interface Top9Category {
  id: string;
  label: string;
  tone: Tone;
  count: number;
}

const TONES: Record<string, Tone> = {
  desi: "yellow",
  words: "purple",
  food: "orange",
  love: "pink",
  family: "yellow",
  work: "blue",
  holidays: "red",
  travel: "green",
  sports: "orange",
  health: "pink",
  animals: "green",
  popculture: "purple",
  money: "yellow",
  home: "blue",
  everyday: "white",
  adult: "red",
};

const originalCounts: Record<string, number> = {};
for (const q of originalQuestions) {
  for (const c of q.categories)
    originalCounts[c] = (originalCounts[c] ?? 0) + 1;
}

/** Every category, with how many boards it has across both packs. */
export const top9Categories: Top9Category[] = [
  {
    id: "desi",
    label: "Desi life",
    tone: TONES.desi,
    count: originalCounts.desi ?? 0,
  },
  ...meta.categories.map((c) => ({
    id: c.id,
    label: c.label,
    tone: TONES[c.id] ?? "white",
    count: c.count + (originalCounts[c.id] ?? 0),
  })),
];

export const familyCategories = top9Categories.filter(
  (c) => c.id !== ADULT_CATEGORY,
);
export const DEFAULT_CATEGORIES = familyCategories.map((c) => c.id);
export const TOTAL_BOARDS = meta.total + originalQuestions.length;

export const SURVEY_CREDIT = {
  label: "ProtoQA (Boratko et al., 2020)",
  url: meta.url,
  license: "CC BY 4.0",
};

export function categoryById(id: string) {
  return top9Categories.find((c) => c.id === id);
}

/** Categories a question counts under. Adult questions only count as adult. */
export function questionCategories(q: Top9Question) {
  return q.adult ? [ADULT_CATEGORY] : q.categories;
}
