import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1 (default)";

  if (!key) {
    return NextResponse.json({ hasKey: false, model, keyPrefix: "NOT SET" });
  }

  // Test the key with a minimal API call
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1",
        max_tokens: 5,
        messages: [{ role: "user", content: "hi" }],
      }),
    });

    const data = await response.json() as { error?: { message?: string; code?: string } };

    if (!response.ok) {
      return NextResponse.json({
        hasKey: true,
        keyPrefix: key.slice(0, 10) + "...",
        model,
        apiStatus: response.status,
        apiError: data.error?.message || "Unknown error",
        apiErrorCode: data.error?.code,
      });
    }

    return NextResponse.json({
      hasKey: true,
      keyPrefix: key.slice(0, 10) + "...",
      model,
      apiStatus: 200,
      apiWorking: true,
    });
  } catch (err) {
    return NextResponse.json({
      hasKey: true,
      keyPrefix: key.slice(0, 10) + "...",
      model,
      fetchError: String(err),
    });
  }
}
