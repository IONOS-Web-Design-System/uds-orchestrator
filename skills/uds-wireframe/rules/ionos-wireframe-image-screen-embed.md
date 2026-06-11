# Embedding an animated interface into a generated image's device screen

Applies when the brief contains a `[HYBRID EMBED CONTRACT]` section naming a catalog
asset and (usually) a `screenQuad`.

## Layering

1. Full-bleed background: the named catalog image via `staticFile()`, `objectFit: 'cover'`,
   inside an `<AbsoluteFill>`. The composition root MUST have an explicit opaque
   `backgroundColor` (transparent backgrounds render black in mp4).
2. Screen surface: the interface must fully cover the magenta screen region — render the
   UI on an opaque surface (e.g. `--neutral/cool-grey-100` or the brand light surface),
   never translucent.
3. The interface is a normal UDS wireframe composition, designed at a fixed logical size
   (e.g. 800×600), then perspective-mapped onto the quad.

## Mapping the UI onto `screenQuad`

`screenQuad` is `[[x,y],[x,y],[x,y],[x,y]]` — TL, TR, BR, BL corners, normalized 0..1
against the full canvas. Compute a CSS `matrix3d` that maps the unit square onto it:

```tsx
// Projective map: unit square -> arbitrary convex quad (normalized coords scaled to px).
function quadToMatrix3d(quad: [number, number][], W: number, H: number): string {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad.map(([x, y]) => [x * W, y * H]);
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
canvas. Verify visually with the still gate: frame 0 must show the UI inside the device,
no magenta visible at any edge.

## When there is no quad

If the contract says to place the interface "as a prominent side asset", split the canvas:
image on one side (`objectFit: 'cover'`), the animated interface as a flat card on the
other — standard wireframe composition rules apply.
