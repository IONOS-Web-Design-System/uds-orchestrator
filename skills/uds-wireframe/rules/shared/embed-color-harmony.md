---
styles: [background-pointer, background-full, interface-asset, floating-card, inline-asset]
---

## Color harmony (the five opaque styles)

The contract's `Color harmony:` line carries the embedded imagery's **measured** tones
(dominant + supporting hexes, warm/cool, light/dark) — a full-bleed backdrop for
`background-pointer`/`background-full`, a contained card for `floating-card`/`interface-asset`, a
contained media/hero asset for `inline-asset`. This section does not apply to `product-pop-out` /
`device-mockup` — those are transparent-root composites with no embedded imagery of their own to
harmonize against (the cutout is the subject, not a photo whose tones the root should echo). The
composition must feel of-a-piece with the imagery — never a brand-default background fighting the
photo:

> **AI showrooms override this.** When this render's non-negotiables carry a `CANVAS BACKGROUND:`
> line, use that gradient as the root and skip the palette-derived derivation below. The harmony
> rules still govern every OTHER layer (card fills, chips, text) so the imagery and the UI stay
> tonally related.

- **Root background gradient**: derive it from the dominant tone's hue family, darkened —
  mix the dominant hue toward the brand's deepest dark tone (for IONOS, Dark Midnight) at
  roughly 60-80% darkness. E.g. a dominant teal mixes toward a dark teal-navy gradient; a
  warm terracotta mixes toward a dark brown-navy gradient. Keep it calm and dark enough
  that white text and glass panels read.
- **What never changes**: panel **surface** stays neutral (`var(--surface-subtle)`), the brand
  AI gradient stays exactly what `uds-style-guide` defines (CTAs/badges only), brand
  component colors stay tokenized. Harmony lives in the ROOT background and subtle shadow
  tints — not in recolored UI, and NEVER in a scrim/overlay/darkening layer over the image.
- **Contrast supervision**: NEVER darken the embedded image — no scrim, overlay, tint, or
  gradient over it; keep it at FULL brightness. Guarantee contrast for any functional UI
  text (panel captions, buttons, badges) with a text-shadow or a local solid/glass panel
  behind that text ONLY (sized to the text, not the image). Glow shadows may tint toward
  the dominant hue at low opacity instead of pure black.
- When the contract says "no measured imagery tones available", use the brand's dark
  navy/base family and keep contrast high.

