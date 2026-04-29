import { Card, CardContent } from "@/components/ui/card";

interface InsightCardProps {
  title: string;
  value: string;
  detail?: string;
}

export default function InsightCard({ title, value, detail }: InsightCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
        {detail ? <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
