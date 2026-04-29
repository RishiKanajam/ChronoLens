import { NextResponse } from "next/server";
import { fallbackDiscoveries } from "@/lib/contextualFallback";
import { searchSources } from "@/lib/sourceSearch";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query") || "cultural heritage research";

  try {
    const sources = await searchSources(query);
    const discoveries = sources.slice(0, 5).map((source, index) => ({
      id: `disc-${source.provider}-${index}`,
      title: source.title,
      provider: source.provider,
      dateLabel: source.dateLabel || new Date().getFullYear().toString(),
      whyItMatters:
        source.description ||
        "This source may help researchers compare evidence, context, and uncertain cultural interpretation.",
      relevanceScore: source.relevanceScore,
      externalUrl: source.externalUrl,
    }));

    return NextResponse.json({
      discoveries: discoveries.length ? discoveries : fallbackDiscoveries(query),
    });
  } catch {
    return NextResponse.json({ discoveries: fallbackDiscoveries(query) });
  }
}
