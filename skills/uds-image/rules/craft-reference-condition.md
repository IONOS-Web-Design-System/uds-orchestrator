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

     DELIVERED VERBATIM: the LINE BREAKS ARE SEMANTIC — the three paragraph breaks below are
     real, everything inside a paragraph is one long line — and this comment is stripped before
     delivery on every profile. -->

# Reference image

A REFERENCE IMAGE is supplied to the image model as a conditioning input, and it OUTRANKS this prompt's photographic direction. Treat it as the visual ground truth for the subject's IDENTITY and LIKENESS — face, hair, build, colouring, clothing — and for the shot and the light it already carries. Describe and REINFORCE what to preserve from it, and layer the brand palette and tone from the skills above.

Do NOT write a camera angle, shot type, lens, framing, eye level, lighting direction or quality, time of day or colour grade: the reference already fixes every one of them. Ignore any instruction above that tells you to state one — for a supplied reference this overrides it.

The ROOM is the exception, and it is still yours to write: the reference shows nothing beyond its own frame. Where an `Environment:` line is stated above, that room is authoritative over whatever setting the reference happens to show, and its specific materials and features still belong in your prompt.
