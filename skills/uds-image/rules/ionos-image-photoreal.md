# IONOS — photoreal imagery

## Mood and lighting

IONOS photography feels approachable, calm, and well-lit. The lighting should feel natural
and varied, harmonised with the specific setting rather than defaulting to the same
"golden afternoon" look.

Where the scenario leaves the choice open, prefer a well-lit frame on a cool-neutral grade.
An injected `Photographic lighting:` line outranks this — see `shared-image-principles`. When
that line names a dusk, evening or otherwise low-key setup, follow it rather than brightening
it back: `calm` and `confident` are carried by the subject's bearing and by the grade, not by
the exposure, so IONOS after dark is a composed, unhurried room rather than a bright one.

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

Where no `Photographic lighting:` line is present, encode lighting as the specific source
present in the scene. All of these are valid:
- ✅ `"soft neutral daylight from large windows with visible light-to-shadow contrast"`
- ✅ `"cool-neutral morning light, clean and bright, casting crisp soft shadows"`
- ✅ `"bright direct sunshine streaming through the window, high contrast and natural"`
- ✅ `"clear midday sunlight, straight-on, sharp and confident"`
- ✅ `"diffused natural light from an overcast sky, soft but with visible light-to-shadow contrast"`
- ✅ `"warm ambient pendant light with strong contrast between lit surfaces and shadow"`
- ❌ `"warm golden afternoon light"` applied as a blanket default to every scene
- ❌ `"flat, even, shadowless studio lighting"` — no depth or visual interest
- ❌ `"dramatic moody dark shadows"` written in as a default when nothing in the scene asks for it

## Color palette

**Environment and background:** warm neutrals — cream, sand, warm white, light wood
tones, soft warm beige. Let objects and props use colours that feel natural and
harmonised with the scene. Do not force brand colours onto objects unless the brief
explicitly requests the IONOS colour palette.

**Object colours — aim for visual richness, not muted neutrals:**
Objects and props should have clear, saturated colours that create visual interest
and contrast within the scene. Avoid everything being the same beige/grey/neutral
tone — that produces flat, low-impact images. Instead, let the individual objects the
scene already contains carry colours that suit what each one is, rather than defaulting to
the same handful of colours every time. This file does not decide WHICH objects are in the
frame — the scenario and the image-type rule do.

The colour palette across the scene should feel **visually varied and alive** — 2–3
distinct colour accents across the props, not a monochrome or all-neutral composition.

**Brand colour on objects — only when explicitly requested:**
Apply IONOS Blue (`#003D8F`) or Sky (`#11C7E6`) to props or screen content **only if**
the brief explicitly says "use IONOS colours", "brand palette", or "blue accents".

## Target audience — character profile

IONOS people are **more established and mature** than Strato's audience. Default age
range is **mid-30s to early 50s** — a small business owner, an experienced freelance
consultant, a manager making real decisions. Encode age explicitly:
`"a white woman in her early 40s"`, `"a Black man in his late 30s"`. Read
`shared-character-appearance` for the occupation → appearance reasoning approach, then
apply within these IONOS-specific boundaries:

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

## Tone

**Calm, business, positive, confident** — the four words that define an IONOS image.
Professional, trustworthy, optimistic, modern. Real materials, realistic depth of field.
Scenes show people confidently working with technology in welcoming, human environments.
Never literal UI screenshots; use tasteful abstract colour-block representations on screens.

**IONOS is the brand's centre of gravity, and the other two are positioned against it** —
so hold this middle deliberately rather than drifting toward either edge:

| | IONOS | Strato | home.pl |
|---|---|---|---|
| subject | mid-30s to early-50s, established | early-20s to early-30s, individual | mid-30s to 50s, established |
| bearing | composed, settled, in control | individual, expressive | composed, at ease |
| light | bright neutral daylight | bright but warm, sunlit | brightest and clearest, a step above IONOS |
| grade | cool-neutral to neutral | warm, subtle film-like | neutral-white, high-key |

What separates IONOS is its **grade and its energy, not its exposure.** IONOS is a bright,
well-lit brand wherever the scenario leaves that open — `positive` reads best that way — so
do not darken an IONOS scene to distance it from home.pl; distinguish it by
keeping the grade cool-neutral rather than high-key white. **Do NOT distinguish it by
freezing the subject** — the candid-moment rule in `shared-natural-moment` applies to IONOS
exactly as it does to every other brand, and a static "stand still and smile" frame is as
wrong here as anywhere. `confident` describes bearing, not stillness: an IONOS subject can be
mid-gesture and still read as composed and unhurried. home.pl sits a step lighter and cleaner again; that is a difference of degree at
the bright end, not IONOS being mid-key.

**On "warm":** the environment may be materially warm — wood, textiles and warm
neutrals in the surfaces and in whatever objects the scene already contains. The LIGHT
DEFAULTS to cool-neutral to neutral per the Mood and lighting section above — a default,
not a fixed value, and an injected `Photographic lighting:` line resets it. Warm materials
under neutral light is the IONOS combination; warm light is Strato's. These two statements
used to read as a contradiction — they are not: `warm` describes what is in the frame,
`neutral` describes what falls on it.

- background MUST be `"opaque"`; style `"photoreal"`.
- Avoid: cartoon/illustration styling.
- Lean away from, without refusing: a grade pushed all the way into cold blue, and a heavy
  unlit scene chosen for its own sake. Both are matters of degree, and a scenario may ask for
  either legitimately — an injected `Photographic lighting:` line decides, not this line.
