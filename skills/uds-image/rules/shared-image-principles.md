# Shared image principles (all brands)

- The brand palette and typography come from the inlined `uds-style-guide` rules for
  the active brand — read them; do not invent colors.
- Never request rendered text, wordmarks, logos, UI chrome, or watermarks — image models
  garble them. Put all of these in `negativePrompt`.
- Composition: clear focal subject, generous negative space, uncluttered background.
- Lighting: soft, natural, even. Avoid harsh shadows and blown highlights.
- Always include in `negativePrompt`: "text, watermark, logo, UI, distorted hands,
  extra fingers, oversaturated, low quality, jpeg artifacts".
- Map the requested pixel dimensions to the nearest aspectRatio
  (1:1, 16:9, 4:3, 3:2, 9:16, 2:3, 3:4).
