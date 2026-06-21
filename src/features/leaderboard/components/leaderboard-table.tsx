import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { SortableHeader } from "./sortable-header";
import type { LeaderboardSortKey } from "@/services/user.service";

interface LeaderboardUser {
  id: string;
  name: string;
  rollNumber: string;
  leetcodeUsername: string;
  avatarUrl: string | null;
  leetcodeStats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    contestRating: number | null;
  } | null;
}

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  page: number;
  pageSize: number;
  sortBy: LeaderboardSortKey;
  sortDir: "asc" | "desc";
  search?: string;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LeaderboardTable({
  users,
  page,
  pageSize,
  sortBy,
  sortDir,
  search,
}: LeaderboardTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
        No students match that search yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <th className="h-10 w-12 px-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Rank
          </th>
          <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Student
          </th>
          <SortableHeader
            label="Solved"
            sortKey="totalSolved"
            currentSort={sortBy}
            currentDir={sortDir}
            search={search}
          />
          <th className="h-10 px-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Easy / Med / Hard
          </th>
          <SortableHeader
            label="Rating"
            sortKey="contestRating"
            currentSort={sortBy}
            currentDir={sortDir}
            search={search}
          />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user, index) => {
          const rank = (page - 1) * pageSize + index + 1;
          const stats = user.leetcodeStats;

          return (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-muted-foreground">#{rank}</TableCell>
              <TableCell>
                <Link
                  href={`/user/${user.rollNumber}`}
                  className="flex items-center gap-3 hover:text-primary"
                >
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.rollNumber} · {user.leetcodeUsername}
                    </p>
                  </div>
                </Link>
              </TableCell>
              <TableCell className="font-mono font-medium">
                {stats?.totalSolved ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex gap-1.5 font-mono text-xs">
                  <Badge variant="easy">{stats?.easySolved ?? 0}</Badge>
                  <Badge variant="medium">{stats?.mediumSolved ?? 0}</Badge>
                  <Badge variant="hard">{stats?.hardSolved ?? 0}</Badge>
                </div>
              </TableCell>
              <TableCell className="font-mono">{stats?.contestRating ?? "Unrated"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
