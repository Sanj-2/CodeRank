import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // LeetCode-hosted avatars and badge icons
      { protocol: "https", hostname: "assets.leetcode.com" },
      { protocol: "https", hostname: "leetcode.com" },
    ],
  },
};

export default nextConfig;
