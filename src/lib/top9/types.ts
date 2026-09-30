export interface Top9Answer {
  text: string;
  points: number;
  /** Other ways people say it, used when guesses are typed in. */
  aliases?: string[];
}

export interface Top9Question {
  id: string;
  prompt: string;
  categories: string[];
  /** Adult themes: only dealt when the host opts in. */
  adult?: boolean;
  /** "survey" = real survey data (ProtoQA); "original" = written for Vybrid. */
  source: "survey" | "original";
  answers: Top9Answer[];
}
