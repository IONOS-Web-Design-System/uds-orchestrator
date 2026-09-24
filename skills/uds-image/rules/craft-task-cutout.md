<!-- THE CUTOUT COMPOSITION RULES — emitted when the brief's assetType is 'cutout'.

     Every clause here exists because the subject is programmatically MATTED after generation:
     a mid-tone backdrop so the alpha edge is findable, head and both sides in frame so nothing
     is clipped, and no foreground occluder because an occluder fragments the cutout into
     disconnected pieces once the background is removed.

     {{shotClause}} and {{shotAuthority}} are filled from craft-shot-*.md when the brief pins a
     shot, and are EMPTY otherwise — they splice mid-sentence, so the joining space is supplied
     by the call site rather than living at the end of a markdown file where no editor would
     preserve it.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS
     ARE SEMANTIC — what reads as a paragraph below is ONE long line, as the TypeScript template
     literal this replaced produced, and re-wrapping it at 80 chars changes the prompt bytes.
     This comment is stripped before delivery on every profile, so it is author-only and must
     never carry instruction. -->

- This is a CUTOUT request (the subject is programmatically extracted from its background AFTER generation). Compose a SINGLE clear subject on a simple, uncluttered, evenly-lit background in a NEUTRAL MID-TONE that clearly differs from the subject's own colors. NEVER use a pure-white or pure-black background. Keep the HEAD/face and BOTH SIDES of the body within frame (never clip the head/top or the sides); the lower body/legs MAY be cropped at the BOTTOM (out of frame at the bottom is fine). {{shotClause}}{{shotAuthority}}The subject must be a SINGLE, fully-visible, UNOCCLUDED figure: NO foreground objects (desks, tables, counters, furniture, props) in front of the body and nothing in front that covers the torso or legs (an object held in the hands is fine) — anything occluding the subject fragments the cutout into disconnected pieces when the background is removed. Describe ONLY the subject and this backdrop: do NOT request a "transparent", "removed", "cut-out", or "isolated-on-transparent" background in the prompt itself (transparency is applied later in the pipeline). background MUST be "cutout".
