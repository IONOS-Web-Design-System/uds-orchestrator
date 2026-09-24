<!-- THE SCENE CAMERA HALF — emitted only for imageType `scene`, and only when NOTHING has
     already fixed the shot. Pushed by image-svc `src/craft/prompt.ts` on the same `shotIsFixed`
     boolean the plausibility reframe clause already reads:

         shotIsFixed = camera !== null || referenceIsCondition

     GATED ON THE AXIS, NOT ON THE PROFILE. The two things that fix a shot are an injected
     `Photographic camera:` preset and a supplied `condition` photograph, and neither is a
     property of the craftProfile:
       - `full` injects NO preset on any brief (profiles.ts: presets are `minimal`-only), so on
         `full` the axis is open and this block is the type's only camera guidance. A
         profile-gated version of this file would have had to name `full` explicitly and would
         then have been wrong for the case below.
       - a `condition` reference SUPPRESSES the camera preset on `minimal` (prompt.ts,
         directive 2), so `camera === null` alone is not "nothing fixed the shot" — the supplied
         photograph did. Hence the second term rather than a bare null test.
     Scoped to the profiles that deliver the type rule at all (`deliversTypeRule` in profiles.ts),
     which is what keeps it off `none`: `none` is the floor and its prompt must stay
     byte-identical across all four image types, so photographic guidance reaching it would
     destroy the only arm that measures the model unaided. A PURE axis gate would have delivered
     this block on `none` — `camera` is null there on every brief — which is why the scope term
     exists. profileSeparation.test.ts asserts the floor; that assertion is the proof, not this
     comment.

     WHAT THIS FILE IS. It is the CAMERA half of `shared-image-type-scene.md`, split out. That
     rule spent 7,196 of its 16,287 chars (44 %) on `## Camera angle patterns` — four named
     patterns, each with its own angle, height, shot size and lens, and each ending in a worked
     example prompt. The injected catalog that actually delivers the axis per run
     (`shared-camera-scene.md`) is 1,468 chars for ten presets and puts 78-100 chars into a
     prompt. So the layer that does NOT deliver per-run carried ~7,200 chars of camera
     instruction against the ~88 that does, and on `minimal` both reached the same prompt: a
     second and much longer voice on the one axis the preset owns. The split gives the rule the
     CONSTRAINT (what must be true of a scene frame) and the preset the FRAMING (the camera
     facts), with this file standing in for the preset when the axis is open.

     NO NAMED PATTERNS, AND NO WORKED EXAMPLE. The four patterns are recorded as PROVENANCE in
     `shared-camera-scene.md`'s per-preset `Pattern:` tags, not reproduced as instruction here. A
     supplied sentence gets reproduced — measured repeatedly in this workstream; "a florist at a
     counter" produced 7 of 8 invented trades — and the four patterns' code blocks were exactly
     that shape, including a nine-line overhead template. This body therefore REQUIRES THE
     DECISION and names the axes it has to cover, and states no sentence for anyone to copy. The
     range's four ends below are the four patterns' viewpoints stated as options to choose from,
     with the degree bands deliberately dropped: a per-option degree range rebuilds the recipe
     menu, and the catalog's own preset lines carry no degrees either.

     NO POINTER AT `shared-image-type-scene.md`. The two halves are delivered INDEPENDENTLY — the
     rule is inlined on `full` and (per opt-in) on `minimal`, while this file is gated on the
     axis — so any sentence here naming that rule would dangle on the combination where the rule
     is absent and the axis open, and any sentence there naming this file would dangle on every
     run where a preset was injected. The last paragraph of the body states the constraints it
     must satisfy in its own words instead of pointing at them, which costs four clauses and
     cannot dangle.

     >>> WHAT WAS DUAL-NATURED IN THE FOUR PATTERNS, AND WHAT THE RULE KEPT FOR IT <<<
     Checked against the file, pattern by pattern, before anything was cut.
     PATTERN A's waist-height anchor was only PARTLY an angle. It is also the FACE-SAFETY device
     the scene type absorbed when it took over the techniques of the retired person-scenario rule:
     a barrier at waist level puts the hands-on action below chin height, so the face stays
     naturally above it. That constraint SURVIVES, in the rule's `## When an included person's face
     should stay visible`, which already stated it independently of Pattern A and calls it the most
     reliable pattern for combining a visible face with visible hands-on activity. Only the ANGLE
     moved. The vocabulary already draws this line and the guard inherits it: `waist height` is
     deliberately NOT a camera marker in image-svc's MARKERS.camera — "`waist-up` is a SHOT SIZE;
     `waist height` is a physical dimension", measured there as a false positive on both readings.
     PATTERN B's "the face is never in frame because their head points downward" and PATTERN C's
     "face is never visible because the camera is behind the person" are CONSEQUENCES of an angle,
     not constraints. This type has no face requirement in either direction, so nothing was owed to
     them. Their real non-camera content was the PARTIAL-PRESENCE requirement — hands and forearms
     at one edge, or the back of a head and a shoulder as a shape at the frame's border, encoded
     explicitly so it reads as composed — and that survives in the rule, keyed on the OUTCOME
     (only part of the person is in frame) instead of on a pattern name.
     PATTERN D was the most dual-natured of the four and almost none of it was camera: the person
     as an atmospheric presence on one side of the frame, the attention carried away from the lens,
     and the NEGATIVE-SPACE rule that keeps the opposite side open for a hybrid-mode UI overlay.
     All of that is composition and deliverable requirement; it survives whole in the rule under
     `## The person as atmosphere, and the open side`. Only "eye-level or slightly off-axis,
     15-30 degrees to the side" moved, and it had nowhere to move TO — see that catalog's declared
     gap 1, because no preset in it mentions gaze or an open side.

     >>> THE RULE CARRIES NO HTML COMMENT, AND THAT IS LOAD-BEARING <<<
     Which is why this rationale is HERE and not at the top of the file it describes. `stripComments`
     in image-svc prompt.ts is gated on `craftProfile === 'minimal'`: on `full`, rule-file comments
     are INLINED VERBATIM (commentStrip.test.ts, which measures 29,795 comment chars across 32
     rule files reaching `full` today). So a header comment on `shared-image-type-scene.md`
     explaining this split would have (a) added ~5.5 KB of prose to every `full` scene prompt and
     (b) put the four camera facts it has to NAME to state the rule straight back into the prompt
     the split exists to take them out of — the "arm aborted on its own documentation" failure, as
     a delivered regression rather than a harness bug. None of the other three type rules carries a
     comment either. `loadCraftContext` strips unconditionally and the camera catalog is never
     inlined at all, so those two files are the only safe homes and the rationale is split between
     them.

     NOT FIXED BY THIS SPLIT, and named so it is not mistaken for clean: the rule's
     `## Surface texture as a design layer` and `## Screen visibility` sections still carry
     backtick-quoted prompt encodings, and a supplied sentence gets reproduced. Both are
     PRE-EXISTING and out of scope here — rewriting them would alter a delivered `full` prompt on
     an axis this change did not measure. `shared-image-type-device-focused.md` likewise still ends
     in two worked example prompts.

     GUARDS: image-svc `src/craft/__tests__/sceneCameraSplit.test.ts` (the rule's camera silence
     derived from MARKERS.camera, the per-preset family roster, this gate across every reachable
     profile x type x reference cell, and `full`'s camera guidance) and uds-orchestrator
     `scripts/check-scene-camera-split.mjs` (the corpus half, so a corpus-only edit cannot
     reintroduce a camera fact without image-svc present).

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS ARE
     SEMANTIC, and this comment is stripped before delivery on every profile — author-only, never
     instruction. -->

# Camera — decide the scene's viewpoint, and decide it first

State the camera before anything else about the frame: how high it sits against the subject, the angle it looks onto the setting from, how much of the space it takes in, the lens character, and where the depth falls away. Every other compositional choice follows from it, so none of it can be left unstated for the renderer to settle.

Decide it from this setting and this action. The range is wide and each end of it is a real choice, not a default: standing far enough back that the space itself reads and the person is one element inside it; directly above a work surface, where the surface becomes the ground plane and only part of a person enters the frame; placed behind the subject and a little to one side, looking past them at what they are working on; or level with them and turned off their axis, so that one side of the frame stays open and calm.

Two decisions that look like one, and are not. The camera's height is separate from where the subject physically stands in relation to what they are working at. A surface at waist height does its own work from any camera height, and a camera height does not by itself put the hands below the chin. Settle both.

Whatever you choose has to leave the person reading as part of the setting rather than as its anchor, leave the setting legible, and demand nothing of the face.

Write the viewpoint out in your own words on every prompt, never a phrasing carried over from another one.
