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
framing rules for that shot distance.

## Camera angle patterns

The camera angle is the single most important decision in a scene image. Choose the pattern
that fits the brief before writing any other part of the prompt.

### Pattern A — Eye-level with waist anchor (standard)

The default for workshop, retail, kitchen, and office scenes where the environment itself
is rich. Camera is at approximately eye level or slightly elevated (15–20°). The subject
is partially behind a waist-height surface (counter, desk, workbench) that acts as a
natural divider — hands and upper body are active above it, legs are hidden below.

```
"eye-level shot, [person] behind a [counter/desk/workbench], [action in hands],
[environment details] visible behind in soft focus"
```

### Pattern B — Overhead / top-down (workspace from above)

Camera is positioned 50–75° above the subject, looking straight down at the workspace.
The desk or table surface becomes the dominant ground plane — its texture (warm wood,
light concrete, cream linen) is as important as the person. The subject's face is never
in frame because their head points downward; only hands, forearms, and partial clothing
enter the composition.

**When to use:** any workspace/device brief where a rich surface texture exists, or when
the brief calls for a "from above", "flat lay adjacent", or "workspace overview" feel.
Works especially well for laptop/device briefs where the screen should be clearly visible.

**Composition note:** overhead shots have natural symmetry — the key action (hands on keyboard, device screen) should sit center-frame for the strongest composition.

```
"overhead shot looking straight down from directly above, bird's-eye view,
approximately 60-70 degrees above the surface — the desk surface fills the frame
as the ground plane, seen from above,
[surface: warm dark wood / cream marble / light concrete] desk surface with visible texture,
[person's hands and forearms entering from the [left/bottom] edge of the frame only,
partial sleeve visible, face completely out of frame],
[device/object] on the surface, screen facing upward clearly visible,
natural warm daylight from a window at one side casting directional shadows across
the surface texture,
editorial overhead bird's-eye photography style"
```

**Reference look:** warm dark wood grain + black clothing + MacBook with visible website;
hands at lower-left entering frame; no face; surface texture fills 30–40% of frame.

### Pattern C — Behind-the-person (over-shoulder, face absent by position)

Camera is positioned behind and slightly to one side of the subject, looking toward the
screen. The subject's back of head and one shoulder enter from one edge of the frame —
they are a **compositional shape**, not a subject. The screen faces the camera naturally.
Face is never visible because the camera is behind the person.

**When to use:** laptop/tablet briefs where the screen content should be clearly legible,
and where a "looking over someone's shoulder" feel adds authenticity and depth.

```
"over-the-shoulder shot from behind and slightly above to the right,
[partial back of head with natural hair, one shoulder visible in the frame edge],
[device] on [surface] with the screen clearly facing the viewer,
screen displaying [interface description],
[surface: warm cream / tan / light wood] visible as the mid-ground,
bright airy natural light from the left, screen as the brightest element in the frame,
editorial lifestyle photography style, shallow depth of field"
```

A foreground plane is optional here and should stay intentional, not formulaic: 1–2 objects
softly out of focus near the camera can add depth, but pull them from what this specific
person and setting would plausibly have close at hand — not a stock prop list reused scene
to scene.

**Reference look:** back of head as dark shape at right edge; an object native to the
setting sits softly blurred in the near foreground; cream surface; MacBook with legible
dashboard as the hero.

### Pattern D — Eye-level, person in the scene, gaze averted (hybrid backdrop pattern)

**Scene type only.** Pattern D is NOT for portrait type. If the brief asks for the person
to face the camera with their identity as the story → that is portrait type, not Pattern D.
Pattern D is for scene images where the person is an atmospheric presence, used specifically
as a backdrop for hybrid mode UI overlay.

Camera is at eye-level or slightly off-axis (15–30° to the side). The person is the
**atmosphere anchor** — they occupy one side of the frame (typically left), face visible
but looking down at their work or device, NOT toward the camera. The opposite side of
the frame — wall, plant, or soft interior — is intentionally **lighter and more open**,
creating negative space for a UI overlay in hybrid mode.

The device is incidental: partially visible (just the keyboard edge, a phone held loosely)
or not shown at all. The **setting carries the story** — warm sofa, large tropical plant,
textured wall, lifestyle atmosphere.

**When to use:**
- Hybrid mode background images where the illustration panel needs compositional room
- Scene briefs where the atmosphere and character together tell the story
- "Lifestyle", "home office", "casual creative" contexts
- When the brief wants a face to be visible but not posed/frontal

**Composition specifics:**
- Person fills 50–65% of the frame on one side (left or right — specify which, so the
  moderator can place the UI overlay on the open side)
- Face is visible but eyes are downcast or angled away — candid, not posed
- Open side: relatively uniform — wall color, soft plant, window light — nothing busy
  that would compete with the illustration panel
- Rich warm interior setting: sofa, armchair, or standing at a home desk; a large leafy
  plant adds depth and color; warm-toned wall

```
"eye-level shot from slightly to the [left/right], [person description] sitting on a
[teal/warm grey/navy] sofa / standing at a home desk, wearing a [warm-colored garment],
face partially visible, looking down at [laptop/phone — incidental],
body occupying the [left/right] two-thirds of the frame,
[large tropical plant] in soft focus behind the person's right/left shoulder,
[warm sandy/ochre/cream wall] in soft focus on the open [right/left] side of the frame,
warm ambient interior light from one side, no direct sunlight — soft but with visible
light-to-shadow contrast,
rich saturated foreground colors (jacket/clothing), open calmer tones on the [right/left],
documentary lifestyle photography, shallow depth of field"
```

**Reference look:** burnt-orange jacket man on teal sofa, face partially visible looking
down at keyboard; large green tropical plant behind right shoulder; warm sandy wall on
the open right side; face is NOT toward camera — engagement is authentic and candid.

**Negative-space rule for hybrid use:** when this image will be a backdrop for a hybrid
asset, encode the open side explicitly — `"the [right/left] side of the frame remains
relatively open and calm — [plain wall / soft window light] — with no busy elements
overlapping that zone"`. This ensures the generated illustration panel has a clean
compositional region to land in.

---

## Composition rules

- Choose a camera angle pattern from above **before writing the prompt** — it determines
  every other compositional decision
- **Shot distance:** pattern A → long/waist shot showing environment; pattern B → close to
  medium (desk fills frame); pattern C → close to medium (screen fills ~50% of frame)
- **Peripheral human presence** — for patterns B and C, the person is not a full figure.
  They enter the frame as a **partial shape**: hands + forearms (B), or back of head +
  shoulder (C). This is intentional. Encode it explicitly — "hands entering from the lower
  left" or "partial back of head at the right edge of the frame"
- Subject mid-action — hands engaged, body oriented toward the task, NOT facing camera
- Framing is always off-center and asymmetric — avoid placing the device dead-center with
  symmetrical margins; the person's partial presence should create diagonal tension
- Include environmental context: tools, equipment, objects relevant to the setting
- **Patterns A–C:** people may be cropped (partial figure), blurred (shallow DOF), or in the
  background. NOT Pattern D — that pattern deliberately does the opposite, with the person
  filling 50–65% of the frame and the face visible.
- Use depth of field to keep the key product element sharp and people/background soft

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

For patterns B and C (device-in-scene shots), the **desk or table surface** is a full
compositional layer, not just a background. Specify it explicitly:

| Surface | Mood | Prompt encoding |
|---|---|---|
| Warm dark wood grain | Rich, professional, contrast | `"warm dark walnut wood desk surface with visible grain"` |
| Light cream / warm white | Airy, minimal, modern | `"warm cream surface, soft diffuse light"` |
| Tan / sand / light wood | Relaxed, lifestyle, approachable | `"tan wood surface, warm ambient light"` |
| Concrete / stone | Creative, studio, editorial | `"raw light concrete desk surface"` |
| White / bright neutral | Clean, tech, high contrast | `"bright white desk surface, clean and minimal"` |

For pattern B (overhead), the surface occupies 30–50% of the frame — this is its primary
visual weight, not background. Describe the grain, texture, and light falling across it.

## Foreground objects — identity and depth (patterns B and C)

For device-in-scene shots, 1–2 foreground objects placed closest to the camera lens are
the **identity layer** — they answer "who is this person?" at a glance. They sit at the
very front of the desk surface and are rendered out of focus (bokeh) while the screen
remains sharp behind them.

**Which objects: `shared-scenario-props`.** That rule is the only place prop objects are
named. It keys them on the scenario's `place` and on who the person is, and states how the two
combine, which object to vary, and how to colour it. This table used to be keyed on trade alone
— no place at all — so a hospitality object could reach an office brief and a house favourite
could reach anything. Do not restate its objects here.

What belongs to THIS rule is where they sit: at the very front of the desk surface, closest to
the lens, softly out of focus while the screen stays sharp behind them. State the objects and
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

image-svc generates natively at the target aspect ratio; no crop occurs. Landscape targets are natively wide, tall targets natively tall. For patterns B and C, keep the screen and key foreground objects center-frame as a natural compositional anchor — the person's partial presence at the edges is peripheral by design and stays within the native canvas.

## Person direction

- DO NOT pose the subject facing the camera with a neutral expression
- Expression matches the activity: focused, engaged, absorbed
- For patterns B and C: encode the partial presence explicitly — "only hands and forearms
  visible", "back of head and shoulder as a dark shape at the frame edge"
- For pattern A: posture and body language harmonize with the environment

## When an included person's face should stay visible

People in a scenario shot default to secondary — cropped, blurred, or backgrounded is fine
when the brief doesn't ask otherwise (Pattern A above already covers "a customer at a
counter" or "team working together" this way). Some briefs still want that included person's
face to read clearly while their hands stay on the interaction. Reach for this technique
rather than posing them front-on, which turns the shot into `portrait`:

- **Physical anchor at waist height.** Place the subject behind a counter, desk, or
  workbench — the barrier sits at waist level, so the hands-on action (typing, handling a
  component, tapping the reader) happens below chin height and the face stays naturally
  above it. Describe the subject as standing behind that surface with their upper body
  clearly above it and open space over the head — word it fresh each time rather than
  reusing one fixed phrase. This physical-anchor approach is the most reliable pattern
  for combining a visible face with visible hands-on activity.
- **Prefer standing or upright actions over crouching or bending.** A head-down pose drives
  the model to crop in and lose the face. Reframe a low-level task as the person pausing
  mid-task and looking up, or pick an equivalent upright action.
- **Two or more people:** show genuine social interaction — conversation mid-flow, shared
  laughter, a collaborative gesture — rather than people posed side by side for the camera.

## Avoid

- Subject standing upright, arms at sides, staring at lens
- Artificially posed "smile and hold" headshot composition
- Background replaced with plain studio backdrop
- Symmetrical, centered composition — always create diagonal tension
- Person holding the device up toward the camera to "present" the screen
- Plain white backdrop for device shots — always include a real surface texture
- Device floating in empty space with no surface, foreground objects, or person context
