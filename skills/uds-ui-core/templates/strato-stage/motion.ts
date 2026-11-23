/**
 * strato-stage motion — the fixed entrance of the STRATO corporate stage, as pure functions of
 * time. No React, no DOM, no `remotion`: `layerMotion(id, tMs)` is arithmetic, so it is testable
 * without a renderer and the component only has to apply what it returns.
 *
 * The three layers of the stage (spec 2026-11-23 §4), bottom to top, and the legacy interface:
 *   background  from 0: fades in on outQuart while drifting up 0.01 x visual height (6.1 units);
 *               at rest from 600 ms. Quiet: it must not compete with the character.
 *   character   the Figma pop-in of every character component (`CHARACTER_POP`): from 847.12 ms,
 *               opacity 0 -> 1 over 98.22 ms and scale 1.2 -> 1 over 187.37 ms, both on
 *               cubic-bezier(0, 0, 0.58, 1) (`easeOutFigma`); landed at 1034.49 ms.
 *   foreground  once the character has landed: from 1040 ms over 260 ms, opacity at twice the
 *               progress, scale 0.92 -> 1 on outQuart. Its leg's own animation (the one impact
 *               moment) is released at 1300 ms (`FOREGROUND_ANIM_START_MS`).
 *   interface   LEGACY (`live-app` / `feature-highlight` payloads of an earlier moderator): the
 *               2026-11-03 pop-up (mockup stage-b-transparent.html, option B), outBack s=1.7 from
 *               0.043 x visual height below, scale 0.72 -> 1, 450 to 900 ms; its leg is released
 *               at 900 ms (`INTERFACE_ANIM_START_MS`). The legacy stage's character gets the Figma
 *               pop-in too (spec ruling 2: every stage character), so there the interface has
 *               popped in (450-900 ms) before the character appears (847 ms).
 * The settled position is geometry.ts's, the motion is only the delta from it.
 *
 * Every pattern is EXACTLY the identity (`translateY 0, scale 1, opacity 1`) once its progress
 * reaches 1, so the settled stage carries the designed position and nothing else.
 */
import { VISUAL } from './geometry';

export const FPS = 30;

/** The stage's layers: the pair's `background` / `foreground`, the `character`, the legacy `interface`. */
export type StageLayerId = 'background' | 'character' | 'interface' | 'foreground';

/**
 * The Figma character motion, the same on all 37 `strato-<showroom>-stage` components (section
 * 721:945) and on the five final comps (730:9594), read with the Plugin API: `fadeIn` (opacity
 * 0 -> 1 over `fadeMs`) and `scaleOut` (both axes together, `fromScale` -> 1 over `scaleMs`), both
 * from `startMs`, eased `cubic-bezier(0, 0, 0.58, 1)`.
 */
export const CHARACTER_POP = { startMs: 847.12, fadeMs: 98.22, scaleMs: 187.37, fromScale: 1.2 } as const;

/** When each layer enters, as `[startMs, durMs]`. Paint order is layers.ts's business, not this. */
export const TIMELINE: Record<StageLayerId, readonly [number, number]> = {
  background: [0, 600],
  // The pop's span is its scale's, the longer of its two curves.
  character: [CHARACTER_POP.startMs, CHARACTER_POP.scaleMs],
  foreground: [1040, 260],
  interface: [450, 450],
};

/** LEGACY: when the interface's OWN animation (its codegen'd content) starts: as it finishes popping in. */
export const INTERFACE_ANIM_START_MS = 900;

/** When the pair leg's OWN animation starts (both mounts): as the foreground has entered (1040 + 260). */
export const FOREGROUND_ANIM_START_MS = 1300;

/**
 * What a layer adds on top of its settled pose. `translateY` is in VISUAL units (672 x 610
 * frame): the component multiplies it by the fit scale to get canvas px.
 */
export type LayerMotion = { translateY: number; scale: number; opacity: number };

const outQuart = (p: number): number => 1 - Math.pow(1 - p, 4);
const outBack = (p: number, s: number): number => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);

/** `p` into [0,1]. Written `p > 0`, not `Math.max(0, ..)`, so NaN and -0 both land on +0. */
const clamp01 = (p: number): number => (p > 0 ? Math.min(1, p) : 0);

/** One coordinate of a CSS cubic-bezier at parameter `t`: control points `a`, `b`; ends 0 and 1. */
const bezier = (t: number, a: number, b: number): number =>
  3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;

/**
 * Figma's ease-out, CSS `cubic-bezier(0, 0, 0.58, 1)`, at progress `p`: `x(t) = p` solved by
 * bisection (40 halvings, `t` to ~1e-12; `x` is increasing on [0, 1]), then `y(t)`. Pinned at the
 * ends: 0 at `p <= 0` (and NaN), exactly 1 at `p >= 1`.
 */
export function easeOutFigma(p: number): number {
  if (!(p > 0)) return 0;
  if (p >= 1) return 1;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (bezier(mid, 0, 0.58) < p) lo = mid;
    else hi = mid;
  }
  return bezier((lo + hi) / 2, 0, 1);
}

/** Background: fades in on outQuart while it drifts up from `dist` below. */
const drift = (p: number, dist: number): LayerMotion => {
  const e = outQuart(p);
  return { translateY: dist * (1 - e), scale: 1, opacity: e };
};
/** Character: the Figma pop-in at `tMs`, its fade and its scale each on its own duration. */
const figmaPop = (tMs: number): LayerMotion => {
  const t = tMs - CHARACTER_POP.startMs;
  const fade = easeOutFigma(t / CHARACTER_POP.fadeMs);
  const grow = easeOutFigma(t / CHARACTER_POP.scaleMs);
  return { translateY: 0, scale: CHARACTER_POP.fromScale - (CHARACTER_POP.fromScale - 1) * grow, opacity: fade };
};
/** Foreground: scales up from 0.92 on outQuart, opaque by half way. */
const enter = (p: number): LayerMotion => ({ translateY: 0, scale: 0.92 + 0.08 * outQuart(p), opacity: clamp01(p * 2) });
/** Legacy interface: the 2026-11-03 pop-up. */
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
  switch (id) {
    case 'background':
      return drift(p, 0.01 * VISUAL.h);
    case 'character':
      return figmaPop(tMs);
    case 'foreground':
      return enter(p);
    case 'interface':
      return popUp(p, 0.043 * VISUAL.h);
  }
}

/**
 * Length of the render: 4 s, or 5 s when the interface runs its own 3 s animation: the pair's
 * from 1.3 s (frames 39 to 128), a legacy interface's from 0.9 s (frames 27 to 116).
 */
export function stageDurationSec(iface: 'none' | 'still' | 'animated'): 4 | 5 {
  return iface === 'animated' ? 5 : 4;
}

/** The first frame at or after `ms` (so a leg's release never starts a frame early). */
export function msToFrame(ms: number): number {
  return Math.ceil((ms * FPS) / 1000);
}

/** How the interface leg was rendered: a still (its own still gate validated its LAST frame) or animated. */
export type InterfaceMotion = 'still' | 'animated';

/**
 * Which of its OWN frames an interface leg shows at stage frame `frame`. `startFrame` is the
 * leg's release: `msToFrame(FOREGROUND_ANIM_START_MS)` (39) for both mounts of the pair,
 * `msToFrame(INTERFACE_ANIM_START_MS)` (27) for a legacy interface.
 *  pop-in   animated, before `startFrame`: held at its frame 0 while the layers enter.
 *  playing  animated, from `startFrame`: its frame `frame - startFrame`.
 *  held     animated, after its last frame: held at `durationInFrames - 1`.
 *  still    a still interface: its LAST frame (`durationInFrames - 1`, the frame its own still
 *           gate validated) at every stage frame, pop-in included (ruling R23); frame 0 when
 *           its length is unknown.
 * With `durationInFrames` unknown an animated interface plays on, unbounded.
 *
 * Nothing here knows the composite's length: in a 4 s composite (120 frames) an animated
 * 90-frame legacy interface starting at 27 has played out by frame 116 and is `held` (frame 89) on
 * the composite's last frame; in the 5 s composite of an animated pair (150 frames) its 90-frame
 * leg plays frames 39 to 128 and is `held` from 129.
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
