<!-- THE PHYSICAL-PLAUSIBILITY ARBITER — emitted UNCONDITIONALLY, on every profile, immediately
     below `# Brief` and `# Scene`.

     WHY IT EXISTS. A user review of 72 generated images (2026-09-16) found a tablet whose user
     interface was rendered on the face turned away from its holder. Traced to the planner's own
     `feature`: "holding a tablet, viewing a clean document folder directory interface". Held and
     looked at means the screen faces the holder; "show the interface" and "they are holding and
     viewing it" cannot both be true from the camera's position. Measured on that run, both
     profiles, from the trace: neither assembled prompt stated a screen orientation at all, so the
     image model had to guess, and it guessed wrong.

     Three verified contributing causes, none profile-specific:
      1. the ONLY relevant guidance was a negativePrompt entry in the brand baselines — a comma
         list the craft model transcribes into `negativePrompt`. There was no positive
         compositional rule about orientation anywhere in the corpus.
      2. `minimal` inlines two rule files (brand tone + shared-natural-moment). The positive
         guidance that did exist lived in `shared-image-type-device-focused.md` and
         `shared-image-type-scene.md`, neither on `minimal`'s allowlist.
      3. the planner classified this tablet-in-hand brief as `scene`, not `device-focused`, so
         even `full` got the scene rule rather than the device rule.
     The ownership table (spec §2) has rows for camera, lighting, environment, props, brand and
     subject and NO row for plausibility — no arbiter for a content/scenario conflict. This is it.

     WHY A craft-* FRAGMENT AND NOT A TOPIC RULE. Topic rules are inlined WHOLESALE AT THE TOP of
     the prompt, above both `# Brief` and `# Scene` — a rule that arbitrates between the Feature
     and the Engagement has to sit where it can SEE them. It also has to reach `minimal`, which
     inlines no topic rule mentioning a screen, without widening that profile's allowlist (an
     experiment log, grown one measured step at a time).

     POSITION IS AUTHORITY, and this block is deliberately OUTRANKED BY TWO THINGS BELOW IT:
     `# Photographic treatment` (the camera preset keeps fixing the shot — directive 2) and
     `# Reference image (screen content)`, which says outright that a supplied UI "OVERRIDES any
     other guidance about keeping the screen blank, generic, minimal". When a UI is supplied the
     pipeline has already decided the screen is shown. "blank" below is chosen to be ON that
     override list, so the two blocks agree by vocabulary as well as by position.

     {{reframeClause}} IS THE MEASURED PART, and it is why the reframe remedy is CONDITIONAL.
     Offered unconditionally (15 reps, gemini-3.1-flash-lite, craftProfile=minimal) it produced
     two outputs carrying TWO CONTRADICTORY CAMERA STATEMENTS — "Wide side-on full-scene view
     using a wide lens" and "the camera is positioned over-the-shoulder" in one prompt — because
     on `minimal` the shot is already fixed by the injected preset. A remedy that contradicts the
     axis below it is a new conflict, not a fix. So the clause is emitted only when NOTHING has
     fixed the shot yet: see craft-plausibility-reframe.md.

     NO RATIONALE IN THE BODY. An earlier wording explained itself ("a screen turned away from its
     holder is no longer being looked at") and the craft model transcribed the reasoning into the
     image prompt: "viewing a blank screen TO AVOID SCREEN-FACING DISPLAY ISSUES". Reasons belong
     in this comment; the body carries instructions only.

     THE FAILURE IS NOT DESCRIBED. An example of what not to draw hands the model the words, which
     is measured here rather than theoretical — gating a brand term at all four of its sites
     scored worse (9.3 %) than gating it at one (6.0 %), because each extra mention named it
     again. The surface the UI must never move onto is named nowhere in the delivered body.

     KEEP IT SHORT. Every added sentence competes; longer prose measurably costs adherence here.
     Three paragraphs is the budget — the two-people-one-viewpoint and held-object-also-resting
     cases were considered and left out rather than spent.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS ARE
     SEMANTIC, and this comment is stripped before delivery on every profile — author-only, never
     instruction. -->

# Physical plausibility — the situation outranks the content

Where the Brief asks for something the situation cannot turn toward the camera, the situation stays and that content goes. Do not move it onto a surface the camera can see.

Someone holding a tablet and looking at it has the screen turned to themselves, so do not write that its interface is visible, displayed or legible.{{reframeClause}} Otherwise the screen sits blank, dim or washed by glare, and you say nothing about what is on it.

Everything else in the frame takes the same test: name an object only from a viewpoint that can actually see it, and keep every shadow and highlight going the way the window or fixture you named would throw it.
