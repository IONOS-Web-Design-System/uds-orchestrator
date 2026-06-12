# Hybrid decomposition contract

Both embed styles treat the generated image as a **backdrop** the illustration's UI floats
over. Apply the shared imageBrief rules, then the style-specific additions.

## imageBrief — both styles

The hybrid imageBrief MUST:
- describe a clean, well-composed scene — one focal subject, no clutter competing with it,
- instruct: "the full subject is visible inside the frame with clear margin to every frame
  edge — never cropped at an edge",
- request **intentional negative space** on one stated side (e.g. "calm, low-detail space on
  the left third of the frame") — this is where the floating UI will sit; no busy detail or
  focal subject in that region,
- NEVER request a device-screen placeholder, a magenta/keying surface, or any "blank screen
  to fill later" — screens in the scene, if any, are just ordinary scene content.

## embedStyle: background-pointer

The imageBrief MUST additionally:
- include a clear, calm surface or region in the imagery (a wall, a product face, an open
  area) near which the rendered headline will sit — the headline is drawn by the
  illustration, so that region must tolerate white text over it.

The `compositionPlan` MUST state both the panel side and the headline position
(e.g. "panel on the left over the negative space; headline upper-right over the teal wall").

## embedStyle: background-full

The `compositionPlan` MUST state which side the floating cluster goes
(e.g. "cluster on the right over the blurred background").

## illustrationBrief — both styles

The hybrid illustrationBrief MUST:
- describe ONLY the feature UI to render (which components, what copy, what motion),
- not re-describe the scene — the orchestrator appends the backdrop image and the
  `[HYBRID EMBED CONTRACT]` instructions itself,
- assume the orchestrator handles the compositing contract (backdrop card + pointer for
  `background-pointer`, full-bleed backdrop + floating cluster for `background-full`).
