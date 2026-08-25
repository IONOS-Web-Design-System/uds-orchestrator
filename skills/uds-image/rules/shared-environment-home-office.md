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

     DAYLIGHT-DIRECTION TAG. Each preset also declares, on the line beneath its text, the set of
     daylight DIRECTIONS its stated architecture PROVIDES — any of `side`, `behind`, `above`, or
     `none` for a room no daylight reaches at all — against the direction each lighting preset
     REQUIRES in shared-lighting.md. image-svc (craft/sceneLighting.ts) intersects the two as a
     second narrowing stage after shared-lighting-by-scenario.md. The full tagging rule, and why
     silence about a window is NOT read as denial while an opaque surface named CLOSE BEHIND is,
     is written out once in `shared-environment-workspace.md`'s header — read it there rather
     than trusting a paraphrase.
     These three rooms are why the model is DIRECTION rather than aperture. Only the desk nook is
     genuinely sealed — its reference is a dark room carried by its own desk lamp — so `none`, and
     it is the one room in either catalog that draws no daylight preset at all. The sofa corner
     reads as plainly daylit in its reference (a bright out-of-focus field top-left, cool-neutral)
     while its prose puts "a plain white wall close behind": what that denies is BACKlight, not
     daylight, so `side`. The study's glazing wraps a corner, so it provides `side` and `behind`.
     An untagged preset means "no constraint" and is reported as a data fault — never "no daylight
     admitted". The tag is METADATA, and it must stay BELOW the preset text: image-svc injects the
     first non-empty line under a `## slug` heading, so a tag authored ABOVE the text would be
     injected into the prompt in place of the room.

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
Daylight: none

## sofa-corner-lapwork
a domestic living-room corner given over to working from the sofa, a deep olive corduroy sofa heaped with soft cushions and a chunky cream knit throw, a plain white wall close behind, a slim black metal shelf unit and a leafy houseplant just beyond it
Daylight: side

## planted-corner-window-study
a home study set into a corner of full-height black-framed glazing onto dense autumn foliage, dark green-black walls, a broad live-edge walnut desk on a black sit-stand frame, a tall fitted teak shelving unit of ceramics and books, potted figs and a bonsai along the sill, plank flooring and rolled drawings leaning in the corner
Daylight: side, behind
