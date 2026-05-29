# Wireframe Composition Guide

## Mental Model

A wireframe illustration is a **composed snapshot** of a UI layout. Your job is to select the right UDS components, arrange them as the user described, and fill them with plausible placeholder content — so anyone looking at the output immediately understands the intended layout and hierarchy.

This is not a pixel-perfect reproduction. Make reasonable spatial decisions where the user hasn't specified details.

---

## Setup — Always Required

```tsx
// Wireframe illustration — not production code
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';

export default function MyWireframe() {
  return (
    <ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">
      <Surface>
        {/* composition goes here */}
      </Surface>
    </ThemeProvider>
  );
}
```

- `brand="ionos"` — active brand (only ionos is fully style-guided currently)
- `colorScheme="light"` — default for standard mode; use `"dark"` for decorative mode (set at root, not via ThemeInverter)
- `platform="comfortable"` — default spacing; use `"compact"` for dense UIs

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
import { Surface } from '@ionos-web-design-system/react/surface';
import { Button } from '@ionos-web-design-system/react/button';
import { ThemeInverter } from '@ionos-web-design-system/react/theme-inverter';

<ThemeInverter>
  <Surface className="px-16 py-24 text-center">
    <h1 className="font-heading text-6xl font-semibold mb-4">
      Your hosting, simplified
    </h1>
    <p className="text-xl mb-8 opacity-80">
      Everything you need to get online — domains, hosting, email.
    </p>
    <Button variant="primary" size="lg" onClick={() => {}}>
      Get started
    </Button>
  </Surface>
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
| Headlines | Short, relevant to the product ("Your hosting, simplified") |
| Body copy | 1–2 sentences on product value ("Everything you need to get online.") |
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
      // Text uses Dark Midnight — not a darkened utility color — for token purity
      color: 'var(--brand/ionos-blue-800)',
      borderLeft: `3px solid ${s.token}`,
      fontFamily: 'var(--base/font/body)',
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

## No Hard-Coded Colors — Including White and Black

Every color must come from a CSS token — this includes white and black:

| Color | Token | When to use |
|-------|-------|-------------|
| White | `var(--neutral/white)` | Text on dark backgrounds, overlays |
| Screen text (dark) | `var(--brand/ionos-blue-800)` | Default body text (Dark Midnight) |
| Deep blue-black | `var(--brand/ionos-blue-900)` | Dark gradient backgrounds |
| Near-black | `var(--neutral/cool-grey-900)` | Dense text on white |

```tsx
// ✅ Correct — white text on a dark hero overlay
<h1 style={{ color: 'var(--neutral/white)' }}>Headline</h1>

// ❌ Wrong — hex shorthand breaks token purity
<h1 style={{ color: '#ffffff' }}>Headline</h1>
<h1 style={{ color: 'white' }}>Headline</h1>
```

---

## Tailwind CSS in Wireframes

Since `@ionos-web-design-system/core` exposes all design tokens as CSS variables, you can use them in Tailwind arbitrary values:

```tsx
// Brand colors via CSS variables
<div className="bg-[var(--brand/ionos-blue-600)] text-[var(--neutral/white)] p-8">
  IONOS Blue background
</div>

// Spacing tokens
<div className="p-[var(--space/space-8)]">
  Token-driven padding
</div>
```

For standard layout utilities (flex, grid, gap, padding), use plain Tailwind classes.
