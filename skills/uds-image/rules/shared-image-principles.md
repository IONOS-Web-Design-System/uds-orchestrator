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
  Apple logo, Nike logo, brand logo, corporate logo, product logo, visible logo".
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
matching rule file. If the brief is ambiguous, prefer `portrait` for person-focused briefs
and `scenario` for product/usage-focused briefs.

| Type | Rule file | Use when |
|------|-----------|----------|
| **avatar** | `image-type-avatar` | Square crop for profile/card use; face is focal point; medium close-up; 1:1 aspect ratio |
| **person-scenario** | `image-type-person-scenario` | Subject is mid-action in their environment; story is told through what they're doing |
| **portrait** | `image-type-portrait` | Subject faces camera in their environment; story told through identity, attire, props |
| **scenario** | `image-type-scenario` | Product/interaction is the focal point; people are secondary or partial |
