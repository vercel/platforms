# 0001 — Service-role client with manual account filtering (instead of RLS)

**Status:** Accepted · **Date:** 2026-05

## Context

Supabase supports Row Level Security (RLS) — policies in the database that enforce
account isolation automatically. The alternative is to use the service-role key
(which bypasses RLS) and filter every query by `account_id` in application code.

This project is maintained by a non-technical owner, where "easy to understand and
troubleshoot" outranks "theoretically safest."

## Decision

Use the **service-role client** (`lib/supabase.ts`) for app data, and filter by
`account_id` manually in each query / server action. RLS is enabled on tables but
effectively bypassed.

## Consequences

- ✅ Simpler mental model — queries are plain, no policy debugging at 10pm.
- ✅ One obvious place to reason about access (the server action), not split
  between code and DB policies.
- ⚠️ **Every query must remember `.eq('account_id', …)`.** A missed filter leaks
  data across academies. This is the project's main standing risk.
- ⚠️ The `getActiveAccountId() === null` fallback runs some queries unfiltered —
  see [../reference/gotchas.md](../reference/gotchas.md).
- 🔭 Revisit before scaling to untrusted/self-serve tenants. Switching to per-user
  session clients + RLS is tracked in `TODO.md` ("Switch to RLS").
