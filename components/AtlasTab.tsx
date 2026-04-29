import InsightCard from "@/components/InsightCard";
import MetricCard from "@/components/MetricCard";
import TimelineRibbon from "@/components/TimelineRibbon";
import { Workspace } from "@/lib/types";

export default function AtlasTab({ workspace }: { workspace: Workspace }) {
  const artForms = Array.from(new Set(workspace.sourceRecords.map((s) => s.type)))
    .slice(0, 5)
    .join(", ");

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_300px]">
      <div className="flex min-h-0 flex-col gap-4">
        <section className="relative min-h-[460px] overflow-hidden rounded-2xl border border-border bg-background p-5 map-grid shadow-soft">
          {/* decorative map dots */}
          <div className="absolute left-[16%] top-[34%] h-4 w-4 rounded-full bg-accent" />
          <div className="absolute left-[48%] top-[42%] h-5 w-5 rounded-full bg-primary" />
          <div className="absolute left-[74%] top-[26%] h-4 w-4 rounded-full bg-signal" />
          <div className="absolute left-[17%] top-[35%] h-px w-[32%] rotate-[11deg] bg-foreground/20" />
          <div className="absolute left-[49%] top-[43%] h-px w-[28%] -rotate-[22deg] bg-foreground/20" />
          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-medium text-primary">Cultural Atlas</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">{workspace.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{workspace.query}</p>
          </div>
          <div className="absolute bottom-5 left-5 right-5 grid gap-3 md:grid-cols-3">
            <MetricCard label="Sources" value={workspace.status.sourcesLoaded} note="demo + adapter-ready" />
            <MetricCard label="Evidence" value={workspace.status.evidenceCards} note="linked claims" />
            <MetricCard label="Connections" value={workspace.status.connectionsMapped} note="mapped relations" />
          </div>
        </section>
        <TimelineRibbon workspace={workspace} />
      </div>
      <aside className="grid content-start gap-3">
        <InsightCard title="Topic" value={workspace.title} />
        <InsightCard title="Region" value={workspace.sourceRecords[0]?.region || "Multiple regions"} />
        <InsightCard title="Period" value={workspace.timelineEvents[0]?.dateLabel || "Mixed periods"} />
        <InsightCard title="Art forms" value={artForms} />
        <InsightCard title="Confidence" value="Mixed by claim" detail="High for source structure; lower for possible influence." />
        <InsightCard title="Review needed" value={`${workspace.evidenceCards.filter((c) => c.needsExpertReview).length} flags`} />
        <InsightCard
          title="Source coverage"
          value={`${workspace.status.sourcesLoaded} sources`}
          detail={`${workspace.status.evidenceCards} evidence cards, ${workspace.status.connectionsMapped} connections`}
        />
      </aside>
    </div>
  );
}
