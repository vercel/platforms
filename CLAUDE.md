# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start dev server with Turbopack
pnpm build    # Production build
pnpm start    # Start production server
```

No lint or test scripts are configured. Add shadcn/ui components via `pnpm dlx shadcn@latest add <component>`.

## Architecture

This is a **subdomain-based multi-tenant** Next.js 15 App Router application. Each tenant gets a subdomain (`tenant.yourdomain.com`); the main domain hosts the landing page and admin panel.

### Subdomain Routing (middleware.ts)

All routing logic lives in `middleware.ts`. It handles three environments:
- **Local:** `tenant.localhost:3000`
- **Production:** `tenant.rootDomain` (rootDomain comes from `lib/utils.ts`)
- **Vercel Preview:** `tenant---branch-name.vercel.app` (triple-dash convention)

When a subdomain is detected, `/` rewrites to `/s/[subdomain]` and `/admin` is blocked with a redirect to `/`.

### Data Layer (Supabase)

No ORM — all storage is Supabase Postgres via `lib/supabase.ts`. Table: `subdomains(name text PK, emoji text, created_at timestamptz)`. All DB access is server-side only (Server Actions + RSC), using the anon key with no RLS configured.

Required environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
```

Supabase project ref: `fomanzxevxoghyzwbqim`

### App Router Layout

- `app/page.tsx` — Landing page with subdomain creation form
- `app/actions.ts` — Server Actions for create/delete subdomain (all form mutations go here)
- `app/admin/` — Admin dashboard (currently unauthenticated — auth is a TODO)
- `app/s/[subdomain]/` — Tenant-specific page, rendered for subdomain hits after middleware rewrite
- `lib/subdomains.ts` — All Redis read/write operations
- `components/ui/` — shadcn/ui primitives (New York style, zinc base)

### Authentication

The admin panel (`/app/admin/`) has no authentication implemented. There are TODO comments noting this — any auth provider (Clerk, Auth0, NextAuth, Supabase) needs to be wired in before production use.
