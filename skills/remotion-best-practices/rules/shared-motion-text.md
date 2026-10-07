# Motion & text-rendering rules (always applies)

These rules apply to every animated Remotion composition.

## Fade-in animations — always ease opacity, match duration to transform

Linear opacity looks like a flash. Derive `opacity` and `transform` from the **same eased
progress variable** so they move in sync; never interpolate opacity separately with different
timing. Minimum fade duration: **20 frames** (0.67s at 30fps).

```tsx
const progress  = interpolate(frame, [0, 25], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
const opacity    = progress;                                    // shares easing
const translateY = interpolate(progress, [0, 1], [20, 0]);     // driven by same value
```

## Typing / text reveal animations — always use .slice(), never per-character opacity

**Always use string slicing for typewriter effects. Never use per-character or per-word
opacity** (spans reflow and jitter), and never a clipPath wipe (reads as a reveal, not typing).

**The slice index MUST stay within `[0, text.length]` — clamp BOTH ends.** A negative index
makes `text.slice(0, n)` count from the END: a delayed typing beat shows garbage before its
start frame, then hard-cuts to empty and re-types. `Math.min(length, …)` only caps the top; also
floor at 0 (`extrapolateLeft: 'clamp'` AND `Math.max(0, …)`).

**The typing cursor must be ZERO-WIDTH** (`display: 'inline-block', width: 0, overflow:
'visible'`), blinked via `opacity` — never conditionally mounted (`{show && <span>▌</span>}`
toggles width, so the trailing word wraps and "jumps").

**Typing into a UI field is the kit's job:** `<KitInput value={typedText} caret={Math.floor(frame / 16) % 2 === 0} />`
(an AI prompt: `KitPromptBar`; a site search: `KitSearchInput`)
with the clamped slice below as `value`. The recipe below is for free text outside a field.

```tsx
// Typing that starts AFTER an entrance (e.g. frame 20): clamp BOTH ends.
const typedCount = Math.max(0, Math.min(
  text.length,
  Math.floor(interpolate(frame, [20, 55], [0, text.length],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
));
const typedText = text.slice(0, typedCount);
const BLINK_FRAMES = 16;
const cursorOpacity = interpolate(frame % BLINK_FRAMES, [0, BLINK_FRAMES / 2, BLINK_FRAMES], [1, 0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

// Multi-line: a visibility:hidden ghost of the FULL text reserves the final height.
<div style={{ position: 'relative' }}>
  <div style={{ visibility: 'hidden', fontFamily: 'Overpass', fontSize: 20, lineHeight: 1.4,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{text}</div>
  <div style={{ position: 'absolute', inset: 0, fontFamily: 'Overpass', fontSize: 20, lineHeight: 1.4,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#001B41', overflow: 'hidden' }}>
    {typedText}
    <span style={{ opacity: cursorOpacity, display: 'inline-block', width: 0, overflow: 'visible' }}>&#x258C;</span>
  </div>
</div>
```

## Text rendering stability — no live transforms on text containers

Text re-rasterizes whenever an ancestor transform changes; sub-pixel offsets read as
**shimmer/jitter** (images interpolate smoothly, text does not).

> **GATE-ENFORCED.** The `text-stability` static gate **fails the build** when a text-bearing
> element's `transform` is driven by a perpetual `Math.sin`/`Math.cos` float **or** by an
> unclamped `spring()` (directly or via `interpolate`). "Text-bearing" = the element's subtree
> renders any readable text (`{label}`, a `<span>`/`<p>`/`<h*>`, a headline, a badge caption,
> a kit component with a label).

**1. Never apply continuous/looping motion to an element that renders text** — a "gentle
float/bob" on a floating label, badge, notification pill, or stat card is the most common
stutter cause. Drift/bob belongs on **image / icon / shape layers only**. If a floating card
contains text, **split it**: float a non-text backdrop layer while the text layer stays static.

```tsx
// ❌ WRONG — a settled label that floats forever
<div style={{ transform: `translateY(${Math.sin(frame / 30) * 4}px)` }}><span>{label}</span></div>

// ✓ CORRECT — float a non-text layer; the text holds still after a clamped entrance that ENDS
<div style={{ transform: `translateY(${float}px)` }}>{/* icon / glow / shape only */}</div>
<div style={{ transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`, opacity: p }}>{label}</div>
```

**2. Springs never settle — clamp them after the entrance.** `spring()` keeps emitting
0.9991 → 1.0003 → … after the visible settle. Snap it, or use a clamped bezier overshoot:

```tsx
const raw = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 120 } });
const settled = raw > 0.995 ? 1 : raw;                     // Option A — snap
const enter = interpolate(frame, [40, 65], [0, 1], {       // Option B (preferred for text cards)
  easing: Easing.bezier(0.34, 1.56, 0.64, 1),              // overshoot, ends at exactly 1
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
```

**3. Scale must rest at exactly 1.0 while text renders.** An entrance may pass through
fractional scales, but it must end at `scale(1)` exactly.

**Sequencing rule:** complete all card transforms first (entrance, scale, settle), THEN start
the typing beat. Never type inside a moving/scaling ancestor.

## Camera moves (zoom + pan) — pan in screen space, keep the subject framed

A "camera" is a `transform` on a wrapper `<div>` combining `scale` and `translate`.

**1. Put `translate()` BEFORE `scale()`.** `scale(s) translate(px)` pans by `px * s` (a 560px
pan at 3.2× moves 1792px and flies the subject out of frame).

```tsx
transform: `translate(${panX}px, ${panY}px) scale(${scale})`   // ✅ screen-space pan
// ❌ `scale(${scale}) translate(${panX}px, ${panY}px)` — or divide the pan by the scale
```

**2. Keep the focal element inside the viewport for the whole move** — its on-screen centre
stays within `0..width` / `0..height` every frame. To follow a moving target (e.g. a typing
caret), compute the pan per frame: `const panX = width / 2 - caretScreenX * scale;`.

**3. Cap the zoom so the subject stays visible:** keep `scale <= VW / W` for a focal element of
width `W` in a viewport `VW`. Prefer restrained pushes (≈1.1–1.8×); reserve larger zooms for a
genuine macro detail, kept centred per rule 2.

**4. Text stability still applies:** hold the zoom steady (constant `scale`) across typing
frames, and only pan by whole-pixel amounts during typing.
