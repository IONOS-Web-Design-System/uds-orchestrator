# Brief enrichment (all brands)

Turn the raw request into a self-contained `feature` brief each generator can act on
WITHOUT seeing the original request or the other generator's brief. Enrich — do not
merely copy the request.

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
