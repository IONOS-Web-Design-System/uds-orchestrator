---
styles: [floating-card]
---

## Style: floating image card with intersecting highlights

The generated image is the hero, presented as a single dominant rounded card (~60–80% of the
canvas) on a `var(--surface-subtlest)` root — NOT a full-bleed backdrop. The product feature is
conveyed by **2–3 small elements that FLOAT and INTERSECT** the card:

- they overlap the card's **edges/corners** AND/OR rest **ON the image** over its quiet regions —
  e.g. an AI/feature badge on a corner, a labelled chip (icon + 1–3 words) on an edge, a compact
  brand-blue icon pill (2–3 glyphs) on the image, and optionally a small info panel (tag chips +
  panel label + AI CTA) intersecting one edge;
- each floating element carries a **large, prominent neutral drop shadow** (e.g.
  `0 16px 40px rgba(0,0,0,0.22)`) so it reads as clearly **elevated above the card** — a shadow,
  **never an AI glow** (the only AI glow is on the AI CTA);
- card + chip chrome use `var(--surface-subtle)` (no AI glow); a chip may instead be a solid
  brand-blue pill. The AI gradient is for the AI CTA/badge only.

No connector lines and no selection marquee — the elements simply float over and intersect the
card and each other. Reference frames: Figma `82:202` (info panel + KI badge + tags + AI CTA) and
`162:306` (edge chip + a brand-blue icon pill resting on the image).

