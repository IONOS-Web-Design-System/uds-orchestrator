<!-- Environment presets for the `home-office` place. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts, resolveEnvironment) and injected as `Environment: <text>`.
     This file is NEVER inlined as a menu, so its length costs the prompt nothing: eight rooms and
     three rooms both inject exactly one line.
     PLACE axis only: architecture, spatial depth, surfaces and materials, window character, and
     what populates the mid-ground. Light source, direction, quality and colour grade belong to
     shared-lighting.md; shot size, height, angle, lens and depth of field belong to the
     shared-camera-*.md files; the character belongs to the persona and the brief. A preset must
     never say whether people are present — that is the brief's decision, not the room's, and
     every one of these eight references has a person in it (bar two) whose presence, pose and
     activity are deliberately absent from the text below.
     A room's own light FIXTURES are place content, not lighting content: named as a physical
     object wherever one is visually dominant in its reference (an articulated desk lamp, a globe
     lamp, a bankers lamp), and named in none otherwise — the same rule
     `shared-environment-workspace.md` applies, kept identical across both catalogs. Of these
     eight, THREE have one that dominates: close-wall-desk-nook (an articulated desk lamp, which
     is the only thing lighting that room), window-bay-compact-desk (an opal glass globe lamp) and
     parquet-sit-stand-corner (a brass bankers lamp). The other five references show no fixture at
     all, or only a ceiling fitting out of frame, so they name none.
     A light fixture is the ONLY small object a preset may name, and the boundary is deliberate.
     `shared-scenario-props.md` owns the objects within reach of the subject, keyed on
     `place` x `who`, so a room naming one puts that object into EVERY brief this room is drawn
     for regardless of who is in it or what they are doing — the unkeyed-prop defect, arriving by
     way of the environment axis, and invisible to the props guard because that guard scans the
     INJECTED rules and these catalogs are read in code. It is also a measurement confounder: any
     distribution over generated prop nouns is skewed by whichever runs happened to draw the room.
     A ceramic mug was removed from the first preset for exactly this reason and must not come
     back: references 01, 02, 03, 04 and 08 all have a mug, tumbler or bottle in frame, 05 and 07
     a standing photo frame, 04 and 08 a laptop, and NONE of those is written below. Plants,
     shelving, printers, sideboards, monitors and furniture STAY — those populate the mid-ground,
     which is this axis's job.
     SEASONAL DECORATION is excluded on the same principle, one step further out: reference 03
     shows a hanging stocking and a snow globe on the mantel, and describing them would date every
     image generated from that room for the other eleven months. The mantel, its tile and its
     architecture are described; the season is not.
     BRAND MARKS are excluded because they are not room content and because the negative-prompt
     baseline forbids them in the output: reference 06 has a clothing wordmark across the subject's
     back, 02 and 03 a device maker's mark on a tablet lid, 07 an all-in-one computer whose maker
     is identifiable by shape. The text says "two monitors", "an all-in-one computer" — never the
     maker.

     RENDERED TEXT — reference 01, and why the wall object is described the way it is. The wall
     behind that desk is filled by a framed TRAVEL POSTER whose own design is typography: a place
     name set large across the top. Both generated runs that drew this room came back with legible
     invented lettering across that wall, and the vision gate passed both, against a hard
     no-rendered-text rule in the negative-prompt baseline. Three ways out were considered:
     (a) describe the poster and add a no-lettering clause — rejected, because a preset is a
     descriptive fragment rather than an instruction, and naming the thing to avoid is how the
     word gets into the frame; (b) drop the wall object entirely — rejected, because the wall
     being FILLED by one large thing right behind the desk is most of what makes that room read as
     a nook with no depth; (c) keep the picture and drop the genre. Travel poster, poster and
     print are the nouns that carry typography by definition — a travel poster is a design genre
     whose subject IS its lettering — whereas a framed PHOTOGRAPH of a named subject is a
     pictorial field with nothing to letter. So the text below names a wide dark-framed photograph
     of a timber jetty over pale water: the reference's own picture, at the reference's own scale,
     with the typographic genre removed. This is REASONED from the genre, then CHECKED in
     generated frames for this room specifically; it is not proven in general, and if lettering
     reappears the next step is (b), not a clause.
     Reference 07 carries a second, smaller instance: a wire grid panel hung at the desk end with
     letter tiles spelling a word across it. That one is handled by OMISSION rather than by
     rewording — the panel is a minor object in a crowded room, not the thing that makes the room
     read, so nothing is lost by leaving it out, and nothing invites lettering. Omission was the
     right answer there and the wrong answer for reference 01 for the same reason in reverse: the
     wall object in 01 IS what makes that room a nook.
     That trim also pulled this preset from 507 chars to 375, which matters: `minimal` injects
     exactly ONE `Environment:` line, so the eight-room catalog costs the prompt nothing for being
     eight — but the LENGTH of the line drawn is a real cost against a budget already over target,
     and a 507-char room raised `minimal`'s measured maximum by 171 chars on its own. Measured
     across 24 requestIds at place=home-office, craftProfile=minimal, model-independent: the
     three-room catalog ran 17 426-17 554 chars; this eight-room one runs 17 399-17 593, a mean
     shift of about +30 that tracks the mean room-line length (288 -> 303 chars) and nothing else.
     The minimum went DOWN, because one of the new rooms is shorter than any of the old three.

     DAYLIGHT-DIRECTION TAG. Each preset declares, on the line beneath its text, the set of
     daylight DIRECTIONS its stated architecture PROVIDES — any of `side`, `behind`, `above`, or
     `none` for a room no daylight reaches at all — against the direction each lighting preset
     REQUIRES in shared-lighting.md. image-svc (craft/sceneLighting.ts) intersects the two as a
     second narrowing stage after shared-lighting-by-scenario.md. The full tagging rule, and why
     silence about a window is NOT read as denial while an opaque surface named CLOSE BEHIND is,
     is written out once in `shared-environment-workspace.md`'s header — read it there rather
     than trusting a paraphrase.
     Applied to these eight: only the desk nook is genuinely sealed — its reference is a dark room
     carried by its own desk lamp, with the wall filling the frame — so `none`, and it remains the
     one room in either catalog that draws no daylight preset at all. Reference 06 shows no window
     either, but it is plainly daylit (a soft even fall across a pale wall, the plant lit from one
     side, no fitting anywhere in frame), and silence about a window must not read as denial, so
     `side`. The sofa corner likewise reads as daylit while its prose puts "a plain white wall
     close behind": what that denies is BACKlight, not daylight, so `side`. Three rooms have
     glazing that WRAPS a corner or fills the wall a desk is pushed against — the window bay, the
     two blinded windows meeting at an angle, the two curtained windows in one corner — so those
     provide `side` and `behind`. The mantel room's single sash window and the parquet corner's
     one reveal are plainly to one side: `side`.
     An untagged preset means "no constraint" and is reported as a data fault — never "no daylight
     admitted".

     BRIGHTNESS TAG. Each preset ALSO declares, on the line below the daylight tag, the tonal
     range the room itself can carry: `dim`, `mid` or `bright`, exactly one per room. The full
     vocabulary — including why the LIGHTING side may not say `dim` and why a room may not say
     `any` — lives in `shared-lighting.md`'s header, beside the requirement half of the pair.
     WHAT THE TAG MEANS, and what it does NOT. It is the tone of the room's own SURFACES and
     APERTURES: how light the walls, floor and furnishings are and how much opening there is to
     light them. It is NOT the mean luma of the reference frame, and the two disagree hard enough
     that using the frame would have mistagged three of eight. Measured on these references
     (512 px wide, LANCZOS, mean Rec.709 luma): 01 = 99, 02 = 134, 03 = 117, 04 = 157, 05 = 209,
     06 = 143, 07 = 161, 08 = 111. Reference 03 is a white room with a tall window onto a garden
     and scores 117 because a dark television and a heaped plaid throw occupy the near field;
     reference 08 is a white room with sun raking across it and scores 111 because half the frame
     is mid-brown parquet; reference 04 scores 157 off one blown-out window while its interior
     surfaces sit in a flat cool half-light. Frame luma measures the photograph, including its
     subject and foreground; this axis owns the room. So the tags are read from the surfaces:
       dim     dark walls and no daylight — the room cannot be light whatever is done to it.
               ONE of eight: close-wall-desk-nook, dark grey-green and lamp-carried.
       mid     plainly lit, neither dark nor light-filled: a pale wall with no aperture in frame,
               an olive-and-cream sofa corner, white surfaces under a cool flat half-light.
               THREE of eight.
       bright  white or cream walls and joinery with real glazing onto them — a room that reads
               light before anything is done to it. FOUR of eight.
     WHY THE DIMENSION EXISTS. The previous version of this catalog held THREE presets, and all
     three were dark-walled and planted, because it was authored one-preset-per-reference from a
     reference set of three dark images. A user review of 72 generated images found every
     home-office frame came back as a dark plant-filled room, and there was no bright option in
     the catalog to draw. The reference set is now eight (1 dim, 3 mid, 4 bright), which is the
     substance of the fix. The tag is the other half: `planted-corner-window-study` declared
     daylight, so the daylight-direction filter admitted `high-key-diffused` and asked for a
     "near-white surround" in a green-black room. The room wins in the pixels, the lighting line
     does not, and word-retention metrics cannot see the contradiction — one run retained 90 % of
     the lighting line's words into a dark, contrasty frame. Direction alone could not express it:
     a window says nothing about what colour the walls are.
     The constraint runs ONE WAY on purpose. A near-white lighting preset in a dim room is a
     contradiction the room wins; a dark or falling-off preset in a bright room is an ordinary
     photographic choice — a white room at dusk lit by its own fittings is not a defect. So the
     LIGHTING side declares only "I need a surround at least this light", never "I need a dark
     one", and no preset is excluded for a room being too bright. The symmetric version was tried
     on paper first and collapses the evening and night cells: all three of their presets make no
     surround claim, so gating the bright end would have left the four bright rooms with one
     preset each for those hours, which is the fixed treatment this whole axis exists to remove.
     Both tags are METADATA, and they must stay BELOW the preset text: image-svc injects the first
     non-empty line under a `## slug` heading, so a tag authored ABOVE the text would be injected
     into the prompt in place of the room.

     Authored from the published reference components on the `asset/reference` canvas of Figma
     file StkUOHcGRMDXOZWT0E2nft, one preset per reference in this order:
       home-office-01 = 498:31   home-office-02 = 498:36   home-office-03 = 535:28
       home-office-04 = 535:29   home-office-05 = 535:30   home-office-06 = 535:32
       home-office-07 = 535:31   home-office-08 = 535:33
     Cite the component NAME, never only the node id: re-publishing a component changes its id
     (01 and 02 were 486:16 and 486:17 before a re-publish, and those ids are now invalid nodes),
     and the ids do NOT run in name order — 06 is 535:32 and 07 is 535:31, so do not infer one
     from a neighbour's. home-office-03 is a DIFFERENT component from the one this catalog's third
     preset was authored from: the old 03 (498:33, a dark planted corner-window study) was
     replaced in the reference set, and `planted-corner-window-study` went with it.
     A home office is a DOMESTIC room, not a small corporate one, and these eight are eight
     distinguishable places rather than variants of one: a sealed desk nook, a sofa corner, a
     tiled-mantel living room, a desk in a window bay, a blinded corner with a trestle desk, a
     bare pale wall with two monitors, a cluttered reclaimed-wood study, and a parquet corner with
     a sit-stand desk. Keeping them apart is what stops every home-office brief resolving to the
     same room. Do not flatten one toward another, and do not add a ninth that repeats a room
     already here. -->

# Environment presets — home office

## close-wall-desk-nook
a small domestic desk pushed up against a plain dark grey-green wall with a wide dark-framed photograph of a timber jetty receding over pale water almost filling the wall immediately behind it, a pale timber desktop carrying a slim monitor, an articulated desk lamp and a potted flowering plant, the wall so close that the room has almost no depth
Daylight: none
Brightness: dim

## olive-sofa-living-corner
a domestic living-room corner given over to soft seating rather than desks, a deep olive corduroy sofa heaped with cushions and a chunky cream knit throw, a plain white wall close behind, a slim black metal shelf unit and a leafy houseplant just beyond it
Daylight: side
Brightness: mid

## tiled-mantel-window-room
a domestic living room of white walls and white-painted joinery, a tall sash window along one side looking straight out into dense garden foliage, a patterned green-and-white tiled fireplace surround under a deep timber mantel carrying a potted orchid, a green upholstered armchair and a low sofa under loose woven throws, pale boards underfoot
Daylight: side
Brightness: bright

## window-bay-compact-desk
a compact white desk set into a floor-to-ceiling window bay, long grey curtains gathered and knotted back to one side, white walls and a white painted sill, an opal glass globe lamp on a slim dark stem, and a brick-clad facade of ranked windows standing a few metres away across the street
Daylight: side, behind
Brightness: mid

## blinds-corner-trestle-desk
a cream-walled domestic corner with two tall windows in white venetian blinds meeting at the angle, a slim white trestle desk set across one of them, a carved cream-painted chair with a woven seat, a small potted seedling, white skirting and a pale sand-coloured carpet
Daylight: side, behind
Brightness: bright

## pale-wall-dual-monitor-desk
a plain pale plastered wall filling the space behind a white desktop that carries two monitors side by side on slim stands, a grey fabric task chair drawn up to it and a leafy potted plant crowding in at the edge of the room
Daylight: side
Brightness: mid

## reclaimed-wood-curtained-study
a small domestic study with two curtained windows meeting in one corner behind sheer voile, a thick reclaimed-timber desk slab on black hairpin legs carrying an all-in-one computer, a distressed multi-coloured reclaimed-wood sideboard along one wall with a printer standing on it, a tall spray of pampas grass, an acoustic guitar leaning in the gap and large grey floor tiles
Daylight: side, behind
Brightness: bright

## parquet-sit-stand-corner
a white-walled domestic corner over herringbone oak parquet, a white sit-stand desk raised to standing height carrying a tiered clear-glass riser, a brass bankers lamp with a white glass shade, a walnut-shell swivel chair on a polished chrome five-star base, a long grey curtain and a white-painted window reveal to one side
Daylight: side
Brightness: bright
