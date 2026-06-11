# Documentation

The front door for everything written about this project. Two audiences, kept in
separate tracks:

- **`guides/`** — for the **owner**. Plain-language, step-by-step how-tos for
  running and operating the app. No code knowledge assumed.
- **`reference/`** — for **developers and agents**. Precise technical detail
  about how the system works.
- **`decisions/`** — short records (ADRs) capturing **why** a significant choice
  was made, so nobody re-litigates it later.

`CLAUDE.md` (repo root) is the agent entry point and quick reference; it links
into this folder for depth.

## Map

### Guides (owner)
- [manual-setup.md](guides/manual-setup.md) — one-time setup in Supabase, Google,
  and Facebook (OAuth providers, redirect URLs).
- [managing-system-admins.md](guides/managing-system-admins.md) — add, remove, and
  rename system admins in the Pep panel; how "Log in as" works.
- [deploying.md](guides/deploying.md) — deploy to Vercel, the environment
  variables you need, and the go-live checklist.

### Reference (developers / agents)
- [architecture.md](reference/architecture.md) — how the app fits together:
  routing, the Server/Client split, the Supabase clients, multi-tenancy.
- [auth-and-roles.md](reference/auth-and-roles.md) — authentication, roles,
  permission helpers, system admins, and Pep impersonation (read + write).
- [gotchas.md](reference/gotchas.md) — known fragile spots and edge cases to
  review before shipping.

### Decisions (ADRs)
- [0001-service-role-over-rls.md](decisions/0001-service-role-over-rls.md)
- [0002-groups-renamed-to-pools.md](decisions/0002-groups-renamed-to-pools.md)
- [0003-identity-based-pep.md](decisions/0003-identity-based-pep.md)
- [0004-writes-during-impersonation.md](decisions/0004-writes-during-impersonation.md)

## The one rule that keeps this from rotting

**Docs change in the same pull request as the code they describe.** If you change
auth, update `reference/auth-and-roles.md` in the same PR. If you make a
non-obvious design choice, add an ADR. The stale original README is what happens
when docs and code drift apart — don't recreate that.

See the **Documentation** section of `CLAUDE.md` for the full list of update
triggers.
