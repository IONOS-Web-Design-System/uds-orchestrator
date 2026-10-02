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
   - a **brand/system icon** rendered large (e.g. a `shield`+`lock` for security, or a brand
     product icon for a concept like cloud migration, analytics, or an AI mail assistant —
     name the concept, per `shared-product-icon-substitution.md`, and let the illustration
     generator resolve it), or
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

- The central motif of an icon-story is normally a **brand product icon** — full-colour and
  illustrative, sized large (see *Icon sizing* below). That is what makes a small canvas read
  as "this specific product" rather than as generic grey UI.
- **System icons** for the affordances around it — nav glyphs, status marks, controls.
- **Social platform glyphs** (`icon/social/instagram`, `icon/social/facebook`, …) for
  social-media scenarios.

Every product concept has a match in the illustration generator's own `# Icon name index` —
there is no need to hedge toward `system/`. Name the concept (never a slug or filename) and
let the illustration generator resolve it against that index; a brand icon that fits the
product is always the better central motif.

### Icon sizing — large and prominent at small format

Small icons read as noise on a small canvas. Size them **up**, relative to the canvas:
- **Sidebar / nav icons:** ~36–56px glyphs; the active one
  sits on a drawn filled brand-blue rounded-square tile, as in the reference (frame chrome).
- **Circular badge / motif icons:** glyph ~28–44px inside a **64–96px** coloured circle
  (cyan / green / brand-blue), floating over or beside the frame.
- **Floating-stat icons:** ~24–32px.
- Avoid sub-20px icons at this scale. The central motif of an icon-story can be very large
  (up to ~40% of the shorter canvas edge).

## AI features — one kit AI mark (keep the AI concept off chrome and plain icons)

When the brief is a **genuine AI feature**, the composition MUST carry the brand AI
signature. The AI concept belongs to an **AI CTA or AI icon action ONLY — never the panel
chrome, the nav rail, connector lines, or a plain icon** (those stay on brand tokens). At small
format there is usually no CTA, so the AI signature is **one kit AI element**:

- `<KitIconButton ai icon={sparkles} title={texts.aiLabel ?? ''} size="large" />` — the AI icon action
  (gradient icon from the brand tokens), or
- `<KitButton label={texts.cta ?? ''} concept="ai" icon={sparkles} size="small" />` when the brief has a
  short AI action label.

In an icon-story, sit it on or beside the central motif; in a cropped product frame, let its
parent `div` straddle the frame edge as the floating highlight.

```tsx
import sparkles from '@ionos-web-design-system/icon/system/filled-sparkles';
import { KitIconButton } from './kit';

<div style={{ position: 'absolute', right: 24, bottom: 24 }}>
  <KitIconButton ai icon={sparkles} title={texts.aiLabel ?? ''} size="large" />
</div>
```

- It is the **single** AI element. The hub/central motif, service icons, connectors, and
  card/panel chrome stay on brand tokens (brand blue / `surface-*`) — do NOT draw an AI gradient
  on them (a navy "premium" chip is NOT the AI signature either).
- **Size it as an accent, not the hero:** it annotates the composition; it must not out-size the
  central motif / cropped frame.
- Do NOT substitute brand sky/cyan for the AI signal, and at small format never hand-draw an
  AI gradient chip: the kit element carries the brand's AI concept (IONOS blue→magenta, STRATO
  cyan→pink) and reads at this size. (The drawn AI badge in
  `uds-style-guide/rules/ionos-ai-features.md` "AI badges" is the only sanctioned drawn AI chip,
  for larger formats where a labelled badge is needed — the kit has no AI chip.) An AI feature
  with no AI element anywhere is a miss. A non-AI brief uses neither `ai` nor `concept="ai"`.

## Motion

Keep it minimal and **looping** (briefs may set `loop:true`): connector lines flow, rings
pulse outward, logos ease/float in, a lock clicks once. Frame-driven only (`useCurrentFrame`
+ `interpolate`) — never CSS transitions. A still `illustration` intent needs no motion.

**Looping motion goes on non-text layers only.** Float/bob/pulse the icons, logos, rings, and
connectors — NOT a kit element, a label, or any element that renders readable text. Text-stability
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
   highlights (a `KitPill` status chip and/or a `KitIconButton`, each in a positioned parent `div`) overlapping its edges; no
   connector lines, no selection marquee. Transparent cutouts also work well here.

Keep the canvas background (per the Background rule above) in usages #2 and #3; usage #1
replaces it with the image.
