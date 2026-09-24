<!-- Environment presets for the shared-workspace places (`open-plan-office`, `meeting-room`).
     ONE is selected in code per run (image-svc/src/craft/treatment.ts, resolveEnvironment) and
     injected as `Environment: <text>`. This file is NEVER inlined as a menu.
     PLACE axis only: architecture, spatial depth, surfaces and materials, window character, and
     what populates the mid-ground. Light source, direction, quality and colour grade belong to
     shared-lighting.md; shot size, height, angle, lens and depth of field belong to the
     shared-camera-*.md files; the character belongs to the persona and the brief. A preset must
     never say whether people are present — that is the brief's decision, not the room's.
     A room's own light FIXTURES are place content, not lighting content: named as a physical
     object wherever one is visually dominant in its reference (pendant fittings, an anglepoise
     lamp, a floor lamp, a wall-mounted drum shade), and named in none otherwise. Applied
     consistently across all six presets below — do not add or drop a fixture mention without
     checking the reference actually has one dominating it.

     DAYLIGHT-DIRECTION TAG. Each preset also declares, on the line beneath its text, the set of
     daylight DIRECTIONS its stated architecture PROVIDES — any of `side`, `behind`, `above`, or
     `none` for a room no daylight reaches at all. shared-lighting.md tags each lighting preset
     with the direction it REQUIRES (`side`/`behind`/`above`, `any` for "needs daylight, direction
     immaterial", `none` for "needs no daylight"), and image-svc (craft/sceneLighting.ts)
     intersects the two as a SECOND narrowing stage after shared-lighting-by-scenario.md, because
     architecture is the harder constraint: you cannot add a window to a room, but you can shoot
     it at another hour. This is the ONLY mechanism keeping the two axes from asserting
     contradictory facts about one room — the preset text itself must stay silent about light.
     DIRECTION, not aperture, is the axis. Both defects the earlier
     `side-window`/`overhead-glazing`/`none` vocabulary produced were about direction and were
     therefore unsayable in it: a sofa corner with "a plain white wall close behind" denies
     BACKlight while permitting side light, and a booth bounded by interior glazing still receives
     the directional sun that crosses the floor outside it.
     How the nine presets across both environment files were tagged, from each preset's own prose
     AND its Figma reference — rendered and looked at, not inferred from the prose alone:
       - `side` wherever the text or the reference puts daylight to one side: arched windows along
         one side, a whole wall of steel glazing, a corner of full-height glazing, a glazed
         exterior door — or, for glass-partition-meeting-booth, raking sun BORROWED through an
         interior partition. Interior glazing transmits whatever the outer aperture provides, so
         "no exterior opening of its own" is not "no daylight"; that booth's own reference shows
         hard raking sun throwing a crisp shadow on the board wall behind the seated figure;
       - `behind` only where glazing wraps or fills the wall a subject would sit against (a whole
         wall of glazing, a glazed corner) or the space is open far behind, and NEVER where the
         text names something opaque close behind — a pale board wall, a brick wall, a poster wall;
       - `above` only where roof glazing is named. NO preset in either file names any, and the two
         ceilings these references actually show are opaque (painted coffered vaults, a slatted
         timber soffit). So `above` has NO PRODUCER among the nine rooms, and `overhead-skylight`
         is unreachable for open-plan-office, meeting-room and home-office BY DESIGN. That is why
         it is no longer listed in those three places' midday cells in
         shared-lighting-by-scenario.md, and stays listed only for the places with no environment
         catalog (workshop, retail, studio). Authoring a roof-glazed room is how to bring it back
         here; until then, listing it in a catalogued place's cell is a DEAD entry that silently
         shrinks the cell below its own three-slug floor;
       - `none` only where the room is a bounded vignette lit by its own fittings AND its
         reference confirms no daylight reaches it. Exactly one of the nine qualifies
         (close-wall-desk-nook, in the home-office catalog). Over-restricting here collapses daytime lighting back toward a
         single preset, which is the homogeniser this whole axis exists to remove: a floor or hall
         described by its features is UNDER-DESCRIBED about windows, and silence must not read as
         denial.
     An untagged preset means "no constraint" and is reported as a data fault — never "no daylight
     admitted", which would fail silently and totally.

     BRIGHTNESS TAG. Each preset ALSO declares, on the line below its daylight tag, the tonal
     range the room itself can carry: `dim`, `mid` or `bright`, exactly one per room. The
     requirement half of the pair, the full vocabulary, and why this side may not say `any` while
     the lighting side may not say `dim`, live in `shared-lighting.md`'s header — read them there.
     The dimension was added because the home-office catalog shipped three dark rooms and a
     `Daylight: side, behind` tag on one of them admitted `high-key-diffused`, which asks for a
     "near-white surround" the architecture could not supply. Direction cannot express tone: a
     window says nothing about what colour the walls are. These six rooms are tagged for the same
     filter even though the defect was not theirs, because an untagged room applies no constraint
     and reports a data fault on every single run of its place — a permanent warning is not a
     tagging decision.
     WHAT THE TAG MEANS. The tone of the room's own SURFACES and APERTURES, not the mean luma of
     the reference frame. The two disagree: measured on these six references (512 px wide,
     LANCZOS, mean Rec.709 luma) workspace-01 = 104, 02 = 127, 03 = 85, 04 = 167, 05 = 148,
     06 = 89 — and workspace-06 is pale ashlar stone and blond plank flooring scoring 89 because
     the near field is filled with dark monitors, dark lockers and dark mesh chairs. Frame luma
     measures the photograph including its subject and foreground; this axis owns the room.
     Read from the surfaces, rendered and looked at:
       - `bright` for warehouse-glazing-lounge alone: white walls, a white floor, a whole wall of
         white-painted glazing and pale upholstery, with nothing dark in the room itself;
       - `dim` for glass-partition-meeting-booth alone: its reference is a dark interior in which
         one raking shaft carries the whole frame, the pale board wall stays in shadow, and the
         joinery, the partition reflections and the surround are all dark. It is the second `dim`
         room across both catalogs, and the only one that is not sealed — dim and windowless are
         different facts, which is the entire reason these are two tags;
       - `mid` for the other four: pale stone under a dark painted coffered vault; a dark
         concrete-block pier against a warm resin floor; pale brick scarred by stripped grey
         plaster; pale stone and blond plank behind ranks of dark monitors and lockers. None of
         them is dark, and none reads light-filled.
     Both tags are METADATA and must stay BELOW the preset text, for the reason given just above.

     The tag is METADATA, and it must stay BELOW the preset text: image-svc injects the first
     non-empty line under a `## slug` heading, so a tag authored ABOVE the text would be injected
     into the prompt in place of the room.

     Authored from the published reference components on the `asset/reference` canvas of Figma
     file StkUOHcGRMDXOZWT0E2nft, one preset per reference in this order:
       workspace-01 = 498:35   workspace-02 = 498:32   workspace-03 = 498:29
       workspace-04 = 498:30   workspace-05 = 498:34   workspace-06 = 498:37
     Cite the component NAME, never only the node id: re-publishing a component changes its id
     (workspace-01..06 were 486:11, 486:12, 486:13, 486:14, 486:15, 486:19 before a re-publish —
     NOT a contiguous range, and NOT the same as the now-invalid ids on the home-office file's
     components — and those ids are now invalid nodes), and the ids do NOT run in name order: do
     not infer one from a neighbour's.
     These are FIVE distinct buildings across six rooms, not six: workspace-01
     (converted-vaulted-hall) and workspace-06 (open-plan-deskscape) are the same building — same
     pale ashlar stone-block coursing, same blond plank floor, same light-timber trestle desks —
     photographed at nave-overhead distance versus desk-surface distance, which is the CAMERA
     axis and out of scope for this text. Both presets stay: nave-level and desk-level read as
     distinct rooms even within one building, and dropping either would cost real coverage. Do
     not flatten a preset toward the old default bright modern office with shelving and plants,
     and do not add a seventh preset that repeats a room already here. -->

# Environment presets — workspace

## converted-vaulted-hall
a converted historic hall serving as an open-plan office, painted coffered vaults overhead, ashlar limestone walls, tall arched stone-mullioned windows along one side, ranks of timber desks running far back beneath pendant fittings on long drops
Daylight: side
Brightness: mid

## industrial-conversion-coworking
an industrial conversion coworking floor, rough concrete-block piers and exposed ductwork under a slatted timber soffit, a poured resin floor, a black-framed internal glass box enclosing a plywood counter and high stools, a hand-painted graphic mural across one wall
Daylight: side, behind
Brightness: mid

## glass-partition-meeting-booth
a small meeting booth walled off behind an internal glass partition that layers reflections of the room over it, a plain pale board wall behind a bare timber table, dark joinery and a low counter along one side
Daylight: side
Brightness: dim

## warehouse-glazing-lounge
a converted warehouse breakout lounge with a whole wall of white-painted multi-pane steel glazing onto a red-brick facade a few metres away, column radiators along the sills, white walls and a white floor, a pale modular sofa, upholstered easy chairs and a round birch table on a green rug, a dark arched floor lamp standing beside the seating
Daylight: side, behind
Brightness: bright

## brick-and-plaster-loft
a loft startup room of pale exposed brick scarred by a patch of stripped grey plaster, a black steel post, a white-framed internal partition and an arched timber door to one side, blue fabric sofas around a black glass table, a sticky-note-covered whiteboard on castors, a white drum-shade lamp mounted on a wall arm
Daylight: side
Brightness: mid

## open-plan-deskscape
an open-plan bench floor of pale ashlar stone-block walls and blond plank flooring, rows of light birch trestle desks back to back carrying monitors and anglepoise lamps, black mesh chairs, dark lockers and a partition volume behind, desks cluttered with succulents, bottles and small trinkets
Daylight: side
Brightness: mid
