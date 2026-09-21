<!-- The scenario prop rule. Applies to EVERY brand and every image type — a prop belongs to the
     SCENARIO, never to the brand and never to a house default.

     This file is the single canonical home for prop selection. The same guidance was previously
     stated in FIVE places that had drifted apart: uds-image/SKILL.md's "Colour & mood via objects"
     bullet, a trade-keyed table in shared-image-type-scene.md, a second table in
     shared-image-type-device-focused.md whose key column mixed places and trades in one column, a
     trade-keyed bullet list in shared-image-type-portrait.md, and a parenthetical in
     shared-image-type-avatar.md. Two rows were near-verbatim duplicates across the two tables. The
     brand files stated their own objects as unconditional decor, which is why one everyday desk
     object turned up in briefs that had nothing to do with it — a rule with no key fires on every
     run. Those brand mandates were removed separately; this file replaces the rest.
     Do not restate any of this in a brand rule, a type rule, or SKILL.md. Point at this file.

     WHY TWO TABLES AND NOT ONE. The scenario carries two independent facts: WHERE it happens and
     WHO is in it. One table keyed on a column holding both — the state this replaces — lets a
     place row reach a brief that only matched on trade, and vice versa. Split, each lookup answers
     only what it knows.

     THE TWO KEYS ARE NOT THE SAME KIND OF KEY, and this matters to anyone extending the file:
       - `place` is a CLOSED ENUM. The caller sends exactly one of the nine values in the first
         table, so that table is a hard lookup — the key either matches a row exactly or the brief
         named no place at all. Add a row only when the enum gains a member; every member must have
         one (image-svc's structural guard checks this against the enum in src/validate.ts).
       - `who` is FREE PROSE, up to 240 characters, written by the planner. It can never be a hard
         lookup, so the second table is a SEMANTIC match you perform by reading — the row labels
         are exemplars, not a closed taxonomy, and "no row resembles this" is a valid outcome with
         a defined behaviour (take nothing from that table). Do not build, or assume, a string
         index over the second table: it would silently match nothing and every prop would come
         from the place row alone.

     A prop noun appears in this file ONLY inside a table row. That is the invariant the whole rule
     rests on — an object named in prose anywhere has no key and therefore fires on every run,
     which is the exact defect this file exists to remove. It is enforced in CI across every rule
     the craft prompt inlines (image-svc src/craft/__tests__/scenarioProps.test.ts), so a prop
     added in a sentence rather than a row fails the build.

     NAMING CONSTRAINT, learned the hard way: name a prop with a word these files do not already
     use photographically. `camera`, `lens`, `card`, `keyboard`, `glasses`, `marker` and `screen`
     all mean something else here (camera angle, a payment card, a content card, the device's own
     keyboard, eyewear, a brand marker, the device screen), so they cannot serve as prop nouns —
     the guard above cannot tell a prop from a homonym. A keyboard and a screen are parts of the
     DEVICE, which the type rules own, not identity props.

     NOT the environment axis. Architecture, surfaces, window character and what populates the
     mid-ground belong to shared-environment-workspace.md / shared-environment-home-office.md,
     which are selected in code per run. Plants, shelving, furniture and flooring are theirs; this
     file owns only the small objects within reach of the subject or the lens. -->

# Scenario props — from the place and the person, never from a default

A prop is the **identity layer**: an everyday object that answers "where is this and whose is
it?" at a glance. When one is in the frame it is chosen from the SCENARIO — never from a brand,
never from a habit, and never carried over from a previous generation.

**A prop is OPTIONAL. Nothing here requires one.** The two tables below are a source of
candidates, not a list of things to include: they say what this place and this person could
plausibly have within reach, and whether any of it is actually in this frame is a decision you
make for this scene. Ask it of each candidate you are considering, one at a time:

- Would this object be here, in this room, during this activity, at this hour?
- Is it where the subject's own task would have left it, or would it have to be placed for the
  photograph?
- Does the frame's composition have somewhere for it to sit that the action does not already
  occupy?

An object that fails any of those does not go in. **A frame with no prop at all is a correct
answer, not an incomplete one** — the place, the work and the person carry it, and a scene whose
action already fills the frame gains nothing from an object added beside it. Where you do include
one, they still come from the **intersection of two lookups** — what the PLACE puts within reach
and what the PERSON brings — and you take **at most one object from each table, one or two
objects in total**: a frame with three or more competing objects reads as clutter, not as
identity.

## Props by place — a hard lookup on the scenario's `place`

Match the brief's `place` value EXACTLY. If the brief names no place, take nothing from this
table. The KEY match is hard — a row that is not this brief's place is not available to it at
all — but what a matched row gives you is a menu of candidates rather than an instruction: the
row says what this place could put within reach, and the three questions above decide whether
any of it is actually in this frame.

| `place` | What the place COULD put within reach |
|---|---|
| `open-plan-office` | a lanyard set down, a stapler, a rolled-up floorplan |
| `home-office` | unopened mail, a tin of pencils, a cork pinboard |
| `meeting-room` | printed handouts, a water carafe, a whiteboard eraser |
| `cafe` | a latte-art cup on a saucer, a spoon on a small plate, a folded newspaper |
| `workshop` | wood shavings, a mallet, a chisel set down mid-job |
| `retail` | a paper carrier bag, a price gun, a ribboned gift box |
| `studio` | a light-stand sandbag, a clapperboard, a fold-out stool |
| `outdoors` | a takeaway cup, a canvas tote, a bicycle handlebar at the frame edge |
| `other` | nothing — the place is unknown, so the person's table carries the frame alone |

## Props by who — a SEMANTIC match on the scenario's `who`

`who` is free prose, so **read it and judge which row it resembles.** The labels are exemplars,
not an exhaustive list of trades, and a matched row is again a menu rather than an instruction.

<!-- NO-MATCH IS NOT HONOURED BY THE MODEL. Measured 2026-08-25, craftProfile=full, `who` both
     ABSENT and set to an unrecognisable string: the model took the same who-row anyway in 4 of 4
     runs each time, reproducing that row's object verbatim. Rewording the instruction below from a
     prohibition into a positive "bring nothing" did NOT change it — still 4 of 4. So this is the
     third place in this pipeline where prose instruction fails to bind (see the environment line at
     ~5% retention, and a brand with no negative baseline getting one invented). The fix has to be
     STRUCTURAL, not editorial: the strongest candidate is to stop inlining this table at all when
     `who` is absent, since a table that is not in the prompt cannot be copied from. Do not "fix"
     this by strengthening the wording again — that has been tried and measured. -->

**When the prose resembles no row, or the brief names no `who` at all: the person brings NOTHING.**
The place table above has already furnished the surface, and in that case its objects are the whole
frame. A surface carrying only the place's own objects is the right answer, not an incomplete one.

| If `who` reads as… | What the person COULD bring |
|---|---|
| a photographer or visual creative | a loupe, a contact sheet, a spare battery |
| a writer, blogger or other knowledge worker | a hardback notebook, a fountain pen, page proofs |
| an online-shop owner | a fabric swatch, a padded envelope, flat-pack mailers |
| a developer or technical operator | a steaming mug, a rubber duck, a coiled patch cable |
| a café, bar or restaurant operator | a service tray, a folded cloth, clean saucers |
| a marketer or agency operator | a highlighter, a pinned mood board, a wall calendar |
| no trade the prose makes out | nothing — the place's table carries the frame alone |

## Resolving the intersection

1. Look up the `place` row. Look up (by reading) the `who` row. Whatever they offer is the
   candidate set, and **the candidate set is the CEILING on what may appear, never a floor.**
2. Put each candidate you are considering through the three questions above. Keep only the ones
   that pass, and **zero passing is an ordinary outcome** — say nothing about props and let the
   place, the work and the person carry the frame.
3. **At most one object from each table, one or two objects in total.** Where both tables offer
   something that passes and you want two, take one from each: that pair is the room and the
   person, not one of them twice.
4. **Neither table resolved** — name no prop at all. An unkeyed object is a house default, and a
   house default is what makes every image look like the last one.
5. Never combine two rows of the same table, and never take an object from a row the scenario did
   not select — a hospitality object in an office brief is the failure this rule exists to prevent.
6. An object the BRIEF itself names is not a prop and none of this governs it: it is content, it
   is in the frame, and it does not count against the two above.

**Every object belongs to exactly ONE of the two tables.** The place table holds what the ROOM
supplies and the who table holds what the PERSON carries; an object listed in both would have two
independent ways to be selected, so it would surface roughly twice as often as everything else —
which is a step back toward the unkeyed default this rule replaces. Measured, not assumed: the two
objects that were briefly in both tables came out the most frequent of all in a live run, one of
them in more than half of them. When deciding which table an object goes in, ask whether it is
still there after the person leaves the room.

**Which object, when a row offers three.** Pick the one that fits this brief's `activity` and
`timeOfDay`, and vary the pick across a set — a row is a menu, not a sentence. Do not reuse the
first entry every time.

## How the prop sits in frame, per image type — where there is one

These describe how to place a prop you have already decided belongs. They are not a reason to
decide one belongs: a `scene` with nothing near the lens is composed on its depth, not on an
object introduced to fill the near field.


- **`scene` and `device-focused`** — the objects sit on the surface CLOSEST to the lens, rendered
  softly out of focus while the subject or the screen stays sharp behind them. This is a depth
  layer: it is what makes the frame read as a photograph rather than a render.
- **`portrait` and `avatar`** — the prop is **held**, so prefer the person's row: a hand-held
  object reads as identity, while surface contact drags the camera down to the hands. The
  held-never-rested encoding is `shared-image-type-portrait.md`'s, and it still governs.

## Colour

Where you have chosen an object, give ONE of them a single strong, saturated colour of your own
choosing rather than a muted neutral — a definite colour reads with far more impact than a beige one, and it
seeds the frame's accent. Choose a colour that suits what the object actually is and this
specific scene. Warm mid-tones tie into most surfaces; the saturated one carries the interest.

## Say it in your own words

Name the objects and their placement in your own phrasing every time. Do not reuse a fixed
sentence shape between generations — a repeated sentence template is the single strongest
homogeniser measured in this pipeline, and a prop list is where it takes hold first.
