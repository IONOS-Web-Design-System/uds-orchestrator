<!-- The candid-moment rule. Applies to EVERY brand — this is a general photographic quality,
     not a brand differentiator. It was previously stated in two places (uds-image/SKILL.md's
     "Make characters DYNAMIC" bullet and the retired shared-environment-storytelling.md's
     "Dynamic, in-the-moment capture" section) and, for a while, a third: strato-image-style.md
     framed it as Strato-exclusive by contrasting it against a "still, settled" IONOS. That framing
     was wrong — a frozen pose does not become correct for IONOS just because Strato is livelier.
     This file is now the single canonical home. Do not restate it in a brand rule. -->

# Natural moment — a candid frame, not a held pose

The image should read as a **photograph taken mid-moment**, not a subject waiting for the
shutter. This is what makes an image look real rather than staged, and it applies to every
brand equally.

## Put the subject in the middle of something

Catch them mid-action rather than posed: walking mid-stride, laughing mid-task, turning,
reaching, pouring, gesturing, setting something down. Concretely, prefer any of these over a
squared-up stance:

- hands mid-gesture, or in contact with a real object rather than resting
- a forward lean, or weight clearly on one foot
- a half-turn toward something outside the frame
- sleeves pushed up, a chair turned at an angle, a jacket over a chair back
- eyeline following the action rather than meeting the lens
- a limb carried away from the body — an arm up, a hand out, a reach across — caught at
  the top of the movement rather than back at rest

**A moment in progress beats a held pose.** The subject should look like they just moved, or
are about to.

## Where the attention goes

<!-- ITEM 6, part 1. From `479-15032` — a woman at a window counter, torso angled away and head
     turned back, laughing at somebody the frame does not contain, her phone set down on the ledge
     and not in use. This file already said where the attention is NOT (the lens) without saying
     what it can usefully be ON. Measured gap: across 36 audited frames the subject looked at a
     screen, at their own hands, or downward, and never at a person.
     TWO HAZARDS IN THAT FRAME ARE EXCLUDED and are deliberately not named anywhere in this
     file, comments included: one illuminated wall fitting that carries a printed word, and one
     piece of red wall-mounted safety equipment. Both are set dressing, and the first is a
     lettering risk. Naming either — even in a comment — reproduces it, because comments are
     stripped for `minimal` ONLY: a `full` prompt delivers this block verbatim. -->

A viewer should be able to say what is happening from the eyelines and the arrangement alone,
before reading a single object. So send the attention somewhere specific:

- **onto the thing being handled** — the work, the tool, the material
- **onto another person inside the frame**
- **out of the frame, to somebody the picture does not contain** — the strongest of the three for
  a single subject: it implies a second person without a second body, and it lets the torso stay
  angled one way while the head turns back the other, the most legible candid posture there is

It must never rest on the lens, or on nothing.

**A device in the frame is not automatically what the attention is on.** When the subject has
handed something off — a job now running without them, a message already answered — their
attention belongs on a person or on the next piece of work, and the device sits where they put it
down, screen dark and unheld. A subject staring at a screen is the default this displaces.

## More than one person: give each of them a different job

<!-- ITEM 6, part 2. From `498-34` — one man on his feet at a wall-mounted writing surface,
     something in one hand and the other mid-gesture; two seated with laptops, both turned to
     him, one listening with a hand at his temple; a fourth person clipped by the left edge to a
     knee and a shoe. The situation is readable from posture and attention with no object
     identified at all.
     NO measured baseline to improve on: none of the 36 audited frames contained more than one
     person, so this is a capability the ruleset never described.
     EXCLUDED and not named anywhere in this file: that writing surface carries legible
     handwritten column headings and ~two dozen written notes, and one laptop lid shows its
     manufacturer's mark. A rule that names either gets it.
     NO PROP NOUNS AND NO NAMEABLE BRANDS OR OBJECTS ANYWHERE IN THIS FILE, comments included, on
     two independent grounds. (a) `shared-scenario-props.md` is the single home for prop objects
     and `scenarioProps.test.ts` scans every injected rule for its keyed vocabulary WITHOUT
     stripping comments; three nouns in the first draft were caught that way, one of them only in
     a comment. (b) comments are stripped for `minimal` only (prompt.ts gates it on the profile),
     so on `full` this block is delivered to the model word for word. Both were found by
     characterSemantics.test.ts going red on this very comment. -->

Two people doing the same thing side by side is a duplicate, not a scene. Differentiate by ROLE:

- one **leads** — on their feet, gesturing, explaining, at the front of the arrangement
- the others **receive** — seated, turned toward the one leading, hands on their own work, one
  listening with a hand somewhere on their own head

The arrangement is legible exactly when every attention line converges on one point. A figure
clipped by the frame edge — a shoulder, a knee, a forearm — is a complete role in itself: presence
with no part to play. Prefer one of those to a further whole body.

Whatever a group is gathered around is the riskiest surface in the frame. Keep it turned, partly
hidden or seen at an angle, carrying shape, block and colour only — never anything a viewer would
try to read.

## Slight natural motion blur — in the motion, never on the face

A touch of motion blur on a moving hand, or on a passing figure in the foreground, reads as a
real photo grabbed in the moment. Keep the hero face **sharp** — for `portrait`, and for `avatar`
whenever a face is visible at all —
especially, where the face is the subject. The blur lives in the movement and in the
surrounding figures, never on the face.

- ✅ `"caught mid-stride, a touch of natural motion blur, candid documentary feel"`
- ✅ `"laughing mid-task, slight motion blur on the moving hand"`
- ✅ `"a blurred passer-by crossing the foreground, the subject sharp and in-the-moment"`
- ❌ a rigid "stand still and smile" frame, arms at sides, facing the lens square-on
- ❌ blur on the hero face, or so much motion blur that the action is unreadable

## What this does NOT mean

- **Not chaos.** One clear action, legible at a glance. A frame busy with several competing
  movements reads as noise, not life.
- **Not a loss of composure.** A composed, authoritative subject can still be mid-gesture —
  `settled` describes their bearing, not their stillness. Brands whose tone is calm and
  confident express that through bearing, pace and posture, not by freezing the subject.
- **Not a licence to override framing.** An injected `Photographic camera:` line still owns
  shot size, height, angle and lens; this rule only governs what the subject is *doing* inside
  that framing.
