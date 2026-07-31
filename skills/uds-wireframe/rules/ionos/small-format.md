---
small: true
---

# Small-format illustrations

**When this applies:** the brief's dimensions are small — **under ~512px on both axes**
(e.g. 432×324, 480×480, social-card / inline-badge sizes). A whole product UI shrunk to fit
this canvas is unreadable. (For larger canvases, ignore this rule and use the standard
composition / product-frame guidance.)

Pick ONE of two approaches:

- **Icon-story** — an abstract composition of a central motif + connected services + a
  connector (see "icon-story grammar" below). Best for integration / multi-service / concept
  stories.
- **Cropped product frame** — show a REAL product frame, but **cropped to its important
  corner at a legible scale**, letting the rest bleed off the canvas edges (see "Cropped
  product frame" below). Best when the brief is about a specific product screen/feature.

Either way: **the fix for "UI too small to read" is to CROP, not to SHRINK** — show fewer
elements at a legible size rather than the whole UI in miniature. Icons are **large and
prominent** at this scale (see "Icon sizing").

## Background — `surface-subtlest`, or the AI-showroom gradient

The canvas is `var(--surface-subtlest, #DBEDF8)` unless this render's non-negotiables carry a
`CANVAS BACKGROUND:` line — an AI-showroom render carries the brand gradient there instead.
Follow that line when present; otherwise use `surface-subtlest`. Never hardcode a different
colour of your own choosing. Set it on the themed wrapper (it resolves per `data-brand` /
`data-color-scheme`):

```tsx
<div data-brand={brand} data-platform={platform} data-color-scheme={colorScheme}
     style={{ width: '100%', height: '100%' }}>
  <ThemeProvider>
    <AbsoluteFill style={{ backgroundColor: 'var(--surface-subtlest, #DBEDF8)' }}>
      {/* …or the CANVAS BACKGROUND gradient when the non-negotiables name one */}
      {/* icon-story composition */}
    </AbsoluteFill>
  </ThemeProvider>
</div>
```

For ionos light this default resolves to a pale blue; do not hardcode a hex — use the token so
it follows the brand/scheme when no `CANVAS BACKGROUND:` line applies. (Equivalent utility
class: `bg-surface-subtlest`.)

## The icon-story grammar

Compose three roles — central motif + connected services + a connector that tells the story:

1. **Central motif** — the IONOS subject. Either:
   - a **brand/system icon** rendered large (e.g. a `shield`+`lock` for security, a
     `cloud-migration` / `analytics` / `ai-mail-assistant` brand icon for a product), or
   - a **small abstract wireframe** — a rounded card with 2–3 IONOS-blue placeholder bars,
     or a minimal app frame (slim nav rail + a few rows). Keep it abstract at this size. (To
     show a *realistic* product frame at small size, use the cropped-frame approach below
     instead of shrinking a whole UI into the canvas.)
2. **Connected services** — when the brief **names external apps/services** (WEB.DE, GMX,
   Outlook, Magento, WooCommerce, IONOS eShop, …), place their **real logos from the
   `# Available assets` catalog** via `staticFile('<slug>.<format>')`, small and inline,
   flanking or orbiting the central motif. **Never hand-draw a fake brand logo** — if the
   named logo is not in the catalog, omit it or use a neutral placeholder, don't fake it.
3. **Connector** — show the integration/story between the motif and the services with one of:
   woven/braided IONOS-blue flow lines, concentric "reach" rings, short hub-and-spoke
   connector lines, or simple adjacency/overlap.

## Cropped product frame — show the important corner, let it bleed off-canvas

To show a real product screen at small size, **anchor the frame to one corner at a legible
scale and let the rest run off the canvas edges** — never scale a whole UI down to fit. The
visible region carries the meaning; the off-canvas remainder just implies "this is a full
product".

Grammar (mirrors the reference assets):
- **Anchor & bleed.** Pin the frame to the **top-left** (or top corner): give it a fixed
  large size (its natural ~700–900px width) positioned so its left/top sit at a small inset
  and its right/bottom extend **past the canvas**. Set `overflow: 'hidden'` on the root
  `AbsoluteFill` so the bleed clips to a clean edge — UNLESS this is a `product-pop-out`
  composite, where the root must stay unclipped (see `product-pop-out/composition.md`). Only
  the sidebar + a few rows + the highlighted feature stay in view; the far edge is cut off.
- **Show the navigational anchor.** Keep the brand's dark navy **sidebar/nav rail** (with the
  IONOS wordmark and 3–4 large nav icons) in frame on the left — it's what reads as "a real
  product". Then a few content rows / list items / a chart in the main pane.
- **Legible, not miniature.** Rows ~12–18px tall, real placeholder bars, nav icons large
  (see Icon sizing). If it looks cramped, show FEWER elements — do not shrink.
- **Large floating highlights over the frame edge.** 1–2 prominent elements straddling the
  frame's cut edge — big **circular icon badges** on the left/bottom edge, or a **stat card**
  (e.g. an icon + "+58 %") at the top-right — per the floating-highlight-card template. The
  canvas shows around the frame's exposed corners per the Background rule above (`surface-subtlest`
  by default, or the AI-showroom gradient when the non-negotiables name one).
- Animate the entrance (frame eases in, highlights pop after it settles); follow the
  text-stability rule — no perpetual transform on text-bearing cards.

## Icons to use

- IONOS **brand product icons** and **system icons**: import via the `svgData` deep-import
  recipe and the **verified allowlist** in `remotion-best-practices` (do not guess names —
  a non-existent name fails the render bundle; fall back to a `system/` icon when unsure).
- **Social platform glyphs** (`dist/social/instagram`, `…/facebook`, etc.) for social-media
  scenarios.

### Icon sizing — large and prominent at small format

Small icons read as noise on a small canvas. Size them **up**, relative to the canvas:
- **Sidebar / nav icons:** ~36–56px glyphs, usually inside rounded-square buttons (the active
  one in a filled brand-blue tile, as in the reference).
- **Circular badge / motif icons:** glyph ~28–44px inside a **64–96px** coloured circle
  (cyan / green / brand-blue), floating over or beside the frame.
- **Floating-stat / chip icons:** ~24–32px.
- Avoid sub-20px icons at this scale. The central motif of an icon-story can be very large
  (up to ~40% of the shorter canvas edge).

## AI features — render one AI-gradient BADGE (keep it off chrome and plain icons)

When the brief is a **genuine AI feature**, the composition MUST carry the IONOS AI
signature. The gradient's placement rule is unchanged and correct: it belongs to an **AI CTA
or AI badge ONLY — never the panel chrome, the nav rail, connector lines, or a plain icon**
(those stay on brand tokens). At small format there is usually no CTA, so the gradient's home
is a **badge**: include one small **AI badge / status pill** — a labelled chip naming the AI
capability (a short "AI" / "KI" label, optionally with the sparkle glyph inside it) — and fill
**that badge** with the brand AI gradient. In an icon-story, sit the badge on or beside the
central motif; in a cropped product frame, let it straddle the frame edge as the floating
highlight. This is a sanctioned badge use per `uds-style-guide/rules/ionos-ai-features.md`
(the gradient applies to an AI CTA **or badge**).

- The badge is the **single** AI-gradient element. The sparkle glyph, the hub/central motif,
  service icons, connectors, and card/panel chrome stay on brand tokens (brand blue /
  `surface-*`) — do NOT fill them with the gradient (a navy "premium" chip with no gradient
  is NOT the AI signature either).
- **Size it as an accent, not the hero:** a compact pill (~24–32px tall) or a small circular
  badge — it annotates the composition; it must not out-size the central motif / cropped frame.
- Do NOT substitute brand sky/cyan (`#11C7E6`) for the AI signal — that is a generic CTA
  colour, not the AI signature (see `ionos-ai-features`). An AI feature with no gradient
  anywhere is a miss.

Use the brand AI gradient exactly (hardcode in Remotion — CSS custom properties may not
resolve in a render): `linear-gradient(45deg, #095BB1, #D746F5)` — `#095BB1` =
`var(--color-ai-primary-start)`, `#D746F5` = `var(--color-ai-primary-end)`. A non-AI brief
stays on standard brand blue/sky with no gradient.

## Motion

Keep it minimal and **looping** (briefs may set `loop:true`): connector lines flow, rings
pulse outward, logos ease/float in, a lock clicks once. Frame-driven only (`useCurrentFrame`
+ `interpolate`) — never CSS transitions. A still `illustration` intent needs no motion.

**Looping motion goes on non-text layers only.** Float/bob/pulse the icons, logos, rings, and
connectors — NOT a chip, pill, label, or any element that renders readable text. Text-stability
(never animate a transform on text-bearing layers; avoid shimmer/sub-pixel drift): see
remotion-best-practices `shared-motion-text.md` (always in effect).

## Hybrid in small format (generated image present)

If the moderator dispatched a **hybrid** brief, a generated image arrives as a catalog asset
named in the brief (reference it via `staticFile()`). The `[HYBRID EMBED CONTRACT]` block in the
brief names the `Style:` — follow it. The three small-format usages map to the moderator's
embed styles:

1. **Full-bleed background** (`Style: image-backdrop full-bleed`, embed style `background-full`)
   — the image fills the canvas (`<Img>` `objectFit:'cover'`); render 1–3 floating UI fragments
   over its negative space.
2. **Inline in the cropped product frame** (`Style: interface-asset`) — the image is the
   media/hero slot *inside* the product frame; on this small canvas, **crop** that frame per
   "Cropped product frame" above (bleed off-canvas, large icons) and keep the hero media in
   the visible region — do not shrink a whole UI to fit.
3. **Floating image card + highlight UI** (`Style: floating image card with edge highlights`,
   embed style `floating-card`) — the image is a single contained rounded card (dominant,
   ~60–80% of canvas, soft shadow) on the canvas background (per the Background rule above —
   `surface-subtlest` by default, or the AI-showroom gradient), with 1–2 small
   highlight chips/pills (a labelled chip and/or an icon pill) overlapping its edges; no
   connector lines, no selection marquee. Transparent cutouts also work well here.

Keep the canvas background (per the Background rule above) in usages #2 and #3; usage #1
replaces it with the image.
