import mongoose, { Schema } from "mongoose";

export interface Top9Answer {
  label: string;
  points: number;
}

export interface Top9QuestionData {
  prompt: string;
  answers: Top9Answer[];
}

export interface Top9QuestionDoc extends mongoose.Document, Top9QuestionData {
  prompt: string;
  answers: Top9Answer[];
}

const AnswerSchema = new Schema<Top9Answer>(
  {
    label: { type: String, required: true },
    points: { type: Number, required: true },
  },
  { _id: false },
);

const Top9QuestionSchema = new Schema<Top9QuestionDoc>(
  {
    prompt: { type: String, required: true },
    answers: { type: [AnswerSchema], required: true },
  },
  { timestamps: true },
);

export const Top9Question =
  mongoose.models.Top9Question ||
  mongoose.model<Top9QuestionDoc>("Top9Question", Top9QuestionSchema);
