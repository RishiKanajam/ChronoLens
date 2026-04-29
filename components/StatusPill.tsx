import { Badge } from "@/components/ui/badge";

interface StatusPillProps {
  label: string;
  tone?: "teal" | "gold" | "muted";
}

export default function StatusPill({ label, tone = "muted" }: StatusPillProps) {
  const variant = tone === "teal" ? "default" : tone === "gold" ? "accent" : "muted";
  return <Badge variant={variant}>{label}</Badge>;
}
