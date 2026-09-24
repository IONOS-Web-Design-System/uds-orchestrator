<!-- Scenario -> lighting eligibility. Parsed by image-svc (craft/sceneLighting.ts). This file
     answers TWO questions per cell, not one:
       1. IS the lighting axis open here at all, and
       2. if it is, WHICH presets suit the hour.
     Question 1 is the change. The axis is OPTIONAL now: on a cell that is not marked
     `expressive`, no `Photographic lighting:` line is injected unless the brief NAMES a preset,
     and a cell marked `none` refuses even that. See shared-lighting.md's header for the 90-image
     measurement this is built on -- always injecting scored 16/30 on naturalness against 27/30
     for injecting nothing, and bought zero variety doing it.

     ROW GRAMMAR, three forms, and nothing else:
       - <time>: expressive | slugA, slugB, slugC   the axis is OPEN here. The salted rotation
                                                    draws from this set with no explicit ask.
       - <time>: slugA, slugB, slugC                the axis is CLOSED to the rotation. Nothing
                                                    is injected unless the brief names a preset,
                                                    and a named preset is validated against
                                                    exactly this set.
       - <time>: none                               the axis is CLOSED OUTRIGHT. Nothing is
                                                    injected and a named preset is rejected.
     `|` and the word `none` cannot occur in a slug (`[a-z0-9-]+`), so neither marker can be
     mistaken for one. A row whose prefix before `|` is anything other than `expressive` is
     REPORTED, never silently read as a slug list -- the wrong-cell failure class this parser
     was already hardened against.
     `none` is a real value, distinct from an ABSENT row. An absent row means "no scenario
     opinion", which resolves to the whole catalog; `none` means "nothing in this catalog belongs
     here". Before `none` existed there was no way to say the second thing: an empty row fell
     through to null and then to the entire catalog, which is how an interior preset reaches a
     place it has no business in. Never express "nothing fits" by deleting a row.

     WHICH CELLS ARE MARKED, and why exactly these. A cell is `expressive` when the light at that
     hour in that place is determined by the HOUR AND PLACE rather than by whatever fittings the
     room happens to contain -- i.e. when a photograph taken there would show that light whatever
     the furniture is.
       midday, afternoon     direct sun is simply what those hours look like. On arm A's 30 runs
                             the day-sun presets that survive the prune drew 3 times at midday and
                             failed 0 times.
       evening               dusk is a real, short, distinctive event, and the one preset that
                             NAMES the hour drew twice at evening and passed twice. Evening is
                             also where fidelity is most at risk, so stating the light helps.
       outdoors, all hours   there is no room to contradict the sky, and no environment catalog
                             for outdoors at all, so every contradiction class that bit the old
                             catalog was a room fault that cannot arise here.
     And why the rest are NOT:
       morning               nothing about a morning interior is hour-determined. Arms B and C
                             show morning interiors coming out right with no line at all, and
                             every morning failure in arm A came from an injected preset.
       night                 the only honest night presets are the two lamp-carried ones, and
                             NEITHER names the hour -- measured, the non-hour-naming interior
                             presets failed 5 of 6 evening draws. They add nothing the shared
                             time-of-day rule does not already carry, so the axis stays shut and
                             the hour is carried by shared-time-of-day.md, which is inlined on
                             every run. That is a measurable claim: if night or evening comes back
                             bright, the time-of-day rule is what failed, not this table.
       studio, all hours     `none`. The studio's whole catalog was soft-studio-frontal plus
                             high-key-diffused plus overhead-skylight, all three deleted, and
                             there is NO studio reference in the Figma roster. Cannot tell means
                             not yet: a studio brief's light comes from its own prose until a
                             reference exists. Do not pad this with an interior preset -- a studio
                             is a set, not a room with fittings.
       outdoors/night        `none`. Outdoors after dark is streetlight and shopfront, which no
                             reference shows and no preset here describes.
     22 of 40 cells are marked, 12 are closed to the rotation, 6 are `none`. 22/40 is a DELIBERATE
     value, not a leftover: it is every cell where the hour or the place fixes the light.

     THE FLOOR CHANGED, AND IT IS NOT THE OLD ONE. The old floor was "every cell lists at least
     THREE slugs", justified as hash-sameness versus lookup-sameness. With an optional axis the
     real invariant is narrower and stated per outcome:
       - where the axis IS injected, the set surviving BOTH narrowing stages must never be a
         single pinned preset. TWO is the floor, not three. A pinned triple is a fixed treatment,
         the homogeniser this axis exists to remove.
       - where it is NOT injected, nothing is injected, and a cell with no eligible expressive
         preset is a correct outcome rather than a gap. Zero is fine; one is not.
       - an empty restriction must NEVER resolve to "the whole catalog". An empty array is TRUTHY
         at resolveAxis, and a naive filter-and-return once did exactly that, putting back every
         preset the restriction existed to exclude.
     Correcting the record while we are here: the claim that "no (place,timeOfDay) cell drops
     below 3 effective presets, all 54 pass" was wrong on all three counts. The old file had 125
     effective (place, timeOfDay, room) triples, 100 of them with a room catalog, 20 already below
     3, minimum 2. The three-slug figure was only ever a stage-1 property of this 40-cell table.
     lightOpenings.test.ts pins the >=2 floor on the real files.

     THE INTERIOR-KEY PAD, and where it must NOT go. home-office is the only place with a room
     that receives NO daylight (close-wall-desk-nook). Its DAY cells therefore carry
     lamplit-interior AND one-lamp-close so that room has two honest options instead of falling to
     the fallback ladder. TWO, because one would pin that room for the whole cell; and counted
     against BOTH tags, never `Daylight:` alone -- the previous pad used soft-studio-frontal,
     which asks for a pale backdrop a `dim` room cannot supply, so a cell padded with two presets
     delivered that room exactly ONE.
     This pad is SAFE only because the daylight filter now runs two ways: a `Daylight: none`
     preset is refused whenever the room provides daylight AND the hour is a day hour, so these
     two cannot reach a sunlit room at midday. That is the fault the pad would otherwise create --
     21 of 100 room-bearing triples in the old data.
     DO NOT pad the day cells of cafe, workshop or retail the same way. Those places have no
     environment catalog, so stage 2 is a pass-through and the two-way filter has no room to test
     against: an interior-key preset there would be injected into a daylit lunchtime cafe with
     nothing able to refuse it. open-plan-office and meeting-room need no pad either -- every room
     in the workspace catalog is daylit, and if one ever is not, the fallback ladder yields exactly
     these two presets, which is the right answer arrived at honestly.

     Slugs must exist in shared-lighting.md, and every preset there must appear in at least one
     cell: a preset with no consumer is dead weight that reads as coverage. STRONGER THAN THAT,
     and caught by treatment.axes.test.ts rather than reasoned about: every preset must be
     reachable by the ROTATION somewhere on the grid, not merely listed. daylight-and-lit-lamps was
     listed only in the morning rows, which are not marked, so the rotation could never draw it and
     only an explicitly named slug could reach it -- a preset in the catalog that no scenario can
     choose. It is now in the afternoon rows as well, which is faithful to its references
     (workspace-01 and workspace-05 are both plainly daytime interiors with the lamps switched on).
     `overhead-skylight` is gone, so the note about a dead entry requiring a direction no room can
     provide no longer applies to any row -- but the rule stands and check-lighting-axis.mjs
     enforces it. -->

# Lighting by scenario

## open-plan-office
- morning: window-side-daylight, overcast-flat-daylight, daylight-and-lit-lamps
- midday: expressive | hard-sun-defined-shadows, sun-shadows-on-a-pale-wall, window-side-daylight, sun-patch-crossing-the-subject
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, window-side-daylight, sun-patch-crossing-the-subject, daylight-and-lit-lamps
- evening: expressive | dusk-outside-lamps-inside, lamplit-interior, one-lamp-close
- night: lamplit-interior, one-lamp-close

## meeting-room
- morning: window-side-daylight, overcast-flat-daylight, daylight-and-lit-lamps
- midday: expressive | hard-sun-defined-shadows, sun-shadows-on-a-pale-wall, window-side-daylight, sun-patch-crossing-the-subject
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, window-side-daylight, sun-patch-crossing-the-subject, daylight-and-lit-lamps
- evening: expressive | dusk-outside-lamps-inside, lamplit-interior, one-lamp-close
- night: lamplit-interior, one-lamp-close

## home-office
- morning: window-side-daylight, overcast-flat-daylight, daylight-and-lit-lamps, lamplit-interior, one-lamp-close
- midday: expressive | hard-sun-defined-shadows, sun-shadows-on-a-pale-wall, window-side-daylight, sun-patch-crossing-the-subject, lamplit-interior, one-lamp-close
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, window-side-daylight, sun-patch-crossing-the-subject, daylight-and-lit-lamps, lamplit-interior, one-lamp-close
- evening: expressive | dusk-outside-lamps-inside, lamplit-interior, one-lamp-close
- night: lamplit-interior, one-lamp-close

## cafe
- morning: window-side-daylight, overcast-flat-daylight, daylight-and-lit-lamps
- midday: expressive | hard-sun-defined-shadows, sun-shadows-on-a-pale-wall, window-side-daylight, sun-patch-crossing-the-subject
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, window-side-daylight, sun-patch-crossing-the-subject, daylight-and-lit-lamps
- evening: expressive | dusk-outside-lamps-inside, lamplit-interior, one-lamp-close
- night: lamplit-interior, one-lamp-close

## workshop
- morning: window-side-daylight, overcast-flat-daylight, daylight-and-lit-lamps
- midday: expressive | hard-sun-defined-shadows, sun-shadows-on-a-pale-wall, window-side-daylight, sun-patch-crossing-the-subject
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, window-side-daylight, sun-patch-crossing-the-subject, daylight-and-lit-lamps
- evening: expressive | dusk-outside-lamps-inside, lamplit-interior, one-lamp-close
- night: lamplit-interior, one-lamp-close

## retail
- morning: window-side-daylight, overcast-flat-daylight, daylight-and-lit-lamps
- midday: expressive | hard-sun-defined-shadows, sun-shadows-on-a-pale-wall, window-side-daylight, sun-patch-crossing-the-subject
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, window-side-daylight, sun-patch-crossing-the-subject, daylight-and-lit-lamps
- evening: expressive | dusk-outside-lamps-inside, lamplit-interior, one-lamp-close
- night: lamplit-interior, one-lamp-close

## studio
- morning: none
- midday: none
- afternoon: none
- evening: none
- night: none

## outdoors
- morning: expressive | hard-sun-defined-shadows, overcast-flat-daylight, low-sun-raking
- midday: expressive | hard-sun-defined-shadows, overcast-flat-daylight
- afternoon: expressive | low-sun-raking, hard-sun-defined-shadows, overcast-flat-daylight
- evening: expressive | low-sun-raking, overcast-flat-daylight
- night: none
