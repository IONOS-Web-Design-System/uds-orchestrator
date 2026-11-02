# StratoStage

The STRATO corporate stage as a fixed, Figma-measured template: two boxes, two powders and the
character (a cutout), entering with one fixed motion ("option B"), plus an optional interface that
pops up over the character. It is the `strato-stage` pattern, a sibling of `product-pop-out`:
that one places a floating prompt over a photo, this one owns the whole stage.

| File | What it is |
|---|---|
| `geometry.ts` | The pure numbers: Figma poses, the fit into the canvas, the character anchor, the interface slots. |
| `motion.ts` | The option-B motion as pure functions of time (`layerMotion`), the timeline, `FPS`. |
| `layers.ts` | `buildStageLayers(input, tMs)`: geometry + motion in canvas px, bottom to top. Pure. |
| `StratoStage.tsx` | The Remotion component: maps the layer list onto `<Img>`s and mounts the interface. |

None of the first three imports React, the DOM or `remotion`, so they are tested without a
renderer (`__tests__/`). `StratoStage.tsx` renders only DOM and `<Img>` (no canvas, WebGL or
video), so a later SVG capture of the DOM sees every layer.

Geometry is closed; content is open; placement is external. Poses, the fit, the paint order and
the motion are not props: the props are enumerated, so an attempt to reach inside is a compile
error. The content is the three image paths, the character's measured bbox and the interface
node. The placement is the canvas and `safeArea`, supplied by the caller (the moderator).
Import specifiers carry no file extension (Remotion's bundler cannot resolve `.js` to `.ts`;
enforced tree-wide by `product-pop-out/__tests__/importSpecifiers.test.ts`).

## Props

| Prop | Type | Notes |
|---|---|---|
| `canvas` | `{ w, h }` | The caller's `dimensions` (hybrid range 320-1920 x 256-1080) |
| `safeArea` | `{ right, bottom }` | Transparent margin as canvas fractions; `{ right: 0.32, bottom: 0.22 }` as product-pop-out. Default: none |
| `metrics` | `StageMetrics` | Measured alpha bbox of the character cutout (the moderator's `CutoutMetrics`). Default: `DEFAULT_METRICS`, a plausible 3:4 portrait, not a Figma measurement |
| `srcs` | `{ box, powder, character }` | `staticFile()` paths: the box export, the powder export, the character cutout |
| `iface` | `{ kind, legW, legH }` | Omit for no interface. `kind` is `'live-app'` or `'feature-highlight'`; `legW` x `legH` is the interface leg's canvas (`interfaceLegDims`) |
| `interfaceNode` | `ReactNode` | The interface content, laid out at `legW` x `legH` CSS px. With `iface` but no node, nothing is painted for it |
| `interfaceDurationInFrames` | `number` | The interface's own animation length (90 for its 3 s). Leave unset for a still interface |

The layers are clipped to the content box: the canvas minus the `safeArea` margin on the right and
bottom. The 672 x 610 visual frame is fitted with contain into it, bottom-anchored and
horizontally centred (`fitStage`). Paint order, bottom to top: `boxBack`, `boxFore`,
`powderBack`, `character`, `powderFore`, then `interface`.

## Where every number came from

Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`. All rects and poses are in visual units (the
672 x 610 frame); only `fitStage` knows the canvas.

| Value | Source |
|---|---|
| Visual frame 672 x 610 | component `663:4371` (`strato-stage-visual`), placed in `663:8787` as instance `I663:8787;8762:18733` |
| Box side 558, export 638, stage side 559.19 | component `663:8966` (`strato-box-fore`, page `asset/strato`); 559.19 is the box as rendered in `663:8787` |
| `boxBack` centre (564.002, 315.415), 173 deg | `663:8787`, its `663:8966` instance. Rendered at `638 * 559.19 / 558` square |
| `boxFore` centre (563.78, 340.414), 15 deg | `663:8787`, its second `663:8966` instance |
| Powder image 1548.856 x 885.223 | component `663:8718` (`powder-mid`, page `asset/strato`): the image fill's size in its export |
| `powderBack` centre (822.994, 370.458), 8.934 deg | `663:8787`, its `663:8718` instance. Figma reports the raw image mirrored at 171.066 deg; relative to the export that is 8.934 deg unmirrored |
| `powderFore` centre (705.323, 600.561), -18 deg, mirrored | `663:8787`, its second `663:8718` instance |
| Character anchor: head top 22, subject 661 tall, centre x 480 | `663:8787` (the character, waist-cropped) |
| `feature-highlight` slot (90.2, 328.3, 384.7 x 78.3) | `663:9895`, the prompt slot inside `663:9864` (the stage with an AI prompt over the character) |
| Face-safe band (0.34 x 610 tall, 0.02 x 672 pad) | the moderator's `popOutGeometry.ts` (`FACE_SAFE_H`, `FACE_SAFE_PAD`) applied to this frame |
| `safeArea` `{ right: 0.32, bottom: 0.22 }` | as `product-pop-out` |
| Motion curves, timings, offsets | the picked mockup `stage-b-transparent.html`, option B (table below); the mockup's eyeballed positions and rotations are superseded by the Figma poses above |
| `DEFAULT_METRICS`, the `live-app` slot | **not Figma**: see the note below |

The interface leg is 2x its slot, raised to 320 x 180, never with both sides at or under 512, and
capped at 1920 x 1080 (`interfaceLegDims`). The composite mounts it at half scale centred on the
slot (`interfaceMountRect`), nudged below the face-safe band when it would cover the face.

## Motion

The settled stage carries the Figma pose and nothing else: every pattern is exactly identity
(`translateY 0, rotateDeg 0, scale 1, opacity 1`) once its progress reaches 1. `translateY` is in
visual units, scaled to px by the fit. Opacity is a ramp of the same progress `p`.

| Layer | Pattern | Start / duration (ms) | Motion | Opacity |
|---|---|---|---|---|
| `boxBack` | rotate in | 0 / 500 | outCubic: rotate -38 deg to 0, scale 0.82 to 1 | `p * 3` |
| `boxFore` | rotate in | 100 / 500 | outCubic: rotate +34 deg to 0, scale 0.82 to 1 | `p * 3` |
| `powderBack` | pop | 300 / 450 | outBack s=1.4: scale 0.35 to 1 (overshoots: peak 1.046) | `p * 2.5` |
| `character` | slide up | 420 / 550 | outQuart: translateY 0.28 x 610 = 170.8 to 0 | `p * 2` |
| `powderFore` | pop | 650 / 450 | outBack s=1.4: scale 0.35 to 1 | `p * 2.5` |
| `interface` | pop up | 850 / 450 | outBack s=1.7: translateY 0.043 x 610 = 26.23 to 0, scale 0.72 to 1 | `p * 2.5` |

Everything has settled at 1350 ms (frame 41), which is also when the interface's own animation
starts (`INTERFACE_ANIM_START_MS`). Output is 30 fps: 4 s with no interface or a still interface,
5 s with an animated one (its own animation is 3 s: 1.35 s to 4.35 s). Frame 0 is empty and
transparent. The last frame is held; there is no loop.

## The interface layer

`StratoStage` wraps `interfaceNode` in a `legW` x `legH` CSS px box and scales it by
`rect.w / legW` (one half), so the node lays itself out exactly as it did in its own leg.

* Before frame 41 (1350 ms) the node is frozen at its frame 0:
  `<Sequence width height layout="none"><Freeze frame={0}>`. From frame 41 it runs in
  `<Sequence from={41} width height layout="none">`.
* **Verified, remotion 4.0.467:** `<Sequence>` accepts `width` / `height`
  (`dist/cjs/Sequence.d.ts:19-20`), stores them in its `SequenceContext`
  (`dist/cjs/Sequence.js:77-78`), and `useVideoConfig()` inside it returns them in place of the
  composition's (`dist/cjs/use-unsafe-video-config.js:21-22`). So the node sees the leg's size and
  no wrapper is needed. With `layout="none"` the Sequence adds no `AbsoluteFill` of its own
  (`Sequence.js:229`).
* `interfaceDurationInFrames` becomes the Sequence's `durationInFrames`, so
  `useVideoConfig().durationInFrames` inside the node is what its own composition saw. A bounded
  Sequence unmounts its children after its last frame, so the component holds that last frame
  with `<Freeze>` rather than letting the interface vanish.

## Provisional: the live-app slot

`feature-highlight` is measured (`663:9895`). `live-app` is **provisional**: there is no Figma
node for it yet, so its slot (40, 250, 380 x 285: left of the character at chest height) follows
the spec's description of `663:9864` / `663:9453` and is not a measurement. Replace it when
`663:9453` is opened. `DEFAULT_METRICS` is likewise a plausible portrait, not a measurement; it
only applies when a cutout was never measured.
