<!-- THE GROUNDING-DISABLED OVERRIDE — emitted only on the pipeline's grounding-fallback
     re-craft (image-svc pipeline.ts catches GroundingNotFiredError and crafts again with
     suppressGrounding), never on a first attempt.

     DELIVERED VERBATIM as one block of the craft prompt, by loadCraftContext in
     image-svc/src/craft/skills.ts. Three consequences:
       - the LINE BREAKS ARE SEMANTIC. The paragraph below is deliberately ONE long line; it is
         what the TypeScript template literal this file replaced produced, and re-wrapping it at
         80 chars changes the prompt bytes. scripts/prompt-corpus.ts proves the relocation
         byte-identical and a re-wrap breaks that proof.
       - {{exception}} is filled by the CALL SITE: a bare full stop normally, and the text of
         craft-grounding-disabled-reference-exception.md when a `condition` reference image is
         supplied. The condition lives in code; only the words live here.
       - this comment is stripped before delivery on every profile, so it is author-only and
         must never carry instruction. -->

# Grounding DISABLED for this attempt (override)

A previous attempt requested search grounding and the image-search tool did not fire, so no external references exist. You MUST set grounding=false and groundingQuery="". Author `prompt` in FULL per the skills above — INCLUDING their camera/shot, lighting and depth-of-field guidance. Do NOT write a scenario-only prompt: nothing else will supply the photographic treatment{{exception}}
