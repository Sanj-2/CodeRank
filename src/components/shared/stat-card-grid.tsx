import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardGridProps {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
}

const STATS_CONFIG: {
  key: keyof StatCardGridProps;
  label: string;
  colorClass: string;
  suffix?: string;
}[] = [
  { key: "totalSolved", label: "Total solved", colorClass: "text-foreground" },
  { key: "easySolved", label: "Easy", colorClass: "text-easy" },
  { key: "mediumSolved", label: "Medium", colorClass: "text-medium" },
  { key: "hardSolved", label: "Hard", colorClass: "text-hard" },
  { key: "acceptanceRate", label: "Acceptance rate", colorClass: "text-foreground", suffix: "%" },
];

export function StatCardGrid(props: StatCardGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {STATS_CONFIG.map(({ key, label, colorClass, suffix }) => (
        <Card key={key}>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-xs font-normal text-muted-foreground">
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className={cn("text-2xl font-bold tabular-nums", colorClass)}>
              {props[key]}
              {suffix ?? ""}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
