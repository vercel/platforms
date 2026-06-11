# Gotchas — fragile spots & known edge cases

Things that work but are known to be incomplete, fragile, or untested. **Review
before shipping.** When you add a behavior that's intentionally partial or has a
sharp edge, record it here.

## Auth / multi-tenancy

- **`getActiveAccountId()` returning `null`:** several pages fall back to querying
  *without* an `account_id` filter when account resolution fails, returning all
  rows across all accounts. This would silently expose cross-account data. The
  manual-filter approach (service role, no RLS) is the root cause — see
  [../decisions/0001-service-role-over-rls.md](../decisions/0001-service-role-over-rls.md).

## Storage

- **Logo upload bucket policies:** the `academy-assets` Supabase Storage bucket has
  broad authenticated-user write policies. Any authenticated user across any
  account can overwrite another account's logo by guessing the path
  (`logos/{accountId}.png`). Scope policies to `account_id` before production.
- **Logo upload validation:** no client-side file-type check beyond
  `accept="image/*"` — a non-image with a renamed extension passes through.

## Data / scale

- **Last rostered date:** fetches all `roster_entries` for all active players in one
  query. Fine for <500 players; will slow with large rosters. Consider a DB view
  or materialized column if it becomes a problem.
- **Roster builder save:** `saveRoster` replaces entries for the games being saved
  in one operation. If two coaches edit the same game day's roster
  simultaneously, the last save wins and silently overwrites the other's work.
- **Empty game formats:** if an account has no game formats, the Format column and
  field are hidden entirely (intentional). But if formats are deleted *after*
  games already reference them, those games show "—" with no way to recover the
  format name.
- **Game format deletion nulls a pool's default:** deleting a game format set as a
  pool's default nulls `pools.default_game_format_id` via `ON DELETE SET NULL`.
  The pool silently loses its default with no warning to the admin.

## UI

- **Brand colors:** stored as raw text with no validation. Invalid CSS (e.g.
  `rgb(bad)`) makes the preview swatch silently show nothing.
- **Sidebar logo:** fetched fresh on every dashboard navigation (server render).
  If the Storage URL changes or is briefly unavailable, the logo silently
  disappears with no fallback beyond initials.
- **Teams Edit/Archive buttons:** in Settings, the Edit and Archive buttons on
  teams are UI-only placeholders with no actions wired.
- **Publish roster buttons:** "Publish" / "Update" in the game-day tabs call no
  server action yet — clicking them does nothing.
