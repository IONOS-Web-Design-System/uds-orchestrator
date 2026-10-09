---
styles: [plain, reconstruct, composite, opaque-embed]
wide: true
---

# Wide-format illustrations — centre the focus, leave the sides empty

**When this applies:** the canvas is an extended landscape — **width ÷ height ≥ 2.2**
(e.g. 1344×487, 1600×600, 970×250). Below that ratio, ignore this rule and use the standard
composition guidance. If the canvas is *also* under 512px on **both** axes, `small-format.md`
governs instead — that rule wins, because at that size there is no width to spare for empty
side margins.

This rule does **not** apply to a `bare-interface` (screen-content) render — that leg is
full-bleed by definition (the UI fills the entire frame before being placed onto a device
screen), so the `styles:` scope above excludes it. Where this rule DOES apply alongside
`embed-interface-asset.md`, the centred-band figure here **governs**: on a wide canvas the
interface occupies the middle **50–65% of the width**, not the 70–85% that rule states for
ordinary aspect ratios.

A wide canvas is **not** an invitation to spread out. Widening a composition to reach both
edges produces stretched panels, padded gaps, and invented filler cards. Treat the canvas as a
**crop of a taller scene**: put the subject in the middle and let the sides be background.

## Centred focus band

- Place the composition in a **centred focus band — roughly the middle 50–65% of the width**.
- The **side margins carry the canvas background ONLY**: no content, no decorative filler, no
  panel stretched to reach an edge, no second cluster of cards.
- "Empty" means **no content**, not transparent. The background is still painted per the
  standard Background rule (`var(--surface-subtlest, #DBEDF8)`, or the AI-showroom gradient
  when this render's non-negotiables carry a `CANVAS BACKGROUND:` line).
- Do **not** widen, stretch, or pad the composition to fill the canvas, and do **not** add
  extra cards / panels / segments to occupy the sides. Prefer **fewer elements at a legible
  scale** over more elements spread thin.

## Bleed vertically, not horizontally

The focus block may run **off the bottom** (and/or top) edge — that is the intended way to give
a tall subject room on a short canvas. Set `overflow: 'hidden'` on the root `AbsoluteFill` so
the bleed clips to a clean edge, UNLESS this is a `product-pop-out` composite, where the root
must stay unclipped (see `product-pop-out/composition.md`).

Do not bleed horizontally to justify a full-width layout — that reintroduces exactly the
spread-out composition this rule exists to prevent.

## Edge-straddling accents may reach into a margin

One or two **floating accents** — a card, chip, pill, or circular badge — may straddle the
focus block's edge and extend into the side margin. That is how the margin is allowed to be
used: as breathing room an accent overlaps, never as a region that gets its own content.

Keep them accents: they annotate the focus block and must not out-size it, and two is the
ceiling. Follow the text-stability rule — no perpetual transform on a text-bearing accent.

## Inline imagery stays inside its frame

A photo or media asset belongs to the frame that contains it (a website preview's hero slot, a
media card inside the product view). It does **not** become the canvas backdrop and does not
extend into the side margins.

## The side-shift exception

Anchor the focus block to one side **only** when the request explicitly asks for a
side-weighted composition — for example copy reserved on one side, or a named
`negativeSpaceSide` of `left`/`right`. Then:

- anchor the block to the named side, and
- keep the **other** side empty as background.

Never spread across the full width in either case. Absent an explicit instruction, centre it.

## Reference

Figma `StkUOHcGRMDXOZWT0E2nft` node `64-320` ("Wordpress Productview 23"), 1344×487 (2.76:1):
a flat deep-blue canvas; the editor UI sits in the middle ~57% of the width (left margin ~24%,
right margin ~19%) and bleeds off the **bottom** edge; a photo sits inline inside the website
preview; a single AI-gradient prompt card overlaps the UI block's right edge and reaches into
the right margin. That is the default composition this rule describes — not the exception.
