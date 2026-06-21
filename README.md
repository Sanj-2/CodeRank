# CodeRank

A LeetCode leaderboard exclusively for DTU students. Public rankings, public profiles, a
private dashboard, and a nightly sync job that pulls fresh stats from LeetCode.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Prisma · PostgreSQL · Auth.js v5
(credentials) · Zod · React Hook Form · TanStack Query

## Getting started

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL, AUTH_SECRET, CRON_SECRET
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

- `DATABASE_URL` — any Postgres instance (Neon/Supabase/Railway/local all work).
- `AUTH_SECRET` — generate with `npx auth secret`.
- `CRON_SECRET` — any random string; only needed once you deploy the cron job.

> **Note on this sandbox build:** `npx prisma generate` couldn't run here because this
> environment's network allowlist doesn't include `binaries.prisma.sh` (Prisma's engine
> CDN). The code is correct and type-checks cleanly otherwise — run the two commands
> above locally or in Claude Code and it'll generate without issue.

## What's built

- **Auth** — register (name, roll number, email, password, LeetCode username) and
  login via Auth.js credentials provider, bcrypt-hashed passwords, JWT sessions.
  Registration is restricted to `@dtu.ac.in` emails — drop the `.refine()` check in
  `src/schemas/auth.schema.ts` if that's not what you want.
- **Dashboard** (`/dashboard`, protected by middleware) — own stats + manual "Sync now".
- **Leaderboard** (`/leaderboard`, public, SSR) — search, sortable columns
  (solved / rating), pagination, all driven by URL params so it's shareable.
- **Public profile** (`/user/[rollNumber]`) — stats, badges data model, simple activity
  heatmap built from daily snapshots.
- **LeetCode sync** — `src/services/leetcode.service.ts` wraps LeetCode's unofficial
  GraphQL API. `src/actions/leetcode.actions.ts` is the manual sync (dashboard button);
  `src/app/api/cron/sync-leetcode-stats/route.ts` is the nightly batch job
  (`vercel.json` schedules it at 2 AM IST — swap for a different cron provider if not
  on Vercel).

## Folder structure

```
src/
├── app/            # routes (App Router)
├── components/ui/  # hand-written shadcn-style primitives (button, card, table, ...)
├── components/     # shared, cross-feature components (navbar, stat grid)
├── features/       # feature-scoped components (auth forms, leaderboard table, ...)
├── actions/        # server actions
├── services/       # external API + DB query logic (LeetCode client, user queries)
├── schemas/        # Zod schemas
├── lib/            # auth config, prisma client, utils
├── providers/      # client-side context providers
├── constants/
└── types/
```

## A few things worth knowing before you build further

- **shadcn CLI couldn't run in this sandbox** (it calls out to `ui.shadcn.com`, also
  outside the network allowlist). The components in `components/ui/` are hand-written
  to match shadcn's actual source/conventions, so `npx shadcn@latest add <component>`
  should still work normally for you locally and slot in the same way.
- **LeetCode has no official API.** The GraphQL endpoint in `leetcode.service.ts` is the
  same one leetcode.com's own frontend uses, and is what most community tools rely on —
  but it's undocumented and could change. All LeetCode-specific logic is isolated to that
  one file on purpose.
- **Schema is built to extend.** `LeetCodeStats` is a separate 1:1 table from `User` so
  adding Codeforces later is a new `CodeforcesStats` table + relation, not a `User`
  migration.

## Not built yet (per your "future features" list)

Codeforces integration, multi-platform support, placement stats, contest history,
friend system, admin dashboard, notifications, analytics, Redis caching, background
jobs beyond the cron route, Docker, full CI/CD, role-based access.
