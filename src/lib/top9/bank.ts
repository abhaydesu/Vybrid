/**
 * Server-side question bank: the ProtoQA survey pack plus Vybrid originals.
 * Only import this from route handlers; the survey file is ~1.5 MB.
 */
import survey from "@/data/top9/survey.json";
import { originalQuestions } from "./originals";
import type { Top9Question } from "./types";

// [id, prompt, categories, adult (0|1), [[text, points, ...aliases], ...]]
type SurveyTuple = [
  string,
  string,
  string[],
  number,
  [string, number, ...string[]][],
];

let cache: Top9Question[] | null = null;

export function allQuestions(): Top9Question[] {
  if (cache) return cache;
  const surveyQuestions = (survey as unknown as SurveyTuple[]).map(
    ([id, prompt, categories, adult, answers]): Top9Question => ({
      id,
      prompt,
      categories,
      ...(adult ? { adult: true } : {}),
      source: "survey",
      answers: answers.map(([text, points, ...aliases]) => ({
        text,
        points,
        ...(aliases.length ? { aliases } : {}),
      })),
    }),
  );
  cache = [...originalQuestions, ...surveyQuestions];
  return cache;
}
