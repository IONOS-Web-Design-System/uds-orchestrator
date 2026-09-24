<!-- CHARACTER SEMANTICS — two decisions about the person in the frame that no other rule owned:
     (1) WHICH MOMENT of a problem story gets photographed, and what that leaves on the face;
     (2) WHETHER a person is in the frame at all, and how prominent they are.

     Applies to EVERY brand. Neither is a differentiator: a resolved moment is not more IONOS than
     Strato, and an unpeopled workshop is not more home.pl than either. Do not restate either
     section in a brand rule — the brand files point here, the same single-home arrangement
     `shared-natural-moment.md` has for the candid-moment rule.

     WHY A CRAFT RULE AND NOT ONLY A PLANNER RULE. The moment is chosen upstream and that is where
     the main fix lands: measured on 9 frames of one abstract German brief about missed enquiries,
     the PLANNER wrote the distress itself — negative-affect words reached `sceneContext.who` and
     `sceneContext.engagement` on 6 of 9, and the craft model reproduced them near-verbatim in its
     own output prompt. (The words themselves are NOT quoted here. Comments are stripped for
     `minimal` only, so on `full` this block reaches the model, and quoting them would hand over
     exactly the vocabulary the section below forbids — the same reason the brand files stopped
     quoting their own banned phrases. `uds-moderator-ctx/src/plan/sceneAffect.ts` holds the list,
     in code, where it is a detector rather than an example.) A craft rule alone would be arguing
     with three explicit upstream instructions. It is still not redundant: image-svc is callable
     with no planner, `sceneContext` is optional, and the FACE is craft's decision in any case —
     the planner is told to write the situation and the body and to leave the expression alone,
     precisely so it cannot hand the craft model a literal expression string to copy.

     THE NEGATIVE BASELINES ARE NOT THE MECHANISM. All three brands already veto two failure modes
     of the face and it did nothing here: a negative prompt cannot contradict a positive prompt
     that names an unhappy expression outright. Neither the distress words nor their opposites
     belong in that list — an expression veto there is the Task 5b defect class (an absolute veto
     in the harder channel) one hop sideways. The fix is positive and it is here.

     Comments are stripped by the loader on `minimal`: author-only, no instruction. -->

# The person in the frame — which moment, and whether they are in it

## When the situation is a problem, photograph it dealt with

Marketing copy states a problem because the product removes it. The problem is why the image
exists; it is not the moment to photograph. A frame showing the difficulty still happening
illustrates the reader's bad day and advertises nothing.

When the situation is a loss, a pressure, a pile-up, a risk, a wait or something going unanswered,
photograph the moment **after** it was handled: the blocked work going ahead, the person free to
do what they would rather be doing, the thing that was demanding attention now quiet and set down.
Keep the unresolved difficulty out of the frame entirely — no stalled task, no untouched pile, no
demand still waiting, nobody cut off from something they need. **The resolved moment is the
subject**, not a detail inside a picture of the problem.

## The situation decides the expression — nothing else does

An expression is a consequence. Write the situation, read the face off it, and let the register be
whatever that situation honestly produces:

- **quiet** — absorbed, unhurried, at ease, simply not under pressure. Right for most resolved
  moments, and the one that gets skipped.
- **warm** — the small involuntary look of somebody who just got something right.
- **bright** — open laughter, but only when the frame contains the cause: another person, a shared
  remark, something genuinely relieving happening now.

Never write a face the situation does not support, and it fails in BOTH directions: a face
carrying the difficulty (strained, downcast, worried, harried) when the difficulty is not in the
frame, and a held display of happiness with nothing in the frame causing it. **Brightness is
earned by the situation or it is not used** — raising the register is never the fix, moving the
MOMENT is.

## Whether a person is in the frame, and how prominent

A person is not mandatory. Decide from whose story the image tells, and take exactly one position:

- **hero** — a person is the subject; their attention, posture and expression carry the frame.
  Choose it when the point is somebody's own experience of the thing.
- **background** — a person is in the frame but is not the subject: further into the room, turned
  away, clipped by the frame edge, behind or beside whatever the subject is, or reduced to a pair
  of hands. Still a specific real person, with the identity rules applying in full; they simply do
  not carry the frame. Choose it when the subject is the place, the object or the work.
- **none** — nobody in the frame. Choose it when the point is the place, or a thing carrying on
  without anyone needing to watch it.

Scenario-driven, never a coin toss, and twice already settled: a cutout of a person is always
**hero**, and a brief whose named subject is a person or a role is never **none**.

<!-- How far prominence may go, and where it stops. Every optical property of the frame belongs to
     the camera axis, so "background" above is expressed as PLACEMENT and STAGING only — where the
     figure stands, which way it faces, what crosses in front of it, how much of it the frame
     keeps. Asking for an optical treatment of that figure would be this file taking a camera
     decision, the exact conflict the ruleset exists to remove; the injected camera line decides
     how the placement actually renders. The user's own wording for this item reached for an
     optical treatment, and it is deliberately not carried here for that reason. None of those
     properties is NAMED in this file, in the prose or in this comment: `stripComments` is gated
     on `craftProfile === 'minimal'` in image-svc's prompt.ts, so on `full` a comment naming one
     hands the model the phrase it is not supposed to have. -->

### An unpeopled frame is a place in use, not an idle product shot

There is one way to get **none** wrong and the brands' baselines already refuse it: a device
sitting by itself, switched on, doing nothing, in a frame arranged around it. A deliberate
unpeopled scene is a different thing, and the difference is **evidence of use**: the frame must
read as a room somebody just left or is about to come back to, told by what they left mid-use
rather than by a person. Whatever the scenario already puts in that room should look set down
where it was being used rather than arranged for the photograph, and part-finished rather than
finished. Then the subject is the place and the work going on in it, and the objects are part of
that rather than the point of it.

<!-- Deliberately states the PROPERTY and not a list of objects. `shared-scenario-props.md` is the
     single home for prop objects; a trace list here would be a second, competing one, and the
     first draft's four bullets were three keyed nouns. -->
