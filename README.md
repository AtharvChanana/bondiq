# BondIQ

BondIQ is an AI-powered relationship memory system built with Next.js 14, Supabase, Prisma, PostgreSQL, Gemini, shadcn/ui, and Tailwind CSS.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in Supabase, PostgreSQL, Gemini, and cron secrets.
3. Run `npm install`.
4. Run `npm run db:push` for initial schema sync, or `npm run db:migrate` once you want migrations.
5. Run `npm run dev`.

## Environment

```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
CRON_SECRET=
```

## Architecture

The app follows feature-based boundaries:

- `app/` contains routes and thin API handlers.
- `features/` contains user-facing feature modules.
- `shared/` contains reusable UI, hooks, constants, utils, and types.
- `server/` contains backend services, repositories, jobs, auth, Prisma, and Gemini code.

API handlers authenticate, validate with Zod, and delegate to `server/services`.

<!-- Trigger Vercel Deploy -->
