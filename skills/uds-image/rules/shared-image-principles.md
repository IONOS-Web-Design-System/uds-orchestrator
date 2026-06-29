# Shared image principles (all brands)

- The brand palette and typography come from the inlined `uds-style-guide` rules for
  the active brand — read them; do not invent colors.
- Never request rendered text, wordmarks, logos, UI chrome, or watermarks — image models
  garble them. Put all of these in `negativePrompt`.
- Composition: clear focal subject, generous negative space, uncluttered background.
- Lighting: soft, natural, even. Avoid harsh shadows and blown highlights.
- Always include in `negativePrompt`: "text, watermark, UI chrome, distorted hands,
  extra fingers, oversaturated, low quality, jpeg artifacts,
  readable screen text, readable whiteboard text, legible labels,
  Apple logo, Nike logo, brand logo, corporate logo, product logo, visible logo,
  graphics or UI rendered on the back of a device, content on tablet back,
  screen graphics on device lid, colourful pattern on laptop lid".
- **Face and body framing must be stated positively in `prompt`, not in `negativePrompt`.**
  Negative prompts are weak composition signals — the image model ignores them under its
  default centre-crop bias. Instead encode framing as a positive instruction, e.g.:
  `"full face visible from hairline to chin, waist-up shot showing complete upper body"`
  or `"full body in frame from head to floor"`. See `image-type-portrait` for the required
  phrasing per shot type.
- Map the requested pixel dimensions to the nearest aspectRatio
  (1:1, 16:9, 4:3, 3:2, 9:16, 2:3, 3:4).

## Character diversity

When a brief includes a person but does not specify their ethnicity, body shape, age, or
gender, apply `character-diversity` to choose those characteristics. This rule applies to
all image types. Never leave character demographics undefined.

## Image type detection

Before writing the prompt, identify which image type the brief describes and apply the
matching rule file.

**Tie-breaker rules:**
- Brief names a person doing something in their environment (action is the story) → `scene`
- Brief asks for the person to face the camera with their character and identity as the story → `portrait`
- Brief focuses on a product, device, or interaction (person is secondary) → `scenario`
- Brief needs a face-visible square crop for profile/card use → `avatar`

When ambiguous between `scene` and `portrait`: ask whether the person's face and identity
are the primary message (→ `portrait`) or whether the activity and setting are (→ `scene`).

| Type | Rule file | Use when | Face guaranteed? |
|------|-----------|----------|-----------------|
| **avatar** | `image-type-avatar` | Face-focused square crop; face clearly visible at any angle; can show occupation context; 1:1 aspect ratio | Yes — always |
| **scene** | `image-type-scene` | Subject mid-action in their environment; setting and action are the story; character fits in naturally | No — optional |
| **portrait** | `image-type-portrait` | Subject faces camera; person's character, posture, and accessories are the story | Yes — always |
| **scenario** | `image-type-scenario` | Product/interaction is focal point; people are secondary or partial | No |
