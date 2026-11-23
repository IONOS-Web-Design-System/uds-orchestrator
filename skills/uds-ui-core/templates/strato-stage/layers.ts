/**
 * strato-stage layers — the pure layer list of the STRATO corporate stage at one instant.
 * `buildStageLayers(input, tMs)` is geometry.ts (where each layer settles: `placeStage`) composed
 * with motion.ts (what it adds at `tMs`), in canvas pixels. No React, no DOM, no `remotion`: the
 * component maps this list 1:1 onto absolutely positioned elements, so everything that can go
 * wrong (fit, order, motion) is testable here without a renderer.
 *
 * Bottom to top. A pair (`iface.kind === 'pair'`): the leg's background, the character, the leg's
 * foreground, the two pair layers in their mount boxes (`placeStage(...).pair`). Otherwise the
 * character, then a legacy interface over it when there is one. A pair whose character frame is
 * degenerate has no `pair` (geometry.ts), so it is the character alone.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import { fitStage, placeStage, type Rect, type StagePlacementInput } from './geometry';
import { layerMotion, type StageLayerId } from './motion';

/** `placeStage`'s input (canvas, `safeArea`, `metrics`, `iface`, `characterFramed`) plus the character image. */
export type StageInput = StagePlacementInput & {
  /** Path for `staticFile()`: the character cutout. */
  srcs: { character: string };
};

export type StageLayer = {
  id: StageLayerId;
  /** `staticFile()` path of the character image; absent on the interface and pair layers (the leg, a React node). */
  src?: string;
  /** Canvas px (the content box starts at the canvas origin). */
  rect: Rect;
  /** CSS transform about the rect's centre: motion on top of the settled pose. */
  transform: string;
  opacity: number;
};

export function buildStageLayers(input: StageInput, tMs: number): StageLayer[] {
  const place = placeStage(input);
  // The motion offsets are visual units at the frame's fit, as before.
  const scale = fitStage(input.canvas, input.safeArea).scale;

  const make = (id: StageLayerId, rect: Rect, src: string | undefined): StageLayer => {
    const m = layerMotion(id, tMs);
    return {
      id,
      ...(src === undefined ? {} : { src }),
      rect,
      transform: `translateY(${m.translateY * scale}px) scale(${m.scale})`,
      opacity: m.opacity,
    };
  };

  const character = make('character', place.character, input.srcs.character);
  // Bottom -> top. The pair: the leg's background, the character, the leg's foreground.
  if (place.pair) {
    return [
      make('background', place.pair.background, undefined),
      character,
      make('foreground', place.pair.foreground, undefined),
    ];
  }
  // Legacy: the character, then the interface (when there is one) over it.
  const layers: StageLayer[] = [character];
  if (place.iface) layers.push(make('interface', place.iface, undefined));
  return layers;
}
