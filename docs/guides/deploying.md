# Deploying

The app is built to run on **Vercel** with **Supabase** as the database and auth
provider.

## Environment variables

Set these in Vercel (**Project → Settings → Environment Variables**) and in your
local `.env.local` for development:

```
NEXT_PUBLIC_SUPABASE_URL=https://fomanzxevxoghyzwbqim.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>       # browser-safe; used by SSR and browser
SUPABASE_ANON_KEY=<anon-key>                   # same value, legacy name
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>   # SERVER ONLY — never expose to the browser
```

Get the keys from the Supabase dashboard → **Project Settings → API**. The
service-role key is powerful (it bypasses all access rules) — keep it server-side
only.

## Deploy steps

1. Push your branch to GitHub and merge to `main`.
2. In Vercel, connect the `First-Touch-Foundry/Academy-Pool-Pro` repo (first time
   only).
3. Add the environment variables above.
4. Deploy. Vercel builds with `pnpm build` and serves automatically on push to
   `main` thereafter.
5. Update your OAuth redirect URLs to include the production domain — see
   [manual-setup.md](manual-setup.md).

## Go-live checklist

Do **not** ship to real users until these are handled. They're tracked in
`TODO.md`; the why for some is in [../reference/gotchas.md](../reference/gotchas.md).

- [ ] **Switch on Row Level Security (RLS)** or confirm every query filters by
  `account_id`. Today the app uses the service-role key and filters manually; a
  missed filter leaks data across academies. See
  [../decisions/0001-service-role-over-rls.md](../decisions/0001-service-role-over-rls.md).
- [ ] **`player_levels` and `game_formats` have RLS disabled** — anyone with the
  anon key can read/write all rows. Enable RLS and add policies first.
- [ ] **Storage bucket policies** — the `academy-assets` bucket lets any logged-in
  user overwrite any academy's logo by guessing the path. Scope policies to
  `account_id`.
- [ ] **OAuth redirect URLs** include the production domain (Google + Facebook).
- [ ] Confirm Pep impersonation still works end-to-end on production.
