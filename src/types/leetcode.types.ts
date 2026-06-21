export interface LeetCodeSubmissionStat {
  difficulty: "All" | "Easy" | "Medium" | "Hard";
  count: number;
  submissions: number;
}

export interface LeetCodeBadge {
  id: string;
  displayName: string;
  icon: string;
}

export interface LeetCodeRawProfile {
  matchedUser: {
    username: string;
    profile: {
      ranking: number | null;
      userAvatar: string | null;
    };
    submitStatsGlobal: {
      acSubmissionNum: LeetCodeSubmissionStat[];
    };
    badges: LeetCodeBadge[];
  } | null;
  userContestRanking: {
    rating: number;
    globalRanking: number;
    attendedContestsCount: number;
  } | null;
}

// Normalized shape used throughout the app (dashboard, leaderboard, profile)
export interface NormalizedLeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  acceptanceRate: number;
  contestRating: number | null;
  globalRanking: number | null;
  avatarUrl: string | null;
  badges: LeetCodeBadge[];
}

export class LeetCodeUserNotFoundError extends Error {
  constructor(username: string) {
    super(`LeetCode user "${username}" was not found`);
    this.name = "LeetCodeUserNotFoundError";
  }
}
