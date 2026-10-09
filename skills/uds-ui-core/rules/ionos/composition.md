# UDS Composition Guide

## Mental Model

A wireframe illustration is a **composed snapshot** of a UI layout. Your job is to select the right UDS components, arrange them as the user described, and fill them with plausible placeholder content — so anyone looking at the output immediately understands the intended layout and hierarchy.

This is not a pixel-perfect reproduction. Make reasonable spatial decisions where the user hasn't specified details.

---

## Setup — Always Required

The root is the `data-brand` / `data-platform` / `data-color-scheme` wrapper around `<ThemeProvider>`
from the skill's Output Format.

- **There is no `Surface` component** — `@ionos-web-design-system/react` does not export it. Use a `div` with `style={{ backgroundColor: 'var(--surface-…)' }}` (or a `bg-surface-*` class).
- `ThemeProvider` takes **no props** — only `children`. It reads the theme from the `data-*` attributes on an ancestor element.
- `data-color-scheme="light"` is the default; `"dark"` for decorative mode (on the wrapper, not via ThemeInverter). `data-platform="comfortable"` is the default.

---

## Icon Usage

**Icons inside kit components and UI chrome** go through the kit: `KitIcon`, `KitIconButton`, or
the `icon` prop of `KitButton`. They take the icon module's **default** import (the kit injects
the icon CSS once, frame-safe):

```tsx
import checkmark from '@ionos-web-design-system/icon/system/checkmark';
import { KitIcon } from './kit';

<KitIcon icon={checkmark} size="small" />
```

**Do NOT use the raw `<Icon>` component, `useDynamicIcon`, or an icon class name** outside the
kit — see `remotion-best-practices/rules/shared-uds-icons.md`. A glyph you draw as **decoration**
(an illustration motif, a large circular badge glyph, a full-colour product icon) uses the
`svgData` inline approach — full recipe there; the essentials:

```tsx
import { svgData as cloudMigrationSvg } from '@ionos-web-design-system/icon/ionos/cloud-migration-light';

// IONOS product icons — full-colour, no colour override
<div style={{
  display: 'inline-block', width: 32, height: 32,
  backgroundImage: `url(${cloudMigrationSvg})`,
  backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center',
}} />
```

Icon names are chosen at codegen time from the `# Icon name index` prompt section — there is
no runtime icon-name lookup in this one-shot pipeline, so `useDynamicIcon`'s premise (a name
known only at render time) never applies here.

**Brandmark icons**: never the `<Icon>` component (it distorts logo proportions) — the logo's
`svgData` as an `<img src>`, per `ionos/product-frame-color.md` "IONOS Brandmark Import". The package
ships **no `.svg` files**; never point an `<img>` at a `/node_modules/…` path.

---

## Placeholder Content Guidelines

Good wireframe content is plausible — it helps the viewer understand the layout's purpose without being distracting.

| Region | Use this |
|--------|----------|
| Section labels / titles | Short functional labels or section titles — NOT a marketing headline/tagline (see `shared/no-marketing-heading.md`) |
| Body copy | 1–2 short functional sentences describing the UI region — generic placeholder, not marketing copy |
| Buttons | Real CTAs ("Get started", "Learn more", "Sign in") |
| Lists | 3–5 realistic items matching the domain |
| Prices | Realistic ranges ("€3.99/mo", "$12/month") |
| Names | Generic but plausible ("John D.", "user@example.com") |
| Dates | Use recent-looking dates ("May 2026") |

Avoid: "Lorem ipsum", "Item 1 / Item 2", "Click here", "Test text".

---

## Semantic Status Colors

Status badges (Running, Maintenance, Offline/Error, Warning) in dashboards and server lists are
`KitPill` status chips. The kit maps each variant to the scheme-aware semantic tokens — never
hand-roll a status badge, its colours or its radius.

```tsx
import { KitPill } from './kit';

const STATUS_VARIANT = {
  Running: 'success',
  Maintenance: 'caution',
  Offline: 'danger',
  Warning: 'caution',
} as const;

<KitPill label={texts.statusRunning ?? ''} variant={STATUS_VARIANT.Running} />
```

---

## Colors — semantic core tokens, or hex. NEVER Figma token paths.

`@ionos-web-design-system/core` exposes **semantic** CSS custom properties — `--surface-*`,
`--text-*`, `--border-*`, `--surface-semantic-*` — and the wireframe renders under
`<ThemeProvider>` + `data-brand`, so they resolve live. Those are valid CSS variables.

The brand colour scale (IONOS Blue, Sky, …) and white/black are written in `uds-style-guide`
as **Figma hierarchy paths** (`brand/ionos-blue-600`, `neutral/white`). **These are NOT CSS
variables.** `var(--brand/ionos-blue-600)`, `var(--neutral/white)`, `var(--base/font/body)` all
fail: the `/` is a CSS parse error, so the declaration is dropped and the element renders
transparent/unstyled — which silently breaks contrast (white-on-transparent = invisible icons).
The hex fallback does not save you (a malformed-name `var()` fails before the fallback).

| Need | Use this |
|------|----------|
| White (text/icon on dark) | `var(--text-base-invert)` or hex `#fff` |
| Default dark screen text | `var(--text-base)` |
| Default card / surface | `var(--surface-base)` |
| Dark / inverted surface | `var(--surface-base-invert)` (pair with `--text-base-invert`) |
| Subtle backdrop | `var(--surface-subtlest)` |
| A specific brand colour | the literal hex — see `ionos-color-palette.md` |

```tsx
// ✅ Correct — semantic token, or hex. Pair surface + its foreground for contrast.
// (UI copy itself is KitText; these are drawn shapes and their foreground.)
<div style={{ background: 'var(--surface-base-invert)', color: 'var(--text-base-invert)' }}>…</div>   // white-on-dark
<div style={{ background: '#003D8F', color: '#fff' }}>IONOS Blue panel</div>

// ❌ Wrong — Figma token paths are not CSS variables; the declaration is dropped → unstyled
<div style={{ color: 'var(--neutral/white)' }}>…</div>
<div style={{ background: 'var(--brand/ionos-blue-600)' }}>…</div>
```

Tailwind arbitrary values follow the same rule: `bg-[var(--surface-base-invert)]`, `p-[var(--space-8)]`, never a `/`-path.
