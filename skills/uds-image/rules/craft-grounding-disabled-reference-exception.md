<!-- The reference-image exception clause for craft-grounding-disabled.md, and nothing else.

     Its own file rather than a second paragraph in that one because its CONDITION is different:
     the override block is emitted on every fallback re-craft, this clause only when the run also
     carries a `condition` reference image. The pipeline passes the reference through the fallback,
     so the two really do co-occur — and without this clause the override would hand the camera
     and lighting back to the skills two blocks after `# Reference image` took them away, and would
     claim "nothing else will supply the photographic treatment" while a photograph was attached.

     It CONTINUES the sentence above it, so it opens mid-sentence and carries no heading. The
     joining space is supplied by the call site (trailing whitespace does not survive in a
     markdown file). -->

— EXCEPT the camera/shot and lighting, which the supplied reference image owns (see `# Reference image` above). The room, if an `Environment:` line is stated, is still yours.
