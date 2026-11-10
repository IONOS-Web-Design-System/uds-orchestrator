---
name: motion-choreography
description: Brand-neutral motion grammar for every animated demonstration wireframe — the beats of the story, one timing vocabulary, the pattern menu, and which properties survive the vector export. Replaces ionos/micro-animations.md. Beat, cursor and Ken Burns ideas adapted from iart-ai/ecommerce-video-skills (MIT); property and timing ideas from iart-ai/web-animation-skills (MIT).
metadata:
  tags: animation, motion, timing, easing, choreography
motion: [animation]
---

# Motion choreography (every animated wireframe)

Applies to every animated demonstration wireframe — every brand, every canvas size. Brand rules
add their own AI moments on top (the PromptWindow motion, `<brand>/ai-animations.md` where one
exists). Typing, fades and text stability: remotion-best-practices `shared-motion-text.md`
(always in effect). All motion is driven by `useCurrentFrame()`; CSS transitions/keyframes fail
the eslint gate, and no animation library is available (no GSAP, Framer Motion or Lottie player).

## 1. One story, told in beats

An animation shows ONE thing happening: the feature from the brief acting. Plan the beats, write
their start frames as constants at the top of the component, then build:

| Beat | Share of the duration | Job |
|---|---|---|
| Settle | first ~15% (≥ 12 frames) | the frame and its static content arrive; nothing else moves |
| Act | ~35% | the feature does its thing — the click, the typing, the toggle, data travelling |
| Result | ~25% | the effect lands where the action happened — the highlight pops, the status flips, the count lands |
| Hold | the final ≥ 25% (≥ 1 s) | the story is complete and still; only ambient motion on non-text layers may continue |

```tsx
const { fps, durationInFrames: D } = useVideoConfig();
const T = { settle: 0, act: Math.round(D * 0.15), result: Math.round(D * 0.5), hold: Math.round(D * 0.75) };
```

- **Cause → effect.** The result appears at, or visibly connected to, the spot where the action
  happened: the clicked control changes; a flow line ends where the next icon lights up.
  Unrelated parallel motion reads as noise.
- **One focus at a time.** Move the camera OR the cursor OR one element group — never two
  competing motions at once. Stagger related elements 4–8 frames apart instead of starting them
  together.
- **The motion comes from the concept.** Pick the move that says what the brief says — sync:
  something travels between two devices and arrives; backup: a restore point is laid down and
  confirmed; security: a lock closes; generate: content types in. Do not put the same float or
  grow on every brief.
- **Restraint.** Animate only what serves the story, never the background or unrelated chrome.
  Budget by canvas:

| Canvas | Animated sequences (besides entrances) | Floating highlights |
|---|---|---|
| Small (both sides ≤ 512px) | 1 | 1–2 |
| Medium | 2 | 1–2 |
| Large / wide | 2 | 2–3 |

- With `loop: true`, follow this render's loop rule (last frame = first frame); the Hold beat
  still comes before the loop returns.

## 2. One timing vocabulary

Every curve goes through `interpolate(frame, [start, end], [from, to], { easing, ...clamp })`
with `const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;`.

| Motion | Easing | Frames at 30 fps |
|---|---|---|
| Entrance (arrive and settle) | `Easing.bezier(0.16, 1, 0.3, 1)` | 16–24 (an opacity fade ≥ 20) |
| Pop / emphasis (chip, badge, check) | `Easing.bezier(0.34, 1.56, 0.64, 1)` — overshoots, ends at exactly 1 | 12–18 |
| Move (cursor travel, camera push, a card changing place) | `Easing.bezier(0.45, 0, 0.55, 1)` | 12–24 |
| Press / click feedback | down in 3–4 frames, back in 6–8 | 9–12 |
| Exit (rare) | `Easing.in(Easing.cubic)`, faster than the entrance | 10–14 |
| Ambient (icon float, ring pulse) | `Math.sin(frame / p)` on NON-text layers only | period p ≥ 10 (≥ 60-frame cycle) |

- **One entrance curve** for every entrance in the composition — consistency reads as confidence.
- **Never linear** on anything the viewer reads or tracks.
- Derive opacity and transform from the **same** progress value.
- A spring never settles exactly — use the clamped bezier rows above for anything near text.

## 3. Animate what the export keeps

The animation ships as a vector SVG captured from the rendered frames. These animate cleanly:
`transform` (translate / scale / rotate), `opacity`, a box's position and `width`/`height`,
background colour, and text content (typing, a count-up).

Do NOT animate:
- `boxShadow`, `filter`/blur, `backdropFilter`, `mixBlendMode` — static shadows are fine; to lift
  a card, translate the card and fade in a second, static-shadow layer behind it;
- anything inside an inline `<svg>` (a path's `d`, `strokeDashoffset`, SVG attributes) — wrap the
  icon in a `div` and animate the `div`; draw a growing line as a `div` whose `width` grows;
- a `<canvas>` — it is frozen at its last frame.

## 4. The pattern menu

Pick from these; each names the beat it belongs to.

**Entrance cascade (Settle).** Elements arrive once on the entrance curve, staggered, then hold
still — safe for text-bearing elements:

```tsx
const enter = (start: number, dur = 20) =>
  interpolate(frame, [start, start + dur], [0, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1), ...clamp });
const arrive = (start: number) => {
  const p = enter(start);
  return { opacity: p, transform: `translateY(${(1 - p) * 16}px)` };
};
```

**Cursor click (Act).** A pointer travels to the control, presses, and the control changes state
on the SAME frame as the press; a ring ripples out once. The pointer glyph is a `div`-wrapped
arrow icon (or a drawn arrow); only the wrapping `div` moves:

```tsx
const travel = interpolate(frame, [T.act, T.act + 18], [0, 1], { easing: Easing.bezier(0.45, 0, 0.55, 1), ...clamp });
const x = from.x + (to.x - from.x) * travel, y = from.y + (to.y - from.y) * travel;
const press = interpolate(frame, [T.act + 18, T.act + 21, T.act + 28], [1, 0.92, 1], clamp);
const clicked = frame >= T.act + 21;                       // the control's new state starts here
const ripple = interpolate(frame, [T.act + 21, T.act + 39], [0, 1], { easing: Easing.out(Easing.cubic), ...clamp });
// ripple ring: transform `scale(${0.4 + ripple})`, opacity 1 - ripple, border in the brand's interactive colour
```

**Typing / generation (Act).** A clamped `.slice()` into a drawn field (shared-motion-text), or
placeholder bars whose `width` grows one after another on the entrance curve.

**State flip (Act → Result).** A toggle, checkbox or status chip changes state: cross-fade the
old and new state in the same place over 8–12 frames, then pop the new state's icon. Keep the
element mounted so the eye tracks one object (a spinner becomes a check; "Pending" becomes "Active").

**Highlight pop (Result).** The floating highlight — a status card, a stat, an icon badge —
pops in on the pop curve AFTER the action it reports, straddling the frame's cut edge or beside
the motif it belongs to.

**Count-up (Result).** A number counts to its final value over ≤ 20 frames, ending exactly on it,
in `fontVariantNumeric: 'tabular-nums'` so the digits do not jitter.

**Flow (Act, icon stories).** A small dot travels along a straight connector by `translate`
(move curve), arrives, and only then does the target light up (pop or state flip). Rings pulse
outward by `scale` + `opacity` on non-text layers.

**Camera push (Act).** One push toward the feature region on the frame's wrapper — ≤ 1.6×,
`transformOrigin` at the region — per the camera rules in shared-motion-text; hold the scale
steady while anything types.

**Card press (Act).** One lift and settle — translate the card 4–6px up and back, fade the
static-shadow layer behind it — never in a loop when the card holds text.

**Ambient (Hold).** A gentle bob or float on non-text icon and shape layers only, each with its
own period so they drift out of sync.

**Photo slot (hybrid images).** A photo inside the composition (a floating image card, a media
slot) may push in slowly — `scale` 1.0 → 1.08 across the whole duration on the move curve,
`transformOrigin` at the subject — on the image only, never on text over it.
