<!-- THE VARIANT-SET APPEARANCE CLAUSE — emitted when this request asks for MORE THAN ONE variant
     and nothing has already fixed who the person is.

     WHY IT EXISTS AS CODE-GATED PROSE. Three rule files (shared-character-appearance.md,
     strato-image-style.md, ionos-image-photoreal.md) already stated this as a CONDITIONAL the
     craft model was asked to evaluate for itself — "when `variants > 1` and the brief is
     generic, omit specific hair tokens". It could not evaluate it: `brief.variants` was never
     rendered into the craft prompt at all, and nothing in image-svc read the field. The rule was
     delivered for weeks and honoured never — 9 of 36 audited prompts named a specific hair token.
     So the CONDITION moved into code (`craftProfile`-independent, in prompt.ts, gated on
     `brief.variants > 1` plus the two structural appearance-fixing tests) and what stays here is
     only the INSTRUCTION, stated unconditionally. There is no "when" left for the model to get
     wrong.

     IT MUST NOT RESTATE THE CONDITION. Re-adding "when variants > 1" here would put the test back
     in front of a reader that cannot see the field, which is the exact defect this replaces. The
     block is emitted only when the condition already holds, and the guard that enforces the rest
     is image-svc's `src/craft/__tests__/prompt.variants.test.ts` -> "states no variant-count
     CONDITION of its own" (it scans the DELIVERED body, comments already stripped, which is the
     only text that can mislead the model). Named here so an editor of this file can find the
     thing that will go red.

     WHAT IT DOES NOT SAY. It says nothing about ethnicity, age, build or gender — the brand
     character-ethnicity rules own identity and this clause has no business narrowing it. It does
     not forbid clothing either: a clothing VIBE is what the brand rules ask for and is what keeps
     the variant set on-brand. Only the two tokens that lock a face — hair and accessories — are
     withheld.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS ARE
     SEMANTIC, and this comment is stripped before delivery on every profile — author-only,
     never instruction. -->

# One person per variant, not one person repeated

Several independent photographs are being taken of this same situation, and each is generated on its own. Describe the person WITHOUT a specific hairstyle token and WITHOUT a named accessory: no hair length, texture, colour or styling, and no glasses, headphones, watch or jewellery. Give the clothing as a vibe only, in the brand's own vocabulary. Every token you pin here is pinned identically in every photograph, so a named hairstyle returns the same individual each time instead of a plausible cast.
