import { NextResponse } from "next/server";
import { generateStudyWithOpenAI } from "@/lib/ai/openai";
import { fallbackStudyModule } from "@/lib/contextualFallback";

function timeoutFallback(topic: string, difficulty: string, mode: string) {
  return new Promise<ReturnType<typeof fallbackStudyModule>>((resolve) => {
    setTimeout(() => resolve(fallbackStudyModule(topic, difficulty, mode)), 12000);
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { topic?: string; difficulty?: string; mode?: string };
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const difficulty = body.difficulty || "Beginner";
    const mode = body.mode || "Student";

    const studyModule = process.env.OPENAI_API_KEY
      ? await Promise.race([
          generateStudyWithOpenAI(topic, difficulty, mode),
          timeoutFallback(topic, difficulty, mode),
        ])
      : fallbackStudyModule(topic, difficulty, mode);

    return NextResponse.json(studyModule);
  } catch {
    return NextResponse.json({ error: "Could not generate study module." }, { status: 500 });
  }
}
