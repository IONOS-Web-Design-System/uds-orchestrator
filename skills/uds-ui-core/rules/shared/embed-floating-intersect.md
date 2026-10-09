---
styles: [floating-card]
---

## Style: floating image card with intersecting highlights

The generated image is the hero, presented as a single dominant rounded card (~60–80% of the
canvas) on a `var(--surface-subtlest, #DBEDF8)` root (or the CANVAS BACKGROUND gradient when this
render's non-negotiables name one) — NOT a full-bleed backdrop. The product feature is
conveyed by **2–3 small elements that FLOAT and INTERSECT** the card:

- they overlap the card's **edges/corners** AND/OR rest **ON the image** over its quiet regions —
  e.g. an AI mark (`KitIconButton ai`) on a corner, a labelled chip (`KitPill`, 1–3 words) on an
  edge, a compact strip of 2–3 `KitIconButton`s on the image, and optionally a small info panel
  (`KitBadge` tags + `KitText` panel label + AI `KitButton concept="ai"`) intersecting one edge.
  Each kit element sits in a positioned parent `div` that carries its animation and its shadow
  as `filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.22))'` (it follows the component's own
  shape; a `boxShadow` on a square parent would draw a rectangle around a rounded chip);
- each floating element carries a **large, prominent neutral drop shadow** (e.g.
  `0 16px 40px rgba(0,0,0,0.22)`) so it reads as clearly **elevated above the card** — a shadow,
  **never an AI glow** (the only AI glow is on the AI CTA);
- the image card and the info panel use `var(--surface-subtle)` (no AI glow); chips, tags and
  icon actions are kit components and take their colours from the tokens. The AI concept is for
  the kit AI CTA / AI icon action only.

No connector lines and no selection marquee — the elements simply float over and intersect the
card and each other. Reference frames: Figma `82:202` (info panel + KI badge + tags + AI CTA) and
`162:306` (edge chip + a brand-blue icon pill resting on the image).

