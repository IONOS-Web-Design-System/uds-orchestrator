# Image type: scene

Use when the brief describes a real-world moment — a person doing something in their
environment. The setting, action, and atmosphere are the story. The character is part of
the scene, not its anchor: they fit naturally into the environment rather than posing for
the camera.

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
to be visible ("facing camera", "clear face", "recognizable person"), apply the portrait
face anchor as the **first sentence**:
`"full face clearly visible from hairline to chin"`
and treat framing per portrait's rules for that shot distance.

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

**Crop-safety note:** overhead shots have natural symmetry — the key action (hands on
keyboard, device screen) should sit center-frame with no subject element near the top or
bottom edge.

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
[2–3 foreground objects] on the surface immediately in front of the camera lens,
rendered as soft out-of-focus bokeh in the lower foreground,
[surface: warm cream / tan / light wood] visible as the mid-ground,
bright airy natural light from the left, screen as the brightest element in the frame,
editorial lifestyle photography style, shallow depth of field"
```

**Reference look:** back of head as dark shape at right edge; latte + terracotta plate +
film camera as warm foreground; cream surface; MacBook with legible dashboard as the hero.

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
face partially visible, looking down at [laptop/phone/notebook — incidental],
body occupying the [left/right] two-thirds of the frame,
[large tropical plant] in soft focus behind the person's right/left shoulder,
[warm sandy/ochre/cream wall] in soft focus on the open [right/left] side of the frame,
warm ambient interior light, no direct sunlight — diffused and even,
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

## Surface texture as a design layer

For patterns B and C (device-focused scenes), the **desk or table surface** is a full
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

For device-focused scenes, 2–3 foreground objects placed closest to the camera lens are
the **identity layer** — they answer "who is this person?" at a glance. They sit at the
very front of the desk surface and are rendered out of focus (bokeh) while the screen
remains sharp behind them.

Match objects to the user's professional context:

| Profile | Foreground objects |
|---|---|
| Creative / photographer | Film camera with leather strap, coffee in ceramic cup |
| Knowledge worker / blogger | Open notebook with handwritten notes, a pen |
| E-commerce owner | Product samples (small candle, ceramic piece, fabric swatch), packaging |
| Developer / tech | Mechanical keyboard, mug with steam, sticky notes |
| Café / hospitality | Latte art cup on saucer, small plate with spoon |
| Marketing / agency | Printed pages, a highlighted document, a phone |

Encode foreground objects precisely:
```
"a [specific object A with color] and [specific object B with color] sitting on
the desk surface immediately in front of the camera lens, rendered as soft
out-of-focus bokeh in the lower foreground"
```

Choose objects with **distinct, saturated colors** — a terracotta plate, a cobalt
notebook, a forest green cup. Warm mid-tones unify with the surface; a single saturated
accent creates visual interest.

## Screen visibility (device-focused scenes)

When a screen is visible in a scene image, it should be the **brightest element in the
frame** — the natural eye anchor after the person's peripheral presence:

```
"laptop/phone screen clearly visible, screen emitting soft light slightly
brighter than the ambient environment, screen showing [relevant interface description]"
```

Do NOT describe the UI in fine detail — describe the layout type: "a business dashboard
with a circular metric and navigation sidebar", "a warm e-commerce storefront with
product grid and hero image", "a website with a large hero image and navigation bar."

## Crop-safety (non-square canvases)

image-svc renders a square frame then center-crops to the target ratio:
- **Landscape (w > h)** trims top and bottom — for patterns B and C, keep the screen
  and key foreground objects in the center horizontal band; the person's partial presence
  at the edges will be trimmed but that is acceptable (they are peripheral by design)
- **Tall ratio (h > w)** trims left and right — keep the screen and foreground centered

## Person direction

- DO NOT pose the subject facing the camera with a neutral expression
- Expression matches the activity: focused, engaged, absorbed
- For patterns B and C: encode the partial presence explicitly — "only hands and forearms
  visible", "back of head and shoulder as a dark shape at the frame edge"
- For pattern A: posture and body language harmonize with the environment

## Lighting

Natural or ambient practical light from the environment. For device-focused scenes:
- Window light coming from one side creates directional shadows across the surface
- Screen glow as a secondary fill light on the near edge of the keyboard/device
- Overall: **bright, airy, warm** — never dark or moody
- Surface texture reads best under angled natural light (shadows reveal the grain/texture)

## Avoid

- Subject standing upright, arms at sides, staring at lens
- Artificially posed "smile and hold" headshot composition
- Background replaced with plain studio backdrop
- Symmetrical, centered composition — always create diagonal tension
- Person holding the device up toward the camera to "present" the screen
- Plain white backdrop for device shots — always include a real surface texture
- Device floating in empty space with no surface, foreground objects, or person context
