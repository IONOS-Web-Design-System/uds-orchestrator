<!-- THE TASK BLOCK — emitted on EVERY craft prompt, on every profile.

     {{assetTypeRule}} is filled by the call site with craft-task-cutout.md or
     craft-task-photoreal.md — the two are mutually exclusive and the brief's assetType chooses.
     They are separate files rather than one because a cutout and a complete scene are opposite
     briefs, and because only the cutout one takes the shot-framing clauses.

     The no-rendered-text bullet below is the one instruction here that applies to both.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS
     ARE SEMANTIC — what reads as a paragraph below is ONE long line, as the TypeScript template
     literal this replaced produced, and re-wrapping it at 80 chars changes the prompt bytes.
     This comment is stripped before delivery on every profile, so it is author-only and must
     never carry instruction. -->

# Task

Translate the brief below into a single brand-accurate image-generation prompt for Google's image model. Encode the brand palette and tone from the skills above.
{{assetTypeRule}}- Never request rendered text, logos, or UI chrome — image models garble them. The grounding rule below references a brand's IMAGE / photographic style ONLY; it NEVER means rendering that brand's UI, app screens, or interface — on-screen/interface content is out of scope for the image (the composite / agent-svc owns it), so keep any device screen generic and minimal — EXCEPT in the screen-content case handled separately below, where a supplied interface is placed there crisply.
