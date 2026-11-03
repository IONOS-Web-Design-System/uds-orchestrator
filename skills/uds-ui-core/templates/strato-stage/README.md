# StratoStage

The STRATO corporate stage as a fixed, Figma-measured template: the
character (a cutout) sliding up, plus an optional floating interface that pops up over it (two
layers; the fixed box and powder layers were dropped, amendment 2026-11-03). It is the `strato-stage` pattern, a sibling of `product-pop-out`:
that one places a floating prompt over a photo, this one owns the whole stage.

| File | What it is |
|---|---|
| `geometry.ts` | The pure numbers: the Figma visual frame, the fit into the canvas, the character anchor, the interface slots. |
| `motion.ts` | The option-B motion as pure functions of time (`layerMotion`), the timeline, `FPS`. |
| `layers.ts` | `buildStageLayers(input, tMs)`: geometry + motion in canvas px, bottom to top. Pure. |
| `styles.ts` | `layerStyle(layer)`, `interfaceLegStyle(rect, leg)`: the inline styles of the layers. Pure (a React type only). |
| `StratoStage.tsx` | The Remotion component: maps the layer list onto an `<Img>` and the interface and mounts the interface. |

None of the first four imports the DOM or `remotion` (`styles.ts` imports one React type), so they
are tested without a renderer (`__tests__/`). `StratoStage.tsx` renders only DOM and `<Img>` (no canvas, WebGL or
video), so a later SVG capture of the DOM sees every layer.

Geometry is closed; content is open; placement is external. The fit, the paint order and
the motion are not props: the props are enumerated, so an attempt to reach inside is a compile
error. The content is the character image path, the character's measured bbox and the interface
node. The placement is the canvas and `safeArea`, supplied by the caller (the moderator).
Import specifiers carry no file extension (Remotion's bundler cannot resolve `.js` to `.ts`;
enforced tree-wide by `product-pop-out/__tests__/importSpecifiers.test.ts`).

## Props

| Prop | Type | Notes |
|---|---|---|
| `canvas` | `{ w, h }` | The caller's `dimensions` (hybrid range 320-1920 x 256-1080) |
| `safeArea` | `{ right, bottom }` | Transparent margin as canvas fractions; `{ right: 0.32, bottom: 0.22 }` as product-pop-out. Default: none |
| `metrics` | `StageMetrics` | Measured alpha bbox of the character cutout (the moderator's `CutoutMetrics`). Default: `DEFAULT_METRICS`, a plausible 3:4 portrait, not a Figma measurement |
| `srcs` | `{ character }` | `staticFile()` path of the character cutout |
| `iface` | `{ kind, legW, legH }` | Omit for no interface. `kind` is `'live-app'` or `'feature-highlight'`; `legW` x `legH` is the interface leg's canvas (`interfaceLegDims`) |
| `interfaceNode` | `ReactNode` | The interface content, laid out at `legW` x `legH` CSS px. With `iface` but no node, nothing is painted for it |
| `interfaceDurationInFrames` | `number` | The interface's own length in frames, what its own composition had (90 for its 3 s), for a still leg too. Inside the node `useVideoConfig().durationInFrames` is this in every phase. Must not exceed the stage's own length (120 / 150) |
| `interfaceMotion` | `'still'` \| `'animated'` | How the interface leg was rendered. Default `'animated'`. See "The interface layer" |

The layers are clipped to the content box: the canvas minus the `safeArea` margin on the right and
bottom. The 672 x 610 visual frame is fitted with contain into it, bottom-anchored and
horizontally centred (`fitStage`). Paint order, bottom to top: `character`, then `interface`.

Every layer is styled `max-width: none; max-height: none` (`layerStyle`). The compose workspace
imports Tailwind, whose preflight `img, video { max-width: 100%; height: auto; }` otherwise caps
each `<Img>` at the content box's width: an inline `width` cannot beat `max-width`, so a wide
cutout's character is squeezed or stretched. The character is also `object-fit: contain` at
`50% 0`, so a cutout placed with `DEFAULT_METRICS` is letterboxed rather than stretched.

## Where every number came from

Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`. All rects are in visual units (the 672 x 610
frame); only `fitStage` knows the canvas.

| Value | Source |
|---|---|
| Visual frame 672 x 610 | component `663:4371` (`strato-stage-visual`), placed in `663:8787` as instance `I663:8787;8762:18733` |
| Character anchor: head top 22, subject 661 tall, centre x 480 | `663:8787` (the character, waist-cropped) |
| `feature-highlight` slot (90.2, 328.3, 384.7 x 78.3) | `663:9895`, the prompt slot inside `663:9864` (the stage with an AI prompt over the character) |
| Face-safe band (0.34 x 610 tall, 0.02 x 672 pad) | the moderator's `popOutGeometry.ts` (`FACE_SAFE_H`, `FACE_SAFE_PAD`) applied to this frame |
| `safeArea` `{ right: 0.32, bottom: 0.22 }` | as `product-pop-out` |
| Motion curves, offsets (0.28 x 610, 0.043 x 610) | the picked mockup `stage-b-transparent.html`, option B; the timings are the 2026-11-03 amendment (controller's call) |
| `DEFAULT_METRICS`, the `live-app` slot | **not Figma**: see the note below |

The interface leg is 2x its slot, raised to 320 x 180, never with both sides at or under 512, and
capped at 1920 x 1080 (`interfaceLegDims`). The composite mounts it at half scale centred on the
slot (`interfaceMountRect`), nudged below the face-safe band when it would cover the face.

## Motion

The settled stage carries the Figma position and nothing else: every pattern is exactly identity
(`translateY 0, scale 1, opacity 1`) once its progress reaches 1. `translateY` is in visual
units, scaled to px by the fit. Opacity is a ramp of the same progress `p`.

| Layer | Pattern | Start / duration (ms) | Motion | Opacity |
|---|---|---|---|---|
| `character` | slide up | 0 / 550 | outQuart: translateY 0.28 x 610 = 170.8 to 0 | `p * 2` |
| `interface` | pop up | 450 / 450 | outBack s=1.7: translateY 0.043 x 610 = 26.23 to 0, scale 0.72 to 1 (overshoots) | `p * 2.5` |

Everything has settled at 900 ms (the interface's pop-up, 450 + 450; frame 27). The interface's
own animation starts then (`INTERFACE_ANIM_START_MS` = 900, frame 27). Output is 30 fps: 4 s with
no interface or a still interface, 5 s with an animated one (its own animation is 3 s: frames 27
to 116, 0.9 s to 3.9 s). Frame 0 is empty and transparent. The last frame is held; there is no
loop.

## The interface layer

`StratoStage` wraps `interfaceNode` in a `legW` x `legH` CSS px box that clips (it is the leg's
canvas) and scales it by `rect.w / legW` (one half) from its top-left (`interfaceLegStyle`), so
the node lays itself out exactly as it did in its own leg.

Which of its own frames it shows (`interfacePhase(frame, 27, interfaceDurationInFrames,
interfaceMotion)`, pure, `motion.ts`):

| `interfaceMotion` | Stage frames | Interface frame shown |
|---|---|---|
| `'animated'` | 0 to 26 (pop-in) | 0, frozen |
| `'animated'` | 27 to 27 + d - 1 (27 to 116 for d = 90) | `frame - 27`, playing |
| `'animated'` | after that (117 on) | d - 1, held: the last frame stays, the interface never vanishes |
| `'still'` | every frame, pop-in included | d - 1: the frame its own still gate validated (ruling R23) |

d is `interfaceDurationInFrames`. Without it a still shows frame 0 and an animated one plays on
unbounded. Nothing depends on the stage's length: in a 4 s (120-frame) stage an animated 90-frame
interface has played out by frame 116 and holds frame 89 on the last stage frame.

It is ONE element tree in every phase, so the node never remounts:
`<Freeze frame={shown}><Sequence durationInFrames={d} width={legW} height={legH} layout="none">`.

* **Verified, remotion 4.0.467 (and the same in 4.0.529):** `<Sequence>` accepts `width` /
  `height` (`dist/cjs/Sequence.d.ts`), stores them in its `SequenceContext` (`Sequence.js`), and
  `useVideoConfig()` inside it returns them in place of the composition's
  (`use-unsafe-video-config.js`). So the node sees the leg's size and no wrapper is needed. With
  `layout="none"` the Sequence adds no `AbsoluteFill` of its own.
* The Sequence's context duration (what `useVideoConfig().durationInFrames` returns inside) is
  `max(0, min(composition duration - from, durationInFrames))` (`Sequence.js`). A Sequence
  `from={27}` would therefore report 93, not 90, for a 90-frame interface in the 120-frame stage.
  So the Sequence starts at 0 (it reports d whenever the stage is at least d long), and the
  stage frame is mapped onto the interface's own frame by the always-active `<Freeze>`, which
  sets the timeline to `shown` and zeroes the cumulated offset (`freeze.js`): `useCurrentFrame()`
  inside is exactly `shown`, always within the Sequence's 0 .. d - 1, so it stays mounted.
* d must not exceed the stage's own length: remotion clamps the timeline to the composition.

## Provisional: the live-app slot

`feature-highlight` is measured (`663:9895`). `live-app` is **provisional**: there is no Figma
node for it yet, so its slot (40, 250, 380 x 285: left of the character at chest height) follows
the spec's description of `663:9864` / `663:9453` and is not a measurement. Replace it when
`663:9453` is opened. `DEFAULT_METRICS` is likewise a plausible portrait, not a measurement; it
only applies when a cutout was never measured.
