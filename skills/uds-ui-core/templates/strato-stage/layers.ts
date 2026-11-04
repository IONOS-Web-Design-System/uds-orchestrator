/**
 * strato-stage layers — the pure layer list of the STRATO corporate stage at one instant.
 * `buildStageLayers(input, tMs)` is geometry.ts (where each layer settles) composed with
 * motion.ts (what it adds at `tMs`), in canvas pixels. No React, no DOM, no `remotion`: the
 * component maps this list 1:1 onto absolutely positioned elements, so everything that can go
 * wrong (fit, order, motion) is testable here without a renderer.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import {
  DEFAULT_METRICS, characterRect, faceSafeRect, fitStage, interfaceMountRect, interfaceSlot,
  type InterfaceKind, type Rect, type StageFit, type StageMetrics,
} from './geometry';
import { layerMotion, type StageLayerId } from './motion';

export type StageInput = {
  canvas: { w: number; h: number };
  /** Transparent margin on the right / bottom, as fractions of the canvas. Default: none. */
  safeArea?: { right: number; bottom: number };
  /** Measured alpha bbox of the character cutout. Default: `DEFAULT_METRICS`. */
  metrics?: StageMetrics;
  /** Path for `staticFile()`: the character cutout. */
  srcs: { character: string };
  /** The interface leg (the canvas the moderator rendered it at), mounted at half scale on its slot. */
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

/** Visual units -> canvas px, relative to the content box. */
const toCanvas = (r: Rect, f: StageFit): Rect => ({
  x: f.originX + r.x * f.scale,
  y: f.originY + r.y * f.scale,
  w: r.w * f.scale,
  h: r.h * f.scale,
});

export function buildStageLayers(input: StageInput, tMs: number): StageLayer[] {
  const f = fitStage(input.canvas, input.safeArea);
  const metrics = input.metrics ?? DEFAULT_METRICS;

  const make = (id: StageLayerId, visual: Rect, src: string | undefined): StageLayer => {
    const m = layerMotion(id, tMs);
    return {
      id,
      ...(src === undefined ? {} : { src }),
      rect: toCanvas(visual, f),
      transform: `translateY(${m.translateY * f.scale}px) scale(${m.scale})`,
      opacity: m.opacity,
    };
  };

  // Bottom -> top: the character, then the interface (when there is one) over it.
  const layers: StageLayer[] = [make('character', characterRect(metrics), input.srcs.character)];
  if (input.iface) {
    const { kind, legW, legH } = input.iface;
    const slot = interfaceSlot(kind, faceSafeRect(metrics));
    layers.push(make('interface', interfaceMountRect(slot, { w: legW, h: legH }), undefined));
  }
  return layers;
}
