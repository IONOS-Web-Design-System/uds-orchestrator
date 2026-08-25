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

     LIGHT-OPENING TAG. Each preset also declares, on the line beneath its text, the exterior
     openings its stated architecture HAS — the same three-value vocabulary shared-lighting.md
     uses for the opening each lighting preset asserts: `side-window`, `overhead-glazing`, or
     `none`. image-svc (craft/sceneLighting.ts) intersects the two, as a SECOND narrowing stage
     after shared-lighting-by-scenario.md, because architecture is the harder constraint: a
     windowless room physically cannot receive window light, while a windowed room can plausibly
     be lit many ways. This is the ONLY mechanism keeping the two axes from asserting contradictory
     facts about one room — the preset text itself must stay silent about light.
     How the nine presets across both environment files were tagged:
       - name an opening only where the text PLACES one (arched windows along one side, a whole
         wall of steel glazing, a corner of full-height glazing);
       - `overhead-glazing` only where the text names roof glazing. NO preset in either file does,
         and two name an opaque ceiling outright (painted coffered vaults, a slatted timber
         soffit), so `overhead-skylight` is unreachable for these places BY DESIGN, not by
         oversight. It stays reachable for the places with no environment catalog (workshop, cafe,
         retail, studio, outdoors). Authoring a roof-glazed room is how to bring it back here;
       - `none` only where the text bounds the whole space and accounts for its boundaries with no
         exterior opening among them (a booth walled off behind an internal partition);
       - otherwise `side-window`, because a floor or hall described by its features is
         UNDER-DESCRIBED about windows rather than asserting their absence, and silence must not
         read as denial. Over-restricting here would collapse daytime office lighting back toward
         a single preset, which is the homogeniser this whole axis exists to remove.
     An untagged preset means "no constraint" and is reported as a data fault — never "no light
     admitted", which would fail silently and totally. The tag is METADATA: only the text line is
     ever injected into a prompt.

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
Light openings: side-window

## industrial-conversion-coworking
an industrial conversion coworking floor, rough concrete-block piers and exposed ductwork under a slatted timber soffit, a poured resin floor, a black-framed internal glass box enclosing a plywood counter and high stools, a hand-painted graphic mural across one wall
Light openings: side-window

## glass-partition-meeting-booth
a small meeting booth walled off behind an internal glass partition that layers reflections of the room over it, a plain pale board wall behind a bare timber table, dark joinery and a low counter along one side
Light openings: none

## warehouse-glazing-lounge
a converted warehouse breakout lounge with a whole wall of white-painted multi-pane steel glazing onto a red-brick facade a few metres away, column radiators along the sills, white walls and a white floor, a pale modular sofa, upholstered easy chairs and a round birch table on a green rug, a dark arched floor lamp standing beside the seating
Light openings: side-window

## brick-and-plaster-loft
a loft startup room of pale exposed brick scarred by a patch of stripped grey plaster, a black steel post, a white-framed internal partition and an arched timber door to one side, blue fabric sofas around a black glass table, a sticky-note-covered whiteboard on castors, a white drum-shade lamp mounted on a wall arm
Light openings: side-window

## open-plan-deskscape
an open-plan bench floor of pale ashlar stone-block walls and blond plank flooring, rows of light birch trestle desks back to back carrying monitors and anglepoise lamps, black mesh chairs, dark lockers and a partition volume behind, desks cluttered with succulents, bottles and small trinkets
Light openings: side-window
