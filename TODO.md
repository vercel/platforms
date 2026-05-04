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
- [ ] **Publish roster** — "Publish" and "Update" buttons in GameDayTabs call server actions but the actions aren't wired yet
- [ ] **Forgot password** — add a "Forgot password?" link on the login page using Supabase's `resetPasswordForEmail`
- [ ] **Sign up flow** — new users who sign up with email/password have no account; decide: invite-only or self-serve signup
- [ ] **Switch to RLS** — replace service role client + manual `account_id` filtering with `createSupabaseServer()` so RLS enforces account isolation automatically; remove the service role key from data queries

## Testing (revisit when core flows are stable)

- [ ] **Playwright E2E tests** — deliberately deferred. Add when: (1) login, game day creation, and roster flows stop changing shape week to week, and (2) a CI pipeline exists to run tests automatically on every push. Starting too early means constant test maintenance with little payoff. When ready: set up GitHub Actions + Playwright, write 6–8 happy-path tests, add `pnpm test` script.

## Tech debt

- [ ] Remove `typescript: { ignoreBuildErrors: true }` from `next.config.ts` once types are clean
- [ ] Add `account_id` to settings actions (`addGroup`, `addLocation`, `addJerseyColor`) — currently missing, will fail if account_id is NOT NULL
