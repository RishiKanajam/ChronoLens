import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Workspace } from "@/lib/types";

export default function DiscoveriesTab({ workspace }: { workspace: Workspace }) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pr-3">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-xl font-semibold text-foreground">Latest discoveries and research</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Recent scholarship, archive records, and research-watch items related to your topic.
            </p>
          </CardContent>
        </Card>
        <div className="grid gap-3 lg:grid-cols-2">
          {workspace.discoveries.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="accent">{item.provider}</Badge>
                  <Badge variant="muted">{item.relevanceScore}%</Badge>
                </div>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.whyItMatters}</p>
                <p className="text-xs text-muted-foreground/60">{item.dateLabel}</p>
                {item.externalUrl ? (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={item.externalUrl} target="_blank" rel="noreferrer">Open external source</a>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
