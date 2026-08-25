<!-- Lighting presets, shared across every imageType. ONE is selected in code per run
     (image-svc/src/craft/treatment.ts) and injected as `Photographic lighting: <text>`.
     This file is NEVER inlined as a menu.
     Lighting axis only: source and direction, quality, contrast, colour grade, mood,
     backdrop tone. Shot size, height, angle and lens belong to the shared-camera-* files.
     EVERY entry must state a direction — shared-image-principles.md forbids flat,
     shadowless or uniformly lit results.

     DAYLIGHT-DIRECTION TAG. Each preset also declares, on the line beneath its text, the
     daylight DIRECTION its own words REQUIRE:
       side    the text puts the daylight to one side (a window, wall glazing, raking sun)
       behind  the text puts the daylight behind the subject (a rim, a backlit bloom)
       above   the text puts the daylight overhead (a skylight, roof glazing)
       any     the text needs daylight but names no direction an architecture could deny
       none    the text needs NO daylight at all — interior practicals and studio keys
     Two directions may be listed when either satisfies the text (`side, above`). `any` and
     `none` each stand alone.
     This REPLACES the earlier `Light openings: side-window/overhead-glazing/none` vocabulary,
     which conflated "has an aperture" with "receives daylight" and so produced two opposite
     defects at once. It read a `none` LIGHTING tag as "asserts no opening, so nothing can
     contradict it", yet three `none`-tagged presets asserted daylight anyway
     (high-key-diffused's "diffused daylight", overcast-broad-key's "overcast daylight",
     hazy-backlit-bloom's "bloom from behind") — so a sealed room reliably got daylight. And in
     the other direction it forced `none` onto rooms whose own references are plainly daylit,
     because their only real constraint was a close wall BEHIND, which an aperture vocabulary
     cannot say.
     image-svc (craft/sceneLighting.ts) intersects this REQUIREMENT against the set of directions
     the selected environment preset PROVIDES, as a second narrowing stage after
     shared-lighting-by-scenario.md. Compatible when the requirement is `none`; or the requirement
     is `any` and the room provides at least one direction; or a required direction is in the
     room's set. A `none` preset therefore fits every room — it asks the architecture for nothing
     — which is why it is also the fail-open default: a preset with NO usable tag line is treated
     as compatible with everything and reported as a data fault, never excluded everywhere (silent
     and total is the worse failure).
     The tag is METADATA, and it must stay BELOW the preset text: image-svc injects the first
     non-empty line under a `## slug` heading, so a tag authored ABOVE the text would be injected
     into the prompt in place of the preset. Nothing on a tag line is ever shown to the model. -->

# Lighting presets

## bright-window-side
bright daylight through a window from one side, generous soft fill opposite, cool-neutral grade, confident bright feel
Daylight: side

## high-key-diffused
very high-key diffused daylight from the front and above, near-white surround, low contrast, light energetic feel
Daylight: any

## warm-ambient-interior
soft warm ambient interior light with a clear key from one side, moderate contrast, warm grade, hands-on feel
Daylight: none

## overcast-broad-key
overcast daylight from a broad soft source above and slightly to one side, cool low-contrast grade, calm documentary feel
Daylight: any

## backlit-window-rim
a bright window directly behind the subject throwing a rim along hair and shoulders, high-key cool-neutral grade, airy feel
Daylight: behind

## soft-studio-frontal
soft frontal studio key with gentle falloff, minimal shadow, neutral pale backdrop, clean friendly feel
Daylight: none

## directional-warm-falloff
soft directional light from one side falling off gently into shadow, warm grey tones, quiet refined feel
Daylight: none

## golden-hour-raking
low golden-hour sun raking in from one side, long warm highlights across the surfaces, amber grade, unhurried feel
Daylight: side

## hard-sun-defined-shadows
hard direct sunlight from high to one side, crisp defined shadow edges, saturated contrast, graphic energetic feel
Daylight: side, above

## blue-hour-practicals
blue-hour dusk through the windows with warm interior practicals carrying the key, cool-warm split grade, focused evening feel
Daylight: side

## blinds-shaft-light
a shaft of light through window blinds striping the space from one side, high contrast, warm-neutral grade, deliberate cinematic feel
Daylight: side

## hazy-backlit-bloom
hazy backlit air with visible bloom from behind, lifted blacks and low contrast, warm haze grade, reflective feel
Daylight: behind

## rain-diffused-window
cool rain-diffused daylight through a wet window from one side, soft muted grade, low contrast, quiet interior feel
Daylight: side

## overhead-skylight
daylight from an overhead skylight falling straight down, soft top key with grounded shadows beneath, neutral grade, open airy feel
Daylight: above
