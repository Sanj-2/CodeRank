import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface ProfileHeaderProps {
  name: string;
  rollNumber: string;
  leetcodeUsername: string;
  avatarUrl: string | null;
  contestRating: number | null;
  globalRanking: number | null;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ProfileHeader({
  name,
  rollNumber,
  leetcodeUsername,
  avatarUrl,
  contestRating,
  globalRanking,
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <Avatar className="size-20">
        <AvatarImage src={avatarUrl ?? undefined} alt={name} />
        <AvatarFallback className="text-xl">{initials(name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm text-muted-foreground">{rollNumber}</p>
        <a
          href={`https://leetcode.com/u/${leetcodeUsername}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          @{leetcodeUsername}
          <ExternalLink className="size-3" />
        </a>
      </div>

      <div className="flex gap-2">
        {contestRating !== null && (
          <Badge variant="outline">Rating {contestRating}</Badge>
        )}
        {globalRanking !== null && (
          <Badge variant="outline">Global rank #{globalRanking.toLocaleString()}</Badge>
        )}
      </div>
    </div>
  );
}
