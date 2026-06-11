# Hybrid decomposition contract

The contract differs by `embedStyle` — apply ONLY the matching section.

## embedStyle: screen

The hybrid imageBrief MUST:
- describe the scene with the device (phone/tablet/laptop/monitor) clearly visible,
- instruct: "the device screen is a flat, solid, uniform magenta (#FF00FF) surface with no
  glare, no reflections, no content" — this is the chroma target the orchestrator detects,
- prefer the screen plane facing the camera (slight angles are fine; extreme foreshortening
  makes the embed unusable),
- have the screen occupy roughly 15-40% of the frame.

## embedStyle: floating

The hybrid imageBrief MUST NOT request a magenta screen. Instead it MUST:
- request a clean scene with intentional negative space where the floating panel will sit
  (no busy detail or focal subject in that region),
- keep the imagery's focal subject clear of the panel area.

The `compositionPlan` should say which side the panel goes (e.g. "panel on the right
over the negative space").

## Both styles

The hybrid illustrationBrief MUST:
- describe ONLY the interface to animate (what UI, which components, what motion),
- not re-describe the scene — the orchestrator appends the background-image and embed
  instructions itself,
- assume the orchestrator handles the compositing (punch-through screen embed for
  `screen`, floating panel for `floating`).
