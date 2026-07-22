# Hybrid decomposition contract

The two background embed styles treat the generated image as a **backdrop** the
illustration's UI floats over; `interface-asset` places the image inside the rendered
interface as its content. Apply the shared imageBrief rules, then the style-specific
additions.

## imageBrief — all styles

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
  area) that the illustration will mark with a selection marquee as its pointer target — no
  marketing headline is rendered there (see `shared-brief-parsing.md` no-marketing-heading),
  so the region only needs to stay calm and uncluttered enough for the marquee to read clearly.

The `compositionPlan` MUST state both the panel side and the marquee/pointer-target region
(e.g. "panel on the left over the negative space; selection marquee upper-right over the teal wall").

Note: the illustration will show the backdrop **cropped/zoomed to its relevant region**
(objectFit cover + objectPosition on the focal area) — the imageBrief should still
describe the **full scene**; the crop happens in the illustration, not the image.

## embedStyle: interface-asset

The imageBrief MUST additionally produce imagery that works as an **in-interface hero**:
- a single subject with a composition that **crops well to a wide media slot**
  (objectFit cover in a landscape hero region),
- a **calm region** left as intentional negative space inside the hero slot — no marketing
  headline is rendered over it (see `shared-brief-parsing.md` no-marketing-heading); the calm
  space simply keeps the hero from feeling cluttered.

The `compositionPlan` MUST state the interface type (e.g. "CMS editor shell with left
icon sidebar") and where the floating fragments sit (e.g. "prompt bubble bottom-left
overlapping the wireframe edge, mini-toolbar upper-right").

## embedStyle: background-full

The `compositionPlan` MUST state which side the floating cluster goes
(e.g. "cluster on the right over the blurred background").

## embedStyle: floating-card

The image is shown as a **contained rounded card** (not full-bleed), so the imageBrief
should produce a subject that reads well at card scale — a single clear subject, comfortably
inside the frame. Negative space is less critical here (the highlight chips sit on the card's
edge against the pale surface), but still avoid clutter at the very edges where a chip lands.
Cutout (`assetType: "cutout"`) imagery also works well for this style.

The `compositionPlan` MUST state where the highlight chips sit relative to the card
(e.g. "portrait card centred; labelled chip over the top-left corner, icon pill over the
lower edge").

## illustrationBrief — all styles

The hybrid illustrationBrief MUST:
- describe ONLY the feature UI to render (which components, what copy, what motion),
- not re-describe the scene — the orchestrator appends the backdrop image and the
  `[HYBRID EMBED CONTRACT]` instructions itself,
- assume the orchestrator handles the compositing contract (backdrop card + pointer for
  `background-pointer`, full-bleed backdrop + floating cluster for `background-full`,
  in-wireframe hero asset + floating fragments for `interface-asset`, contained image card
  + edge highlight chips for `floating-card`).
