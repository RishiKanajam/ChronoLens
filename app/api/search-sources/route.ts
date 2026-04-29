import { NextResponse } from "next/server";
import { searchSources } from "@/lib/sourceSearch";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string; providers?: string[]; types?: string[] };
    const sources = await searchSources(body.query || "");
    const filtered = sources.filter((source) => {
      const providerOk = !body.providers?.length || body.providers.includes(source.provider);
      const typeOk = !body.types?.length || body.types.includes(source.type);
      return providerOk && typeOk;
    });
    return NextResponse.json({ sources: filtered });
  } catch {
    return NextResponse.json({ sources: [] });
  }
}
