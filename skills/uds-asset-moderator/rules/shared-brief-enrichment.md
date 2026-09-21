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
live in**: classify `illustration`, and carry the claim as the card's **functional content** — a
labelled badge/indicator/status chip and the supporting visual — composed as a compact UDS card
(the prescribed icon, if useful, becomes one small element inside the card, not the whole
asset). Do NOT render it as a marketing headline or subline/tagline — the host provides the
heading; see `rules/shared-brief-parsing.md` and `uds-wireframe/rules/shared/no-marketing-heading.md`. Quote the decisive signal (the value-prop or copy the asset must convey) in
`rationale`, the same discipline as the mode decision. A genuine mark with NO message — a
favicon, a decorative spot illustration, a logo lockup — correctly stays `image`; this reframe
applies only when a *message* is the point. **When the claim arrives as marker-identified
component copy** (a `Context:` line, a `#`/`##` heading, or description — see
`rules/shared-brief-parsing.md`), any functional copy slots (badges, status pills, micro-labels)
carry a **synthesized, paraphrased-into-English** rendering (or a generic placeholder), NEVER the
brief's verbatim heading/subheading/description AND never a marketing headline/subline — the German
example above names the *message to convey*, not text to reproduce. Free-form (unmarked) requests
are unaffected.

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
  Describe the subject, its action and the setting instead.
- **image** `feature` with a person:
  - **Bind the character to the scenario, and make it dynamic** — give them an action, posture,
    and expression so it reads candid and alive. Never a person standing idle, arms down, facing
    the lens head-on (unless the brief explicitly wants a front-on close-up, avatar, or portrait
    headshot).
  - **A body position the request states is content, and it survives.** When the request says
    where the subject is, what their body is doing, or what they are underneath, over, inside or
    behind, that is not colour and not mood — it is the staging, and the `feature` renders it. It
    survives being embedded in a quote, a subordinate clause, an aside or a figure of speech: a
    speaker who names the situation they work in has told you the situation. It outranks every
    framing preference in this list, the face-anchor rule and the waist-height anchoring device
    included — when a stated position and a fully-visible face pull against each other, move the
    CAMERA until both hold, and never move the person. It also outranks the resolved-moment
    re-frame: that re-frame chooses WHICH MOMENT of a difficulty to photograph, and a position
    the request stated is not the difficulty. Where the copy's own point is that the work carries
    on, the resolved moment is that work still happening with the difficulty handled — not the
    subject got up out of it. Re-read the request before you write the subject and check that
    every place and position it named is still in what you are about to write; if one is missing,
    it was dropped, not decided against.
  - **Device with a person:** a phone/tablet/laptop in the shot does NOT make the device the
    subject. If a **person** is the named subject doing a task, keep their **face the anchor**
    (see `shared-image-type-scene`'s waist-height anchor technique for headroom, crop-safe
    on landscape); the device is held/used. Only make the
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

    **Strategy B — Screen as hero (`device-focused` type, or two-person scene):**
    The camera must occupy a position where the screen naturally faces it:
    - Phone/tablet: device flat on a surface, screen facing up; or person from over-the-shoulder
      angle so screen faces camera. Encode: `"non-branded tablet lying flat on the desk, screen
      facing upward, fully visible from above"`.
    - Laptop: `"non-branded laptop on the desk, lid open at 105 degrees facing the camera,
      over-the-shoulder shot from slightly above"`. Add `"non-branded"` positively — negativePrompt
      alone does not suppress the Apple logo.
    - Two-person scene: one person faces camera, one looks at the screen — the camera position
      between them can naturally see both face and partial screen without physical contradiction.
  - **Screen-based product is the focus** (the UI is the point — "show the dashboard", "the app
    on the phone"). Order it: **first** a natural use moment, **then** full-screen visibility via
    camera placement. Write a real moment (tapping a phone to pay at a counter, typing at a
    laptop, glancing at the phone in hand, two people over a dashboard) and have the camera catch
    the screen naturally — **over-the-shoulder / from above** — NOT the person holding the device
    up to face the lens (fake-demo look) and NOT a lone idle device. Then name a **relevant, real
    app interface** (layout/UI regions, short labels only — no paragraphs; default to the
    `showroom` product, else the scenario). For a pixel-accurate UI, prefer `hybrid` mode.
  - **Camera and lighting are NOT yours.** image-svc decides camera angle, framing, shot length,
    lens, lighting direction and quality, colour grade, depth of field and atmosphere — from the
    resolved `imageType`, `assetType` and any supplied reference image. Do NOT write them into the
    `feature`. Two stages authoring the same axis is what produced framing instructions the
    generator was separately told to ignore. State the focal subject, the action, the setting,
    the composition intent (which side stays calm, how much of the frame the subject fills) and
    what the asset must communicate — then stop.
- **illustration** `feature`: describe *structure and intent* (which UDS components, what
  copy slots, what data the screen shows, what motion if `intent:animation`) — not pixel
  coordinates. The agent builds real components; over-specifying layout fights the system.
  Copy slots must be **synthesized / generic** (placeholder labels, lorem, redaction bars) — NEVER
  the brief's own heading, subheading, or description text, which the host component already renders
  (see `rules/shared-brief-parsing.md`).

Budget: keep each `feature` under ~1500 characters; the orchestrator appends up to ~2500
(shared context + hybrid embed contract), hard-capped at 5000 combined. Lead with the most
load-bearing detail so truncation never drops the subject.

When the request is terse, enrich from the params (see `shared-param-mapping.md`) and the
brand identity — do not ask questions here (this is the machine plan path; the interactive
path is `/imagine`). When the request is already rich, tighten rather than pad.
