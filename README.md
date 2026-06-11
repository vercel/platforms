# Academy Pool Pro

A **soccer academy management platform**. Coaches manage players, pools, game
days, and rosters; admins run their academy's settings; system admins oversee
every account. Built with Next.js 15 (App Router) and Supabase.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [Supabase](https://supabase.com/) — Postgres database + Auth
- [Tailwind v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- Deployed on [Vercel](https://vercel.com/)

## Quickstart

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

Create a `.env.local` with the Supabase keys (see
[docs/guides/deploying.md](docs/guides/deploying.md) for the full list):

```
NEXT_PUBLIC_SUPABASE_URL=https://fomanzxevxoghyzwbqim.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Login also needs OAuth providers configured —
see [docs/guides/manual-setup.md](docs/guides/manual-setup.md).

## Documentation

- **[CLAUDE.md](CLAUDE.md)** — conventions and quick reference (the agent entry
  point).
- **[docs/](docs/)** — full documentation:
  - [Guides](docs/guides/) — owner how-tos (setup, deploying, managing admins)
  - [Reference](docs/reference/) — architecture, auth & roles, gotchas
  - [Decisions](docs/decisions/) — why key choices were made (ADRs)
- **[TODO.md](TODO.md)** — outstanding tasks and roadmap.

## Scripts

```bash
pnpm dev      # dev server (Turbopack)
pnpm build    # production build
pnpm start    # serve the production build
```
