import Image from "next/image";
import type { LeetCodeBadge } from "@/types/leetcode.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BadgesListProps {
  badges: unknown;
}

function parseBadges(raw: unknown): LeetCodeBadge[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (b): b is LeetCodeBadge =>
      typeof b === "object" && b !== null && "id" in b && "displayName" in b
  );
}

export function BadgesList({ badges }: BadgesListProps) {
  const parsed = parseBadges(badges);

  if (parsed.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Badges</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No badges earned yet — they&apos;ll show up here after the next sync.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Badges ({parsed.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {parsed.map((badge) => (
          <div key={badge.id} className="flex w-16 flex-col items-center gap-1.5 text-center">
            <div className="relative size-12">
              <Image
                src={badge.icon}
                alt={badge.displayName}
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <p className="line-clamp-2 text-[10px] text-muted-foreground">
              {badge.displayName}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
