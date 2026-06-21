import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProfileByRollNumber } from "@/services/user.service";
import { StatCardGrid } from "@/components/shared/stat-card-grid";
import { ActivityHeatmap } from "@/features/profile/components/activity-heatmap";
import { SyncButton } from "@/features/dashboard/components/sync-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = { title: "Dashboard" };

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await getUserProfileByRollNumber(session.user.rollNumber);
  if (!user) redirect("/login");

  const stats = user.leetcodeStats;
  const hasSynced = Boolean(stats);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.name} />
            <AvatarFallback>{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-muted-foreground">
              {user.rollNumber} · @{user.leetcodeUsername}
            </p>
          </div>
        </div>
        <SyncButton />
      </div>

      {!hasSynced ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">No stats yet</CardTitle>
            <CardDescription>
              Hit &quot;Sync now&quot; to pull your solved counts and rating straight from
              LeetCode. After this, it refreshes automatically every night.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <StatCardGrid
            totalSolved={stats!.totalSolved}
            easySolved={stats!.easySolved}
            mediumSolved={stats!.mediumSolved}
            hardSolved={stats!.hardSolved}
            acceptanceRate={stats!.acceptanceRate}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contest rating</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">
                  {stats!.contestRating ?? "Unrated"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Global ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold tabular-nums">
                  {stats!.globalRanking ? `#${stats!.globalRanking.toLocaleString()}` : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap snapshots={user.statsSnapshots} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
