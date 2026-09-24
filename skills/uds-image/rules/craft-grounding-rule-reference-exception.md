<!-- The reference-image exception clause for craft-grounding-rule.md, and nothing else.

     Its own file because its CONDITION is different: the grounding rule closes every prompt,
     this clause only the ones carrying a `condition` reference image. Without it the grounding
     rule's last sentence hands the camera and the light back to the skills after
     `# Reference image` has just taken them away — a conflict by recency, the same one
     directive 2 removed from the reference block itself.

     It CONTINUES the sentence above, so it opens with a comma, carries no heading, and supplies
     its own terminating full stop. -->

, EXCEPT the camera angle, shot, framing and lighting: a reference image is supplied and owns those axes (see `# Reference image` above), so leave them to it.
