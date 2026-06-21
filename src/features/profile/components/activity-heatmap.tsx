import { cn } from "@/lib/utils";

interface Snapshot {
  date: Date;
  totalSolved: number;
}

interface ActivityHeatmapProps {
  snapshots: Snapshot[];
}

function intensityClass(delta: number) {
  if (delta <= 0) return "bg-muted";
  if (delta === 1) return "bg-easy/30";
  if (delta <= 3) return "bg-easy/60";
  return "bg-easy";
}

export function ActivityHeatmap({ snapshots }: ActivityHeatmapProps) {
  if (snapshots.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Not enough history yet — check back after a few sync cycles.
      </p>
    );
  }

  // Snapshots come newest-first; compute day-over-day deltas, oldest to newest.
  const chronological = [...snapshots].reverse();
  const days = chronological.slice(1).map((snap, i) => ({
    date: snap.date,
    delta: Math.max(0, snap.totalSolved - chronological[i].totalSolved),
  }));

  return (
    <div className="flex flex-wrap gap-1" role="img" aria-label="Daily solve activity heatmap">
      {days.map((day) => (
        <div
          key={day.date.toISOString()}
          title={`${day.date.toDateString()}: ${day.delta} solved`}
          className={cn("size-3 rounded-sm", intensityClass(day.delta))}
        />
      ))}
    </div>
  );
}
