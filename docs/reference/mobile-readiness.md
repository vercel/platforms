# Mobile-app readiness

**Standing constraint, not a current project.** The owner wants to publish a
mobile app to the App Store and Play Store **later**, at the **lowest possible
build and maintenance cost**. We are not building it now. The job today is simply
to **not make it harder** — and to flag any decision that would.

Background and rationale:
[../decisions/0005-mobile-app-readiness.md](../decisions/0005-mobile-app-readiness.md).

## The intended path (so you know what we're protecting)

The web app stays the single source of truth on Vercel (SSR + Server Actions
unchanged). The future mobile app is a **thin shell** around it:

- **PWA** — installable from the browser. Free, instant, not a true store listing.
- **Capacitor shell** — a small native app that loads the live Vercel URL in a
  webview, giving real store listings with almost no extra code.

These share ~90% of their prep, so the PWA-vs-Capacitor choice is **deferred**.
Everything below keeps both doors open. A full native rewrite (React Native /
Expo) is explicitly **rejected** as highest-maintenance.

## Do this in normal feature work

- **Mobile-first, always.** Every page must work and feel good at **375px wide**:
  tap targets ≥ **44px**, no horizontal-scrolling tables, readable type. This is
  the one thing that can't be added later — do it as you build, not after.
- **No hover-only or right-click-only interactions.** Anything reachable by hover
  or right-click must also be reachable by tap. Tooltips can't be the only way to
  see important info.
- **Keep email/password login first-class** alongside OAuth (OAuth redirects
  behave differently inside a native webview, and Apple has rules about
  third-party login buttons).
- **Keep the auth redirect flow flexible** — don't bake in `https://`-only
  redirect assumptions; a custom deep-link scheme will be added for the wrapper.

## Do NOT do now (premature lift — adds maintenance for no benefit)

- **No native push notifications / native plugins.** Add when the app is actually
  taken on. (iOS PWAs support web push since 16.4 if ever needed.)
- **No `output: export` / static-export migration.** SSR + Server Actions stay;
  the Capacitor shell loads the hosted URL.
- **No PWA service worker / manifest build-out yet** unless the owner asks. It's a
  quick win when wanted, but it's not free to maintain. (When we do add it: web
  app manifest, icons, `viewport` export, splash screen.)

## Decisions that need a heads-up (prompt the owner before proceeding)

If a task would do any of the following, **pause and surface the tradeoff in one
sentence — don't silently choose the path that closes a door.** Default to
preserving mobile readiness; the owner decides.

- A feature that **only works on desktop** or relies on hover, right-click,
  keyboard shortcuts, large fixed-width layouts, or file-system access.
- Changing the **auth / OAuth redirect flow** in a way that assumes a browser
  (hardcoded web-only redirect URLs, popup-based OAuth, removing email/password).
- Switching the app's **rendering or hosting model** (e.g. static export, moving
  off Vercel, edge-only constraints) in a way that affects how a shell would load
  it.
- Adding a dependency or browser API that **won't run in an iOS/Android webview**
  (e.g. APIs unsupported in WKWebView).
- Anything that would make the live URL **unsuitable to load directly** in a
  webview (e.g. hard requirement on a browser extension, desktop-only payment
  flow).

When in doubt, ask. One sentence naming the tradeoff is enough.
