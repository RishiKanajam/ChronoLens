import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string | number;
  note?: string;
}

export default function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
        {note ? <p className="mt-1 text-xs text-muted-foreground/60">{note}</p> : null}
      </CardContent>
    </Card>
  );
}
