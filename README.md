# CodeRank

A LeetCode leaderboard built exclusively for DTU students. Tracks competitive programming stats, displays public rankings and profiles, and syncs data from LeetCode automatically on a nightly schedule.

## Live Demo

https://code-rank-slyo.vercel.app

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** Auth.js v5 (OAuth)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Features

- DTU-restricted authentication — only verified users can access the dashboard
- Public leaderboard with student rankings based on LeetCode problem count and rating
- Individual public profiles viewable without login
- Private dashboard for authenticated users to track personal stats
- Nightly sync job that automatically fetches updated stats from LeetCode

## Project Structure

```
CodeRank/
├── prisma/             # Database schema and migrations
├── src/
│   ├── app/            # Next.js App Router pages and API routes
│   ├── components/     # Reusable UI components
│   └── lib/            # Auth config, Prisma client, utilities
├── next.config.ts
└── vercel.json
```

## Local Development

**1. Clone the repository**
```bash
git clone https://github.com/Sanj-2/CodeRank.git
cd CodeRank
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root:
```
DATABASE_URL=your_postgresql_connection_string
AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_github_oauth_id
AUTH_GITHUB_SECRET=your_github_oauth_secret
```

**4. Run database migrations**
```bash
npx prisma migrate dev
```

**5. Start the development server**
```bash
npm run dev
```

Open http://localhost:3000

## Deployment

The application is deployed on Vercel with environment variables configured via the Vercel dashboard. The database is hosted on a managed PostgreSQL service. Prisma migrations are applied manually before each deployment.
