---
name: ionos-wireframe-product-frame
description: Rules for IONOS product frame compositions — product UI wireframe structure, icon imports (brandmark + system), background-driven contrast, and feature pop-out placement.
metadata:
  tags: ionos, wireframe, product-frame, icon, contrast, pop-out, decorative
---

# IONOS Product Frame — Wireframe Rules

## Composition Rule — One Frame, One Highlight

**Every IONOS product animation has exactly two primary elements:**
1. **One main product frame** — the IONOS editor/app UI
2. **One floating highlight card** — the AI feature moment, always a sibling of the frame (never inside it)

Secondary floating elements (tool chips, stat pills) are allowed as decoration but must be less prominent and also live outside the frame.

## IONOS Product Frame — Color System (Figma node 65:606)

The product shell and the client-app zone are two visually distinct layers. Never mix their colors.

### Product shell (IONOS editor/app)

| Zone | Background | Icon / text color |
|---|---|---|
| Outer frame | `linear-gradient(180deg, #011B43, #0E1A2D)` | — |
| Left tool sidebar | `linear-gradient(180deg, #011B43, #1A3475)` | white `rgba(255,255,255,0.8)` |
| Right properties panel | `linear-gradient(180deg, #021C45, #1B3676)` | `#9DC2D9` for bars/data, white for labels |
| Active sidebar item | `rgba(255,255,255,0.12)` overlay on sidebar | white |
| Header action: "Publish" | `#1A91DE` (sky blue fill) | white |
| Header action: "Preview" | transparent + `border: 1px solid rgba(255,255,255,0.5)` | white |

**Decorative/abstract elements inside the product shell:**
- Icon buttons: white SVG icons, `opacity: 0.8` idle, `1.0` active
- Property panel rows: `background: rgba(63,94,135,0.6)`, bar fill `#9DC2D9`
- Analytics / stat indicators: `#9DC2D9` for values and bars
- All placeholder bars in the shell: `rgba(157,194,217,0.5)` — the steel-blue family, NOT white, NOT sky `#11C7E6`

### Client-app zone (the website being edited)

This is a completely separate inner panel with its own light theme — it MUST contrast with the dark shell:

```tsx
// Client app zone — visually isolated from the product shell
<div style={{
  background: '#F4F7FA',          // var(--surface-subtle) — light, distinct from dark shell
  borderRadius: 7,
  overflow: 'hidden',
  boxShadow: '2px 12px 26px rgba(0,0,0,0.22), 6px 48px 48px rgba(0,0,0,0.19)',
}}>
  {/* Website header — client's brand color (e.g. teal #436977 for car service) */}
  <div style={{ background: '#436977', height: 44, /* nav bar */ }} />
  {/* Hero: real catalog image, object-fit cover */}
  <Img src={staticFile(`${imageSlug}.png`)} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
  {/* Headline — real text, 24–36px Overpass or brand font */}
  {/* Content rows — Bars in #BCC8D4 (cool-grey-300) */}
</div>
```

**Text placeholder bars in the client app**: `#BCC8D4` (cool-grey-300), NOT white or dark.
**AI selection target inside client app**: `border: 2px dashed #8212C2` — matches the floating highlight card.

## Product Frame — Content Detail Rules

Always include these realistic anchors (scale with frame size):
- **Catalog image asset** — pick from available assets via `staticFile()`; place in hero
- **Big hero heading** — 24–40px, real contextual text (brand name, tagline)
- **Product logo** — IONOS logo in shell header; client logo in client-app header
- **Size-dependent detail**:
  - Large frame (>900px wide): left sidebar + hero + content grid + right properties panel
  - Medium (500–900px): left sidebar + hero + 1–2 content rows, no right panel
  - Small (<500px): hero only, minimal nav

```
┌─ IONOS Product Shell (dark: #011B43 → #0E1A2D) ───────────────────┐
│ [sidebar: #011B43→#1A3475]  [CLIENT APP: #F4F7FA]  [panel: #021C45]│
│  W logo                     ┌─────────────────┐    [#9DC2D9 bars]  │
│  ──────────────             │ [client header]  │    [dropdowns]     │
│  icon  ←white               │ [hero image]     │    [analytics]     │
│  icon                       │ "Brand Heading"  │                    │
│  icon (active strip)        │ [Bar #BCC8D4]    │                    │
│  icon                       │ [Bar #BCC8D4]    │                    │
└──────────────────────────── └─────────────────┘ ───────────────────┘
```

## IONOS Brandmark Import

Import the `svgData` named export from the sub-path export — **always without `dist/`**:

```tsx
// Panel is white/light (0.88+ opacity) → ionos-light (blue #003d8f, readable on white)
import { svgData as ionosLogoSvg } from '@ionos-web-design-system/icon/brandmark/ionos-light';
// Panel is dark/glass → ionos-dark (white fills, readable on dark)
import { svgData as ionosLogoSvg } from '@ionos-web-design-system/icon/brandmark/ionos-dark';

// Use directly as backgroundImage — svgData is a base64 data URI constant:
<div style={{
  backgroundImage: `url(${ionosLogoSvg})`,
  width: 80, height: 24,
  backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
}} />
```

**Anti-pattern — NEVER do this (webpack will fail, `@ts-ignore` does not fix it):**
```tsx
// ❌ dist/ path is NOT in the package exports map:
import { svgData as ionosDarkSvg } from '@ionos-web-design-system/icon/dist/brandmark/ionos-dark';
// ❌ @ts-ignore suppresses TypeScript errors but webpack still cannot resolve the module:
// @ts-ignore
import { svgData as iconSvg } from '@ionos-web-design-system/icon/dist/system/star';
```
If TypeScript reports an error on an icon import, the **path is wrong** — fix the path, do not add `@ts-ignore`.

**Available brandmark variants for IONOS:**

| Import name | Fills | Use in |
|---|---|---|
| `ionos-dark` | White only (`#fff`) | Nav bar on dark screen (default for decorative) |
| `ionos-light` | Blue (#003d8f) + white | Nav bar on light surface / inverted white panel |
| `ionos-mono-dark` | White mono | Minimal / monochrome nav on dark backgrounds |
| `ionos-cloud-dark` | White "IONOS Cloud" | Cloud product illustrations on dark backgrounds |

**`ionos-light` vs `ionos-dark` — the naming is counterintuitive:**
- `ionos-light` has blue fills → readable on **light/white** backgrounds
- `ionos-dark` has white fills → readable on **dark** backgrounds

## AI Icon Usage Guidelines

All 6 IONOS AI icons use **ai-primary gradient fill** (`linear-gradient(45deg, #095BB1, #D746F5)`).
Apply via `background: AI_GRADIENT` + `maskImage` — NOT `backgroundColor` (which gives solid color only).

```tsx
// Gradient-filled AI icon pattern:
<div style={{
  width: 24, height: 24, flexShrink: 0,
  background: 'linear-gradient(45deg, #095BB1, #D746F5)',
  maskImage: `url(${writeSvg})`, WebkitMaskImage: `url(${writeSvg})`,
  maskSize: 'contain', maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat',
}} />
```

| Import name | Use for | Import path |
|---|---|---|
| `filled-sparkles` | **Primary / general AI** — any AI affordance, CTA badge | `icon/system/filled-sparkles` |
| `filled-generative-write` | Text generation, copywriting, AI writer | `icon/system/filled-generative-write` |
| `filled-generative-wand` | Non-text generation, image AI, advanced products | `icon/system/filled-generative-wand` |
| `filled-chat-ai` | AI chat, assistant, conversational products | `icon/system/filled-chat-ai` |
| `filled-envelope-ai` | Email generation, AI email products | `icon/system/filled-envelope-ai` |
| `filled-ai-phone` | AI receptionist, call / phone scenarios | **Not yet in package — use `filled-sparkles` as fallback** |

> `star`, `filled-star` are **not AI icons**. Never use them for AI affordances.

## System Icon Import (non-AI)

Import without `dist/` — sub-path export only. **Do not guess names — webpack will fail.**

**Status / feedback:**
`checkmark` · `filled-checkmark` · `circle-checkmark` · `filled-circle-checkmark` · `info` · `filled-info` · `warning` · `filled-warning` · `xmark`

**Loading / progress:**
`progress-activity` · `filled-progress-activity` · `hourglass` · `filled-hourglass` · `refresh` · `sync`

**Common wireframe:**
`bell` · `bell-ring` · `filled-bell` · `bolt` · `filled-bolt` · `cloud` · `filled-cloud` · `database` · `document` · `download` · `edit-square` · `gear` · `filled-gear` · `lightbulb` · `lightbulb-shining` · `lock` · `filled-lock` · `pen` · `performance` · `plus` · `search` · `server` · `filled-server` · `upload` · `user` · `user-avatar` · `filled-user` · `arrow-right` · `chevron-right`

**Rule:** If a name is not listed above, pick the closest match. Never guess.

## Contrast Rule (product frame context)

The product shell is dark; the client-app zone is light. Never mix their palettes:
- Shell icons / text: white (`rgba(255,255,255,0.8–1.0)`)
- Shell decorative bars: `#9DC2D9`
- Client-app text bars: `#BCC8D4`
- Floating pop-out / glass elements over dark: `rgba(255,255,255,0.85–0.96)` fill — keep alpha high or the dark shell bleeds through as grey

**Icon colour inside panels**: key on the container's own background, not the outer gradient.
`ionos-dark` brandmark (white fills) → on dark shell. `ionos-light` (blue fills) → inside the light client-app zone.

## Floating Highlight Card — Always Outside the Frame

The AI feature highlight is a **sibling of the product frame at the `AbsoluteFill` root**, never a child. This is a hard rule — the frame has `overflow: 'hidden'` so children cannot escape it.

**Shape spec (confirmed from Figma node 64:320):**
```tsx
// Floating highlight card — pill-shaped, dashed AI border
<div style={{
  position: 'absolute',
  borderRadius: 40,                          // large pill — NOT 16
  border: '3px dashed #8212C2',             // AI accent dashed border
  background: 'rgba(244, 247, 250, 0.96)',  // near-opaque light fill
  padding: '28px 24px 20px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
  zIndex: 100,
  // position: sibling of the frame, overlapping its right/bottom edge
}}>
  {/* text prompt or AI generation content + CTA button */}
</div>
```

**The highlight must:**
- Enter via animation (fly-in from outside the frame edge with spring overshoot)
- Scale ~1.02 at peak to draw the eye
- Pop slightly outside the video canvas edge if needed — the `AbsoluteFill` clips it and that's intentional

**Secondary floating elements (nice-to-have):**
- Tool palettes, stat chips, notification pills — also outside the frame
- Less prominent: smaller, lower opacity, shorter animation
- Stagger their arrival after the main highlight: +10–15 frames delay

```tsx
<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
  {/* 1 — product frame */}
  <div style={{ width: 1040, height: 620, overflow: 'hidden', borderRadius: 12, position: 'relative' }}>
    {/* product UI — catalog image + hero heading + sidebar + BarGroups */}
  </div>
  {/* 2 — floating highlight card (sibling, NOT child) */}
  <div style={{ position: 'absolute', right: 80, top: 180, zIndex: 100,
                borderRadius: 40, border: '3px dashed #8212C2',
                background: 'rgba(244,247,250,0.96)',
                transform: `translateX(${highlightX}px) scale(${highlightScale})` }}>
    {/* AI content + CTA */}
  </div>
  {/* 3 — optional secondary element (tool palette, pill) */}
  <div style={{ position: 'absolute', bottom: 80, left: 120, zIndex: 90, opacity: 0.7 }}>
    {/* smaller, less prominent */}
  </div>
</AbsoluteFill>
```

**Motion — vivid, spring-like:**
- Fly in from the frame edge with overshoot + scale ~0.85→1 (bold travel: 60–120px)
- Add parallax: pop-out travels more than the frame

**Pacing — short compositions (~90 frames / 3s):**
- Pick ONE hero beat; give it a ≥20-frame eased entrance then HOLD
- Don't cram 4–5 micro-beats — it reads too fast
- Prefer soft springs (`damping: 18–22`) over snappy ones (`damping: 10–12`)

## Product Frame — Animated Overflow

The main product frame itself can be animated and **partially moved outside the video canvas** to create a more dynamic, cinematic feel. The `AbsoluteFill` clips at the canvas boundary, so anything translated beyond 0/width/0/height is cropped — use this intentionally.

```tsx
import { useCurrentFrame, interpolate, spring } from 'remotion';

// Frame enters from below/side and settles into position, then drifts slightly off-canvas
const frameY  = interpolate(frame, [0, 20], [80, 0], { extrapolateRight: 'clamp',
                  easing: Easing.bezier(0.16, 1, 0.3, 1) });

// After the hero beat, frame slowly drifts upward — top edge exits canvas
const frameDrift = interpolate(frame, [60, 90], [0, -60], { extrapolateLeft: 'clamp',
                     extrapolateRight: 'clamp' });

<AbsoluteFill style={{ overflow: 'hidden' }}>       {/* canvas clips here */}
  <div style={{
    position: 'absolute',
    top: '50%', left: '50%',
    transform: `translate(-50%, calc(-50% + ${frameY + frameDrift}px))`,
    width: 1040, height: 640,
    overflow: 'hidden', borderRadius: 12,
  }}>
    {/* product UI — may drift partially outside canvas */}
  </div>
</AbsoluteFill>
```

**Rules for frame overflow animation:**
- Enter from outside then settle — don't start the frame off-canvas if there's no intro motion
- Drift speed should be slow (3–5px/frame max) so it reads as a deliberate cinematic pan, not jitter
- Partial crop is intentional — it signals depth and makes the product feel larger than the canvas
- The pop-out highlight (AI callout) moves WITH the frame — keep it as a sibling at the same translate level so they drift together

## Frame Layout Rules

- IONOS logo: always the real SVG brandmark (`ionos-dark` variant on dark shell), never a placeholder bar
- Client app image: always use `<Img src={staticFile(imageSlug + '.png')}>` from the asset catalog
- Never use sky `#11C7E6` in the product shell — that is a CTA colour; use `#9DC2D9` for shell decorative elements
- AI feature affordances: see `uds-style-guide/ionos-ai-features` for gradient button, generating surface, and animation rules
