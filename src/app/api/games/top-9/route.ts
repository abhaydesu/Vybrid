import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { Top9Question, Top9QuestionData } from "@/models/Top9Question";

const sampleQuestions: Top9QuestionData[] = [
  {
    prompt: "Name something you might forget to pack for a holiday.",
    answers: [
      { label: "Phone charger", points: 38 },
      { label: "Toothbrush", points: 24 },
      { label: "Passport", points: 18 },
      { label: "Socks", points: 10 },
      { label: "Swimsuit", points: 6 },
      { label: "Wallet", points: 4 },
    ],
  },
  {
    prompt: "Name a snack people always want during game night.",
    answers: [
      { label: "Pizza", points: 30 },
      { label: "Chips", points: 26 },
      { label: "Nachos", points: 16 },
      { label: "Popcorn", points: 12 },
      { label: "Cookies", points: 9 },
      { label: "Candy", points: 7 },
    ],
  },
];

export async function GET() {
  const connection = await connectToDatabase();

  if (!connection) {
    return NextResponse.json(sampleQuestions);
  }

  const questions = await Top9Question.find().lean();

  return NextResponse.json(questions.length ? questions : sampleQuestions);
}
