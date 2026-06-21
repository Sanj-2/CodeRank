import "server-only";
import type {
  LeetCodeRawProfile,
  NormalizedLeetCodeStats,
} from "@/types/leetcode.types";
import { LeetCodeUserNotFoundError } from "@/types/leetcode.types";

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

// LeetCode has no official public API. This is the same unofficial GraphQL
// endpoint leetcode.com's own frontend uses — widely relied on by community
// tools, but it is undocumented and can change without notice. Keep all
// LeetCode-specific knowledge isolated to this file so a breaking change only
// requires editing here.
const PROFILE_QUERY = /* GraphQL */ `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        userAvatar
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      badges {
        id
        displayName
        icon
      }
    }
    userContestRanking(username: $username) {
      rating
      globalRanking
      attendedContestsCount
    }
  }
`;

async function fetchLeetCodeProfile(username: string): Promise<LeetCodeRawProfile> {
  const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: PROFILE_QUERY,
      variables: { username },
    }),
    // Revalidate periodically rather than on every request — paired with the
    // nightly cron refresh that writes results into LeetCodeStats.
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`LeetCode API responded with status ${response.status}`);
  }

  const json = await response.json();
  return json.data as LeetCodeRawProfile;
}

function normalize(raw: LeetCodeRawProfile, username: string): NormalizedLeetCodeStats {
  if (!raw.matchedUser) {
    throw new LeetCodeUserNotFoundError(username);
  }

  const stats = raw.matchedUser.submitStatsGlobal.acSubmissionNum;
  const find = (difficulty: string) =>
    stats.find((s) => s.difficulty === difficulty) ?? { count: 0, submissions: 0 };

  const all = find("All");
  const easy = find("Easy");
  const medium = find("Medium");
  const hard = find("Hard");

  const acceptanceRate =
    all.submissions > 0 ? Number(((all.count / all.submissions) * 100).toFixed(1)) : 0;

  return {
    username: raw.matchedUser.username,
    totalSolved: all.count,
    easySolved: easy.count,
    mediumSolved: medium.count,
    hardSolved: hard.count,
    acceptanceRate,
    contestRating: raw.userContestRanking?.rating
      ? Math.round(raw.userContestRanking.rating)
      : null,
    globalRanking: raw.userContestRanking?.globalRanking ?? raw.matchedUser.profile.ranking,
    avatarUrl: raw.matchedUser.profile.userAvatar,
    badges: raw.matchedUser.badges ?? [],
  };
}

export async function getLeetCodeStats(username: string): Promise<NormalizedLeetCodeStats> {
  const raw = await fetchLeetCodeProfile(username);
  return normalize(raw, username);
}
