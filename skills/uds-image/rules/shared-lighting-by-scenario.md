<!-- Scenario -> eligible lighting presets. Parsed by image-svc (craft/sceneLighting.ts), which
     narrows shared-lighting.md's 14 presets to the subset that suits the scenario and then rotates
     WITHIN that subset. Scenario narrows the range; it never fixes a single answer.
     EVERY cell must list at least THREE slugs — a shorter cell trades hash-sameness for
     lookup-sameness, which defeats the purpose. Slugs must exist in shared-lighting.md. -->

# Lighting by scenario

## open-plan-office
- morning: bright-window-side, overcast-broad-key, rain-diffused-window
- midday: overhead-skylight, high-key-diffused, blinds-shaft-light
- afternoon: bright-window-side, blinds-shaft-light, hazy-backlit-bloom
- evening: warm-ambient-interior, blue-hour-practicals, directional-warm-falloff
- night: blue-hour-practicals, warm-ambient-interior, directional-warm-falloff

## home-office
- morning: bright-window-side, rain-diffused-window, overcast-broad-key
- midday: bright-window-side, high-key-diffused, overhead-skylight
- afternoon: golden-hour-raking, blinds-shaft-light, warm-ambient-interior
- evening: blue-hour-practicals, warm-ambient-interior, directional-warm-falloff
- night: blue-hour-practicals, directional-warm-falloff, warm-ambient-interior

## meeting-room
- morning: overcast-broad-key, bright-window-side, high-key-diffused
- midday: high-key-diffused, overhead-skylight, blinds-shaft-light
- afternoon: bright-window-side, blinds-shaft-light, overcast-broad-key
- evening: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals
- night: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals

## cafe
- morning: bright-window-side, backlit-window-rim, rain-diffused-window
- midday: hazy-backlit-bloom, bright-window-side, high-key-diffused
- afternoon: golden-hour-raking, hazy-backlit-bloom, warm-ambient-interior
- evening: warm-ambient-interior, blue-hour-practicals, directional-warm-falloff
- night: warm-ambient-interior, blue-hour-practicals, directional-warm-falloff

## workshop
- morning: bright-window-side, overcast-broad-key, overhead-skylight
- midday: overhead-skylight, hard-sun-defined-shadows, blinds-shaft-light
- afternoon: golden-hour-raking, blinds-shaft-light, bright-window-side
- evening: directional-warm-falloff, warm-ambient-interior, blue-hour-practicals
- night: directional-warm-falloff, warm-ambient-interior, blue-hour-practicals

## retail
- morning: bright-window-side, high-key-diffused, overcast-broad-key
- midday: high-key-diffused, overhead-skylight, hazy-backlit-bloom
- afternoon: golden-hour-raking, bright-window-side, hazy-backlit-bloom
- evening: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals
- night: warm-ambient-interior, directional-warm-falloff, blue-hour-practicals

## studio
- morning: soft-studio-frontal, high-key-diffused, bright-window-side
- midday: soft-studio-frontal, high-key-diffused, overhead-skylight
- afternoon: soft-studio-frontal, directional-warm-falloff, bright-window-side
- evening: soft-studio-frontal, directional-warm-falloff, warm-ambient-interior
- night: soft-studio-frontal, directional-warm-falloff, warm-ambient-interior

## outdoors
- morning: hazy-backlit-bloom, overcast-broad-key, bright-window-side
- midday: hard-sun-defined-shadows, high-key-diffused, hazy-backlit-bloom
- afternoon: golden-hour-raking, hard-sun-defined-shadows, hazy-backlit-bloom
- evening: golden-hour-raking, blue-hour-practicals, hazy-backlit-bloom
- night: blue-hour-practicals, directional-warm-falloff, warm-ambient-interior
