# IONOS image style

- **Palette anchors:** IONOS Blue `#003D8F`, Sky `#11C7E6`, Dark Midnight `#001B41`,
  Cloud `#F4F7FA`, plus warm neutrals (cream, sand, light wood).
- **Tone:** professional, trustworthy, optimistic, modern. Warm and approachable — not
  cold or corporate. Scenes feel like a good, productive day.
- **Target audience — character profile:** IONOS people are **more established and mature**
  than Strato's audience. Default age range is **mid-30s to early 50s** — a small business
  owner, an experienced freelance consultant, a manager making real decisions. Encode age
  explicitly: `"a white woman in her early 40s"`, `"a Black man in his late 30s"`.
  Read `shared-character-appearance` for the occupation → appearance reasoning approach,
  then apply within these IONOS-specific boundaries:
  - **Hair:** clean, well-kept, naturally worn — neat shoulder-length, short professional,
    or a tidy practical style. Styled but not overdone. Never tousled, never casual bun,
    never the expressive/uncontrolled styles that signal Strato.
  - **Accessories:** minimal and functional — a watch, simple stud earrings, reading
    glasses on an older professional. No statement glasses frames, no headphones, no visible
    tattoos — those belong to Strato.
  - **Clothing:** smart-casual — fitted knitwear, neat blouses, clean casual shirts, well-cut
    trousers. Never hoodies, never oversized tees, never streetwear-adjacent. The person has
    dressed thoughtfully but comfortably.
  - **Variants:** same rule as all brands — when `variants > 1` and brief is generic, omit
    specific hair tokens; encode only a clothing vibe (`"smart casual knitwear"`) and let
    the image model vary hair naturally across variants.
- **Lighting:** natural and varied — cool-neutral morning light, direct sunshine,
  bright neutral midday, or warm ambient when the scene calls for it. Never the same
  golden afternoon light by default. Avoid dark, moody, or dramatically shadowed scenes.
- **Object colours:** use visually rich, saturated colours on individual props to
  create contrast and visual impact. Avoid scenes where every object is the same
  neutral or muted tone — include 2–3 distinct colour accents across props, clothing,
  and environment objects. Authentic, vivid colours (terracotta, cobalt, forest green,
  mustard, burgundy) make scenes feel alive. Do not impose brand colours unless
  the brief explicitly requests the IONOS palette.
- **Lighting contrast:** ensure visible tonal contrast between the subject and
  background — a well-lit subject against a slightly darker or differently toned
  background reads with more impact than a flat evenly-lit scene.
- **Environment:** neutral or lightly toned backgrounds (cream, light grey, soft white,
  natural wood) that let the colourful props and subject stand out.
- Photoreal: realistic materials and depth of field; no illustration/cartoon styling.
- Always add to negativePrompt: "text, watermark, logo, UI chrome, distorted hands,
  extra fingers, low quality, flat shadowless lighting, all-grey muted palette,
  dark moody lighting".
