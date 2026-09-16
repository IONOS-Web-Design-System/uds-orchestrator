# STRATO — image style

Camera, framing, and device-encoding rules live in `shared-brief-enrichment`,
`shared-image-type-portrait`, and `shared-image-type-device-focused`. This file covers only what
is Strato-specific: palette, brand character, clothing, and environment tone.

---

## Palette anchors

| Name | HEX | Primary use in image |
|---|---|---|
| Brand Orange | `#FF8800` | Hero clothing, warm props, brand accent objects |
| Dark Orange | `#FF5C00` | Deep accent — the darker end of a warm surface or textile, warm shadow |
| Light Orange | `#FFC700` | Sunny highlights — warm light spill, the brightest warm touch in frame |
| Soft Orange | `#FFEAD3` | Warm background tints, card backgrounds, wall colour |
| Blue | `#272CB2` | Tech objects, device surfaces, a jacket or accessory |
| Dark Blue | `#2F2F70` | Deep shadow accent, darker clothing layer |
| Soft Blue | `#F7F7F9` | Page/background — the default neutral surface tone |
| White | `#FFFFFF` | Clean clothing, clean backgrounds |

**Palette usage rule:** seed at least **two** of these hex anchors visibly in every scene —
one warm (orange family) and one neutral/cool (blue family or white). The orange family
is always present; its weight determines brand warmth. The palette is a FLAVOUR, not the
brand identity: it says which colours may appear, never which objects carry them. An
all-grey, all-neutral scene reads corporate and cold and is the weaker choice for Strato —
but that is a preference on the palette axis, never a veto over the light the scenario chose.

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
**Young, warm, positive.** The person is having a good day on their own terms: absorbed in
something they care about, not performing productivity for an audience. Genuine smile or
natural concentration. Never a forced grin or blank corporate face.

`dynamic` is NOT listed here, deliberately. The candid-moment quality — mid-gesture, a moment
in progress rather than a held pose — is a general photographic virtue owned by
`shared-natural-moment` and applied to every brand. It is not a Strato differentiator, and
framing it as one implied a frozen pose was acceptable elsewhere, which it never was. What
distinguishes Strato from IONOS is **age, warmth and individual expression** — not energy.

---

## Object palette and environment

**Warm accent:** the scenario decides WHICH objects are in the frame — see the image-type
rules. This file asks only that one of them lean warm and saturated where a warm object
plausibly belongs. Colour on an object the scene already contains carries brand warmth more
reliably than the grade does; nothing here adds an object to a scene that has none.

**Environment:** real lived-in spaces — home offices, coworking spaces, cafés, bright
indoor environments. Warm-toned walls or wood surfaces preferred. Backgrounds are
softly blurred but identifiable. Never an empty studio backdrop.

**Lighting:** Where NO `Photographic lighting:` line is injected, prefer a bright, diffused,
sunlit frame — generous daylight, a subtle warm film-like grade, and a face kept readable
rather than cut across by shadow; cool/clinical light is the weaker choice there, outside
data-centre and server subjects, where it belongs and is usually worth an amber practical.
Where a line IS injected it sets the direction, quality, contrast and grade, this preference
does not apply, and no lighting direction of your own is restated.

**Warm COMPOUNDS, so watch it.** Measured: Strato frames came out ~25 luminance points
DARKER than IONOS, because a warm grade plus warm-toned walls plus a saturated warm object
compound into a dim, cosy interior nobody actually chose. Cosy is not the brand; young and
positive are. So where the brightness is yours to set, spend the warmth on the objects, the
wood and the skin tones, and let the windows, walls and overall exposure stay light and open.

That is a bias against the compounding, NOT a floor under the exposure. An evening or dusk
scenario is a legitimate Strato scene: `young` and `positive` live in the person, the palette
and the energy of the moment, not in the luminance — a lamplit 9pm desk is Strato as long as
the person in it is.

> **Axis precedence.** An injected `Photographic lighting:` line outranks this section for
> direction, quality, contrast and grade — see `shared-image-principles`. When that line names
> a darker or warmer setup than this section would have chosen, the LINE wins: do not brighten
> it back, and do not restate a lighting direction of your own.

---

## Photoreal / cutout switch

- **Photoreal:** opaque background, realistic materials, genuine depth of field.
- **Cutout:** single clear subject on a plain, evenly-lit neutral pale background
  (soft grey or off-white). No gradients, no scene context, matte-clean silhouette.

---

<!-- NEGATIVE BASELINE, TONAL ENTRIES REMOVED (Task 5b). A negative term is a HARDER veto than
     prose, so while Task 5 turned this file's absolute tonal bans into scenario-scoped biases,
     the tonal entries still in this list kept vetoing the lighting catalog at the model level.
     Removed: the harsh-directional-shadow entry (it cancelled hard-sun-defined-shadows' "crisp
     defined shadow edges" and blinds-shaft-light's "high contrast") and the dark-moody-lighting
     entry (it cancelled blue-hour-practicals and hazy-backlit-bloom's "lifted blacks"). Narrowed:
     the cold-sterile entry lost "cold" (four presets grade cool) and the all-grey-muted entry lost
     "muted" (rain-diffused-window asserts "soft muted grade" verbatim).
     The removed phrases are deliberately NOT restated in the prose below: this whole file is
     inlined into the craft prompt, and a banned phrase quoted as an example is a phrase the craft
     model can copy straight back into negativePrompt.
     Guarded by image-svc/src/craft/__tests__/negativeBaseline.test.ts, which derives BOTH sides
     from these files, so a newly-authored preset or a newly-added negative term is caught. -->

## Negative prompt baseline (always append for Strato)

**No tonal term belongs in this list.** Colour grade, key, contrast, shadow quality, light
direction and mood are owned by the injected `Photographic lighting:` line — see
`shared-image-principles`, which already says a negative prompt must carry "only true
rendering artifacts" and "never … lighting or palette instructions". Before adding an entry,
check `shared-lighting.md`: if ANY preset asserts that attribute, it is the line's to decide,
not this list's. Two entries pass that check and are kept deliberately:

- `sterile lighting` — "sterile" is a fluorescent, institutional, lab-lit LOOK, not a colour
  temperature. No preset asks for it; `soft-studio-frontal` comes closest and says "clean
  friendly feel". It is a distinct failure mode, not a grade ban.
- `all-grey palette` — greyness is PALETTE, not tone, and the palette section above still
  keeps the orange family present in every frame.

`"text, watermark, logo, UI chrome, distorted hands, extra fingers, low quality,
crossed arms, closed body language, pure side profile, busy small-patterned clothing,
all-grey palette, sterile lighting, corporate stiff pose, forced grin,
blank neutral expression, person presenting device to lens,
lone idle device with no person,
graphics or UI rendered on the back of a device, content on tablet back,
screen graphics on device lid, colourful pattern on laptop lid"`
