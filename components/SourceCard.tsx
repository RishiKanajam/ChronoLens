"use client";

import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SourceProvider, SourceRecord } from "@/lib/types";

const providerLabels: Record<SourceProvider, string> = {
  demo: "Demo",
  openalex: "OpenAlex",
  library_of_congress: "LoC",
  met_museum: "Met",
  musicbrainz: "MusicBrainz",
  wikidata: "Wikidata",
  europeana: "Europeana",
  smithsonian: "Smithsonian",
  crossref: "Crossref",
};

function providerLabel(provider: SourceProvider) {
  return providerLabels[provider] ?? provider;
}

function scoreLabel(score: number) {
  return `${Math.round(score <= 1 ? score * 100 : score)}%`;
}

export default function SourceCard({
  source,
  selected,
  onSelect,
  onUseAsEvidence,
}: {
  source: SourceRecord;
  selected?: boolean;
  onSelect: () => void;
  onUseAsEvidence: () => void;
}) {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        selected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-card/80"
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-4 space-y-3 mb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="muted">{source.type}</Badge>
            <Badge variant="secondary">{providerLabel(source.provider)}</Badge>
          </div>
          <span className="text-xs font-bold text-primary shrink-0">{scoreLabel(source.relevanceScore)}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">{source.title}</h3>
        <p className="text-xs leading-5 text-muted-foreground">
          {source.institution || source.provider}
          {source.dateLabel ? ` · ${source.dateLabel}` : ""}
        </p>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{source.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <span className="max-w-[52%] truncate text-xs text-accent">{source.rights || "rights unknown"}</span>
          <div className="flex shrink-0 items-center gap-2">
            {source.externalUrl ? (
              <Button variant="ghost" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                <a href={source.externalUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-3 w-3" />External
                </a>
              </Button>
            ) : null}
            <Button
              variant="default"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onUseAsEvidence(); }}
            >
              Use as evidence
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
