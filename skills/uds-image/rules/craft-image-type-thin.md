<!-- THE PINNED-IMAGE-TYPE BLOCK, THIN-PROFILE FORM — emitted on `minimal` ONLY, and only when
     the moderator pinned an imageType on the brief. `none` gets nothing, by design: it is the
     floor, and its prompt stays byte-identical across all four types so that any difference
     measured between them is attributable to something this pipeline did.

     WHY A SECOND FILE AND NOT THE SAME ONE. `craft-image-type.md`'s operative sentence is a
     POINTER — "apply the `shared-image-type-<type>` rule from the skill above". On `full` that
     rule really is inlined above it (resolveRuleSet selects exactly one type rule). On `minimal`
     the type rules are NOT inlined unless the type has been opted in, so the same sentence would
     name a rule that is not in the prompt: a dangling pointer, which is worse than silence
     because the model cannot tell an absent rule from one it failed to find.

     WHAT IS DELIBERATELY NOT HERE:
       - No framing prose. Not "the subject faces the camera", not a shot size, not an angle.
         `minimal` is the presets-only arm, and a second source of framing competes with the
         injected camera preset — the conflict directive 2 exists to remove. The deleted clause
         in `craft-image-type.md` is the cautionary case: one literal sentence naming 'portrait',
         emitted for every pinned type.
       - No claim about any other block. It does NOT say "the camera direction above was chosen
         for this type", because on a `condition`-reference brief the camera and lighting lines
         are SUPPRESSED and the sentence would describe something that did not happen.
       - No pointer at a rule file, per the paragraph above.

     The HEADING IS THE SAME as `craft-image-type.md`'s on purpose. This block has one canonical
     name; `shared-image-principles.md` refers to it by that name ("When a `# Image type (fixed)`
     block is present…"). Two spellings for one block is a third rendering to keep aligned, which
     is the failure mode the corpus already carries warnings about. The two forms are told apart
     by the POINTER, which only `full` carries — that is the needle tests and harnesses assert on.

     {{imageType}} is the pinned type, twice — once in the heading and once in the sentence.

     DELIVERED VERBATIM by loadCraftContext: the LINE BREAKS ARE SEMANTIC, and this comment is
     stripped before delivery on every profile — author-only, never instruction. -->

# Image type (fixed): {{imageType}}

Do NOT re-detect the image type from the brief. The asset is a `{{imageType}}`.
