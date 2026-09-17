<!-- Camera presets for imageType `device-focused`. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts, resolveCamera) and injected as
     `Photographic camera: <text>`. Never inlined as a menu.
     Camera axis only — no light, grade or mood language. Lighting: shared-lighting.md.
     Every entry keeps the DEVICE as the hero; a person is at most partial context.

     This file is read in code and NEVER inlined (image-svc `skills.coverage.test.ts` lists it in
     INTENTIONALLY_UNSELECTED against `src/craft/treatment.ts`), so this header costs the prompt
     nothing at all and only the ONE selected line below is ever sent. The planner sees the SLUGS
     and never the prose (uds-moderator `src/plan/prompt.ts`, `extractPresetSlugs`), which is why a
     slug that contradicts its own text is a real conflict and not a cosmetic one.

     AUTHORED FROM THE FIGMA REFERENCES, 2026-09-16. File `StkUOHcGRMDXOZWT0E2nft`, canvas
     `asset/reference` (page `479:15015`), components `device-focused-01` … `device-focused-12`.
     Every PNG was exported and looked at; nothing below is taken from a component name, a layer
     tree, or a component description.

     Reference name -> node id. NODE IDS ARE NOT IN NAME ORDER — cite references by NAME:
       01 479:3857   02 479:3859   03 479:3867   04 479:3861   05 479:3858   06 479:3860
       07 479:3862   08 479:3864   09 479:3863   10 479:3866   11 479:3868   12 479:3865
     The presets below are in REFERENCE NAME order (01..12), not node order, because node order is
     scrambled relative to the names and carries no meaning.

     >>> WHAT THE PREVIOUS ELEVEN PRESETS ACTUALLY WERE <<<
     Not "written generically from no reference", which is how they were described to this task.
     Each of the eleven was a near-verbatim lift of the CAMERA CLAUSE from the matching Figma
     component's `[styleref]` description string, and the eleven were exactly the eleven components
     that CARRY a description. `device-focused-10` has none, which is the whole reason it was
     absent. So the axis was authored from reference METADATA and never from reference PIXELS, and
     three of the eleven disagreed with their own image (see the slug notes below). That is the
     failure this rewrite fixes, and it is a different failure from the one in the brief.

     ONE REFERENCE IS EXCLUDED, so the count stays 11 over 12 references — not padded, not tidied.
     `device-focused-10` is not a photograph of a viewpoint. It is a composite marketing graphic: a
     raised handheld device shot against a thrown-out background, with two flat UI panels
     composited over the frame, in a 2500x918 banner crop. Two independent reasons it cannot be a
     camera preset: (a) the panels are graphic overlay, not anything a camera position can produce,
     and the underlying photograph is only half the frame; (b) the underlying geometry is a held
     device turned screen-out to the lens and therefore away from the hand holding it — the exact
     frame `craft-plausibility.md` arbitrates against and the negative-prompt baseline already
     rejects. Authoring it would push the model toward the failure this axis is being hardened
     against, so it is excluded deliberately rather than for lack of material.

     SLUG CHANGES, and why each one is a correctness fix rather than churn.
     Two renamed:
       - `screen-forward-elevated-frontal` -> `high-oblique-over-hands`. Reference 01 is a steep
         raking view from behind and above the hands with the screen plane strongly keystoned. It
         is not frontal and it is not screen-forward. A planner reaching for "show the screen
         head-on" would have drawn this slug and then handed the generator a description of a
         raking oblique.
       - `close-candid-gestural-hands` -> `table-level-gestural-candid`. Reference 11 is a
         long-lens view from table height ACROSS a table; "close" was wrong about both the distance
         and the lens.
     Two swapped between references, which is why slug order is not reference order here:
       - `top-down-in-hands` now carries reference 12 and `high-over-shoulder-desk` carries
         reference 05. Reference 12 is the near-vertical look down from above and behind the head;
         reference 05 is a steep-but-not-vertical look down over a shoulder at a desk. The two
         slugs were attached the other way round and each described the other's image.
         `top-down-in-hands` CANNOT be renamed: it is asserted as a real, prompt-present slug by
         three tests in uds-moderator (`src/plan/__tests__/prompt.axes.test.ts`,
         `prompt.treatment.test.ts`, `src/orchestrate/__tests__/payloads.axesEndToEnd.test.ts`),
         which this task does not own. Swapping it onto the reference it actually describes fixes
         the conflict without touching a repo it cannot edit. Its one remaining inaccuracy: the
         held device in reference 12 is in ONE hand, not both.
     No other slug changed, and none is referenced by any image-svc source or test.

     SCREEN VISIBILITY, per preset. The axis contract is that a frame must not require an operator
     and the lens to see the same display from opposite sides. Ten of the eleven viewpoints sit on
     the SAME side of the display as anyone using it — over a shoulder, above a shoulder, across a
     table toward a screen angled at the near side, side-on to a workstation — so an operator and
     the camera can both see it and the text may safely describe the screen plane.
     `frontal-elevated-device-hero` (reference 09) is the ONE exception and is the frame that
     failed in pixels: shot square to the display, anyone behind the device has it turned away from
     them, and the negative-prompt baseline's "presenting the device to the lens" clause fires.
     Reference 09 gets away with it only because its one figure is an unfocused edge mass. So that
     preset is written as an UNATTENDED device hero — "from the display's own side of the table"
     puts the lens where a user would be, and "the table behind the device empty" closes the far
     side — and it names no person, because naming one is what invites the contradiction.
     Machine-readable, for the axis's other consumers:
       Screen-see-able with an operator present: high-oblique-over-hands, over-shoulder-handheld,
       close-frontal-screen, high-angle-across-table, high-over-shoulder-desk,
       over-shoulder-eye-level, wide-side-on-workstation, elevated-three-quarter-desk,
       table-level-gestural-candid, top-down-in-hands.
       Self-consistent only with NO operator: frontal-elevated-device-hero.
       Each preset also carries a machine-readable `ScreenVisible: yes | unattended-only` line,
       BELOW its text so `parseTreatmentPresets` still takes the text as the injectable line. That
       tag is the form code can read; these two lists are the author-facing form. They are pinned
       to each other by check-camera-axis.mjs, so they cannot drift — a comment is stripped by the
       loader, which is why the declaration needed a form outside one.

     RENDERED TEXT. All twelve references are photographs of real product UI, so every screen in
     the source set is covered in legible lettering, and this axis is the one axis whose subject IS
     a screen. The previous wording made a legibility CLAIM in three places — the display squarely
     readable, the screen legible past the subject, the full desk setup legible — and a legibility
     claim about a screen is an instruction to letter it. The home-office catalog learned the
     general form of this the expensive way: a framed picture described by its typographic GENRE
     produced invented lettering in 6 of 8 draws and gate-passed, and the fix was dropping the
     genre noun, not adding a prohibition, because naming the thing to avoid is how the word
     reaches the prompt. The same move applies here: legibility claims are gone and the screen is
     described only as a PLANE with a position and an angle — keystoned, nearly square to the lens,
     angled up, in the far upper quadrant. Geometry is what the camera axis owns anyway; whether
     anything is readable on the surface is not a camera fact. No preset below contains any
     prohibition either, for the same reason. This is REASONED from the home-office result and then
     CHECKED in generated frames for this catalog specifically; it is not proven in general.

     WHAT IS EXCLUDED FROM THE TEXT, and what was actually in the references.
     PROPS. `shared-scenario-props.md` owns the objects within reach of the subject, keyed on
     place x who. A camera preset naming one puts that object into EVERY brief that draws the
     preset regardless of who is in it — the unkeyed-prop defect, arriving by way of the camera
     axis. The references are full of them and NONE is named below: 01 a tumbler; 04 a cereal bowl,
     a juice glass, a plate of toast, a pen and an open notebook; 05 a ring-bound notebook,
     scissors and a stylus; 08 a mug, two pen pots, a stapler and stacked notebooks; 09 a camera
     with a leather strap, a saucer and a spoon and a held bowl-cup; 11 an open notebook and a
     water bottle; 12 a framed photograph and a pen pot. 02 has a large banana-plant leaf filling
     one third of the frame — described below only as "a hard-blurred near mass", because the
     OCCLUSION is the framing fact and the species is not. Only generic surface language is used
     where the reference's depth ladder is the point: "near tabletop objects", "desk objects
     layered". Devices, body landmarks (a shoulder, a forearm, a head, faces) and the supporting
     surface are the camera axis's own subject and stay.
     LIGHT FIXTURES. Reference 12 has a dominant desk lamp. The environment catalogs name a
     dominant fixture as place content; this axis names none, because a fixture is neither a camera
     fact nor within the camera axis's remit, and that noun is in the lighting vocabulary the guard
     rejects here.
     BRAND MARKS. Every reference screen carries them and none is named: 01 a payments-brand
     wordmark plus a device-maker engraving, 03 a social-network UI and the same engraving, 07 a
     maker-identifiable all-in-one and phone, 09 a hosting-brand dashboard and the engraving, 10 a
     search-engine mark and a social-network card. Not camera content, and the negative-prompt
     baseline forbids them in the output.
     SEASONAL CONTENT. Reference 10 is a winter-sale campaign graphic end to end. Excluded with the
     rest of that reference; nothing seasonal reaches any preset.
     PEOPLE. No preset describes a person — no age, dress, gaze or activity. A shoulder, a forearm,
     a head and cropped faces appear only as the framing landmarks that define an over-the-shoulder
     position, which is the same licence the previous eleven took and the same one the axis contract
     grants ("a person is at most partial context").

     ASPECT IS NOT A CAMERA FACT ON THIS AXIS, and one preset had to be corrected for it after
     the first measurement run. `top-down-in-hands` was authored as "tall crop", from reference 12,
     which is a 1579x2369 portrait frame. `brief.dimensions` is the caller's, and the measurement
     brief asked for 1280x720 — so that clause was UNSATISFIABLE on the run that drew it, and it is
     a second voice about the frame from the axis that is supposed to have removed them. It is now
     "normal lens". A reference's own aspect ratio describes the reference, never the output; only
     the angle, height, lens, crop WITHIN the frame, and depth transfer.

     LENGTH. Only ONE line is injected per run, so the catalog costs the prompt nothing for being
     eleven — but the LENGTH of the line drawn is a real cost against a `minimal` budget already
     over target. Measured: the previous eleven ran 59-129 chars, mean 96.1; these eleven run
     128-149, mean 138.5. The increase buys the height, lens and depth facts the
     description-derived text omitted — several old lines stated an angle and a lens and nothing
     else, which is why the camera axis had nothing to say about where depth or the near plane sat.

     GUARD: `scripts/check-camera-axis.mjs` in this repo. It derives the catalog list and the
     forbidden lighting vocabulary from image-svc, checks the reference roster in this header
     against the presets in the body, and matches everything against the DELIVERED body with
     comments stripped. Nothing in this comment is an instruction to any model: it is never
     inlined, and if that ever changes it must be treated as author-only text and stripped.

     References: device-focused-01, device-focused-02, device-focused-03, device-focused-04,
     device-focused-05, device-focused-06, device-focused-07, device-focused-08,
     device-focused-09, device-focused-11, device-focused-12
     Excluded: device-focused-10 -->

# Camera presets — device-focused

## high-oblique-over-hands
steep oblique from behind and above the hands onto an open laptop, normal lens, the keystoned screen filling the upper frame, depth falling away fast
ScreenVisible: yes

## over-shoulder-handheld
over the shoulder onto a tablet held low in both hands, longer lens, one edge blocked by a hard-blurred near mass, the room deep and soft behind
ScreenVisible: yes

## close-frontal-screen
close over the shoulder at screen height, the screen nearly square to the lens across the upper two-thirds, a forearm below, background soft
ScreenVisible: yes

## high-angle-across-table
high angle across a table onto a propped tablet at three-quarters, normal lens, near tabletop objects large and soft along the lower edge
ScreenVisible: yes

## high-over-shoulder-desk
steep look down from above and behind a shoulder onto a phone held in both hands at a desk, normal lens, forearms leading in diagonally
ScreenVisible: yes

## over-shoulder-eye-level
tight over the shoulder at head height, the handheld screen in the far upper quadrant, the near shoulder a large soft mass across the rest
ScreenVisible: yes

## wide-side-on-workstation
wide side-on at seated chest height and level, normal-wide lens, a monitor at one end and a laptop centre, deep focus front to back
ScreenVisible: yes

## elevated-three-quarter-desk
elevated three-quarter about forty-five degrees down onto a propped tablet, normal lens, desk objects layered from the near corner back to it
ScreenVisible: yes

## frontal-elevated-device-hero
frontal and slightly elevated onto an open laptop from the display's own side of the table, normal lens, the table behind the device empty
ScreenVisible: unattended-only

## table-level-gestural-candid
table-level and level across a table, long lens, the device sharp at one side with gesturing hands sharp in front of it, everything beyond soft
ScreenVisible: yes

## top-down-in-hands
near top-down from directly above and behind the head onto a handheld screen, normal lens, the head a soft mass at the bottom edge
ScreenVisible: yes
