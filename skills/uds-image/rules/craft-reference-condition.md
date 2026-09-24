<!-- THE CONDITION REFERENCE BLOCK — emitted when a reference image is supplied and its role is
     'condition' (a supplied photograph or frame), which is also the default for a brief that
     skipped schema parsing.

     REWRITTEN 2026-09-15 under directive 2 and moved here unchanged. It used to claim the
     reference was ground truth for "identity/likeness, pose, and overall composition ... do not
     contradict the reference" — pose and composition are what the CAMERA axis owns, and this
     block won that argument only by being the last voice in the prompt while the camera and
     lighting lines sat live above it. The axes are now suppressed for this role in code, so
     there is nothing left to contradict and the block says what it actually means.

     ITS POSITION IS PART OF ITS AUTHORITY: image-svc places it BELOW the treatment axes. That is
     why it is loaded by name at the point of use rather than selected into the rules section,
     which is inlined at the TOP of the prompt.

     DELIVERED VERBATIM: the LINE BREAKS ARE SEMANTIC — the four paragraph breaks below are
     real, everything inside a paragraph is one long line — and this comment is stripped before
     delivery on every profile.

     ---- 2026-09-16: THE APPEARANCE PROHIBITION (paragraph 3). Author-facing forensics; no
     instruction here, and deliberately no example of a banned phrase — gating a preference at
     all four of its restatements measured WORSE than gating one (9.3 % vs 6.0 %) because each
     restatement named the term again, so an illustration of what not to write would hand the
     model the words.

     THE DEFECT. Supplied a reference of a woman with a short bob in beige knit; the image came
     back a dark low bun in navy. NOT weak conditioning in the image model: `fetchReferenceImage`
     passes the bytes verbatim, and the craft model that writes the prompt NEVER SEES THEM —
     image-svc's `craft.ts` sends `contents: [{ role: 'user', parts: [{ text }] }]`, text only.
     So paragraph 1 used to ask for something unachievable ("Describe and REINFORCE what to
     preserve from it"), and the model filled the slot from the brand rule instead. Measured on
     the stored trace of run `t7-ref-condition` and then over 30 fresh condition runs
     (`minimal`, gemini-3.1-flash-lite): 30/30 outputs stated at least one attribute the
     reference owns, mean 2.8 of 6 dimensions — age 100 %, clothing 90 %, hair 80 %.
     `ionos-image-photoreal.md` supplies every one of them, and its age line is an imperative.

     WHY A PROHIBITION AND NOT THE POSITIVE CLAIM THAT WAS ALREADY THERE. Paragraph 1 has always
     asserted the reference owns identity and likeness. It did not bind: a positive claim about
     what the reference owns does not stop the model writing the attribute itself. The camera and
     lighting sentence above, which is a PROHIBITION in the same register, does bind — zero
     camera or lighting lines on condition runs. Paragraph 3 is that sentence's shape, applied to
     the appearance dimensions, naming them the way the rules and the craft OUTPUT name them
     rather than abstractly ("the subject's appearance" moved nothing comparable in this
     workstream; naming the model's own phrasings moved a sibling metric 46 points).

     THE OVERRIDE CLAUSE IS NOT DECORATION. The brand rule does not merely permit an appearance,
     it ORDERS one ("Encode age explicitly", plus its hair / accessories / clothing bullets), and
     `# Character identity` above tells the model to invent a market-appropriate professional. A
     prohibition with no override clause would be one voice against two imperatives.

     SCREEN-CONTENT IS UNTOUCHED, on purpose: `craft-reference-screen-content.md` is pixels for a
     device screen and makes no claim about the person, so the appearance dimensions are still
     the prompt's to write there.

     WHAT IS STILL OPEN. The negative-prompt baseline in `ionos-image-photoreal.md` names two
     hair styles and three garment classes as vetoes, and 30/30 condition runs reproduced them —
     appearance instructions in the harder channel, aimed at whatever the reference happens to
     show. Not addressed here: a second restatement of this prohibition is exactly the failure
     mode the first paragraph of this note describes, and the structural fix (suppressing the
     brand rule's appearance section, and its negative-prompt appearance entries, when a
     condition reference is present) needs a selection mechanism the rule set does not have —
     rules are chosen as whole files. -->

# Reference image

A REFERENCE IMAGE is supplied to the image model as a conditioning input, and it OUTRANKS this prompt's photographic direction. It is the visual ground truth for the subject's IDENTITY and LIKENESS — face, hair, build, colouring, clothing, accessories — and for the shot and the light it already carries. You are NOT shown it, so you cannot restate what it holds: leave every one of those attributes to it, and layer the brand palette and tone from the skills above.

Do NOT write a camera angle, shot type, lens, framing, eye level, lighting direction or quality, time of day or colour grade: the reference already fixes every one of them. Ignore any instruction above that tells you to state one — for a supplied reference this overrides it.

Do NOT write an age or an age range, a hair length, style or colour, a garment, its colour or a wardrobe register, a build or body type, a skin tone or an ethnicity, or an accessory: the reference already fixes every one of them, and an appearance stated in words overrides the photograph and wins. Ignore any instruction above that tells you to encode age explicitly, or to reason out, derive or choose a hair, clothing or accessory token — for a supplied reference this overrides it. Write who the person IS and what they are DOING instead, and keep it to that.

The ROOM is the exception, and it is still yours to write: the reference shows nothing beyond its own frame. Where an `Environment:` line is stated above, that room is authoritative over whatever setting the reference happens to show, and its specific materials and features still belong in your prompt.
