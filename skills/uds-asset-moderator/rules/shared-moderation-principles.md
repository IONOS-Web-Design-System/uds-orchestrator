# Moderation principles (all brands)

- Classification keys on the *deliverable*, not the vocabulary: "animated hero image" with no UI is `image` + a note that motion is unavailable in image mode — say so in the rationale and keep mode `image`.
- "Banner", "visual", "key visual", "stage" → `image` unless components/screens are named.
- "Screen", "dashboard", "flow", "wizard", "component", "wireframe" → `illustration`.
- People/places/objects + any of the illustration words in one deliverable → `hybrid`.
- The rationale must quote the decisive phrase from the brief.

## Still vs. animation (the `intent` decision)

`illustrationBrief.intent` has two values and the choice is independent of the image/
illustration/hybrid mode decision:

- **Default `illustration` (a still).** Most UI illustrations — dashboards, settings,
  pricing tables, forms, wireframes — are stills. If the brief does not ask for motion,
  it is a still.
- **`animation` only on an explicit motion cue.** Choose `animation` when the brief
  contains a motion word/intent: *animate / animated, motion, loop, transition, reveal,
  typing / typewriter, slide, fade, zoom, pan, "plays" / "comes in", a sequence or
  timeline*. **Quote the decisive motion phrase in `rationale`** — if there is no phrase
  to quote, it is a still.
- **`durationSec` is not a motion cue.** Its default (3) is always present and says
  nothing about motion; it only matters once `animation` is chosen.
