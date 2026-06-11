# Image type: portrait

Use when the brief asks for a person looking toward the camera in their professional or
personal environment — the person IS the subject and the story is told through their
identity, attire, props, and setting.

## When to apply
Brief signals: "headshot", "portrait", "professional photo", "standing in their shop/office",
"entrepreneur portrait", "team member photo", any brief asking for a person-facing-camera image.

## Composition rules

Face visibility is a hard constraint. Camera shot is a preference that adjusts to serve it.
See SKILL.md CRITICAL RULE #1 for the full decision ladder. The short version:

- **Waist-up brief + any ratio:** use `"full face clearly visible from hairline to chin, waist-up shot showing complete upper body"` — leads the prompt.
- **Full body / long shot + portrait ratio (2:3, 9:16):** use `"full face clearly visible from hairline to chin, full body in frame from head to floor"`.
- **Full body / long shot + landscape ratio (16:9, 4:3):** landscape cannot fit a standing person at normal long-shot distance without cropping the face. Automatically use: `"full face clearly visible from hairline to chin, extra-wide establishing shot, character occupying one vertical third of the frame, full body head to floor visible"` — this is the only framing that reliably shows the face in landscape format.

Always state the face anchor first — before the character description, before anything else.
- Subject stands or sits naturally within their environment; background shows their workplace
  or context in soft focus behind them
- Slight off-center framing (rule of thirds) feels more authentic than dead-center
- Include at least one contextual prop or environmental element that signals their profession
  (tools, products, workspace equipment, branded attire)

## Person direction
- Subject faces the camera with a warm, confident, positive expression
- Expression should feel like a brief, natural moment of eye contact — not a rigid forced smile
- Posture: upright but relaxed; arms folded lightly, hands in pockets, or holding a relevant prop
- Attire and accessories must fit the professional context described in the brief
- The image should imply a story: who is this person, what do they do, why are they proud of it

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

## Avoid
- Tight face/shoulder headshot with no environment visible
- Blank or plain-colour studio backdrop (use real environment)
- Subject looking away from camera or mid-action (that is person-scenario type)
- Overly corporate, stiff, "annual report" posture
- Expressions that look rehearsed or artificially cheerful
- Placing the character on the wrong side when a component and side are both specified
