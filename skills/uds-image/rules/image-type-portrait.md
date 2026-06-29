# Image type: portrait

Use when the brief asks for a person facing the camera — the person IS the subject and
the story is told through their character, posture, accessories, and setting. Portrait is
about identity: who this person is and what they do, conveyed through how they stand,
what they hold, and what surrounds them.

**Not a dimension orientation.** "Portrait" refers to this image type (person facing
camera), not to a tall/vertical canvas ratio. A 1280×720 landscape image can be a portrait
type, and a 720×1280 tall image can be a scene type. Use `dimensions` to control the canvas;
use this type when the character is the focal point facing the lens.

## When to apply
Brief signals: "portrait", "facing camera", "professional photo", "entrepreneur",
"team member photo", "standing in their shop/office", any brief where the person's
identity and character are the point — not what they're doing.

**Distinction from scene:** if the brief describes a person mid-action in their environment
where the setting and activity are the story → use **scene** instead. Portrait is for
character; scene is for moments of life.

## Composition rules

Face visibility is a hard constraint. Camera shot is a preference that adjusts to serve it.
See SKILL.md CRITICAL RULE #1 for the full decision ladder. The short version:

- **Waist-up brief + any ratio:** use `"full face clearly visible from hairline to chin, waist-up shot showing complete upper body"` — leads the prompt.
- **Full body / long shot + tall ratio (2:3, 3:4, 9:16):** use `"full face clearly visible from hairline to chin, full body in frame from head to floor"`.
- **Full body / long shot + landscape ratio (16:9, 4:3):** landscape cannot fit a standing person at normal long-shot distance without cropping the face. Automatically use: `"full face clearly visible from hairline to chin, extra-wide establishing shot, character occupying one vertical third of the frame, full body head to floor visible"` — this is the only framing that reliably shows the face in landscape format.

Always state the face anchor first — before the character description, before anything else.
- Subject stands, sits, or leans naturally within their environment
- Background shows their workplace or context in soft focus behind them
- Slight off-center framing (rule of thirds) feels more authentic than dead-center
- Include at least one profession-revealing prop or environmental element (tools, products,
  workspace equipment, branded attire)

## Person direction

**Posture — vary widely.** Never default to one stance. Rotate across these options per
generation:
- Leaning forward with arms on a counter or desk, weight on elbows
- Standing with one shoulder dropped, arms loosely at sides or one hand in a pocket
- Seated with relaxed posture, one arm on the chair arm, body slightly angled
- Weight shifted to one hip, arms crossed loosely or one hand holding a prop
- Mid-movement — turning toward camera, caught mid-step, hand just lifting an object

**Accessories and props — make them work-specific and story-telling.** The prop should
answer "what does this person do?" immediately:
- A barista: espresso cup held in both hands, slight steam visible
- A carpenter: holding a hand plane or chisel, or one hand loosely in pocket
- A designer: holding a tablet or pen, sketchbook visible
- A developer: mug of coffee in hand, or pen in hand
- An entrepreneur: phone or notebook in hand, or weight shifted with arm at side

**Critical — held, never rested.** For portrait type, always encode props as `"holding X"`
or `"hand in pocket"` — NEVER `"resting one hand on [surface]"` or `"hand on workbench"`.
Surface-contact language triggers a low-angle workbench composition where the camera looks
at the hands from the side, sending the face out of frame. The person must stay upright
with the face naturally in the upper portion of the frame. If the background includes a
workbench, the person stands IN FRONT of it (not behind it leaning over it):
`"standing in front of a workshop bench, [prop] held in one hand, facing the camera"`.

**Expression:** a brief, natural moment of eye contact — not a rigid forced smile. The
expression should match the character's context: confident and direct, warm and inviting,
or quietly focused. Genuine, not rehearsed.

**Attire:** functional workwear that fits the professional context. Well-worn or
purposefully chosen — never pristine and brand-new looking unless that is the brand's
explicit tone.

The image should imply a story: who is this person, what do they do, why are they proud of it.

## Lighting
- Soft, even, slightly warm — flattering and natural
- Window light or diffused ambient light preferred over harsh directional flash
- Background should be slightly underexposed relative to subject to keep focus clear

## Component-driven placement (override rule)

When the brief names a specific UI component **and** specifies a side (left / right), the
character's position in the frame **must** match that side. This overrides the default
rule-of-thirds framing.

| Component context | Side specified | Composition requirement |
|---|---|---|
| `customer_testimonial` (or any quote/review block) | left | Subject anchored in the **left third** of the frame; body weight and gaze angle tilted slightly **right** (toward the text column) |
| `customer_testimonial` (or any quote/review block) | right | Subject anchored in the **right third** of the frame; body weight and gaze angle tilted slightly **left** (toward the text column) |
| Any other named component | left | Subject in left third, facing/leaning right |
| Any other named component | right | Subject in right third, facing/leaning left |

**Prompt construction:** Add the placement instruction explicitly in the prompt, e.g.:
- `"person standing in the left third of the frame, body and gaze angled slightly to the right, …"`
- `"person positioned on the right side of the image, turned slightly toward the left, …"`

The gaze-angle tilt ensures visual flow leads the viewer's eye toward the content area of
the component, even though the subject is still making eye contact with the camera.

## Variant count guidance

Portrait type is reliable. However, **trade worker portraits** (carpenter, baker, mechanic,
builder) in **landscape orientation** carry a higher crop-failure rate — the image model has
a strong prior toward the workbench/hands composition that occasionally overrides the face
anchor. This is a model-level tendency, not a prompt error.

**Rule of thumb:**
- Standard professional (office, creative, service): `variants: 1–2` sufficient
- Trade worker in landscape: request `variants: 3` — expect 2/3 to be face-visible portraits
- Any portrait where face visibility is non-negotiable: use tall ratio (h > w) instead of
  landscape; the crop doesn't remove top/bottom and success rate is near 100%

## Avoid
- Tight face/shoulder headshot with no environment visible
- Blank or plain-colour studio backdrop (use real environment)
- Subject looking away from camera or mid-action (that is `scene` type)
- Overly corporate, stiff, "annual report" posture
- Expressions that look rehearsed or artificially cheerful
- Placing the character on the wrong side when a component and side are both specified
- `"resting one hand on [surface]"` — use `"holding X in hand"` or `"one hand in pocket"` instead
