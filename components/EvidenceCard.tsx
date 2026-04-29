import { AlertTriangle, Link2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvidenceCard as EvidenceCardType, SourceRecord } from "@/lib/types";

const labels: Record<EvidenceCardType["classification"], string> = {
  fact: "Fact",
  context: "Context",
  possible_connection: "Possible connection",
  hypothesis: "Hypothesis",
  analogy: "Analogy",
  needs_review: "Needs review",
};

export default function EvidenceCard({
  card,
  sources,
}: {
  card: EvidenceCardType;
  sources: SourceRecord[];
}) {
  const linkedSources = sources.filter((s) => card.sourceIds.includes(s.id));

  return (
    <Card className="min-h-[120px]">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="accent">{labels[card.classification]}</Badge>
          <Badge variant="default">{card.confidence}%</Badge>
        </div>
        <h3 className="text-sm font-semibold leading-6 text-foreground">{card.claim}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{card.evidence[0]}</p>
        <details className="rounded-xl bg-background/60 p-3 text-sm">
          <summary className="cursor-pointer font-medium text-primary">Evidence and uncertainty</summary>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs font-medium text-primary mb-1">Evidence</p>
              <ul className="space-y-1 leading-5 text-muted-foreground">
                {card.evidence.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-xs font-medium text-accent mb-1">Uncertainty</p>
              <p className="leading-5 text-muted-foreground">{card.uncertainty}</p>
            </div>
            {card.counterEvidence?.length ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground/60 mb-1">Counter-evidence</p>
                <ul className="space-y-1 leading-5 text-muted-foreground/70">
                  {card.counterEvidence.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        </details>
        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          {linkedSources.slice(0, 2).map((source) => (
            <Badge key={source.id} variant="muted" className="gap-1">
              <Link2 className="h-3 w-3" />{source.title}
            </Badge>
          ))}
          {card.needsExpertReview ? (
            <Badge variant="muted" className="gap-1 text-yellow-400">
              <AlertTriangle className="h-3 w-3" />expert review needed
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
