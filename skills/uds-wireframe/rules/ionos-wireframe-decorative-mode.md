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

---

## Transparent Background

The decorative illustration must have a **transparent outer canvas** so it can be dropped onto any host background — a light page, a dark hero section, a gradient, or an image.

**Structure rule:** The `data-*` wrapper and the outer canvas use `background: transparent`. The dark gradient belongs only inside the device frame's screen content area.

```tsx
export default function MyIllustration() {
  return (
    // ThemeProvider takes ONLY children. Brand/platform/colorScheme are applied
    // as data-* attributes on a wrapping element (NOT props on ThemeProvider).
    <div data-brand="ionos" data-platform="comfortable" data-color-scheme="dark" style={{ display: 'inline-block', background: 'transparent' }}>
      <ThemeProvider>
        {/* Outer canvas — transparent, inline-block so it sizes to content */}
        <div style={{ background: 'transparent', display: 'inline-block', position: 'relative', padding: '40px 60px 40px 40px' }}>
          <MacWindowFrame>
            {/* Dark gradient lives here — inside the screen only */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-gradient-start, #02102B) 0%, var(--color-gradient-end, #0B2A63) 100%)',
            }}>
              {/* screen content */}
            </div>
          </MacWindowFrame>
          {/* Floating pop-out elements — glass/semi-transparent, work on any bg */}
        </div>
      </ThemeProvider>
    </div>
  );
}
```

The device frame chrome (dark grey bezel), glass cards, and floating elements are all semi-transparent by design — they adapt to their host background naturally.

**HTML preview:** add a checkerboard CSS background to `body` to demonstrate the transparency:
```css
body {
  background:
    repeating-conic-gradient(#2a2a2e 0% 25%, #1e1e22 0% 50%)
    0 0 / 24px 24px;
  min-height: 100vh;
  display: grid;
  place-items: center;
}
```

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

## Illustration Size

**Always ask** which size before generating. If the user's context implies one (e.g. "for a hero section" → large, "for a sidebar card" → small), infer it directly.

| Size | Width | Used for | Detail level | Floating elements |
|------|-------|----------|--------------|-------------------|
| **large** | ~750px | Full carousel, hero section | Full layout — nav + sections + multiple cards | 3–4 |
| **medium** | ~500px | Half-screen panel, feature callout | One main section, condensed nav | 1–2 |
| **small** | ~250px | Inline card, thumbnail, icon-area | Abstract — 2–3 cards max, no nav | 1 (pill only) |

Size affects everything: larger means more sections, more glass cards, more floating elements, more animation. Smaller means fewer elements but **typography becomes more important** as the primary context signal.

### Size-specific composition rules

**Large (750px):**
```
[nav bar placeholder]
[hero or dashboard section — 2–3 columns]
[feature/stat grid — 3–4 cards]
[optional: table or secondary section]
[3–4 floating pop-out elements]
[cursor flow animation + 2 card reactions]
[typography anchor: 20–28px, Overpass, prominent position]
```

**Medium (500px):**
```
[minimal nav or header only]
[1 main content section — 2 columns or 3 cards]
[1–2 floating pop-out elements]
[cursor flow or card reaction — pick one]
[typography anchor: 16–20px, Overpass]
```

**Small (250px):**
```
[no nav]
[2–3 glass cards stacked or 2-column mini-grid]
[1 small pill pop-out]
[float bob only — no cursor (too cramped)]
[typography anchor: 12–14px, more visible — this is the main context signal]
```

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

## Device Frame Wrapping

Every decorative wireframe is rendered **inside a device frame**. The frame provides the composition anchor and makes elements that float outside it feel intentionally "popped out".

Choose the frame based on context the user describes:
| User says | Frame to use |
|-----------|-------------|
| "mobile", "app", "phone" | Phone frame |
| "desktop", "dashboard", "browser", "website" | Laptop frame |
| "web app", "SaaS tool", "admin panel" | macOS window (default) |
| "Windows app", "enterprise tool" | Windows window |
| No context | macOS window |

### macOS Window Frame
```tsx
const MacWindowFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    borderRadius: 12, overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 40px 100px rgba(0,0,0,0.7)',
  }}>
    <div style={{
      height: 40, background: 'rgba(36,36,40,0.98)',
      display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
      borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)',
    }}>
      {[['#ff5f57','#e0443e'],['#febc2e','#d4a018'],['#28c840','#1aab29']].map(([fill,shadow],i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: fill, boxShadow: `inset 0 -1px 0 ${shadow}` }} />
      ))}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 120, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.12)' }} />
      </div>
    </div>
    {children}
  </div>
);
```

### Laptop Frame
```tsx
const LaptopFrame = ({ children, width = 880 }: { children: React.ReactNode; width?: number }) => (
  <div style={{ display: 'inline-block', position: 'relative' }}>
    <div style={{
      width, background: 'linear-gradient(180deg, #323236 0%, #28282c 100%)',
      borderRadius: '14px 14px 0 0', padding: '18px 18px 0',
      boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 40px 100px rgba(0,0,0,0.7)',
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3e3e42', margin: '0 auto 10px' }} />
      <div style={{ borderRadius: '6px 6px 0 0', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
    {/* Keyboard hinge */}
    <div style={{
      width: width * 1.08, marginLeft: -(width * 0.04), height: 20,
      background: 'linear-gradient(180deg, #3a3a3e 0%, #2a2a2e 100%)',
      borderRadius: '0 0 6px 6px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }} />
  </div>
);
```

### Phone Frame
```tsx
const PhoneFrame = ({ children, width = 320 }: { children: React.ReactNode; width?: number }) => (
  <div style={{
    width, background: 'linear-gradient(180deg, #2e2e32 0%, #222226 100%)',
    borderRadius: 44, padding: '14px 10px',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(0,0,0,0.5), 0 40px 100px rgba(0,0,0,0.7)',
  }}>
    {/* Dynamic island / notch */}
    <div style={{ width: 88, height: 20, background: '#1a1a1e', borderRadius: 10, margin: '0 auto 8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e2e32' }} />
      <div style={{ width: 40, height: 4, borderRadius: 2, background: '#2e2e32' }} />
    </div>
    <div style={{ borderRadius: 28, overflow: 'hidden' }}>{children}</div>
    {/* Home indicator */}
    <div style={{ width: 96, height: 4, background: 'rgba(255,255,255,0.25)', borderRadius: 2, margin: '8px auto 0' }} />
  </div>
);
```

### Windows Window Frame
```tsx
const WindowsFrame = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    borderRadius: '8px 8px 4px 4px', overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 32px 80px rgba(0,0,0,0.6)',
  }}>
    <div style={{
      height: 32, background: 'rgba(28,28,32,0.98)',
      display: 'flex', alignItems: 'center', padding: '0 0 0 12px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ width: 96, height: 7, borderRadius: 3, background: 'rgba(255,255,255,0.20)' }} />
      <div style={{ marginLeft: 'auto', display: 'flex' }}>
        {/* Windows control icons — use system icons, never emoji */}
        {[
          { name: 'minus', close: false },
          { name: 'crop-square', close: false },
          { name: 'x', close: true },
        ].map(({ name, close }, i) => (
          <div key={i} style={{ width: 46, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon group="system" name={name} size={12} style={{ color: 'rgba(255,255,255,0.65)' }} />
          </div>
        ))}
      </div>
    </div>
    {children}
  </div>
);
```

---

## Pop-out Floating Elements

The most visually dynamic decorative compositions have **one or two elements that escape the device frame boundary** — a stat card floating above the screen edge, a notification pill bleeding outside the laptop bezel. These tell the viewer "this is important".

> **If a pop-out contains readable text, do not loop a float/bob on it** — the perpetual motion re-rasterizes its glyphs every frame and shimmers. Let it fly in once and hold, or bob only a non-text backdrop/icon layer. In Remotion renders this is gate-enforced (`text-stability`); see remotion-best-practices "Text rendering stability".

Wrap the device frame in a padded relative container, then use `position: absolute` to place pop-out elements:

```tsx
{/* Outer wrapper with generous padding for bleed space */}
<div style={{ position: 'relative', display: 'inline-block', padding: '48px 72px 48px 48px' }}>
  <MacWindowFrame>
    {/* screen content */}
  </MacWindowFrame>

  {/* Top-right floating stat card */}
  <div style={{
    position: 'absolute', top: 16, right: -24, zIndex: 10,
    ...glassCardElevated, padding: '14px 18px', minWidth: 180,
    transform: 'rotate(1.5deg)',
    animation: 'floatBob 4s ease-in-out infinite',
  }}>
    <IconBlock name="trending-up" colorKey="green" size={18} containerSize={34} />
    <div style={{ marginTop: 10 }}>
      <Bar w="85%" h={10} op={0.30} />
      <Bar w="55%" h={7} op={0.18} style={{ marginTop: 6 }} />
    </div>
  </div>

  {/* Bottom-left notification pill */}
  <div style={{
    position: 'absolute', bottom: 72, left: -28, zIndex: 10,
    background: 'rgba(17,199,230,0.12)', border: '1px solid rgba(17,199,230,0.30)',
    borderRadius: 999, padding: '8px 14px',
    display: 'flex', alignItems: 'center', gap: 8,
    animation: 'flyIn 0.55s cubic-bezier(0.16,1,0.3,1) 0.4s both',
  }}>
    <Icon group="system" name="bell" size={14} style={{ color: '#11C7E6' }} />
    <Bar w="80px" h={7} op={0.45} />
  </div>
</div>
```

Good pop-out candidates: stat metric cards, AI completion notifications, action confirmation pills, "New" feature banners, user avatar / presence chips.

The slight tilt (`rotate(1.5deg)`) and shadow make the card feel like it's physically lifted off the screen.

---

## ThemeProvider Setup

```tsx
// Wireframe illustration — not production code
// ThemeProvider takes ONLY children. Brand/platform/colorScheme are applied as
// data-* attributes on a wrapping element (NOT props on ThemeProvider).
<div data-brand="ionos" data-platform="comfortable" data-color-scheme="dark">
  <ThemeProvider>
    {/* No `Surface` component in UDS — use a div with a bg-surface-* class or a CSS-var background */}
    <div style={{ minHeight: '100vh', background: 'var(--surface-base-invert, #02102B)' }}>
      {/* composition */}
    </div>
  </ThemeProvider>
</div>
```

Set `colorScheme="dark"` at the root — activates dark semantic tokens across all UDS components. **Do not** use `ThemeInverter` in decorative mode; the whole page is dark.

---

## Background Patterns

Three options — pick based on composition needs:

```tsx
// Option 1 — Solid dark using surface token (neutral, safe default)
// CSS contexts: var(--surface-base-invert)  |  Remotion hex fallback: #02102B
background: 'var(--surface-base-invert, #02102B)'

// Option 2 — Directional gradient using design tokens (preferred for most layouts)
// CSS: var(--color-gradient-start) → var(--color-gradient-end)
// Remotion hex fallbacks: #02102B → #0B2A63
background: 'linear-gradient(135deg, var(--color-gradient-start, #02102B) 0%, var(--color-gradient-end, #0B2A63) 100%)'

// Option 3 — Radial spotlight (most cinematic — clear top focal point)
background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(17,199,230,0.15) 0%, var(--color-gradient-start, #02102B) 70%)'
```

Default to Option 2. Use Option 3 when hero content is at the top. Use Option 1 for secondary/nested dark panels.

**Dark background surfaces (dark colorScheme):**
- `var(--surface-base-invert)` — deepest dark, equivalent to `#02102B`
- `var(--surface-subtle-invert)` — slightly lighter dark, for elevated panels within a dark layout

**CSS variables don't resolve in Remotion renders** — always provide the hex fallback via `var(--token, #hexFallback)` or use the hex directly.

---

## Text Placeholder Bars

All text in decorative mode is replaced by visual bars — rounded rectangles that suggest text height, width, and opacity hierarchy. Define these two helpers near the top of the `.tsx` file:

```tsx
// Single placeholder bar
const Bar = ({ w = '60%', h = 12, op = 0.25 }: { w?: string; h?: number; op?: number }) => (
  <div style={{
    width: w, height: h,
    borderRadius: h / 2,
    background: `rgba(255, 255, 255, ${op})`,
    flexShrink: 0,
  }} />
);

// Multi-line paragraph block (3 progressively shorter bars)
const BarGroup = ({ lines = 3, op = 0.14 }: { lines?: number; op?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
    {[100, 92, 68].slice(0, lines).map((pct, i) => (
      <Bar key={i} w={`${pct}%`} h={8} op={op} />
    ))}
  </div>
);
```

Reference table:

| UI element | Call | Notes |
|-----------|------|-------|
| Page headline | `<Bar w="55%" h={18} op={0.30} />` | Large, bright |
| Section heading | `<Bar w="45%" h={14} op={0.25} />` | |
| Eyebrow / pill label | `<Bar w="80px" h={7} op={0.18} />` | Fixed pixel width |
| Subheadline | `<Bar w="42%" h={11} op={0.22} />` | |
| Body paragraph | `<BarGroup lines={3} />` | 3-line block |
| Card subtitle | `<Bar w="65%" h={9} op={0.18} />` | |
| Nav item | `<Bar w="52px" h={8} op={0.20} />` | In a flex row of 4–5 |
| Table cell | `<Bar w="75%" h={8} op={0.16} />` | |
| Tag / badge label | `<Bar w="48px" h={7} op={0.22} />` | |

**Rule:** Never use real text in decorative mode. Even one-word labels must be bars. The only exception: a proper brand name (e.g. "IONOS") that must be visually recognisable — in that case use real text with `var(--text-base-invert)`.

**Button placeholder:**
```tsx
<div style={{
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  height: 40, minWidth: 120, paddingInline: 20, borderRadius: 8,
  background: 'rgba(17, 199, 230, 0.18)',
  border: '1px solid rgba(17, 199, 230, 0.35)',
}}>
  <Bar w="70px" h={8} op={0.55} />
</div>
```

**Navigation bar placeholder:**
```tsx
<nav style={{
  display: 'flex', alignItems: 'center', gap: 32,
  padding: '0 48px', height: 64,
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
}}>
  {/* Logo area */}
  <Bar w="80px" h={14} op={0.55} />
  {/* Nav items */}
  <div style={{ display: 'flex', gap: 24, marginLeft: 'auto' }}>
    {[52, 48, 60, 52].map((w, i) => <Bar key={i} w={`${w}px`} h={8} op={0.22} />)}
  </div>
  {/* CTA */}
  <div style={{ height: 36, width: 100, borderRadius: 6, background: 'rgba(17, 199, 230, 0.25)', border: '1px solid rgba(17, 199, 230, 0.4)' }} />
</nav>
```

---

## Icon Cards

Icons are the visual focal points in decorative mode. Use `group="system"` for UI/concept icons; `group="ionos"` for product icons.

> **No emoji anywhere.** Neither the `.tsx` output nor the HTML preview may use emoji characters as icon substitutes. Always use `<Icon group="system" name="..." />` in the TSX, and CSS mask-image SVG data URIs in the HTML preview (see HTML Preview section).

### Color palette for icon containers

```tsx
const ICON_COLORS = {
  sky:   { bg: 'rgba(17, 199, 230, 0.12)',  border: 'rgba(17, 199, 230, 0.25)',  icon: '#11C7E6' },
  green: { bg: 'rgba(18, 207, 118, 0.12)',  border: 'rgba(18, 207, 118, 0.25)',  icon: '#12CF76' },
  amber: { bg: 'rgba(255, 170, 0, 0.12)',   border: 'rgba(255, 170, 0, 0.25)',   icon: '#FFAA00' },
  rose:  { bg: 'rgba(255, 97, 89, 0.12)',   border: 'rgba(255, 97, 89, 0.25)',   icon: '#FF6159' },
} as const;
type IconColorKey = keyof typeof ICON_COLORS;
```

Colour assignment rule: `sky` for the primary / hero feature; cycle green → amber for supporting features; `rose` only for error/alert states.

### IconBlock helper

```tsx
const IconBlock = ({
  name, colorKey = 'sky', size = 36, containerSize = 64,
}: {
  name: string; colorKey?: IconColorKey; size?: number; containerSize?: number;
}) => {
  const c = ICON_COLORS[colorKey];
  return (
    <div style={{
      width: containerSize, height: containerSize,
      borderRadius: containerSize * 0.25,
      background: c.bg, border: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon group="system" name={name} size={size} style={{ color: c.icon }} />
    </div>
  );
};
```

### Usage patterns

**Hero icon (large, standalone — above a headline):**
```tsx
<IconBlock name="cloud" colorKey="sky" size={40} containerSize={80} />
```

**Feature icon grid (3-column):**
```tsx
{[
  { icon: 'settings', colorKey: 'sky' as IconColorKey },
  { icon: 'lock',     colorKey: 'green' as IconColorKey },
  { icon: 'chart',    colorKey: 'amber' as IconColorKey },
].map(({ icon, colorKey }) => (
  <div key={icon} style={glassCard}>
    <IconBlock name={icon} colorKey={colorKey} size={28} containerSize={52} />
    <div style={{ marginTop: 16 }}>
      <Bar w="70%" h={11} op={0.25} />
      <div style={{ marginTop: 10 }}>
        <BarGroup lines={2} op={0.14} />
      </div>
    </div>
  </div>
))}
```

**Icon + text row (list / timeline item):**
```tsx
<div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
  <IconBlock name="check-circle" colorKey="green" size={20} containerSize={40} />
  <div style={{ flex: 1, paddingTop: 4 }}>
    <Bar w="55%" h={10} op={0.25} />
    <div style={{ marginTop: 8 }}><BarGroup lines={2} op={0.14} /></div>
  </div>
</div>
```

---

## Glass Card System

```tsx
// Standard glass card — most containers
const glassCard: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
  borderRadius: 16,
  backdropFilter: 'blur(16px)',
  padding: 24,
};

// Elevated glass card — one highlighted card per section
const glassCardElevated: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: 16,
  backdropFilter: 'blur(16px)',
  padding: 24,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};

// Sky-tinted card — for a highlighted "featured" variant
const glassCardSky: React.CSSProperties = {
  background: 'rgba(17, 199, 230, 0.06)',
  border: '1px solid rgba(17, 199, 230, 0.20)',
  borderRadius: 16,
  backdropFilter: 'blur(16px)',
  padding: 24,
};
```

Use `glassCard` for standard content blocks. Use `glassCardElevated` for one primary/featured card per section. Use `glassCardSky` when you want to tie a card visually to the sky brand accent.

---

## Image Integration (Decorative Context)

When the user provides a pixel image, render it as a "floating panel" — it should look like a product screenshot hovering above the dark background:

```tsx
<div style={{
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 32px 80px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
}}>
  <img src={imageSrc} alt="" style={{ width: '100%', display: 'block' }} />
</div>
```

**Split-hero layout (common pattern):**
- Left column (60%): dark background, bar headline + BarGroup + button placeholder + optional stat row
- Right column (40%): image panel floating with shadow

```tsx
<div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 64, alignItems: 'center', padding: '80px 64px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <Bar w="80px" h={7} op={0.18} />
    <Bar w="65%" h={20} op={0.30} />
    <Bar w="50%" h={15} op={0.25} />
    <BarGroup lines={3} />
    {/* button placeholder */}
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      <div style={{ height: 44, width: 140, borderRadius: 8, background: 'rgba(17, 199, 230, 0.25)', border: '1px solid rgba(17, 199, 230, 0.5)' }} />
      <div style={{ height: 44, width: 120, borderRadius: 8, border: '1px solid rgba(255, 255, 255, 0.18)' }} />
    </div>
  </div>
  <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.10)' }}>
    <img src={imageSrc} alt="" style={{ width: '100%', display: 'block' }} />
  </div>
</div>
```

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
