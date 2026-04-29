import InsightCard from "@/components/InsightCard";
import MetricCard from "@/components/MetricCard";
import TimelineRibbon from "@/components/TimelineRibbon";
import WorkspacePlots from "@/components/WorkspacePlots";
import { Workspace } from "@/lib/types";

export default function AtlasTab({ workspace }: { workspace: Workspace }) {
  const artForms = Array.from(new Set(workspace.sourceRecords.map((s) => s.type)))
    .slice(0, 5)
    .join(", ");
  const reviewFlags = workspace.evidenceCards.filter((c) => c.needsExpertReview).length;

  return (
    <div className="grid h-full min-h-0 gap-4 xl:grid-cols-[1fr_320px]">
      <div className="flex min-h-0 flex-col gap-4">
        <section className="relative min-h-[clamp(420px,65vh,560px)] overflow-hidden rounded-xl border border-border bg-card p-5 map-grid shadow-soft">
          <div className="absolute left-[17%] top-[34%] h-4 w-4 rounded-full bg-accent shadow-bronze" />
          <div className="absolute left-[49%] top-[42%] h-5 w-5 rounded-full bg-primary shadow-glow" />
          <div className="absolute left-[75%] top-[27%] h-4 w-4 rounded-full bg-[#111315]" />
          <div className="absolute left-[18%] top-[35%] h-px w-[32%] rotate-[11deg] bg-foreground/20" />
          <div className="absolute left-[50%] top-[43%] h-px w-[28%] -rotate-[22deg] bg-foreground/20" />
          <div className="relative z-10 grid gap-4 xl:grid-cols-[1fr_260px]">
            <div className="max-w-2xl rounded-lg border border-border bg-white/90 p-5 shadow-soft">
              <p className="text-sm font-medium text-primary">Cultural Atlas</p>
              <h2 className="mt-2 text-3xl font-semibold leading-tight text-foreground">{workspace.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{workspace.summary}</p>
            </div>
            <div className="grid gap-3">
              <MetricCard label="Sources loaded" value={workspace.status.sourcesLoaded} note="live APIs + query workspace" />
              <MetricCard label="Review flags" value={reviewFlags} note="uncertain claims separated" />
            </div>
          </div>
          <div className="relative z-10 mt-24 grid gap-3 md:grid-cols-3">
            <MetricCard label="Evidence" value={workspace.status.evidenceCards} note="claim cards" />
            <MetricCard label="Connections" value={workspace.status.connectionsMapped} note="pattern bridge" />
            <MetricCard label="Lesson" value={workspace.status.lessonReady ? "Ready" : "Draft"} note="teacher module" />
          </div>
        </section>
        <WorkspacePlots workspace={workspace} />
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
