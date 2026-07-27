---
styles: [product-pop-out]
---

## Style: product-pop-out — layers 1-2, the root and interface (plus the closing rule and Still gate)

Layer 3 (the character hero) is in `product-pop-out/character.md`; layers 4-5 (optional
highlight, AI styling) are in `product-pop-out/highlight-and-ai.md`.

Story: the product feature IS the builder/editor interface, and a character's hero portrait
pops out above it — the composite is meant to sit over any host background (marketing page,
dark hero section, image), never its own opaque frame.

The contract carries a fixed `layout` scaffold — canvas-fraction rects `{x,y,w,h}` for each
region (`layout.interface`, `layout.character`, `layout.faceSafe`, `layout.highlight`). HONOUR
these region rects: they are not suggestions to improvise around, they are the placement
contract.

Layer order:

1. **Root** — `<AbsoluteFill>` background: **TRANSPARENT** (no opaque fill). **Never set
   `overflow:'hidden'` on this root or any ancestor** — unlike `frame-anatomy.md`'s clipping
   example, the character (layer 3) extends past the root's edges by design, and the HARD
   character-img gate rejects any clipping ancestor. If the contract
   carries a `SAFE AREA:` line, reserve that transparent blank margin on the right/bottom and
   keep all elements inside the remaining content box; anything popping past an edge extends
   past the TOP edge only, never the reserved right/bottom margin. ONE EXCEPTION: the
   character cutout (layer 3, see `product-pop-out/character.md`) is sized by its own native
   aspect and MAY extend past the reserved right/bottom margin — never shrink, squeeze or clip
   it to fit the margin.
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
   face-safe box, `layout.character`'s lower zone is NOT off-limits: cards and interface
   chrome MAY extend over the character's lower body there — the character's lower body tucks BEHIND
   those cards, hiding the cutout's bottom edge (see `product-pop-out/character.md`).

No detached floating elements, no connector lines — the character reads as physically part of
the same composition as the interface, never a separate collage layer. Everything around the
interface and character stays transparent.

**Still gate**: frame 0 shows the interface fully laid out as the opaque base (never
transparent), the character already GROUNDED at the interface's bottom edge with its head
clear of the interface's top edge, rendered at its NATIVE ASPECT (not stretched or squeezed)
and with NO straight-edge cut through its body, head or arms — its lower body already tucked
behind the interface's cards (cutout bottom edge hidden, no hard crop line) — and the
`layout.faceSafe` region fully unoccluded, and (if present) the highlight bubble already
settled bottom-left, outside the interface's left edge.
