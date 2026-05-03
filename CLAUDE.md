# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server with Turbopack
pnpm build    # Production build
pnpm start    # Start production server
```

No lint or test scripts are configured. Add shadcn/ui components via `pnpm dlx shadcn@latest add <component>`.

## What This App Is

A **soccer academy management platform**. Coaches manage players, groups, game days, and rosters. The original subdomain/landing page code has been replaced by this dashboard. The app lives entirely under `app/(dashboard)/`.

## Architecture

Next.js 15 App Router. All pages follow the **Server Component + Client Component split**:
- Server Components (page.tsx files) fetch data from Supabase and pass it as props
- Client Components (*-client.tsx files) handle interactivity, use `useTransition` to call Server Actions
- Never fetch data client-side; never call Server Actions from Server Components

### Routing

- `app/(dashboard)/` — main dashboard (players, game-day, settings, profile)
- `app/s/[subdomain]/` — legacy subdomain pages (preserved from original project, not actively used)
- `middleware.ts` — subdomain routing logic, leave untouched

### Data Layer (Supabase)

No ORM. All DB access via `lib/supabase.ts` using the **service role key** (bypasses RLS).

```
NEXT_PUBLIC_SUPABASE_URL=https://fomanzxevxoghyzwbqim.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   ← required, get from Supabase dashboard → Settings → API
```

Supabase project ref: `fomanzxevxoghyzwbqim`

The service role key is **temporary** — it bypasses RLS for convenience during development. When auth is implemented, switch to `@supabase/ssr`'s `createServerClient` with the user's session cookie so RLS enforces account isolation automatically.

### Multi-Tenancy

The top-level tenant is an **account** (not academy, not organization). Key decisions:
- Table: `accounts(id, name, created_at)`
- Table: `account_members(id, account_id, user_id, role)` — links `auth.users` to an account
- Every data table has `account_id uuid NOT NULL REFERENCES accounts(id)`
- RLS is **enabled** on all tables with `account_isolation` policies using `current_account_id()` helper function
- `current_account_id()` is a `SECURITY DEFINER` SQL function that looks up `account_members` by `auth.uid()`
- Because we use the service role key server-side, RLS is currently bypassed — all data is accessible regardless of account

### Database Schema

11 core tables (all have `account_id`):
- `coaches` — coach name + email
- `groups` — age groups (U8, U10, U12, U14, U16), each has a `lead_coach_id`
- `group_coaches` — junction: which coaches are assigned to which groups
- `teams` — teams within a group
- `players` — belong to a group, have `status` (active/archived)
- `jersey_colors` — name + hex color
- `locations` — venue name + address
- `game_days` — top-level event with status (upcoming/live/completed)
- `game_day_groups` — a group's participation in a game day; has `roster_status` (draft/published)
- `games` — individual games within a game_day_group; has coach, jersey_color, location FKs
- `roster_entries` — player assignments per game; has `is_unavailable` flag and optional `notes`

**Important FK disambiguation**: `game_day_groups` has two FKs to coaches (`lead_coach_id` and `published_by`). Always use the hint syntax in Supabase selects:
```typescript
lead_coach:coaches!game_day_groups_lead_coach_id_fkey(id, name)
publisher:coaches!game_day_groups_published_by_fkey(id, name)
```

All schema changes must go through Supabase migrations (via MCP `apply_migration`), never raw `execute_sql` for DDL.

### UI / Styling

- shadcn/ui with **radix-luma style, mist base color** (not the default New York/zinc)
- Uses `radix-ui` monorepo package (not individual `@radix-ui/react-*` packages)
- `shadcn` package as a direct dependency (required for `@import "shadcn/tailwind.css"`)
- Tailwind v4 with `@tailwindcss/postcss`
- Theme provider wraps the app; dark mode supported

### Server Actions Pattern

All mutations live in `actions.ts` files co-located with the page:
```
app/(dashboard)/players/actions.ts
app/(dashboard)/settings/actions.ts
app/(dashboard)/game-day/[id]/actions.ts        ← game coach/jersey/group edits
app/(dashboard)/game-day/[id]/roster/actions.ts ← roster save
```
Every action calls `revalidatePath(...)` after mutation. Client components call actions inside `startTransition` from `useTransition`.

## Authentication

Not yet implemented. Planned approach:
- Supabase Auth (built-in, already part of the project)
- `account_members` table links `auth.users.id` to an `account_id` with a role
- When implemented, replace `lib/supabase.ts` with `@supabase/ssr` `createServerClient` per request

## Known TODOs (in priority order)

1. **Auth** — implement Supabase Auth login/signup; wire `account_members`
2. **NewGameDayWizard** — form exists in UI but doesn't write to database
3. **Dashboard home** — currently a "Coming soon" placeholder
4. **Profile page** — currently static mock content; no real user model yet
5. **Publish roster actions** — Publish/Update buttons in GameDayTabs are wired to UI only
6. **`ignore build errors`** — `next.config.ts` has `typescript: { ignoreBuildErrors: true }`; remove once types are clean

## What NOT to Do

- Do not fetch data in Client Components — always pass from Server Component as props
- Do not use `execute_sql` for DDL — use `apply_migration`
- Do not hardcode IDs in migrations — use subqueries to look up by name
- Do not use individual `@radix-ui/react-*` packages — use the `radix-ui` monorepo package
- Do not store seed data with hand-crafted UUIDs — let `gen_random_uuid()` generate them
