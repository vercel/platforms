# TODO

## Manual setup required (you do these in browser)

- [ ] **Supabase: enable Google login** — Supabase dashboard → Authentication → Providers → Google → add Client ID + Secret from Google Cloud Console
- [ ] **Supabase: enable Facebook login** — Supabase dashboard → Authentication → Providers → Facebook → add App ID + Secret from Facebook Developers
- [ ] **Google Cloud Console** — add `http://localhost:3000/auth/callback` (dev) and your production URL to Authorized Redirect URIs
- [ ] **Facebook Developers** — add same redirect URIs to Valid OAuth Redirect URIs
- [ ] **Change PEP_SECRET** in `.env.local` from the placeholder to something secret before going to production

## Code features

- [ ] **Members management** — add a Members tab in Settings to list account members, assign roles (owner/admin/coach/viewer), and invite new users by email
- [ ] **Dashboard home** — real stats: active game days, player count, upcoming events; currently shows "Coming soon"
- [ ] **Profile page** — wire to `getUserAccount()` from `lib/auth.ts` to show real user name, email, role
- [ ] **Publish roster** — "Publish" and "Update" buttons in GameDayTabs have no server actions yet; UI only
- [ ] **Forgot password** — add a "Forgot password?" link on the login page using Supabase's `resetPasswordForEmail`
- [ ] **Sign up flow** — new users who sign up with email/password have no account; decide: invite-only or self-serve signup
- [ ] **Switch to RLS** — replace service role client + manual `account_id` filtering with per-user session client so RLS enforces account isolation at the DB level

## Tech debt

- [ ] Remove `typescript: { ignoreBuildErrors: true }` from `next.config.ts` once types are clean
- [ ] `player_levels` table has RLS disabled — anyone with the anon key can read/write all rows. Enable RLS and add a policy before going to production.
- [ ] Logo upload has no client-side file type validation beyond `accept="image/*"` — a non-image file with a renamed extension would pass through
- [ ] `getActiveAccountId()` returning `null` causes queries to run without an account filter, returning all rows. The fallback path (`playerQ` without `.eq('account_id', ...)`) exists in several pages and would silently expose cross-account data if account resolution fails.
- [ ] Groups section in Settings: Edit and Archive buttons on teams are UI-only placeholders with no actions wired
- [ ] Publish roster buttons call no server action — clicking them does nothing silently

## Known edge cases / fragile spots

_Added here when something works but is known to be incomplete or untested. Review before shipping._

- **Empty game formats:** If an account has no game formats defined, the Format column in game day tables is hidden entirely and the Format field is hidden in the Add/Edit Game dialog. This is intentional — but if formats are later deleted after games already have `game_format_id` set, those games will show "—" with no way to recover the format name.
- **Logo upload bucket policies:** The `academy-assets` Supabase Storage bucket has broad authenticated-user write policies. Any authenticated user across any account can overwrite any other account's logo by guessing the path (`logos/{accountId}.png`). Scope policies to `account_id` before production.
- **Last rostered date:** Fetches all `roster_entries` for all active players in one query. Fine for <500 players but will slow down with large rosters. Consider a DB view or materialized column if it becomes a problem.
- **Brand colors:** Stored as raw text (any value). If invalid CSS is entered (e.g. `rgb(bad)`) the preview swatch will silently show nothing — no validation or error message.
- **Group default format and game format deletion:** Deleting a game format that is set as a group's default will null out `groups.default_game_format_id` via `ON DELETE SET NULL`. The group will silently lose its default with no warning shown to the admin.
- **Sidebar logo:** Fetched fresh on every dashboard navigation (server render). If Supabase Storage URL changes or becomes temporarily unavailable, the logo silently disappears with no fallback beyond initials.
- **Roster builder save:** `saveRoster` replaces all entries for the game day in a single operation. If two coaches are in the roster builder simultaneously, the last save wins and silently overwrites the other's work.

## UI Overhaul (planned — not started)

High-level sequence. Do not start until naming/branding is locked.

- [ ] **Step 1: Naming & branding** — finalize product name, tagline, and brand identity (logo, voice, positioning)
- [ ] **Step 2: Design system** — define color palette, typography, spacing scale, component style (shadcn theme tokens, dark/light mode decision, brand colors applied)
- [ ] **Step 3: Redesign — page by page / component by component**
  - [ ] Navigation / sidebar
  - [ ] Dashboard home
  - [ ] Game Day list + detail
  - [ ] Roster Builder
  - [ ] Players
  - [ ] Academy Settings
  - [ ] Login / auth screens
  - [ ] My Schedule
  - [ ] Profile

_Note: Steps 1 and 2 must be complete before touching any component. Redesigning before the design system is locked means doing it twice._

## Testing strategy

Deliberately deferred until core flows stabilize. When ready:
- Add Playwright E2E for: login, create game day, add game, build roster, save roster
- Set up GitHub Actions to run on every push to `main`
- Smoke test checklist for every feature: (1) happy path, (2) empty state, (3) Pep impersonation still works
