import { NextResponse } from "next/server";
import { generateStudyWithOpenAI } from "@/lib/ai/openai";
import { fallbackStudyModule } from "@/lib/contextualFallback";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { topic?: string; difficulty?: string; mode?: string };
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const studyModule = process.env.OPENAI_API_KEY
      ? await generateStudyWithOpenAI(topic, body.difficulty || "Beginner", body.mode || "Student")
      : fallbackStudyModule(topic, body.difficulty || "Beginner", body.mode || "Student");

    return NextResponse.json(studyModule);
  } catch {
    return NextResponse.json({ error: "Could not generate study module." }, { status: 500 });
  }
}
