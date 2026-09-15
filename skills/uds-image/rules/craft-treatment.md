<!-- THE PHOTOGRAPHIC-TREATMENT INSTRUCTION — emitted on craftProfile 'minimal' only, and only
     when at least one preset line was resolved.

     This file is the INSTRUCTION. The lines it is about are generated in code from the preset
     catalogs and spliced in at {{lines}} — do not write example lines here, and do not name a
     camera, a light or a room: that is the axes' job and a second voice is the conflict this
     block exists to settle.

     Measured, and the reason there is an instruction at all: with the lines present but nothing
     telling the model what to DO with them, the Environment line's specific materials survived
     into the final image prompt about 5 % of the time — a converted hall with coffered vaults and
     ashlar limestone came out as "a modern, light-filled office". Naming the decision abstractly
     is what fails; "materials", "surfaces" and "keep the specific words" is what worked.

     {{claim}} is derived IN CODE from the lines actually present ("the shot", "the light", "the
     room"), never fixed: a `condition` reference image suppresses two of the three lines, and a
     sentence claiming to fix a shot the block no longer states is the failure mode this repo
     already shipped once as "lighting still narrowed as far as it safely can be".

     {{roomClause}} is craft-treatment-room.md, and only when an Environment line is present —
     with no room stated there is no "one named here" to substitute for.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS
     ARE SEMANTIC, and this comment is stripped before delivery on every profile — author-only,
     never instruction. -->

# Photographic treatment (authoritative)

{{lines}}

These fix {{claim}}. Write them INTO your own sentences — do not reproduce the lines above or their labels, and never emit "Photographic camera:", "Photographic lighting:" or "Environment:" in your output.{{roomClause}}
