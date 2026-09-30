import mongoose, { Schema } from "mongoose";

import type { Top9Answer, Top9Question as Top9QuestionData } from "@/lib/top9/types";

export type { Top9QuestionData };

const AnswerSchema = new Schema<Top9Answer>(
  {
    text: { type: String, required: true },
    points: { type: Number, required: true },
    aliases: { type: [String], default: undefined },
  },
  { _id: false },
);

const Top9QuestionSchema = new Schema<Top9QuestionData>(
  {
    id: { type: String, required: true, unique: true },
    categories: { type: [String], required: true },
    adult: { type: Boolean, default: undefined },
    source: { type: String, enum: ["survey", "original"], required: true },
    prompt: { type: String, required: true },
    answers: { type: [AnswerSchema], required: true },
  },
  { timestamps: true },
);

export const Top9Question =
  mongoose.models.Top9Question ||
  mongoose.model<Top9QuestionData>("Top9Question", Top9QuestionSchema);
