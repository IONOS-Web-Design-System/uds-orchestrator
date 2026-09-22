<!-- THE PINNED-IMAGE-TYPE BLOCK — emitted on `full` ONLY, and only when the moderator pinned
     an imageType on the brief.

     `full` only because its operative sentence is a POINTER at an inlined rule ("apply the
     `shared-image-type-<type>` rule from the skill above"), and the thin profiles inline no
     topic rules at all — the pointer would dangle. The sentence after it is real framing prose,
     which is exactly what `none` exists to withhold and what would give `minimal` a second
     source of framing competing with its camera preset.

     Nothing is lost operationally in the thin profiles: the type still does its real work in
     CODE there, keying the camera preset class (treatment.ts) and gating the persona.

     {{imageType}} is the pinned type, twice — once in the heading and once in the rule name the
     pointer resolves to.

     THE DIRECTION CLAUSE IS GONE, and its removal is the fix. It was a literal sentence naming
     'portrait' — "the subject faces the camera, is character-focused, stands with a confident
     posture, and the full face is in frame" — emitted for EVERY pinned type. Harmless in
     production only by accident: the moderator pins a type on one route and always pins
     'portrait', so of 1502 recorded craft prompts the 207 carrying that clause were all portrait
     ones. A 'scene' brief would have been told its subject faces the camera and stands
     confidently, the exact inverse of what scene requires, and a 'device-focused' brief would
     have been told to put a full face in frame.

     It is DELETED rather than made per-type because on this line the pointer above does not
     dangle: `shared-image-type-<type>.md` is genuinely inlined on `full`, so the type's own rule
     is already above this block and a sentence here would be a second voice on an axis the corpus
     owns. image-svc's criterion 8 (contextLocation.test.ts) measures exactly that and rejected the
     per-type version at 1589 code-authored chars against a 1330 budget. On the main line, where
     those rule files are NOT admitted by the prefix loader, image-svc keeps a per-type sentence in
     code for that reason — the asymmetry is the reachability difference, not an oversight.

     DELIVERED VERBATIM by loadCraftContext: the LINE BREAKS ARE SEMANTIC, and this comment is
     stripped before delivery on every profile — author-only, never instruction. -->

# Image type (fixed): {{imageType}}

Do NOT re-detect the image type from the brief — apply the `shared-image-type-{{imageType}}` rule from the skill above.
