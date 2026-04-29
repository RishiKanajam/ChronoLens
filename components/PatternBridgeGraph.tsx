"use client";

import { useMemo, useState } from "react";
import { ConnectionNode, Workspace } from "@/lib/types";

const positions = [
  [50, 16], [22, 27], [77, 29], [18, 58], [78, 60],
  [50, 48], [33, 79], [66, 80], [10, 82], [90, 83],
] as const;

const nodeColor: Record<ConnectionNode["type"], string> = {
  topic: "#38bdf8", artifact: "#d4a857", artwork: "#ffcf5b", music: "#82d9ff",
  dance: "#d2a8ff", textile: "#66e0b8", manuscript: "#f5f1e8", place: "#7ee787",
  period: "#ffa657", source: "#9ecbff", research: "#f2a6a6",
};

export default function PatternBridgeGraph({
  workspace, onSelectNode,
}: {
  workspace: Workspace;
  onSelectNode?: (node: ConnectionNode) => void;
}) {
  const [selectedId, setSelectedId] = useState(workspace.connectionGraph.nodes[0]?.id);
  const nodes = useMemo(
    () => workspace.connectionGraph.nodes.map((node, i) => ({
      ...node,
      x: positions[i % positions.length][0],
      y: positions[i % positions.length][1],
    })),
    [workspace.connectionGraph.nodes],
  );

  function select(node: ConnectionNode) {
    setSelectedId(node.id);
    onSelectNode?.(node);
  }

  return (
    <div className="relative h-[520px] overflow-hidden rounded-2xl border border-border bg-background map-grid">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        {workspace.connectionGraph.edges.map((edge) => {
          const src = nodes.find((n) => n.id === edge.source);
          const tgt = nodes.find((n) => n.id === edge.target);
          if (!src || !tgt) return null;
          return (
            <g key={`${edge.source}-${edge.target}-${edge.label}`}>
              <line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                stroke={edge.relationType === "analogy_only" ? "rgba(212,168,87,.35)" : "rgba(56,189,248,.34)"}
                strokeWidth="0.42"
                strokeDasharray={edge.relationType === "possible_influence" || edge.relationType === "analogy_only" ? "2 1.8" : undefined}
              />
              <text x={(src.x + tgt.x) / 2} y={(src.y + tgt.y) / 2}
                textAnchor="middle" fill="rgba(245,241,232,.45)" fontSize="2.35">
                {edge.confidence}%
              </text>
            </g>
          );
        })}
      </svg>
      {nodes.map((node) => (
        <button
          key={node.id}
          type="button"
          onClick={() => select(node)}
          className={`absolute w-36 -translate-x-1/2 rounded-xl px-3 py-2 text-center text-xs shadow-soft transition ${
            selectedId === node.id
              ? "bg-primary text-primary-foreground"
              : "bg-card/90 text-foreground hover:bg-secondary"
          }`}
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <span className="mx-auto mb-1 block h-3 w-3 rounded-full" style={{ backgroundColor: nodeColor[node.type] }} />
          <span className="block truncate font-semibold">{node.label}</span>
          <span className="text-[10px] opacity-60">{node.type}</span>
        </button>
      ))}
    </div>
  );
}
