import "server-only";
import { prisma } from "@/lib/prisma";

export type LeaderboardSortKey =
  | "totalSolved"
  | "contestRating"
  | "easySolved"
  | "mediumSolved"
  | "hardSolved";

interface GetLeaderboardParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: LeaderboardSortKey;
  sortDir?: "asc" | "desc";
}

export async function getLeaderboard({
  page = 1,
  pageSize = 25,
  search,
  sortBy = "totalSolved",
  sortDir = "desc",
}: GetLeaderboardParams) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { rollNumber: { contains: search, mode: "insensitive" as const } },
          { leetcodeUsername: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        rollNumber: true,
        leetcodeUsername: true,
        avatarUrl: true,
        leetcodeStats: true,
      },
      orderBy: { leetcodeStats: { [sortBy]: sortDir } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function getUserProfileByRollNumber(rollNumber: string) {
  return prisma.user.findUnique({
    where: { rollNumber },
    select: {
      id: true,
      name: true,
      rollNumber: true,
      leetcodeUsername: true,
      avatarUrl: true,
      createdAt: true,
      leetcodeStats: true,
      statsSnapshots: {
        orderBy: { date: "desc" },
        take: 90, // ~3 months for the activity heatmap
      },
    },
  });
}
