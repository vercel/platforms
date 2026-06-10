# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server with Turbopack
pnpm build    # Production build
pnpm start    # Start production server
```

No lint or test scripts are configured. Add shadcn/ui components via `pnpm dlx shadcn@latest add <component>`.

---

## Engineering Philosophy

**This project is maintained by a non-technical owner.** Every technical decision must be made with that context in mind. When choosing between approaches, always prefer the option that is:

1. **Easier to understand** — a future developer (or Claude) looking at this code cold should be able to follow what's happening without reading a design document
2. **Easier to troubleshoot** — when something breaks at 10pm before a game day, the error should be obvious and fixable without deep expertise
3. **Easier to upgrade** — dependencies should be mainstream and actively maintained; avoid pinning to obscure forks or patched versions
4. **Less custom** — every line of custom infrastructure (auth, queuing, caching, etc.) is a liability; prefer offloading that responsibility to Supabase, Vercel, or a well-known library

### Specific rules that flow from this

**Prefer standard library features over custom abstractions.** If Next.js, Supabase, or React already does something, use that. Don't build a custom session manager when Supabase Auth exists. Don't build a custom role system backed by a bespoke DB schema when a simple `role` column on `account_members` does the job.

**Prefer boring solutions.** A `switch` statement for role checks is better than a permission graph engine. A flat SQL table is better than a polymorphic schema. Working code that a junior developer can read beats elegant code that requires context to understand.

**No premature abstraction.** Don't create a helper, hook, or utility until the same logic appears in at least three places. Duplication is cheaper than the wrong abstraction. This project's scale does not require heavy indirection.

**Small surface area.** Every new dependency, environment variable, and config file is something that can break and needs updating. Add them deliberately. Document them immediately.

**When in doubt, ask.** If a task could be done in a simple way or a powerful-but-complex way, surface the tradeoff in one sentence and let the owner decide. Don't silently choose complexity.

---

## What This App Is

A **soccer academy management platform**. Coaches manage players, groups, game days, and rosters. The original subdomain/landing page code has been replaced by this dashboard. The app lives entirely under `app/(dashboard)/`.

**Outstanding tasks are tracked in `TODO.md`** at the project root — check there before starting new features.

---

## Architecture

Next.js 15 App Router. All pages follow the **Server Component + Client Component split**:
- Server Components (`page.tsx`) fetch data from Supabase and pass it as props
- Client Components (`*-client.tsx`) handle interactivity; call Server Actions via `useTransition`
- Never fetch data in Client Components; never call Server Actions from Server Components

### Routing

- `app/(dashboard)/` — main dashboard (players, game-day, settings, profile)
- `app/login/` — login page; `app/login/google/`, `app/login/facebook/` — OAuth route handlers
- `app/auth/callback/` — Supabase OAuth callback (code exchange + auto-link)
- `app/pep/` — system admin panel (account management, impersonation)
- `app/s/[subdomain]/` — legacy subdomain pages, not actively used
- `middleware.ts` — auth protection, Pep protection, subdomain routing. **Read before touching.**

### Data Layer (Supabase)

No ORM. Direct Supabase client queries. Two clients:

| File | Key used | RLS | Use for |
|------|----------|-----|---------|
| `lib/supabase.ts` | Service role | Bypassed | Server actions, Pep, any write that needs full access |
| `lib/supabase-server.ts` | Anon | Enforced | Auth session reads (`getUser`, `getSession`) |
| `lib/supabase-browser.ts` | Anon | Enforced | Client Components (not yet used) |

**Environment variables (all required):**
```
NEXT_PUBLIC_SUPABASE_URL=https://fomanzxevxoghyzwbqim.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>       ← browser-safe, used by SSR and browser clients
SUPABASE_ANON_KEY=<anon-key>                   ← same value, legacy name
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   ← never expose to browser
```

(The old `PEP_SECRET` env var was retired — Pep access is now identity-based via the `system_admins` table.)

Supabase project ref: `fomanzxevxoghyzwbqim`

### Multi-Tenancy

Top-level tenant is an **account**:
- `accounts(id, name, created_at)`
- `account_members(id, account_id, user_id, role)` — links `auth.users` to an account
- Every data table has `account_id uuid NOT NULL REFERENCES accounts(id)`
- RLS is enabled on all tables but currently bypassed (service role key)
- `getActiveAccountId()` in `lib/account.ts` returns the active account — checks the `pep_account_id` cookie first (Pep impersonation, **only honored when the logged-in user is a verified system admin**), then the real user's `account_members` row

### Authentication

Supabase Auth. Implemented and active.

- **Login page**: `app/login/page.tsx` — Google, Facebook, email/password
- **OAuth flow**: clicking Google/Facebook hits a route handler → Supabase returns a redirect URL → user goes to provider → redirected back to `/auth/callback`
- **Callback** (`app/auth/callback/route.ts`): exchanges code for session, then auto-links: if `user.email` matches a `coaches.email` row, creates `account_members` with role `coach`
- **Logout**: `signOut()` in `app/login/actions.ts`
- **Pep access**: identity-based. A system admin logs in normally (Supabase), and their email is matched against the `system_admins` table (`getSystemAdmin()` in `lib/auth.ts`). `/pep` requires a logged-in session in middleware; the `/pep` page authorizes via `requireSystemAdmin()`. Impersonation sets the `pep_account_id` cookie while keeping the admin's own Supabase session.

### Authorization (Roles)

Defined in `lib/roles.ts`. Four levels (highest to lowest):

| Role | Who it's for |
|------|-------------|
| `owner` | Account creator; full access |
| `admin` | Staff with full operational access |
| `coach` | Can manage rosters and players for their groups |
| `viewer` | Read-only access |

**In server actions**, always call `requireRole` as the first line:
```typescript
export async function addGroup(...) {
  await requireRole('admin')  // throws if insufficient role, redirects if not logged in
  // ...
}
```

**Auth helpers** (`lib/auth.ts`):
- `getUserAccount()` — cached per request; returns `{ userId, accountId, role, activeRole, coachId, email, displayName, canEditGames }` or null
- `requireAuth()` — redirects to `/login` if no session
- `requireRole(minRole)` — redirects if no session, throws an Error if role is insufficient
- `getSystemAdmin()` — cached per request; returns the `system_admins` row matching the logged-in user's email, or null
- `requireSystemAdmin()` — redirects to `/game-day` if the user is not a system admin (used by `/pep`)

**Permission checks** (`lib/roles.ts` → `can.*`):
```typescript
can.manageSettings(role)  // admin+
can.createGameDay(role)   // admin+
can.manageRosters(role)   // coach+
can.managePlayers(role)   // coach+
can.manageMembers(role)   // admin+
```
Use these to conditionally show/hide UI elements in Client Components.

### Database Schema

All tables have `account_id uuid NOT NULL REFERENCES accounts(id)`. Schema changes go through Supabase migrations via MCP `apply_migration` — never `execute_sql` for DDL.

| Table | Purpose |
|-------|---------|
| `coaches` | Coach name + email |
| `groups` | Age groups (U8–U16); has `lead_coach_id` |
| `group_coaches` | Junction: coaches → groups |
| `teams` | Teams within a group; `archived` boolean |
| `players` | Belong to a group; `status` (active/archived) |
| `jersey_colors` | Name + hex color |
| `locations` | Venue name, address, alternate_names |
| `game_days` | Top-level event; `status`, `start_date`, `end_date` |
| `game_day_groups` | Group's participation in a game day; `roster_status` (draft/published) |
| `games` | Individual games; `game_date`, `game_time`, `field`, `build_home_roster`, `build_away_roster`; FKs to coach, jersey_color, location |
| `roster_entries` | Player assignments per game; `is_unavailable`, `notes` |
| `system_admins` | Global (no `account_id`); grants Pep access. `email` (unique), `name`. Matched against the logged-in user's email. |

**FK disambiguation** — `game_day_groups` has two coach FKs; always use hint syntax:
```typescript
lead_coach:coaches!game_day_groups_lead_coach_id_fkey(id, name)
publisher:coaches!game_day_groups_published_by_fkey(id, name)
```

### UI / Styling

- shadcn/ui, **radix-luma style, mist base color** (not New York/zinc)
- `radix-ui` monorepo package — do not use individual `@radix-ui/react-*` packages
- `shadcn` as a direct dependency (required for `@import "shadcn/tailwind.css"`)
- Tailwind v4 with `@tailwindcss/postcss`
- Dark mode supported via theme provider

### Server Actions Pattern

All mutations in `actions.ts` co-located with the page they serve:
```
app/(dashboard)/players/actions.ts
app/(dashboard)/settings/actions.ts
app/(dashboard)/game-day/actions.ts             ← createGameDay
app/(dashboard)/game-day/[id]/actions.ts        ← game field edits (coach, jersey, group)
app/(dashboard)/game-day/[id]/roster/actions.ts ← roster save
app/login/actions.ts                            ← signInWithEmail, signOut
app/pep/actions.ts                              ← createAccount, switchAccount, exitAccount, addSystemAdmin, updateSystemAdminName, removeSystemAdmin
```

Every action:
1. Calls `requireRole(...)` first (for protected actions)
2. Runs the Supabase mutation
3. Calls `revalidatePath(...)` to refresh the UI

Client components call actions inside `startTransition` from `useTransition`.

### Pep — System Admin Panel

`/pep` is a system admin panel (not a user-facing feature). Access is **identity-based**: a system admin logs in normally, and their email must match a row in the `system_admins` table.
- No separate login — `requireSystemAdmin()` authorizes the `/pep` page; non-admins are redirected to `/game-day`
- System admins reach `/pep` via the **Pep** entry in the sidebar context selector (only shown to system admins)
- Lists all accounts, lets admins create new accounts
- Manages the `system_admins` list: add (by email + optional name), edit name, remove. The last remaining admin cannot be removed (lockout protection)
- "Log in as" button sets the `pep_account_id` cookie, redirecting to the dashboard in that account's context
- Dashboard layout shows an amber "Viewing as [Account]" banner with an Exit button when impersonating

---

## What NOT to Do

- **Do not fetch data in Client Components** — always pass from Server Component as props
- **Do not use `execute_sql` for DDL** — use `apply_migration`
- **Do not hardcode IDs in migrations** — use subqueries to look up by name
- **Do not use individual `@radix-ui/react-*` packages** — use the `radix-ui` monorepo package
- **Do not store seed data with hand-crafted UUIDs** — let `gen_random_uuid()` generate them
- **Do not call `requireRole()` from Client Components** — only in Server Actions
- **Do not add custom infrastructure** (caching layers, background job systems, pub/sub) without explicit approval — prefer Supabase built-ins and Vercel platform features
- **Do not introduce new dependencies without a clear reason** — document every new package in the commit message
