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
| Output | `.tsx` only | `.tsx` only |

Trigger words: "decorative", "dark", "cinematic", "premium", "hero panel", "marketing visual", "dark mode showcase", "visual", "splash".

The brand-agnostic mechanics of decorative mode — device frame wrapping, text placeholder
bars, icon cards, the glass card system, background patterns, and the transparent-canvas /
illustration-size / pop-out / ThemeProvider / image-integration primitives — live in
`shared/device-frames.md`, `shared/placeholder-bars.md`, `shared/icon-cards.md`,
`shared/glass-card.md`, `shared/background-patterns.md`, and `shared/decorative-primitives.md`.
This file holds only the IONOS-specific narrative, concrete color values those shared files
reference, brand logos, the typography anchor, and composition examples.

---

## Decorative Color Values (IONOS)

The shared decorative primitives listed above use symbolic placeholder names for
brand-specific color values — there is no `--brand-*` CSS custom property (see
`uds-style-guide/ionos-color-palette` "Using these colours in code"), so the concrete hex must
be resolved from here, not hardcoded in the brand-agnostic shared files.

The values below are the same rows carried in `uds-style-guide/rules/ionos-color-palette.md`
(Blue Black, Dark Blue, Sky) — resolved once here, in literal-hex form, for direct use in
decorative-mode code, since no CSS token exists for these brand-scale colors. That palette
file is the single source of truth for the value; do not re-derive it elsewhere.

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
- `ionos-light` — has blue `#003d8f` fills (IONOS Blue — see `uds-style-guide/rules/ionos-color-palette.md`) → readable on **light** backgrounds → use inside white/light inverted panels

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
| `ionos-light` | Blue (#003d8f — IONOS Blue, see `ionos-color-palette.md`) + white | 151 × 44px | Nav bar on **light** surface / inverted white panel |
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
