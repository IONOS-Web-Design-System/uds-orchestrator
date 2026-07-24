---
styles: [product-pop-out]
---

## Style: product-pop-out

Story: the product feature IS the builder/editor interface, and a character's hero portrait
pops out above it — the composite is meant to sit over any host background (marketing page,
dark hero section, image), never its own opaque frame.

The contract carries a fixed `layout` scaffold — canvas-fraction rects `{x,y,w,h}` for each
region (`layout.interface`, `layout.character`, `layout.faceSafe`, `layout.highlight`). HONOUR
these region rects: they are not suggestions to improvise around, they are the placement
contract.

Layer order:

1. **Root** — `<AbsoluteFill>` background: **TRANSPARENT** (no opaque fill). If the contract
   carries a `SAFE AREA:` line, reserve that transparent blank margin on the right/bottom and
   keep all elements inside the remaining content box; anything popping past an edge extends
   past the TOP edge only, never the reserved right/bottom margin.
2. **Interface** — a UDS-component wireframe of the brand's builder/editor: a top bar (e.g.
   a Publish action), a left checklist, and a website canvas. Build it per the standard
   wireframe composition rules (`ionos/composition.md`, `ionos/product-frame-color.md`,
   `shared/frame-anatomy.md`).
   Use `staticFile()` for any in-product hero/media slot the supplied catalog image belongs
   in — **never a generated image** in that slot.

   The interface fills `layout.interface` (e.g. `{x:0.05,y:0.13,w:0.67,h:0.67}`) and is the
   DOMINANT layer: it carries the OPAQUE base plate (per `frame-anatomy.md`'s opaque-base-plate
   rule — the outer container gets a hardcoded opaque fill, `var(--surface-base, #FFFFFF)` with
   a hardcoded hex fallback; this is a transparent-root composite, so the frame itself must
   never resolve to transparent). Lay all functional content — nav, headings, controls, cards —
   AROUND the character hero region: the `layout.faceSafe` box (upper body + face) is
   off-limits to interface content — nothing from the interface encroaches there. BELOW the
   face-safe box, `layout.character`'s lower zone is NOT off-limits: product-view cards MAY
   extend into and overlap the character's lower body there, tucking behind it to hide the
   cutout's bottom edge (see the Character hero layer, next).
3. **Character hero** — the supplied cutout as `staticFile('<slug>.<format>')`, a SINGLE
   INTACT portrait figure placed at `layout.character` (e.g. `{x:0.46,y:0.02,w:0.25,h:0.78}`).

   The character is GROUNDED: its bottom sits ON the product frame's BOTTOM edge, and it is
   scaled LARGE so the head clears the interface's TOP edge (above `layout.interface`'s y) — a
   tall, dominant hero figure, NOT a small floating waist-up figure. Use the supplied cutout
   metrics to size and place it within the `layout.character` zone: `cutout.headTopFrac` gives
   the fraction down the cutout where the head begins — the character must be sized/positioned
   so the head clears the interface's top edge at that fraction; `cutout.subjectHeightFrac` gives
   how tall the subject is within the cutout, for scaling the figure to fill the zone
   top-to-bottom, grounded at the bottom edge.

   This layer's head/upper body is **z-order IN FRONT of the interface**: the `layout.faceSafe`
   box (e.g. `{x:0.46,y:0.02,w:0.25,h:0.34}` — upper body + face) is NEVER occluded by any
   element, at any frame — no card, no chrome, ever crosses it. BELOW the face-safe box, though,
   the character's LOWER torso tucks BEHIND the interface's card stack: product-view cards and
   interface chrome MAY — and SHOULD — overlap the character's lower body there, so the cutout's
   bottom edge is HIDDEN behind interface content rather than showing a hard crop line (matching
   Figma 269:527). The character is hero MEDIA, not a full-canvas standalone, and is never
   detached or floating apart from the interface.
4. **Optional highlight** — if the contract supplies highlight text, a floating prompt bubble at
   `layout.highlight` (e.g. `{x:0.0,y:0.62,w:0.42,h:0.16}`, `side:'bottom-left'`,
   `popOutside:'left'`): anchored bottom-left, popping outside the interface's LEFT edge —
   never on top of the frame center, never over the character or its face-safe box. Chrome
   follows the Floating Highlight Card template (see `shared/floating-card.md` for the surface
   rule): borderless, plain neutral shadow — no AI glow on the chrome itself.
5. **AI styling (when this is an AI feature)** — the brand AI gradient on the CTA/Publish
   action and the prompt bubble, a soft AI glow on the highlight only, and a filled-sparkles
   icon. Not an AI feature → standard brand blue/sky, no AI gradient or glow anywhere.

No detached floating elements, no connector lines — the character reads as physically part of
the same composition as the interface, never a separate collage layer. Everything around the
interface and character stays transparent.

**Still gate**: frame 0 shows the interface fully laid out as the opaque base (never
transparent), the character already GROUNDED at the interface's bottom edge and scaled as the
large dominant hero — its head clear of the interface's top edge, its lower body already tucked
behind the interface's cards (cutout bottom edge hidden, no hard crop line) — and the
`layout.faceSafe` region fully unoccluded, and (if present) the highlight bubble already settled
bottom-left, outside the interface's left edge.

