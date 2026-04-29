import { SourceRecord } from "@/lib/types";

interface MBRecording {
  id: string;
  title?: string;
  "first-release-date"?: string;
  "artist-credit"?: Array<{ name?: string }>;
}

export async function searchMusicBrainz(query: string): Promise<SourceRecord[]> {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&limit=5&fmt=json`,
      {
        headers: { "User-Agent": "ChronoLens/0.1 (chronolens@example.com)" },
        next: { revalidate: 3600 },
      },
    );
    if (!response.ok) return [];
    const data = (await response.json()) as { recordings?: MBRecording[] };
    const recordings = data.recordings || [];
    return recordings
      .filter((r) => r.title)
      .map((r) => ({
        id: `musicbrainz-${r.id}`,
        provider: "musicbrainz",
        title: r.title || "Untitled recording",
        type: "music",
        creator: r["artist-credit"]?.[0]?.name,
        institution: "MusicBrainz",
        dateLabel: r["first-release-date"],
        externalUrl: `https://musicbrainz.org/recording/${r.id}`,
        rights: "Open data (MusicBrainz)",
        description: "Music recording indexed by MusicBrainz open music encyclopedia.",
        relevanceScore: 72,
      } satisfies SourceRecord));
  } catch {
    return [];
  }
}
