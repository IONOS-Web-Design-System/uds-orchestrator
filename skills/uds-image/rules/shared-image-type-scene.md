# Image type: scene

Use when the brief describes a real-world moment — a person doing something in their
environment, or a product or service being used in context. The setting, action, and atmosphere
are the story. The character is part of the scene, not its anchor: they fit naturally into the
environment rather than posing for the camera.

When a device or screen is the HERO rather than part of the moment, use `device-focused`.

## When to apply
Brief signals: "working in", "using", "cooking", "at their desk", "in their shop",
"gardening", "coding", any active verb + professional or personal context where the
overall scene — not the person's face — is the focal point.

**Distinction from portrait:** if the brief asks the person to be the clear focus,
facing the camera with their identity and accessories telling the story → choose
**portrait** instead. Scene is for moments of life; portrait is for character.

## Face rule

**No hard face requirement.** The character may be fully visible, partially visible,
turned away, or a supporting figure in the composition. Face visibility is a bonus,
not a constraint.

**Exception — explicit user request only:** if the brief explicitly asks for the face
to be visible ("facing camera", "clear face", "recognizable person"), open the prompt by
stating plainly that the full face stays uncropped and visible, then apply portrait's
rules for that shot distance.

## Composition rules

These are the properties a scene frame must have. They hold whatever viewpoint is chosen, and
they are what a chosen viewpoint has to be checked against.

- **The person belongs to the setting, not the other way round.** They are mid-action — hands
  engaged, body oriented toward the task, not toward the camera. A subject who has stopped to
  be photographed has already failed this rule.
- **The setting has to stay legible.** Tools, equipment and objects that belong to this place
  are in the frame and readable enough to say where this is and why the moment matters.
- **Nothing may depend on the face.** Per the face rule above, the face is a bonus. A
  composition that only works if the face reads is the wrong composition for this type.
- **When only PART of the person is in the frame, that is deliberate and has to be stated.**
  Hands and forearms entering at one edge, or the back of a head and one shoulder as a shape at
  the frame's border, are intentional choices and must be encoded explicitly, in your own words,
  so they read as composed rather than as a crop that went wrong.
- **Off-centre and asymmetric.** Never the device dead-centre with symmetrical margins. The
  person's partial presence, where there is one, should create diagonal tension.
- **The key product element reads clearly and nothing competes with it.** Whatever is behind and
  around it stays subordinate — present enough to place the scene, never loud enough to pull the
  eye off the thing the image is about.
- **One side of the frame stays open when this image will carry an overlay.** See the
  negative-space rule below; it is a hard requirement in hybrid mode, not a preference.

## The person as atmosphere, and the open side (hybrid backdrop)

Some scene images exist to be the BACKDROP for a hybrid asset, with an illustration or UI panel
landing on top of them. The person is then an atmospheric presence rather than a subject: they
occupy one side of the frame, their face may well be visible but their attention is on their
work or their device and not on the camera, and the setting carries the story — the sofa, the
plant, the textured wall, the lived-in interior.

This is still `scene` and not `portrait`. If the brief wants the person to face the camera with
their identity as the story, that is portrait.

- **Name the side.** State which side of the frame the person occupies, so the moderator knows
  which side the overlay lands on. A composition that leaves this implicit cannot be composited
  against.
- **Keep the other side open and calm** — a plain wall, soft window light, an uncluttered
  interior — with nothing busy overlapping that zone. Encode it explicitly and in your own
  words; the illustration panel needs a clean region to land in.
- **The device is incidental here.** Partly visible, or not shown at all. The setting is the
  story, and an averted attention is what makes it candid instead of posed.

## Story direction
- The image should communicate a complete micro-story: what is happening, where, and why
- Show the moment of engagement — card tapping terminal, fingers mid-scroll, team leaning
  toward a shared screen — not before or after
- Context objects reinforce setting authenticity — take them from `shared-scenario-props`,
  which keys them on the scenario's place and person; never from a house default
- If a screen is incidental here (device-in-context, screen NOT the focus), it may show
  abstract colour blocks or blurred content — never readable paragraphs, logos, or UI chrome.
  (When the **screen-based product itself is the focus**, the opposite applies — full screen
  clearly visible showing a relevant real interface; that is the `device-focused` type, not
  this one.)

## Surface texture as a design layer

When a desk or table surface is in the frame, it is a full compositional layer and not just a
background. Specify it explicitly:

| Surface | Mood | Prompt encoding |
|---|---|---|
| Warm dark wood grain | Rich, professional, contrast | `"warm dark walnut wood desk surface with visible grain"` |
| Light cream / warm white | Airy, minimal, modern | `"warm cream surface, soft diffuse light"` |
| Tan / sand / light wood | Relaxed, lifestyle, approachable | `"tan wood surface, warm ambient light"` |
| Concrete / stone | Creative, studio, editorial | `"raw light concrete desk surface"` |
| White / bright neutral | Clean, tech, high contrast | `"bright white desk surface, clean and minimal"` |

Where that surface takes a large share of the frame, it is carrying real visual weight rather
than sitting behind the subject — describe its grain, its texture, and the light falling across it.

## Foreground objects — identity and depth

When a work surface is in the frame, one or two objects at the very front of it are the
**identity layer** — they answer "who is this person?" at a glance.

**Which objects: `shared-scenario-props`.** That rule is the only place prop objects are
named. It keys them on the scenario's `place` and on who the person is, and states how the two
combine, which object to vary, and how to colour it. This table used to be keyed on trade alone
— no place at all — so a hospitality object could reach an office brief and a house favourite
could reach anything. Do not restate its objects here.

What belongs to THIS rule is where they sit: at the very front of the work surface, nearest the
viewer, and subordinate enough that the screen behind them still reads. State the objects and
their placement in your own words rather than reusing a fixed sentence shape.

## Screen visibility (device-in-scene shots)

When a screen is visible in a scene image, it should be the **brightest element in the
frame** — the natural eye anchor after the person's peripheral presence:

```
"laptop/phone screen clearly visible, screen emitting soft light slightly
brighter than the ambient environment, screen showing [relevant interface description]"
```

Do NOT describe the UI in fine detail — describe the layout type: "a business dashboard
with a circular metric and navigation sidebar", "a warm e-commerce storefront with
product grid and hero image", "a website with a large hero image and navigation bar."

## Composition across aspect ratios

image-svc generates natively at the target aspect ratio; no crop occurs. Landscape targets are natively wide, tall targets natively tall. Where the person's presence is peripheral, keep the screen and the key foreground objects toward the middle as the compositional anchor — the partial presence at the frame's edges is peripheral by design and stays within the native canvas.

## Person direction

- DO NOT pose the subject facing the camera with a neutral expression
- Expression matches the activity: focused, engaged, absorbed
- Posture and body language harmonize with the environment rather than addressing the viewer

## When an included person's face should stay visible

People in a scenario shot default to secondary — cropped, blurred, or backgrounded is fine
when the brief doesn't ask otherwise (a customer at a counter, or a team working together, are
already covered that way). Some briefs still want that included person's face to read clearly
while their hands stay on the interaction. Reach for this technique rather than posing them
front-on, which turns the shot into `portrait`:

- **Physical anchor at waist height.** Place the subject behind a counter, desk, or
  workbench — the barrier sits at waist level, so the hands-on action (typing, handling a
  component, tapping the reader) happens below chin height and the face stays naturally
  above it. Describe the subject as standing behind that surface with their upper body
  clearly above it and open space over the head — word it fresh each time rather than
  reusing one fixed phrase. This physical-anchor approach is the most reliable pattern
  for combining a visible face with visible hands-on activity, and it works from any
  viewpoint: it is where the subject stands, not where the camera is.
- **Prefer standing or upright actions over crouching or bending.** A head-down pose drives
  the model to crop in and lose the face. Reframe a low-level task as the person pausing
  mid-task and looking up, or pick an equivalent upright action.
- **Two or more people:** show genuine social interaction — conversation mid-flow, shared
  laughter, a collaborative gesture — rather than people posed side by side for the camera.

## Avoid

- Subject standing upright, arms at sides, staring into the camera
- Artificially posed "smile and hold" headshot composition
- Background replaced with plain studio backdrop
- Symmetrical, centered composition — always create diagonal tension
- Person holding the device up toward the camera to "present" the screen
- Plain white backdrop for device shots — always include a real surface texture
- Device floating in empty space with no surface, foreground objects, or person context
