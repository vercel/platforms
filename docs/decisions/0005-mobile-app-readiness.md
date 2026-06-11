# 0005 — Build mobile-app-ready now, ship later

**Status:** Accepted · **Date:** 2026-06 · **PR:** _(this one)_

## Context

The owner wants to publish a mobile app to the Apple App Store and Google Play
**at some point in the future**, with the **lowest possible build and maintenance
cost**. He is not taking this on now and does not want feature work to slow down
or grow more complex for the sake of it.

The app is a Next.js 15 web app on Vercel using SSR and Server Actions, with
Supabase Auth. A full native rewrite (React Native / Expo) would be the highest-
maintenance path and is rejected. The realistic low-lift paths are:

- **PWA** — installable from the browser; free and instant, but not a true store
  listing.
- **Capacitor shell** — a thin native app whose only job is to load the live
  Vercel URL in a webview. Real App Store / Play Store listings while the web app
  stays the single source of truth (deploy to Vercel as usual; the app points at
  it).

A well-built PWA is ~90% of the work for a Capacitor wrapper. The two paths share
nearly all preparation, so **the choice between them can be deferred** — but only
if we don't make decisions now that close those doors.

## Decision

**Treat mobile-app readiness as a standing constraint on all feature work, but do
not build the mobile app now.** Concretely:

1. Build every page **mobile-first** (works well at 375px wide; tap targets ≥44px;
   no hover-only or right-click-only interactions). This is the only part that
   genuinely can't be bolted on later.
2. Keep **email/password as a first-class login path** alongside OAuth, because
   OAuth redirects behave differently inside a native webview.
3. Don't hardcode `https://`-only redirect assumptions in the auth flow — a custom
   deep-link scheme will be added later for the wrapper.
4. Keep SSR + Server Actions. Do **not** migrate to `output: export` to "prepare"
   — the Capacitor shell loads the hosted URL, so nothing needs to change.
5. Do **not** build native push, native plugins, or PWA infrastructure now. They
   can be added in isolation when the mobile app is actually taken on.

The full, current checklist of what to do / avoid lives in
[../reference/mobile-readiness.md](../reference/mobile-readiness.md).

## Consequences

- ✅ The web app stays the single source of truth; a future store launch is a thin
  shell, not a rewrite.
- ✅ Mobile-first design improves the product for phone-using coaches today,
  regardless of whether a store app ever ships.
- ⚠️ **Agents must flag decisions that make this harder** before proceeding — see
  the guardrail in `CLAUDE.md` and the "Decisions that need a heads-up" list in
  the reference doc. The owner decides; the default is to preserve readiness.
- 📎 Apple guideline 4.2 ("minimum functionality") can reject a bare webview;
  splash screen, icons, and offline handling clear the bar. Known, not blocking.
