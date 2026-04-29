import { NextResponse } from "next/server";
import { generateLessonWithOpenAI } from "@/lib/ai/openai";
import { fallbackLessonPack } from "@/lib/contextualFallback";

function timeoutFallback(topic: string, classLevel: string, duration: string, learningGoal: string) {
  return new Promise<ReturnType<typeof fallbackLessonPack>>((resolve) => {
    setTimeout(() => resolve(fallbackLessonPack(topic, classLevel, duration, learningGoal)), 12000);
  });
}

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

    const classLevel = body.classLevel || "Year 9";
    const duration = body.duration || "45 minutes";
    const learningGoal = body.learningGoal || "source analysis";

    const lessonPack = process.env.OPENAI_API_KEY
      ? await Promise.race([
          generateLessonWithOpenAI(topic, classLevel, duration, learningGoal),
          timeoutFallback(topic, classLevel, duration, learningGoal),
        ])
      : fallbackLessonPack(topic, classLevel, duration, learningGoal);

    return NextResponse.json(lessonPack);
  } catch {
    return NextResponse.json({ error: "Could not generate lesson." }, { status: 500 });
  }
}
