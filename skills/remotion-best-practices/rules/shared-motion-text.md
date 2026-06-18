# Motion & text-rendering rules (always applies)

These rules apply to every animated Remotion composition. They are split out of the main
SKILL.md for size, but are always in effect.

## Fade-in animations — always ease opacity, match duration to transform

Linear opacity looks like a flash. Always apply the same easing to `opacity` as to the
accompanying `transform`. Minimum fade duration for premium pacing: **20 frames** (0.67s at 30fps).

```tsx
// ❌ WRONG — linear opacity flashes; transform eases but opacity doesn't
const opacity   = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
const translateY = interpolate(frame, [0, 15], [20, 0], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight: 'clamp' });

// ✓ CORRECT — same easing on both, 20+ frame window
const progress  = interpolate(frame, [0, 25], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
const opacity    = progress;                                    // shares easing
const translateY = interpolate(progress, [0, 1], [20, 0]);     // driven by same value
```

Derive both `opacity` and `transform` from the **same eased progress variable** so they are
guaranteed to move in sync. Never interpolate opacity separately with different timing.

## Typing / text reveal animations — always use .slice(), never per-character opacity

Per the official Remotion text-animations skill: **always use string slicing for typewriter
effects. Never use per-character opacity** (per-word spans cause reflow and jitter).

**The slice index MUST stay within `[0, text.length]` — clamp BOTH ends.** A negative index
makes `text.slice(0, n)` count from the END of the string, so a typing beat that starts on a
later frame renders a garbled partial string BEFORE its start frame, then hard-cuts to empty
at the start frame and re-types — a "double-typing" / hard-dissolve jitter. `Math.min(length, …)`
only caps the top; you MUST also floor at 0 (via `extrapolateLeft: 'clamp'` AND `Math.max(0, …)`).

**The typing cursor must be ZERO-WIDTH so it never reflows the text.** A normal inline cursor
adds width the ghost does not reserve, so at the end of a line the trailing word wraps when the
cursor shows and un-wraps when it hides (or when typing ends) — the last word "jumps". Give the
cursor `display: 'inline-block', width: 0, overflow: 'visible'` and blink it via `opacity` —
never by conditionally mounting it (`{show && <span>▌</span>}` toggles width → wrap jitter).

```tsx
// ✓ CORRECT — typing from frame 0, single .slice() node, stable layout
const CHAR_FRAMES = 2;                     // frames per character
const BLINK_FRAMES = 16;                   // cursor cycle length

const charCount = Math.min(
  text.length,
  Math.floor(frame / CHAR_FRAMES),
);
const typedText = text.slice(0, charCount);

// ✓ CORRECT — typing that starts AFTER an entrance (e.g. frame 20): clamp BOTH ends so the
// index can never go negative before the start frame.
const delayedCount = Math.max(0, Math.min(
  text.length,
  Math.floor(interpolate(frame, [20, 55], [0, text.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
));
const delayedText = text.slice(0, delayedCount);

// Cursor blink — frame-driven opacity cycle
const cursorOpacity = interpolate(
  frame % BLINK_FRAMES,
  [0, BLINK_FRAMES / 2, BLINK_FRAMES],
  [1, 0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
);

// ⚠ Multi-line containers: reserve final height with a visibility:hidden ghost so the
// layout height never changes as lines wrap during the reveal.
<div style={{ position: 'relative' }}>
  {/* Ghost: reserves the full text's layout height — prevents container-height jitter */}
  <div style={{ visibility: 'hidden', pointerEvents: 'none',
                fontFamily: 'Overpass', fontSize: 20, lineHeight: 1.4,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
    {text}
  </div>
  {/* Overlay: renders the sliced text in the reserved space */}
  <div style={{ position: 'absolute', inset: 0,
                fontFamily: 'Overpass', fontSize: 20, lineHeight: 1.4,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#001B41',
                overflow: 'hidden' }}>
    {typedText}
    {/* Zero-width cursor: never reflows the trailing word; blink via opacity, never by mounting */}
    <span style={{ opacity: cursorOpacity, display: 'inline-block', width: 0, overflow: 'visible' }}>&#x258C;</span>
  </div>
</div>

// ❌ WRONG — per-word span opacity causes reflow
// ❌ WRONG — clipPath wipe looks like a reveal, not typing
// ❌ WRONG — full-width inline cursor or {show && <span>▌</span>}: adds width the ghost lacks,
//    so the last word wraps/clips when the cursor shows and un-wraps when it hides or typing
//    ends — the trailing word "jumps". Use the zero-width cursor above.
// ❌ WRONG — delayed typing missing extrapolateLeft / Math.max(0,…): the index is negative
//    before frame 20, slice(0,-n) shows trailing garbage, then hard-cuts to "" and re-types:
//    Math.min(text.length, Math.floor(interpolate(frame, [20, 55], [0, text.length], { extrapolateRight: 'clamp' })))
```

## Text rendering stability — no live transforms on text containers

Text glyphs re-rasterize whenever their ancestor transform changes — each sub-pixel offset
produces different antialiasing, which reads as **shimmer/jitter**. Images interpolate
smoothly at sub-pixel offsets; text does not. Three rules:

> **GATE-ENFORCED.** The `text-stability` static gate **fails the build** when a text-bearing
> element's `transform` is driven by a perpetual `Math.sin`/`Math.cos` float **or** by an
> unclamped `spring()` (directly or via `interpolate`). "Text-bearing" = the element's subtree
> renders any readable text (`{label}`, a `<span>`/`<p>`/`<h*>`, a headline, a badge caption).
> This is not advisory — code that violates it will not render.

**1. Never apply continuous/looping motion to an element that renders text — applies to ALL
text, not just typing.** This is the single most common stutter cause: a "gentle float/bob"
(`transform: translateY(${Math.sin(frame/30)*4}px)`) on a floating label, badge, notification
pill, or stat card. A 4px sine = ~0.13px/frame, so every glyph re-rasterizes every frame for
the entire shot. Drift/bob belongs on **image / icon / shape layers only**. If a floating card
contains text, **split it**: float a non-text backdrop layer while the text layer stays static.

```tsx
// ❌ WRONG — a settled label that floats forever → perpetual glyph shimmer
const float = Math.sin(frame / 30) * 4;
<div style={{ transform: `translateY(${float}px)` }}><span>{label}</span></div>

// ✓ CORRECT — float a non-text layer; the text card holds still after entrance
<div style={{ transform: `translateY(${float}px)` }}>{/* icon / glow / shape only */}</div>
<div style={{ transform: `translateY(${enterY}px)` }}>{label}{/* enterY settles to 0 */}</div>

// ✓ ALSO FINE — the whole card enters once on a frame-driven curve that ENDS and holds
const p = interpolate(frame, [0, 25], [0, 1], { easing: Easing.bezier(0.16,1,0.3,1), extrapolateRight: 'clamp' });
<div style={{ transform: `translateY(${interpolate(p,[0,1],[20,0])}px)`, opacity: p }}><span>{label}</span></div>
```

**2. Springs never settle — clamp them after the entrance.**
`spring()` asymptotes toward 1, emitting 0.9991 → 1.0003 → 0.9998… for dozens of frames
after the visible settle. Scale/translate driven by an unsettled spring keeps text
re-rasterizing. Either snap to the exact rest value, or use the bezier overshoot curve
(per the official timing guidance) which terminates exactly when clamped:

```tsx
// Option A — snap the spring once visually settled
const raw = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 120 } });
const settled = raw > 0.995 ? 1 : raw;

// Option B (preferred for text-bearing cards) — bezier overshoot, exact terminal value
const enter = interpolate(frame, [40, 65], [0, 1], {
  easing: Easing.bezier(0.34, 1.56, 0.64, 1),   // spring-like overshoot, ends at exactly 1
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
```

**3. Scale must rest at exactly 1.0 while text renders.**
Glyph hinting at scale 0.97 differs from scale 1.0. An entrance may pass through fractional
scales, but the animation must end with `scale(1)` exactly — and typing must not start
until the container's transform has reached its terminal values.

**Sequencing rule:** complete all card transforms first (entrance, scale, settle), THEN
start the typing beat. Overlapping a typing animation with a moving/scaling ancestor is
the most common cause of typography jitter.
