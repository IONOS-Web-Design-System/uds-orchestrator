/**
 * strato-stage layers — the pure layer list of the STRATO corporate stage at one instant.
 * `buildStageLayers(input, tMs)` is geometry.ts (where each layer settles) composed with
 * motion.ts (what it adds at `tMs`), in canvas pixels. No React, no DOM, no `remotion`: the
 * component maps this list 1:1 onto absolutely positioned elements, so everything that can go
 * wrong (poses, fit, order, motion) is testable here without a renderer.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import {
  BOX, DEFAULT_METRICS, POSES, POWDER,
  characterRect, faceSafeRect, fitStage, interfaceMountRect, interfaceSlot,
  type InterfaceKind, type LayerPose, type Rect, type StageFit, type StageMetrics,
} from './geometry';
import { layerMotion, type StageLayerId } from './motion';

export type StageInput = {
  canvas: { w: number; h: number };
  /** Transparent margin on the right / bottom, as fractions of the canvas. Default: none. */
  safeArea?: { right: number; bottom: number };
  /** Measured alpha bbox of the character cutout. Default: `DEFAULT_METRICS`. */
  metrics?: StageMetrics;
  /** Paths for `staticFile()`: the box and powder exports and the character cutout. */
  srcs: { box: string; powder: string; character: string };
  /** The interface leg (its canvas, `interfaceLegDims`), mounted at half scale on its slot. */
  iface?: { kind: InterfaceKind; legW: number; legH: number };
};

export type StageLayer = {
  id: StageLayerId;
  /** `staticFile()` path of the image; absent on the interface, which is a React node. */
  src?: string;
  /** Canvas px, relative to the content box (`fitStage(...).content`). */
  rect: Rect;
  /** CSS transform about the rect's centre: motion on top of the settled pose. */
  transform: string;
  opacity: number;
};

/** The box export is 638 square at the component's 558 side; on the stage the box is 559.19. */
const BOX_EXPORT_ON_STAGE = BOX.exportSide * (BOX.stageSide / BOX.side);

const centred = (cx: number, cy: number, w: number, h: number): Rect => ({ x: cx - w / 2, y: cy - h / 2, w, h });

/** Visual units -> canvas px, relative to the content box. */
const toCanvas = (r: Rect, f: StageFit): Rect => ({
  x: f.originX + r.x * f.scale,
  y: f.originY + r.y * f.scale,
  w: r.w * f.scale,
  h: r.h * f.scale,
});

/** Bottom -> top. The interface, when there is one, is always last (over the character). */
const IMAGE_ORDER = ['boxBack', 'boxFore', 'powderBack', 'character', 'powderFore'] as const;

export function buildStageLayers(input: StageInput, tMs: number): StageLayer[] {
  const f = fitStage(input.canvas, input.safeArea);
  const metrics = input.metrics ?? DEFAULT_METRICS;

  const make = (id: StageLayerId, visual: Rect, pose: LayerPose | undefined, src: string | undefined): StageLayer => {
    const m = layerMotion(id, tMs);
    const rotate = (pose?.rotateDeg ?? 0) + m.rotateDeg;
    return {
      id,
      ...(src === undefined ? {} : { src }),
      rect: toCanvas(visual, f),
      transform:
        `translateY(${m.translateY * f.scale}px) rotate(${rotate}deg) scale(${m.scale})` +
        (pose?.mirror ? ' scaleX(-1)' : ''),
      opacity: m.opacity,
    };
  };

  const layers = IMAGE_ORDER.map((id): StageLayer => {
    switch (id) {
      case 'boxBack':
      case 'boxFore': {
        const pose = POSES[id];
        return make(id, centred(pose.cx, pose.cy, BOX_EXPORT_ON_STAGE, BOX_EXPORT_ON_STAGE), pose, input.srcs.box);
      }
      case 'powderBack':
      case 'powderFore': {
        const pose = POSES[id];
        return make(id, centred(pose.cx, pose.cy, POWDER.w, POWDER.h), pose, input.srcs.powder);
      }
      case 'character':
        return make(id, characterRect(metrics), undefined, input.srcs.character);
    }
  });

  if (input.iface) {
    const { kind, legW, legH } = input.iface;
    const slot = interfaceSlot(kind, faceSafeRect(metrics));
    layers.push(make('interface', interfaceMountRect(slot, { w: legW, h: legH }), undefined, undefined));
  }
  return layers;
}
