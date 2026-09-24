<!-- Lighting presets. OPTIONAL, shared across every imageType. At most ONE is selected in code
     per run (image-svc/src/craft/treatment.ts) and injected as `Photographic lighting: <text>`.
     This file is NEVER inlined — not as a menu and not as prose — at any craftProfile, so
     nothing in this comment ever reaches a model. Verified: neither `minimalRules` nor
     `resolveRuleSet` in image-svc/src/craft/profiles.ts names it; its only reader is
     `resolveAxis`, which extracts the first non-empty line under a heading.

     >>> THE AXIS IS OPTIONAL. On most runs NO lighting line is injected at all. <<<
     That is the finding this catalog was rebuilt around, not a degradation of it. Measured at
     craftProfile=minimal on gemini-3.1-flash-lite, 90 images, 4 arms: the always-injected
     catalog scored 16/30 on (time-of-day AND source/room AND photographic naturalness) against
     27/30 for injecting nothing at all (p=0.003), and it bought ZERO variety doing it — both
     arms produced the same 15 distinct look cells and the same 13 distinct rooms at n=30. The
     axis's only extra tonal range was at the blown-out end (luma 165 -> 192). Variety is carried
     by the ENVIRONMENT axis; this axis exists to state an expressive light where the scenario
     genuinely has one, and to stay silent where it does not.
     Two things open it, and nothing else: the brief NAMES a preset (which the moderator only
     permits when the original request itself names a light condition -- see
     shared-request-treatment-cues.md), or the scenario cell is marked `expressive` in
     shared-lighting-by-scenario.md. A cell marked `none` closes the axis outright.

     WHAT WAS DELETED AND WHY (arm A, n=30, per-preset draws and natural3 failures):
       soft-studio-frontal      2 draws, 2 failures. "minimal shadow" and a "neutral pale
                                backdrop" contradict this file's own governing rule and describe
                                a lit set rather than a room. No reference.
       blinds-shaft-light       4 draws, 4 failures -- every one. It asserted a fixture most
                                rooms lack; the frames delivered shafts with no blinds anywhere.
                                Its light CHARACTER survives as sun-patch-crossing-the-subject,
                                which asserts no fixture.
       high-key-diffused        2 draws, 1 failure, and "near-white surround, low contrast"
                                contradicts the governing rule. It also required `above`, which
                                no authored room provides.
       hazy-backlit-bloom       0 draws (no evidence either way), but "lifted blacks", "bloom"
                                and "hazy" are three post-production words in one line, and it
                                asserted daylight in night cells.
       backlit-window-rim       0 draws. "rim" is a genre word and it asserted daylight at night.
       rain-diffused-window     0 draws. It asserts WEATHER, and nothing in this system -- no
                                room, no scenario field, no brief field -- can supply weather, so
                                the assertion was unanswerable by construction (18 of 100
                                room-bearing triples).
       overhead-skylight        0 draws. It required `above` and no authored room provides it, so
                                it was excluded for every room of every place that HAS a room
                                catalog. CORRECTION to the standing claim that it was "unreachable
                                for weeks": it was reachable, but only in workshop / retail /
                                studio, the three places with no environment catalog at all, where
                                stage 2 is a pass-through. Deleted because no reference shows roof
                                glazing.
       directional-warm-falloff 5 draws, 4 failures. "warm grey tones, quiet refined feel" is a
                                grade and a mood and nothing else, and it was tagged
                                `Daylight: none` while its own text put the light "from one side".
       warm-ambient-interior    5 draws, 3 failures, same mis-tag, same grade-plus-mood shape.
     The last two named a real character -- a room carried by its own fittings -- which survives,
     re-authored from references, as lamplit-interior and one-lamp-close. What failed was the
     WORDING and the MAPPING, and both are fixed here rather than defended.

     WHAT SURVIVED. Every preset that drew a frame without a failure is still here:
     bright-window-side (5 draws, 0 failures) as window-side-daylight,
     hard-sun-defined-shadows (3, 0) under its own name, overcast-broad-key (2, 0) as
     overcast-flat-daylight, blue-hour-practicals (2, 0) as dusk-outside-lamps-inside. Sliced the
     other way: on arm A's own 30 runs the presets that survive this prune drew 12 times and
     failed 0 times, against 27/30 for injecting nothing. The prune is the whole difference
     between 16/30 and 12/12.
     THREE SLUGS WERE RENAMED (bright-window-side, overcast-broad-key, blue-hour-practicals). A
     stored brief naming an old slug now resolves as `not-in-catalog`, which `resolveAxis` already
     records and recovers from by rotating inside the narrowed set. Accepted deliberately: the old
     names asserted things the new text does not (`bright` is no longer a surround claim, and
     `blue-hour` named a ~30-minute event that sat in 10 evening and night cells).

     AUTHORING RULES. Every preset states, and states ONLY:
       1. the light SOURCE,
       2. the DIRECTION it comes from,
       3. the SHADOW CHARACTER it actually produces.
     No mood or feel clause. No photographic genre word. No colour or tonal term unless it is a
     physical fact of that light -- low sun IS warm, a dusk sky IS deep blue, a tungsten lamp IS
     warm, direct sun DOES render colour at full strength. Every entry cites the Figma reference
     it was authored from, BY NAME: the node ids are not in name order and have changed on
     re-publish twice. File `StkUOHcGRMDXOZWT0E2nft`, page `asset/reference`. The roster is
     listed in one call by `list_file_components_for_code_connect` with only the fileKey; the page
     listing is incomplete and probing the id space fails.
     NOTE ON `device-focused-10`: that component is excluded from the CAMERA catalog because it is
     a composite marketing banner whose geometry is a screen-out-to-lens device, not a photographic
     viewpoint. That exclusion is about GEOMETRY and does not apply to this axis -- underneath the
     two flat overlaid UI panels its photographic layer is direct sun on strongly saturated colour
     with crisp diagonal cast shadows, which is a legitimate light reference. Do not "fix" this by
     deleting the citation.
     NOTE ON A PRESET THAT WAS DELIBERATELY NOT AUTHORED: `device-focused-01` shows the device's
     own display as the brightest thing on the subject in a dim room -- a real and distinct
     character. It is NOT in this catalog because this axis has no imageType dimension: the same
     line is drawable for a portrait with no screen in frame, which is exactly the fixture-
     assertion failure that took blinds-shaft-light to 4/4. There is no honest tag for it, and a
     tag value needs a producer and a consumer on both sides.
     A preset naming an OBJECT gets that object. One earlier draft named a travel poster and six
     of eight draws came back with legible invented lettering on a wall, so
     sun-shadows-on-a-pale-wall says "whatever stands in it" rather than naming the caster.

     DAYLIGHT-DIRECTION TAG, on the line beneath the text: the daylight DIRECTION the preset's
     own words REQUIRE.
       side    the text puts the daylight to one side (a window, wall glazing, raking sun)
       behind  the text puts the daylight behind the subject
       above   the text puts the daylight overhead
       any     the text needs daylight but names no direction an architecture could deny
       none    the text needs NO daylight at all
     Two directions may be listed when either satisfies the text. `any` and `none` stand alone.
     NO PRESET IN THIS CATALOG REQUIRES `above`, and no authored room PROVIDES it (both ceilings
     the workspace references show are opaque). The value is therefore inert on BOTH sides, which
     is a different and harmless state from the one that shipped before: a preset requiring a
     direction with no producer is deleted from every catalogued room, silently. `above` stays in
     the code vocabulary so a future room can declare it; check-lighting-axis.mjs asserts that
     every direction a PRESET requires has at least one room producing it.

     BRIGHTNESS TAG, on the line below the daylight tag: the tonal range of ROOM the text requires.
       bright  the text asserts a near-white or high-key surround; only a light-toned room
       mid     the text asserts a plainly-lit, non-dark surround; authored as `mid, bright`
       any     the text makes NO claim about the surround, so every room satisfies it
     A room declares `dim`, `mid` or `bright`, exactly one. A room may not say `any` ("a room of
     unspecified tone" is not a fact an architecture can have). This side may not say `dim`:
     nothing here needs a DARK surround, so a `dim` requirement would have no producer.
     THE BRIGHTNESS CONSTRAINT RUNS ONE WAY, and must stay that way: a near-white preset is
     refused a dark room, and no preset is ever refused for a room being too light. The symmetric
     version was worked through and collapses the evening and night cells of every catalogued
     place, because every preset those cells list makes no surround claim.
     THE DAYLIGHT CONSTRAINT RUNS TWO WAYS, and this is the change: a `none` preset asks the
     architecture for nothing, so it used to fit every room BY DESIGN -- and that was the one
     residual fault left in the scenario-derived arm, and 21 of 100 room-bearing triples in the
     shipped catalog: an interior-key line is legal in a plainly sunlit room. So a `none` preset
     is now ALSO refused when the room provides daylight AND the hour is a DAY hour (morning,
     midday, afternoon). It stays legal at evening, at night and when the hour is unspecified,
     where a room carried by its own fittings is the truthful answer whatever the windows are.
     Do not make the brightness half symmetric to match; they are different mechanisms and
     lightOpenings.test.ts pins both.
     REFERENCE TAG, on the line below the brightness tag: the reference frame or frames the
     preset's wording was authored from, by NAME. It has NO PARSER and is not meant to get one —
     verified, not assumed: nothing in image-svc reads a `Reference:` line, and `resolveAxis` takes
     only the first non-empty line under a `## slug` heading, so it is never injected either. It is
     kept for ONE reason and it is not decoration: the failure this catalog was rebuilt to undo was
     presets authored from nothing, and across the camera catalogs seven of eighteen presets matched
     no reference and no description at all. A preset that cannot name the frame it came from is
     that failure, visible. The other three catalogs record the same provenance in their headers
     (`References:`) because their presets are authored as a set from one reference family; this
     catalog draws from three families, so the citation has to sit per preset. Treat an empty or
     absent `Reference:` line as the thing to explain before the preset ships, not as a lint nit.

     A preset with NO usable tag line on either key is treated as compatible with everything and
     reported as a data fault, never excluded everywhere: silent and total is the worse failure.
     Tags MUST stay BELOW the preset text -- image-svc injects the first non-empty line under a
     `## slug` heading, so a tag authored above the text would be injected in place of the preset.
     Nothing on a tag line is ever shown to the model. -->

# Lighting presets

## window-side-daylight
daylight through a window to one side, the side of the subject facing it clearly brighter than the side away from it, shadows soft-edged and falling away from the window
Daylight: side
Brightness: any
Reference: home-office-03, home-office-07

## overcast-flat-daylight
overcast daylight, one broad soft source with no sun in it, shadows wide and soft with no hard edge anywhere, still enough direction that one side of each object is plainly darker
Daylight: any
Brightness: any
Reference: workspace-04

## hard-sun-defined-shadows
direct sun from high and to one side, cast shadows with hard crisp edges and one clear direction, surface colour at full strength where the sun lands
Daylight: side
Brightness: any
Reference: device-focused-10, device-focused-08

## low-sun-raking
low warm sun coming in almost level from one side, long hard-edged shadows thrown across the surfaces and up the far wall, hot highlights where it grazes wood and metal, the parts of the room it does not reach left genuinely dark
Daylight: side
Brightness: any
Reference: device-focused-08

## sun-patch-crossing-the-subject
a single patch of direct sun reaching in from one side and crossing part of the subject while the rest of the space falls away into deep shadow, the edge of the patch hard and precise, nothing outside it lit
Daylight: side
Brightness: any
Reference: workspace-03

## sun-shadows-on-a-pale-wall
direct sun through the window printing the hard-edged shadows of whatever stands in it across a pale wall, bright sun patches on the floor below, the shadow shapes sharp enough to read
Daylight: side
Brightness: mid, bright
Reference: home-office-08

## daylight-and-lit-lamps
daylight through the windows on one side and the room's own lamps switched on as well, the two visibly different in colour where they meet, shadows soft and doubled
Daylight: side
Brightness: any
Reference: workspace-01, workspace-05

## dusk-outside-lamps-inside
the sky beyond the windows already deep blue and giving almost no light, the room's own lamps carrying the frame, a warm pool close to each fitting falling away from it, the corners past them dark
Daylight: any
Brightness: any
Reference: home-office-01, workspace-06

## lamplit-interior
no daylight reaching the space at all, the room's own lamps the whole light, each one a warm pool falling off fast into shadow a short way from it, the light on the subject coming from the nearest one
Daylight: none
Brightness: any
Reference: workspace-06

## one-lamp-close
a single lamp close to the subject is the entire key, the near side of them strongly lit and the far side dropping to near-black, nothing behind them lit at all
Daylight: none
Brightness: any
Reference: home-office-01
