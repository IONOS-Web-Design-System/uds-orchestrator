---
styles: [product-pop-out]
---

## Style: product-pop-out

Story: the product feature IS the builder/editor interface, and a character's hero portrait
pops out above it — the composite is meant to sit over any host background (marketing page,
dark hero section, image), never its own opaque frame.

Layer order:

1. **Root** — `<AbsoluteFill>` background: **TRANSPARENT** (no opaque fill). If the contract
   carries a `SAFE AREA:` line, reserve that transparent blank margin on the right/bottom and
   keep all elements inside the remaining content box; anything popping past an edge extends
   past the TOP edge only, never the reserved right/bottom margin.
2. **Product view** — a UDS-component wireframe of the brand's builder/editor: a top bar (e.g.
   a Publish action), a left checklist, and a website canvas. Build it per the standard
   wireframe composition rules (`ionos/composition.md`, `ionos/product-frame-color.md`,
   `shared/frame-anatomy.md`).
   Use `staticFile()` for any in-product hero/media slot the supplied catalog image belongs
   in — **never a generated image** in that slot. The interface is the DOMINANT full-frame
   base, laid out across (roughly) the full canvas.
3. **Character hero** — the supplied cutout as `staticFile('<slug>.<format>')`, a SINGLE
   INTACT portrait figure embedded within a **dedicated hero region on one side** (typically
   the right). The interface reserves this region and lays its own content AROUND it — never
   over the character's face, nav, or sidebar. The character is hero MEDIA, not a full-canvas
   standalone: the head and shoulders POP OUT above the interface's top edge; UI cards may
   overlap the lower body (a MID layer, never the topmost z-index). The character is never
   detached or floating apart from the interface.

   Use the supplied cutout metrics to size and place it: `cutout.headTopFrac` gives the
   fraction down the cutout where the head begins — the character must be sized/positioned so
   the head clears the interface's top edge at that fraction; `cutout.subjectHeightFrac`
   gives how tall the subject is within the cutout, for scaling the figure to the hero region.
4. **Optional highlight** — if the contract supplies one, a floating prompt bubble at the
   TOP z-index, popping out beyond the frame edge (partially outside the interface), stating
   the highlight text. Chrome follows the Floating Highlight Card template (see
   `shared/floating-card.md` for the surface rule): borderless, plain neutral shadow — no AI
   glow on the chrome itself.
5. **AI styling (when this is an AI feature)** — the brand AI gradient on the CTA/Publish
   action and the prompt bubble, a soft AI glow on the highlight only, and a filled-sparkles
   icon. Not an AI feature → standard brand blue/sky, no AI gradient or glow anywhere.

No detached floating elements, no connector lines — the character reads as physically part of
the same composition as the interface, never a separate collage layer. Everything around the
product view and character stays transparent.

**Still gate**: frame 0 shows the interface fully laid out, the character's head already
clear of the interface's top edge, and (if present) the highlight bubble already settled.

