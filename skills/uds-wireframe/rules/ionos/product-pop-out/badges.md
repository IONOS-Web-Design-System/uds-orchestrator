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
   Figma component's own aspect ratio: fill each rect exactly as given and read every number
   from the contract — a hardcoded width, height, left or top is a gate failure. Each badge's
   root element carries `data-badge="<id>"`.

   **`unlimited`** — the supplied PNG, at its rect, in front of the interface:

   ```tsx
   <Img
     data-badge="unlimited"
     src={staticFile('unlimited-badge.png')}
     style={{
       position: 'absolute',
       left: `${B.x * 100}%`,
       top: `${B.y * 100}%`,
       height: `${B.h * 100}%`,
       width: 'auto',          // NOT both dimensions — CSS would default to objectFit:'fill'
       zIndex: 40,
     }}
   />
   ```

   NEVER `objectFit:'cover'` (it crops the wordmark), NEVER `'fill'`, never both dimensions
   without `objectFit:'contain'`, and never `overflow:'hidden'` on it or any ancestor.

   **`sales`** — a code-built plate. Chrome, exactly as designed in Figma:

   - fill `var(--utility-yellow-300, #FFAA00)` — a token WITH the hex fallback, because a bare
     token collapses to transparent under this style's transparent root;
   - corner radius **4.4% of the badge's own height**;
   - drop shadow: blur = **0.137 × the badge's rendered height in px**, COMPUTED INTO A PIXEL
     VALUE at render time (e.g. 50px on a 365px-tall badge) — spread 0, offset 0, colour
     `rgba(0, 0, 0, 0.5)`. A percentage is NOT a valid `box-shadow` blur radius — unlike
     `border-radius` above, which does accept percentages, `box-shadow`'s blur-radius component
     accepts only a `<length>`. Writing it as `0 0 13.7% rgba(0, 0, 0, 0.5)` makes the whole
     declaration invalid CSS, which the browser silently drops — the shadow this rule exists to
     specify would simply never render. Compute the blur in code instead, e.g.
     `boxShadow: \`0 0 ${(B.h * 0.137).toFixed(1)}px rgba(0, 0, 0, 0.5)\`` — never a percentage
     literal. Plain neutral shadow, never an AI glow;
   - text hardcoded **`#001B41`** — the ink colour measured from the Figma component. This is
     hardcoded rather than tokenized: the sales plate is amber in BOTH color schemes, so its
     text must stay dark in both, and this codebase's scheme-reactive tokens for this role
     (`--text-base` / `--text-base-invert`) would flip to light-on-amber in dark mode and become
     illegible. (There is no `--text-primary` token in this codebase — do not reintroduce it.)
     Open Sans **Bold**, centred both ways;
   - line-height 1.1× each block's own font-size.

   Lay the blocks out along the contract's `axis`: `column` = stacked; `row` = the runs side by
   side on ONE line (the price treatment, e.g. "ab **9 €** mtl."). Each block's font-size is
   its `scale` × the badge's own height, so the badge reads identically at every canvas size.
   Do not force letter-casing — the copy arrives with the casing its author chose.

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
