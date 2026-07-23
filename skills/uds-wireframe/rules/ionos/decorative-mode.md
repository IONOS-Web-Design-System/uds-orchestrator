---
decorative: true
---

# Wireframe Decorative Mode

## What "decorative" means

Decorative mode produces visually rich, dark/cinematic compositions — the kind of premium panel you see in high-end SaaS marketing pages. The goal is to convey atmosphere and layout intent, not readable content.

Compared to standard mode:

| | Standard | Decorative |
|---|---|---|
| Background | Light (`colorScheme="light"`) | **Transparent** outer canvas — dark gradient lives only inside the device frame's screen |
| Text | Plausible placeholder copy | Visual bar placeholders + 1–2 readable context strings (typography anchor) |
| Icons | Utility accents (20–24px) | Focal points (32–48px) in colored glass containers |
| Cards | UDS Card / Box components (no `Surface` export) | Glass morphism overlays (rgba border + blur) |
| Logo | None | Brand logo from `@ionos-web-design-system/icon/brandmark` in nav bar |
| Images | Embedded inline | Floating panel with shadow treatment |
| Output | `.tsx` only | `.tsx` + `/tmp/uds-decorative-preview.html` (with animation variant switcher) |

Trigger words: "decorative", "dark", "cinematic", "premium", "hero panel", "marketing visual", "dark mode showcase", "visual", "splash".

The brand-agnostic mechanics of decorative mode — device frame wrapping, text placeholder
bars, icon cards, the glass card system, background patterns, and the transparent-canvas /
illustration-size / pop-out / ThemeProvider / image-integration primitives — live in
`shared/device-frames.md`, `shared/placeholder-bars.md`, `shared/icon-cards.md`,
`shared/glass-card.md`, `shared/background-patterns.md`, and `shared/decorative-primitives.md`.
This file holds only the IONOS-specific narrative, concrete color values those shared files
reference, brand logos, the typography anchor, the HTML preview contract, and composition
examples.

---

## Decorative Color Values (IONOS)

The shared decorative primitives listed above use symbolic placeholder names for
brand-specific color values — there is no `--brand-*` CSS custom property (see
`uds-style-guide/ionos-color-palette` "Using these colours in code"), so the concrete hex must
be resolved from here, not hardcoded in the brand-agnostic shared files.

| Symbolic name | Concrete IONOS value | Used for |
|---|---|---|
| `DECORATIVE_BG_START` | `#02102B` (Blue Black) | Dark gradient / solid background start; `var(--surface-base-invert)` Remotion fallback |
| `DECORATIVE_BG_END` | `#0B2A63` (Dark Blue) | Dark gradient background end |
| `ACCENT_SKY` (as an `rgba()` triple: `17, 199, 230`) | `#11C7E6` (Sky) | Sky-tinted glass cards, sky icon containers, CTA / nav / notification accents |

### Icon Color Palette (concrete)

```tsx
const ICON_COLORS = {
  sky:   { bg: 'rgba(17, 199, 230, 0.12)',  border: 'rgba(17, 199, 230, 0.25)',  icon: '#11C7E6' },
  green: { bg: 'rgba(18, 207, 118, 0.12)',  border: 'rgba(18, 207, 118, 0.25)',  icon: '#12CF76' },
  amber: { bg: 'rgba(255, 170, 0, 0.12)',   border: 'rgba(255, 170, 0, 0.25)',   icon: '#FFAA00' },
  rose:  { bg: 'rgba(255, 97, 89, 0.12)',   border: 'rgba(255, 97, 89, 0.25)',   icon: '#FF6159' },
} as const;
type IconColorKey = keyof typeof ICON_COLORS;
```

`shared/icon-cards.md`'s `IconBlock` helper consumes this table by `colorKey` — see that file
for the component and usage patterns. Colour assignment rule: `sky` for the primary / hero
feature; cycle green → amber for supporting features; `rose` only for error/alert states.

---

## Brand Logos

Always include the IONOS logo (or the relevant brand's logo) in the nav bar placeholder.

**Naming rule (confirmed by SVG fill inspection):**
- `ionos-dark` — all white fills (`#fff`) → readable on **dark** backgrounds → use in decorative (dark scene nav bars)
- `ionos-light` — has blue `#003d8f` fills → readable on **light** backgrounds → use inside white/light inverted panels

**Import and embed pattern (dark background — default for decorative):**
```tsx
import { svgData as ionosLogo } from '@ionos-web-design-system/icon/brandmark/ionos-dark';

// In the nav bar:
<img src={ionosLogo} alt="IONOS" style={{ height: 22, width: 'auto', display: 'block' }} />
```

The `svgData` export is a `data:image/svg+xml;base64,...` string — use it directly as `<img src>`. No additional setup required.

**Available brandmark variants for IONOS:**

| Import name | Fills | Dimensions | Use in |
|-------------|-------|------------|--------|
| `ionos-dark` | White only (`#fff`) | 151 × 44px | Nav bar on **dark** screen (default for decorative) |
| `ionos-light` | Blue (#003d8f) + white | 151 × 44px | Nav bar on **light** surface / inverted white panel |
| `ionos-mono-dark` | White mono | 151 × 44px | Minimal / monochrome nav on dark backgrounds |
| `ionos-cloud-dark` | White "IONOS Cloud" | varies | Cloud product illustrations on dark backgrounds |
| `ionos-cloud-vertical-dark` | Stacked white variant | varies | Tall logo slots on dark backgrounds |

**Other brand logos (for non-IONOS illustrations):**

| Brand | Dark import | Light import |
|-------|-------------|-------------|
| Fasthosts (cobalt) | `fasthosts-cobalt-dark` | `fasthosts-cobalt-light` |
| Fasthosts (navy) | `fasthosts-navy-dark` | `fasthosts-navy-light` |
| Home.pl | `homepl-dark` | `homepl-light` |
| Arsys | `arsys-dark` | `arsys-light` |
| InterNetX | `internetx-dark` | `internetx-light` |
| Sedocom | `sedocom-dark` | `sedocom-light` |

All imports follow the pattern:
```tsx
import { svgData as logo } from '@ionos-web-design-system/icon/brandmark/{name}';
```

**Nav bar with logo (full pattern):**
```tsx
<nav style={{
  display: 'flex', alignItems: 'center', gap: 32,
  padding: '0 24px', height: 48,
  borderBottom: '1px solid rgba(255,255,255,0.08)',
}}>
  {/* Logo — always from brandmark, never a bar placeholder */}
  <img src={ionosLogo} alt="IONOS" style={{ height: 20, width: 'auto' }} />
  {/* Nav items — bar placeholders */}
  <div style={{ display: 'flex', gap: 20, marginLeft: 'auto' }}>
    {[52, 48, 60, 52].map((w, i) => <Bar key={i} w={`${w}px`} h={7} op={0.22} />)}
  </div>
  {/* CTA button placeholder */}
  <div style={{ height: 32, width: 88, borderRadius: 6, background: 'rgba(17,199,230,0.22)', border: '1px solid rgba(17,199,230,0.40)' }} />
</nav>
```

The logo is **never** a bar placeholder — it is always the real SVG from the brandmark library.

---

## Typography Anchor — Always Required

Even though decorative mode replaces text with bars, **every illustration must include 1–2 readable context strings** — short noun phrases extracted from the user's prompt. These ground the viewer and make clear what the illustration represents.

```tsx
// Context anchor — extract from user's prompt:
// "IONOS Cloud", "Server Dashboard", "Analytics", "Checkout", "Hosting Plans"
const ContextAnchor = ({ label, size = 'large' }: { label: string; size?: 'large'|'medium'|'small' }) => {
  const fs = size === 'large' ? 24 : size === 'medium' ? 18 : 13;
  return (
    <span style={{
      fontFamily: 'var(--uds-font-title)',
      fontSize: fs,
      fontWeight: 600,
      color: 'var(--text-base-invert)',
      letterSpacing: '-0.02em',
      opacity: 0.92,
      display: 'block',
    }}>
      {label}
    </span>
  );
};
```

Placement rules:
- **Large**: use as a section heading above the main content grid, or as an eyebrow label above the hero bars
- **Medium**: use as a panel title in the header area
- **Small**: use as a prominent label at the top of the card — often the most readable element in the entire composition; make `op` on surrounding bars even lower (0.10–0.18) so the text stands out

**Examples by prompt:**
- "a cloud server dashboard" → `<ContextAnchor label="Server Dashboard" />`
- "IONOS hosting landing page" → `<ContextAnchor label="IONOS Hosting" />`
- "checkout flow" → `<ContextAnchor label="Checkout" />`
- "analytics panel" → `<ContextAnchor label="Analytics" />`

This is the **only readable text** in a decorative wireframe. Everything else stays as bars.

---

## HTML Preview — Required for Decorative Mode

After writing the `.tsx`, always also write `/tmp/uds-decorative-preview.html` — a standalone HTML file that replicates the visual composition so the user can verify the dark backgrounds, glass effects, and icon layout instantly without running a dev server.

**HTML file structure:**
```html
<!DOCTYPE html>
<html lang="en" data-brand="ionos" data-platform="comfortable" data-color-scheme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Decorative Wireframe Preview</title>
  <link rel="stylesheet" href="/Users/boweixiao/ads-demo/node_modules/@ionos-web-design-system/core/dist/brands/ionos.css">
  <link rel="stylesheet" href="/Users/boweixiao/ads-demo/node_modules/@ionos-web-design-system/core/dist/platforms/comfortable.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Overpass:wght@400;600&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Open Sans', sans-serif; }

    /* Bar placeholder utility */
    .bar { border-radius: 999px; flex-shrink: 0; }
    .bar-group { display: flex; flex-direction: column; gap: 7px; }

    /* Glass card */
    .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.10); border-radius: 16px; backdrop-filter: blur(16px); }
    .glass-elevated { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.18); border-radius: 16px; backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
    .glass-sky { background: rgba(17,199,230,0.06); border: 1px solid rgba(17,199,230,0.20); border-radius: 16px; backdrop-filter: blur(16px); }

    /* Icon containers */
    .icon-sky   { background: rgba(17,199,230,0.12); border: 1px solid rgba(17,199,230,0.25); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .icon-green { background: rgba(18,207,118,0.12); border: 1px solid rgba(18,207,118,0.25); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .icon-amber { background: rgba(255,170,0,0.12);  border: 1px solid rgba(255,170,0,0.25);  border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <!-- composition here -->
</body>
</html>
```

**No emoji in the preview.** Render icon containers as styled divs using CSS `mask-image` with inline SVG data URIs. Include these 6 common shapes in every preview's `<style>` block and use the closest match:

```html
<style>
  /* Icon rendering via CSS mask-image — no emoji */
  .icon-shape { display: flex; align-items: center; justify-content: center; }
  .icon-shape::after {
    content: ''; display: block; width: 52%; height: 52%;
    background: currentColor; mask-size: contain; mask-repeat: no-repeat; mask-position: center;
  }
  /* Settings / gear */
  .icon-settings::after { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.92c.04-.32.07-.64.07-.96s-.03-.65-.07-1l2.07-1.58c.19-.14.24-.41.12-.61l-1.96-3.36c-.12-.22-.37-.3-.59-.22l-2.44 1c-.52-.4-1.08-.73-1.7-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.62.25-1.18.58-1.7.98l-2.44-1c-.22-.08-.47 0-.59.22L2.74 8.27c-.12.21-.08.47.12.61l2.07 1.58c-.04.35-.07.7-.07 1.04s.03.7.07 1.04l-2.07 1.58c-.19.14-.24.4-.12.6l1.96 3.36c.12.22.37.29.59.22l2.44-1c.52.4 1.08.73 1.7.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.62-.25 1.18-.58 1.7-.98l2.44 1c.22.08.47 0 .59-.22l1.96-3.36c.12-.22.07-.46-.12-.6l-2.07-1.58z'/%3E%3C/svg%3E"); }
  /* Lock / security */
  .icon-lock::after { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'/%3E%3C/svg%3E"); }
  /* Chart / analytics */
  .icon-chart::after { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z'/%3E%3C/svg%3E"); }
  /* Cloud */
  .icon-cloud::after { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/%3E%3C/svg%3E"); }
  /* Check circle */
  .icon-check::after { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E"); }
  /* Bell / notification */
  .icon-bell::after { mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z'/%3E%3C/svg%3E"); }
</style>

<!-- Usage: -->
<div class="icon-shape icon-settings icon-sky" style="width:52px;height:52px;border-radius:13px;color:#11C7E6"></div>
<div class="icon-shape icon-lock icon-green" style="width:52px;height:52px;border-radius:13px;color:#12CF76"></div>
```

Pick the closest matching icon from settings / lock / chart / cloud / check / bell. If none fits exactly, use the generic `.icon-shape` class without a specific `icon-*` modifier — it renders as a solid circle silhouette, which is visually honest about approximation.

After writing the file, run: `open /tmp/uds-decorative-preview.html`

---

## Composition Examples

### Full-page hero + feature grid

```
[dark gradient background — radial spotlight from top center]
  [nav: logo bar | 4 nav item bars | cta rect]
  
  [hero section — centered, 80px vertical padding]
    [eyebrow bar — 80px wide]
    [headline bar — 55% wide, 20px tall]
    [subheadline bar — 42% wide, 14px tall]
    [body BarGroup 3 lines]
    [button row: sky CTA rect + ghost rect]
  
  [feature grid — 3 columns, gap-8]
    [glass card: sky icon 52px + bar heading + BarGroup 2]
    [glass-elevated: green icon 52px + bar heading + BarGroup 2]
    [glass card: amber icon 52px + bar heading + BarGroup 2]
```

### Dashboard panel

```
[solid dark background]
  [nav placeholder row]
  
  [4-column stat bar — glass cards with number bar + label bar each]
  
  [content row — 2 columns]
    [left: glass card with icon header + table rows of bars]
    [right: glass-sky card with chart placeholder (nested bars at varying heights)]
```
