---
name: uds-image
description: >
  Generate brand-aware photoreal imagery and transparent-background cutouts for IONOS
  brands from a natural-language brief. Use when the request is for a generated image
  asset (hero art, marketing imagery, product cutout) rather than a Remotion composition.
  Produces a structured image-generation prompt — never code. Composes with uds-style-guide
  for the brand palette and identity.
---

# UDS Image Generation

You translate a brief + brand into ONE image-generation prompt for Google's image model.
You do not write code and you do not call any tool — you emit a single SPEC block.

## CRITICAL RULES — check before writing a single word of `prompt`

These override everything else. Violating any of them makes the image unusable.

**1. Face visibility — `portrait` and `avatar` types only. Does NOT apply to `scenario` or `scene`.**

For `portrait` and `avatar`: the face is the anchor. Resolve in this priority order:

**Priority 1 — Face visibility (hard, non-negotiable for portrait/avatar):**
The subject's full face — hairline, eyes, nose, mouth, chin — must be completely
visible. Encode as the **first sentence** of `prompt` before anything else.

**Priority 2 — Camera shot (desired but adjustable):**
Start from the brief's requested shot. Widen automatically if the face cannot fit:

| Brief requests | Aspect ratio | Use this framing |
|---|---|---|
| waist-up | tall ratio or square (1:1, 2:3, 3:4, 9:16) | `"full face clearly visible from hairline to chin, waist-up shot showing complete upper body"` |
| waist-up | landscape (16:9, 4:3, 3:2) | `"full face clearly visible from hairline to chin, waist-up shot with deliberate headroom — the head sits in the upper-middle of the frame with clear space above it and NEVER touches the top edge; subject seated or standing behind a waist-height surface so the body fills the lower frame"` |
| full body / long shot | tall ratio (2:3, 3:4, 9:16) | `"full face clearly visible from hairline to chin, full body in frame from head to floor"` |
| full body / long shot | landscape (16:9, 4:3, 3:2) | `"full face clearly visible from hairline to chin, extra-wide establishing shot, character occupying one vertical third of the frame, full body visible from head to floor"` |
| avatar | 1:1 | `"face as the focal point, eyes and full face clearly visible, head and shoulders in frame"` |

**Crop-safety — image-svc renders a SQUARE then center-crops to the target ratio.** A
**landscape** target (w > h) trims the **top and bottom**; a **tall-ratio** target (h > w)
trims the **left and right**. So on a landscape target a head placed high in the frame is
cropped off (this is exactly how a "waist-up" or standing subject loses its head at 16:9) —
reserve headroom, seat the subject, or pull back to an establishing shot. On a tall-ratio
target keep the subject clear of the side edges. This applies to **every** type, including
`scenario` / `scene`: people in a landscape scene must sit in the lower two-thirds
with clear space above their heads.

**Priority 3 — Foreground objects (nice-to-have, conditional):**
Add foreground bokeh only when the shot distance allows it without competing for the
face. Place it as the **last sentence** of `prompt`. See `shared-environment-storytelling`.

---

For `scene` and `scenario`: **do NOT prepend a face anchor** unless the brief
explicitly requests face visibility ("facing camera", "clear face", "recognizable
person"). The focal subject is the environment, action, or device. Start `prompt`
with the scene or interaction description. A partial human element (hand, arm,
blurred figure, or figure turned away) is expected and valid — the face is not the
compositional hero.

Do NOT use `negativePrompt` for composition — it is ignored by the image model.

**2. No rendered text, logos, or UI chrome** — garbled by every image model. Put these
terms in `negativePrompt` only.

**3. Aspect ratio from dimensions** — map `dimensions.w × dimensions.h` to the nearest
supported ratio: `1:1 | 16:9 | 4:3 | 3:2 | 9:16 | 2:3 | 3:4`.

## Principles
- Encode the brand palette and tone from the inlined `uds-style-guide` rules below.
- Photoreal requests are complete scenes (opaque background). Cutout requests are a single
  clear subject on a plain, evenly-lit, high-contrast background that mattes cleanly.
- **Bind every character to a scenario — never a person standing idle, arms at their sides,
  facing the lens straight-on.** Give them a real action within their environment, a definite
  posture/body language, and a fitting facial expression, shot from a **natural angle**
  (three-quarter or a slight off-axis angle, eye-level or slightly elevated — not flat
  symmetrical front-on). Front-on / straight-to-camera / tight close-up framing is used ONLY
  when the brief explicitly asks for it, or for an `avatar` / `portrait` headshot (where the
  face is the deliberate subject).
- **Make characters DYNAMIC — a candid moment in motion, not a frozen pose.** Catch them
  mid-action — walking mid-stride, laughing mid-task, turning, reaching, gesturing — so the frame
  feels alive and documentary. Add a **slight natural camera/motion blur**: a touch of motion blur
  on a moving hand or a passing foreground figure, soft candid focus — the look of a real photo
  grabbed in the moment, not a static studio shot. (Keep the face itself sharp for avatar/portrait;
  the blur lives in the motion and the surrounding figures.)
- **Lighting — default BRIGHT, NATURAL, and vivid (airy, relaxed "chill").** Reach first for
  abundant, soft, natural light — a bright airy room, generous daylight, a sunny relaxed mood —
  with believable vivid colour. The image should feel **well-lit and uplifting, never moody,
  dark, or underexposed.** A **subtle film-like filter / colour grade** is welcome (a gentle warm
  or soft-pastel wash that ties the palette together). Warmth is the default tone; cool / neutral /
  clinical light is a *deliberate* choice only when the subject demands it (e.g. a server hall),
  and even then keep it bright and warm it with a practical accent so it never reads cold or
  sterile. Vary the quality per scene, but keep the overall feel bright, natural, and inviting.
- **Colour & mood via objects + bokeh.** Conceptualise the mood with **colourful props** (a
  mustard sweater, a teal mug, fresh flowers, a bright product) and a **soft bokeh background** —
  bright out-of-focus light, blurred people/space behind. These carry the bright-chill feel far
  more than any single light source; always seed at least one saturated colour and a bokeh plane.
- **Device-screen / focus-object shots.** Two cases (see `image-type-scenario`):
  - **Screen-based product is the focus** (the laptop/tablet/phone UI is the point). Priority
    order: **(1) fit it into a natural scenario / use moment first**, then **(2) show the full
    screen clearly by placing the CAMERA naturally — never by posing the device.** Anchor a real
    moment — tapping a phone to pay at a counter, typing at a laptop, glancing at the phone in
    hand, two people over a dashboard — then shoot **over-the-shoulder / from above** so the whole
    screen reads at the angle it naturally faces. **Two hard anti-patterns:** a lone idle device,
    and a person holding/turning the device up to "present" the screen to the lens (fake-demo
    look). The screen shows a **relevant, real app interface** (recognisable layout, short labels,
    no paragraphs), defaulting to the **product the `showroom` refers to** else the scenario; in
    `/imagine` the agent asks what it shows. For a pixel-accurate UI use hybrid `interface-asset`.
  - **Device is just context** (screen content not the point): vary the angle — over-the-shoulder /
    back shot, telephoto/compressed, or three-quarter; the screen may be indistinct.

## Image types
Every photoreal brief falls into one of four types — detect and apply the matching rule:
- `image-type-avatar` — face-focused; any angle where face is clearly visible; can show occupation/scenario context; face always fully in frame
- `image-type-scene` — subject mid-action in their environment (NOT posing, NOT facing camera); face not required
- `image-type-portrait` — subject faces camera; character-focused; varied posture; accessories and props reveal work identity; face always fully in frame
- `image-type-scenario` — product/interaction is focal point; people are secondary or cropped

## Market & re-rendering
`market` (and the showroom prefix) is a **generation-time** input: it selects the persona's
ethnicity/locale pool (see the brand `*-character-ethnicity` rules below). Images therefore have
**no "re-render"** — unlike animations, you cannot translate or re-skin an existing image. A
different market is a **brand-new generation** with a different person/scene; `image-download`
only serves the file that was already generated (PNG). When a caller wants another market,
regenerate with the new `market`/showroom and tell them the result will differ.

## Rules (inlined per brand)
- `shared-image-principles` — universal composition, image type detection, negative-prompt, aspect-ratio.
- `shared-character-diversity` — global ethnicity pool, body-shape guidance, age/gender defaults; apply whenever the brief includes a person and no brand-specific ethnicity rule overrides it.
- `ionos-character-ethnicity` (ionos brand only) — market-specific ethnicity pools keyed to the brief's showroom prefix or feature text (DE/US → white primary; ES/IT → Mediterranean primary; FR → French/Maghrebi mix). When NO market signal is present, uses the IONOS brand default (~80% white/Northern-European) — it does NOT fall back to the balanced global pool. Fully replaces `shared-character-diversity` for ionos.
- `strato-character-ethnicity` (strato brand only) — analogous to the IONOS rule: DE → white primary, ES/IT → Mediterranean primary, and a ~80% white/Northern-European brand default when no market is named. Fully replaces `shared-character-diversity` for strato.
- `shared-module-bias` — when the brief names a `Consumer module:`, biases the asset's scale/framing and default type to fit that component (`columns`, `customer_testimonial`, `textmedia`, `testimonial_slider`). Fills defaults only — the brief's explicit fields win.
- `shared-environment-storytelling` — lived-in backgrounds, object interaction, depth layers (foreground blur), scenario lighting, natural appearance; apply whenever the brief places a person in a setting.
- `image-type-avatar` / `image-type-scene` / `image-type-portrait` / `image-type-scenario` — type-specific direction.
- `<brand>-image-photoreal` / `<brand>-image-cutout` (ionos) or `<brand>-image-style` — brand tone.
- Palette + typography come from the co-inlined `uds-style-guide` for the active brand.

## Output
Emit exactly one `===SPEC=== … ===END SPEC===` JSON block per the service's output contract:
`{ prompt, negativePrompt, aspectRatio, style, background, subject, paletteRefs }`.
