import TimelineRibbon from "@/components/TimelineRibbon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workspace } from "@/lib/types";

export default function TimelineTab({ workspace }: { workspace: Workspace }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <TimelineRibbon workspace={workspace} />
      <ScrollArea className="min-h-0 flex-1">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-3 pr-3">
          {workspace.timelineEvents.map((event) => {
            const sources = workspace.sourceRecords.filter((s) => event.sourceIds?.includes(s.id));
            return (
              <Card key={event.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-accent">{event.dateLabel}</p>
                    <Badge variant="default">{event.confidence}%</Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{event.description}</p>
                  {sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {sources.map((s) => (
                        <Badge key={s.id} variant="muted">{s.title}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
