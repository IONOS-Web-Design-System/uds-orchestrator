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
**AI selection target inside client app**: `border: 2px dashed #8212C2` — the text-selection marquee ONLY. The floating highlight card itself has NO border; it uses a plain neutral drop shadow (no AI glow — the AI glow is on the CTA button only) (see "Floating Highlight Card" below).

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
// Floating highlight card — pill-shaped glass, NO border, plain neutral drop shadow
// (no AI glow — the AI glow is on the CTA button only). For the animated
// pulse see ionos-wireframe-ai-animations.md (AIFloatingHighlight).
<div style={{
  position: 'absolute',
  borderRadius: 40,                          // large pill — NOT 16
  background: 'var(--surface-subtle)',  /* opaque surface token; the 0.88 + backdrop-blur glass is ONLY for the AI generation area */
  padding: '28px 24px 20px',
  boxShadow: '0 16px 48px rgba(0,0,0,0.35)', // plain neutral drop shadow — no AI glow on the card
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
                borderRadius: 40,
                background: 'var(--surface-subtle)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
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
- **Drift the product frame ONLY — never the highlight card.** Sub-pixel drift on a card containing
  readable or typing text re-rasterizes glyphs every frame → typography shimmer/jitter. The product
  frame is image/bar content and tolerates sub-pixel motion; text does not. If frame and card must
  feel connected, drift the frame and keep the card static — the relative motion still reads as depth.
- **Card transforms must fully settle BEFORE typing starts.** Springs asymptote and never reach their
  rest value — snap to exactly `scale(1) translateX(0)` once visually settled (`raw > 0.995 ? 1 : raw`),
  or use `Easing.bezier(0.34, 1.56, 0.64, 1)` with clamp which terminates exactly. Sequence the beats:
  card entrance completes → THEN the typing beat begins. See remotion-best-practices
  "Text rendering stability" for the full rule.

## Frame Layout Rules

- IONOS logo: always the real SVG brandmark (`ionos-dark` variant on dark shell), never a placeholder bar
- Client app image: always use `<Img src={staticFile(imageSlug + '.png')}>` from the asset catalog
- Never use sky `#11C7E6` in the product shell — that is a CTA colour; use `#9DC2D9` for shell decorative elements
- AI feature affordances: see `uds-style-guide/ionos-ai-features` for gradient button, generating surface, and animation rules

---

## Constrained Viewport — Frame Cropping and Highlight Placement

When the canvas is **wide and short** (landscape marketing banner, 3:1 card) or the product frame is taller/wider than the available display area, do not squeeze or scale the frame to fit. Use these cropping patterns instead.

### 1 — Harmonized Side Margins

Center the product frame optically within the viewport. Leave equal breathing room on the left and right. Do not stretch the frame to fill horizontal space — unused canvas margin is intentional and gives the composition air.

```tsx
// ✅ Frame narrower than canvas — centered with equal side margins
<AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
  <div style={{
    width: 820,           // narrower than the 1280px canvas
    position: 'relative',
    overflow: 'hidden', borderRadius: 12,
  }}>
    {/* product UI */}
  </div>
</AbsoluteFill>
```

### 2 — Bottom Bleed (height-insufficient landscape canvas)

When the canvas is too short to show the full frame height, **let the frame's bottom extend beyond the viewport**. Never shrink the frame to fit — the crop signals depth ("there's more below") and makes the product feel real and full-size.

This pattern applies to **landscape/widescreen canvases** (e.g. 1280×720). For **square canvases** see Pattern 6.

**Pattern (Figma node 64:320 — WordPress editor, landscape):** Editor UI anchored near top of canvas; bottom ~30% is cropped. The AI highlight card appears inside the viewport near the bottom edge.

```tsx
// Landscape canvas — frame bleeds bottom, highlight sits right-of-center
<AbsoluteFill style={{ overflow: 'hidden' }}>
  <div style={{
    position: 'absolute',
    top: 32,
    left: '50%', transform: 'translateX(-50%)',
    width: 820,
    height: 580,   // taller than the ~380px visible area — bottom cropped
    overflow: 'hidden', borderRadius: 12,
  }}>
    {/* full product UI */}
  </div>

  {/* AI highlight — right of center (landscape only — see Pattern 6 for square) */}
  <div style={{
    position: 'absolute',
    right: 60, top: 120,
    zIndex: 100,
    borderRadius: 40,
    background: 'var(--surface-subtle)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
  }}>
    {/* AI prompt + CTA */}
  </div>

  {/* Optional secondary element near the cropped bottom edge */}
  <div style={{ position: 'absolute', bottom: 24, left: 200, zIndex: 90, opacity: 0.85 }}>
    {/* tool chip, palette, or stat pill */}
  </div>
</AbsoluteFill>
```

### 3 — Zoom-to-Highlight (multi-side bleed)

When the AI feature is an **inline editing action** (text selection, image resize, in-page generation), zoom the product frame so the AI interaction target sits in the **optical center** of the viewport. The frame will bleed on 2–3 sides — this is correct and intentional.

**Pattern (Figma node 77:203 — KI Text / text-select AI):** Website hero (background image + "URBAN BIKES" heading) scaled so the selected heading fills the viewport center. Frame bleeds right and bottom. AI panel (tone selector + CTA) appears in the left third of the viewport, also extending slightly past the left canvas edge.

```tsx
// Zoom-to-highlight: position frame so the AI interaction zone lands at canvas center
<AbsoluteFill style={{ overflow: 'hidden' }}>
  {/* Product frame — oversize, bleeds right + bottom */}
  <div style={{
    position: 'absolute',
    top: -60,    // bleeds above canvas
    left: 120,   // offset left to place interaction target at center
    width: 1400, // wider than canvas — bleeds right
    height: 680, // taller than canvas — bleeds bottom
    overflow: 'hidden',
  }}>
    {/* full product UI — AI interaction target (selected text, image region)
        should land near canvas optical center after offset */}
  </div>

  {/* AI panel — left side, opposite the frame bleed direction */}
  <div style={{
    position: 'absolute',
    left: -8,    // panel bleeds slightly past left canvas edge
    top: '50%', transform: 'translateY(-50%)',
    zIndex: 100,
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.97)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
    // contains tone tabs, option checkboxes, AI CTA button
  }}>
    {/* AI options panel */}
  </div>

  {/* AI badge — floating above the interaction target, also outside frame */}
  <div style={{
    position: 'absolute',
    // positioned over the selection target in the frame
    zIndex: 110,
    width: 72, height: 72, borderRadius: '50%',
    background: 'linear-gradient(45deg, #095BB1, #D746F5)', color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  }}>
    {/* sparkles icon + label */}
  </div>
</AbsoluteFill>
```

### 4 — AI Feature Always Escapes the Frame

In all three patterns above, the AI affordance (card, panel, badge) must break outside the product frame's boundary. It is never fully contained within the frame. The AI feature is always the **foreground subject** — the product frame is background context.

| AI feature type | Required placement |
|---|---|
| Prompt card (text input + CTA pill) | Sibling of frame; overlaps frame right/bottom edge; may extend past canvas edge |
| Inline badge (floating over text selection or image region) | Floats above the selection target in the viewport; outside frame or at its edge |
| Options panel (tone selector, checklist, settings) | Opposite side from the frame's primary bleed; may extend slightly past canvas edge |

> **Rule in one sentence:** The AI feature must break at least one boundary — the frame edge, the canvas edge, or both.

### 5 — Counterbalance Rule

Place the AI highlight on the **opposite side** from where the frame bleeds most heavily. This creates visual tension: the product recedes in one direction; the AI feature advances from the other.

| Canvas shape | Frame bleed direction | AI highlight position |
|---|---|---|
| Landscape | Bottom only (height-short) | Right of center, overlapping frame right edge |
| Landscape | Right + bottom (zoom-to-highlight) | Left of center, may extend slightly past left canvas edge |
| Landscape | Right only | Left of center |
| **Square** | **Right** (always for square) | **Left-anchored, ~8% from left edge — fully within canvas** |

> **Square canvas override:** For 1:1 canvases (w ≈ h), the product frame always bleeds right and the highlight is always left-anchored. See Pattern 6 for the exact layout.

### 6 — Square Canvas (1:1 ratio) — WordPress Builder AI Reference

**When `dimensions.w ≈ dimensions.h` (e.g. 480–530px square)**, use this layout. The spatial split is fundamentally different from landscape patterns: the product frame occupies the right portion of the canvas and bleeds right; the AI highlight card is left-anchored in the lower half and **must be fully visible — no right bleed**.

**Figma reference: node 93:200 (487×487, WordPress Builder AI):**
- Product frame: positioned at **~39% from left**, width **~116% of canvas** → bleeds ~16% beyond right edge; left+center portion of editor is what shows
- AI highlight card: **left: ~8% of canvas** (≈38–40px), **top: ~50% of canvas**, **width: ~65–66% of canvas** — entirely within bounds, right margin ≈ 26%

```tsx
// Square canvas (520×520) — WordPress Builder AI pattern
// W = width, H = height (equal for square)
const W = width;   // from useVideoConfig()
const H = height;

<AbsoluteFill style={{ overflow: 'hidden', background: /* gradient */ }}>

  {/* Product frame — right-of-center, bleeds beyond right canvas edge */}
  {/* Left portion (sidebar + left editor) is what the viewer sees */}
  <div style={{
    position: 'absolute',
    left: Math.round(W * 0.39),    // ≈202px @ 520px canvas
    top:  Math.round(H * 0.13),    // ≈68px
    width:  Math.round(W * 1.16),  // ≈603px — bleeds ~83px past right edge
    height: Math.round(H * 0.86),  // ≈447px
    overflow: 'hidden',
    borderRadius: 20,
    transform: `translateX(${frameEnterX}px)`,   // animate from right on entry
  }}>
    {/* IONOS editor: sidebar left, website-preview panel right */}
  </div>

  {/* AI highlight card — LEFT-anchored, FULLY contained in canvas */}
  {/* Anchor from BOTTOM not top — content grows upward so it never clips  */}
  {/* right edge = left + width = 40 + 338 = 378px < 520px ✓              */}
  <div style={{
    position: 'absolute',
    left:   Math.round(W * 0.077),  // ≈40px — clear left margin
    bottom: Math.round(H * 0.16),   // ≈83px from bottom — grows upward if content expands
    width:  Math.round(W * 0.65),   // ≈338px — 60–68% of canvas width
    borderRadius: 40,
    background: 'var(--surface-subtle)',
    padding: '28px 24px 20px',
    boxShadow: '10px 8px 15px rgba(0,0,0,0.21), 46px 34px 28px rgba(0,0,0,0.18)',
    zIndex: 100,
    transform: `translateY(${cardEnterY}px) scale(${cardScale})`,
  }}>
    {/* AI prompt text (headline prop) + CTA button ("Seite erstellen" / market equivalent) */}
  </div>

</AbsoluteFill>
```

**Square canvas hard rules:**

| Rule | Value |
|---|---|
| Product frame `left` | `canvas_width × 0.37–0.41` |
| Product frame `width` | `canvas_width × 1.13–1.18` (always wider than canvas) |
| Highlight card `left` | `canvas_width × 0.07–0.09` (≈30–45px) |
| Highlight card `width` | `canvas_width × 0.62–0.68` |
| Highlight card right edge | **Must be ≥ 60px from canvas right edge** — never bleeds right |
| Highlight card **`bottom`** | `canvas_height × 0.14–0.18` (≈60–90px from bottom) — **use `bottom`, never `top`** |
| Highlight card right bleed | **FORBIDDEN** — card must be fully readable |

**❌ Common mistakes on square canvas:**

```tsx
// ❌ WRONG — `top` anchor clips card when content is longer than expected
// (card grows downward and exits the canvas bottom edge)
top: Math.round(H * 0.50)
// ✅ CORRECT — use `bottom` so the card always grows upward into safe space
bottom: Math.round(H * 0.16)

// ❌ WRONG — centering the product frame leaves no room to bleed right
// and forces the highlight to compete for center space
left: '50%', transform: 'translateX(-50%)'

// ❌ WRONG — right-anchoring the highlight (landscape pattern, not square)
// cuts card content against the right edge on narrow canvases
right: 60, top: 120

// ❌ WRONG — card width too narrow; text wraps awkwardly on square canvas
width: 200   // use canvas_width × 0.62 minimum
```

**Animation guidance for square canvas:**
- Product frame: enters from the **right** (`translateX` from +60–80px → 0), settles with spring
- Highlight card: bottom-anchored, enters from **below** (`translateY` from +50–70px → 0) with slight scale (0.92 → 1.0), arrives ~10–15 frames after the frame. Because the card uses `bottom` positioning, a positive `translateY` offset pushes it downward off-screen — interpolate toward 0 for the entry.
- **Card entrance must terminate exactly** at `translateY(0) scale(1)` before any typing/text beat starts. Use `Easing.bezier(0.34, 1.56, 0.64, 1)` with clamp (terminates exactly), or snap the spring: `raw > 0.995 ? 1 : raw`. An unsettled spring keeps the text re-rasterizing → shimmer.
- After both elements settle, **the frame only** may drift very slowly right (~1–2px/frame) to reinforce depth — never the highlight card (text shimmers under sub-pixel drift; the frame's image content does not)
