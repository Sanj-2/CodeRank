import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLeetCodeStats } from "@/services/leetcode.service";

// Triggered by Vercel Cron (see vercel.json) once nightly. Protected by
// CRON_SECRET so the endpoint can't be hit by anyone who finds the URL.
// Syncs are done with a small concurrency cap and best-effort per user —
// one user's LeetCode profile failing (renamed/private) never blocks the rest.
const CONCURRENCY = 5;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, leetcodeUsername: true },
  });

  let succeeded = 0;
  let failed = 0;
  const today = new Date(new Date().toDateString());

  for (let i = 0; i < users.length; i += CONCURRENCY) {
    const batch = users.slice(i, i + CONCURRENCY);

    await Promise.all(
      batch.map(async (user: { id: string; leetcodeUsername: string }) => {
        try {
          const stats = await getLeetCodeStats(user.leetcodeUsername);

          await prisma.$transaction([
            prisma.leetCodeStats.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                totalSolved: stats.totalSolved,
                easySolved: stats.easySolved,
                mediumSolved: stats.mediumSolved,
                hardSolved: stats.hardSolved,
                acceptanceRate: stats.acceptanceRate,
                contestRating: stats.contestRating,
                globalRanking: stats.globalRanking,
                badges: stats.badges,
              },
              update: {
                totalSolved: stats.totalSolved,
                easySolved: stats.easySolved,
                mediumSolved: stats.mediumSolved,
                hardSolved: stats.hardSolved,
                acceptanceRate: stats.acceptanceRate,
                contestRating: stats.contestRating,
                globalRanking: stats.globalRanking,
                badges: stats.badges,
                lastSyncedAt: new Date(),
              },
            }),
            prisma.statsSnapshot.upsert({
              where: { userId_date: { userId: user.id, date: today } },
              create: {
                userId: user.id,
                date: today,
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
          succeeded++;
        } catch {
          failed++;
        }
      })
    );
  }

  return NextResponse.json({ succeeded, failed, total: users.length });
}
