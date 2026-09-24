<!-- Request cues that OPEN the camera / lighting treatment menu to the planner.

     THIS FILE IS NEVER INLINED INTO ANY PROMPT. It is DATA, read by
     uds-moderator/src/plan/prompt.ts (buildPlanPrompt) and parsed the way the preset catalogs
     are. Nothing in it is addressed to a model, so the usual rule about not naming a banned
     phrase in reader-facing prose does not apply here — but do not start inlining it either,
     because half of these phrases are exactly the vocabulary the image rules forbid the craft
     model from inventing.

     WHY THIS EXISTS. The planner was asked, in prose, to set `imageBrief.treatment` "ONLY when
     the ORIGINAL request clearly implies one". It set BOTH axes on 21 of 21 stored plans,
     including for two real production briefs that contain no viewpoint or lighting language at
     all. Downstream, a named slug used to outrank the scenario narrowing, so the result was
     lighting pinned to one preset in 18 of 18 end-to-end runs and the camera pinned to whatever
     the planner liked for that brief. The prose instruction did not bind; a code gate does.

     THE SHAPE. The code decides whether there is a preference to express AT ALL; the planner
     still decides WHICH preset expresses it. So the axis menu — and the output-contract field
     that goes with it — is rendered only when the request itself names a viewpoint or a light
     condition. A request that names neither is never offered the field, never asked for it, and
     therefore cannot pin it: selection rotates from the scenario-narrowed catalog instead.

     FAIL CLOSED. If this file is missing or parses to nothing, NEITHER axis is offered. That is
     the safe direction: the cost is losing the ability to honour an unusually-phrased request
     for one run, and the alternative (fail open) reinstates the pinning this removes, silently.
     The moderator logs the miss.

     WHAT BELONGS HERE: a CONCRETE viewpoint or light CONDITION that a preset can actually match.
     WHAT DOES NOT: a generic mood or tonal adjective on its own — "bright", "clean", "airy",
     "moody", "warm", "modern", "professional". Those are not requests for a camera position or a
     light source; the brand rules and the scenario table already own tonal preference, and
     admitting them would re-open the menu for nearly every brief and put the pinning back.
     "A bright, airy office" is a mood. "Backlit by a window at golden hour" is a condition.

     MATCHING. Case-insensitive substring match against the ORIGINAL request text, after
     collapsing every run of non-alphanumeric characters to one space on both sides. So
     "over-the-shoulder", "over the shoulder" and "Over The Shoulder," all match the single entry
     `over the shoulder`, and no entry needs punctuation variants. Entries are therefore written
     in that normalised form: lowercase, words separated by single spaces.

     A cue that is a bare single common word is a hazard (it fires on unrelated prose), so
     single-word entries are only used where the word has no ordinary non-photographic reading in
     a visual-asset brief: `overhead`, `backlit`, `silhouette`, `dusk`. `shadows` and `bright`
     are deliberately absent for exactly that reason.

     Both sections must be non-empty, and every entry must be unique across BOTH sections: a cue
     appearing in both would open both axes from one phrase, which is the opposite of the
     separation the two-axis design is built on. uds-moderator's treatmentCues.test.ts and
     scripts/check-treatment-cues.mjs both assert that, derived from this file. -->

# Treatment request cues

## camera

- over the shoulder
- over shoulder
- from behind
- top down
- top down view
- from above
- from below
- overhead
- bird s eye
- birds eye
- aerial view
- eye level
- low angle
- high angle
- close up
- closeup
- extreme close
- macro
- wide shot
- wide angle
- establishing shot
- medium shot
- long lens
- telephoto
- shallow depth of field
- side on
- in profile
- profile view
- through a doorway
- through the doorway
- framed by
- point of view
- first person view
- looking down at
- looking up at
- head and shoulders
- headshot
- waist up
- full body
- three quarter view
- shot from
- seen from
- viewed from
- camera angle
- camera position

## lighting

- golden hour
- blue hour
- dusk
- dawn
- sunrise
- sunset
- at night
- night time
- nighttime
- after dark
- backlit
- back lit
- rim light
- silhouette
- silhouetted
- against the light
- harsh sun
- hard sun
- direct sunlight
- sunlit
- sun streaming
- overcast
- cloudy day
- grey sky
- rainy
- in the rain
- window light
- light from the window
- through the blinds
- skylight
- studio lighting
- studio light
- softbox
- high key
- low key
- candlelit
- by lamplight
- lamp light
- neon
- firelight
- backlighting
- lit from
- colour grade
- color grade
