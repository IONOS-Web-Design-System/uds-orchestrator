<!-- Scenario -> eligible lighting presets. Parsed by image-svc (craft/sceneLighting.ts), which
     narrows shared-lighting.md's 14 presets to the subset that suits the scenario and then rotates
     WITHIN that subset. Scenario narrows the range; it never fixes a single answer.
     EVERY cell must list at least THREE slugs — a shorter cell trades hash-sameness for
     lookup-sameness, which defeats the purpose. Slugs must exist in shared-lighting.md.
     Cells with a genuinely fitting fourth option carry one, on purpose: a cell sitting exactly at
     the floor cannot lose one slug for one commit while a replacement is considered, so pinning
     every cell to exactly 3 turns ordinary curation into forced atomic edits. Do not pad a cell
     just to clear the floor — a badly-fitting fourth option is worse than the churn it avoids.
     A slug whose `Daylight:` requirement NO room of a catalogued place can provide is a DEAD
     entry: image-svc's stage 2 drops it for every room, so it counts toward the three-slug floor
     while contributing nothing and the cell is effectively shorter than it looks.
     `overhead-skylight` requires `above`, and no authored room provides `above` (see
     shared-environment-workspace.md's header — both ceilings the references show are opaque), so
     it is listed only for the places with NO environment catalog: workshop, retail, studio. It is
     gone from the midday cells of open-plan-office, meeting-room and home-office, where it had
     left home-office/midday with an EFFECTIVE size of 2 against its own floor of 3.
     evening and night intentionally hold the SAME 3 slugs for meeting-room, workshop and studio —
     for those, nothing about the light actually changes between "after hours" and "the middle of
     the night" (a controlled studio setup and a windowless-feeling interior mid-shift both read
     the same at 9pm and 1am). Every other place differentiates the two on purpose — see the
     evening vs. night rows below. -->

# Lighting by scenario

## open-plan-office
- morning: bright-window-side, overcast-broad-key, rain-diffused-window, high-key-diffused
- midday: hard-sun-defined-shadows, high-key-diffused, blinds-shaft-light, bright-window-side
- afternoon: bright-window-side, blinds-shaft-light, hazy-backlit-bloom, overcast-broad-key
- evening: warm-ambient-interior, blue-hour-practicals, directional-warm-falloff
- night: directional-warm-falloff, warm-ambient-interior, high-key-diffused

## home-office
- morning: bright-window-side, rain-diffused-window, overcast-broad-key, high-key-diffused
- midday: bright-window-side, high-key-diffused, blinds-shaft-light
- afternoon: golden-hour-raking, blinds-shaft-light, warm-ambient-interior, bright-window-side
- evening: blue-hour-practicals, warm-ambient-interior, directional-warm-falloff
- night: warm-ambient-interior, directional-warm-falloff, hazy-backlit-bloom

## meeting-room
- morning: overcast-broad-key, bright-window-side, high-key-diffused, blinds-shaft-light
- midday: high-key-diffused, hard-sun-defined-shadows, blinds-shaft-light, bright-window-side
- afternoon: bright-window-side, blinds-shaft-light, overcast-broad-key, high-key-diffused
- evening: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals
- night: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals

## cafe
- morning: bright-window-side, backlit-window-rim, rain-diffused-window, overcast-broad-key
- midday: hazy-backlit-bloom, bright-window-side, high-key-diffused, backlit-window-rim
- afternoon: golden-hour-raking, hazy-backlit-bloom, warm-ambient-interior, bright-window-side
- evening: warm-ambient-interior, blue-hour-practicals, directional-warm-falloff
- night: warm-ambient-interior, directional-warm-falloff, backlit-window-rim

## workshop
- morning: bright-window-side, overcast-broad-key, overhead-skylight, rain-diffused-window
- midday: overhead-skylight, hard-sun-defined-shadows, blinds-shaft-light, high-key-diffused
- afternoon: golden-hour-raking, blinds-shaft-light, bright-window-side, hard-sun-defined-shadows
- evening: directional-warm-falloff, warm-ambient-interior, blue-hour-practicals
- night: directional-warm-falloff, warm-ambient-interior, blue-hour-practicals

## retail
- morning: bright-window-side, high-key-diffused, overcast-broad-key, rain-diffused-window
- midday: high-key-diffused, overhead-skylight, hazy-backlit-bloom, bright-window-side
- afternoon: golden-hour-raking, bright-window-side, hazy-backlit-bloom, high-key-diffused
- evening: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals
- night: directional-warm-falloff, warm-ambient-interior, backlit-window-rim

## studio
- morning: soft-studio-frontal, high-key-diffused, bright-window-side
- midday: soft-studio-frontal, high-key-diffused, overhead-skylight, bright-window-side
- afternoon: soft-studio-frontal, directional-warm-falloff, bright-window-side
- evening: soft-studio-frontal, directional-warm-falloff, warm-ambient-interior
- night: soft-studio-frontal, directional-warm-falloff, warm-ambient-interior

## outdoors
- morning: hazy-backlit-bloom, overcast-broad-key, bright-window-side, golden-hour-raking
- midday: hard-sun-defined-shadows, high-key-diffused, hazy-backlit-bloom, overcast-broad-key
- afternoon: golden-hour-raking, hard-sun-defined-shadows, hazy-backlit-bloom, overcast-broad-key
- evening: golden-hour-raking, blue-hour-practicals, hazy-backlit-bloom
- night: blue-hour-practicals, directional-warm-falloff, warm-ambient-interior
