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
   AI gradient (`var(--private-ai-primary-start) → var(--private-ai-primary-end)`, the runtime
   AI tokens; see the brand's AI feature rule in `uds-style-guide`) may replace it.
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
   and badges never use dashed outlines (retired style — see `ionos-ai-features`).

   `ACCENT` below is the brand's AI-generating accent purple — the same accent used for
   the text-selection marquee inside the client-app zone (solid stroke only, never the AI
   CTA gradient itself). There is no dedicated CSS token for this accent; resolve the
   concrete value from the brand's color rule (e.g. `ionos/product-frame-color.md` "AI
   selection target inside client app") — never hardcode a brand hex in this shared file.

   ```tsx
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
   on the negative-space side, containing the feature's UI as kit components (`KitTabs` for a
   segmented control, `KitCheckbox` options, the AI CTA `KitButton concept="ai"`). **Panel chrome follows the
   Floating Highlight Card template (see `shared/floating-card.md` for the surface rule):
   borderless, with a plain neutral drop shadow (no AI glow — AI glow is on the CTA
   only) — NO border of any kind (dashed AND gradient borders are retired panel styles).
   The AI gradient belongs to the CTA inside, not the panel chrome.**

   ```tsx
   import sparkles from '@ionos-web-design-system/icon/system/filled-sparkles';
   import { KitButton, KitCheckbox } from './kit';

   // Floating Highlight Card chrome (see shared/floating-card.md for the chrome spec
   // and animated-entrance guidance). `glow` is a clamped interpolate from the frame.
   <div style={{
     position: 'absolute', left: '5%', top: '30%', width: 280,
     borderRadius: 24, padding: 20,
     background: 'var(--surface-subtle)', // opaque — no backdropFilter on the card itself
     boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
     display: 'flex', flexDirection: 'column', gap: 12,
   }}>
     {[texts.option1 ?? '', texts.option2 ?? '', texts.option3 ?? ''].map((o, i) => (
       <KitCheckbox key={i} checked={i === 0} label={o} />
     ))}
     <KitButton label={texts.cta ?? ''} concept="ai" icon={sparkles} glow={glow} />
   </div>
   ```

   If the panel shows a generating/loading moment, set the CTA's `loading` prop and show
   `KitSkeleton` lines where the result appears (≥10–15 frames, no hard cut — see the
   brand's AI feature rule in `uds-style-guide`). A drawn 'thinking' bar may use the
   scheme-aware `var(--private-ai-subtle-start) → var(--private-ai-subtle-end)` gradient,
   never a hardcoded light-only value.

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

6. **Optional AI badge** — one small labelled AI mark (sparkle + 1-2 words like "KI Text")
   near the marquee. It is the brand's drawn AI badge (`uds-style-guide/rules/<brand>-ai-features.md`
   "AI badges"; the kit has no AI chip), not a kit button; its parent positions it and carries the
   pop-in animation.

Animation hooks (reference the patterns in `ionos/micro-animations.md` — do not
re-invent them): panel enters with **Pattern 5 — Element Fly-In** (`fly`); the marquee
draws in right after (animate `strokeDashoffset` on an SVG rect, or fade + scale the dashed
div from 1.04→1); the AI badge pops last (its parent scales 0.6→1 on the same clamped `enter` curve, then holds); the
connector line can grow from the panel toward the dot. The backdrop (including the calm
region the marquee wraps) is present from frame 0; only the marquee, panel, AI badge, and
connector animate in.

