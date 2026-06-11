# 0002 — "Groups" renamed to "Pools"

**Status:** Accepted · **Date:** 2026-06

## Context

The original domain term for a collection of teams/players was **Group** (e.g.
age groups U8–U16). The owner's academies use the word **Pool**, and the mismatch
between the UI and how staff actually talk caused confusion.

## Decision

Rename **Groups → Pools** everywhere: UI copy, code identifiers, and database
objects (`groups` → `pools`, `group_coaches` → `pool_coaches`,
`game_day_groups` → `game_day_pools`, and related columns/FKs).

## Consequences

- ✅ The product speaks the owner's language end to end.
- ⚠️ A rename touching the DB, code, and UI at once is broad and error-prone; it
  was done as a single coordinated change.
- 🧹 **Known drift:** `CLAUDE.md`'s schema table still lists legacy names
  (`groups`, `game_day_groups`, `group_coaches`). Clean that up when the schema
  table is next touched. The live database uses the `pools` names.
