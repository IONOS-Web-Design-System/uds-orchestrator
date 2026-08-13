---
styles: [inline-asset]
---

## Style: inline-asset

Story: the composition wants a photo INSIDE it — a media slot in a card, a hero thumbnail in a
panel, the picture in an article/product row — and no catalog asset fit, so one was generated for
exactly that slot. There is no geometry contract for this style (unlike `product-pop-out` /
`device-mockup`): placement is yours to choose, within the rule below.

This is a **normal wireframe composition** — build it per the standard rules and do not re-invent
them here (`ionos/composition.md`, `shared/frame-anatomy.md`).

What THIS rule adds:

1. **The illustration owns the canvas and paints its own background** — the standard Background
   rule (`var(--surface-subtlest, #DBEDF8)`, or the AI-showroom gradient when this render's
   non-negotiables carry a `CANVAS BACKGROUND:` line). The image is never that background: it
   is NEVER full-bleed and NEVER the canvas backdrop (that is `background-full`'s job, not
   this style's).
2. **The image is a contained media/hero asset INSIDE the interface, panel or card** the brief
   describes — a thumbnail in a list row, a hero image inside a product card, a media slot in a
   panel. Size it as that contained slot, not as a dominant card in its own right (a large,
   ~60-80%-of-canvas image-as-hero-card is `floating-card`'s job, not this one).
3. **Reference it via `staticFile('<slug>.<format>')` on an `<Img>`**, `objectFit: 'cover'` inside
   its slot, corners matching the surrounding card/panel.

