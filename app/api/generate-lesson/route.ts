import { NextResponse } from "next/server";
import { generateLessonWithOpenAI } from "@/lib/ai/openai";
import { fallbackLessonPack } from "@/lib/contextualFallback";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      topic?: string;
      classLevel?: string;
      duration?: string;
      learningGoal?: string;
    };
    const topic = body.topic?.trim();
    if (!topic) {
      return NextResponse.json({ error: "Topic is required." }, { status: 400 });
    }

    const lessonPack = process.env.OPENAI_API_KEY
      ? await generateLessonWithOpenAI(
          topic,
          body.classLevel || "Year 9",
          body.duration || "45 minutes",
          body.learningGoal || "source analysis",
        )
      : fallbackLessonPack(
          topic,
          body.classLevel || "Year 9",
          body.duration || "45 minutes",
          body.learningGoal || "source analysis",
        );

    return NextResponse.json(lessonPack);
  } catch {
    return NextResponse.json({ error: "Could not generate lesson." }, { status: 500 });
  }
}
