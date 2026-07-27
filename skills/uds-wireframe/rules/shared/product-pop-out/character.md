---
styles: [product-pop-out]
---

## Style: product-pop-out — layer 3, the character hero

Layers 1-2 (root, interface) are in `product-pop-out/composition.md`; layers 4-5 (highlight, AI
styling) are in `product-pop-out/highlight-and-ai.md`.

3. **Character hero** — the supplied cutout as `staticFile('<slug>.<format>')`, a SINGLE
   INTACT portrait figure placed at `layout.character` (e.g. `{x:0.2829,y:-0.1244,w:0.5178,h:0.9244}`).

   `layout.character` is ALREADY sized to the cutout's native aspect ratio, and it already
   places the head clear of the interface's TOP edge and grounds the body on the frame's
   BOTTOM edge. Fill it EXACTLY as given — do not re-derive it, re-centre it, or "correct"
   it. Two of its properties look wrong and are not: `y` is often NEGATIVE (the cutout's
   transparent headroom sits above the canvas, so that the PERSON's head lands just inside
   the top), and the right edge may sit past the reserved safe-area margin (the character is
   the one element allowed past it).

   Render the cutout UNDISTORTED and UNCROPPED. Set the HEIGHT from the rect and let the
   width follow:

   ```tsx
   <Img
     src={staticFile('<slug>.<format>')}
     style={{
       position: 'absolute',
       left: `${L.character.x * 100}%`,
       top: `${L.character.y * 100}%`,
       height: `${L.character.h * 100}%`,
       width: 'auto',            // NOT both dimensions — CSS would default to objectFit:'fill'
       zIndex: 30,               // in FRONT of the interface
     }}
   />
   ```

   NEVER `objectFit:'cover'` (it amputates the shoulders and hands at the box edge), NEVER
   `objectFit:'fill'` or both width and height without `objectFit:'contain'` (either stretches
   the person — circular glasses become vertical ovals), and NEVER `overflow:'hidden'` on the
   character's wrapper or any ancestor of it. Tailwind equivalents (object-cover, object-fill,
   overflow-hidden/-x/-y, h-*+non-w-auto w-*) banned. `cutout.headTopFrac` and
   `cutout.subjectHeightFrac` are supplied for context only; the rect is already computed from
   them, so no further scaling is needed.

   This layer's head/upper body is **z-order IN FRONT of the interface**: the `layout.faceSafe`
   box (e.g. `{x:0.46,y:0.02,w:0.25,h:0.34}` — upper body + face) is NEVER occluded by any
   element, at any frame — no card, no chrome, ever crosses it. BELOW the face-safe box, though,
   the character's LOWER torso tucks BEHIND the interface's card stack: product-view cards and
   interface chrome MAY — and SHOULD — overlap the character's lower body there, so the cutout's
   bottom edge is HIDDEN behind interface content rather than showing a hard crop line (matching
   Figma 269:527). The character is hero MEDIA, not a full-canvas standalone, and is never
   detached or floating apart from the interface.
