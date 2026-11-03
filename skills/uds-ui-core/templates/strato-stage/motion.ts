/**
 * strato-stage motion — the fixed entrance of the STRATO corporate stage ("option B"), as pure
 * functions of time. No React, no DOM, no `remotion`: `layerMotion(id, tMs)` is arithmetic, so
 * it is testable without a renderer and the component only has to apply what it returns.
 *
 * The two curves are those of the picked mockup (stage-b-transparent.html, option B), kept
 * after the box and powder layers were dropped (amendment 2026-11-03):
 *   slideUp    character outQuart, from 0.28 x visual height below
 *   popUp      interface outBack s=1.7, from 0.043 x visual height below, scale 0.72 -> 1
 * The settled position is Figma's (geometry.ts), the motion is only the delta from it.
 *
 * Every pattern is EXACTLY the identity (`translateY 0, scale 1, opacity 1`) once its progress
 * reaches 1, so the settled stage carries the Figma position and nothing else.
 */
import { VISUAL } from './geometry';

export const FPS = 30;

export type StageLayerId = 'character' | 'interface';

/** When each layer enters, as `[startMs, durMs]`. Paint order is layers.ts's business, not this. */
export const TIMELINE: Record<StageLayerId, readonly [number, number]> = {
  character: [0, 550],
  interface: [450, 450],
};

/** When the interface's OWN animation (its codegen'd content) starts: as it finishes popping in. */
export const INTERFACE_ANIM_START_MS = 900;

/**
 * What a layer adds on top of its settled pose. `translateY` is in VISUAL units (672 x 610
 * frame): the component multiplies it by the fit scale to get canvas px.
 */
export type LayerMotion = { translateY: number; scale: number; opacity: number };

const outQuart = (p: number): number => 1 - Math.pow(1 - p, 4);
const outBack = (p: number, s: number): number => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);

/** `p` into [0,1]. Written `p > 0`, not `Math.max(0, ..)`, so NaN and -0 both land on +0. */
const clamp01 = (p: number): number => (p > 0 ? Math.min(1, p) : 0);

const slideUp = (p: number, dist: number): LayerMotion => {
  const e = outQuart(p);
  return { translateY: dist * (1 - e), scale: 1, opacity: clamp01(p * 2) };
};
const popUp = (p: number, dist: number): LayerMotion => {
  // `p <= 0` is pinned to 0: outBack(0, s) is mathematically 0 but not bit-exactly so.
  const e = p <= 0 ? 0 : outBack(p, 1.7);
  return { translateY: dist * (1 - e), scale: 0.72 + 0.28 * e, opacity: clamp01(p * 2.5) };
};

/** A fresh identity each call, so no caller can mutate a shared object. */
const identity = (): LayerMotion => ({ translateY: 0, scale: 1, opacity: 1 });

/** What `id` adds to its settled pose at `tMs` after frame 0. Exact identity from its end on. */
export function layerMotion(id: StageLayerId, tMs: number): LayerMotion {
  const [start, dur] = TIMELINE[id];
  const p = clamp01((tMs - start) / dur);
  if (p >= 1) return identity();
  return id === 'character' ? slideUp(p, 0.28 * VISUAL.h) : popUp(p, 0.043 * VISUAL.h);
}

/** Length of the render: 4 s, or 5 s when the interface runs its own 3 s animation (0.9 s in). */
export function stageDurationSec(iface: 'none' | 'still' | 'animated'): 4 | 5 {
  return iface === 'animated' ? 5 : 4;
}

/** The first frame at or after `ms` (so `INTERFACE_ANIM_START_MS` never starts a frame early). */
export function msToFrame(ms: number): number {
  return Math.ceil((ms * FPS) / 1000);
}

/** How the interface leg was rendered: a still (its own still gate validated its LAST frame) or animated. */
export type InterfaceMotion = 'still' | 'animated';

/**
 * Which of its OWN frames the interface shows at stage frame `frame`.
 *  pop-in   animated, before `startFrame`: held at its frame 0 while the layer pops in.
 *  playing  animated, from `startFrame`: its frame `frame - startFrame`.
 *  held     animated, after its last frame: held at `durationInFrames - 1`.
 *  still    a still interface: its LAST frame (`durationInFrames - 1`, the frame its own still
 *           gate validated) at every stage frame, pop-in included (ruling R23); frame 0 when
 *           its length is unknown.
 * With `durationInFrames` unknown an animated interface plays on, unbounded.
 *
 * Nothing here knows the composite's length: in a 4 s composite (120 frames) an animated
 * 90-frame interface starting at 27 has played out by frame 116 and is `held` (frame 89) on the composite's last frame.
 */
export function interfacePhase(
  frame: number,
  startFrame: number,
  durationInFrames: number | undefined,
  motion: InterfaceMotion,
): { phase: 'pop-in' | 'playing' | 'held' | 'still'; frame: number } {
  const last = durationInFrames === undefined ? undefined : durationInFrames - 1;
  if (motion === 'still') return { phase: 'still', frame: last ?? 0 };
  if (frame < startFrame) return { phase: 'pop-in', frame: 0 };
  const own = frame - startFrame;
  if (last !== undefined && own > last) return { phase: 'held', frame: last };
  return { phase: 'playing', frame: own };
}
