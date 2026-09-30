<!-- THE DEVICE CLOSE-UP CONSTRUCT — emitted by image-svc on `craftProfile: 'minimal'` when the
     brief is `imageType: 'device-focused'` AND `sceneContext.shotSize: 'close-up'`, and on nothing
     else. Pushed LAST, below `# Photographic treatment`, because it has to outrank voices that sit
     above it.

     WHAT IT IS FOR. The Figma set `device-focused-01` … `-12` (canvas `asset/reference`) is the
     target, and its pixels share three properties the pipeline never delivered:
       1. the DISPLAY dominates the frame and the device runs past the frame edges (01, 03, 05, 06,
          09) — nobody pulled back to show the whole laptop with margin;
       2. the surroundings are a soft out-of-focus wash that carries the LIGHT (window light, warm
          wood tones) and no identifiable room;
       3. the person is present only as what operates the device — hands on keys, a hand on a
          phone, forearms, a sleeve, at most the soft back of a head (01, 02, 03, 04, 05, 06, 08,
          09, 12). Only 07 and 11 show a face, and neither is a close-up.

     WHY A CONSTRUCT AND NOT A BETTER CAMERA LINE. Measured 2026-09-30 on six replayed production
     device briefs, `minimal`, camera pinned to a close preset, feature rewritten to name the
     device in use: hands-only 6/6, but the display still filled only ~35-45% of the frame and a
     named room came back every time. The camera line was not being ignored; it was outvoted by
     FIVE other instructions in the same prompt, each of which authors a room or a person:
       - the brand rule's environment paragraph ("backgrounds softly blurred but identifiable,
         never an empty studio backdrop");
       - `craft-abstract-situation.md` ("the frame still has to happen somewhere, so you are
         choosing a setting");
       - `# Scene`'s `cast: none` row ("the place itself is the subject");
       - `craft-plausibility.md` ("do not write that its interface is visible … otherwise it sits
         blank"), which is right for a viewpoint the display does not face and wrong for every
         close-up preset, all of which stand on the display's side;
       - the persona / character-identity block, which describes a whole person (skin, hair,
         clothing) whenever `cast` is `background`.
     image-svc WITHHOLDS the environment line, the abstract setting block and the persona block
     when this construct fires. The brand paragraph and the plausibility rule stay (they are shared
     with every other brief), so the body below DECLARES that it outranks them — the gate work
     measured that an escape which does not say it outranks the rule it escapes is not taken
     (3/3 failures without the clause).

     NO RATIONALE IN THE BODY, and the failure is not described: an earlier plausibility wording
     that explained itself was transcribed into the image prompt verbatim.

     {{personClause}} is filled in code from the effective cast: nobody, or the operating hands.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS ARE
     SEMANTIC, and this comment is stripped before delivery on every profile — author-only, never
     instruction. -->

# Close on the device — this outranks every setting, background and character instruction above

The device's display is the photograph. Crop in until the display's edges nearly meet the frame, so the device's own edges are cut off by the frame; do not pull back to show the whole device, the desk or the room.

The surroundings are only light: a soft, out-of-focus wash of colour and daylight around the device. Name no room, furniture, shelving, plant, wall art or other person, and give the background no feature a viewer could identify.

{{personClause}}

The camera stands on the side the display faces, so the display faces the lens: show on it the interface the Brief describes, as a clear layout of its regions. If any of the device's back is in frame, it is plain casing in one flat colour.
