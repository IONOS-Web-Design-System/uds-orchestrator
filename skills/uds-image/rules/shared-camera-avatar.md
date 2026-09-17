<!-- Camera presets for imageType `avatar`. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts, resolveCamera) and injected as
     `Photographic camera: <text>`. Never inlined as a menu.
     Camera axis only: shot size, camera height, angle, subject turn, eyeline, lens, depth.
     Lighting lives in shared-lighting.md. Do not add light or grade language here.

     This file is read in code and NEVER inlined (image-svc `skills.coverage.test.ts` lists it in
     INTENTIONALLY_UNSELECTED against `src/craft/treatment.ts`), so this header costs the prompt
     nothing and only the ONE selected line below is ever sent. The planner sees the SLUGS and
     never the prose (uds-moderator `src/plan/prompt.ts`, `extractPresetSlugs`), which is why a
     slug that contradicts its own text is a real conflict and not a cosmetic one.

     RE-AUTHORED FROM THE FIGMA REFERENCES, 2026-09-17. File `StkUOHcGRMDXOZWT0E2nft`, canvas
     `asset/reference` (page `479:15015`), components `avatar-01` … `avatar-07`. Every PNG was
     exported and looked at; nothing below is taken from a component name, a layer tree, or a
     component description.

     Reference name -> node id. NODE IDS ARE NOT IN NAME ORDER — cite references by NAME:
       avatar-01 479:15037   avatar-02 479:15034   avatar-03 479:15035   avatar-04 479:15036
       avatar-05 479:15038   avatar-06 479:15039   avatar-07 479:15040
     01 is 15037 while 02/03/04 are 15034/15035/15036, so the first four are rotated against their
     names — the trap this repo has now hit four times.

     >>> THE PREVIOUS EIGHT PRESETS WERE DESCRIPTION-LIFTS, EXACTLY AS device-focused WAS <<<
     Verified here, not inherited from the brief. Each `avatar-*` component carries a `[styleref]`
     description string, readable via `search_design_system`. SIX of the eight previous presets map
     one-to-one onto a description's camera clause, in reference order, near-verbatim:
       avatar-01 "eye-level three-quarter head-and-shoulders"    -> `head-shoulders-three-quarter`
       avatar-02 "eye-level frontal head-and-shoulders"          -> `head-shoulders-frontal`
       avatar-03 "eye-level slight three-quarter chest-up"       -> `chest-up-slight-three-quarter`
       avatar-05 "eye-level frontal tight head-and-shoulders"    -> `tight-head-shoulders`
       avatar-06 "eye-level three-quarter chest-up with gaze off-camera" -> `chest-up-offgaze`
       avatar-07 "eye-level tight head-and-shoulders turned three-quarter"
                                                       -> `head-shoulders-turned-chin-near`
     `avatar-04` had no preset at all — its clause "eye-level frontal chest-up" collapses into
     avatar-03's, so a description-derived catalog simply loses the reference. The remaining two,
     `slight-low-angle-head-shoulders` and `head-shoulders-shallow-longlens`, correspond to NO
     reference and NO description: all seven descriptions say "eye-level" and all seven frames ARE
     eye-level, and NOT ONE of the seven descriptions names a lens. So the axis was authored from
     reference METADATA, never from reference PIXELS.

     THREE of the six lifts disagree with their own image, which is the same failure rate the
     device-focused set had:
       avatar-01's pixels are CHEST-UP and SQUARED FRONTALLY, not a three-quarter
         head-and-shoulders — the description is wrong on both the crop and the turn;
       avatar-06's pixels are HEAD-AND-SHOULDERS, not chest-up;
       avatar-07's pixels are a FACE-FILLING CLOSE-UP, not "tight head-and-shoulders".

     >>> avatar-07 IS THE MISSING CLOSE-UP, AND ITS DESCRIPTION IS WHY IT WENT MISSING <<<
     In the frame the head spans the whole height, the crown is cut by the top edge, and one
     shoulder corner is all that is left of the body. The description calls that "tight
     head-and-shoulders", so the catalog got a head-and-shoulders preset and the close-up range
     vanished between the pixels and the string. `shared-image-type-avatar.md` has asked for a
     close-up distance all along — its shot-distance table names "Close-up | Face, neck, hint of
     shoulder" — but that rule is inlined only on `full`, so on `minimal` the camera line is the
     only voice that could deliver it and it had nothing to say.

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
     face is inside a crop that takes the crown — this type's one hard constraint is a face
     100 % in frame, forehead to chin, so a crop that takes the CROWN has to say in the same
     breath that the FACE is inside, and cropping hair is not cropping the face. The remedy for
     the contradicted case is an ARBITER between the content demand and the framing axis, which
     is `craft-plausibility.md`'s subject and not this file's.
     MEASURED ON `portrait`, NOT ON `avatar`: the A/B/C corpus above is 40 portrait images. The
     avatar line differs from portrait's only in carrying the three-quarter turn, and no avatar
     brief was fired, so the transfer is REASONED and not proven.

     ONE SLUG COULD NOT BE RENAMED, so it was re-pointed at the reference it actually describes.
     `head-shoulders-three-quarter` is asserted as a real, prompt-present slug by uds-moderator-ctx
     `src/plan/__tests__/prompt.treatment.test.ts`, which this task does not own. It was lifted
     from avatar-01, whose frame is a squared frontal chest-up, so the slug described avatar-06's
     image and not its own. It now carries `avatar-06` — an eye-level head-and-shoulders turned
     three-quarter — which is the frame the slug has always named. Same remedy the device-focused
     rewrite applied to `top-down-in-hands`: fix the attachment, not the name, when the name is
     load-bearing in a repo this task cannot edit.
     Two other slugs kept their names because they still match a reference: `head-shoulders-frontal`
     (now avatar-04, the seamless studio frame, which is what "frontal head-and-shoulders against
     no depth" actually is) and `tight-head-shoulders` (avatar-05, unchanged in substance).

     NOTHING IS EXCLUDED. All seven references are photographs of a single viewpoint with a
     visible face; none is a composite, a banner, or a frame whose geometry any rule arbitrates
     against. The count goes 8 -> 7 because two inventions are gone and no reference now lacks a
     preset — not because anything was tidied away.

     WHAT IS EXCLUDED FROM THE TEXT, and what was actually in the references.
     PEOPLE. No preset describes a person — no age, dress, expression, intent or activity. The
     irony of this axis is that an AVATAR preset still must not describe the subject: only how the
     camera frames them. Body landmarks (a head, a crown, a shoulder, an eyeline direction relative
     to the lens) are the framing landmarks that DEFINE a shot size and a turn, and they stay;
     everything else about the person belongs to `shared-character-*`, the persona and the brief.
     The references are strongly characterised — headwear in 02 and 06, eyewear in 01, 04 and 05,
     distinctive hair in 04 and 07, workwear in 01 — and none of it is named.
     PROPS. `shared-scenario-props.md` owns objects within reach, keyed on place x who. A camera
     preset naming one puts that object into EVERY brief that draws the preset regardless of who is
     in it. avatar-01 has shelved ceramics and hanging workwear; avatar-03 has a clipboard and
     folders held against the body. Neither is named; avatar-01's surround is described only as a
     readable surround at medium depth, because the DEPTH is the framing fact and the shelf
     contents are not.
     BRAND AND TEXT-BEARING SURFACES. None of the seven carries legible lettering, which is the
     one hazard this set is clean on. Nothing is named anyway.
     SEASONAL CONTENT. None of the seven carries any.

     ASPECT IS NOT A CAMERA FACT, even here. All seven references are exactly square (800x800,
     avatar-06 874x874) and `shared-image-type-avatar.md` itself says "Always 1:1" — and still no
     preset below states a ratio. `brief.dimensions` is the CALLER's, and a preset authored "tall
     crop" from a tall reference was measured UNSATISFIABLE on a 1280x720 brief, honoured 1/5 until
     the clause was removed and 4/5 after. A square reference set is exactly the case where the
     assumption would feel safe and would still be the caller's to make, not this axis's.

     LENGTH. Only one line is injected per run, so the catalog costs the prompt nothing for its
     size — but the LENGTH of the drawn line is a real cost against a `minimal` budget already over
     target. Measured: the previous eight ran 68-97 chars, mean 86.4; these seven run 138-166, mean
     153.3. The increase buys the depth structure and the frame-occupancy geometry the
     description-derived lines had no words for — SIX of the eight said nothing whatever about
     depth or what sat behind the subject.

     GUARD: `scripts/check-camera-axis.mjs` in this repo. It derives the catalog list, the
     selector and the forbidden lighting vocabulary from image-svc, checks the rosters and the
     shot-size declaration in this header against the presets in the body, and matches everything
     against the DELIVERED body with comments stripped. Nothing in this comment is an instruction
     to any model: it is never inlined, and `minimal` strips comments at the loader.

     SHOT-SIZE BAND, per preset. Machine-readable, and checked back against each preset's own
     injected text so a mis-declaration cannot pass as coverage.
       close-up: close-up-face-fills-frame
       head-and-shoulders: head-shoulders-three-quarter, head-shoulders-frontal,
         head-shoulders-offgaze-flat-behind, tight-head-shoulders
       chest-up: chest-up-context-behind, chest-up-deep-fall-off

     References: avatar-01, avatar-02, avatar-03, avatar-04, avatar-05, avatar-06, avatar-07
     Excluded: (none)
     Cross-set references: (none)
     Retained without a reference: (none) -->

# Camera presets — avatar

## chest-up-context-behind
chest-up at eye level squared frontally to the lens, normal lens, the working surround behind readable at medium depth across the whole frame width

## head-shoulders-offgaze-flat-behind
head-and-shoulders at eye level, shoulders square to the lens, the head turned slightly and the eyeline carried past it, normal lens, a flat plane close behind

## chest-up-deep-fall-off
chest-up at eye level turned slightly off square, the subject centred, longer lens, a long interior running far back behind them and dissolving completely

## head-shoulders-frontal
head-and-shoulders at eye level squared frontally to the lens, normal lens, a featureless seamless surround with no depth behind it at all

## tight-head-shoulders
tight head-and-shoulders at eye level squared to the lens, the head filling the upper two-thirds and the shoulders just entering the bottom corners, longer lens

## head-shoulders-three-quarter
head-and-shoulders at eye level turned three-quarter to the lens, normal lens, a plain plane close behind and open space left on the turned-away side

## close-up-face-fills-frame
close-up turned three-quarter with the head filling the frame top to bottom, the crown cropped by the top edge and the whole face inside it, one shoulder corner below
