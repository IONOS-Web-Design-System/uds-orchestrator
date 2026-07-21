# Shared wireframe embed contract (all brands)

Applies when the brief contains a `[HYBRID EMBED CONTRACT]` section, for **any** brand.
Follow the section named by the contract's `Style:` line (or, for the two composite
styles below, the `[PRODUCT-POP-OUT COMPOSITE]` / `[DEVICE-MOCKUP COMPOSITE]` tag) — that
is the exact geometry to build. This file is geometry-only: brand colour always comes from
`uds-style-guide` (and, for the AI look, `uds-style-guide/rules/ionos-ai-features.md` today)
— never hardcode a brand hex here. Reference colour semantically ("the brand gradient", "the
brand AI gradient") and resolve the actual value per the active `brand` at generation time.

| embedStyle code | Contract `Style:` line (as dispatched) | Section |
|---|---|---|
| `background-pointer` | `Style: image-backdrop with feature pointer` | [Style: image-backdrop with feature pointer](#style-image-backdrop-with-feature-pointer) |
| `background-full` | `Style: image-backdrop full-bleed` | [Style: image-backdrop full-bleed](#style-image-backdrop-full-bleed) |
| `interface-asset` | `Style: interface-asset` | [Style: interface-asset](#style-interface-asset) |
| `floating-card` | `Style: floating image card with intersecting highlights` | [Style: floating image card with intersecting highlights](#style-floating-image-card-with-intersecting-highlights) |
| `product-pop-out` | `[PRODUCT-POP-OUT COMPOSITE]` tag (no `Style:` line) | [Style: product-pop-out](#style-product-pop-out) |
| `device-mockup` | `[DEVICE-MOCKUP COMPOSITE]` tag (no `Style:` line) | [Style: device-mockup](#style-device-mockup) |

In the two backdrop styles the catalog image is a **backdrop** the UI floats over; in the
interface-asset style the catalog image lives **inside** the wireframe as its hero/media
asset; in the two composite styles there is no catalog-image backdrop at all — the root is
**transparent** and a character cutout composites with a UI/device wireframe. Across the four
opaque styles the imagery is never keyed, masked, or punched through, and the UI never
pretends to live inside a pictured device screen.

Rules for the four opaque styles (`background-pointer`, `background-full`, `interface-asset`,
`floating-card`):

- **Opaque root.** Give the composition root an explicit opaque `backgroundColor`
  (transparent roots render black in mp4).
- **Never cover the imagery's focal subject.** The contract / composition plan says which
  side has negative space — that side gets the floating UI. (For interface-asset this
  applies inside the hero/media slot: keep the headline over the imagery's calm region.)
- **Critical content margins.** Keep headlines, buttons, and badges within the middle 90%
  of the canvas; nothing critical within ~48px of a canvas edge.
- **Still gate.** Frame 0 must already show the backdrop image plus the floating UI cleanly
  composed — no empty canvas, no elements mid-flight off-screen.

The two composite styles (`product-pop-out`, `device-mockup`) are **transparent-root** by
contract — see their sections below for their own still-gate and margin rules.

## Style: image-backdrop with feature pointer

Story: the AI feature acts on the user's content shown in the imagery. The image is a
large rounded card; a headline rendered OVER it is "selected" with design-tool visual
language, and a floating feature panel points at it.

Layer order (document order, no z-index games):

1. **Root** — `<AbsoluteFill>` with an opaque brand-gradient background (per
   `uds-style-guide`; for IONOS this is the deep-blue → dark-midnight gradient,
   `var(--color-gradient-start) → var(--color-gradient-end)`). For AI features, the brand
   AI gradient (`var(--color-ai-primary-start) → var(--color-ai-primary-end)`; see
   `uds-style-guide/rules/ionos-ai-features.md`) may replace it.
2. **Backdrop card = ONE FRAME** — the catalog image as a rounded-corner card covering
   roughly **75-90% of the canvas**, offset toward one side (per the composition plan),
   with `objectFit: 'cover'`, `overflow: 'hidden'`, and a soft shadow.

   **The one-frame rule:** everything that reads as part of the pictured scene — the
   imagery and the headline rendered over it (text-shadow only — no scrim) — live INSIDE this card, inside a
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
       {/* headline lives HERE (text-shadow, no scrim), inside the scene wrapper (see step 3) */}
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

3. **Headline over the image (inside the scene wrapper)** — a short bold heading (brand heading font, white) rendered
   as a UI text layer on top of the backdrop. The illustration owns this text — it is NOT
   baked into the image. Guarantee contrast with a text-shadow or a small local panel
   behind the text — NEVER a scrim/gradient over the image (keep it at full brightness):

   ```tsx
   <h1 style={{
     position: 'absolute', /* over a calm region of the backdrop */
     fontFamily: 'Overpass, sans-serif', fontWeight: 800, color: '#fff',
     textShadow: '0 2px 24px rgba(0,0,0,0.55)', // text-shadow only — do NOT darken the image
     margin: 0,
   }}>URBAN BIKES</h1>
   ```

4. **Selection marquee around the headline** — dashed accent border + 4 square corner
   handles, sized slightly larger than the headline box. **This in-scene selection
   affordance is the ONLY place a dashed border is allowed** — it depicts content
   selection (design-tool language), not panel chrome. Panels, bubbles, and badges never
   use dashed outlines (retired style — see `ionos-ai-features`):

   ```tsx
   // ACCENT: the brand's AI-generating accent purple (uds-style-guide — for IONOS this is
   // the ai-features "generating" purple-600 / product-frame marquee accent). Solid stroke
   // only — never the AI CTA gradient itself.
   // AI 'generating'-text accent — no dedicated CSS token exists for this specific accent;
   // resolve the concrete value from the brand rule (IONOS: #8212C2, see
   // ionos-wireframe-image-backdrop.md / uds-style-guide ionos-ai-features).
   const ACCENT = '#8212C2';
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
     borderRadius: 999, background: 'var(--color-ai-primary-end)',
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
         background: 'linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))',
       }}>
         <Icon group="system" name="sparkles" size={16} />
       </div>
     </div>
     ```

   - **Prompt bubble (optional):** a prompt surface follows `ionos-ai-features` — prompt
     bubbles use `var(--surface-base)`; reserve `ai-subtle` for the AI 'thinking'
     indicator only — borderless, soft shadow — **never a dashed or bordered outline
     (retired styles)** — with a tiny accent sparkle icon (`var(--color-ai-primary-end)`),
     a muted caption (e.g. "Anforderung KI Website-Generator"), and a short bold request
     line:

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
**Pattern 4 — Float / Gentle Bob** (`floatBob`). The backdrop image is **ALWAYS static** —
even when the contract includes a `Backdrop motion:` line, the image itself never moves (no
zoom, fade, pan, parallax, or drift). Only the floating fragments/annotations animate over
the still backdrop.

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
   [Color harmony](#color-harmony-the-four-opaque-styles) section below — derive the
   gradient from the imagery's measured dominant tone mixed toward the brand's deepest
   dark tone, e.g. IONOS Dark Midnight).
2. **Main interface wireframe** — the centerpiece, covering roughly **70-85% of the
   canvas**, sitting on the gradient root with rounded corners and a soft shadow.
3. **The catalog image is the hero/media asset INSIDE the wireframe** — placed in the
   interface's hero/media slot with `objectFit: 'cover'`, with the headline text rendered
   over it per the composition rules (welcome headline, contrast via text-shadow or a
   local panel — never a scrim over the image). Placeholder bars/content blocks sit below the hero, per the product-frame
   placeholder palette.
4. **1-2 floating highlight fragments** overlapping the wireframe's edge — a prompt
   bubble and/or a small mini-toolbar pill, per the **Floating Highlight Card template**
   (`ionos-wireframe-ai-animations.md`): borderless glass surface + plain neutral drop
   shadow (no AI glow — AI glow is on the CTA only), no border of any kind. The prompt
   bubble uses `var(--surface-base)` (reserve `ai-subtle` for the AI 'thinking' indicator
   only) with a muted caption and a gradient CTA (e.g. "✨ Seite erstellen" —
   `linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))`,
   white text). The AI gradient belongs to CTAs only, never to fragment chrome.

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

## Style: product-pop-out

Story: the product feature IS the builder/editor interface, and a character's hero portrait
pops out above it — the composite is meant to sit over any host background (marketing page,
dark hero section, image), never its own opaque frame.

Layer order:

1. **Root** — `<AbsoluteFill>` background: **TRANSPARENT** (no opaque fill). If the contract
   carries a `SAFE AREA:` line, reserve that transparent blank margin on the right/bottom and
   keep all elements inside the remaining content box; anything popping past an edge extends
   past the TOP edge only, never the reserved right/bottom margin.
2. **Product view** — a UDS-component wireframe of the IONOS builder/editor: a top bar (e.g.
   a Publish action), a left checklist, and a website canvas. Build it per the standard
   wireframe composition rules (`ionos-wireframe-composition.md`, `ionos-wireframe-product-frame.md`).
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
   the highlight text. Chrome follows the Floating Highlight Card template (borderless glass,
   plain neutral shadow — no AI glow on the chrome itself).
5. **AI styling (when this is an AI feature)** — the brand AI gradient on the CTA/Publish
   action and the prompt bubble, a soft AI glow on the highlight only, and a filled-sparkles
   icon. Not an AI feature → standard brand blue/sky, no AI gradient or glow anywhere.

No detached floating elements, no connector lines — the character reads as physically part of
the same composition as the interface, never a separate collage layer. Everything around the
product view and character stays transparent.

**Still gate**: frame 0 shows the interface fully laid out, the character's head already
clear of the interface's top edge, and (if present) the highlight bubble already settled.

## Style: device-mockup

Story: the product feature lives inside a device — a tablet or browser window — and (when a
character is supplied) a character stands in front of it, integrated with the device rather
than floating beside it. Like `product-pop-out`, this composite has no opaque backdrop of its
own — it composites onto whatever host background it's placed on.

Layer order:

1. **Root** — `<AbsoluteFill>` background: **TRANSPARENT**. If the contract carries a
   `SAFE AREA:` line, reserve that transparent margin the same way as `product-pop-out`
   (right/bottom stays empty; any pop-out extends past the TOP edge only).
2. **Device mockup** — a tablet OR browser-window mockup (with window chrome, e.g. the
   three-dot traffic-light row) containing the IONOS product UI as a UDS wireframe inside its
   screen area. The interface content BLEEDS slightly UNDER the bezel — there is no white gap
   between the mockup frame and the screen content. Use `staticFile()` for any in-screen media
   slot the supplied catalog image belongs in — never a generated image there.
3. **Character (if supplied)** — the cutout as `staticFile('<slug>.<format>')`, ONE INTACT
   portrait — a single whole person, never split or fragmented — standing IN FRONT of the
   device and INTEGRATED with it: the head and upper body rise ABOVE the device's top edge,
   and the torso overlaps the device's lower/front so the device floats BEHIND the character's
   upper part. The full figure is visible — never cropped at the top or sides — and it is
   never a separate, detached element floating apart from the device.

   Use the supplied cutout metrics: `cutout.headTopFrac` gives where the head begins (must
   clear the device's top edge); `cutout.subjectHeightFrac` gives the subject's height within
   the cutout. The character is DOMINANT (roughly 100-110% of canvas height); the device
   mockup is smaller (roughly 55-65% of canvas height) and floats behind the character.
4. **No character** — the device itself is the hero: centre it prominently, full-frame.
5. **Optional highlight** — a prompt bubble/card at the TOP z-index that INTERSECTS the
   mockup, floating partially outside its frame (extending past the TOP edge only when a safe
   area is reserved), stating the highlight text.

Everything around the device (and character, if present) stays transparent. No connector
lines. Use the standard AI-styling rule from `product-pop-out` step 5 for CTAs/highlights when
this is an AI feature.

**Still gate**: frame 0 shows the device fully rendered with its screen content already
composed, the character (if present) already integrated in front of it with the head clear of
the device's top edge, and any highlight already settled at its intersecting position.

## Color harmony (the four opaque styles)

The contract's `Color harmony:` line carries the backdrop imagery's **measured** tones
(dominant + supporting hexes, warm/cool, light/dark). This section does not apply to
`product-pop-out` / `device-mockup` — those are transparent-root composites with no
backdrop imagery to harmonize against. The composition must feel of-a-piece with the
imagery — never a brand-default background fighting the photo:

- **Root background gradient**: derive it from the dominant tone's hue family, darkened —
  mix the dominant hue toward the brand's deepest dark tone (for IONOS, Dark Midnight) at
  roughly 60-80% darkness. E.g. a dominant teal mixes toward a dark teal-navy gradient; a
  warm terracotta mixes toward a dark brown-navy gradient. Keep it calm and dark enough
  that white text and glass panels read.
- **What never changes**: panel glass stays neutral (`var(--surface-subtle)`), the brand
  AI gradient stays exactly what `uds-style-guide` defines (CTAs/badges only), brand
  component colors stay tokenized. Harmony lives in the ROOT background and subtle shadow
  tints — not in recolored UI, and NEVER in a scrim/overlay/darkening layer over the image.
- **Contrast supervision**: NEVER darken the backdrop image — no scrim, overlay, tint, or
  gradient over it; keep it at FULL brightness. Guarantee text contrast with a text-shadow
  or a local solid/glass panel behind the headline/text ONLY (sized to the text, not the
  image). Glow shadows may tint toward the dominant hue at low opacity instead of pure black.
- When the contract says "no measured imagery tones available", use the brand's dark
  navy/base family and keep contrast high.

## Verifying

Verify with the still gate: frame 0 shows the backdrop imagery plus the floating UI cleanly
composed — pointer style additionally shows the headline, marquee, panel, and connector;
full-bleed style shows the cluster over negative space with the photo's focal subject fully
visible; interface-asset style shows the full interface wireframe on the gradient root with
the imagery already filling its hero/media slot, the headline over it, and the floating
fragment(s) overlapping the wireframe's edge; floating-card style shows the single dominant
image card with its 2-3 intersecting elements already settled; product-pop-out shows the
interface fully laid out with the character's head already clear of its top edge; device-mockup
shows the device fully rendered with its screen content composed and (if supplied) the
character already integrated in front of it.
