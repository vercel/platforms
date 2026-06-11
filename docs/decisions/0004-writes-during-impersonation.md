# 0004 — Writes work during Pep impersonation

**Status:** Accepted · **Date:** 2026-06 · **PR:** #7

## Context

When a system admin used Pep **"Log in as"** to enter an academy, reads were
scoped to that academy (`getActiveAccountId()` honored the `pep_account_id`
cookie) but **writes silently failed**. Every mutation guarded by
`requireRole('admin')` calls `getUserAccount()`, which only looked at the admin's
*own* `account_members` row. A system admin with no membership got `null` →
`requireRole` redirected to `/login` → the mutation never ran (e.g. creating a
pool did nothing, with no error).

Discovered live while the owner was impersonating an academy to create a pool.

## Decision

Resolve impersonation in **`getUserAccount()`** itself: when a verified system
admin has the `pep_account_id` cookie set, return that account with `owner`-level
access. Reads and writes then both target the impersonated academy.
`getActiveAccountId()` is simplified to defer to `getUserAccount()` as the single
source of truth.

## Consequences

- ✅ "Log in as" grants full operate-as access (create/edit), matching the mental
  model of impersonation.
- ✅ One place resolves the active account for reads *and* writes — no more
  read/write divergence.
- ✅ Security preserved: a non-admin forging `pep_account_id` fails the
  `getSystemAdmin()` gate and falls back to their own membership.
- 📎 See [../reference/auth-and-roles.md](../reference/auth-and-roles.md).
