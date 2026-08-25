<!-- Lighting presets, shared across every imageType. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts) and injected as `Photographic lighting: <text>`.
     This file is NEVER inlined as a menu.
     Lighting axis only: source and direction, quality, contrast, colour grade, mood,
     backdrop tone. Shot size, height, angle and lens belong to the shared-camera-* files.
     EVERY entry must state a direction — shared-image-principles.md forbids flat,
     shadowless or uniformly lit results.

     LIGHT-OPENING TAG. Each preset also declares, on the line beneath its text, the exterior
     opening its own words ASSERT the light arrives through:
       side-window      the text names a window or wall glazing (light entering roughly sideways)
       overhead-glazing the text names a skylight or roof glazing (light falling from above)
       none             the text names no exterior opening at all — the room's own fittings, or
                        daylight whose opening it does not name
     Two values may be listed when the text fits either opening. `none` stands alone.
     image-svc (craft/sceneLighting.ts) intersects this tag against the SAME tag on the selected
     environment preset, as a second narrowing stage after shared-lighting-by-scenario.md, so a
     room whose architecture has no window can never be lit through one. A `none` preset is
     compatible with every room — it asserts nothing an architecture could contradict — which is
     why it is also the fail-open default: a preset with NO tag line is treated as `none` and
     reported as a data fault, never excluded everywhere (silent and total is the worse failure).
     The tag is METADATA. Only the text line is ever injected into a prompt; adding a tag line
     does not change what the model reads. -->

# Lighting presets

## bright-window-side
bright daylight through a window from one side, generous soft fill opposite, cool-neutral grade, confident bright feel
Light openings: side-window

## high-key-diffused
very high-key diffused daylight from the front and above, near-white surround, low contrast, light energetic feel
Light openings: none

## warm-ambient-interior
soft warm ambient interior light with a clear key from one side, moderate contrast, warm grade, hands-on feel
Light openings: none

## overcast-broad-key
overcast daylight from a broad soft source above and slightly to one side, cool low-contrast grade, calm documentary feel
Light openings: none

## backlit-window-rim
a bright window directly behind the subject throwing a rim along hair and shoulders, high-key cool-neutral grade, airy feel
Light openings: side-window

## soft-studio-frontal
soft frontal studio key with gentle falloff, minimal shadow, neutral pale backdrop, clean friendly feel
Light openings: none

## directional-warm-falloff
soft directional light from one side falling off gently into shadow, warm grey tones, quiet refined feel
Light openings: none

## golden-hour-raking
low golden-hour sun raking in from one side, long warm highlights across the surfaces, amber grade, unhurried feel
Light openings: side-window

## hard-sun-defined-shadows
hard direct sunlight from high to one side, crisp defined shadow edges, saturated contrast, graphic energetic feel
Light openings: side-window, overhead-glazing

## blue-hour-practicals
blue-hour dusk through the windows with warm interior practicals carrying the key, cool-warm split grade, focused evening feel
Light openings: side-window

## blinds-shaft-light
a shaft of light through window blinds striping the space from one side, high contrast, warm-neutral grade, deliberate cinematic feel
Light openings: side-window

## hazy-backlit-bloom
hazy backlit air with visible bloom from behind, lifted blacks and low contrast, warm haze grade, reflective feel
Light openings: none

## rain-diffused-window
cool rain-diffused daylight through a wet window from one side, soft muted grade, low contrast, quiet interior feel
Light openings: side-window

## overhead-skylight
daylight from an overhead skylight falling straight down, soft top key with grounded shadows beneath, neutral grade, open airy feel
Light openings: overhead-glazing
