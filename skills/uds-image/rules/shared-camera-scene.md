<!-- Camera presets for imageType `scene`. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts, resolveCamera) and injected as
     `Photographic camera: <text>`. Never inlined as a menu.
     Camera axis only — shot size, camera height, angle, subject turn, lens, depth. No light,
     grade or mood language. Lighting: shared-lighting.md. Props: shared-scenario-props.md.

     >>> THE SPECIFICITY MOVED DOWN INTO THESE LINES, 2026-09-24 <<<
     `shared-image-type-scene.md` used to carry `## Camera angle patterns` — 7,196 of its 16,287
     chars (44 %), four named patterns each stating its own angle, height, shot size and lens and
     each ending in a worked example prompt. That rule is inlined on `full` and (per opt-in) on
     `minimal`; this catalog is what actually DELIVERS the axis, one line per run. So ~7,200 chars
     of camera instruction sat in the layer that does not deliver per-run, against the 78-100 chars
     that does, and on `minimal` both would reach the same prompt.
     The rule now owns the CONSTRAINT and these lines own the FRAMING. The patterns' actual camera
     content was transferred HERE, which is why the lines below are longer than the ones they
     replace: 77-108 chars before (mean 92.1), 147-250 after. Precedent and cost, both measured in
     this repo: the avatar rewrite went 68-97 -> 138-166 for the same reason, and the length of the
     drawn line is the only part of a catalog that costs a `minimal` prompt anything.

     >>> `Pattern:` IS PROVENANCE, NOT INSTRUCTION <<<
     Each preset cites the pattern family its framing came from. A tag line, BELOW the preset text
     — `parseTreatmentPresets` (image-svc/src/craft/treatment.ts) takes the FIRST non-empty line
     under a `## slug` heading and nothing else, so a tag below the text is never injected and a
     tag ABOVE it would BE the injected line. That is not a theoretical hazard: it was measured
     once on the lighting catalog as `Photographic lighting: Daylight: side`, with the whole suite
     green. Same shape as `shared-lighting.md`'s `Reference:` key, and for the same reason: the
     provenance has to be per-preset and machine-checkable, which a prose paragraph in this header
     is not. Nothing on a tag line is ever shown to any model.

     THE FAMILIES, as the rule stated them before the split:
       A  eye-level with a waist-height anchor — the default for environment-rich interiors;
          camera at or slightly above eye level, the subject partly behind a waist-height surface
          with the hands-on action below chin height.
       B  overhead / top-down — camera well above the work surface looking down, the surface the
          dominant ground plane, only hands and forearms entering the frame.
       C  behind-the-person — camera behind and slightly to one side, the back of the head and one
          shoulder a compositional shape at a frame edge; optionally a foreground plane close to
          the lens.
       D  eye-level with the gaze averted — the person an atmospheric presence on one side of the
          frame, the other side left open for a hybrid-mode overlay.

     >>> TWO DECLARED GAPS. Verified against the ten presets below, not inherited <<<
     1. PATTERN D MAPS ONTO NO PRESET. Not one line below mentions gaze, an averted eyeline, or an
        open side of the frame — this catalog is camera-axis-only and D's distinctive content is
        composition and pose, not camera. Its one camera fact ("eye-level or slightly off-axis,
        15-30 degrees to the side") is already inside the range of the three side-on presets, so
        there was nothing left to transfer. D therefore stayed WHOLE in the rule, under
        `## The person as atmosphere, and the open side`. A task brief for this split asserted
        "D -> the averted-gaze framings"; there are none, and this is that claim checked.
     2. `low-wide-floor-level` MATCHES NO PATTERN. All four patterns are at eye level or above, so
        no paragraph ever explained a low camera and there was no specificity to transfer into it.
        Its line below was authored from the geometry alone — which is exactly the position the
        avatar catalog is in for a profile and a low angle, and recorded the same way rather than
        invented around. WHAT WOULD CLOSE IT: a scene pattern authored for a low viewpoint, or
        scene references exported and looked at the way the avatar set was.

     WHAT IS EXCLUDED FROM THE TEXT. PEOPLE — no age, dress, expression, intent or activity. Body
     landmarks (a head, a shoulder, hands and forearms, the chin line) stay: they are the framing
     landmarks that DEFINE a shot size and a crop, which is this axis's subject. PROPS —
     `shared-scenario-props.md` owns objects keyed on place x who; a camera preset naming one puts
     that object into every brief that draws the preset. ASPECT — `brief.dimensions` is the
     caller's; a preset asserting a ratio was measured unsatisfiable. FIXTURES the room may not
     have: `side-on-medium-window-behind` names a window and is the one exception, retained
     because the window is what the preset IS.

     GUARDS: `scripts/check-camera-axis.mjs` (vocabulary, reachability, tag placement) and
     `scripts/check-scene-camera-split.mjs` (the `Pattern:` roster, the rule's camera silence, and
     the image-svc gate). Nothing in this comment is an instruction to any model: it is never
     inlined, and `minimal` strips comments at the loader.

     Families: A, B, C, D
     Families with no preset: D
     Presets with no family: low-wide-floor-level
-->

# Camera presets — scene

## wide-establishing-eye-level
wide establishing interior view from eye level or a little above it, normal-wide lens, most of the room legible from the near floor to the far wall and the subject small enough inside it to read as one element of the space
Pattern: A

## medium-two-shot-side-on
side-on medium two-shot at eye level, both figures fully in frame from about waist height up and turned toward each other rather than toward the lens, normal lens, the space between them left open and the room running on past their shoulders
Pattern: A

## over-shoulder-from-behind
over the shoulder from behind and slightly to one side at eye level, the back of the head and one shoulder entering at a frame edge as a near shape rather than centred, what they are working on square to the lens beyond them, normal lens, shallow depth
Pattern: C

## foreground-framed-medium
medium shot at eye level shooting past a heavy element close to the lens that takes one side or corner of the frame, that element strongly blurred, the subject sharp in the mid-ground beyond it
Pattern: C

## side-on-medium-window-behind
side-on medium at eye level with a window behind the subject, normal lens, the space running deep past them rather than closing off just behind
Pattern: A

## wide-side-on-deep-focus
wide side-on full-scene view from eye level, wide lens, deep focus holding from the nearest foreground to the far side of the space, the subject one element within it
Pattern: A

## through-doorway-wide
wide establishing view at eye level shot through a doorway or opening, its edges forming a dark border down two or three sides of the frame, normal-wide lens, the action deeper inside it and sharp
Pattern: A, C

## overhead-top-down-workspace
near top-down looking straight down from directly over a work surface, the surface filling the frame as the dominant ground plane, normal lens, only hands and forearms entering from one edge and the head out of frame entirely
Pattern: B

## low-wide-floor-level
low camera close to floor level angled slightly up, wide lens, the near floor plane running away from the lens into the frame and the subject standing well back in the mid-ground, reading tall from that height
Pattern: (none)

## medium-close-hands-and-face
medium-close on the hands at work in the lower frame with the face clear and uncropped in the upper frame, the subject upright rather than bent over the task, normal lens, shallow depth
Pattern: A
