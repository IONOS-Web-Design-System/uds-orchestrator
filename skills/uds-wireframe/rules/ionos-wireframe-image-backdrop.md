# Image-backdrop hybrid compositions

Applies when the brief contains a `[HYBRID EMBED CONTRACT]` section. The contract's
`Style:` line names one of four composition styles — follow the matching section below:

- `Style: image-backdrop with feature pointer` → [feature pointer](#style-image-backdrop-with-feature-pointer)
- `Style: image-backdrop full-bleed` → [full-bleed](#style-image-backdrop-full-bleed)
- `Style: interface-asset` → [interface-asset](#style-interface-asset)
- `Style: floating image card with intersecting highlights` → [floating card](#style-floating-image-card-with-intersecting-highlights)

In the two backdrop styles the catalog image is a **backdrop** the UI floats over; in the
interface-asset style the catalog image lives **inside** the wireframe as its hero/media
asset. In all three the imagery is never keyed, masked, or punched through, and the UI
never pretends to live inside a pictured device screen.

Rules for ALL styles:

- **Opaque root.** Give the composition root an explicit opaque `backgroundColor`
  (transparent roots render black in mp4).
- **Never cover the imagery's focal subject.** The contract / composition plan says which
  side has negative space — that side gets the floating UI. (For interface-asset this
  applies inside the hero/media slot: keep the headline over the imagery's calm region.)
- **Critical content margins.** Keep headlines, buttons, and badges within the middle 90%
  of the canvas; nothing critical within ~48px of a canvas edge.
- **Still gate.** Frame 0 must already show the backdrop image plus the floating UI cleanly
  composed — no empty canvas, no elements mid-flight off-screen.

## Style: image-backdrop with feature pointer

Story: the AI feature acts on the user's content shown in the imagery. The image is a
large rounded card; a headline rendered OVER it is "selected" with design-tool visual
language, and a floating feature panel points at it.

Layer order (document order, no z-index games):

1. **Root** — `<AbsoluteFill>` with an opaque brand-gradient background. Default:
   IONOS Blue → Dark Midnight, `linear-gradient(135deg, #0B2A63 0%, #001B41 100%)`.
   For AI features, the AI blue→magenta gradient (`#095BB1 → #D746F5`, see
   `uds-style-guide/rules/ionos-ai-features.md`) may replace it.
2. **Backdrop card = ONE FRAME** — the catalog image as a rounded-corner card covering
   roughly **75-90% of the canvas**, offset toward one side (per the composition plan),
   with `objectFit: 'cover'`, `overflow: 'hidden'`, and a soft shadow.

   **The one-frame rule:** everything that reads as part of the pictured scene — the
   imagery, the headline rendered over it, its scrim — lives INSIDE this card, inside a
   single `scene` wrapper that receives any backdrop-motion transform. When the frame
   zooms or moves, imagery and in-frame typography move TOGETHER; a headline that stays
   put while the image zooms behind it breaks the illusion and is wrong.

   ```tsx
   <div style={{
     position: 'absolute', top: '6%', right: '4%', width: '82%', height: '88%',
     borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
   }}>
     {/* scene wrapper: ONE transform moves imagery + in-frame text together */}
     <div style={{ width: '100%', height: '100%',
                   transform: `scale(${z})`, transformOrigin: '30% 40%' }}>
       <Img src={staticFile('<slug>.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover',
                     objectPosition: '30% 40%' /* crop onto the focal area */ }} />
       {/* headline + scrim live HERE, inside the scene wrapper (see step 3) */}
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

   **Backdrop motion** (contract line `Backdrop motion:`, animation intent only — applies
   to the pointer AND full-bleed styles): **imagery motion is PURPOSED, never decorative.
   Idle Ken Burns — continuous aimless zoom or pan — is banned.** Exactly three motions
   are sanctioned; use the one(s) the narrative calls for, otherwise the backdrop stays
   static:

   1. **Highlight zoom** — zoom toward the region being highlighted, *synchronized with
      the highlight element's entrance* (the marquee/panel/badge that refers to it). The
      zoom SETTLES — it runs over ~15-25 frames as the highlight appears, then holds:

      ```tsx
      const frame = useCurrentFrame();
      // marquee enters at MARQUEE_IN; the zoom accompanies it, then holds.
      const z = interpolate(frame, [MARQUEE_IN, MARQUEE_IN + 20], [1.0, 1.08],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
      // the transform goes on the SCENE WRAPPER (one-frame rule) — imagery AND the
      // in-frame headline zoom together; never transform the <Img> alone:
      <div style={{ width: '100%', height: '100%',
                    transformOrigin: '30% 40%',          // zoom INTO the highlighted region
                    transform: `scale(${z})` }}>
        <Img src={staticFile('<slug>.png')}
             style={{ width: '100%', height: '100%', objectFit: 'cover',
                      objectPosition: '30% 40%' /* the highlighted region */ }} />
        {/* headline + scrim here — they ride the same transform */}
      </div>
      ```

      `transformOrigin` must match the focal `objectPosition` — the zoom moves INTO the
      highlighted area, tying camera and highlight together. The marquee, connector, and
      badge are canvas-level annotations: they draw in AFTER the zoom settles (at or
      after `MARQUEE_IN + 20`), wrapping the headline's settled position.

   2. **Entrance fade+move** — when the image container itself pops into view (or
      leaves): opacity 0→1 with a small translate/scale (e.g. `translateY 24→0`,
      `scale 0.97→1`) over ~12-18 frames, using the same `flyIn` curve as the floating
      fragments (micro-animations Pattern 5). After the entrance, the imagery holds.

   3. **Interaction response** — only when a cursor-flow animation (micro-animations
      cursor pattern) crosses or clicks the image container: a subtle settle response
      synchronized to the cursor event frames — `scale 1.0→1.02` easing back to 1.0, or
      a ≤8px parallax shift. The image reacts to the interaction; it does not move on
      its own.

   Without a `Backdrop motion:` line in the contract, the backdrop stays fully static.

3. **Headline over the image (inside the scene wrapper)** — a short bold heading (brand heading font, white) rendered
   as a UI text layer on top of the backdrop. The illustration owns this text — it is NOT
   baked into the image. Guarantee contrast with a text-shadow or a local gradient scrim:

   ```tsx
   <h1 style={{
     position: 'absolute', /* over a calm region of the backdrop */
     fontFamily: 'Overpass, sans-serif', fontWeight: 800, color: '#fff',
     textShadow: '0 2px 24px rgba(0,0,0,0.55)', // or place over a scrim:
     // background: 'linear-gradient(transparent, rgba(0,27,65,0.55))' on a wrapper
     margin: 0,
   }}>URBAN BIKES</h1>
   ```

4. **Selection marquee around the headline** — dashed accent border + 4 square corner
   handles, sized slightly larger than the headline box. **This in-scene selection
   affordance is the ONLY place a dashed border is allowed** — it depicts content
   selection (design-tool language), not panel chrome. Panels, bubbles, and badges never
   use dashed outlines (retired style — see `ionos-ai-features`):

   ```tsx
   const ACCENT = '#8212C2'; // the sanctioned text-selection marquee purple (product-frame rule)
   <div style={{
     position: 'absolute', inset: -14, // wraps the headline wrapper
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

5. **Floating feature panel** — a compact panel half-overlapping the backdrop card's edge
   on the negative-space side, containing the feature's UI (segmented control, radio list,
   primary CTA — real UDS components or tight sketches). **Panel chrome follows the
   Floating Highlight Card template (`ionos-wireframe-ai-animations.md`): a borderless
   glass surface with a plain neutral drop shadow (no AI glow — AI glow is on the CTA
   only) — NO border of any kind (dashed AND gradient borders are retired panel styles).
   The AI gradient belongs to the CTA inside, not the panel chrome.**

   ```tsx
   // Floating Highlight Card chrome (see ionos-wireframe-ai-animations.md for the full
   // animated version with enter spring):
   <div style={{
     position: 'absolute', left: '5%', top: '30%', width: 280,
     borderRadius: 24, padding: 20,
     background: 'var(--surface-subtle)',
     backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
     boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
   }}>
     {/* options list; CTA: linear-gradient(45deg,#095BB1,#D746F5) + white text;
         sparkle icon accent: var(--color-ai-primary-end, #D746F5) */}
   </div>
   ```

   If the panel shows a generating/loading moment, use the mandatory `ai-subtle`
   treatment from `ionos-ai-features` for the AI 'thinking' indicator only (calm
   `var(--color-ai-subtle-start) → var(--color-ai-subtle-end)` oscillation, ≥10–15
   frames, no hard cut). The `ai-subtle` gradient is a TOKEN with light AND dark values —
   prefer `var(--color-ai-subtle-start)`/`var(--color-ai-subtle-end)` (auto light/dark)
   over the light-only `#FAE7FE → #FFFFFF` hex.

6. **Connector line** — a thin line from the panel's edge to the headline's marquee,
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

7. **Optional accent badge** — one small circular badge (brand accent fill, icon +
   1-2 words like "KI Text") near the headline:

   ```tsx
   <div style={{
     position: 'absolute', /* near the marquee */
     display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
     borderRadius: 999, background: 'var(--color-ai-primary-end, #D746F5)',
     color: '#fff', fontSize: 13, fontWeight: 700,
     boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
   }}>
     <Icon group="system" name="sparkles" size={14} /> KI Text
   </div>
   ```

Animation hooks (reference the patterns in `ionos-wireframe-micro-animations.md` — do not
re-invent them): panel enters with **Pattern 5 — Element Fly-In** (`flyIn`); the marquee
draws in right after (animate `strokeDashoffset` on an SVG rect, or fade + scale the dashed
div from 1.04→1); the badge pops last (scale 0.6→1 overshoot, same `flyIn` curve); the
connector line can grow from the panel toward the dot. Backdrop and headline are present
from frame 0.

## Style: image-backdrop full-bleed

Story: the imagery is persona/ambience back-story; the floating UI cluster IS the product
feature. **No connector lines into the imagery.**

Layer order:

1. **Root** — `<AbsoluteFill>` with an explicit opaque `backgroundColor` (a brand dark or a
   tone sampled from the image).
2. **Backdrop** — the catalog image as the full-bleed background:

   ```tsx
   <AbsoluteFill>
     <Img src={staticFile('<slug>.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
   </AbsoluteFill>
   ```

3. **Floating UI cluster** — 1-3 fragments over the imagery's negative space, together
   occupying roughly **40-60% of canvas width**, never covering the focal subject. Fragments
   slightly overlap each other and may overlap the photo subject's edge. All share the same
   surface anatomy: white/light background, rounded corners (16-20px), soft shadow
   (`0 24px 64px rgba(0,0,0,0.3)`).

   - **Primary card (always):** a mini product/feature card — title, supporting line, CTA
     button, and media slots. The same catalog image may be reused INSIDE the card's media
     slots (`<Img src={staticFile('<slug>.png')} style={{ objectFit: 'cover' }} />` in a
     small rounded container) — that reuse is intentional, not a bug.
   - **Mini-toolbar (optional):** a small horizontal pill of icon buttons with one prominent
     accent/gradient button:

     ```tsx
     <div style={{
       position: 'absolute', /* near the primary card */
       display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
       background: '#fff', borderRadius: 999, boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
     }}>
       {/* 3-4 small system icons, then: */}
       <div style={{
         width: 32, height: 32, borderRadius: '50%', display: 'flex',
         alignItems: 'center', justifyContent: 'center', color: '#fff',
         background: 'linear-gradient(45deg, var(--color-ai-primary-start, #095BB1), var(--color-ai-primary-end, #D746F5))',
       }}>
         <Icon group="system" name="sparkles" size={16} />
       </div>
     </div>
     ```

   - **Prompt bubble (optional):** a prompt surface follows `ionos-ai-features` — prompt
     bubbles use `var(--surface-base)`; reserve `ai-subtle` for the AI 'thinking'
     indicator only — borderless, soft shadow — **never a dashed or bordered outline
     (retired styles)** — with a tiny accent sparkle icon (`var(--color-ai-primary-end,
     #D746F5)`), a muted caption (e.g. "Anforderung KI Website-Generator"), and a short
     bold request line:

     ```tsx
     <div style={{
       position: 'absolute', /* offset from the cluster */ maxWidth: 300,
       background: 'var(--surface-base)', // prompt bubble surface
       borderRadius: 14, padding: 16,
       boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
     }}>
       {/* icon + caption row, then bold navy request text */}
     </div>
     ```

Animation hooks: stagger the cluster in with **Pattern 5 — Element Fly-In** (primary card
first, toolbar and bubble at +0.3-0.5s offsets); at most one fragment may idle with
**Pattern 4 — Float / Gentle Bob** (`floatBob`). The backdrop is **static by default**;
when the contract includes a `Backdrop motion:` line, apply one of the three PURPOSED
motions from the pointer section (highlight zoom synced to a highlight element, entrance
fade+move of the image layer, or a cursor-interaction response) — idle Ken Burns is
banned here too.

## Style: interface-asset

Story: the product feature IS a full interface (e.g. a CMS/editor shell), and the
generated imagery serves as that interface's content. Reference 64:320: a dark navy
brand-gradient base; the main interface wireframe (editor shell with a left icon sidebar)
is the centerpiece; the imagery sits inside it as the hero media with a welcome headline
over it; a prompt bubble and a mini-toolbar float over the wireframe's edge.

This is a **normal wireframe composition** — build the interface itself per the standard
rules and do not re-invent them here:

- `ionos-wireframe-composition.md` — layout patterns, component selection, placeholder
  content, headline-over-media treatment.
- `ionos-wireframe-asset-integration.md` — catalog asset placement
  (`<Img src={staticFile('<slug>.png')} />`, never plain `<img>`).
- `ionos-wireframe-product-frame.md` — the product shell's color system (sidebar,
  panels, header actions) and the one-frame-one-highlight composition rule.

What THIS rule adds on top:

1. **Root** — opaque brand-gradient `<AbsoluteFill>` (harmonized per the
   [Color harmony](#color-harmony-all-styles) section below — derive the gradient from
   the imagery's measured dominant tone mixed toward `#001B41`).
2. **Main interface wireframe** — the centerpiece, covering roughly **70-85% of the
   canvas**, sitting on the gradient root with rounded corners and a soft shadow.
3. **The catalog image is the hero/media asset INSIDE the wireframe** — placed in the
   interface's hero/media slot with `objectFit: 'cover'`, with the headline text rendered
   over it per the composition rules (welcome headline, contrast via text-shadow or
   scrim). Placeholder bars/content blocks sit below the hero, per the product-frame
   placeholder palette.
4. **1-2 floating highlight fragments** overlapping the wireframe's edge — a prompt
   bubble and/or a small mini-toolbar pill, per the **Floating Highlight Card template**
   (`ionos-wireframe-ai-animations.md`): borderless glass surface + plain neutral drop
   shadow (no AI glow — AI glow is on the CTA only), no border of any kind. The prompt
   bubble uses `var(--surface-base)` (reserve `ai-subtle` for the AI 'thinking' indicator
   only) with a muted caption and a gradient CTA (e.g. "✨ Seite erstellen" —
   `linear-gradient(45deg, #095BB1, #D746F5)`, white text). The AI gradient belongs to
   CTAs only, never to fragment chrome.

## Style: floating image card with intersecting highlights

The generated image is the hero, presented as a single dominant rounded card (~60–80% of the
canvas) on a `var(--surface-subtlest)` root — NOT a full-bleed backdrop. The product feature is
conveyed by **2–3 small elements that FLOAT and INTERSECT** the card:

- they overlap the card's **edges/corners** AND/OR rest **ON the image** over its quiet regions —
  e.g. an AI/feature badge on a corner, a labelled chip (icon + 1–3 words) on an edge, a compact
  brand-blue icon pill (2–3 glyphs) on the image, and optionally a small info panel (tag chips +
  short headline + AI CTA) intersecting one edge;
- each floating element carries a **large, prominent neutral drop shadow** (e.g.
  `0 16px 40px rgba(0,0,0,0.22)`) so it reads as clearly **elevated above the card** — a shadow,
  **never an AI glow** (the only AI glow is on the AI CTA);
- card + chip chrome use `var(--surface-subtle)` (no AI glow); a chip may instead be a solid
  brand-blue pill. The AI gradient is for the AI CTA/badge only.

No connector lines and no selection marquee — the elements simply float over and intersect the
card and each other. Reference frames: Figma `82:202` (info panel + KI badge + tags + AI CTA) and
`162:306` (edge chip + a brand-blue icon pill resting on the image).

## Color harmony (all styles)

The contract's `Color harmony:` line carries the backdrop imagery's **measured** tones
(dominant + supporting hexes, warm/cool, light/dark). The composition must feel
of-a-piece with the imagery — never a brand-default background fighting the photo:

- **Root background gradient**: derive it from the dominant tone's hue family, darkened —
  mix the dominant hue toward the brand navy (`#001B41`) at roughly 60-80% darkness. E.g.
  dominant teal `#2E6F73` → gradient `#0E2B33 → #001B41`; warm terracotta `#B86B4C` →
  `#3A1F14 → #001B41`. Keep it calm and dark enough that white text and glass panels read.
- **What never changes**: panel glass stays neutral (`var(--surface-subtle)`), the
  blue→magenta AI gradient stays exactly `#095BB1 → #D746F5` (CTAs/badges only), brand
  component colors stay tokenized. Harmony lives in the ROOT background, scrims, and
  subtle shadow tints — not in recolored UI.
- **Contrast supervision**: when the contract says the imagery is `light`, put a darker
  scrim (`linear-gradient(transparent, rgba(0,27,65,0.55))`) behind any headline/text over
  the imagery; when `dark`, white text may sit directly on it. Glow shadows may tint
  toward the dominant hue at low opacity instead of pure black.
- When the contract says "no measured imagery tones available", use the brand navy family
  (`#0E1A2D → #001B41`) and keep contrast high.

## Verifying

Verify with the still gate: frame 0 shows the backdrop imagery plus the floating UI cleanly
composed — pointer style additionally shows the headline, marquee, panel, and connector;
full-bleed style shows the cluster over negative space with the photo's focal subject fully
visible; interface-asset style shows the full interface wireframe on the gradient root with
the imagery already filling its hero/media slot, the headline over it, and the floating
fragment(s) overlapping the wireframe's edge.
