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

**Lighting:** not decided here. This file sets no light direction, no colour temperature and
no key level. `shared-lighting-by-scenario.md` decides which light suits which scenario,
`shared-time-of-day.md` owns the hour, and an injected `Photographic lighting:` line is their
answer on the runs that have one. The one thing this file does ask of the light is that it leave
the face readable rather than cut across by shadow, which is a subject requirement, not a grade.

**Warm COMPOUNDS, so watch it.** Measured: Strato frames came out ~25 luminance points DARKER
than IONOS, because a warm light plus warm-toned walls plus a saturated warm object compound into
a dim, cosy interior nobody actually chose. Cosy is not the brand; young and positive are. So
spend the warmth on the OBJECTS — the wood, the textiles, the props, the skin tones — and do not
add it to the light as well. That is a rule about where warmth is placed, not about how bright
the frame is: `young` and `positive` live in the person, the palette and the energy of the
moment, never in the luminance, so a lamplit 9pm desk is Strato as long as the person in it is.

> **Axis precedence.** This section makes no claim on the light, so there is nothing here for a
> `Photographic lighting:` line to outrank. The hour and the do-not-brighten-it-back rule are in
> `shared-time-of-day.md`, which applies to every brand.

---

## Photoreal / cutout switch

- **Photoreal:** opaque background, realistic materials, genuine depth of field.
- **Cutout:** single clear subject on a plain, evenly-lit neutral pale background
  (soft grey or off-white). No gradients, no scene context, matte-clean silhouette.

---

<!-- NEGATIVE BASELINE, TONAL ENTRIES REMOVED (Task 5b). A negative term is a HARDER veto than
     prose, so while Task 5 turned this file's absolute tonal bans into scenario-scoped biases,
     the tonal entries still in this list kept vetoing the lighting catalog at the model level.
     Two entries were removed because they cancelled presets the scenario is entitled to pick: a
     hard-shadow veto (against the direct-sun presets) and a dark-key veto (against the dusk and
     lamp-carried presets). Two more were narrowed, losing a colour-temperature word and a
     saturation word for the same reason. Three of the four presets those vetoes hit have since
     been deleted from the catalog, but the reasoning is unchanged and the replacements are
     stronger: six of the ten presets now assert a hard-edged or deeply-shadowed light.
     The removed phrases are deliberately NOT restated in the prose below: this whole file is
     inlined into the craft prompt, and a banned phrase quoted as an example is a phrase the craft
     model can copy straight back into negativePrompt.
     Guarded by image-svc/src/craft/__tests__/negativeBaseline.test.ts, which derives BOTH sides
     from these files, so a newly-authored preset or a newly-added negative term is caught. -->

## Negative prompt baseline (always append for Strato)

**No tonal term belongs in this list.** Colour grade, key, contrast, shadow quality, light
direction and time of day are decided by `shared-lighting-by-scenario.md`, by
`shared-time-of-day.md` and by an injected `Photographic lighting:` line, never here. A negative
prompt must carry only true rendering artifacts. Before adding an entry, read
`shared-lighting.md`: if any preset asserts that attribute, or if it names an hour, it is not
this list's to veto. Two entries pass that check and are kept deliberately:

- `sterile lighting` — "sterile" is a fluorescent, institutional, lab-lit LOOK, not a colour
  temperature. No preset in the catalog asks for it: every one of them names a window, the sun or
  a domestic lamp. It is a distinct failure mode, not a grade ban.
- `all-grey palette` — greyness is PALETTE, not tone, and the palette section above still
  keeps the orange family present in every frame.

`"text, watermark, logo, UI chrome, distorted hands, extra fingers, low quality,
crossed arms, closed body language, pure side profile, busy small-patterned clothing,
all-grey palette, sterile lighting, corporate stiff pose, forced grin,
blank neutral expression, person presenting device to lens,
lone idle device with no person,
graphics or UI rendered on the back of a device, content on tablet back,
screen graphics on device lid, colourful pattern on laptop lid"`
