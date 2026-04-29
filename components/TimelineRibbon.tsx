import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Workspace } from "@/lib/types";

export default function TimelineRibbon({ workspace }: { workspace: Workspace }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card p-5">
      <div className="flex min-w-[820px] items-start gap-4">
        {workspace.timelineEvents.map((event, index) => (
          <article key={event.id} className="relative flex-1">
            <div className="mb-4 flex items-center">
              <span className="h-3 w-3 rounded-full bg-primary" />
              {index < workspace.timelineEvents.length - 1 ? (
                <span className="h-px flex-1 bg-border" />
              ) : null}
            </div>
            <Card>
              <CardContent className="p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-accent">{event.dateLabel}</p>
                  <Badge variant="muted">{event.confidence}%</Badge>
                </div>
                <h3 className="text-sm font-semibold leading-5 text-foreground">{event.title}</h3>
                <p className="text-xs leading-5 text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </div>
  );
}
