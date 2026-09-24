<!-- Camera presets for imageType `portrait`. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts, resolveCamera) and injected as
     `Photographic camera: <text>`. Never inlined as a menu — the model must not choose from it.
     Camera axis only: shot size, camera height, angle, subject turn, eyeline, lens, depth.
     Lighting lives in shared-lighting.md. Do not add light or grade language here.

     This file is read in code and NEVER inlined (image-svc `skills.coverage.test.ts` lists it in
     INTENTIONALLY_UNSELECTED against `src/craft/treatment.ts`), so this header costs the prompt
     nothing and only the ONE selected line below is ever sent. The planner sees the SLUGS and
     never the prose (uds-moderator `src/plan/prompt.ts`, `extractPresetSlugs`), which is why a
     slug that contradicts its own text is a real conflict and not a cosmetic one.

     RE-AUTHORED FROM THE FIGMA REFERENCES, 2026-09-17. File `StkUOHcGRMDXOZWT0E2nft`, canvas
     `asset/reference` (page `479:15015`), components `portrait-01` … `portrait-06`, plus one
     cross-set reference from the `avatar-*` family. Every PNG was exported and looked at;
     nothing below is taken from a component name, a layer tree, or a component description.

     Reference name -> node id. NODE IDS ARE NOT IN NAME ORDER — cite references by NAME:
       portrait-01 479:15027   portrait-02 479:15028   portrait-03 479:15029
       portrait-04 479:15031   portrait-05 479:15032   portrait-06 479:15030
       avatar-07   479:15040
     04/05/06 are 15031/15032/15030, so the last three are scrambled against their names.

     >>> THE PREVIOUS TEN PRESETS WERE DESCRIPTION-LIFTS, EXACTLY AS device-focused WAS <<<
     Verified here, not inherited from the brief. Each `portrait-*` and `avatar-*` component
     carries a `[styleref]` description string, readable via `search_design_system` — which the
     device-focused inventory recorded as returning "component keys, not node ids", true but
     incomplete: it also returns the DESCRIPTION, which is the useful half and was not recorded.
     Five of the ten previous presets are near-verbatim lifts of a description's camera clause
     plus one adjacent clause:
       portrait-01 "waist-up eye-level slight three-quarter … medium-depth background"
         -> `waist-up-eye-level-three-quarter` "… normal lens, medium-depth background"
       portrait-03 "waist-up eye-level frontal … readable soft background"
         -> `waist-up-eye-level-frontal` "… readable background at medium depth"
       portrait-06 "tight waist-up eye-level three-quarter, long lens, strong background blur
         with bokeh highlights" -> `tight-chest-up-longlens`, the blur clause verbatim
       portrait-04 "three-quarter turned back toward camera" -> `over-shoulder-turned`
       avatar-06 "with gaze off-camera" -> `close-shallow-offgaze`
     The remaining FIVE — `low-angle-hero`, `high-angle-relaxed`, `full-body-environmental`,
     `profile-side-on`, `knee-up-standing-wide` — correspond to NO reference and to NO description.
     All six portrait descriptions say "eye-level" and all six frames ARE eye-level; none says low
     angle, high angle, profile, knee-up or full body. So the axis was authored from reference
     METADATA, never from reference PIXELS, and then padded with inventions to fill a count.

     >>> AND THAT IS WHY THE CLOSE-UP RANGE WAS MISSING <<<
     The close-up IS in the reference set. `avatar-07` is a face-filling frame: the head spans the
     whole frame height, the crown is cut by the top edge, and one shoulder corner is all that is
     left of the body. Its own `[styleref]` calls it "tight head-and-shoulders" — so a catalog
     authored from descriptions produced a head-and-shoulders preset and the close-up range
     vanished between the pixels and the string. `close-shallow-offgaze` ("close waist-up") was the
     only entry whose SLUG claimed closeness and its text named a waist-up, which is the
     near-duplicate-of-waist-up trap rather than a close-up. It is gone.

     >>> THE CLOSE-UP IS WORDED AS FRAME OCCUPANCY — AND THAT IS NOT WHY IT WORKS <<<
     The wording was chosen on a hypothesis and the hypothesis was then MEASURED FALSE, so it is
     recorded here as false rather than quietly kept. The hypothesis: shot size fails to land
     because "close" and "tight" are RELATIVE MAGNITUDES, and stating the GEOMETRY instead — what
     occupies the frame and where the edges cut — would land, the way the device-focused rewrite
     handled screen planes.
     A/B, 16 images, one variable, `craftProfile=minimal`, craft `gemini-3.1-flash-lite`, image
     `gemini-3.1-flash-image`, the real 512x512 testimonial production brief, `treatmentCamera`
     pinned, requestIds pinned across arms, plugin trees differing in this ONE line:
       magnitude wording ("a very close, tightly cropped close-up … at eye level, long lens")
         -> head-and-shoulders or tighter in the pixels: 0 of 8
       geometry wording (the line below)
         -> head-and-shoulders or tighter in the pixels: 0 of 8
     Fisher p = 1.0. The wording is not the mechanism.
     WHAT IS the mechanism, proven in the same corpus: the BRIEF outranks this axis on shot size.
     All 16 image prompts carried the camera geometry (15 of 16 verbatim or near) AND carried the
     planner's own demand "holding a professional camera naturally in both hands at chest height".
     A frame cropped at the shoulders cannot show a camera held at chest height, so the two are
     physically incompatible, and the content demand is what the image model satisfied every time.
     A third arm, plugin tree BYTE-IDENTICAL to the geometry arm and only the brief's three
     held-prop clauses removed (`feature`, `sceneContext.activity`, `sceneContext.engagement`),
     moved the same preset to **6 of 8** head-and-shoulders-or-tighter — 0/8 vs 6/8, Fisher
     p = 0.0070; pooled against both wording arms, 0/16 vs 6/8, p = 0.0002.
     So the close-up preset WORKS on a brief that does not contradict it and is overridden on one
     that does. The strictest reading of the line below — the crown actually cropped by the top
     edge — was 0 of 24 across all three arms, so the crown clause is not delivered by any arm and
     is kept only because it is what the reference shows and what bounds the crop.
     The geometry wording is KEPT anyway, on two grounds that do not depend on the falsified
     hypothesis: it is what `avatar-07` actually shows, and it is the only form that states the
     face is inside a crop that takes the crown. The remedy for the contradicted case is an
     ARBITER between the content demand and the framing axis, which is `craft-plausibility.md`'s
     subject and not this file's.

     >>> `low-angle-hero`: DIAGNOSED, AND NOT FIXED. The cause is the IMAGE MODEL <<<
     It came back 0/3 in the 36-image audit, all three frames eye-level. Three things are now ruled
     out by measurement rather than argued:
       1. NOT the craft model paraphrasing it away. In the stored audit trace
          (`fa-testimonial-strato-145721`) "waist-up from slightly below eye level looking up"
          survives ALL FOUR craft attempts (0, 2, 5, 8) verbatim. In a fresh 8-run arm on the old
          wording the instruction reached the image prompt in 8 of 8.
       2. NOT the wording. An 8-run arm on the rewrite below — the lens stated as being below the
          eye line, with its visible consequences instead of the unmeasurable "slightly" — reached
          the image prompt in 8 of 8 and produced 0 of 8 frames unambiguously below the eye line,
          against 0 of 8 on the old wording. Fisher p = 1.0.
       3. NOT the brief's competing content demand, which is what does control shot SIZE here (see
          the close-up note above). A third arm with the held-prop clauses removed was also 0 of 8.
     So `gemini-3.1-flash-image` does not honour camera HEIGHT on a portrait of a person facing the
     lens, on this brief, at any of the three wordings tried. Stated as an upper bound, not as
     zero: at n=8 per cell a two-tailed Fisher test cannot resolve anything below 5 of 8, so the
     honest claim is "under 5 in 8", not "never".
     The rewrite below is kept regardless, for two reasons that are not about the pixels: the old
     line's "the subject reading tall against the space above" was a SECOND claim about the frame
     from the axis whose whole purpose is to remove second claims, and "SLIGHTLY below eye level"
     is a magnitude a few degrees wide that no frame can be checked against.

     THE SLUG THAT COULD NOT BE RENAMED, AND THE ONE THAT COULD NOT BE DROPPED.
     `low-angle-hero` is asserted as a real, prompt-present slug by FIVE uds-moderator-ctx test
     files (`src/plan/__tests__/prompt.axes.test.ts`, `prompt.treatment.test.ts`,
     `planner.treatment.test.ts`, `src/orchestrate/__tests__/payloads.imageType.test.ts`,
     `payloads.treatment.test.ts`) and by image-svc's `src/__tests__/validate.axes.test.ts`,
     `src/craft/__tests__/profileSeparation.test.ts` and `src/db/__tests__/recorder.test.ts`.
     `profile-side-on` is asserted by three of those ctx files and by four image-svc files,
     including `src/craft/__tests__/treatment.axes.test.ts`, which resolves it through the REAL
     portrait catalog and so requires it to still be in this body. Neither repo is this task's to
     edit, so both slugs stay and are declared unreferenced rather than quietly re-pointed at a
     frame they do not describe.

     ONE REFERENCE IS EXCLUDED, for a reason that is in the rules rather than in taste.
     `portrait-05` is a waist-up eye-level three-quarter — which portrait-01 and portrait-02
     already are — and its ONLY framing fact distinct from those two is the subject leaning with a
     forearm along a near counter that runs out of frame. `shared-image-type-portrait.md` records
     that surface-contact framing as a measured defect: it "triggers a low-angle workbench
     composition where the camera looks at the hands from the side, sending the face out of
     frame". Authoring it would push the model at the composition the portrait type rule exists to
     prevent, so it is excluded deliberately and not for lack of material. It is also the frame a
     concurrent task owns for character behaviour, which this file states nothing about.

     WHAT IS EXCLUDED FROM THE TEXT, and what was actually in the references.
     PEOPLE. No preset describes a person — no age, dress, expression, intent or activity. The
     irony of this axis is that a PORTRAIT preset still must not describe the subject: only how the
     camera frames them. Body landmarks (a head, a shoulder, a jawline, an eyeline direction
     relative to the lens) are the framing landmarks that DEFINE a shot size and a turn, and they
     stay; everything else about the person belongs to `shared-character-*`, the persona and the
     brief.
     PROPS. `shared-scenario-props.md` owns objects within reach, keyed on place x who. A camera
     preset naming one puts that object into EVERY brief that draws the preset regardless of who is
     in it. The references are full of them and NONE is named below: portrait-01 a floor lamp, a
     pinboard, a monitor and a desk; portrait-03 a held tablet and shelved ceramics; portrait-04 a
     transit bus and a box truck; portrait-05 a potted plant and a phone on the counter; avatar-07
     nothing but a backdrop.
     TEXT-BEARING AND BRAND-BEARING SURFACES. portrait-02's near plane carries handwriting;
     portrait-04 has a cap wordmark, chest lettering and truck lettering; portrait-05 has a lit
     wall sign; portrait-01 has pinned printed sheets. None is named, and the near plane in
     portrait-02 is described only as a broad pale plane closing half the frame — the OCCLUSION is
     the framing fact and the writing on it is not. This follows the home-office result where a
     framed picture named by its typographic GENRE produced legible invented lettering in 6 of 8
     draws and gate-passed: the fix was dropping the noun, because naming the thing is how the word
     reaches the prompt. No preset below carries a prohibition either, for that same reason.
     SEASONAL CONTENT. None of the six carries any.

     ASPECT IS NOT A CAMERA FACT. `portrait-03` is a 958x1465 tall frame and `portrait-01` is
     2240x1465 wide; neither aspect is stated below. `brief.dimensions` is the CALLER's — the
     testimonial production brief this axis now serves most is 512x512 — and a preset authored
     "tall crop" from a tall reference was measured UNSATISFIABLE on a 1280x720 brief, honoured
     1/5 until the clause was removed and 4/5 after. Only the angle, the height, the lens, the crop
     WITHIN the frame, and the depth transfer.

     LENGTH. Only one line is injected per run, so the catalog costs the prompt nothing for its
     size — but the LENGTH of the drawn line is a real cost against a `minimal` budget already over
     target. Measured: the previous ten ran 96-128 chars, mean 111.3; these ten run 102-183, mean
     150.4. The increase buys the frame-occupancy geometry that is the whole mechanism above.

     GUARD: `scripts/check-camera-axis.mjs` in this repo. It derives the catalog list, the
     selector and the forbidden lighting vocabulary from image-svc, checks the rosters and the
     shot-size declaration in this header against the presets in the body, and matches everything
     against the DELIVERED body with comments stripped. Nothing in this comment is an instruction
     to any model: it is never inlined, and `minimal` strips comments at the loader.

     SHOT-SIZE BAND, per preset. Machine-readable, and checked back against each preset's own
     injected text so a mis-declaration cannot pass as coverage.
       close-up: close-up-face-fills-frame
       head-and-shoulders: profile-side-on
       chest-up: over-shoulder-turned, tight-chest-up-longlens
       waist-up: waist-up-eye-level-frontal, waist-up-eye-level-three-quarter,
         waist-up-offgaze-open-side, low-angle-hero
       knee-up: knee-up-standing-wide
       full-body: full-body-environmental

     References: portrait-01, portrait-02, portrait-03, portrait-04, portrait-06
     Excluded: portrait-05
     Cross-set references: avatar-07
     Retained without a reference: low-angle-hero, profile-side-on, full-body-environmental,
       knee-up-standing-wide -->

# Camera presets — portrait

## waist-up-eye-level-frontal
waist-up at eye level, squared frontally to the lens, normal lens, readable background at medium depth

## waist-up-eye-level-three-quarter
waist-up at eye level turned three-quarter to the lens and set off-centre to one side, normal lens, the room running back beside them at medium depth

## waist-up-offgaze-open-side
waist-up at eye level turned three-quarter with the eyeline carried off past the lens, normal lens, a broad pale plane closing the opposite half of the frame

## over-shoulder-turned
chest-up at eye level, the body turned away and the head brought back over the shoulder to the lens with the whole face in frame, long lens, everything beyond dissolved to bokeh discs

## tight-chest-up-longlens
tight chest-up at eye level, a three-quarter turn, long lens with visible compression, the background compressed flat and thrown wholly out of focus

## close-up-face-fills-frame
close-up with the head filling the frame top to bottom, the crown cropped by the top edge and the whole face inside it, one shoulder corner below, long lens

## low-angle-hero
waist-up with the lens well below the subject's eye line and tilted up, the underside of the jaw visible and the wall running up behind the head, normal lens

## profile-side-on
strict side-on at eye level, head-and-shoulders, the face in full profile set against the far side of the frame, normal lens, the eyeline carried out of frame along it

## knee-up-standing-wide
standing knee-up and turned three-quarter, wide-normal lens, a near mass entering one frame edge and falling hard out of focus

## full-body-environmental
the whole figure head to foot inside the frame at eye level, wide lens, occupying about a third of the frame width with the space legible around it, deep focus
