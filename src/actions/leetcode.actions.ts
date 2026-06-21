"use server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getLeetCodeStats } from "@/services/leetcode.service";
import { LeetCodeUserNotFoundError } from "@/types/leetcode.types";
import { auth } from "@/lib/auth";

type SyncResult = { success: true } | { success: false; error: string };

export async function syncCurrentUserStats(): Promise<SyncResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "You must be logged in to sync stats" };
  }

  try {
    const stats = await getLeetCodeStats(session.user.leetcodeUsername);

    await prisma.$transaction([
      prisma.leetCodeStats.upsert({
        where: { userId: session.user.id },
        create: {
          userId: session.user.id,
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
          acceptanceRate: stats.acceptanceRate,
          contestRating: stats.contestRating,
          globalRanking: stats.globalRanking,
          badges: stats.badges as unknown as Prisma.InputJsonValue,
        },
        update: {
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
          acceptanceRate: stats.acceptanceRate,
          contestRating: stats.contestRating,
          globalRanking: stats.globalRanking,
          badges: stats.badges as unknown as Prisma.InputJsonValue,
          lastSyncedAt: new Date(),
        },
      }),
      prisma.statsSnapshot.upsert({
        where: {
          userId_date: {
            userId: session.user.id,
            date: new Date(new Date().toDateString()),
          },
        },
        create: {
          userId: session.user.id,
          date: new Date(new Date().toDateString()),
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
        },
        update: {
          totalSolved: stats.totalSolved,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath(`/user/${session.user.rollNumber}`);
    revalidatePath("/leaderboard");

    return { success: true };
  } catch (error) {
    if (error instanceof LeetCodeUserNotFoundError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Couldn't reach LeetCode right now. Try again shortly." };
  }
}
