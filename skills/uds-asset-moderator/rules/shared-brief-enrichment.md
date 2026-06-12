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
  classic way to get a headless torso.
- **illustration** `feature`: describe *structure and intent* (which UDS components, what
  copy slots, what data the screen shows, what motion if `intent:animation`) — not pixel
  coordinates. The agent builds real components; over-specifying layout fights the system.

Budget: keep each `feature` under 1200 characters — the orchestrator appends ~600 chars of
shared context (and, for hybrid, the embed contract). Lead with the most load-bearing
detail so truncation never drops the subject.

When the request is terse, enrich from the params (see `shared-param-mapping.md`) and the
brand identity — do not ask questions here (this is the machine plan path; the interactive
path is `/imagine`). When the request is already rich, tighten rather than pad.
