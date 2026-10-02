---
decorative: true
---

# Decorative Primitives (transparent canvas, size, pop-outs, theming, image)

Miscellaneous brand-agnostic decorative-mode primitives that don't warrant their own file.
Concrete color values referenced below (`DECORATIVE_BG_START`, `DECORATIVE_BG_END`) are brand-specific — resolve them from the brand's decorative color rule (e.g.
`ionos/decorative-mode.md` "Decorative Color Values") — never hardcode a brand hex in this
shared file.

## Transparent Background

The decorative illustration must have a **transparent outer canvas** so it can be dropped onto any host background (light page, dark hero, gradient, image).

**Structure rule:** The `data-*` wrapper and the outer canvas use `background: transparent`. The dark gradient belongs only inside the device frame's screen content area.

```tsx
export default function MyIllustration() {
  return (
    // ThemeProvider takes ONLY children; brand/platform/scheme are data-* attributes on a
    // wrapper (data-brand = the render's own brand slug — never hardcode one here).
    <div data-brand="{brand}" data-platform="comfortable" data-color-scheme="dark" style={{ display: 'inline-block', background: 'transparent' }}>
      <ThemeProvider>
        {/* Outer canvas — transparent, inline-block so it sizes to content */}
        <div style={{ background: 'transparent', display: 'inline-block', position: 'relative', padding: '40px 60px 40px 40px' }}>
          <MacWindowFrame>
            {/* Dark gradient lives here — inside the screen only */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-gradient-start, DECORATIVE_BG_START) 0%, var(--color-gradient-end, DECORATIVE_BG_END) 100%)',
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

The device frame chrome (dark grey bezel) and glass cards are semi-transparent by design — they adapt to their host background naturally. Kit floaters are NOT: a `KitPill`, `KitButton` or `KitIconButton` draws its own opaque surface, so it reads on any host. Never float a bare `KitIcon` on the transparent canvas — its token colour can vanish against an unknown host background; use a `KitIconButton` (it has its own backdrop) instead.

---

## Illustration Size

**Always ask** which size before generating. If the user's context implies one (e.g. "for a hero section" → large, "for a sidebar card" → small), infer it directly.

| Size | Width | Used for | Detail level | Floating elements |
|------|-------|----------|--------------|-------------------|
| **large** | ~750px | Full carousel, hero section | Full layout — nav + sections + multiple cards | 3–4 |
| **medium** | ~500px | Half-screen panel, feature callout | One main section, condensed nav | 1–2 |
| **small** | ~250px | Inline card, thumbnail, icon-area | Abstract — 2–3 cards max, no nav | 1 — one compact kit element: a KitIconButton (may bob) or a KitPill (fly-in, then still) |

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
[typography anchor: 20–28px, the brand's display font (see the brand's typography rule — `uds-style-guide/rules/ionos-typography.md` for IONOS), prominent position]
```

**Medium (500px):**
```
[minimal nav or header only]
[1 main content section — 2 columns or 3 cards]
[1–2 floating pop-out elements]
[cursor flow or card reaction — pick one]
[typography anchor: 16–20px, the brand's display font (per the brand's typography rule)]
```

**Small (250px):**
```
[no nav]
[2–3 glass cards stacked or 2-column mini-grid]
[1 pop-out — one compact kit element: a KitIconButton (may bob) or a KitPill (fly-in, then still)]
[no cursor (too cramped); bob only a KitIconButton, never the KitPill]
[typography anchor: 12–14px, more visible — this is the main context signal]
```

---

## Pop-out Floating Elements

The most visually dynamic decorative compositions have **one or two elements that escape the device frame boundary** — a stat card floating above the screen edge, a notification chip bleeding outside the laptop bezel. These tell the viewer "this is important".

> Text-stability (never animate a transform on text-bearing layers; avoid shimmer/sub-pixel drift): see remotion-best-practices `shared-motion-text.md` (always in effect).

Wrap the device frame in a padded relative container, then use `position: absolute` to place pop-out elements:

```tsx
import bell from '@ionos-web-design-system/icon/system/bell';
import { svgData as performanceSvg } from '@ionos-web-design-system/icon/system/performance';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KitIconButton, KitPill } from './kit';

// Frame-driven: the chip enters once on a clamped curve, then holds.
const frame = useCurrentFrame();
const chipIn = interpolate(frame, [12, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1) });

{/* Outer wrapper with generous padding for bleed space */}
<div style={{ position: 'relative', display: 'inline-block', padding: '48px 72px 48px 48px' }}>
  <MacWindowFrame>
    {/* screen content */}
  </MacWindowFrame>

  {/* Top-right floating stat card — no text, so it may bob */}
  <div style={{
    position: 'absolute', top: 16, right: -24, zIndex: 10,
    ...glassCardElevated, padding: '14px 18px', minWidth: 180,
    transform: `translateY(${Math.sin(frame / 19) * 8}px) rotate(1.5deg)`,
  }}>
    <IconBlock icon={performanceSvg} colorKey="green" size={18} containerSize={34} />
    <div style={{ marginTop: 10 }}>
      <Bar w="85%" h={10} op={0.30} />
      <Bar w="55%" h={7} op={0.18} style={{ marginTop: 6 }} />
    </div>
  </div>

  {/* Bottom-left notification chip — the kit draws the chip; the parent only places and animates it */}
  <div style={{
    position: 'absolute', bottom: 72, left: -28, zIndex: 10,
    display: 'flex', alignItems: 'center', gap: 8,
    opacity: chipIn, transform: `translate(${(1 - chipIn) * 32}px, ${(1 - chipIn) * -16}px)`,
  }}>
    <KitIconButton icon={bell} title={texts.notificationAction ?? ''} size="small" />
    <KitPill label={texts.notification ?? ''} variant="success" />
  </div>
</div>
```

Good pop-out candidates: stat metric cards (glass card + bars), AI completion notifications, action confirmation chips (`KitPill`), "New" tags (`KitBadge`), user avatars (`KitAvatar`).

The slight tilt and shadow lift the card off the screen.

---

## ThemeProvider Setup

```tsx
// ThemeProvider takes ONLY children; brand/platform/scheme are data-* attributes on a
// wrapper (data-brand = the render's own brand slug — never hardcode one here).
<div data-brand="{brand}" data-platform="comfortable" data-color-scheme="dark">
  <ThemeProvider>
    {/* No `Surface` component in UDS — use a div with a bg-surface-* class or a CSS-var background.
        The hex fallback (DECORATIVE_BG_START) is brand-specific — see header note. */}
    <div style={{ minHeight: '100vh', background: 'var(--surface-base-invert, DECORATIVE_BG_START)' }}>
      {/* composition */}
    </div>
  </ThemeProvider>
</div>
```

Set `colorScheme="dark"` at the root — activates dark semantic tokens across all UDS components. **Do not** use `ThemeInverter` in decorative mode; the whole page is dark.

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
- Left column (60%): dark background, bar headline + BarGroup + CTA (`KitButton`) + optional stat row
- Right column (40%): image panel floating with shadow

The CTA row is kit buttons with short real labels — never a drawn button-shaped div:

```tsx
import { KitButton } from './kit';

<div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 64, alignItems: 'center', padding: '80px 64px' }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <Bar w="80px" h={7} op={0.18} />
    <Bar w="65%" h={20} op={0.30} />
    <Bar w="50%" h={15} op={0.25} />
    <BarGroup lines={3} />
    {/* CTA row */}
    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
      <KitButton label={texts.cta ?? ''} />
      <KitButton label={texts.secondaryCta ?? ''} variant="secondary" />
    </div>
  </div>
  <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.10)' }}>
    <img src={imageSrc} alt="" style={{ width: '100%', display: 'block' }} />
  </div>
</div>
```
