---
small: true
---

# Small-format illustrations (STRATO)

**When this applies:** the brief's dimensions are small — **≤ 512px on both sides**
(e.g. 432×432, 400×300, 512×512 bento tiles, social-card / inline-badge sizes). A whole product
UI shrunk to fit this canvas is unreadable. (For larger canvases, ignore this rule and use the
standard composition / product-frame guidance.) STRATO-only: the canvas, shell and colours below
are STRATO's — `uds-ui-core/rules/strato/visual-language.md` supplies the full shell details.

## Decide by context: product feature → cropped frame, otherwise → icon-story

Read what the brief is ABOUT, then pick exactly one approach:

| The brief's context is… | Approach |
|---|---|
| **A product feature** — something the user does or sees *inside a specific product*: a screen, panel or tool of it, a function (share, search, generate, edit, publish, restore), an AI capability working in its UI, a result/status it shows | **Cropped product frame with feature storytelling** (see "Cropped product frame" below) |
| **Anything else** — a concept, benefit or promise (security, encryption, backups included, speed, data in Germany, savings), an integration or sync between devices/services/apps, a category or offer, a multi-product overview, an abstract value proposition | **Icon-story** (see "icon-story grammar" below) |

Ask: "could a customer point at this on their screen inside the product?" Yes → cropped
frame. No → icon-story. A product name alone does not decide it — "HiDrive share links with a
password and an expiry date" is a feature (cropped frame: the share dialog); "HiDrive encrypts
your files with AES" is a promise (icon-story: a large lock/shield motif).

**Feature storytelling (cropped frame):** the frame sets the scene, the feature is the plot.
Keep the region where the feature happens in view at a legible scale, and let 1–2 floating
highlights **pop out over the frame's cut edge** to tell what the feature does — the moment it
acts (a status chip turning "Aktiv", the link being copied, the result card or stat it
produces). In an animation the story runs in order: frame settles → the feature acts → the
highlight pops.

**Never the in-between:** a complete card or mini product frame, fully visible and centred
with orange margins on every side, is NEITHER approach — it is a whole UI shrunk to fit. If
it is a product feature, enlarge the frame past the canvas and crop it; if it is not,
switch to an icon-story.

**Planner:** state the chosen approach and its anatomy in the first sentence of the
illustration brief's `feature`, e.g. "Cropped product frame of <product> anchored top-left,
bleeding off the right and bottom edges; the <feature> pops out as a floating highlight…"
or "Icon-story: <central motif> with <connected services>…" — the illustration generator
draws what that sentence says. **Illustration generator:** this context decision outranks
any generic preference for an icon-story elsewhere in the prompt; when the brief describes
a product feature, build the cropped frame.

Either way: **the fix for "UI too small to read" is to CROP, not to SHRINK** — show fewer
elements at a legible size rather than the whole UI in miniature. Icons are **large and
prominent** at this scale (see "Icon sizing").

## Background — the STRATO brand gradient

The canvas is the STRATO brand gradient, exactly as in `strato/visual-language.md`:

```tsx
<div data-brand={brand} data-platform={platform} data-color-scheme={colorScheme}
     style={{ width: '100%', height: '100%' }}>
  <ThemeProvider>
    <AbsoluteFill style={{ background:
      'linear-gradient(135deg, var(--color-gradient-start, #FF8800), var(--color-gradient-end, #FFC700))' }}>
      {/* cropped frame or icon-story */}
    </AbsoluteFill>
  </ThemeProvider>
</div>
```

- A dark scheme (`colorScheme === 'dark'`) uses the STRATO blue gradient instead:
  `linear-gradient(135deg, #2F2F70, #272CB2)`.
- When this render's non-negotiables carry a `CANVAS BACKGROUND:` line, it wins.
- Only the canvas carries a gradient. Frames, cards, chips and badges on it are solid white /
  light surfaces (STRATO uses no gradients on small UI elements).

## The icon-story grammar

The icon-story lives **directly on the canvas background** — never inside a card, panel or
window wrapping the whole composition (that turns it back into a shrunk UI). No headline
or sub-line text block; at most a short label on a pill or chip.

Compose three roles — central motif + connected services + a connector that tells the story:

1. **Central motif** — the STRATO subject. Either:
   - a **brand product or system icon** rendered large on a solid **white disc or white
     rounded tile** (`var(--surface-base, #FFFFFF)`, soft shadow) so it reads on the orange
     canvas — e.g. a lock / shield for encryption, a cloud with a restore arrow for backups,
     two devices for sync (name the concept, per `uds-asset-moderator/rules/shared-product-icon-substitution.md`,
     and let the illustration generator resolve it), or
   - a **small abstract wireframe** — a white rounded card with 2–3 placeholder bars in Light
     Blue `#EDEEF3`, or a minimal white app frame with an orange accent strip. Keep it abstract
     at this size. (To show a *realistic* product frame, use the cropped-frame approach below.)
2. **Connected services** — when the brief names external apps, services or devices (a phone
   and a laptop for sync, Microsoft 365, WordPress, WooCommerce, …), place their **real logos
   from the `# Available assets` catalog** via `staticFile('<slug>.<format>')`, or a filled
   system icon for a device, each on its own small white disc, flanking or orbiting the motif.
   **Never hand-draw a fake brand logo** — if the named logo is not in the catalog, omit it or
   use a neutral placeholder.
3. **Connector** — show the story between the motif and the services with one of: white flow
   lines (solid `#FFFFFF` at ~70–90 % opacity, 2–4px), concentric white "reach" rings at low
   opacity, short hub-and-spoke lines, or simple adjacency/overlap. Never blue or grey lines on
   the orange canvas — they muddy it.

Status chips beside the motif (e.g. "Aktiv", "Täglich", "Verschlüsselt") are solid white pills
with Dark Blue `#2F2F70` text and a filled check icon in STRATO Blue `#272CB2`.

## Cropped product frame — show the important corner, let it bleed off-canvas

To show a real STRATO product screen at small size, **anchor the frame to one corner at a
legible scale and let the rest run off the canvas edges** — never scale a whole UI down to
fit. The visible region carries the meaning; the off-canvas remainder implies "this is a full
product".

Grammar:
- **Anchor & bleed.** Pin the white frame to the **top-left** (or top corner): give it a fixed
  large size (its natural ~700–900px width) positioned so its left/top sit at a small inset
  (~20–32px, the orange canvas showing around that corner) and its right/bottom extend **past
  the canvas**. Set `overflow: 'hidden'` on the root `AbsoluteFill` so the bleed clips to a clean
  edge — UNLESS this is a `product-pop-out` composite, where the root must stay unclipped. Only
  the shell anchor + a few rows + the highlighted feature stay in view; the far edge is cut off.
- **Show the navigational anchor — ONE of the two STRATO shells** (`strato/visual-language.md`):
  - the **light sidebar with the orange logo tile** at its top (white `strato-lite-mono-dark`
    cube on `#FF8800`) and 3–4 large filled nav icons in `#8493B3`, the active one on a filled
    rounded tile in STRATO Blue `#272CB2` with a white icon; or
  - the **orange accent header** (`#FF8800`) across the top with the white `strato-mono-dark`
    wordmark at 16–18px height, wrapped in its own `data-color-scheme="dark"` div.
  Never the IONOS navy rail. Then a few content rows / list items / a status panel in the main
  pane on `surface-base`, text in Dark Blue `#2F2F70`.
- **Legible, not miniature.** Rows ~14–20px tall, Poppins, real placeholder bars in `#EDEEF3`,
  nav icons large (see Icon sizing). If it looks cramped, show FEWER elements — do not shrink.
- **Large floating highlights over the frame edge.** 1–2 prominent elements straddling the
  frame's cut edge — a big **circular icon badge** (solid STRATO Blue `#272CB2` circle, white
  filled icon) on the left/bottom edge, or a white **stat / status card** with a soft shadow
  (e.g. a filled check + "Link kopiert", or an icon + "7 Tage") at the top-right — per the
  floating-highlight-card template. Highlights are white or solid blue, never orange (they would
  vanish into the canvas) and never a gradient.
- Animate the entrance (frame eases in, highlights pop after it settles); follow the
  text-stability rule — no perpetual transform on text-bearing cards.

## Icons to use

- **Filled system icons only** (`@ionos-web-design-system/icon/system/filled-<name>`), never the
  outline names or `<name>300` weights — the icon name index for this render lists only these.
- The central motif of an icon-story is normally a **brand product icon** — full-colour and
  illustrative, sized large, on its white disc. That is what makes a small canvas read as "this
  specific product" rather than generic UI.
- **Social platform glyphs** (`icon/social/instagram`, `icon/social/facebook`, …) for
  social-media scenarios.

Name the concept (never a slug or filename) and let the illustration generator resolve it
against its own `# Icon name index`.

### Icon sizing — large and prominent at small format

- **Sidebar / nav icons:** ~32–48px glyphs; the active one on its filled blue tile.
- **Circular badge / motif icons:** glyph ~28–44px inside a **64–96px** circle (white disc on
  the canvas, or a solid `#272CB2` badge over the frame edge).
- **Floating-stat icons:** ~24–32px.
- Avoid sub-20px icons at this scale. The central motif of an icon-story can be very large
  (up to ~40% of the shorter canvas edge).

## AI features — one kit AI mark (cyan→pink, never orange)

When the brief is a **genuine AI feature** (`aiFeature` / `aiStyled`), the composition MUST
carry the STRATO AI signature (`uds-style-guide/rules/strato-ai-features.md`) on ONE element —
never the panel chrome, the shell, connector lines or a plain icon:

- a floating AI prompt → the shipped `<PromptWindow brand="strato" …>` template
  (`uds-ui-core/rules/strato/prompt-window.md`); at this size prefer `variant="prompt-simple"`
  at ~60–75% of the canvas width, straddling the frame's bottom or left edge over the canvas; or
- `<KitIconButton ai icon={sparkles} title={texts.aiLabel ?? ''} size="large" />` — the AI icon
  action, or `<KitButton label={texts.cta ?? ''} concept="ai" icon={sparkles} size="small" />`
  when the brief has a short AI action label.

The kit and the template take the cyan→pink `#1FD7FF → #E498FF` from the tokens with dark
`#29294D` text — never white text on it, never the orange brand gradient as an AI signal, never
an IONOS colour. Size it as an accent, not the hero. A non-AI brief uses no AI element at all.

## Motion

Keep it minimal and **looping** where the brief sets `loop:true`: connector lines flow, rings
pulse outward, icon discs ease/float in, a lock clicks shut once, a check pops onto a chip.
Frame-driven only (`useCurrentFrame` + `interpolate`) — never CSS transitions. A still
`illustration` intent needs no motion.

**Looping motion goes on non-text layers only.** Float/bob/pulse the icons, discs, rings and
connectors — NOT a kit element, a label, or any element that renders readable text (see
remotion-best-practices `shared-motion-text.md`, always in effect).

## Hybrid in small format (generated image present)

If the moderator dispatched a **hybrid** brief, a generated image arrives as a catalog asset
named in the brief (reference it via `staticFile()`). The `[HYBRID EMBED CONTRACT]` block names
the `Style:` — follow it:

1. **Floating image card + highlight UI** (`floating-card`) — the image is a single contained
   rounded card (dominant, ~60–80% of canvas, soft shadow) on the orange canvas, with 1–2 small
   white highlights (a `KitPill` status chip and/or a `KitIconButton`, each in a positioned
   parent `div`) overlapping its edges; no connector lines, no selection marquee.
2. **Inline in the interface** (`inline-asset` / `interface-asset`) — the image is the media
   slot *inside* the white product frame; crop that frame per "Cropped product frame" above
   and keep the media in the visible region.
3. **Full-bleed background** (`background-full`, only when the contract names it) — the image
   fills the canvas (`objectFit:'cover'`); render 1–3 white floating UI fragments over its
   negative space.

Usages #1 and #2 keep the orange canvas; usage #3 replaces it with the image.
