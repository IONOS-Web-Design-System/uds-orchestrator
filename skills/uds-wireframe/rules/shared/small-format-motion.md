---
small: true
motion: [animation]
styles: [plain, opaque-embed]
---

# Small-format motion — three highlight-moment types

Animated small canvases (both sides ≤ 512px), extending `shared/small-format.md`. The entrance,
move and pop curves, press timing, the cursor-click pattern and the export-safe properties:
`shared/motion-choreography.md`.

## Type test

The brief opens `Highlight moment (story|interaction|state): …`. Animate the type it names, even
when the copy seems to say otherwise. Its moment clause names the morph move (story), the control
and result (interaction) or what lands (state). No type named: infer it with this test.

Type: a process — something arrives, is forwarded, is sent, or turns into something else — is a **story**; the user doing something to the product — upload, connect, add, drag, click — is an **interaction**; a lasting claim — secure, compliant, included, every night — is a **state**. A user action wins over a process, a process over a claim.

Beats are shares of the duration `D`; times in brackets are the 6 s / 30 fps example (D = 180).
Keep each beat's start frame in a constant `T`.

## One moment

Every tile animates ONE moment: a story's climax morph, an interaction's press and FIRST result,
a state's landing. Only the moment overshoots, bursts a ring, or carries the glow. Its ring: at
most ONE, a story's shock ring or else a soft ring (opacity ≤ 0.55 → 0).

Everything else is secondary: no overshoot, no ring, no glow, scale changes ≤ 5 %. Entrances fade
in with drift ≤ ~6 px on the move curve, staggered 5–8 frames; connectors draw once; after the
moment nothing pops.

## Story — a morph with a climax

A COPY of the element that triggers the feature leaves it, winds up and turns into the result
where the result lives. The trigger stays and every other piece rests as designed, so the end
frame is the designed picture.

| Beat | Share (6 s) | What happens |
|---|---|---|
| Settle | 0–12% (0–0.7 s) | the pieces fade in, staggered |
| Build-up | 13–43% (0.8–2.6 s) | ONE mild device: 2–3 pulses on the trigger with a tremble ≤ 2 %, or the halos tighten ≤ 6 %; the glow may intensify |
| Climax | 43–58% (2.6–3.5 s) | ONE morph: the trigger squeezes to ~0.8 (8 frames, ease-in) and releases on the snap curve; the result overshoots to ≥ 1.15, lands at exactly 1; ONE shock ring bursts (scale to ~2–2.4, opacity ~0.85 → 0); the glow moves to the result |
| Release | 58–75% (3.5–4.5 s) | the ring fades; the result plays mildly (call bars, a pulse to the next satellite) |
| Hold | final ≥ 1 s | still; only the background device moves |

**Morph moves** (the moment clause names one):
- **unfold**: disc → card (mail disc → summary card)
- **stretch**: disc → pill or bar (a disc from the clock → the live-call pill)
- **split**: node → node through a liquid neck (call node → AI node)
- **settle in**: disc → cell or slot (an appointment into the grid)
- **launch**: the copy leaves on an arc (top offset `-h * Math.sin(Math.PI * t)` over its
  travel `t`), then stretches or unfolds

A body that names two steps may chain two morphs; there is still ONE climax.

**Mechanics.** The morph is one box whose left, top, width, height, border radius and fill
colour interpolate. Old and new icons are separate layers that cross-fade within ≤ 6 frames at
the morph's narrowest point.

```tsx
const SNAP = Easing.bezier(0.2, 1.8, 0.4, 1); // the 16 frames after the squeeze; ends at exactly 1
```

A box morph on the snap overshoots ~18% of its size change: start from the small disc.

**Liquid neck** (split): a white capsule `div` from one centre toward the other (width = the
distance, rotated to their angle, `transformOrigin: '0 50%'`), thinning, gone at
80–95% of the travel.

## Interaction — a UI animation

- Simplified UI, never a product window: one card, list, slot, button or grid.
- ONE cursor acts on ONE control: travel 12–24 frames (move curve), press down 3–4 frames and
  back 6–8; it leaves after the result.
- Beats: settle 0–15%; the cursor acts 15–50%; the results land 50–75%; hold ≥ 1 s.
- One pattern:
  - **Drag and drop:** the cursor presses the item, carries it, and releases it over the slot;
    the slot highlights while the item is over it. A non-text item may morph its box to fit the
    slot; a text-bearing item is dragged by translate only — its scale stays exactly 1 while its
    text shows.
  - **Press → state morph:** the label fades, the button shrinks into a spinner, the spinner
    becomes a check.
  - **Results:** the FIRST result lands with a small pop; further results fade in staggered,
    no pop: appointments into a grid; an upload bar fills, then a check.
- The press ripple is the one soft ring (≤ 0.55); no shock ring.

## State — the icon and its context

A state is an icon story: the icon on its white disc arrives once, then never moves; its context
enters quietly, then holds still. The central-object slot names the layout (`small-format.md`):

| Layout | Secondary motion | The moment |
|---|---|---|
| **badge** | the context's details settle in | the badge lands on the corner |
| **station** | the items hold still, no pulse; each one's marker (check or sync dot) appears in sequence, scale 0.8 → 1, no overshoot (allowed beyond 5 %) | then a check badge lands on the icon |
| **cover** | the dashed dome fades in once (no stroke draw); after the moment, chip markers stagger in, no pop | the glyph completes: cross-fade `filled-lock-open` → `filled-lock`, or `filled-shield` → `filled-shield-checkmark` |
| **centre** (fallback) | none | a small badge lands on the disc's rim, or the glyph completes |

Beats: settle 0–15%, context 15–50% (any travel slow, constant), the moment ~50–60%, hold
≥ 1 s. A badge lands with a pop; a glyph cross-fades in ≤ 6 frames; the glow holds still.

## Background

At most one background device per tile, in every type. White, low contrast, behind the cluster:
- **ripples**: thin rings expanding from behind the central object, opacity ≤ 0.10
- **particles**: 4–8px dots drifting, opacity 0.10–0.20
- **dot field**: a dot grid twinkling in a slow diagonal wave, opacity 0.06–0.18
- **dot orbit**: 2–3 small dots circling on a faint ring, opacity ≤ 0.25 (also a station's time
  device: a faint moon on a dotted arc)
- **light sweep**: a large blurred white circle (not a glow), opacity ≤ 0.06; static blur, only
  its position moves

Slow and seamless: one cycle is `P = D / n` (n whole) with `P ≥ 6 s`, or `P = D` when `D < 6 s`.
It keeps its pace through the moment: no acceleration, flash or sync.

Halo rings (not a device): at most 2, static, 12–18 % opacity, behind a round central object
only; only a story's build-up tightens them, ≤ 6 %.

## Shared rules

- There is only one blurred glow layer, ever: a static blur whose opacity and position move. At
  a story's climax it moves to, or re-targets onto, the result. The moment's ring (at most one),
  the liquid neck and halos are not glows: white, unblurred.
- Text appears only after its shape has landed, then never moves; the one exception is an
  interaction's clamped drag. A result's text (a summary card's lines) fades in once it lands;
  non-text bars may keep moving until the Hold.
- Overshoot (pop, snap) only on non-text layers, never on a text-bearing element once its text
  shows. Nothing recoils.
- On a transparent or light canvas, the moment's ring and the background device take
  `--text-base`, same opacities, not white.
- In a hybrid the photo card is the central object of every type and holds still; the morph, the
  cursor or the background acts around it.
- A story needs ≥ 5 s (durations run 4–12 s); when shorter, shorten the build-up, never the
  climax or the hold.
- **Brand product icons** (when: `small-format.md` section 5): never recolour or redraw one; a
  colour morph acts on its disc. An interaction keeps filled system icons.

## Still renders

A still of the same brief draws the type's end frame, so the Hold must be exactly that picture:
- story: the result after the climax, the trigger in place, the ring gone
- interaction: the result landed, the cursor gone
- state: its layout at rest, the moment landed
