# Hybrid decomposition contract

The hybrid imageBrief MUST:
- describe the scene with the device (phone/tablet/laptop/monitor) clearly visible,
- instruct: "the device screen is a flat, solid, uniform magenta (#FF00FF) surface with no
  glare, no reflections, no content" — this is the chroma target the orchestrator detects,
- prefer the screen plane facing the camera (slight angles are fine; extreme foreshortening
  makes the embed unusable),
- have the screen occupy roughly 15-40% of the frame.

The hybrid illustrationBrief MUST:
- describe ONLY the interface to animate (what UI, which components, what motion),
- not re-describe the scene — the orchestrator appends the background-image and embed
  instructions itself,
- assume the interface will be perspective-mapped into the device screen.
