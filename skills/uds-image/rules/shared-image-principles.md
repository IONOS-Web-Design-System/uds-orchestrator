# Shared image principles (all brands)

- The brand palette and typography come from the inlined `uds-style-guide` rules for
  the active brand — read them; do not invent colors.
- Never request rendered text, wordmarks, logos, UI chrome, or watermarks — image models
  garble them. Put all of these in `negativePrompt`.
- Composition: clear focal subject, generous negative space, uncluttered background.
- Lighting: your brand's tone rule owns lighting direction and quality — `ionos-image-photoreal`
  for IONOS, otherwise `<brand>-image-style`. If your brand's rule states no lighting direction,
  default to abundant natural light from ONE clear direction, scene-appropriate in temperature,
  with visible light-to-shadow separation. Never flat, shadowless or uniformly lit — that is what
  produces depthless frames.
- When a `Photographic treatment:` line is present in the prompt, it is AUTHORITATIVE for camera
  angle, framing, lens, lighting direction and quality, colour grade and atmosphere. Do not also
  emit your own choices for those axes, and do not contradict it.
- negativePrompt carries only true rendering artifacts (text, watermark, logo, distorted
  hands, extra fingers, low quality). It is appended to the positive prompt by the service,
  so keep it SHORT and never put composition, lighting or palette instructions in it.
- **Face and body framing must be stated positively in `prompt`, not in `negativePrompt`.**
  Negative prompts are weak composition signals — the image model ignores them under its
  default centre-crop bias. Instead encode framing as a positive instruction: state plainly
  that the full face stays uncropped and describe the body's extent in frame (e.g. upper body
  only, or the full figure head to floor). See `shared-image-type-portrait` for the reasoning
  behind each shot type — describe it in your own words rather than reusing one fixed phrase
  every time.
- Map the requested pixel dimensions to the nearest aspectRatio
  (1:1, 16:9, 4:3, 3:2, 9:16, 2:3, 3:4).

## Character diversity

When a brief includes a person but does not specify their ethnicity, body shape, age, or
gender, apply `character-diversity` to choose those characteristics. This rule applies to
all image types. Never leave character demographics undefined.

## Image type detection

See `shared-image-type-detection` for the tie-breaker rules and the type table.
