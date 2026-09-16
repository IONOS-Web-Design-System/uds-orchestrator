# IONOS — photoreal imagery

## Mood and lighting

IONOS photography feels approachable, calm, and well-lit. The lighting should feel natural
and varied, harmonised with the specific setting rather than defaulting to the same
"golden afternoon" look.

Where NO `Photographic lighting:` line is injected, prefer a well-lit frame on a cool-neutral
grade. Where a line IS injected it outranks this preference and sets the grade, and the
preference does not apply — see `shared-image-principles`. When that line names a dusk, evening
or otherwise low-key setup, follow it rather than brightening it back, and do not restate a
grade of your own: `calm` and `confident` are carried by the subject's bearing, not by the
exposure, so IONOS after dark is a composed, unhurried room rather than a bright one.

<!-- Task 3a, two removals from the bullets below; author-facing, no instruction. (1) The first
     bullet restated three cells of the per-scenario lighting mapping, quoting them — two mappings
     competing for one decision. shared-lighting-by-scenario.md is the single authority. (2) The
     permission sentence named three specific hours. Keep the PERMISSION: Task 7b measured the
     caution above it collapsing into an unconditional tonal veto in the invented negativePrompt.
     The naming was the redundant half — the Negative prompt baseline below still names the exact
     terms, in the channel where that defect was measured. -->

- **Natural, scene-appropriate light:** choose the light source that actually belongs in the
  environment. Which setup suits which scenario is NOT decided here — `shared-lighting-by-scenario.md`
  owns the `(place, timeOfDay)` → eligible-preset mapping, and an injected `Photographic lighting:`
  line is that mapping's answer.
  Where NO lighting line is injected, vary the hour and the light quality across a set rather than
  settling into one habitual look — that is a caution against REPETITION, not a ban on any
  particular hour, colour temperature or key level. Every one of them is available to IONOS when
  the scenario chooses it.
- **Neutral to slightly warm range:** where NO `Photographic lighting:` line is injected, default
  to a natural daylight temperature (5000–6500 K, cool-neutral to neutral). Warmer light is fine
  when the scene genuinely calls for it, but is never the universal default. Where a line IS
  injected it sets the temperature, and this default does not apply.
- **Contrast for visual impact:** scenes should have clear tonal contrast between the
  subject and the background. Flat, uniformly grey or muted images lack punch —
  use the light source to create a visible difference between lit and shadow areas,
  even if shadows remain soft. A well-exposed subject against a slightly darker
  background reads with more impact than a uniformly lit scene.
- **Directionality:** light from one clear direction (window, sun, lamp) creates
  depth and separates the subject from the background. Pure frontal/flat lighting
  is acceptable for screen-focused shots but generally avoid it for people.

<!-- Task 3a: the nine worked lighting examples that sat here are DELETED. The craft model read
     them as vocabulary and reused the phrases — measured: a tonal term lifted from one of them
     reached 5 of 12 runs whose injected lighting line said the opposite. The sentence below
     carries the same instruction with no phrase to copy; check-minimal-conflict.mjs guards it. -->

Where no `Photographic lighting:` line is present, encode lighting as the specific source that is
actually in the scene, and say what light-to-shadow relationship that source produces. Two things
to avoid: a look generic enough to fit any scene, and a flat one with no shadow at all.

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
Professional, trustworthy, optimistic, modern. Real materials, real surfaces, nothing rendered
or synthetic-looking.<!-- Task 3a: a focus/subject-separation claim was deleted from the end of
     this sentence. The injected `Photographic camera:` line owns that decision, and the phrase is
     not restated here — quoting it would put it back in the prompt. -->
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

---

<!-- ADDED after a live measurement (Task 7b, 36 real runs): IONOS was the ONLY brand with no
     negative-prompt baseline, and 10 of its 20 runs shipped a model-invented negativePrompt that
     contradicted the injected `Photographic lighting:` line — 7 of them a hard `grade: warm`
     clash. strato and homepl, which DO supply a baseline, had ZERO such clashes across 16 runs.
     Root cause: with nothing to reproduce, the craft model writes its own list and lifts the
     nearest-looking prohibition out of the prose above — it was taking "do not default to warm
     golden hour", an ANTI-REPETITION caution, and flattening it into an unconditional veto in the
     harder channel. That is the Task 5b defect class (tonal vetoes in a negative prompt) recreated
     one hop downstream: Task 5b cleaned the baselines that EXIST; nothing constrained the baseline
     a model invents when a brand supplies none. The fix is to supply one. Do not delete this
     section to "let the model decide" — that is the measured failure mode. -->

## Negative prompt baseline (always append for IONOS)

**No tonal term belongs in this list.** Colour grade, key, contrast, shadow quality, light
direction and mood are owned by the injected `Photographic lighting:` line — see
`shared-image-principles`, which already says a negative prompt must carry "only true
rendering artifacts" and "never … lighting or palette instructions". Before adding an entry,
check `shared-lighting.md`: if ANY preset asserts that attribute, it is the line's to decide,
not this list's. In particular do NOT add `warm golden hour`, `golden hour`, `warm lighting`,
`moody`, `dark`, `harsh shadows` or `dramatic lighting`: five presets assert a warm grade and
four assert a low key or defined shadow edges, so every one of those entries would fight a
preset the scenario is entitled to pick.

`"text, watermark, logo, UI chrome, distorted hands, extra fingers, low quality,
cartoon or illustration styling, crossed arms, closed body language, pure side profile,
corporate stiff pose, forced grin, blank neutral expression,
tousled or casual-bun hair, hoodies, oversized tees, streetwear,
literal UI screenshots, readable interface text,
person presenting device to lens, lone idle device with no person,
graphics or UI rendered on the back of a device, content on tablet back,
screen graphics on device lid, colourful pattern on laptop lid"`
