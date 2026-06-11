# Embedding an animated interface with a generated catalog image

Applies when the brief contains a `[HYBRID EMBED CONTRACT]` section. The contract's
`Style:` line names one of two compositing styles — follow the matching section below:

- `Style: screen-embed (punch-through compositing)` → [screen-embed](#style-screen-embed-punch-through)
- `Style: floating-panel` → [floating-panel](#style-floating-panel)

## Style: screen-embed (punch-through)

The catalog image has been chroma-keyed: its device-screen area is **transparent**. The
image goes ON TOP, the interface goes BELOW it, and the interface shows through the
transparent hole. The layering order is the whole trick — get it exactly right:

1. **Layer 1 (bottom)** — the composition root with an explicit opaque
   `backgroundColor` (transparent roots render black in mp4).
2. **Layer 2** — the animated UDS interface inside an absolutely-positioned **opaque**
   container placed at exactly the contract's `screenBoxPx`:
   `left: x, top: y, width: w, height: h`, `overflow: 'hidden'`, and an opaque surface
   background (e.g. `--neutral/cool-grey-100` or the brand light surface). The box is
   deliberately larger than the visible screen hole — **never shrink it**. Keep the
   headline, buttons, and other critical content within the middle 90% of the box.
3. **Layer 3 (top, LAST child)** — the keyed catalog image via `staticFile()` inside an
   `<AbsoluteFill>` with `objectFit: 'cover'` and `pointerEvents: 'none'`.
   **DO NOT put any UI above this layer.**

```tsx
<AbsoluteFill style={{ backgroundColor: '#0b2a63' /* explicit opaque root */ }}>
  {/* Layer 2: interface, oversized box, opaque, clipped */}
  <div style={{
    position: 'absolute',
    left: screenBoxPx.x, top: screenBoxPx.y,
    width: screenBoxPx.w, height: screenBoxPx.h,
    overflow: 'hidden',
    backgroundColor: 'var(--color-surface)', // opaque, never translucent
  }}>
    {/* the animated UDS interface */}
  </div>
  {/* Layer 3: keyed image is the FINAL, full-bleed top layer */}
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    <Img src={staticFile('<slug>.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </AbsoluteFill>
</AbsoluteFill>
```

**Why this works:** the top image masks the interface everywhere except the transparent
screen hole. Overflow outside the device is impossible, and the oversized `screenBoxPx`
gives built-in alignment tolerance — the edges of the box are hidden behind the device
bezel in the image.

Common mistakes:

- **Putting the image below the UI.** That was the old overlay behavior — it is wrong
  now. The image must be the last child / top layer.
- **Adding a `zIndex` that lifts the UI container above the image.** Don't set z-index
  on either layer; rely on document order.
- **Making the UI container translucent.** The surface behind the hole must be opaque,
  or the root background bleeds through the interface.

### Optional perspective refinement (strongly angled screens only)

For near-rectangular `screenQuad`s, plain absolute positioning at `screenBoxPx` (above)
is correct — stop there. Only when the quad is strongly non-rectangular, refine the
interface container with a `matrix3d` perspective transform. Apply it to the interface
container **instead of** the plain box placement; the keyed image stays on top either way.

`screenQuad` is `[[x,y],[x,y],[x,y],[x,y]]` — TL, TR, BR, BL corners, normalized 0..1
against the full canvas. Compute a CSS `matrix3d` that maps the unit square onto it:

```tsx
type Pt = [number, number];
// Projective map: unit square -> arbitrary convex quad (normalized coords scaled to px).
// NOTE: the 4-tuple parameter type matters — the tsc gate runs with
// noUncheckedIndexedAccess, so destructuring a plain Pt[] fails with TS18048.
// Declare the quad literal from the brief with `as const` satisfied by this type:
//   const screenQuad: [Pt, Pt, Pt, Pt] = [[0.3,0.2],[0.6,0.2],[0.6,0.6],[0.3,0.6]];
function quadToMatrix3d(quad: [Pt, Pt, Pt, Pt], W: number, H: number): string {
  const [[nx0, ny0], [nx1, ny1], [nx2, ny2], [nx3, ny3]] = quad;
  const x0 = nx0 * W, y0 = ny0 * H, x1 = nx1 * W, y1 = ny1 * H;
  const x2 = nx2 * W, y2 = ny2 * H, x3 = nx3 * W, y3 = ny3 * H;
  // Solve the 2D projective transform from (0,0),(1,0),(1,1),(0,1) to the quad corners.
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - sy * dx2) / det;
  const h = (dx1 * sy - dy1 * sx) / det;
  const a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + h * y3, f = y0;
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,1)`;
}
```

Usage on a UI container designed at its own logical size:

```tsx
const SCREEN_W = 800, SCREEN_H = 600; // logical UI canvas
<div style={{
  position: 'absolute', top: 0, left: 0,
  width: SCREEN_W, height: SCREEN_H,
  transformOrigin: '0 0',
  // scale logical canvas to the unit square first, then project onto the quad
  transform: `${quadToMatrix3d(screenQuad, width, height)} scale(${1 / SCREEN_W}, ${1 / SCREEN_H})`,
  backgroundColor: 'var(--color-surface)', overflow: 'hidden',
}}>
  {/* the animated UDS interface */}
</div>
```

Note the transform order: `matrix3d` expects unit-square input, so the trailing
`scale(1/SCREEN_W, 1/SCREEN_H)` (applied first, right-to-left) normalizes the logical
canvas. There is no visible magenta to cover anymore — the screen hole is transparent,
and the top image still masks any slight mismatch at the edges.

## Style: floating-panel

The catalog image is the full-bleed **background** layer (`staticFile()`,
`<AbsoluteFill>`, `objectFit: 'cover'`), with the composition root still given an
explicit opaque `backgroundColor`. The animated interface sits on top as a floating
card:

- rounded corners using UDS radius tokens,
- a soft shadow, optionally a subtle glass effect per the decorative-mode rules,
- roughly **40-55% of the canvas width**,
- positioned beside or partially overlapping the imagery **without covering its focal
  subject** (the contract / composition plan says which side).

Standard wireframe composition rules apply inside the panel.

## Verifying

Verify with the still gate: frame 0 must show the interface inside the device screen
(screen style) with no UI visible outside the device, or a clean panel composition over
the imagery (floating style).
