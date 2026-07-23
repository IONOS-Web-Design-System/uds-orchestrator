---
styles: [background-pointer]
---

## Style: image-backdrop with feature pointer

Story: the AI feature acts on the user's content shown in the imagery. The image is a
large rounded card; a calm negative-space region of it is "selected" with design-tool
visual language — a marquee, not a rendered headline (see `shared-brief-parsing.md`
no-marketing-heading) — and a floating feature panel points at it.

Layer order (document order, no z-index games):

1. **Root** — `<AbsoluteFill>` with an opaque brand-gradient background (per
   `uds-style-guide`; for IONOS this is the deep-blue → dark-midnight gradient,
   `var(--color-gradient-start) → var(--color-gradient-end)`). For AI features, the brand
   AI gradient (`var(--color-ai-primary-start) → var(--color-ai-primary-end)`; see
   `uds-style-guide/rules/ionos-ai-features.md`) may replace it.
2. **Backdrop card = ONE FRAME** — the catalog image as a rounded-corner card covering
   roughly **75-90% of the canvas**, offset toward one side (per the composition plan),
   with `objectFit: 'cover'`, `overflow: 'hidden'`, and a soft shadow.

   **The one-frame rule:** the imagery lives INSIDE this card, inside a single `scene`
   wrapper that receives any backdrop-motion transform — the pictured scene is
   self-contained in this one frame. Canvas-level annotations (marquee, panel, connector,
   badge) are NOT part of it — they draw in separately (see below).

   ```tsx
   <div style={{
     position: 'absolute', top: '6%', right: '4%', width: '82%', height: '88%',
     borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
   }}>
     {/* scene wrapper: the transform that moves the imagery on any backdrop motion */}
     <div style={{ width: '100%', height: '100%',
                   transform: `scale(${z})`, transformOrigin: '30% 40%' }}>
       <Img src={staticFile('<slug>.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover',
                     objectPosition: '30% 40%' /* crop onto the focal area */ }} />
     </div>
   </div>
   ```

   Canvas-level annotations — marquee, connector, badge, the floating panel — do NOT
   live in the scene wrapper and do NOT zoom with it; they draw in AFTER the motion
   settles, positioned against the settled layout.

   **Crop rule** (contract line `Crop:`): show only the imagery's **relevant region** —
   zoom the crop with `objectFit: 'cover'` plus an `objectPosition` aimed at the focal
   area (e.g. `objectPosition: '30% 40%'`). The reference (77:203) shows a zoomed part of
   the teal wall + bike, not the whole photo. **Never present the complete photo
   letterboxed or framed as a small picture inside the canvas** — the backdrop card is a
   window onto a region of the scene, not a photo frame around all of it.

   **Backdrop motion** (contract line `Backdrop motion:`): the background image is ALWAYS
   STATIC. NEVER fade it in, zoom, pan, Ken-Burns, parallax, or drift the imagery — there
   is NO sanctioned backdrop motion, in ANY embed style. Put NO transform/opacity animation
   on the scene wrapper or the `<Img>` itself. ONLY the floating UI fragments and annotations
   (cards, marquee, connector, badge, cursor flow) animate: they draw/fly in (micro-animations
   Pattern 5) over an already-fully-visible, static backdrop, then settle. This holds
   regardless of animation intent — the backdrop is the still stage; only the overlay moves.

3. **Selection marquee over a calm negative-space region of the imagery** — the
   composition plan's stated calm surface/region (no marketing headline is rendered
   there — see `shared-brief-parsing.md` no-marketing-heading) gets a dashed accent
   border + 4 square corner handles, sized to comfortably wrap that region. **This
   in-scene selection affordance is the ONLY place a dashed border is allowed** — it
   depicts content selection (design-tool language), not panel chrome. Panels, bubbles,
   and badges never use dashed outlines (retired style — see `ionos-ai-features`):

   ```tsx
   // ACCENT: the brand's AI-generating accent purple (uds-style-guide — for IONOS this is
   // the ai-features "generating" purple-600 / product-frame marquee accent). Solid stroke
   // only — never the AI CTA gradient itself.
   // AI 'generating'-text accent — no dedicated CSS token exists for this specific accent;
   // resolve the concrete value from the brand rule (IONOS: #8212C2, see
   // ionos/image-backdrop.md / uds-style-guide ionos-ai-features).
   const ACCENT = '#8212C2';
   <div style={{
     position: 'absolute', inset: -14, // wraps the selected negative-space region
     border: `2px dashed ${ACCENT}`, pointerEvents: 'none',
   }}>
     {(['top','bottom'] as const).map(v => (['left','right'] as const).map(h => (
       <div key={v+h} style={{
         position: 'absolute', [v]: -5, [h]: -5, width: 10, height: 10,
         background: '#fff', border: `2px solid ${ACCENT}`,
       }} />
     )))}
   </div>
   ```

4. **Floating feature panel** — a compact panel half-overlapping the backdrop card's edge
   on the negative-space side, containing the feature's UI (segmented control, radio list,
   primary CTA — real UDS components or tight sketches). **Panel chrome follows the
   Floating Highlight Card template (`ionos/ai-animations.md`): a borderless
   glass surface with a plain neutral drop shadow (no AI glow — AI glow is on the CTA
   only) — NO border of any kind (dashed AND gradient borders are retired panel styles).
   The AI gradient belongs to the CTA inside, not the panel chrome.**

   ```tsx
   // Floating Highlight Card chrome (see ionos/ai-animations.md for the full
   // animated version with enter spring):
   <div style={{
     position: 'absolute', left: '5%', top: '30%', width: 280,
     borderRadius: 24, padding: 20,
     background: 'var(--surface-subtle)',
     backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
     boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
   }}>
     {/* options list; CTA: linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end)) + white text;
         sparkle icon accent: var(--color-ai-primary-end) */}
   </div>
   ```

   If the panel shows a generating/loading moment, use the mandatory `ai-subtle`
   treatment from `ionos-ai-features` for the AI 'thinking' indicator only (calm
   `var(--color-ai-subtle-start) → var(--color-ai-subtle-end)` oscillation, ≥10–15
   frames, no hard cut). The `ai-subtle` gradient is a TOKEN with light AND dark values —
   always use `var(--color-ai-subtle-start)`/`var(--color-ai-subtle-end)` (auto light/dark)
   rather than a hardcoded light-only fallback.

5. **Connector line** — a thin line from the panel's edge to the selection marquee,
   ending in a filled dot. **The connector is ALWAYS axis-aligned — a single horizontal
   or vertical segment. Slanted/diagonal connectors are not allowed.** Plan the layout
   so the panel's anchor point and the marquee's edge midpoint share the same `y`
   (horizontal run, the reference pattern) or the same `x` (vertical run); when the two
   genuinely cannot align, use an L-elbow of TWO axis-aligned segments — never one
   tilted line. Implement with divs (a div line cannot accidentally slant):

   ```tsx
   const LINE_Y = marqueeCenterY;        // panel anchor must sit at this same y
   <div style={{
     position: 'absolute', left: panelRightX, top: LINE_Y - 1,
     width: marqueeLeftX - panelRightX, height: 2, background: ACCENT,
   }} />
   <div style={{
     position: 'absolute', left: marqueeLeftX - 5, top: LINE_Y - 5,
     width: 10, height: 10, borderRadius: '50%', background: ACCENT,
   }} />
   {/* L-elbow (only when alignment is impossible): one horizontal div + one vertical
       div meeting at the corner — still never a tilted segment. */}
   ```

6. **Optional accent badge** — one small circular badge (brand accent fill, icon +
   1-2 words like "KI Text") near the marquee:

   ```tsx
   <div style={{
     position: 'absolute', /* near the marquee */
     display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
     borderRadius: 999, background: 'var(--color-ai-primary-end)',
     color: '#fff', fontSize: 13, fontWeight: 700,
     boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
   }}>
     <Icon group="system" name="sparkles" size={14} /> KI Text
   </div>
   ```

Animation hooks (reference the patterns in `ionos/micro-animations.md` — do not
re-invent them): panel enters with **Pattern 5 — Element Fly-In** (`flyIn`); the marquee
draws in right after (animate `strokeDashoffset` on an SVG rect, or fade + scale the dashed
div from 1.04→1); the badge pops last (scale 0.6→1 overshoot, same `flyIn` curve); the
connector line can grow from the panel toward the dot. The backdrop (including the calm
region the marquee wraps) is present from frame 0; only the marquee, panel, badge, and
connector animate in.

