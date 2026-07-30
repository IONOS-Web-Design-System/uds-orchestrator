---
styles: [product-pop-out]
---

## Style: product-pop-out — layer 6, the brand badges

Layers 1-2 (root, interface) are in `product-pop-out/composition.md`; layer 3 (character) in
`product-pop-out/character.md`; layers 4-5 (highlight, AI styling) in
`product-pop-out/highlight-and-ai.md`.

6. **Brand badges** — present ONLY when the contract's `layout.badges` array carries them.
   Never invent a badge, never add a second copy of one, and never place one that the
   contract did not supply.

   Both badges are FIXED-SIZE brand artifacts. Their rects are computed upstream from the
   Figma component's own aspect ratio. There is NO `layout` prop at runtime to read them
   from — the generated component's `VariantSchema` (`template/remotion-starter/src/
   schema.ts`) has no `layout` field, and that file is PROTECTED (never overwritten), so one
   can never be added. `layout.badges[...]` / `L.badges[...]` is not merely a bad idiom, it is
   a bug: it renders as `NaN%`. TRANSCRIBE the contract's four numbers for each badge as
   literal inline percentages instead — this is the ONLY idiom that can work, and the
   badge-img gate verifies each one numerically against the contract rect. Each badge's root
   element carries `data-badge="<id>"`.

   **`unlimited`** — the supplied PNG, at its rect, in front of the interface. The contract
   gives the exact numbers for THIS render; transcribe them literally (below, `32.8%`,
   `-8.35%`, `88.35%` are illustrative placeholders for whatever numbers the contract actually
   supplies — do not copy them verbatim):

   ```tsx
   <Img
     data-badge="unlimited"
     src={staticFile('unlimited-badge.png')}
     style={{
       position: 'absolute',
       left: '32.8%',           // the contract's x × 100, as a literal — NOT `${B.x * 100}%`
       top: '-8.35%',           // the contract's y × 100, as a literal
       height: '88.35%',        // the contract's h × 100, as a literal
       width: 'auto',           // NOT both dimensions — CSS would default to objectFit:'fill'
       zIndex: 40,
       filter: 'drop-shadow(0 5.8px 11.5px rgba(0, 0, 0, 0.28))', // see SHADOW below — illustrative px
     }}
   />
   ```

   NEVER `objectFit:'cover'` (it crops the wordmark), NEVER `'fill'`, never both dimensions
   without `objectFit:'contain'`, and never `overflow:'hidden'` on it or any ancestor.

   **`sales`** — a code-built plate. Chrome, exactly as designed in Figma:

   - fill `var(--utility-yellow-300, #FFAA00)` — a token WITH the hex fallback, because a bare
     token collapses to transparent under this style's transparent root;
   - corner radius **4.4% of the badge's own height**;
   - text hardcoded **`#001B41`** — the ink colour measured from the Figma component. This is
     hardcoded rather than tokenized: the sales plate is amber in BOTH color schemes, so its
     text must stay dark in both, and this codebase's scheme-reactive tokens for this role
     (`--text-base` / `--text-base-invert`) would flip to light-on-amber in dark mode and become
     illegible. (There is no `--text-primary` token in this codebase — do not reintroduce it.)
     Open Sans **Bold**, centred both ways;
   - line-height 1.1× each block's own font-size.

   **INNER SAFE AREA** — pad the plate **3% of the badge's own width** on each side and **12%
   of the badge's own height** top and bottom; every text block MUST sit fully inside that
   padded box, never touching the plate's outer edge. 3% (not 8%) is deliberate: Figma has
   effectively NO horizontal inset on this component — the S+L+S text nodes span the badge's
   full 580px width and are centre-aligned, and the apparent margin there is just short copy —
   while the 12% vertical figure IS faithful to Figma (its own vertical insets measure ~13%
   top and ~16% bottom). An 8% side inset was measured to remove 16% of the usable width
   between the two sides combined, which is enough to force a wrap on real copy (see NOWRAP
   below) even though the "shrink to fit" rule already existed — the padding itself was the
   defect, not a missing instruction.

   **NEVER WRAP — SHRINK INSTEAD.** This is a hard requirement, not a preference:

   - every text block is `whiteSpace:'nowrap'` — a block must NEVER break onto a second line.
     `9 €` and `100.000 €` are each ONE block and must render on one line; there is no such
     thing as a "block" that wraps, only one that has been sized wrong.
   - the `scale` the contract supplies per block is a MAXIMUM, not a fixed size to render
     as-is: if a block does not fit the padded WIDTH at that size (a long author-supplied
     string, a market whose translation runs longer), reduce THAT block's own font size until
     it does, keeping the relative proportion between blocks — shrink every block by the SAME
     factor (e.g. the price treatment's big middle run vs. its two small flanking runs), never
     the overflowing block alone.
   - the WHOLE STACK — every block plus its line box, together — MUST fit inside the padded
     HEIGHT. Nothing may render outside the amber plate: a block escaping the plate (as
     happened with `Bis zu`, pushed above the badge onto the plain background in dark text) is
     a DEFECT, full stop — never an acceptable side effect of "the copy was long". If the
     stack does not fit, shrink further, same MAXIMUM rule as above. Clipping is NOT the
     remedy: `overflow:'hidden'` on a badge (or any ancestor of one) is REJECTED by the
     badge-img gate outright, so there is no fallback but to size the type to fit.
   - for the `row` axis specifically: the runs sit on ONE line, sharing a common vertical
     centre — lay them out as a flex row (`display:'flex'`, `flexDirection:'row'`,
     `alignItems:'center'`) so they read as a single phrase (e.g. "ab **9 €** mtl."), never as
     three independently positioned blocks sitting at different heights.

   **NUMERAL ↔ CURRENCY GAP.** Inside a price block, the space between the numeral and its
   currency symbol must render as a THIN gap — target **0.20em**. Figma sets these as ADJACENT
   runs (`ab` · `9€` · `mtl.` on the `L + XL price` component) and lets tracking do the spacing,
   so a literal word space at the price size — the largest type on the plate — renders a visibly
   wide hole between the number and the `€`. Open Sans Bold's space glyph measures **0.2598em**
   and `wordSpacing` ADDS to that advance, so `wordSpacing:'-0.06em'` lands the visible gap on
   0.20em. Em-relative, so it survives any shrink-to-fit.

   - Apply it ONLY to a block whose ONLY space is the numeral↔currency one: `9 €`, `9,99 €`,
     `100.000 €`, and symbol-first forms like `€ 9,99`. `wordSpacing` narrows EVERY space in the
     element, so a block carrying a SECOND space (`ab 9 €`, `Jetzt ab 9 € testen`) must NOT get
     it — there the currency gap already matches the surrounding word spaces, which is correct.
     The contract names the exact slot(s) to apply it to; if it names none, do not add it.
   - NEVER edit the string to close the gap: the copy is author-supplied and is checked
     verbatim against the text pack. Removing the space (`9€`) or swapping in a different
     space character is a copy change, not a typographic one, and it will fail that check.

   **SHADOW** — both badges get a plain neutral shadow so they read as a layer above the
   interface, added in CODE ONLY. It must NEVER be exported back into the Figma asset: the
   Figma components export at exactly their layout box with zero bleed, which is what makes
   the geometry above predictable — baking a shadow into the PNG would grow its bounding box
   and desync it from the contract rect again. Compute the shadow from the badge's own
   rendered height in PIXELS, the same arithmetic as the font-size below (a percentage is not
   a valid `box-shadow`/`filter` length): offset-y `0.03 × h`, blur `0.06 × h`,
   `rgba(0, 0, 0, 0.28)`.
   - `sales` (a `<div>`): `boxShadow: '0 {0.03×h}px {0.06×h}px rgba(0, 0, 0, 0.28)'`.
   - `unlimited` (an `<Img>` with alpha): MUST use
     `filter: 'drop-shadow(0 {0.03×h}px {0.06×h}px rgba(0, 0, 0, 0.28))'`, NEVER `boxShadow`.
     `box-shadow` on an image draws the shadow around its rectangular bounding box — this PNG
     has transparent margins around the badge shape, so a box-shadow would render a visible
     rectangle instead of a shadow; `drop-shadow` follows the alpha channel and traces the
     badge's actual silhouette.
   - Never an AI glow on either badge, regardless of this style's AI-styling setting.

   Lay the blocks out along the contract's `axis`: `column` = stacked; `row` = the runs side by
   side on ONE line (the price treatment, e.g. "ab **9 €** mtl."). Each block's font-size is
   its `scale` × the badge's own RENDERED HEIGHT IN PIXELS — COMPUTE this into a pixel value,
   never write it as a CSS percentage. `fontSize:'20.6%'` is valid CSS, so nothing errors, but
   it resolves against the INHERITED font-size (the parent's), not the badge's own height —
   the text silently renders microscopic. Compute it the same way as the geometry above: the
   badge's rendered height in px is its contract height-fraction × the canvas's pixel height
   (from `useVideoConfig()`), then multiply by the block's `scale` — and remember `scale` is a
   MAXIMUM (see INNER SAFE AREA above): shrink FROM this size if the copy overflows the padded
   box, do not render it as-is regardless of fit. Worked example: a badge 17.88% of a 960px-tall
   canvas is 171.8px tall; a block with `scale:0.38` is `0.38 × 171.8 ≈ 65.3px` →
   `fontSize:'65.3px'`. The contract states the exact pixel number for THIS render — transcribe
   that number, do not re-derive it from a different canvas size. Do not force letter-casing —
   the copy arrives with the casing its author chose.

   Every visible string comes from `props.texts.<slot>` using the slot names the contract
   supplies — never a hardcoded display string, and never reworded, extended or translated in
   code. The badge sits in front of the interface AND in front of the character's lower body;
   it may extend past the reserved right/bottom margin when the contract says so.

   The sales badge carries marketing copy, and that is intended: it is the author-supplied-text
   exception `shared/no-marketing-heading.md` already allows. It is a badge, never a headline —
   do not grow it into a heading, add a subline, or repeat its words anywhere else in the
   composition.

   Neither badge ever overlaps `layout.faceSafe`, carries an AI glow, or animates: both are
   fully settled at frame 0 and keep a static transform (a text-bearing element that keeps
   moving is rejected by the text-stability gate).
