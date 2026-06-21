import Link from "next/link";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { LeaderboardSortKey } from "@/services/user.service";

interface SortableHeaderProps {
  label: string;
  sortKey: LeaderboardSortKey;
  currentSort: LeaderboardSortKey;
  currentDir: "asc" | "desc";
  search?: string;
  className?: string;
}

export function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDir,
  search,
  className,
}: SortableHeaderProps) {
  const isActive = currentSort === sortKey;
  const nextDir = isActive && currentDir === "desc" ? "asc" : "desc";

  const params = new URLSearchParams();
  params.set("sortBy", sortKey);
  params.set("sortDir", nextDir);
  if (search) params.set("search", search);

  const Icon = !isActive ? ArrowUpDown : currentDir === "desc" ? ArrowDown : ArrowUp;

  return (
    <TableHead className={className}>
      <Link
        href={`/leaderboard?${params.toString()}`}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {label}
        <Icon className="size-3" />
      </Link>
    </TableHead>
  );
}
