import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Search, TrendingUp, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Trophy,
    title: "Live leaderboard",
    description:
      "See exactly where you stand against every DTU student tracking LeetCode — sorted by solves, contest rating, or difficulty split.",
  },
  {
    icon: Search,
    title: "Searchable, sortable",
    description: "Find anyone by name, roll number, or LeetCode handle in seconds.",
  },
  {
    icon: TrendingUp,
    title: "Shareable profiles",
    description:
      "Every student gets a public profile page — solved counts, contest rating, badges, all in one link.",
  },
  {
    icon: ShieldCheck,
    title: "DTU-only, verified",
    description: "Registration is restricted to verified DTU accounts, so the board stays honest.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-28">
        <p className="mb-4 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          Built for Delhi Technological University
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Where DTU ranks its <span className="text-primary">LeetCode</span> grinders.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground sm:text-lg">
          One leaderboard for every DTU student solving on LeetCode. Track your rank,
          compare with batchmates, and prove it with numbers.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/register">Join the leaderboard</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/leaderboard">View rankings</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="size-5 text-primary" />
                <CardTitle className="mt-2 text-sm">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold">Ready to see your rank?</h2>
          <p className="max-w-md text-muted-foreground">
            Sign up with your DTU email and LeetCode handle — your stats sync automatically.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Create your account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
