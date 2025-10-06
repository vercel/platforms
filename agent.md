# 🧠 Agent Context — Using `pnpm` + `shadcn/ui`

Below is the project-aligned guidance for our **UI-focused Codex agent**. It reflects the current repository layout, available scripts, and shadcn/ui setup so the agent can make safe, repeatable changes.

---

## 🧩 Tooling Setup (pnpm)

`pnpm` controls all dependency management and scripts.

### Rules

* Sync dependencies with the lockfile using:

  ```bash
  pnpm install
  ```
* Add runtime packages with:

  ```bash
  pnpm add <package>
  ```
* Add dev-only packages with:

  ```bash
  pnpm add -D <package>
  ```
* Never use `npm` or `yarn`; keep `pnpm-lock.yaml` versioned and untouched by hand.
* Available project scripts:

  ```bash
  pnpm run dev    # Next.js dev server (Turbopack)
  pnpm run build  # production build & type checking
  pnpm run start  # serve the built app
  ```

---

## Tech Stack
Next.js 15 with the App Router
React 19
Upstash Redis for data storage
Tailwind CSS v4 (utility-first styling)
shadcn/ui for the component system

---

## 🎨 UI Framework — shadcn/ui

### Description

[`shadcn/ui`](https://ui.shadcn.com) provides accessible Radix-based components themed with Tailwind CSS. All reusable UI primitives should source from the generated shadcn library.

### Setup Commands

Run inside the project root:

```bash
# 1. Initialize/configure shadcn (already done, rerun only if schema changes)
pnpm dlx shadcn-ui@latest init

# 2. Generate components that match this repo's current library
pnpm dlx shadcn-ui@latest add button card dialog input label popover
```

Add more components later as needed, e.g.:

```bash
pnpm dlx shadcn-ui@latest add dropdown-menu tooltip tabs toast
```

⚠️ Use component IDs that exist in the shadcn catalog; the CLI fails fast on unknown names.

---

## ⚙️ Directory Structure

`shadcn/ui` exports live under `components/ui/` and are aliased via `@/components/ui/*`.

```
.
├── app/                     # Next.js routes, layouts, server components
├── components/
│   ├── ui/                  # shadcn-generated primitives (Button, Dialog, ...)
│   └── features/            # compose primitives into product UI (create as needed)
├── lib/                     # shared utilities
├── components.json          # shadcn configuration
├── package.json
├── pnpm-lock.yaml
└── app/globals.css          # global Tailwind + design tokens
```

Keep feature-level components in `components/features/<domain>/` so primitives remain clean.

---

## 🧑‍💻 Codex Agent Rules for shadcn/ui

1. **Always render UI primitives with shadcn components** (`Button`, `Card`, `Dialog`, `Input`, `Popover`, etc.). If a pattern is missing, add it through the shadcn CLI before writing custom markup. Only hand-roll Tailwind when shadcn has no equivalent and document the exception in your PR summary.
2. **Add custom components under `components/features/`** when domain-specific logic or composition is required.
3. **Import via the alias** to avoid brittle relative paths:

   ```tsx
   import { Dialog, DialogTrigger } from "@/components/ui/dialog"
   ```
4. Preserve Radix accessibility guarantees (keyboard navigation, focus traps, aria attributes).
5. Type all props with TypeScript interfaces or `type` aliases.

---

## 🎨 Theming Guidelines

* `app/globals.css` holds the design tokens and Tailwind layer customizations. Update tokens there when adjusting themes.
* Tailwind 4 uses the new config-in-CSS pattern; extend tokens with regular CSS variables or Tailwind's `@layer` utilities.
* Maintain light/dark parity for each semantic token.

Current token block (`app/globals.css`):

```css
:root {
  --background: oklch(0.9824 0.0013 286.3757);
  --foreground: oklch(0.3211 0 0);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.3211 0 0);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.3211 0 0);
  --primary: oklch(0.6487 0.1538 150.3071);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.6746 0.1414 261.3380);
  --secondary-foreground: oklch(1.0000 0 0);
  --muted: oklch(0.8828 0.0285 98.1033);
  --muted-foreground: oklch(0.5382 0 0);
  --accent: oklch(0.8269 0.1080 211.9627);
  --accent-foreground: oklch(0.3211 0 0);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.8699 0 0);
  --input: oklch(0.8699 0 0);
  --ring: oklch(0.6487 0.1538 150.3071);
  --chart-1: oklch(0.6487 0.1538 150.3071);
  --chart-2: oklch(0.6746 0.1414 261.3380);
  --chart-3: oklch(0.8269 0.1080 211.9627);
  --chart-4: oklch(0.5880 0.0993 245.7394);
  --chart-5: oklch(0.5905 0.1608 148.2409);
  --sidebar: oklch(0.9824 0.0013 286.3757);
  --sidebar-foreground: oklch(0.3211 0 0);
  --sidebar-primary: oklch(0.6487 0.1538 150.3071);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.8269 0.1080 211.9627);
  --sidebar-accent-foreground: oklch(0.3211 0 0);
  --sidebar-border: oklch(0.8699 0 0);
  --sidebar-ring: oklch(0.6487 0.1538 150.3071);
  --font-sans: Plus Jakarta Sans, sans-serif;
  --font-serif: Source Serif 4, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
  --tracking-normal: 0em;
  --spacing: 0.25rem;
}

.dark {
  --background: oklch(0.2303 0.0125 264.2926);
  --foreground: oklch(0.9219 0 0);
  --card: oklch(0.3210 0.0078 223.6661);
  --card-foreground: oklch(0.9219 0 0);
  --popover: oklch(0.3210 0.0078 223.6661);
  --popover-foreground: oklch(0.9219 0 0);
  --primary: oklch(0.6487 0.1538 150.3071);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.5880 0.0993 245.7394);
  --secondary-foreground: oklch(0.9219 0 0);
  --muted: oklch(0.3867 0 0);
  --muted-foreground: oklch(0.7155 0 0);
  --accent: oklch(0.6746 0.1414 261.3380);
  --accent-foreground: oklch(0.9219 0 0);
  --destructive: oklch(0.6368 0.2078 25.3313);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.3867 0 0);
  --input: oklch(0.3867 0 0);
  --ring: oklch(0.6487 0.1538 150.3071);
  --chart-1: oklch(0.6487 0.1538 150.3071);
  --chart-2: oklch(0.5880 0.0993 245.7394);
  --chart-3: oklch(0.6746 0.1414 261.3380);
  --chart-4: oklch(0.8269 0.1080 211.9627);
  --chart-5: oklch(0.5905 0.1608 148.2409);
  --sidebar: oklch(0.2303 0.0125 264.2926);
  --sidebar-foreground: oklch(0.9219 0 0);
  --sidebar-primary: oklch(0.6487 0.1538 150.3071);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.6746 0.1414 261.3380);
  --sidebar-accent-foreground: oklch(0.9219 0 0);
  --sidebar-border: oklch(0.3867 0 0);
  --sidebar-ring: oklch(0.6487 0.1538 150.3071);
  --font-sans: Plus Jakarta Sans, sans-serif;
  --font-serif: Source Serif 4, serif;
  --font-mono: JetBrains Mono, monospace;
  --radius: 0.5rem;
  --shadow-x: 0;
  --shadow-y: 1px;
  --shadow-blur: 3px;
  --shadow-spread: 0px;
  --shadow-opacity: 0.1;
  --shadow-color: oklch(0 0 0);
  --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.05);
  --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10);
  --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10);
  --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10);
  --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10);
  --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.25);
}
```

Reuse these variables in Tailwind via `hsl(var(--token))` where appropriate.

---

## 🧪 Validation & Testing

Before requesting a commit:

```bash
pnpm run build
```

That command performs Next.js type and build checks. If you add linting or tests in the future, document the exact scripts here so the agent can run them.

---

## 💬 Example Workflow for Codex UI Agent

```bash
# 1. Generate any missing shadcn primitives
pnpm dlx shadcn-ui@latest add dialog

# 2. Create a feature component alongside the primitives
mkdir -p components/features/audit
cat <<'TSX' > components/features/audit/AuditDialog.tsx
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function AuditDialog() {
  return (
    <Dialog>
      <DialogTrigger>Open audit log</DialogTrigger>
      <DialogContent>
        {/* TODO: wire audit details */}
      </DialogContent>
    </Dialog>
  )
}
TSX

# 3. Import the feature component from a route or page
# (e.g. app/admin/page.tsx)

# 4. Verify the build
pnpm run build

# 5. Commit using conventional scope prefixes
```

---

## ✅ Commit Message Format

```
feat(ui): add audit dialog using shadcn primitives
fix(theme): correct sidebar color tokens
refactor(features): move workflow badge to shared component
```

---

Need another Codex-ready update? Let me know and I can sync the guide again.
