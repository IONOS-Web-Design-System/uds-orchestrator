---
styles: [background-pointer, background-full, interface-asset, floating-card]
---

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
  gradient over it; keep it at FULL brightness. Guarantee contrast for any functional UI
  text (panel captions, buttons, badges) with a text-shadow or a local solid/glass panel
  behind that text ONLY (sized to the text, not the image). Glow shadows may tint toward
  the dominant hue at low opacity instead of pure black.
- When the contract says "no measured imagery tones available", use the brand's dark
  navy/base family and keep contrast high.

