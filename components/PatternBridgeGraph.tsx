"use client";

import { useMemo, useState } from "react";
import { ConnectionEdge, ConnectionNode, Workspace } from "@/lib/types";

type PlottedNode = ConnectionNode & {
  x: number;
  y: number;
  degree: number;
};

const nodeColor: Record<ConnectionNode["type"], string> = {
  topic: "#0f766e", artifact: "#b7791f", artwork: "#d97706", music: "#2563eb",
  dance: "#8b5cf6", textile: "#059669", manuscript: "#7c2d12", place: "#16a34a",
  period: "#ea580c", source: "#0284c7", research: "#be123c",
};

const relationStyle: Record<
  ConnectionEdge["relationType"],
  { color: string; dash?: string; label: string }
> = {
  direct_evidence: { color: "#0f766e", label: "Direct evidence" },
  shared_motif: { color: "#b7791f", label: "Shared motif" },
  same_region: { color: "#16a34a", dash: "8 5", label: "Same region" },
  same_period: { color: "#ea580c", dash: "7 5", label: "Same period" },
  possible_influence: { color: "#7c3aed", dash: "6 5", label: "Possible influence" },
  analogy_only: { color: "#64748b", dash: "3 5", label: "Analogy only" },
};

function splitLabel(label: string) {
  const words = label.replace(/_/g, " ").split(/\s+/).filter(Boolean);
  if (words.length <= 2) return [label];
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > 17 && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function confidence(edge: ConnectionEdge) {
  const raw = Number(edge.confidence);
  if (!Number.isFinite(raw)) return 55;
  return raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
}

export default function PatternBridgeGraph({
  workspace, onSelectNode,
}: {
  workspace: Workspace;
  onSelectNode?: (node: ConnectionNode) => void;
}) {
  const [selectedId, setSelectedId] = useState(workspace.connectionGraph.nodes[0]?.id);
  const edges = workspace.connectionGraph.edges;
  const nodes = useMemo<PlottedNode[]>(() => {
    const baseNodes = workspace.connectionGraph.nodes;
    const degree = new Map<string, number>();
    edges.forEach((edge) => {
      degree.set(edge.source, (degree.get(edge.source) || 0) + 1);
      degree.set(edge.target, (degree.get(edge.target) || 0) + 1);
    });

    const topicIndex = Math.max(0, baseNodes.findIndex((node) => node.type === "topic"));
    const topic = baseNodes[topicIndex];
    const others = baseNodes.filter((_, index) => index !== topicIndex);
    const plotted: PlottedNode[] = [];

    if (topic) {
      plotted.push({ ...topic, x: 500, y: 310, degree: degree.get(topic.id) || 0 });
    }

    others.forEach((node, index) => {
      const count = Math.max(1, others.length);
      const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
      const typeOffset = node.type === "source" ? 1 : node.type === "place" ? 0.82 : 0.92;
      const rx = 330 * typeOffset;
      const ry = 190 * typeOffset;
      plotted.push({
        ...node,
        x: 500 + Math.cos(angle) * rx,
        y: 310 + Math.sin(angle) * ry,
        degree: degree.get(node.id) || 0,
      });
    });

    return plotted;
  }, [edges, workspace.connectionGraph.nodes]);

  const selectedNode = nodes.find((node) => node.id === selectedId) || nodes[0];
  const selectedEdgeIds = new Set(
    edges
      .filter((edge) => edge.source === selectedNode?.id || edge.target === selectedNode?.id)
      .map((edge) => `${edge.source}-${edge.target}-${edge.label}`),
  );

  function select(node: ConnectionNode) {
    setSelectedId(node.id);
    onSelectNode?.(node);
  }

  if (!nodes.length) {
    return (
      <div className="flex h-[min(62vh,560px)] min-h-[360px] items-center justify-center rounded-lg border border-border bg-card shadow-soft">
        <p className="text-sm text-muted-foreground">No connection graph yet.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[min(62vh,600px)] min-h-[420px] overflow-hidden rounded-lg border border-border bg-[#fffdf8] shadow-soft">
      <svg viewBox="0 0 1000 620" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="connection-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#e8ded0" strokeWidth="1" />
          </pattern>
          <filter id="soft-node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#3d3529" floodOpacity="0.12" />
          </filter>
        </defs>
        <rect width="1000" height="620" fill="#fffdf8" />
        <rect width="1000" height="620" fill="url(#connection-grid)" opacity="0.72" />
        {[116, 188, 260].map((radius) => (
          <ellipse
            key={radius}
            cx="500"
            cy="310"
            rx={radius * 1.55}
            ry={radius}
            fill="none"
            stroke="#ddd3c4"
            strokeWidth="1.2"
            strokeDasharray="7 8"
            opacity="0.75"
          />
        ))}

        {edges.map((edge, index) => {
          const src = nodes.find((n) => n.id === edge.source);
          const tgt = nodes.find((n) => n.id === edge.target);
          if (!src || !tgt) return null;
          const midX = (src.x + tgt.x) / 2;
          const midY = (src.y + tgt.y) / 2;
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const distance = Math.max(1, Math.hypot(dx, dy));
          const curve = (index % 2 === 0 ? 1 : -1) * Math.min(52, distance * 0.16);
          const cx = midX + (-dy / distance) * curve;
          const cy = midY + (dx / distance) * curve;
          const style = relationStyle[edge.relationType];
          const edgeKey = `${edge.source}-${edge.target}-${edge.label}`;
          const active = selectedEdgeIds.has(edgeKey);
          return (
            <g key={edgeKey}>
              <path
                d={`M ${src.x} ${src.y} Q ${cx} ${cy} ${tgt.x} ${tgt.y}`}
                fill="none"
                stroke={style.color}
                strokeWidth={active ? 4 : 2}
                strokeOpacity={active ? 0.78 : 0.28}
                strokeDasharray={style.dash}
              />
              {active ? (
                <g>
                  <rect
                    x={cx - 26}
                    y={cy - 12}
                    width="52"
                    height="22"
                    rx="11"
                    fill="#fffdf8"
                    stroke={style.color}
                    strokeOpacity="0.45"
                  />
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="#121416" fontSize="12" fontWeight="700">
                    {confidence(edge)}%
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => {
          const selected = selectedId === node.id;
          const color = nodeColor[node.type];
          const r = node.type === "topic" ? 44 : 24 + Math.min(12, node.degree * 2);
          const labelLines = splitLabel(node.label);
          return (
            <g
              key={node.id}
              onClick={() => select(node)}
              role="button"
              tabIndex={0}
              className="cursor-pointer"
              filter="url(#soft-node-shadow)"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={r + (selected ? 13 : 8)}
                fill={color}
                fillOpacity={selected ? "0.16" : "0.07"}
                stroke={color}
                strokeWidth={selected ? 3 : 1.6}
                strokeOpacity={selected ? 0.95 : 0.48}
              />
              <circle cx={node.x} cy={node.y} r={r} fill="#fffdf8" stroke={color} strokeWidth={selected ? 4 : 2.4} />
              <circle cx={node.x} cy={node.y - r + 8} r="5" fill={color} />
              {labelLines.map((line, lineIndex) => (
                <text
                  key={line}
                  x={node.x}
                  y={node.y - (labelLines.length - 1) * 8 + lineIndex * 16}
                  textAnchor="middle"
                  fill="#121416"
                  fontSize={node.type === "topic" ? 15 : 12}
                  fontWeight="700"
                >
                  {line}
                </text>
              ))}
              <text x={node.x} y={node.y + r - 10} textAnchor="middle" fill="#6f6759" fontSize="10">
                {node.type.replace(/_/g, " ")}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute left-4 top-4 rounded-md border border-border bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold text-foreground">Pattern Bridge</p>
        <p className="text-[11px] text-muted-foreground">{nodes.length} nodes · {edges.length} relationships</p>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 rounded-md border border-border bg-white/90 p-2 shadow-sm backdrop-blur">
        {Object.entries(relationStyle).map(([key, style]) => (
          <span key={key} className="inline-flex items-center gap-1.5 rounded-md bg-[#f7f1e7] px-2 py-1 text-[11px] text-muted-foreground">
            <span className="h-1.5 w-5 rounded-full" style={{ backgroundColor: style.color }} />
            {style.label}
          </span>
        ))}
      </div>
    </div>
  );
}
