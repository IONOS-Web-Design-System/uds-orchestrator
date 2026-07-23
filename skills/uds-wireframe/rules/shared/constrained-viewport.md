# Constrained Viewport — Frame Cropping and Highlight Placement

When the canvas is **wide and short** (landscape marketing banner, 3:1 card) or the product frame is taller/wider than the available display area, do not squeeze or scale the frame to fit. Use these cropping patterns instead.

## 1 — Harmonized Side Margins

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

## 2 — Bottom Bleed (height-insufficient landscape canvas)

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

## 3 — Zoom-to-Highlight (multi-side bleed)

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
    background: 'var(--surface-subtle)',
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
    background: 'linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))', color: '#fff',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  }}>
    {/* sparkles icon + label */}
  </div>
</AbsoluteFill>
```

## 4 — AI Feature Always Escapes the Frame

In all three patterns above, the AI affordance (card, panel, badge) must break outside the product frame's boundary. It is never fully contained within the frame. The AI feature is always the **foreground subject** — the product frame is background context.

| AI feature type | Required placement |
|---|---|
| Prompt card (text input + CTA pill) | Sibling of frame; overlaps frame right/bottom edge; may extend past canvas edge |
| Inline badge (floating over text selection or image region) | Floats above the selection target in the viewport; outside frame or at its edge |
| Options panel (tone selector, checklist, settings) | Opposite side from the frame's primary bleed; may extend slightly past canvas edge |

> **Rule in one sentence:** The AI feature must break at least one boundary — the frame edge, the canvas edge, or both.

## 5 — Counterbalance Rule

Place the AI highlight on the **opposite side** from where the frame bleeds most heavily. This creates visual tension: the product recedes in one direction; the AI feature advances from the other.

| Canvas shape | Frame bleed direction | AI highlight position |
|---|---|---|
| Landscape | Bottom only (height-short) | Right of center, overlapping frame right edge |
| Landscape | Right + bottom (zoom-to-highlight) | Left of center, may extend slightly past left canvas edge |
| Landscape | Right only | Left of center |
| **Square** | **Right** (always for square) | **Left-anchored, ~8% from left edge — fully within canvas** |

> **Square canvas override:** For 1:1 canvases (w ≈ h), the product frame always bleeds right and the highlight is always left-anchored. See Pattern 6 for the exact layout.

## 6 — Square Canvas (1:1 ratio) — WordPress Builder AI Reference

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
