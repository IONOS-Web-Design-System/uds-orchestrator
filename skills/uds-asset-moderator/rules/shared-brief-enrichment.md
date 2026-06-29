# Brief enrichment (all brands)

Turn the raw request into a self-contained `feature` brief each generator can act on
WITHOUT seeing the original request or the other generator's brief. Enrich — do not
merely copy the request.

**Reframe a mis-scoped request — render the message, not a literal low-information visual.**
Before classifying and enriching, check the request's *intent* against the *visual it
prescribes*. When a request pins a low-information visual (a single bare icon, a lone
shield/badge/lock/checkmark mark, a flat pictogram, "icon-based, no text") **and** its real
purpose is to communicate a claim or value proposition — especially when it carries marketing
copy (a headline or value line, e.g. a German claim like "DSGVO-konform, Ihre Daten bleiben in
Deutschland") — do NOT faithfully shrink it to a text-less graphic. An `image` feature must
omit all text (image models garble glyphs), so routing such a request to `image` throws the
message away and yields a generic icon. Instead **reframe it to a content card the message can
live in**: classify `illustration`, and carry the claim into real copy slots — a headline, a
short subline, and a labelled badge/indicator/status chip — composed as a compact UDS card
(the prescribed icon, if useful, becomes one small element inside the card, not the whole
asset). Quote the decisive signal (the value-prop or copy the asset must convey) in
`rationale`, the same discipline as the mode decision. A genuine mark with NO message — a
favicon, a decorative spot illustration, a logo lockup — correctly stays `image`; this reframe
applies only when a *message* is the point.

A good `feature` states, in this order, only what applies:
1. **Focal subject** — name it concretely (not "a scene" but "a small bakery storefront at
   dawn"). One subject; resolve vague nouns into specifics.
2. **Composition** — framing, where the subject sits, and any negative space (mirror
   `sharedContext.compositionPlan`).
3. **Mood / tone** — 3–5 adjectives consistent with `sharedContext.tone`.
4. **Brand cues** — palette family and finish from the inlined uds-style-guide (hex anchors
   live in `sharedContext.paletteRefs`); never invent colors.

Per-generator hazards to OMIT:
- **image** `feature`: never request rendered text, headlines, logos, UI chrome, or a
  "blank screen to fill" — image models garble glyphs and we composite UI separately.
  Describe lighting, lens, materials, environment instead.
- **image** `feature` with a person: ALWAYS state the **camera shot** explicitly — an implicit
  shot lets the model crop the head off. If the person must be recognizable / their face is
  the point, frame it as a **portrait or avatar** and include "full face visible from hairline
  to chin" — downstream `uds-image` enforces face-visibility ONLY for portrait/avatar, and
  allows cropping for generic scenes. Use a scene/scenario framing (face may be partial) only
  when a clear face is genuinely not needed (hands on a keyboard, a figure from behind, a
  room). Naming a real person/role ("a marketing expert presenting") without a shot is the
  classic way to get a headless torso. Also:
  - **Bind the character to the scenario, and make it dynamic** — give them an action, posture,
    and expression, shot at a natural three-quarter / slightly-angled view, ideally **caught
    mid-moment (walking, laughing, reaching, gesturing) with a slight natural motion blur** so it
    reads candid and alive. Never a person standing idle, arms down, facing the lens head-on
    (unless the brief explicitly wants a front-on close-up, avatar, or portrait headshot).
  - **Landscape head-crop safety:** image-svc renders square then center-crops — a landscape
    (w > h) target trims top/bottom. For any person in a landscape image, keep them in the lower
    two-thirds with clear headroom (seated or behind a waist-height surface), or pull back to an
    establishing shot — never let a head sit near the top edge.
  - **Lighting & mood:** default **bright, natural, vivid** — airy and uplifting, never moody or
    dark; warm/relaxed ("chill") tone, optionally a subtle film-like filter/grade. Set the mood
    with **colourful props + a soft bokeh background**. Only go cool/clinical when the subject
    demands it, kept bright and warmed with a practical accent.
  - **Device with a person:** a phone/tablet/laptop in the shot does NOT make the device the
    subject. If a **person** is the named subject doing a task, keep their **face the anchor**
    (person-scenario, headroom, crop-safe on landscape); the device is held/used. Only make the
    screen the hero when the brief is explicitly about what's on screen.
  - **Device physics — the screen cannot face both the person AND the camera at the same time.**
    Never write "screen facing forward and fully visible to the lens" when a person is also
    looking at the device — that instruction is physically impossible and causes the image model
    to hallucinate UI content onto the BACK surface of the device (a tablet back or laptop lid
    showing colourful graphics). There are exactly two correct strategies:

    **Strategy A — Device as prop (person is the hero, `portrait` or `scene` type):**
    The screen naturally faces the person; the camera sees the plain back. This is physically
    correct and looks natural. Do NOT mention screen content at all. Encode the device as a
    physical object only:
    - Phone/tablet: `"holding a tablet naturally in their right hand, resting at waist height"`
    - The back of the device should be a plain clean surface — add to negativePrompt:
      `"graphics or UI rendered on the back of the device, content on tablet back, screen
      graphics on device lid"`.

    **Strategy B — Screen as hero (`scenario` type, or two-person scene):**
    The camera must occupy a position where the screen naturally faces it:
    - Phone/tablet: device flat on a surface, screen facing up; or person from over-the-shoulder
      angle so screen faces camera. Encode: `"non-branded tablet lying flat on the desk, screen
      facing upward, fully visible from above"`.
    - Laptop: `"non-branded laptop on the desk, lid open at 105 degrees facing the camera,
      over-the-shoulder shot from slightly above"`. Add `"non-branded"` positively — negativePrompt
      alone does not suppress the Apple logo.
    - Two-person scene: one person faces camera, one looks at the screen — the camera position
      between them can naturally see both face and partial screen without physical contradiction.
  - **Landscape crop-safety — use a physical anchor, not prose headroom:** `prose headroom
    instructions ("clear space above the head") are routinely ignored by the model.` Instead
    seat the subject behind a desk or counter: `"subject seated behind a waist-height white desk,
    upper body well above the desk surface, clear open space above the head"` — the desk creates a
    structural mid-frame anchor that keeps the face in the upper-middle of a 16:9/4:3 frame.
  - **Screen-based product is the focus** (the UI is the point — "show the dashboard", "the app
    on the phone"). Order it: **first** a natural use moment, **then** full-screen visibility via
    camera placement. Write a real moment (tapping a phone to pay at a counter, typing at a
    laptop, glancing at the phone in hand, two people over a dashboard) and have the camera catch
    the screen naturally — **over-the-shoulder / from above** — NOT the person holding the device
    up to face the lens (fake-demo look) and NOT a lone idle device. Then name a **relevant, real
    app interface** (layout/UI regions, short labels only — no paragraphs; default to the
    `showroom` product, else the scenario). For a pixel-accurate UI, prefer `hybrid` mode.
- **illustration** `feature`: describe *structure and intent* (which UDS components, what
  copy slots, what data the screen shows, what motion if `intent:animation`) — not pixel
  coordinates. The agent builds real components; over-specifying layout fights the system.

Budget: keep each `feature` under 1200 characters — the orchestrator appends ~600 chars of
shared context (and, for hybrid, the embed contract). Lead with the most load-bearing
detail so truncation never drops the subject.

When the request is terse, enrich from the params (see `shared-param-mapping.md`) and the
brand identity — do not ask questions here (this is the machine plan path; the interactive
path is `/imagine`). When the request is already rich, tighten rather than pad.
