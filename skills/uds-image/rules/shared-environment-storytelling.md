# Shared environment storytelling

Applies to all image types that include a person in a professional or lifestyle setting.
The environment must feel like a place where real work happens — not a staged backdrop.
Every element in the scene (clutter, tools, lighting, props) should be evidence of the
story the character is living. Clean, empty, studio-like backgrounds fail this rule.

## Lived-in backgrounds

The background density and disorder must match the trade or setting:

| Setting | What "lived-in" looks like |
|---|---|
| Workshop / trade (carpenter, potter, mechanic) | Shelves stacked with pieces in various states of completion; scattered tools, sawdust, clay scraps, oil rags on the worktable; walls hung with equipment |
| Food / hospitality (barista, chef, baker) | Dense counter filled with equipment, stacked cups/containers, product tins, chalkboard menus; ambient clutter of a working kitchen or bar |
| Studio / creative (photographer, designer) | Pinboards with references, half-finished work, open notebooks, cables, equipment in use |
| Office / tech | Dual monitors, notebooks, coffee cups, cables — not a pristine empty desk |
| Retail / service | Shelves stocked with product, display materials, everyday wear-and-tear visible |

Encode background density explicitly in the prompt:
- ✅ `"shelves packed with ceramic pieces in various stages of completion behind her, workbench scattered with clay tools and scraps"`
- ✅ `"dense coffee bar counter with espresso machine, stacked cups, product tins, warm pendant lights overhead"`
- ❌ `"clean modern workshop"` — too sterile; implies empty and staged

## Object interaction

The character should be **holding or actively engaged with** a profession-relevant object.
This is the single most powerful authenticity signal.

| Trade | Object to hold or interact with |
|---|---|
| Potter / ceramicist | Holding a finished piece (bowl, cup, vase) with both hands |
| Carpenter / woodworker | Resting a hand on a finished piece, holding a hand plane or chisel |
| Barista / café | Hands on the espresso machine portafilter, holding a cup mid-pour |
| Chef / baker | Holding a finished dish, rolling pin, or stirring a bowl |
| Mechanic / builder | Holding a tool appropriate to the trade |
| Knowledge worker | Holding a tablet, pen, or looking at a screen |

Never leave the character's hands empty or arms simply folded when an object interaction
can replace or complement the pose. Encode as: `"holding [object] with both hands"` or
`"hands actively engaged with [object]"`.

## Depth layers

Great photography uses three planes of focus. Encode all three in the prompt using
**shallow depth of field** as the photography term — image models respond well to it.

1. **Foreground (bokeh):** name a physical object from the trade that sits close to the
   camera lens, occupying the bottom edge of the frame. Be concrete and specific — not
   "some tools" but "a weathered hand plane and curled wood shavings sitting on a
   workbench surface extremely close to the camera lens, rendered out of focus by
   shallow depth of field".
2. **Subject (sharp):** the character, pulled into crisp focus against both planes.
3. **Background (bokeh):** enumerate specific items densely packed — not "shelves with
   stuff" but "floor-to-ceiling industrial shelving tightly packed with rough-cut lumber
   planks, pipe clamps, sawdust-dusted tools, half-finished cabinet doors, and stacked
   wooden boards, all rendered out of focus".

Choose foreground objects with **distinct, saturated colours** — they sit closest to
the lens and carry the most visual weight in the bokeh layer. A cobalt-blue notebook,
a terracotta mug, or a vivid green plant reads with far more impact than a white mug
or beige folder. Aim for at least one visually strong colour in the foreground.

**Encoding template** — use this exact structure, filling in trade-specific objects:

> `"shallow depth of field portrait photography, [colourful foreground object A] and
> [colourful foreground object B] lying on the surface immediately in front of the
> camera lens, rendered as out-of-focus bokeh in the lower frame — [character
> description, in sharp focus] — background of [dense enumeration of environment
> objects] all softly blurred behind"`

The foreground blur is the single strongest signal for "this was shot in a real place".
Without it the image looks like a render. Without specific enumeration the model defaults
to empty shelves.

## Scenario-appropriate lighting

Light must come from sources that actually exist in the environment, and the overall feel
should be **bright, natural, and vivid — airy and uplifting, never moody, dark, or
underexposed** (see the lighting principle in SKILL.md). Lead with abundant soft natural light
(a bright airy room, generous daylight); keep the tone warm and relaxed ("chill") and welcome a
**subtle film-like filter / gentle colour grade** that ties the palette together. Vary the exact
quality per scene so it never looks repetitive, but keep the result bright and warm rather than
cool or clinical. Reserve cool / neutral / clinical light only for subjects that genuinely demand
it (a server hall, a lab) — and even then keep it bright and add a warm practical accent (amber
indicator glow, a warm lamp) so it never reads cold or sterile.

| Setting | Example natural light options (pick the one that fits) |
|---|---|
| Workshop / trade | Bright neutral daylight from large side windows; direct sunshine casting crisp shadows; cool overhead industrial light |
| Coffee shop / restaurant | Warm ambient pendant light; bright neutral window light at midday; cool morning light before the rush |
| Home office / desk | Cool-neutral morning window light; soft diffused daylight; bright direct sunshine on the desk surface |
| Outdoor | Clear direct sunshine, straight-on; bright overcast neutral sky; dappled light through trees |
| Studio / product | Soft diffused neutral window light; clean even interior light; cool-neutral ambient |

Name the specific light source and quality in the prompt — lean warm and vivid:
- ✅ `"warm soft daylight pouring through large windows, gentle inviting glow, vivid natural colour"`
- ✅ `"golden practical lamp light with a relaxed, premium mood"`
- ✅ `"bright direct sunshine through the window, warm crisp natural shadows"`
- ✅ `"bright airy daylight filling the room, soft and natural, with a subtle warm film grade"`
- ✅ `"cool daylight from the server-hall, warmed by amber rack indicator glow"` — clinical scene, warmed
- ❌ `"soft even studio lighting"` — generic, removes sense of place
- ❌ `"cool neutral clinical light"` as the default — only for subjects that truly demand it, and warm it
- ❌ `"dramatic moody shadows"` / `"dark low-key"` — too dark; keep it bright and airy

## Dynamic, in-the-moment capture

The image should feel like a **candid photo grabbed mid-moment**, not a static studio pose.
Put the character in motion — walking mid-stride, laughing mid-task, turning, reaching,
pouring, gesturing — and add a **slight natural camera/motion blur** so it reads as alive and
documentary:
- ✅ `"caught mid-stride, a touch of natural motion blur, candid documentary feel"`
- ✅ `"a blurred passer-by crossing the foreground, the subject sharp and in-the-moment"`
- ✅ `"laughing mid-task, slight motion blur on the moving hand"`
Keep the **face sharp** for avatar/portrait — the blur lives in the motion, the moving hand, and
the surrounding/foreground figures, never on the hero face. Avoid the rigid "stand still and
smile" look.

## Natural appearance

The character's appearance should match someone who is mid-shift, not a model on set:

- **Hair:** effortlessly worn — loose strands, a quick practical updo, a beanie or cap;
  NOT a perfect blowout or styled editorial look. Encode as: `"hair worn naturally and
  effortlessly"` or `"loose hair falling naturally"`.
- **Attire:** functional workwear showing appropriate use — an apron with slight marks,
  a well-worn shirt, practical footwear. NOT pristine or brand-new looking.
- **Expression:** genuine and in-the-moment — either warm direct eye contact (portrait)
  or natural focus directed at the task (person-scenario). NOT a posed corporate smile.
- **Hands and skin:** real hands with natural skin texture. Encode: `"natural skin texture,
  realistic hands"`.

## How to compose the full prompt

Build the prompt in this strict order. Face and camera distance are locked first.
Foreground is added last and only if the shot permits it.

1. **Face anchor + camera shot** (CRITICAL — first sentence, always)
   → chosen using the decision ladder in SKILL.md CRITICAL RULE #1
2. **Character** — demographics, build, attire with wear, object in hand, frame position
3. **Background density** — `"background of floor-to-ceiling [shelving/counter/wall] packed
   tightly with [enumerate 4-6 specific items], all softly blurred"`
4. **Lighting** — `"[named light source] casting [quality and direction] light"`
5. **Natural appearance** — hair, skin texture, expression
6. **Photography style** — `"documentary portrait photography, editorial photography style"`
7. **Foreground bokeh (optional — add only if shot distance allows)**
   Gate condition: include this sentence only when the camera is at waist-up or
   wider distance. Skip it for close/medium shots where it would compete with face.
   → `"shallow depth of field, [specific object A] and [specific object B] lying on the
   surface immediately in front of the camera lens, rendered as out-of-focus bokeh at
   the bottom edge of the frame"`

Example (carpenter, waist-up, left placement — foreground included):
> `"full face clearly visible from hairline to chin, waist-up shot showing complete upper
> body. a Black man in his 40s, solid muscular build, resting one hand on the edge of a
> finished oak dining table, wearing a well-worn leather apron with sawdust and marks over
> a faded denim shirt, standing in the left third of the frame. background of
> floor-to-ceiling industrial metal shelving packed tightly with rough-cut lumber planks,
> pipe clamps, half-finished cabinet doors, scattered chisels, and sawdust-covered surfaces,
> all softly blurred. warm natural light from large side workshop windows casting long
> gentle shadows across the floor. hair worn naturally, natural skin texture, genuine
> confident expression. documentary portrait photography, editorial photography style.
> shallow depth of field, a weathered hand plane and curled wood shavings lying on the
> workbench surface immediately in front of the camera lens, rendered as out-of-focus bokeh
> at the bottom edge of the frame."`

Example (carpenter, extra-wide landscape full-body — foreground included at base):
> `"full face clearly visible from hairline to chin, extra-wide establishing shot, character
> occupying one vertical third of the frame, full body head to floor visible. a Black man
> in his 40s, solid muscular build, arms crossed, wearing a well-worn leather apron over a
> faded denim shirt, standing in the left third of the frame. background of
> floor-to-ceiling industrial metal shelving packed tightly with rough-cut lumber planks,
> pipe clamps, half-finished cabinet doors, scattered chisels, and sawdust-covered surfaces,
> all softly blurred. warm natural light from large side workshop windows casting long
> gentle shadows across the workshop floor. hair worn naturally, natural skin texture,
> trustworthy and competent expression. documentary portrait photography, editorial
> photography style. shallow depth of field, a weathered hand plane and curled wood
> shavings lying at the base of the frame immediately in front of the camera lens,
> rendered as out-of-focus bokeh."`
