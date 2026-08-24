# Shared image principles (all brands)

- The brand palette and typography come from the inlined `uds-style-guide` rules for
  the active brand — read them; do not invent colors.
- Never request rendered text, wordmarks, logos, UI chrome, or watermarks — image models
  garble them. Put all of these in `negativePrompt`.
- Composition: clear focal subject, generous negative space, uncluttered background.
- Lighting, camera and atmosphere resolve in this order. An injected `Photographic camera:` line
  wins outright for camera angle, framing, shot size, subject turn and lens — do not also emit
  your own choices for those axes, and do not contradict it. An injected `Photographic lighting:`
  line wins outright for lighting direction and quality, contrast, colour grade and atmosphere —
  same rule. The two lines are independent: one may be present without the other, and each
  governs only its own axis. Where neither line is present, your brand's tone rule owns lighting
  direction and quality — `ionos-image-photoreal` for IONOS, otherwise `<brand>-image-style` —
  and your image-type rule owns camera framing. If your brand's rule states no lighting
  direction, default to abundant natural light from ONE clear direction. Never flat, shadowless
  or uniformly lit.
- Vary the lighting setup between images rather than settling into one look. A set of images that
  all share the same key direction, contrast and grade reads as templated even when each image is
  individually good. Where a `Photographic lighting:` line is present it has already made this
  choice for you; where it is absent, choose deliberately and differently.
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

See `shared-image-type-detection`. It is an ORDERED rubric, not a lookup table: four types —
`device-focused`, `avatar`, `portrait`, `scene` — evaluated in that order, first match wins, and
`scene` is the default when nothing else clearly fits. There are no tie-breakers to consult,
because the ordering IS the tie-break.

You only classify when no type was pinned for you. When a `# Image type (fixed)` block is
present, that decision is already made: the matching `shared-image-type-<type>` rule is
inlined instead of the rubric, and you apply it without re-detecting.
