/** The pair: a background box and a foreground box inside the character frame. Pure. */
import { createContext, useContext } from 'react';

type Rect = { x: number; y: number; w: number; h: number };

export const CHARACTER_FRAME_ASPECT = 970.845 / 736.224;

/** Fractions of the character frame (Figma). */
export const PAIR_SLOTS = {
  background: { x: 0.14, y: 0.13, w: 0.5, h: 0.42 },
  foreground: { x: 0.12, y: 0.24, w: 0.31, h: 0.4 },
} as const;

export type StageLayerName = 'background' | 'foreground' | 'both';

/** Which layer a mount shows; standalone renders have no provider and show both. */
export const StageLayerContext = createContext<StageLayerName>('both');
/** The size of the box the current layer is drawn into. */
export const StageSlotContext = createContext<{ w: number; h: number }>({ w: 253, h: 173 });
export const useStageSlot = () => useContext(StageSlotContext);

export function pairSlotRects(canvas: { w: number; h: number }): { background: Rect; foreground: Rect } {
  const px = (s: { x: number; y: number; w: number; h: number }): Rect => ({
    x: s.x * canvas.w, y: s.y * canvas.h, w: s.w * canvas.w, h: s.h * canvas.h,
  });
  return { background: px(PAIR_SLOTS.background), foreground: px(PAIR_SLOTS.foreground) };
}

export function visibleLayers(layer: StageLayerName): ('background' | 'foreground')[] {
  return layer === 'both' ? ['background', 'foreground'] : [layer];
}
