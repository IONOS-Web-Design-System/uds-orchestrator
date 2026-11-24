# StratoStage

The STRATO corporate stage as a fixed, Figma-measured template in three layers, bottom to top
(spec 2026-11-23, `uds-moderator/docs/superpowers/specs/2026-11-23-strato-stage-three-layers-design.md`):

1. the **background**: the generated leg's abstract app frame of the product;
2. the **character** (a cutout), entering with the Figma pop-in of every character component;
3. the **foreground**: the leg's glass card with the one highlighted feature.

One leg run draws both pair layers (inside `product-pop-out`'s `<StagePair>`); the stage mounts it
twice, once per layer. Without an interface the stage is the character alone. A legacy payload
(`live-app` / `feature-highlight`, from a moderator deployed before 2026-11-23) still renders the
two-layer stage of 2026-11-05: the character plus one floating interface over it. It is the
`strato-stage` pattern, a sibling of `product-pop-out`: that one places a floating prompt over a
photo, this one owns the whole stage.

| File | What it is |
|---|---|
| `geometry.ts` | The pure numbers: the Figma visual frame, the fit into the canvas, the character anchor, the placement on the canvas (`placeStage`), the interface slots, the interface leg sizes (mirrors of the moderator's), the pair's character frame and slots (mirrors of `product-pop-out/stagePair.layout.ts`). |
| `motion.ts` | The motion as pure functions of time (`layerMotion`): the background and foreground entrances on the shared entrance curve (`easeEntrance`; the drift capped at `BACKGROUND_DRIFT_MAX_PX`), the Figma character pop-in (`CHARACTER_POP`, `easeOutFigma`), the legacy interface pop-up; the timeline, the legs' release times, `FPS`, `interfacePhase`. |
| `layers.ts` | `buildStageLayers(input, tMs)`: geometry + motion in canvas px, bottom to top (three layers for a pair, the character and a legacy interface otherwise). Pure. |
| `styles.ts` | `stageRootStyle(canvas, content)`, `layerStyle(layer)`, `interfaceLegStyle(rect, leg)`: the inline styles of the root and the layers. Pure (a React type only). |
| `StratoStage.tsx` | The Remotion component: maps the layer list onto the character `<Img>` and the interface mounts (the pair leg twice, a legacy interface once). `renderStratoStage(props, frame, fps)` is its hook-free body. |

None of the first four imports the DOM or `remotion` (`styles.ts` imports one React type), so they
are tested without a renderer (`__tests__/`). `StratoStage.tsx` renders only DOM and `<Img>` (no canvas, WebGL or
video), so a later SVG capture of the DOM sees every layer.

Geometry is closed; content is open; placement is external. The fit, the paint order and
the motion are not props: the props are enumerated, so an attempt to reach inside is a compile
error. The content is the character image path, the character's measured bbox (and
`characterFramed`), and the interface: the pair's `renderInterface(layer)` or a legacy
`interfaceNode`. The placement is the canvas and `safeArea`, supplied by the caller (the moderator).
Import specifiers carry no file extension (Remotion's bundler cannot resolve `.js` to `.ts`;
enforced tree-wide by `product-pop-out/__tests__/importSpecifiers.test.ts`).

## Props

| Prop | Type | Notes |
|---|---|---|
| `canvas` | `{ w, h }` | The caller's `dimensions` (hybrid range 320-2048 x 256-2048) |
| `safeArea` | `{ right, bottom }` | Transparent margin as canvas fractions. The moderator's `STRATO_STAGE` pattern sends `{ right: 0.16, bottom: 0.08 }` (see "Placement"). Default: none |
| `metrics` | `StageMetrics` | Measured alpha bbox of the character cutout, plus its waist row `waistFrac` (the moderator's `CutoutMetrics`). Default: `DEFAULT_METRICS`, a plausible 3:4 portrait, not a Figma measurement. `waistFrac` is optional: without it the subject bbox is scaled as before |
| `srcs` | `{ character }` | `staticFile()` path of the character cutout |
| `iface` | `{ kind, legW, legH }` | Omit for no interface. `kind` is `'pair'` (one leg mounted twice: a background below the character, a foreground above it; see "The pair" under "Placement") or a legacy `'live-app'` / `'feature-highlight'` (one leg over the character, kept for an earlier moderator's payloads); `legW` x `legH` is the canvas the interface leg was rendered at, as the moderator requested it (see "Interface leg sizes") |
| `characterFramed` | `boolean` | `true` when the character is a catalog cutout (`strato-<showroom>-stage`) whose image IS the 971 x 736 character frame. Default `false`: the pair's frame is built from `metrics` (see "The pair"). Passed to `placeStage` as given; only a `pair` reads it |
| `renderInterface` | `(layer: 'background' \| 'foreground') => ReactNode` | The pair (`iface.kind` `'pair'`): the leg for one of its two mounts, called once per layer. Each result is laid out at `legW` x `legH` CSS px in that layer's mount box. The caller makes each mount show only its layer (compose: the leg inside `<StageLayerContext.Provider value={layer}>`). Not called for a legacy kind or a degenerate pair. Without it a pair paints only the character |
| `interfaceNode` | `ReactNode` | LEGACY (`'live-app'` / `'feature-highlight'`): the interface content, laid out at `legW` x `legH` CSS px, mounted once over the character. With a legacy `iface` but no node, nothing is painted for it. A pair ignores it |
| `interfaceDurationInFrames` | `number` | The leg's own length in frames, what its own composition had (90 for its 3 s), for a still leg too. Inside every mount `useVideoConfig().durationInFrames` is this in every phase. Must not exceed the stage's own length (120 / 150) |
| `interfaceMotion` | `'still'` \| `'animated'` | How the leg was rendered. Default `'animated'`. See "The interface mounts" |

The 672 x 610 visual frame is fitted with contain into the content box (the canvas minus the
`safeArea` margin on the right and bottom), bottom-anchored and horizontally centred (`fitStage`).
`placeStage` then places the character and the pair (or a legacy interface) on the canvas (see
"Placement"). Paint order, bottom to top: `background`, `character`, `foreground` for a pair;
`character`, then `interface` for a legacy kind; the `character` alone without an interface.

Every layer is styled `max-width: none; max-height: none` (`layerStyle`). The compose workspace
imports Tailwind, whose preflight `img, video { max-width: 100%; height: auto; }` otherwise caps
each `<Img>` at the content box's width: an inline `width` cannot beat `max-width`, so a wide
cutout's character is squeezed or stretched. The character is also `object-fit: contain` at
`50% 0`, so a cutout placed with `DEFAULT_METRICS` is letterboxed rather than stretched.

## Placement

Spec 2026-11-05 §4.1, decisions 1-4 (`uds-moderator/docs/superpowers/specs/2026-11-05-strato-stage-framing-svg-2k-design.md`),
amended by task C6 on 2026-11-06 (the 8 % bottom margin and the waist on it).
**Ruling R14 ("keep the safe area for now") is superseded on 2026-11-05.** `placeStage(input)`
(geometry.ts) returns every rect in canvas px; `buildStageLayers` uses it as is.

* **Margins live in the moderator pattern.** The template takes `safeArea` as given. The
  moderator's `STRATO_STAGE` pattern sends `{ right: 0.16, bottom: 0.08 }` since 2026-11-06. **The
  8 % bottom margin supersedes the 2026-11-05 rule of no bottom margin (`bottom: 0`).** Before
  2026-11-05 it sent `{ right: 0.32, bottom: 0.22 }` (product-pop-out's, which keeps it). The
  frame's fit scale into the content box is `s`.
* **The waist rule.** Head top to WAIST (`metrics.waistFrac`, which the moderator measures off the
  alpha mask) is `WAIST_SUBJECT_HEIGHT` = 610 - 22 = **588** visual units, so the waist lands
  exactly on the frame bottom, i.e. on the content bottom: the 8 % margin line. The stage root cuts
  there (see "Clipping"), so nothing below the waist is ever visible and the 8 % strip under it stays
  empty. This supersedes the 2026-11-05 rule (661, the Figma's subject height, with the waist 73
  units below the frame bottom): at the same scale the character is 588/661 the size (about 11 %
  smaller) with the same head top, so less of it is cropped. Without `waistFrac` (a moderator older
  than 2026-11-05), or with one at or above the head top, the whole subject bbox is 661 tall and its
  bottom 73 units below the frame bottom, as before.
* **Portrait growth.** The portraitness `p` is 0 while the content box is at least as wide as
  672:610, 1 at 3:4 and narrower, linear between. The character scale is `c = lerp(s, c1, p)`, where
  `c1 = 0.75 x content height / 588` puts the head top 25 % down the content height (the waist on
  its bottom). The head top sits at `content bottom - 588 c` and the centre x at
  `originX + 480 s`; at `p = 0` that is exactly the Figma placement.
* **Never clipped.** The character's measured extent (`leftFrac` / `rightFrac` / `headTopFrac`,
  which include outstretched and raised arms) must lie inside the CANVAS: the right margin
  positions the character, but an arm may reach into it. When it does not fit: if `p > 0`, slide it
  inward by `p` x the shift that would fit it (when it is wider than the canvas, the shift to where
  the least shrink fits it), so nothing jumps as `p` leaves 0; then shrink it about the centre of its
  waist line until it fits, so the waist stays on the content bottom. Landscape (`p = 0`)
  keeps the Figma anchor and only shrinks. The top cannot cross: the head top is at
  `originY + 22 s` at `p = 0` and 25 % down at `p = 1`, and shrinking about the waist only lowers it.
  Never clipped beats every size and position target, the portrait "25 % down" included.
* **A legacy interface** (`live-app` / `feature-highlight`) keeps the frame's scale `s` (its landscape, width-fit size). Its centre keeps the
  slot's offset from the character, per kind: `(character centre x - (480 - slot centre x) s,
  head top + (slot centre y - 22) charScale r)`, the slot from `interfaceSlot(kind, faceSafe)`.
  `r` is 588/661 with a measured waist and 1 without (ruling 2026-11-06): the vertical offset scales
  with the body, so the interface keeps its share of head-to-waist. The AI prompt pill stays at
  chest height (52 % of head-to-waist, as on the Figma's 661 character) instead of sliding to 59 %
  on the smaller 588 body. Its VISIBLE part is the card (a `live-app` or `feature-highlight` leg,
  whose mount is the slot), or the pill for the AI prompt leg (its canvas is
  `promptWindowLeg(slot).canvas`). That visible part is then:
  1. kept inside the canvas width;
  2. kept off the face. The face-safe rect is placed with the character. Where the visible part
     reaches over that rect's width, its top is clamped to at least 8 below the rect's bottom (at
     the character's scale; `interfaceSlot`'s + 8). The push ramps in linearly over the 8 units
     beside the rect's width.
     * The rule is a clamp (`max`), not an on/off nudge, so the card moves continuously where the
       rule meets the band, where the push lets go and where a card starts to reach over the band.
       An on/off version jumped by 8 x the scale, 0.94 % of the height (review C6 fix round 1).
     * For the fixture poses only the provisional `live-app` card ever needs the push; the highlight
       card and the AI pill sit lower;
  3. kept between the canvas top and the line the stage root clips at: the content bottom with a
     bottom margin, else the canvas bottom. It is centred when it is taller than that box. This
     clamp wins over the face nudge, so never clipped beats face-safe, as in `interfaceSlot`.
  The AI prompt leg's transparent glow pad (edge alpha at most 4/255) may run past the canvas
  edge, as it always could (controller ruling, 2026-11-05).
* **The pair** (`iface.kind === 'pair'`, spec 2026-11-23 §1; `placeStage(...).pair`, and `iface` is
  `null`). The character is placed exactly as above; the pair follows it.
  * **The character frame** (`characterFrame`) is the coordinate space of both layers: the 971 x 736
    box of the Figma character component (`CHARACTER_FRAME_ASPECT` = 970.845 / 736.224), which is
    exactly a catalog PNG. A `characterFramed` catalog character's frame is its image box (its image
    bottom is on the clip line, since the moderator sets its `waistFrac` to its `bottomFrac`). A
    generated 3:4 cutout (standalone, or a missing catalog row) gets a virtual frame: its bottom on
    the clip line, the head top `FRAME_HEAD_TOP_OF_H` (1.5 %) of its height below its top, the frame
    aspect, centred on the subject's bbox centre. It reads only the placed head top, subject centre
    and clip line, so it is built the same with or without a measured waist.
  * **The slots** (`PAIR_SLOTS`, fractions of the frame; the medians of the five Figma final comps,
    730:9594): background `{ x 0.14, y 0.13, w 0.50, h 0.42 }`, foreground `{ x 0.12, y 0.24, w 0.31,
    h 0.40 }`. Both mirror `product-pop-out/stagePair.layout.ts`, which lays out the leg; the test
    reads that file.
  * **Clamping** (`placeSlot`). Each slot is kept, on its own, inside `[0, content width] x [0, clip
    line]`: off the left and top edges, out of the right safe area, above the 8 % strip. It moves
    inward by the least at its size. Only when it is larger than that area is it first shrunk about
    its centre, by one factor on both axes. At the acceptance formats (750 x 570, 1280 x 960,
    1600 x 900, 1024 x 1024, 810 x 1080) nothing crosses, so both layers sit exactly where the comps
    put them. Below about 0.62 : 1 (width : height) the foreground crosses the left edge and moves
    right. At about 0.55 : 1 and narrower (592 x 1080, 1024 x 2048) the background is wider than the
    area and shrinks.
  * **Mount boxes** (`layerBox`). `pair.background` / `pair.foreground` are where each mount of the leg
    goes. Each is the whole frame-sized leg, scaled and moved so that its slot lands on the placed
    slot. A slot that fits keeps the frame itself as its box. `buildStageLayers` uses them as the
    `background` / `foreground` rects, and `StratoStage` mounts the leg canvas (`legW` x `legH` CSS
    px, the character frame's aspect) into each, scaled by `box.w / legW` (`interfaceLegStyle`).
  * **A degenerate frame** (not finite, or `h <= 0`) gives no pair (`pair` and `iface` both `null`),
    so the stage is the character alone (controller ruling, 2026-11-23). Only a nonsense mask gets
    there: a no-waist strip (e.g. the subject 30 % of the image tall and its full width) on a tall
    canvas shrinks until its head top is below the clip line (320 x 2048: frame height -48), or an
    empty mask (subject height 0) makes everything NaN or infinite.
* **Clipping.** The stage root (`stageRootStyle`) is the canvas from its top-left down to the
  content bottom. With the 8 % bottom margin it cuts there: exactly at the waist, so nothing of the
  character below the waist shows (the cutout itself runs on below it) and the strip stays empty.
  It never cuts at the right margin. The character is otherwise cut by nothing but the canvas.
  With no bottom margin the root clips nothing; an older moderator's 22 % is cut the same way. Every
  interface mount is cut by its own leg canvas (`interfaceLegStyle`). A pair mount's slot is clamped
  above the root's clip line (the rest of its leg canvas is transparent: `<StagePair>` paints nothing
  outside the slots), and so is a legacy interface's visible part, so no interface content lands in
  the 8 % strip.
* **At `p = 0`** the character keeps the Figma head top (`originY + 22 s`) and centre at 588/661
  the size of the 2026-11-05 rule, with its waist on the content bottom. Every legacy interface keeps the
  frame fit's x and size (`fitStage` + `interfaceMountRect`), and its y is raised by
  `(slot centre y - 22) s 73/661` (55 px for the AI prompt at 1280 x 960). Without `waistFrac`,
  both the character and the interface are exactly as before. The exceptions are:
  * a pose too wide for the canvas shrinks;
  * a card or pill that would cross the canvas edge, or the clip line, moves inside;
  * the `live-app` card is nudged below the face.

  The AI prompt leg keeps the fit's x at 1280 x 960, 1600 x 900 and 1280 x 1024, and its pill is
  inside. At 1280 x 1024 its glow pad runs 20 px past the left edge, as such a pad always could.

| Canvas (`{ 0.16, 0.08 }`) | Content height | `p` | `s` | Narrow pose: scale, head top | Pose 2 %-99 % wide: scale, head top |
|---|---|---|---|---|---|
| 1280 x 960 | 883.2 | 0 | 1.448 | 1.448, 31.9 | 1.373, 75.9 (shrunk) |
| 1600 x 900 | 828.0 | 0 | 1.357 | 1.357, 29.9 | 1.357, 29.9 |
| 1024 x 1024 | 942.1 | 0.536 | 1.280 | 1.238, 214.2 | 1.152, 264.5 (slid, shrunk) |
| 1536 x 2048 | 1884.2 | 1 | 1.920 | 2.403, 471.0 | 1.975, 722.9 (slid, shrunk) |
| 2048 x 2048 | 1884.2 | 0.536 | 2.560 | 2.476, 428.3 | 2.305, 529.0 (slid, shrunk) |

In every row both poses have the waist exactly on the content bottom. (The poses are the test
fixtures in `geometry.test.ts`: head top 0.05 or 0, waist 0.55, of a 1536 x 2048 cutout.)

## Where every number came from

Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`. All rects are in visual units (the 672 x 610
frame); only `fitStage` knows the canvas.

| Value | Source |
|---|---|
| Visual frame 672 x 610 | component `663:4371` (`strato-stage-visual`), placed in `663:8787` as instance `I663:8787;8762:18733` |
| Character anchor: head top 22, subject 661 tall, centre x 480 | `663:8787` (the character, waist-cropped). Since 2026-11-06 the 661 sizes only a cutout with no measured waist |
| `feature-highlight` slot (90.2, 328.3, 384.7 x 78.3) | `663:9895`, the prompt slot inside `663:9864` (the stage with an AI prompt over the character) |
| Face-safe band (0.34 x 610 tall, 0.02 x 672 pad) | the moderator's `popOutGeometry.ts` (`FACE_SAFE_H`, `FACE_SAFE_PAD`) applied to this frame |
| `safeArea` `{ right: 0.16, bottom: 0.08 }` (sent by the moderator) | right: spec 2026-11-05 decision 1 (mockup option C); bottom 8 %: the user's ask after the live test, task C6 (2026-11-06), superseding `bottom: 0`. It was `{ right: 0.32, bottom: 0.22 }` as `product-pop-out` (R14, superseded 2026-11-05) |
| Head top to waist 588 (`WAIST_SUBJECT_HEIGHT`), the waist on the frame bottom | 610 - 22, task C6 (2026-11-06): the user's "less cropped, moved up a bit, shown slightly smaller". It was 661 (the waist 73 below the frame bottom, 22 + 661 - 610, as the waist-cropped character of `663:8787`) on 2026-11-05 |
| Portrait: 3:4, head top 25 % down | spec 2026-11-05 decision 4 (mockup B); the blend between 672:610 and 3:4 is the builder's call (linear) |
| Character pop-in (`CHARACTER_POP`: 847.12 ms, fade 98.22 ms, scale 1.2 to 1 over 187.37 ms, `cubic-bezier(0, 0, 0.58, 1)`) | the `fadeIn` / `scaleOut` motion on all 37 character components (section `721:945`, page `persona/strato`) and the five final comps (`730:9594`), read with the Plugin API |
| Background and foreground entrances (0 / 600 ms, drift 0.01 x 610 at most 6 px; 1040 / 260 ms, scale 0.92 to 1 about the slot centre), the pair's release at 1300 ms | not Figma (its background and foreground carry no motion): spec 2026-11-23 §4 (drift <= ~6 px) and its plan (Task 5), with the controller's rulings of 2026-11-24 (curve, cap, origin) |
| Entrance curve `easeEntrance`, `cubic-bezier(0.16, 1, 0.3, 1)` | the shared entrance curve, `Easing.bezier(0.16, 1, 0.3, 1)`, of `uds-wireframe/rules/shared/motion-choreography.md` ("One entrance curve") |
| Legacy interface pop-up (450 / 450 ms, 0.043 x 610, outBack s=1.7), its release at 900 ms | the picked mockup `stage-b-transparent.html`, option B; the timings are the 2026-11-03 amendment (controller's call) |
| `DEFAULT_METRICS`, the `live-app` slot | **not Figma**: see the note below |
| `STRATO_SIMPLE_ASPECT` 4.8404 | `STRATO_SIMPLE.aspect` of `product-pop-out/promptWindow.strato.tsx` (`587:6992`, 455 x 94), mirrored, not imported (see "Interface leg sizes") |
| `PROMPT_WINDOW_GLOW_PAD_OF_W` 0.3 | not Figma: the room the pill's glow needs (`STRATO_SIMPLE.glowBlurOfW` 0.13, see "Interface leg sizes") |

## Interface leg sizes

Only the moderator decides how big an interface leg is: it requests the leg at that size and sends
the same `legW` x `legH` to `/compose` (src/orchestrate/stagePayloads.ts). The template never computes
it. A pair leg is requested at the character frame's aspect (`CHARACTER_FRAME_ASPECT`) and mounted
whole in each mount box (see "The pair"). For the legacy kinds below, `interfaceLegDims` and
`promptWindowLeg` here are MIRRORS of the moderator's rule, kept to document and test it (the
moderator's tests import this file and assert the two agree). Whatever the size, the composite
mounts a legacy leg at half scale centred on the slot (`interfaceMountRect`),
nudged below the face-safe band when it would cover the face, and `placeStage` keeps it at the
slot's offset from the character (see "Placement").

| Interface | Leg canvas | Rule |
|---|---|---|
| `live-app`, and `feature-highlight` that is not the AI prompt | 2x the slot (`feature-highlight` 769 x 180, `live-app` 760 x 570) | `interfaceLegDims` |
| `feature-highlight` that IS the AI prompt (moderator: `ai: true`, illustration mode) | 1231 x 621: the pill 769 x 158.87 plus a 231 px pad on every side | `promptWindowLeg` |

Clamps, for every leg: raised to 320 x 180, never with both sides at or under 512 (then the long
side becomes 513), capped at 1920 x 1080 (agent-svc's canvas range and small-format band).

The AI prompt leg's canvas IS the floating STRATO `prompt-simple` PromptWindow (Figma `663:9864`:
the pill over the character's chest): one pill 2x the slot wide (`width` 769) at its own aspect
(`STRATO_SIMPLE_ASPECT`, height 769 / 4.8404), centred, with `left` 231 and `bottom` 231.06 (the
literal props the moderator sends agent-svc as `stagePromptWindow`). Why the pad: the pill's glow
is the pill itself blurred by 0.13 x its width (100 px at 769; `STRATO_SIMPLE.glowBlurOfW`), and
grows to 1.06x at the send pulse, while the stage clips the leg to its canvas
(`interfaceLegStyle`). A canvas the size of the pill would cut the glow off in a hard edge; 0.3 x
the width (231 px, ~2.3 blur radii) leaves it to fade out. Because the pill is centred, the
half-scale mount puts it on the slot: 90.3, 384.5 wide vs the slot's 90.2, 384.7, and 79.44 tall
vs 78.3, the difference between the pill's aspect and the slot's, centred on the slot
(`geometry.test.ts`). Over 1920 x 1080 the pill and its pad shrink together; under the minimum or
in the small band only the canvas grows around the pill: it stays centred either way.

`STRATO_SIMPLE_ASPECT` is mirrored, not imported: agent-svc copies this directory alone into the
compose workspace (`src/uds/strato-stage/`, while product-pop-out lands flat in `src/uds/`), so an
import of `../product-pop-out/...` cannot resolve there (`selfContained.test.ts` fails on one);
`geometry.test.ts` asserts it equals `STRATO_SIMPLE.aspect`.

## Motion

All times are from frame 0 at 30 fps (spec 2026-11-23 §4). The settled stage carries the designed
position and nothing else: every pattern is exactly identity (`translateY 0, scale 1, opacity 1`)
once its progress `p` reaches 1. `layerMotion(id, tMs, fit)` returns `translateY` in canvas px at
the fit `s` (`fitStage(...).scale`): its visual units times `s`. The background's drift is
`min(6, 0.01 x 610 x s)` px (`BACKGROUND_DRIFT_MAX_PX`, spec "drift <= ~6 px"). That is 5.24 px at
750 x 570, and exactly 6 px whenever `s` > 6 / 6.1 = 0.984: every other acceptance format, e.g.
1600 x 900 (8.28 px uncapped) and 2048 x 2048 (15.6 px uncapped). Both pair entrances run on the shared entrance curve `easeEntrance`,
`cubic-bezier(0.16, 1, 0.3, 1)` (`motion-choreography.md`, "One entrance curve"), with opacity and
transform from the same eased progress `e = easeEntrance(p)`. It never overshoots.

Transform origins (`StageLayer.origin`, `layerStyle`):
- **The foreground** scales about its SLOT's centre within its mount box: `PAIR_SLOTS.foreground`
  `x + w / 2`, `y + h / 2` = 27.5 %, 44 %, where the leg draws the card even when the slot was
  clamped. So the card grows in place. About the box centre it would slide about 12 px toward the
  frame centre at 750 x 570.
- **The background and the character** scale about their rect's centre. For the background that is
  its mount box (it only drifts). For the character it is its image box, which is the frame for a
  catalog character.

| Layer | Start / duration (ms) | Motion | Opacity |
|---|---|---|---|
| `background` | 0 / 600 | drifts up: translateY `min(6, 6.1 s) x (1 - e)` px to 0 | `e` |
| `character` | 847.12 / 187.37 | the Figma pop-in: scale `1.2 - 0.2 easeOutFigma((t - 847.12) / 187.37)` | `easeOutFigma((t - 847.12) / 98.22)` |
| `foreground` | 1040 / 260 | scale `0.92 + 0.08 e`, about its slot centre | `e` |
| `interface` (legacy) | 450 / 450 | outBack s=1.7: translateY 0.043 x 610 = 26.23 visual units (x `s` px) to 0, scale 0.72 to 1 (overshoots) | `2.5p`, clamped |

**The Figma pop-in** (`CHARACTER_POP` = `{ startMs: 847.12, fadeMs: 98.22, scaleMs: 187.37,
fromScale: 1.2 }`) is the `fadeIn` / `scaleOut` of every character component: opacity 0 to 1 over
98.22 ms and scale 120 % to 100 % (both axes) over 187.37 ms, both from 847.12 ms, both eased
`cubic-bezier(0, 0, 0.58, 1)`. `easeOutFigma(p)` is that curve: `x(t) = p` solved by bisection
(40 iterations), then `y(t)`; exactly 0 at `p <= 0` and 1 at `p >= 1`.

| Stage frame (ms) | Character opacity | Character scale |
|---|---|---|
| 0 to 25 (0 to 833.3) | 0 | 1.2 |
| 26 (866.7) | 0.307 | 1.1666 |
| 27 (900.0) | 0.725 | 1.1157 |
| 28 (933.3) | 0.975 | 1.0718 |
| 29 (966.7) | 1 | 1.0361 |
| 30 (1000.0) | 1 | 1.0107 |
| 31 (1033.3) | 1 | 1.0000 (0.9938 of the way) |
| 32 on (1066.7) | 1 | 1, exactly (identity from 1034.49 ms) |

The pair's sequence: the background has drifted in and rests by 600 ms (frame 18). The character
pops in from 847 ms and has landed by 1034 ms. Then the foreground enters (1040 to 1300 ms,
frames 32 to 39). Its leg's own animation, the one impact moment, is released at 1300 ms
(`FOREGROUND_ANIM_START_MS`, frame 39) in both mounts.
Output is 30 fps: 4 s with no interface or a still leg, 5 s with an animated one (its own
animation is 3 s: frames 39 to 128, 1.3 s to 4.3 s). Frame 0 is empty and transparent (every
opacity is 0), as the compose `stage-alpha` gate requires. The last frame is held; there is no loop.

**Legacy note.** A legacy stage (`live-app` / `feature-highlight`) keeps its rects and its
interface's pop-up (450 to 900 ms) and release (`INTERFACE_ANIM_START_MS` = 900, frame 27; its 3 s
are frames 27 to 116). Its character gets the Figma pop-in too, like every stage character (spec
ruling 2). So on those stages the interface has popped in before the character appears (847 ms).
Legacy payloads only come from a moderator deployed earlier, during a deploy window.

## The interface mounts

`StratoStage` wraps each mount's node in a `legW` x `legH` CSS px box that clips (it is the leg's
canvas) and scales it by `rect.w / legW` from its top-left (`interfaceLegStyle`), so the node lays
itself out exactly as it did in its own leg. For a pair the rect is the layer's mount box (the
whole leg canvas, at the character frame's scale); for a legacy interface it is the leg at half
scale.

| Kind | Mounts | Node | Released at (`startFrame`) |
|---|---|---|---|
| `pair` | two: `background` below the character, `foreground` above it | `renderInterface('background')`, `renderInterface('foreground')` | `msToFrame(FOREGROUND_ANIM_START_MS)` = 39 (1300 ms), both |
| `live-app` / `feature-highlight` | one, over the character | `interfaceNode` | `msToFrame(INTERFACE_ANIM_START_MS)` = 27 (900 ms) |

Both pair mounts show the SAME leg frame at every stage frame, so the background and the foreground
stay one picture. Which of its own frames a mount shows (`interfacePhase(frame, startFrame,
interfaceDurationInFrames, interfaceMotion)`, pure, `motion.ts`):

| `interfaceMotion` | Stage frames | Leg frame shown |
|---|---|---|
| `'animated'` | 0 to `startFrame` - 1 (0 to 38 for the pair, 0 to 26 legacy) | 0, frozen |
| `'animated'` | `startFrame` to `startFrame` + d - 1 (39 to 128 / 27 to 116 for d = 90) | `frame - startFrame`, playing |
| `'animated'` | after that (129 / 117 on) | d - 1, held: the last frame stays, the leg never vanishes |
| `'still'` | every frame, the entrances included | d - 1: the frame its own still gate validated (ruling R23) |

d is `interfaceDurationInFrames`. Without it a still shows frame 0 and an animated one plays on
unbounded. Nothing depends on the stage's length: in a 4 s (120-frame) legacy stage an animated
90-frame interface has played out by frame 116 and holds frame 89 on the last stage frame.

Each mount is ONE element tree in every phase, so the node never remounts:
`<Freeze frame={shown}><Sequence durationInFrames={d} width={legW} height={legH} layout="none">`.

* **Verified, remotion 4.0.467 (and the same in 4.0.529):** `<Sequence>` accepts `width` /
  `height` (`dist/cjs/Sequence.d.ts`), stores them in its `SequenceContext` (`Sequence.js`), and
  `useVideoConfig()` inside it returns them in place of the composition's
  (`use-unsafe-video-config.js`). So the node sees the leg's size and no wrapper is needed. With
  `layout="none"` the Sequence adds no `AbsoluteFill` of its own.
* The Sequence's context duration (what `useVideoConfig().durationInFrames` returns inside) is
  `max(0, min(composition duration - from, durationInFrames))` (`Sequence.js`).
  A Sequence from the release (27, or 39) would unmount the leg before it. So the
  Sequence starts at 0 (it reports d whenever the stage is at least d long), and the
  stage frame is mapped onto the leg's own frame by the always-active `<Freeze>`, which
  sets the timeline to `shown` and zeroes the cumulated offset (`freeze.js`): `useCurrentFrame()`
  inside is exactly `shown`, always within the Sequence's 0 .. d - 1, so it stays mounted.
* d must not exceed the stage's own length: remotion clamps the timeline to the composition.

## Provisional: the live-app slot

`feature-highlight` is measured (`663:9895`). `live-app` is **provisional**: there is no Figma
node for it yet, so its slot (40, 250, 380 x 285: left of the character at chest height) follows
the spec's description of `663:9864` / `663:9453` and is not a measurement. Replace it when
`663:9453` is opened. `DEFAULT_METRICS` is likewise a plausible portrait, not a measurement; it
only applies when a cutout was never measured.
