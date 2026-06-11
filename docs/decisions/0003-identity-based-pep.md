# 0003 — Identity-based Pep access (retire PEP_SECRET)

**Status:** Accepted · **Date:** 2026-06 · **PR:** #2

## Context

Pep (the system admin panel) was gated by a single shared password in the
`PEP_SECRET` env var. The panel set a `pep_auth` cookie and middleware compared it
to the secret. This has the usual shared-secret problems: no per-person identity,
no easy revocation, and it couldn't integrate with the in-app sidebar (which only
knows logged-in users). The owner also wanted to **manage who is an admin** and
have **Pep appear in the role selector**.

## Decision

Make Pep access **identity-based**. Add a global `system_admins` table (`email`,
`name`). A system admin logs in normally (Supabase); `getSystemAdmin()` matches
their email against the table. `requireSystemAdmin()` authorizes `/pep`. Retire
`PEP_SECRET`, the `pep_auth` cookie, and the `/pep/login` page.

## Consequences

- ✅ Per-person admin identity; add/remove/rename admins from the panel itself
  (with last-admin lockout protection).
- ✅ Pep shows up as a sidebar option for system admins; no separate login.
- ✅ Cleaner security model — no shared secret to leak or rotate.
- ⚠️ A system admin **must** have a Supabase login (Google/Facebook/email) to reach
  Pep. Admins added by email won't have access until they log in with that email.
- 📎 See [../reference/auth-and-roles.md](../reference/auth-and-roles.md) and
  [../guides/managing-system-admins.md](../guides/managing-system-admins.md).
