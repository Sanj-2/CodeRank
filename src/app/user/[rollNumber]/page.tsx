import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUserProfileByRollNumber } from "@/services/user.service";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ActivityHeatmap } from "@/features/profile/components/activity-heatmap";
import { BadgesList } from "@/features/profile/components/badges-list";
import { StatCardGrid } from "@/components/shared/stat-card-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_NAME } from "@/constants";

interface ProfilePageProps {
  params: Promise<{ rollNumber: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { rollNumber } = await params;
  const user = await getUserProfileByRollNumber(rollNumber);

  if (!user) return { title: "Profile not found" };

  return {
    title: `${user.name} (${user.rollNumber})`,
    description: `${user.name}'s LeetCode stats on ${SITE_NAME} — ${
      user.leetcodeStats?.totalSolved ?? 0
    } problems solved.`,
  };
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { rollNumber } = await params;
  const user = await getUserProfileByRollNumber(rollNumber);

  if (!user) notFound();

  const stats = user.leetcodeStats;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <ProfileHeader
        name={user.name}
        rollNumber={user.rollNumber}
        leetcodeUsername={user.leetcodeUsername}
        avatarUrl={user.avatarUrl}
        contestRating={stats?.contestRating ?? null}
        globalRanking={stats?.globalRanking ?? null}
      />

      <StatCardGrid
        totalSolved={stats?.totalSolved ?? 0}
        easySolved={stats?.easySolved ?? 0}
        mediumSolved={stats?.mediumSolved ?? 0}
        hardSolved={stats?.hardSolved ?? 0}
        acceptanceRate={stats?.acceptanceRate ?? 0}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityHeatmap snapshots={user.statsSnapshots} />
        </CardContent>
      </Card>

      <BadgesList badges={stats?.badges} />

      {stats?.lastSyncedAt && (
        <p className="text-xs text-muted-foreground">
          Last synced {new Date(stats.lastSyncedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
