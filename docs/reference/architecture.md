# Architecture

Orientation for a developer or agent new to the codebase. This is the narrative
"how it fits together"; `CLAUDE.md` has the terse rules and conventions — read
both.

## What it is

A **soccer academy management platform**. Each academy is an **account**; coaches
manage players, pools, game days, and rosters within it. Everything lives under
`app/(dashboard)/`. (The repo began as Vercel's subdomain multi-tenant template;
that origin survives only in `app/s/[subdomain]/`, which is not actively used.)

## The Server / Client split

Every page follows the same shape:

- **Server Components** (`page.tsx`) fetch data from Supabase and pass it down as
  props. They never run in the browser.
- **Client Components** (`*-client.tsx`) handle interactivity and call **Server
  Actions** (in co-located `actions.ts`) via `useTransition`.

Two hard rules: never fetch data in a Client Component, and never call a Server
Action from a Server Component. Mutations always go through a Server Action that
(1) authorizes, (2) writes, (3) `revalidatePath`s.

## Routing map

| Path | Purpose |
|------|---------|
| `app/(dashboard)/` | The app: game-day, players, settings, profile, my-schedule |
| `app/login/` | Login page; `login/google`, `login/facebook` are OAuth route handlers |
| `app/auth/callback/` | Supabase OAuth callback — exchanges the code, auto-links coaches |
| `app/pep/` | System admin panel (account + admin management, impersonation) |
| `middleware.ts` | Auth protection and routing. **Read before touching.** |

## Data layer (Supabase, no ORM)

Direct Supabase client queries. Three clients, picked by what you need:

| File | Key | RLS | Use for |
|------|-----|-----|---------|
| `lib/supabase.ts` | service role | bypassed | server actions, Pep, any privileged write |
| `lib/supabase-server.ts` | anon | enforced | auth session reads (`getUser`) |
| `lib/supabase-browser.ts` | anon | enforced | client components (not yet used) |

Most app code uses the **service-role** client and filters by `account_id`
manually. See [auth-and-roles.md](auth-and-roles.md) for why, and
[../decisions/0001-service-role-over-rls.md](../decisions/0001-service-role-over-rls.md)
for the trade-off.

## Multi-tenancy

The tenant is an **account**. Every data table carries
`account_id uuid NOT NULL REFERENCES accounts(id)`, and `account_members` links
`auth.users` to an account with a role. The active account for a request comes
from `getActiveAccountId()` (`lib/account.ts`), which defers to `getUserAccount()`
— the single source of truth that also resolves Pep impersonation.

> ⚠️ Because filtering is manual, a query that forgets `.eq('account_id', …)`
> leaks across academies. The `getActiveAccountId() === null` fallback (querying
> without a filter) is a known sharp edge — see [gotchas.md](gotchas.md).

## Where to look next

- Auth, roles, system admins, impersonation → [auth-and-roles.md](auth-and-roles.md)
- Conventions, schema table, "what not to do" → `CLAUDE.md`
- Why things are the way they are → [../decisions/](.)
