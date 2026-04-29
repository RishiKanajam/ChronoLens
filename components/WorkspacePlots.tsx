import { Workspace } from "@/lib/types";

function pct(value: number, max: number) {
  if (!max) return 0;
  return Math.max(4, Math.round((value / max) * 100));
}

export default function WorkspacePlots({ workspace }: { workspace: Workspace }) {
  const sourceCounts = workspace.sourceRecords.reduce<Record<string, number>>((acc, source) => {
    acc[source.type] = (acc[source.type] || 0) + 1;
    return acc;
  }, {});
  const sourceRows = Object.entries(sourceCounts).slice(0, 6);
  const maxSource = Math.max(1, ...sourceRows.map(([, count]) => count));
  const confidenceRows = workspace.evidenceCards.slice(0, 7);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
      <section className="rounded-xl border border-border bg-white/95 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Source mix</p>
          <span className="text-xs text-muted-foreground">{workspace.sourceRecords.length} records</span>
        </div>
        <div className="mt-4 space-y-3">
          {sourceRows.length ? sourceRows.map(([type, count]) => (
            <div key={type} className="grid grid-cols-[96px_1fr_28px] items-center gap-3 text-xs">
              <span className="truncate text-muted-foreground">{type.replace(/_/g, " ")}</span>
              <span className="h-2 overflow-hidden rounded bg-muted">
                <span className="block h-full rounded bg-primary" style={{ width: `${pct(count, maxSource)}%` }} />
              </span>
              <span className="text-right font-medium text-foreground">{count}</span>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No sources loaded yet.</p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white/95 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Evidence confidence</p>
          <span className="text-xs text-muted-foreground">{workspace.evidenceCards.length} cards</span>
        </div>
        <svg viewBox="0 0 320 124" className="mt-3 h-32 w-full" role="img" aria-label="Evidence confidence plot">
          {[0, 25, 50, 75, 100].map((tick) => (
            <g key={tick}>
              <line x1={20 + tick * 2.7} x2={20 + tick * 2.7} y1="12" y2="96" stroke="#e3dbcf" strokeWidth="1" />
              <text x={20 + tick * 2.7} y="116" textAnchor="middle" fontSize="9" fill="#6f6759">{tick}</text>
            </g>
          ))}
          <line x1="20" x2="290" y1="96" y2="96" stroke="#cfc5b6" strokeWidth="1.5" />
          {confidenceRows.length ? confidenceRows.map((card, index) => {
            const x = 20 + Math.max(0, Math.min(100, card.confidence)) * 2.7;
            const y = 24 + index * 10;
            const color = card.needsExpertReview ? "#b7791f" : "#0f766e";
            return (
              <g key={card.id}>
                <line x1="20" x2={x} y1={y} y2={y} stroke={color} strokeOpacity="0.35" strokeWidth="2" />
                <circle cx={x} cy={y} r="4" fill={color} />
              </g>
            );
          }) : (
            <text x="20" y="58" fontSize="12" fill="#6f6759">No evidence cards yet.</text>
          )}
        </svg>
      </section>
    </div>
  );
}
