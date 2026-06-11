# Auth and roles

The source of truth for authentication, authorization, system admins, and Pep
impersonation. `CLAUDE.md` carries a short summary and links here.

## Authentication

Supabase Auth. Login (`app/login/page.tsx`) supports Google, Facebook, and
email/password.

- **OAuth flow:** Google/Facebook buttons hit a route handler
  (`app/login/google|facebook`) → Supabase returns a provider redirect → the user
  authenticates → returns to `app/auth/callback/route.ts`, which exchanges the
  code for a session.
- **Auto-link:** on callback, if `user.email` matches a `coaches.email` row and the
  user has no membership yet, an `account_members` row is created with role
  `coach`. The `next` param is validated to be a relative path before redirecting
  (open-redirect guard).
- **Logout:** `signOut()` in `app/login/actions.ts`.

## Roles (inside an academy)

Defined in `lib/roles.ts`, highest to lowest: `owner` > `admin` > `coach` >
`viewer`. Permission helpers (`can.manageSettings`, `can.createGameDay`,
`can.manageRosters`, …) gate UI in client components.

## The auth helpers (`lib/auth.ts`)

All are cached per request.

| Helper | Returns / does |
|--------|----------------|
| `getUserAccount()` | `{ userId, accountId, role, activeRole, coachId, email, displayName, canEditGames }` or null. **Resolves Pep impersonation** (see below). |
| `requireAuth()` | redirects to `/login` if no session/membership |
| `requireRole(min)` | redirects if no session; throws if role is below `min` |
| `requireEditGame()` | allows admin+ or a coach with `can_edit_games` |
| `getSystemAdmin()` | the `system_admins` row matching the logged-in email, or null |
| `requireSystemAdmin()` | redirects to `/game-day` if not a system admin (gates `/pep`) |

**In every protected server action, call the appropriate guard first** —
`requireRole('admin')`, `requireEditGame()`, or `requireSystemAdmin()` — before
touching the database.

`activeRole` vs `role`: `role` is the real DB role; `activeRole` reflects the
sidebar "view as" toggle (an admin can preview the coach view). Data scoping for
coach view keys off `activeRole` + `coachId`.

## System admins (Pep)

Platform-level admins, stored in the global `system_admins` table (`email`
unique, `name`). Access is **identity-based**: there is no shared password. A
system admin logs in normally; `getSystemAdmin()` matches their email
(lowercased) against the table. The old `PEP_SECRET` was retired — see
[../decisions/0003-identity-based-pep.md](../decisions/0003-identity-based-pep.md).

- `/pep` requires a logged-in session (middleware) and is authorized by
  `requireSystemAdmin()` on the page.
- Admins reach it via the **Pep** entry in the sidebar context selector.
- Management actions live in `app/pep/actions.ts` (`addSystemAdmin`,
  `updateSystemAdminName`, `removeSystemAdmin` with last-admin lockout).

## Pep impersonation ("Log in as")

A system admin can operate inside any academy. `switchAccount` sets the
`pep_account_id` cookie (gated on `requireSystemAdmin`).

**Reads and writes both target the impersonated account**, because
`getUserAccount()` resolves impersonation directly: when a verified system admin
has `pep_account_id` set, it returns that account with `owner`-level access. So
`requireRole`-guarded mutations succeed against the impersonated academy, not the
admin's own. `getActiveAccountId()` simply defers to `getUserAccount()`.

A non-admin who forges the cookie is ignored (the `getSystemAdmin()` gate fails),
so they fall back to their own membership — no cross-tenant access. See
[../decisions/0004-writes-during-impersonation.md](../decisions/0004-writes-during-impersonation.md).

The dashboard layout shows an amber "Viewing as [Academy]" banner with an Exit
button while impersonating.

## Owner-facing version

For the non-technical how-to, see
[../guides/managing-system-admins.md](../guides/managing-system-admins.md).
