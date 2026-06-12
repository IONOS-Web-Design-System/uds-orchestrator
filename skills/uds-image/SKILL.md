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

## CRITICAL RULES — check before writing a single word of `prompt`

These override everything else. Violating any of them makes the image unusable.

**1. Face visibility — `portrait` and `avatar` types only. Does NOT apply to `scenario` or `person-scenario`.**

For `portrait` and `avatar`: the face is the anchor. Resolve in this priority order:

**Priority 1 — Face visibility (hard, non-negotiable for portrait/avatar):**
The subject's full face — hairline, eyes, nose, mouth, chin — must be completely
visible. Encode as the **first sentence** of `prompt` before anything else.

**Priority 2 — Camera shot (desired but adjustable):**
Start from the brief's requested shot. Widen automatically if the face cannot fit:

| Brief requests | Aspect ratio | Use this framing |
|---|---|---|
| waist-up | any | `"full face clearly visible from hairline to chin, waist-up shot showing complete upper body"` |
| full body / long shot | portrait (2:3, 3:4, 9:16) | `"full face clearly visible from hairline to chin, full body in frame from head to floor"` |
| full body / long shot | landscape (16:9, 4:3, 3:2) | `"full face clearly visible from hairline to chin, extra-wide establishing shot, character occupying one vertical third of the frame, full body visible from head to floor"` |
| avatar | 1:1 | `"face as the focal point, eyes and full face clearly visible, head and shoulders in frame"` |

**Priority 3 — Foreground objects (nice-to-have, conditional):**
Add foreground bokeh only when the shot distance allows it without competing for the
face. Place it as the **last sentence** of `prompt`. See `shared-environment-storytelling`.

---

For `scenario` and `person-scenario`: **do NOT prepend a face anchor.** The focal
subject is the product, device, or action. Start `prompt` with the device/interaction
description. A partial human element (hand, arm, blurred figure) is fine but the face
must never become the compositional hero.

Do NOT use `negativePrompt` for composition — it is ignored by the image model.

**2. No rendered text, logos, or UI chrome** — garbled by every image model. Put these
terms in `negativePrompt` only.

**3. Aspect ratio from dimensions** — map `dimensions.w × dimensions.h` to the nearest
supported ratio: `1:1 | 16:9 | 4:3 | 3:2 | 9:16 | 2:3 | 3:4`.

## Principles
- Encode the brand palette and tone from the inlined `uds-style-guide` rules below.
- Photoreal requests are complete scenes (opaque background). Cutout requests are a single
  clear subject on a plain, evenly-lit, high-contrast background that mattes cleanly.

## Image types
Every photoreal brief falls into one of four types — detect and apply the matching rule:
- `image-type-avatar` — square 1:1 crop for profile/card; face focal point; medium close-up head+shoulders
- `image-type-person-scenario` — subject mid-action in their environment (NOT posing, NOT facing camera)
- `image-type-portrait` — subject faces camera in their workplace; waist-up minimum; props reveal identity
- `image-type-scenario` — product/interaction is focal point; people are secondary or cropped

## Rules (inlined per brand)
- `shared-image-principles` — universal composition, image type detection, negative-prompt, aspect-ratio.
- `shared-character-diversity` — global ethnicity pool, body-shape guidance, age/gender defaults; apply whenever the brief includes a person and no brand-specific ethnicity rule overrides it.
- `ionos-character-ethnicity` (ionos brand only) — market-specific ethnicity pools keyed to the brief's showroom prefix or feature text (DE/US → white primary; ES/IT → Mediterranean primary; FR → French/Maghrebi mix); overrides `shared-character-diversity` when a market signal is detected.
- `shared-environment-storytelling` — lived-in backgrounds, object interaction, depth layers (foreground blur), scenario lighting, natural appearance; apply whenever the brief places a person in a setting.
- `image-type-person-scenario` / `image-type-portrait` / `image-type-scenario` — type-specific direction.
- `<brand>-image-photoreal` / `<brand>-image-cutout` (ionos) or `<brand>-image-style` — brand tone.
- Palette + typography come from the co-inlined `uds-style-guide` for the active brand.

## Output
Emit exactly one `===SPEC=== … ===END SPEC===` JSON block per the service's output contract:
`{ prompt, negativePrompt, aspectRatio, style, background, subject, paletteRefs }`.
