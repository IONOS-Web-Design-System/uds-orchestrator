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

     >>> 2026-09-17, RE-AUDIT OF THE 36-FRAME SET: THE ANTECEDENT DID NOT REACH A DESK <<<
     Measured on the 36 delivered image prompts of image-output-fullaudit (craftProfile=minimal,
     gemini-3.1-flash-lite): 16 of 36 carry a positive screen-content assertion, and all 16 are in
     the DESK form -- "the laptop screen displays a clean email application interface", "her laptop
     screen, which displays ...", "a premium laptop is open, displaying a business homepage". Not
     one is the held form paragraph 2's antecedent named, so the sentence could not bind to any of
     them. The 20 prompts with no assertion produced no defect in frame; every defective frame came
     from the 11 assertions drawn under a camera the operator's screen cannot face. Widening the
     antecedent to a display RESTING ON A DESK moves it: unresolved assertions 13/57 -> 5/58 on a
     paired A/B whose 23 paired cells drew identical (camera, lighting, environment) triples,
     Fisher p=0.043.

     >>> AND A CORRECTION TO THE ACCOUNT THIS FIX WAS FIRST WRITTEN WITH <<<
     The prompt-level headline "impossible screen claims 48 % -> 0" was NOT measured on this set,
     and the reason it read 0 is not a property of the detector's phrasings. Re-running
     image-output-plausibility/scripts/plausibility-ab.ts's own PATTERNS and score() over these
     very 36 prompts gives demandsContent 12/36 and unresolvedDemand 10/36 -- and it flags two of
     the three back-surface frames (fa-scenario-homepl v1, fa-scenario-strato v2) that the pixel
     audit called clean. The 0 came from a different population (the 15-rep b2-homepl probe) and
     was carried into this set's narrative without being re-run here. Its one true blind spot is
     narrower than it looks: the noun list is `interface|ui|dashboard|folder|directory|document|
     app|grid`, so "business homepage with minimalist geometric layouts" -- fa-complex-homepl v3,
     the frame with a whole web page printed on an outer lid -- is the ONE hit it cannot see.
     Its deviceTwisted counter reads 0/36 while the pixels show four twists, because the model
     performs the twist without ever writing it; a twist is only measurable in frame.

     >>> WHY THE TWIST PROHIBITION MOVED UP HERE, OUT OF THE CONDITIONAL CLAUSE <<<
     "move the camera, never the device" was the reframe clause's last sentence, and the clause is
     suppressed whenever the shot is already fixed -- which on `minimal` is every run that draws a
     camera preset, i.e. nearly all of them. The prohibition therefore never reached the runs that
     needed it, and in the pixels the model satisfied the surviving content demand by ROTATING THE
     DEVICE toward the lens: 6 of 36 frames put the display's face at the camera with its operator
     behind it (fa-scenario-ionos v1/v2/v3, fa-scenario-strato v3, and marginally
     fa-complex-strato-b v1/v2). The OFFER to reframe stays conditional, for the reason recorded in
     the clause's own file; the PROHIBITION is unconditional, because it contradicts nothing below
     it -- it forbids moving an object, and no axis asks for an object to be moved.

     >>> AND WHY THE OTHER SIDE IS NOW DIRECTED POSITIVELY <<<
     On `minimal` this block worked only by making the craft model STOP asserting visible content.
     That removes the contradiction without telling the renderer what the unseen face looks like,
     and the vacuum is what got filled: a full webpage printed edge-to-edge on an outer lid with no
     bezel (fa-complex-homepl v3), a gold fruit logo on a lid (fa-scenario-homepl v1), a lid drawn
     twice over its own display (fa-scenario-strato v2). All three occurred with the four negative
     forms -- graphics or UI on a device's far face, content on a tablet's, screen graphics and a
     colourful pattern on a lid -- present in the brand baseline's negativePrompt on 36 of 36 runs.
     A negative prompt is therefore DISPROVEN as sufficient at n=36 and nothing was added there.
     The last clause of paragraph 2 states the correct appearance instead, as a property and not as
     an example of what to avoid, so property D still holds.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS ARE
     SEMANTIC, and this comment is stripped before delivery on every profile — author-only, never
     instruction. -->

# Physical plausibility — the situation outranks the content

Where the Brief asks for something the situation cannot turn toward the camera, the situation stays and that content goes. Do not move it onto a surface the camera can see, and do not turn the object toward the lens: move the camera, never the device.

A display faces whoever is working it, held or resting on a desk alike, so do not write that its interface is visible, displayed or legible.{{reframeClause}} Otherwise it sits blank, dim or washed by glare, you say nothing about what is on it, and its other side is unmarked casing in one flat colour.

Everything else in the frame takes the same test: name an object only from a viewpoint that can actually see it, and keep every shadow and highlight going the way the window or fixture you named would throw it.
