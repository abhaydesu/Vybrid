import { NextResponse } from "next/server";

import { allQuestions } from "@/lib/top9/bank";
import { top9Categories, TOTAL_BOARDS } from "@/lib/top9/categories";
import { dealDeck } from "@/lib/top9/deal";

const CATEGORY_IDS = new Set(top9Categories.map((c) => c.id));

/** Category list with board counts. */
export function GET() {
  return NextResponse.json({ total: TOTAL_BOARDS, categories: top9Categories });
}

/**
 * Deals a deck for one game.
 * Body: { categories: string[], exclude?: string[], perCategory?: number }
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Expected a JSON body." },
      { status: 400 },
    );
  }

  const {
    categories,
    exclude = [],
    perCategory = 8,
  } = (body ?? {}) as {
    categories?: unknown;
    exclude?: unknown;
    perCategory?: unknown;
  };

  const validCategories =
    Array.isArray(categories) &&
    categories.length > 0 &&
    categories.length <= CATEGORY_IDS.size &&
    categories.every((c) => typeof c === "string" && CATEGORY_IDS.has(c));
  const validExclude =
    Array.isArray(exclude) &&
    exclude.length <= 20000 &&
    exclude.every((id) => typeof id === "string");
  const count = Number(perCategory);

  if (
    !validCategories ||
    !validExclude ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > 30
  ) {
    return NextResponse.json(
      {
        error:
          "Send 1+ known categories, an exclude list of ids, and perCategory 1–30.",
      },
      { status: 400 },
    );
  }

  const { deck, recycled } = dealDeck(allQuestions(), {
    categories: categories as string[],
    exclude: exclude as string[],
    perCategory: count,
  });

  return NextResponse.json({ deck, recycled });
}
