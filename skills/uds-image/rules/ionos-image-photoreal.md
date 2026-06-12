# IONOS — photoreal imagery

## Mood and lighting

IONOS photography feels warm, approachable, and optimistic — not cold or corporate.
Apply these lighting defaults to every photoreal image:

- **Ambient warmth:** prefer warm natural light sources — golden-hour sun, warm window
  daylight, soft tungsten/incandescent interior light. The overall scene temperature
  should read as warm-neutral (3200–5000 K), never blue-tinted or overcast.
- **Positive mood:** bright, well-lit scenes with soft shadows. Avoid dark, moody, or
  dramatic high-contrast lighting. The image should feel like a good day.
- **Soft directionality:** light from one side (window, sun angle) creates gentle depth
  without harshness. Diffused overhead light is acceptable for indoor office/café scenes.

Encode lighting explicitly in the prompt:
- ✅ `"warm golden natural window light from the left casting soft gentle shadows"`
- ✅ `"warm afternoon sunlight filling the space, bright and optimistic atmosphere"`
- ✅ `"soft warm tungsten interior light, welcoming and positive tone"`
- ❌ `"cool overcast light"` / `"dramatic side lighting"` / `"moody shadows"`

## Color palette

**Environment and background:** warm neutrals — cream, sand, warm white, light wood
tones, soft warm beige. These tones make the IONOS blue accent elements pop.

**Brand color accents on objects:** apply IONOS Blue (`#003D8F`) and Sky (`#11C7E6`)
as accent colors on specific objects within the scene to anchor the brand identity.
These should feel natural, not forced:

| Object type | How to encode brand color |
|---|---|
| Clothing accent (shirt, blouse, detail) | `"wearing a deep blue shirt"` / `"a sky-blue detail on the collar"` |
| Device / screen | `"laptop or phone screen emitting soft blue light"` / `"IONOS-blue UI elements on screen"` |
| Stationery / props | `"a deep blue notebook"` / `"a blue ceramic mug"` / `"sky-blue product packaging"` |
| Surface / background accent | `"a blue folder or binder on the shelf"` / `"subtle blue tones in the background"` |
| Digital / product motif | `"a deep blue and sky-blue data visualisation on the screen"` |

**Palette anchors for `paletteRefs`:** always include at minimum:
- IONOS Blue `#003D8F`
- Sky `#11C7E6`
- one warm neutral (warm white `#FAF8F5`, sand `#F5EFE6`, or light wood `#D4B896`)

## Tone
Professional, trustworthy, optimistic, modern. Real materials, realistic depth of field.
Scenes show people confidently working with technology in warm, welcoming environments.
Never literal UI screenshots; use tasteful abstract colour-block representations on screens.

- background MUST be `"opaque"`; style `"photoreal"`.
- Avoid: cartoon/illustration styling, cold/blue-tinted overall colour grade, dark moody scenes.
