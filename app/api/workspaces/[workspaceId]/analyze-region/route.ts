import { NextResponse } from "next/server";
import { getWorkspace } from "@/lib/workspaceStore";

interface Params {
  params: { workspaceId: string };
}

function fallbackAnalysis(topic: string, x1: number, y1: number, x2: number, y2: number) {
  return `This region (${Math.round(x1)}%-${Math.round(x2)}% horizontal, ${Math.round(y1)}%-${Math.round(y2)}% vertical) of ${topic} likely contains architectural or decorative elements. Connect an OpenAI API key for detailed cultural, material, and period analysis.`;
}

export async function POST(request: Request, { params }: Params) {
  const workspace = getWorkspace(params.workspaceId);
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const body = (await request.json().catch(() => ({}))) as {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    topic?: string;
  };
  const x1 = Number(body.x1) || 0;
  const y1 = Number(body.y1) || 0;
  const x2 = Number(body.x2) || 0;
  const y2 = Number(body.y2) || 0;
  const topic = body.topic || workspace.title;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ analysis: fallbackAnalysis(topic, x1, y1, x2, y2) });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.startsWith("gpt-5") || process.env.OPENAI_MODEL?.startsWith("o")
          ? "gpt-4.1"
          : process.env.OPENAI_MODEL || "gpt-4.1",
        temperature: 0.25,
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `I'm analyzing an image of "${topic}". The user selected a region at approximately ${Math.round(x1)}% to ${Math.round(x2)}% horizontally and ${Math.round(y1)}% to ${Math.round(y2)}% vertically. Based on typical features and layout of ${topic}, describe: 1) What architectural or artistic element is likely in this region 2) Its cultural significance 3) Materials used 4) Historical period. Keep it under 100 words. Use cautious language and avoid unsupported certainty.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ analysis: fallbackAnalysis(topic, x1, y1, x2, y2) });
    }

    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return NextResponse.json({
      analysis: data.choices?.[0]?.message?.content || fallbackAnalysis(topic, x1, y1, x2, y2),
    });
  } catch {
    return NextResponse.json({ analysis: fallbackAnalysis(topic, x1, y1, x2, y2) });
  }
}
