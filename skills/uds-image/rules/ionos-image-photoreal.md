# IONOS — photoreal imagery

## Mood and lighting

IONOS photography feels approachable, calm, and well-lit — not dark, moody, or
dramatically directional. The lighting should feel natural and varied, harmonised
with the specific setting rather than defaulting to the same "golden afternoon" look.

- **Natural, scene-appropriate light:** choose the light source that actually belongs
  in the environment. Morning office → cool-neutral diffused daylight. Café midday →
  bright neutral window light. Workshop → soft neutral industrial light. Do not
  default to warm golden hour in every scene; vary the time of day and light quality.
- **Neutral to slightly warm range:** a natural daylight temperature (5000–6500 K,
  cool-neutral to neutral) is the default. Warmer light is fine when the scene
  genuinely calls for it (candle-lit restaurant, cosy evening workspace) but should
  not be applied universally.
- **Contrast for visual impact:** scenes should have clear tonal contrast between the
  subject and the background. Flat, uniformly grey or muted images lack punch —
  use the light source to create a visible difference between lit and shadow areas,
  even if shadows remain soft. A well-exposed subject against a slightly darker
  background reads with more impact than a uniformly lit scene.
- **Directionality:** light from one clear direction (window, sun, lamp) creates
  depth and separates the subject from the background. Pure frontal/flat lighting
  is acceptable for screen-focused shots but generally avoid it for people.

Encode lighting as the specific source present in the scene. All of these are valid:
- ✅ `"soft neutral daylight from large windows with visible light-to-shadow contrast"`
- ✅ `"cool-neutral morning light, clean and bright, casting crisp soft shadows"`
- ✅ `"bright direct sunshine streaming through the window, high contrast and natural"`
- ✅ `"clear midday sunlight, straight-on, sharp and confident"`
- ✅ `"diffused natural light from an overcast sky, soft and even"`
- ✅ `"warm ambient pendant light with strong contrast between lit surfaces and shadow"`
- ❌ `"warm golden afternoon light"` applied as a blanket default to every scene
- ❌ `"flat, even, shadowless studio lighting"` — no depth or visual interest
- ❌ `"dramatic moody dark shadows"` — too dark and corporate

## Color palette

**Environment and background:** warm neutrals — cream, sand, warm white, light wood
tones, soft warm beige. Let objects and props use colours that feel natural and
harmonised with the scene. Do not force brand colours onto objects unless the brief
explicitly requests the IONOS colour palette.

**Object colours — aim for visual richness, not muted neutrals:**
Objects and props should have clear, saturated colours that create visual interest
and contrast within the scene. Avoid everything being the same beige/grey/neutral
tone — that produces flat, low-impact images. Instead, let individual objects carry
distinct colours that pop against the background:

- A ceramic mug can be terracotta red, forest green, cobalt blue, or mustard yellow
- Clothing can have a confident colour: a rich teal shirt, a burgundy sweater, olive jacket
- Notebooks, folders, and stationery can be vivid: bright red, deep green, saturated orange
- Plants, flowers, and decorative objects add natural colour contrast
- Food and beverage items (coffee, pastries, fruit) carry their natural vivid colours

The colour palette across the scene should feel **visually varied and alive** — 2–3
distinct colour accents across the props, not a monochrome or all-neutral composition.

Prompt phrasing examples:
- `"a cobalt blue ceramic mug, a terracotta pot with a small plant, kraft notebook"`
- `"wearing a rich teal shirt, a red folder on the desk, green plant in the background"`
- `"forest green apron, a bright yellow hardhat on the shelf, orange extension cable"`

**Brand colour on objects — only when explicitly requested:**
Apply IONOS Blue (`#003D8F`) or Sky (`#11C7E6`) to props or screen content **only if**
the brief explicitly says "use IONOS colours", "brand palette", or "blue accents".

**Palette anchors for `paletteRefs`:** always include at minimum:
- IONOS Blue `#003D8F`
- Sky `#11C7E6`
- one warm neutral that fits the scene (warm white `#FAF8F5`, sand `#F5EFE6`, or light wood `#D4B896`)

## Tone
Professional, trustworthy, optimistic, modern. Real materials, realistic depth of field.
Scenes show people confidently working with technology in warm, welcoming environments.
Never literal UI screenshots; use tasteful abstract colour-block representations on screens.

- background MUST be `"opaque"`; style `"photoreal"`.
- Avoid: cartoon/illustration styling, cold/blue-tinted overall colour grade, dark moody scenes.
