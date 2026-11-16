# SGV Christian Club Collective

The official site for the SGV Christian Club Collective: a regional network of 20 high school Christian clubs across the San Gabriel Valley.

> One mission, every campus.

Built with Next.js 16, Tailwind v4, Supabase (auth + database), and zero ego. Deployed on Vercel (every push to `main` goes to production; pull requests get a preview URL), with DNS on Cloudflare.

## Quick start

```bash
cp .env.example .env.local       # then fill in your Supabase keys
npm install
npm run dev                      # http://localhost:3000
```

## Tech stack

- Next.js 16 (App Router, Turbopack, server actions, standalone output)
- React 19
- Tailwind CSS v4
- Supabase (Postgres + Auth, accessed via @supabase/ssr)
- TypeScript, Zod, lucide-react

## Project structure

```
src/
  app/
    page.tsx                    Home
    about/                      About
    events/                     Events list
    everything-night/           The flagship event landing page
    clubs/                      Directory of all 20 clubs (with search)
    leadership/                 Current and past presidents
    churches/                   Partner churches
    contact/                    Contact + join form
      actions.ts                Server actions: submitContact, submitRsvp
    admin/                      Protected admin area
      login/                    Email + password sign in
      page.tsx                  Overview
      rsvps/                    RSVP table
      messages/                 Contact inbox
      actions.ts                signIn / signOut
  components/                   Shared UI (ScrollNav, Footer, EventCard, etc.)
  lib/
    data/                       Static content (clubs, events, leadership, churches)
    supabase/                   Server + browser clients
    utils.ts                    cn() helper
  proxy.ts                      Refreshes Supabase auth cookies on each request
  types/supabase.ts             Database type definitions
public/images/                  All event photography
supabase/schema.sql             Tables, RLS policies, indexes
railway.json, nixpacks.toml     Railway deploy config
```

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL editor and run the contents of `supabase/schema.sql` once. This creates `rsvps`, `contact_messages`, `events`, `clubs`, `announcements` with RLS policies that:
   - Allow anonymous inserts on `rsvps` and `contact_messages` (so the public forms work).
   - Restrict reads to authenticated users (admins).
3. Copy `Project URL` and `anon public key` into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
4. Add at least one admin user under Authentication > Users (email + password).
5. Sign in at `/admin/login`.

## Deploying to Railway

This repo ships with `railway.json` and `nixpacks.toml`, so deployment is two steps:

1. Push the repo to GitHub (already wired by Tyler).
2. On Railway, create a new project from the GitHub repo. Railway autodetects Next.js. Set these env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (optional, used for OG tags)
3. Click Deploy. The build runs `npm ci && npm run build`, the runtime runs `npm run start`.

`output: "standalone"` is set in `next.config.ts` so the production server is small and self-contained.

## Editing content

| Want to change                       | File                             |
| ------------------------------------ | -------------------------------- |
| Clubs list (schools, descriptions)   | `src/lib/data/clubs.ts`          |
| Events (Everything Night date, etc.) | `src/lib/data/events.ts`         |
| Leadership team                      | `src/lib/data/leadership.ts`     |
| Church partners                      | `src/lib/data/churches.ts`       |
| Site footer copy                     | `src/components/site-footer.tsx` |
| Hero copy                            | `src/app/page.tsx`               |

The DB tables in `supabase/schema.sql` are ready when you want to migrate this static content into a CMS.

## RSVP

Right now the homepage and Everything Night CTA point at Partiful. The form on `/contact` saves directly to Supabase (`contact_messages`), and `submitRsvp` is wired up in `src/app/contact/actions.ts` for when you want a built-in RSVP flow.

## Brand

- Navy: `#0d1f3d`
- Baby blue: `#8ec5fb`
- Cream / white: `#f5fbff` / `#ffffff`
- Font: Inter via `next/font`

---

Built with D1 Vibe Coding
