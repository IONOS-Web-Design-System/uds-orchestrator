# STRATO — image style

Camera, framing, and device-encoding rules live in `shared-brief-enrichment`,
`image-type-portrait`, and `image-type-person-scenario`. This file covers only what
is Strato-specific: palette, brand character, clothing, and environment tone.

---

## Palette anchors

| Name | HEX | Primary use in image |
|---|---|---|
| Brand Orange | `#FF8800` | Hero clothing, warm props, brand accent objects |
| Dark Orange | `#FF5C00` | Deep accent — mugs, cushions, warm shadows |
| Light Orange | `#FFC700` | Sunny highlights — flowers, warm light spill, notebooks |
| Soft Orange | `#FFEAD3` | Warm background tints, card backgrounds, wall colour |
| Blue | `#272CB2` | Tech objects, device surfaces, a jacket or accessory |
| Dark Blue | `#2F2F70` | Deep shadow accent, darker clothing layer |
| Soft Blue | `#F7F7F9` | Page/background — the default neutral surface tone |
| White | `#FFFFFF` | Clean clothing, clean backgrounds |

**Palette usage rule:** seed at least **two** of these hex anchors visibly in every scene —
one warm (orange family) and one neutral/cool (blue family or white). The orange family
is always present; its weight determines brand warmth. Never use all-grey or all-neutral
scenes — they read corporate and cold, the opposite of Strato's personality.

---

## Brand character — target audience profile

Strato's audience is **younger and more individually expressive** than IONOS. The typical
Strato person is in their **early-to-mid 20s to early 30s** — a young freelancer, a
student with their own side project, a self-employed creative, or someone early in their
tech career who chose their own path. They are not corporate. They are not polished. They
are confidently, authentically themselves.

### Age
**20s to early 30s.** Default to this range unless the brief specifies otherwise.
Encode explicitly: `"a white woman in her mid-20s"`, `"a white man in his late 20s"`.
Never default to 40s or 50s — that is the IONOS audience.

### Appearance — reason from brief signals, don't enumerate

Read `shared-character-appearance` for the full reasoning approach and occupation lookup
table. For Strato, apply that reasoning within these brand-specific boundaries:

**Hair — natural and characterful.** The hair has personality. Apply the reasoning from
`shared-character-appearance` to decide which style fits this specific person — tousled
developer, casual bun on a designer, loose waves on a freelancer, short practical cut on a
maker. Never `"neatly styled"`, `"blowout"`, or `"sleek professional"`.

**Accessories — one or none, earned by the character.** A developer has headphones. A
designer might have statement glasses. A barista has an apron edge. Many Strato people
wear no special accessory at all — that is also correct. Do not add an accessory just to
signal "brand". Let it come from the occupation reasoning.

**Clothing — casual-creative range.** Hoodie, plain tee, soft knitwear, casual jacket
over a tee, relaxed layers. The colour can anchor the brand palette (an orange hoodie,
a mustard tee) but does not have to — cream, grey, and sage are equally valid. Never
business shirts, blazers, pencil skirts, or corporate attire. Never busy small patterns.

**Variants — omit tokens when the brief is generic.** When `variants > 1` and the brief
does not specify appearance, encode only a clothing vibe word (e.g. `"casual knitwear"`)
and omit hair and accessory entirely. The image model will vary them naturally. Locking in
`"curly hair + glasses + hoodie"` across all variants produces the same person 3 times.

### Tone and expression
Warm, optimistic, making-progress. The person is having a good day on their own terms —
absorbed in something they care about, not performing productivity for an audience.
Genuine smile or natural concentration. Never a forced grin or blank corporate face.

---

## Object palette and environment

**Props:** include at least one visually saturated warm accent object per scene — an
orange or terracotta mug, a warm-yellow notebook, fresh flowers in a warm tone, an
orange fruit bowl. These carry brand warmth far more reliably than lighting alone.

**Environment:** real lived-in spaces — home offices, coworking spaces, cafés, bright
indoor environments. Warm-toned walls or wood surfaces preferred. Backgrounds are
softly blurred but identifiable. Never an empty studio backdrop.

**Lighting:** bright, diffused, natural. Generous daylight through large windows. No
harsh directional shadows across the face. Embrace a subtle warm film-like grade.
Cool/clinical light is acceptable only for data-centre or server subjects, and even then
warmed with an amber practical accent.

---

## Photoreal / cutout switch

- **Photoreal:** opaque background, realistic materials, genuine depth of field.
- **Cutout:** single clear subject on a plain, evenly-lit neutral pale background
  (soft grey or off-white). No gradients, no scene context, matte-clean silhouette.

---

## Negative prompt baseline (always append for Strato)

`"text, watermark, logo, UI chrome, distorted hands, extra fingers, low quality,
crossed arms, closed body language, pure side profile, busy small-patterned clothing,
harsh directional shadows, dark moody lighting, all-grey muted palette, cold sterile
lighting, corporate stiff pose, forced grin, blank neutral expression,
person presenting device to lens, lone idle device with no person,
graphics or UI rendered on the back of a device, content on tablet back,
screen graphics on device lid, colourful pattern on laptop lid"`
