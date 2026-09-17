# IONOS — photoreal imagery

## Mood and lighting

IONOS photography reads as an ordinary working room that somebody is actually in:
approachable, composed, unhurried, nothing staged. That atmosphere is carried by who is in the
frame and how they hold themselves, and by a room that looks lived in — never by the exposure.
`calm` and `confident` describe a subject's bearing, not a brightness.

This file states NO light direction, NO colour temperature and NO key level, and none should be
inferred from the words above. `shared-lighting-by-scenario.md` decides which light suits which
scenario, `shared-time-of-day.md` owns the hour, and an injected `Photographic lighting:` line is
their answer on the runs that have one.

<!-- The four lighting bullets that stood here are GONE, and the two below are what is left of
     the section: a colour-temperature default, a tonal-contrast requirement, a one-clear-direction
     requirement and a repetition caution. None of them was atmosphere and none of them was
     IONOS-specific. The temperature default and the contrast requirement were cut outright; the
     direction requirement and the repetition caution moved to shared-time-of-day.md, which every
     brand gets. An earlier round had already removed this section's restatement of the scenario
     mapping for the same reason: two mappings competing for one decision. -->

- **An unstaged room.** Whatever the light turns out to be, the space around it should look
  like somewhere work actually happens — surfaces in use, objects where a person left them.
- **A composed subject, mid-action.** Settled bearing and a moment in progress are not in
  tension; see `shared-natural-moment`.

<!-- Task 3a: the nine worked lighting examples that sat here were DELETED because the craft
     model read them as vocabulary and reused the phrases — measured: a tonal term lifted from one
     of them reached 5 of 12 runs whose injected lighting line said the opposite.
     The replacement sentence ("encode lighting as the specific source that is actually in the
     scene") has now MOVED, verbatim in substance, to shared-time-of-day.md, together with the
     permission sentence and the do-not-brighten-it-back sentence. All three were brand-independent
     and all three were being restated in strato-image-style.md and homepl-image-style.md as well.
     This is load-bearing, not tidying: a 90-image study measured that removing these sentences
     from this file with nowhere else to carry them made all five evening frames read as bright
     daytime. The sentences that mattered were these, NOT the grade prescriptions that were cut
     alongside them. shared-time-of-day.md is inlined at `minimal` and `full`, so the cover is
     the same or better than it was here. check-brand-atmosphere.mjs asserts it is present. -->

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
| room | lived-in and ordinary, in use | lived-in and individual | uncluttered, more air around the subject |

What separates IONOS is **who is in the frame and how the room reads, not the exposure.** Do
not reach for brightness or darkness to distance IONOS from either neighbour: the three differ
in subject, bearing and how full the room is, and a scenario may hand all three the same light.

**Do NOT distinguish it by freezing the subject** — the candid-moment rule in
`shared-natural-moment` applies to IONOS exactly as it does to every other brand, and a static
"stand still and smile" frame is as wrong here as anywhere. `confident` describes bearing, not
stillness: an IONOS subject can be mid-gesture and still read as composed and unhurried.

**On "warm":** the environment may be materially warm — wood, textiles and warm neutrals in
the surfaces and in whatever objects the scene already contains. That is a statement about what
is IN the frame, and it makes no claim at all about what falls on it: this file sets no colour
for the light, so warm materials are compatible with every light the scenario can choose.

- background MUST be `"opaque"`; style `"photoreal"`.
- Avoid: cartoon/illustration styling.

---

<!-- ADDED after a live measurement (Task 7b, 36 real runs): IONOS was the ONLY brand with no
     negative-prompt baseline, and 10 of its 20 runs shipped a model-invented negativePrompt that
     contradicted the injected `Photographic lighting:` line — 7 of them a hard `grade: warm`
     clash. strato and homepl, which DO supply a baseline, had ZERO such clashes across 16 runs.
     Root cause: with nothing to reproduce, the craft model writes its own list and lifts the
     nearest-looking prohibition out of the prose above — it took an ANTI-REPETITION caution about
     one habitual hour and flattened it into an unconditional veto in the harder channel. That
     caution now lives in shared-time-of-day.md, phrased so it cannot be read as a veto, and the
     prose above no longer names an hour at all. That is the Task 5b defect class (tonal vetoes in a negative prompt) recreated
     one hop downstream: Task 5b cleaned the baselines that EXIST; nothing constrained the baseline
     a model invents when a brand supplies none. The fix is to supply one. Do not delete this
     section to "let the model decide" — that is the measured failure mode. -->

## Negative prompt baseline (always append for IONOS)

**No tonal term belongs in this list.** Colour grade, key, contrast, shadow quality, light
direction and time of day are decided by `shared-lighting-by-scenario.md`, by
`shared-time-of-day.md` and by an injected `Photographic lighting:` line, never here. A negative
prompt must carry only true rendering artifacts. Before adding an entry, read
`shared-lighting.md`: if any preset asserts that attribute, or if it names an hour, it is not
this list's to veto — six of the ten presets there assert a hard-edged or deeply-shadowed light
and two name a dark hour, and a tonal entry here would fight whichever of them the scenario is
entitled to pick. The entries below are named without any of that vocabulary on purpose: this
whole file is inlined into the craft prompt, so an example of a phrase to avoid is a phrase the
model can copy straight into the field.

`"text, watermark, logo, UI chrome, distorted hands, extra fingers, low quality,
cartoon or illustration styling, crossed arms, closed body language, pure side profile,
corporate stiff pose, forced grin, blank neutral expression,
tousled or casual-bun hair, hoodies, oversized tees, streetwear,
literal UI screenshots, readable interface text,
person presenting device to lens, lone idle device with no person,
graphics or UI rendered on the back of a device, content on tablet back,
screen graphics on device lid, colourful pattern on laptop lid"`
