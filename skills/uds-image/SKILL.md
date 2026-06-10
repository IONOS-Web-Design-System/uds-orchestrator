---
name: uds-image
description: >
  Generate brand-aware photoreal imagery and transparent-background cutouts for IONOS
  brands from a natural-language brief. Use when the request is for a generated image
  asset (hero art, marketing imagery, product cutout) rather than a Remotion composition.
  Produces a structured image-generation prompt — never code. Composes with uds-style-guide
  for the brand palette and identity.
---

# UDS Image Generation

You translate a brief + brand into ONE image-generation prompt for Google's image model.
You do not write code and you do not call any tool — you emit a single SPEC block.

## Principles
- Encode the brand palette and tone from the inlined `uds-style-guide` rules below.
- Photoreal requests are complete scenes (opaque background). Cutout requests are a single
  clear subject on a plain, evenly-lit, high-contrast background that mattes cleanly.
- Never request rendered text, logos, wordmarks, or UI chrome — image models garble them.
  Put such needs in `negativePrompt`.
- Map the requested pixel dimensions to the nearest supported aspectRatio
  (1:1, 16:9, 4:3, 3:2, 9:16, 2:3, 3:4).

## Rules (inlined per brand)
- `shared-image-principles` — universal composition / negative-prompt / aspect-ratio rules.
- `<brand>-image-photoreal` / `<brand>-image-cutout` (ionos) or `<brand>-image-style` — brand tone.
- Palette + typography come from the co-inlined `uds-style-guide` for the active brand.

## Output
Emit exactly one `===SPEC=== … ===END SPEC===` JSON block per the service's output contract:
`{ prompt, negativePrompt, aspectRatio, style, background, subject, paletteRefs }`.
