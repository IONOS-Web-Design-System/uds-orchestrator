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
and result (interaction) or the background device (state). No type named: infer it with this test.

Type: a process — something arrives, is forwarded, is sent, or turns into something else — is a **story**; the user doing something to the product — upload, connect, add, drag, click — is an **interaction**; a lasting claim — secure, compliant, included, every night — is a **state**. A user action wins over a process, a process over a claim.

Beats are shares of the duration `D`; times in brackets are the 6 s / 30 fps example (D = 180).
Keep each beat's start frame in a constant `T`.

## Story — a morph with a climax

A COPY of the element that triggers the feature leaves it, winds up and turns into the result
where the result lives. The trigger stays and every other piece rests as designed, so the end
frame is the designed picture.

| Beat | Share (6 s) | What happens |
|---|---|---|
| Settle | 0–12% (0–0.7 s) | the pieces arrive, staggered |
| Build-up | 13–43% (0.8–2.6 s) | 1–2 devices: 3–4 pulses, each gap shorter; the trigger trembles (≤ 4% scale, a fast `Math.sin` growing with the tension) or races (hands spin on an ease-in); halos tighten 8–10%; the glow intensifies |
| Climax | 43–58% (2.6–3.5 s) | ONE morph: the trigger squeezes to ~0.8 (8 frames, ease-in) and releases on the snap curve; the result overshoots to ≥ 1.15, lands at exactly 1; 1–2 shock rings burst (scale to 2.4–3, opacity ~0.85 → 0); non-text satellites recoil 8–12px outward and back; the glow moves to the result |
| Release | 58–75% (3.5–4.5 s) | the rings die out; the result plays (call bars, a pulse on to the next satellite); the rest dims slightly |
| Hold | final ≥ 1 s | still; the glow breathes, ambient motion on non-text layers only |

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
const SNAP = Easing.bezier(0.2, 1.8, 0.4, 1); // overshoots ~18%, ends at exactly 1
const c = T.climax, snap = interpolate(frame, [c + 8, c + 24], [0, 1], { easing: SNAP, ...clamp });
const trigger = frame < c + 8
  ? interpolate(frame, [c, c + 8], [1, 0.8], { easing: Easing.in(Easing.cubic), ...clamp })
  : 0.8 + 0.2 * snap; // the squeezed trigger rebounds
const result = 0.1 + 0.9 * snap; // the copy (shown from c + 8): peaks ~1.16, lands at 1
```

A box morph on `snap` overshoots ~18% of its size change: start it from the small disc.

**Liquid neck** (split): a white capsule `div` from one centre toward the other (its width the
distance travelled, rotated to their angle, `transformOrigin: '0 50%'`), thinner as they part,
gone at 80–95% of the travel.

## Interaction — a UI animation

- Simplified UI, never a product window: one card, list, slot, button or grid.
- ONE cursor acts on ONE control: travel 12–24 frames (move curve), press down 3–4 frames and
  back 6–8 (the control changes state on the press frame); it leaves after the result.
- Beats: settle 0–15%; the cursor acts 15–50%; the results land 50–75%; hold the final ≥ 1 s.
- One pattern:
  - **Drag and drop:** the cursor presses the item, carries it, and releases it over the slot;
    the slot highlights while the item is over it. A non-text item may morph its box to fit the
    slot; a text-bearing item is dragged by translate only — no scale or box morph while its
    text shows.
  - **Press → state morph:** the label fades, the button shrinks into a spinner, the spinner
    becomes a check.
  - **Results pop into place,** staggered 5–8 frames: appointments into a grid; an upload bar
    fills, then a check.
- No climax burst, no shock rings: the payoff is the result landing with a small pop.

## State — an icon story with background motion

- The central icon (a brand product icon or a system icon on a white disc) arrives once, then
  holds absolutely still, as do the satellites and labels. No climax, no pulse on the icon.
- Its glow is a static blurred halo; only its opacity breathes, softly.
- Only the background moves: white, low contrast, behind the cluster. Pick 1–2 devices:
  - **ripples**: rings expanding from behind the icon, opacity ≤ 0.16
  - **particles**: 4–8px dots drifting, opacity 0.15–0.4
  - **dot field**: a dot grid twinkling in a slow diagonal wave, opacity 0.08–0.3
  - **dot orbit**: 2–3 small dots circling on a faint ring
  - **light sweep**: a large blurred white circle (not a glow), opacity ≤ 0.1; static blur, only
    its position moves
- Seamless loop: every period divides the duration (`P = D / n`, n whole).

```tsx
const P = D / 2; // ripples i = 0, 1, 2 share one period
const ripple = (i: number) => { const p = ((frame + (i * P) / 3) % P) / P;
  return { transform: `scale(${0.8 + 1.6 * p})`, opacity: 0.16 * (1 - p) * Math.min(1, p * 6) }; };
// each: a 2px white ring centred behind the icon
```

## Shared rules

- There is only one blurred glow layer, ever: a static blur whose opacity and position move. At
  a story's climax it moves to, or re-targets onto, the result; never two glowing at once. Shock
  rings, halos, press ripples and the liquid neck are not glows: white, unblurred, transient,
  fading to 0.
- Text appears only after its shape has landed, then never moves; the one exception is an
  interaction's clamped drag. A result's text (a summary card's lines) fades in once it lands;
  non-text bars may keep moving.
- Overshoot (pop, snap) only on non-text layers, never on a text-bearing element once its text
  shows. Recoil only on non-text satellites: discs, and bubbles holding only skeleton bars.
  Text-bearing satellites and labels never recoil.
- On a transparent or light canvas, shock rings and background devices take `--text-base` at the
  same opacities instead of white.
- In a hybrid the photo card is the central object of every type and holds still; the morph, the
  cursor or the background acts around it.
- A story needs ≥ 5 s (durations run 4–12 s); when shorter, shorten the build-up, never the
  climax or the hold.
- **Brand product icons.** In a story or a state, the central object or a satellite may be the
  brand's full-colour product icon on a white disc, when the card is about a specific product or
  process (backups, mail, the AI phone assistant). The brief says "the brand product icon for
  <concept>"; resolve it in the product tier of the `# Icon name index`. Never recolour or redraw
  it; a colour morph acts on its disc. An interaction keeps filled system icons, as do glyphs
  inside discs, buttons and UI pieces.

## Still renders

A still of the same brief draws the type's end frame, so the Hold must be exactly that picture:
- story: the result after the climax, the trigger in place, the rings gone
- interaction: the result landed, the cursor gone
- state: the icon with its background at rest
