<!-- THE ACCEPTANCE RUBRIC. Read by image-svc's buildRubric (src/gate/visionGate.ts), which
     selects `## `-level sections per brief and delivers the rest verbatim with HTML comments
     stripped — so this block is author-only and never reaches the grading model. A heading rename
     here is a CONTRACT BREAK: visionGate.ts matches these strings literally, logs at ERROR and
     falls back to the whole body, and visionGate.profile.test.ts pins them.

     WHY "When a display is in frame" EXISTS, and why it is written as a FORK and not a demand.
     Measured 2026-09-24 on image-output-avatardevice, craftProfile=minimal, requestId
     avdev-device v1: the planner's own feature said "The screen displays a clean, minimal
     dashboard interface", the frame delivered a flat grey field carrying ghost wireframes and a
     "LOADING DATA 66%" bar, and the gate scored it 1.0. The demand WAS in the rubric — buildRubric
     interpolates `brief.feature` verbatim — so the failure was not blindness to the brief. There
     was simply no check that pointed the critic AT the screen; "The subject matches the brief" is
     satisfied by the laptop, the person and the room, and the screen went unjudged.

     THE OPPOSITE ERROR IS THE REASON FOR THE FORK. craft-plausibility.md SUPPRESSES on-screen
     content on purpose whenever the geometry cannot show it ("a display faces whoever is working
     it ... Otherwise it sits blank, dim or washed by glare"). A blanket "screens must show
     content" check would fail exactly the frames that rule makes correct — on one earlier arm 15
     of 24 failing gate reasons complained a phone screen was blank, content that rule had removed
     deliberately. So the first bullet is the ESCAPE and it comes first: the critic settles the
     geometry from the pixels before it is allowed to want content. That determination is left to
     the critic and not made in code on purpose — it is a fact about the delivered frame, not about
     the brief, and no predicate over `brief.feature` can see it. A regex over prose deciding it
     would be the resolveNegativeSpaceSide defect class: a requirement manufactured out of free
     prose, wrong on the runs it matters for.

     VOCABULARY IS DELIBERATELY SHARED WITH craft-plausibility.md — "blank, dim or washed by
     glare", "unmarked casing in one flat colour" — so the critic and the author cannot disagree
     about what the correct suppressed screen looks like. Nothing here states a preference the
     corpus does not already state; see the acceptance-not-direction warning below.

     THE THIRD BULLET IS THE BACK-SURFACE CLASS, pooled 8.3% over 84 frames
     (image-output-screenback/MEASUREMENTS.txt) in four forms: UI printed on a back, a logo or
     graphic on a lid, a glowing field as casing, both faces at once. All four are named as ONE
     property of a casing surface rather than as four examples, because that file also records the
     negativePrompt listing all four forms as DISPROVEN at n=36. It is phrased so a legitimately
     plain lid cannot fail it: the fault is content ON the surface, never the surface itself. -->

# Shared quality gate

What a generated image is judged on. These are ACCEPTANCE checks, not style direction — the gate
must never express a preference the brand rules do not, because its reasons are fed back into the
next craft attempt and any preference stated here becomes a convergence pressure.

## Always
- The subject matches the brief.
- No garbled text, watermarks, logos, or UI artifacts.
- Brand palette adherence: the image reads as plausibly on-brand. Do NOT penalise a scene for its
  colour temperature, time of day, or lighting mood — the brand photoreal rule owns those and
  deliberately varies them.

## Cutout only
- The subject looks natural and believable (realistic skin, hair, wardrobe, lighting). Brand tones
  may appear in wardrobe or props but the PERSON need not be brand-coloured — never penalise
  natural human colouring.
- Clean, matte-able silhouette against a plain, uncluttered background.

## When a screen-content reference was supplied
- The device's screen shows a crisp, legible, detailed interface — clearly the focal on-screen
  content, not blank, generic, placeholder, cropped-off or garbled.

## When a display is in frame

The pipeline does not always ask for on-screen content, and where it does not, a blank screen is the
intended result — so settle which case this frame is before judging the screen at all.

- FIRST work out which face of each device the camera is looking at, and say which one. A display
  and its keys face the same way. So if a lid stands between the camera and the keys — you see the
  lid's outside while the keys, the trackpad and the operator's fingers are hidden behind it or
  reach around its far edge — you are looking at the OUTER SHELL and the display's face is turned
  away from you. Only if the keys lie between you and the lid are you looking at the display's face.
  A hand or a face being visible past the device decides nothing.
- A display faces whoever is working it, held or resting on a desk alike. Where its face is turned
  away from the camera, a screen that sits blank, dim or washed by glare is CORRECT, and so is a
  frame in which no screen face appears at all. Do not penalise it and do not ask for content on it.
  This clause OVERRIDES "the subject matches the brief" for the screen's content alone: on-screen
  content the brief described but the viewpoint cannot show was suppressed deliberately, it is not a
  mismatch with the brief, and it must not be reported as one or lower the score. Everything else
  the brief asks for is still judged as usual.
- Where the camera CAN see the face, the screen must carry what the brief named and must read as
  that thing: a discernible LAYOUT, meaning distinct regions, panels or controls separated at
  ordinary contrast. Abstraction is expected and is not a fault — an unbranded, text-free,
  greyscale or single-hue layout satisfies this whenever the layout itself can be made out. What
  does not satisfy it is an undifferentiated field, shapes so faint that no layout can be read off
  the screen at all, a blur, a loading or progress state sitting where the content should be, or a
  display whose face is toward the camera but pushed off the frame edge. Never ask for readable text
  or for a particular colour on a screen: the brand rules forbid the first and own the second.
- IN EVERY CASE content belongs only on a display's own face. An outer shell, lid or rear is
  unmarked casing in one flat colour, so an interface, screen graphic, colour field, pattern or logo
  carried on the surface you identified as the shell, a second lit face on one device, or one device
  drawn with two displays, is a fault.
