/**
 * strato-stage motion — the fixed entrance of the STRATO corporate stage ("option B"), as pure
 * functions of time. No React, no DOM, no `remotion`: `layerMotion(id, tMs)` is arithmetic, so
 * it is testable without a renderer and the component only has to apply what it returns.
 *
 * The four curves are the ones of the picked mockup (stage-b-transparent.html, option B):
 *   rotateIn   boxes     outCubic, rotate from -38 deg (back) / +34 deg (fore), scale 0.82 -> 1
 *   pop        powders   outBack s=1.4, scale 0.35 -> 1 (overshoots)
 *   slideUp    character outQuart, from 0.28 x visual height below
 *   popUp      interface outBack s=1.7, from 0.043 x visual height below, scale 0.72 -> 1
 * Positions and rotations of the mockup are NOT used here: the settled pose is Figma's
 * (geometry.ts), the motion is only the delta from it.
 *
 * Every pattern is EXACTLY the identity (`translateY 0, rotateDeg 0, scale 1, opacity 1`) once
 * its progress reaches 1, so the settled stage carries the Figma pose and nothing else.
 */
import { VISUAL } from './geometry';

export const FPS = 30;

export type StageLayerId = 'boxBack' | 'boxFore' | 'powderBack' | 'character' | 'powderFore' | 'interface';

/** When each layer enters, as `[startMs, durMs]`. Paint order is layers.ts's business, not this. */
export const TIMELINE: Record<StageLayerId, readonly [number, number]> = {
  boxBack: [0, 500],
  boxFore: [100, 500],
  powderBack: [300, 450],
  character: [420, 550],
  powderFore: [650, 450],
  interface: [850, 450],
};

/** When the interface's OWN animation (its codegen'd content) starts: after it has popped in. */
export const INTERFACE_ANIM_START_MS = 1350;

/**
 * What a layer adds on top of its settled pose. `translateY` is in VISUAL units (672 x 610
 * frame): the component multiplies it by the fit scale to get canvas px. `rotateDeg` is CSS
 * degrees, clockwise-positive, added to the pose's own rotation.
 */
export type LayerMotion = { translateY: number; rotateDeg: number; scale: number; opacity: number };

const outCubic = (p: number): number => 1 - Math.pow(1 - p, 3);
const outQuart = (p: number): number => 1 - Math.pow(1 - p, 4);
const outBack = (p: number, s: number): number => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);

/** `p` into [0,1]. Written `p > 0`, not `Math.max(0, ..)`, so NaN and -0 both land on +0. */
const clamp01 = (p: number): number => (p > 0 ? Math.min(1, p) : 0);

/** `-38 * (1 - e)` is -0 when `e` rounds to exactly 1 just below p = 1; consumers want +0. */
const noNegZero = (v: number): number => (v === 0 ? 0 : v);

const rotateIn = (p: number, fromDeg: number): LayerMotion => {
  const e = outCubic(p);
  return { translateY: 0, rotateDeg: noNegZero(fromDeg * (1 - e)), scale: 0.82 + 0.18 * e, opacity: clamp01(p * 3) };
};
// `p <= 0` is pinned to 0: outBack(0, s) is mathematically 0 but not bit-exactly so.
const pop = (p: number): LayerMotion => {
  const e = p <= 0 ? 0 : outBack(p, 1.4);
  return { translateY: 0, rotateDeg: 0, scale: 0.35 + 0.65 * e, opacity: clamp01(p * 2.5) };
};
const slideUp = (p: number, dist: number): LayerMotion => {
  const e = outQuart(p);
  return { translateY: dist * (1 - e), rotateDeg: 0, scale: 1, opacity: clamp01(p * 2) };
};
const popUp = (p: number, dist: number): LayerMotion => {
  const e = p <= 0 ? 0 : outBack(p, 1.7);
  return { translateY: dist * (1 - e), rotateDeg: 0, scale: 0.72 + 0.28 * e, opacity: clamp01(p * 2.5) };
};

/** A fresh identity each call, so no caller can mutate a shared object. */
const identity = (): LayerMotion => ({ translateY: 0, rotateDeg: 0, scale: 1, opacity: 1 });

/** What `id` adds to its settled pose at `tMs` after frame 0. Exact identity from its end on. */
export function layerMotion(id: StageLayerId, tMs: number): LayerMotion {
  const [start, dur] = TIMELINE[id];
  const p = clamp01((tMs - start) / dur);
  if (p >= 1) return identity();
  switch (id) {
    case 'boxBack':
      return rotateIn(p, -38);
    case 'boxFore':
      return rotateIn(p, 34);
    case 'powderBack':
    case 'powderFore':
      return pop(p);
    case 'character':
      return slideUp(p, 0.28 * VISUAL.h);
    case 'interface':
      return popUp(p, 0.043 * VISUAL.h);
  }
}

/** Length of the render: 4 s, or 5 s when the interface runs its own 3 s animation (1.35 s in). */
export function stageDurationSec(iface: 'none' | 'still' | 'animated'): 4 | 5 {
  return iface === 'animated' ? 5 : 4;
}

/** The first frame at or after `ms` (so `INTERFACE_ANIM_START_MS` never starts a frame early). */
export function msToFrame(ms: number): number {
  return Math.ceil((ms * FPS) / 1000);
}
