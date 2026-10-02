# Wireframe Composition Guide

## Mental Model

A wireframe illustration is a **composed snapshot** of a UI layout. Your job is to select the right UDS components, arrange them as the user described, and fill them with plausible placeholder content — so anyone looking at the output immediately understands the intended layout and hierarchy.

This is not a pixel-perfect reproduction. Make reasonable spatial decisions where the user hasn't specified details.

---

## Setup — Always Required

```tsx
// Wireframe illustration — not production code
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';

export default function MyWireframe() {
  return (
    // ThemeProvider takes ONLY children. Brand/platform/colorScheme are applied
    // as data-* attributes on a wrapping element (NOT props on ThemeProvider).
    <div data-brand="ionos" data-platform="comfortable" data-color-scheme="light">
      <ThemeProvider>
        {/* There is NO `Surface` component in UDS. For a themed background use a
            div with a bg-surface-* utility class (or style={{ backgroundColor: 'var(--surface-…)' }}). */}
        <div className="bg-surface-base text-semantic-base">
          {/* composition goes here */}
        </div>
      </ThemeProvider>
    </div>
  );
}
```

- **There is no `Surface` component** — `@ionos-web-design-system/react` does not export it. Use a `div` with a `bg-surface-*` class (`bg-surface-base`, `bg-surface-subtle`, `bg-surface-subtlest`) or `style={{ backgroundColor: 'var(--surface-subtlest)' }}`.
- `ThemeProvider` takes **no props** — only `children`. It reads the theme from the `data-*` attributes on an ancestor element.
- `data-brand="ionos"` — active brand (only ionos is fully style-guided currently)
- `data-color-scheme="light"` — default for standard mode; use `"dark"` for decorative mode (set on the wrapper, not via ThemeInverter)
- `data-platform="comfortable"` — default spacing; use `"compact"` for dense UIs

---

## Layout Patterns and Component Selection

Interface elements come from the UDS kit (`./kit`, see the prompt section "# UDS kit"). The
patterns below hand-build only the layout `div`s (position, grid, gaps, padding) and place kit
components in them. Never import a raw `@ionos-web-design-system/react/*` component other than
`ThemeProvider`.

### Navigation / Header

```tsx
import { svgData as ionosLogo } from '@ionos-web-design-system/icon/brandmark/ionos-light';
import { KitButton, KitText } from './kit';

<div style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '16px 32px', background: 'var(--surface-base)' }}>
  <img src={ionosLogo} alt="IONOS" style={{ height: 24, width: 'auto', display: 'block' }} />
  <div style={{ display: 'flex', gap: 24, flex: 1 }}>
    {['Products', 'Solutions', 'Pricing'].map((item) => (
      <KitText key={item} variant="bodySm" weight="bold">{item}</KitText>
    ))}
  </div>
  <KitButton label="Sign in" variant="secondary" size="small" />
</div>
```

### Hero / Banner Section

```tsx
import { KitButton, KitText } from './kit';

// A dark section is a nested root carrying BOTH data-brand and data-color-scheme
// (the core tokens match them on the same element).
<div data-brand={brand} data-color-scheme="dark"
     style={{ background: 'var(--surface-base)', padding: '96px 64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
  <KitText variant="heading3xl" weight="bold" align="center">Your hosting, simplified</KitText>
  <KitText variant="bodyXl" tone="subtle" align="center">Everything you need to get online — domains, hosting, email.</KitText>
  <div style={{ marginTop: 16 }}>
    <KitButton label="Get started" size="large" />
  </div>
</div>
```

### Card Grid

```tsx
import { KitCard, KitText } from './kit';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, padding: '48px 32px' }}>
  {[
    { title: 'Web Hosting', desc: 'Fast, reliable, scalable.' },
    { title: 'VPS', desc: 'Full root access, any size.' },
    { title: 'Domains', desc: '500+ extensions available.' },
  ].map((item) => (
    <KitCard key={item.title}>
      <KitText variant="headingLg" weight="bold">{item.title}</KitText>
      <KitText tone="subtle">{item.desc}</KitText>
    </KitCard>
  ))}
</div>
```

### Form / Input Section

```tsx
import { KitButton, KitInput } from './kit';

<div style={{ maxWidth: 448, margin: '0 auto', padding: '64px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
  <KitInput label="Email address" value="" placeholder="you@example.com" />
  <KitInput label="Password" value="••••••••" />
  <KitButton label="Sign in" />
</div>
```

### Dashboard / Data Layout

```tsx
import { KitCard, KitText } from './kit';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, padding: 32 }}>
  {/* Stat cards */}
  {[
    { label: 'Active servers', value: '12' },
    { label: 'Monthly traffic', value: '2.4 TB' },
    { label: 'Uptime', value: '99.98%' },
    { label: 'Support tickets', value: '3' },
  ].map((stat) => (
    <KitCard key={stat.label}>
      <KitText variant="bodySm" tone="subtle">{stat.label}</KitText>
      <KitText variant="heading2xl" weight="bold">{stat.value}</KitText>
    </KitCard>
  ))}
</div>
```

Other kit elements fill the same roles: tab strips are `KitTabs`, toggles `KitSwitch`, checkboxes
`KitCheckbox`, initials circles `KitAvatar`, progress bars/rings `KitProgress`, loading rows
`KitSkeleton`, icon actions `KitIconButton`.

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

**Brandmark icons**: do not use the `<Icon>` component — it applies fixed icon sizing that
distorts logo proportions. Import the logo's `svgData` and use it as an `<img src>`:
```tsx
import { svgData as ionosLogo } from '@ionos-web-design-system/icon/brandmark/ionos-light';

<div style={{ width: 80, height: 24 }}>
  <img src={ionosLogo} alt="IONOS" style={{ height: '100%', width: 'auto', display: 'block' }} />
</div>
```
`svgData` is a `data:image/svg+xml;base64,…` string, so it needs no loader and no file.
The package ships **no `.svg` files** — never reference one, and never point an `<img>` at a
`/node_modules/…` path. Available names and the light/dark form: see the `# Icon name index`.

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

<KitPill label="Running" variant={STATUS_VARIANT.Running} />
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

---

## Tailwind CSS in Wireframes

`@ionos-web-design-system/core` exposes **semantic** tokens as CSS variables — use those names
in Tailwind arbitrary values (never a Figma `/`-path):

```tsx
// ✅ semantic core tokens (valid) — or a literal hex for a specific brand colour
<div className="bg-[var(--surface-base-invert)] text-[var(--text-base-invert)] p-8">
  Inverted surface
</div>
<div className="bg-[#003D8F] text-[#fff] p-8">
  IONOS Blue background
</div>

// Spacing tokens
<div className="p-[var(--space/space-8)]">
  Token-driven padding
</div>
```

For standard layout utilities (flex, grid, gap, padding), use plain Tailwind classes.
