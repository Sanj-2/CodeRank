import type { Metadata } from "next";
import { getLeaderboard, type LeaderboardSortKey } from "@/services/user.service";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";
import { LeaderboardSearch } from "@/features/leaderboard/components/leaderboard-search";
import { Pagination } from "@/features/leaderboard/components/pagination";
import { LEADERBOARD_PAGE_SIZE, SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: `See how DTU students rank on LeetCode — live solved counts and contest ratings on ${SITE_NAME}.`,
};

const VALID_SORT_KEYS: LeaderboardSortKey[] = [
  "totalSolved",
  "contestRating",
  "easySolved",
  "mediumSolved",
  "hardSolved",
];

interface LeaderboardPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}

export default async function LeaderboardPage({ searchParams }: LeaderboardPageProps) {
  const params = await searchParams;

  const page = Math.max(1, Number(params.page) || 1);
  const search = params.search?.trim() || undefined;
  const sortBy: LeaderboardSortKey = VALID_SORT_KEYS.includes(params.sortBy as LeaderboardSortKey)
    ? (params.sortBy as LeaderboardSortKey)
    : "totalSolved";
  const sortDir = params.sortDir === "asc" ? "asc" : "desc";

  const { users, totalPages } = await getLeaderboard({
    page,
    pageSize: LEADERBOARD_PAGE_SIZE,
    search,
    sortBy,
    sortDir,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Ranked by {sortBy === "totalSolved" ? "total problems solved" : "contest rating"}.
          </p>
        </div>
        <LeaderboardSearch />
      </div>

      <LeaderboardTable
        users={users}
        page={page}
        pageSize={LEADERBOARD_PAGE_SIZE}
        sortBy={sortBy}
        sortDir={sortDir}
        search={search}
      />

      <Pagination page={page} totalPages={totalPages} search={search} sortBy={sortBy} sortDir={sortDir} />
    </div>
  );
}
