import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-5xl font-bold text-primary">404</p>
      <h2 className="text-lg font-semibold">No student found with that roll number</h2>
      <p className="text-sm text-muted-foreground">
        Double-check the roll number, or browse the full leaderboard.
      </p>
      <Button asChild>
        <Link href="/leaderboard">View leaderboard</Link>
      </Button>
    </div>
  );
}
