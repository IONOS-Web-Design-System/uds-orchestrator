<!-- Environment presets for the `home-office` place. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts, resolveEnvironment) and injected as `Environment: <text>`.
     This file is NEVER inlined as a menu.
     PLACE axis only: architecture, spatial depth, surfaces and materials, window character, and
     what populates the mid-ground. Light source, direction, quality and colour grade belong to
     shared-lighting.md; shot size, height, angle, lens and depth of field belong to the
     shared-camera-*.md files; the character belongs to the persona and the brief. A preset must
     never say whether people are present — that is the brief's decision, not the room's.
     A room's own light FIXTURES are place content, not lighting content: named as a physical
     object wherever one is visually dominant in its reference (an articulated desk lamp, a floor
     lamp), and named in none otherwise — the same rule `shared-environment-workspace.md` applies,
     kept identical across both catalogs. Of these three, only home-office-01 has one.

     LIGHT-OPENING TAG. Each preset also declares, on the line beneath its text, the exterior
     openings its stated architecture HAS — `side-window`, `overhead-glazing` or `none`, the same
     vocabulary shared-lighting.md uses for the opening each lighting preset asserts. image-svc
     (craft/sceneLighting.ts) intersects the two as a second narrowing stage after
     shared-lighting-by-scenario.md. The full tagging rule, and why silence about a window is NOT
     read as denial in a large room but IS in a bounded one, is written out once in
     `shared-environment-workspace.md`'s header — read it there rather than trusting a paraphrase.
     Two of these three rooms are the reason this stage exists: a desk nook whose wall is right
     behind it and a sofa corner backed by a close wall are bounded vignettes that account for
     their own boundaries, so window light was contradicting the room itself.
     An untagged preset means "no constraint" and is reported as a data fault — never "no light
     admitted". The tag is METADATA: only the text line is ever injected into a prompt.

     Authored from the published reference components on the `asset/reference` canvas of Figma
     file StkUOHcGRMDXOZWT0E2nft, one preset per reference in this order:
       home-office-01 = 498:31   home-office-02 = 498:36   home-office-03 = 498:33
     Cite the component NAME, never only the node id: re-publishing a component changes its id
     (these were 486:16..486:18 before a re-publish, and those ids are now invalid nodes), and the
     ids do NOT run in name order — do not infer one from a neighbour's.
     A home office is a DOMESTIC room, not a small corporate one: the three references differ in
     the kind of domestic space (a desk nook with the wall right behind it, working from the sofa,
     and a planted study at a corner window), and keeping them apart is what stops every
     home-office brief resolving to the same room. -->

# Environment presets — home office

## poster-wall-desk-nook
a small domestic desk pushed up against a plain dark grey-green wall with a large framed travel poster hung immediately behind it, a pale timber desktop carrying a slim monitor, an articulated desk lamp, a potted flowering plant and a ceramic mug, the wall so close that the room has almost no depth
Light openings: none

## sofa-corner-lapwork
a domestic living-room corner given over to working from the sofa, a deep olive corduroy sofa heaped with soft cushions and a chunky cream knit throw, a plain white wall close behind, a slim black metal shelf unit and a leafy houseplant just beyond it
Light openings: none

## planted-corner-window-study
a home study set into a corner of full-height black-framed glazing onto dense autumn foliage, dark green-black walls, a broad live-edge walnut desk on a black sit-stand frame, a tall fitted teak shelving unit of ceramics and books, potted figs and a bonsai along the sill, plank flooring and rolled drawings leaning in the corner
Light openings: side-window
