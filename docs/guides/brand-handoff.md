# Brand handoff — from Claude design to the product

You're building the visual identity in Claude design. This guide is the **handoff
checklist**: what to produce there so it drops cleanly into the product's design
system, and where each piece lands in the code.

Hand any of this back to Claude Code and it becomes the design tokens — you don't
need to touch code yourself.

## The big picture

The app's styling is already token-driven: colors, type, and radius are defined
once as CSS variables in `app/globals.css`, and all 61 UI components read from
them. So **re-skinning the whole app is mostly a matter of supplying new token
values** — the brand doc's job is to give us those values.

There are two "brands," and this handoff is about the **product brand** (Academy
Pool Pro's own identity). Individual academy colors are a separate, later concern
(used for PDFs and a future feature) — ignore them here.

## What to produce in Claude design

Aim for these, in rough priority order. Don't worry about formatting it as code —
a clear spec is enough; the values matter more than the file format.

### 1. Color palette (most important) — light **and** dark

For each role below, give a color for **light mode** and **dark mode**. `oklch`
values are ideal (that's what the repo uses), but hex is fine — we'll convert.

- `background` / `foreground` (page background + default text)
- `card` / `card-foreground`
- `popover` / `popover-foreground`
- `primary` / `primary-foreground` (main brand action color + text on it)
- `secondary` / `secondary-foreground`
- `muted` / `muted-foreground` (subtle backgrounds + secondary text)
- `accent` / `accent-foreground`
- `destructive` (errors / delete)
- `border`, `input`, `ring` (focus outline)
- `chart-1` … `chart-5` (data viz ramp)
- `sidebar`, `sidebar-foreground`, `sidebar-primary(+foreground)`,
  `sidebar-accent(+foreground)`, `sidebar-border`, `sidebar-ring`

> Shortcut: if you give us **one brand/primary hue + a neutral gray ramp** and the
> light/dark backgrounds, we can derive most of the rest sensibly and you only
> hand-pick the few that matter (primary, accent, destructive).

**Accessibility:** make sure text-on-color pairs (e.g. `primary` vs
`primary-foreground`) have enough contrast. We'll verify, but it's easier if the
brand picks readable pairs up front.

### 2. Typography

- **Font families**: a display/heading font, a body font, and (optional) a mono
  font. Name the exact fonts — ideally [Google Fonts](https://fonts.google.com)
  so we can load them with zero extra setup.
- **Type scale**: sizes, line-heights, and weights for headings (h1–h4), body,
  small/caption.
- Today: Inter (body) + Oswald (the wordmark only). Tell us what replaces each.

### 3. Shape & spacing

- **Corner radius**: one base value (e.g. "8px / 0.5rem"). The whole radius scale
  derives from it.
- **Elevation/shadows**: a small set (e.g. card, popover, modal) if the brand has
  a specific feel.
- **Border treatment**: weight and how prominent.

### 4. Component direction (optional but helpful)

Visual notes for the high-traffic components — **button**, **input/field**,
**card**, **badge**, **table** — including states (hover, focus, disabled). We
only override the component library where the brand diverges from the defaults,
so even a few sentences each helps.

### 5. Brand guide material (reference, not code)

Logo usage, voice/tone, do's and don'ts. This lands in docs as a brand reference,
not in the token system.

## How it maps into the code

| What you hand off | Where it goes |
|---|---|
| Color palette (light + dark) | `app/globals.css` — the `:root` and `.dark` blocks |
| Font families | `app/layout.tsx` (via `next/font`) → `--font-brand`, `--font-sans`, `--font-mono` |
| Type scale | applied across components + documented in the design-system doc |
| Corner radius | `--radius` in `app/globals.css` (drives the full radius scale) |
| Shadows / borders | token + component styles |
| Component direction | targeted overrides in `components/ui/*` |
| Logo / voice / do's & don'ts | a brand reference doc under `docs/` |

## Cleanest export formats (best → still fine)

1. **Ready-to-paste CSS variables** for `:root` and `.dark` (Claude design can
   often output these directly) — fastest, least translation.
2. **A filled token table** — semantic name → light value → dark value — plus the
   type scale and radius.
3. **A visual brand document** (with the hex/oklch values called out) that Claude
   Code translates by hand.

## What happens after handoff

1. **Phase 1 — tokens:** we drop your palette/type/radius into `app/globals.css`
   and `app/layout.tsx`. The app visibly rebrands with no component changes.
2. **Phase 2 — component library:** tune components where the brand diverges, and
   build the **component library + design assets gallery inside Pep** (a new
   left-hand nav → "Design system"), documented in
   [../reference/design-system.md](../reference/design-system.md).
3. **Phase 3 — redesign:** rework each screen against the gallery, one at a time.

See the full roadmap in the approved plan; this guide covers the handoff (Phase 0)
only.
