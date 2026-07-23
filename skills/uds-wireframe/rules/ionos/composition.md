# Wireframe Composition Guide

## Mental Model

A wireframe illustration is a **composed snapshot** of a UI layout. Your job is to select the right UDS components, arrange them as the user described, and fill them with plausible placeholder content — so anyone looking at the output immediately understands the intended layout and hierarchy.

This is not a pixel-perfect reproduction. Make reasonable spatial decisions where the user hasn't specified details.

---

## Setup — Always Required

```tsx
// Wireframe illustration — not production code
import { ThemeProvider } from '@ionos-web-design-system/react';

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

### Navigation / Header

```tsx
import { NavigationBar } from '@ionos-web-design-system/react/navigation-bar';

<NavigationBar
  brand="ionos"
  items={[
    { label: 'Products', href: '#' },
    { label: 'Solutions', href: '#' },
    { label: 'Pricing', href: '#' },
  ]}
/>
```

### Hero / Banner Section

```tsx
import { Button } from '@ionos-web-design-system/react/button';
import { ThemeInverter } from '@ionos-web-design-system/react/theme-inverter';

<ThemeInverter>
  {/* No `Surface` component — themed background via a bg-surface-* div */}
  <div className="bg-surface-base px-16 py-24 text-center">
    <h1 className="font-heading text-6xl font-semibold mb-4">
      Your hosting, simplified
    </h1>
    <p className="text-xl mb-8 opacity-80">
      Everything you need to get online — domains, hosting, email.
    </p>
    <Button variant="primary" size="lg" onClick={() => {}}>
      Get started
    </Button>
  </div>
</ThemeInverter>
```

Use `ThemeInverter` for dark-background hero sections — it flips tokens automatically.

### Card Grid

```tsx
import { Card } from '@ionos-web-design-system/react/card';

<div className="grid grid-cols-3 gap-6 px-8 py-12">
  {[
    { title: 'Web Hosting', desc: 'Fast, reliable, scalable.' },
    { title: 'VPS', desc: 'Full root access, any size.' },
    { title: 'Domains', desc: '500+ extensions available.' },
  ].map((item) => (
    <Card key={item.title} title={item.title} description={item.desc} />
  ))}
</div>
```

### Form / Input Section

```tsx
import { TextField } from '@ionos-web-design-system/react/text-field';
import { Button } from '@ionos-web-design-system/react/button';

<div className="max-w-md mx-auto py-16 flex flex-col gap-4">
  <TextField label="Email address" placeholder="you@example.com" onChange={() => {}} />
  <TextField label="Password" type="password" placeholder="••••••••" onChange={() => {}} />
  <Button variant="primary" onClick={() => {}}>Sign in</Button>
</div>
```

### Dashboard / Data Layout

```tsx
import { Card } from '@ionos-web-design-system/react/card';

<div className="grid grid-cols-4 gap-4 p-8">
  {/* Stat cards */}
  {[
    { label: 'Active servers', value: '12' },
    { label: 'Monthly traffic', value: '2.4 TB' },
    { label: 'Uptime', value: '99.98%' },
    { label: 'Support tickets', value: '3' },
  ].map((stat) => (
    <Card key={stat.label}>
      <div className="text-sm opacity-60">{stat.label}</div>
      <div className="text-3xl font-semibold mt-1">{stat.value}</div>
    </Card>
  ))}
</div>
```

---

## Icon Usage

```tsx
import { Icon } from '@ionos-web-design-system/react/icon';

// System icons (UI elements)
<Icon group="system" name="check" size={20} />

// IONOS product icons
<Icon group="ionos" name="hosting" size={32} />
```

For runtime-determined icon names:
```tsx
import { useDynamicIcon } from '@ionos-web-design-system/react/use-dynamic-icon';

function DynamicIconExample({ iconName }: { iconName: string }) {
  const { Icon } = useDynamicIcon({ group: 'system', name: iconName });
  return Icon ? <Icon size={20} /> : null;
}
```

**Brandmark icons**: Do not use the `<Icon>` component. Use `<img>` in a wrapper div:
```tsx
<div className="w-8 h-8">
  <img src={`/node_modules/@ionos-web-design-system/icon/brandmark/${name}.svg`} alt={name} />
</div>
```

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

For status badges (Running, Maintenance, Offline/Error, Warning) in dashboards and server lists, use UDS utility tokens for the badge background and Dark Midnight for the text. This avoids hard-coded hex — utility tokens are saturated/bright, so they work as low-opacity backgrounds but not as text colors on white.

```tsx
// Correct pattern — CSS tokens throughout, no hard-coded hex
const STATUS_STYLES = {
  Running:     { bg: 'rgba(18, 207, 118, 0.12)',  token: 'var(--utility/green-300)',  label: 'Running' },
  Maintenance: { bg: 'rgba(255, 170, 0, 0.12)',   token: 'var(--utility/yellow-300)', label: 'Maintenance' },
  Offline:     { bg: 'rgba(255, 97, 89, 0.12)',   token: 'var(--utility/red-300)',    label: 'Offline' },
  Warning:     { bg: 'rgba(255, 170, 0, 0.12)',   token: 'var(--utility/yellow-300)', label: 'Warning' },
};

function StatusBadge({ status }: { status: keyof typeof STATUS_STYLES }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      backgroundColor: s.bg,
      // Dark Midnight text via a token (hex: ionos-color-palette.md) — NOT a Figma path
      color: 'var(--text-base)',
      borderLeft: `3px solid ${s.token}`,
      fontFamily: 'Open Sans, sans-serif',
      fontSize: '0.75rem',
      fontWeight: 600,
      padding: '2px 10px',
      borderRadius: '999px',
      textTransform: 'uppercase',
      letterSpacing: '0.56px',
    }}>
      {s.label}
    </span>
  );
}
```

The border-left trick lets the utility color show its true value without requiring it to be legible as a text color.

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
<h1 style={{ color: 'var(--text-base-invert)' }}>Headline</h1>   // white-on-dark
<div style={{ background: '#003D8F', color: '#fff' }}>IONOS Blue panel</div>

// ❌ Wrong — Figma token paths are not CSS variables; the declaration is dropped → unstyled
<h1 style={{ color: 'var(--neutral/white)' }}>Headline</h1>
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
