import { describe, it, expect } from 'vitest';
import {
  layerMotion, stageDurationSec, msToFrame, easeOutFigma, TIMELINE, CHARACTER_POP, INTERFACE_ANIM_START_MS,
  FOREGROUND_ANIM_START_MS, FPS,
} from '../motion';
import { VISUAL } from '../geometry';

// motion.test.ts — three layers (spec 2026-11-23 §4): the background enters, the character pops in
// as on every Figma character component, the foreground enters once the character has landed. The
// legacy interface keeps its 2026-11-03 pop-up.
const IDENTITY = { translateY: 0, scale: 1, opacity: 1 };
const atFrame = (f: number) => (f * 1000) / FPS;

describe('strato-stage motion', () => {
  it('the timeline: background, the Figma character pop, foreground, and the legacy interface', () => {
    expect(TIMELINE).toEqual({
      background: [0, 600],
      character: [847.12, 187.37],
      foreground: [1040, 260],
      interface: [450, 450],
    });
    // The Figma component's motion (721:945, read with the Plugin API): fadeIn 0.0982 s and
    // scaleOut 120 % -> 100 % over 0.1874 s, both from 0.8471 s.
    expect(CHARACTER_POP).toEqual({ startMs: 847.12, fadeMs: 98.22, scaleMs: 187.37, fromScale: 1.2 });
  });

  it('easeOutFigma is cubic-bezier(0, 0, 0.58, 1), pinned at both ends', () => {
    expect(easeOutFigma(0)).toBe(0);
    expect(easeOutFigma(1)).toBe(1);
    expect(Math.abs(easeOutFigma(0.25) - 0.3781)).toBeLessThanOrEqual(0.0005);
    expect(Math.abs(easeOutFigma(0.5) - 0.6846)).toBeLessThanOrEqual(0.0005);
    expect(Math.abs(easeOutFigma(0.75) - 0.9065)).toBeLessThanOrEqual(0.0005);
    // Monotone and inside [0, 1] on the way.
    let prev = 0;
    for (let i = 1; i <= 100; i++) {
      const y = easeOutFigma(i / 100);
      expect(y).toBeGreaterThanOrEqual(prev);
      expect(y).toBeLessThanOrEqual(1);
      prev = y;
    }
  });

  it('character: the Figma pop-in, invisible at 1.2x until 847.12 ms, landed exactly from 1034.5 ms', () => {
    // Frame 0 and frame 25 (833.3 ms): before the start.
    expect(layerMotion('character', 0)).toEqual({ translateY: 0, scale: 1.2, opacity: 0 });
    expect(layerMotion('character', atFrame(25))).toEqual({ translateY: 0, scale: 1.2, opacity: 0 });
    // Frame 26 (866.7 ms): 19.5 ms in.
    const f26 = layerMotion('character', atFrame(26));
    expect(f26.translateY).toBe(0);
    expect(f26.opacity).toBeCloseTo(0.309, 2);
    expect(f26.scale).toBeCloseTo(1.1664, 3);
    // Frame 28 (933.3 ms): the fade has nearly landed, the scale is about half way.
    const f28 = layerMotion('character', atFrame(28));
    expect(f28.opacity).toBeCloseTo(0.976, 2);
    expect(f28.scale).toBeCloseTo(1.0717, 3);
    // The fade is done at 847.12 + 98.22 ms, while the scale still runs.
    const fadeDone = layerMotion('character', 847.12 + 98.22);
    expect(fadeDone.opacity).toBe(1);
    expect(fadeDone.scale).toBeGreaterThan(1);
    // Not yet identity just before 847.12 + 187.37 = 1034.49 ms; exactly identity from 1034.5 ms.
    expect(layerMotion('character', 1034.4).scale).toBeGreaterThan(1);
    for (const t of [1034.5, 1100, 5000]) expect(layerMotion('character', t)).toEqual(IDENTITY);
  });

  it('background: fades in with a drift of 0.01 x 610 visual units on outQuart, at rest from 600 ms', () => {
    expect(layerMotion('background', 0)).toEqual({ translateY: expect.closeTo(0.01 * VISUAL.h, 9), scale: 1, opacity: 0 });
    // Half way, outQuart(0.5) = 0.9375.
    expect(layerMotion('background', 300)).toEqual({
      translateY: expect.closeTo(0.01 * VISUAL.h * 0.0625, 9), scale: 1, opacity: expect.closeTo(0.9375, 9),
    });
    for (const t of [600, 1000, 5000]) expect(layerMotion('background', t)).toEqual(IDENTITY);
  });

  it('foreground: invisible until 1040 ms, scales 0.92 -> 1 and fades in twice as fast, at rest from 1300 ms', () => {
    for (const t of [0, 847.12, 1000, 1039.9, 1040]) expect(layerMotion('foreground', t).opacity, `${t}`).toBe(0);
    expect(layerMotion('foreground', 1040)).toEqual({ translateY: 0, scale: 0.92, opacity: 0 });
    // 65 ms in (p 0.25): opacity 0.5, scale 0.92 + 0.08 outQuart(0.25).
    expect(layerMotion('foreground', 1105)).toEqual({
      translateY: 0, scale: expect.closeTo(0.92 + 0.08 * (1 - 0.75 ** 4), 9), opacity: expect.closeTo(0.5, 9),
    });
    // The foreground enters after the character has landed (1034.49 ms).
    expect(TIMELINE.foreground[0]).toBeGreaterThan(CHARACTER_POP.startMs + CHARACTER_POP.scaleMs);
    for (const t of [1300, 2000, 5000]) expect(layerMotion('foreground', t)).toEqual(IDENTITY);
  });

  it('legacy interface pops up from 0.043 x 610 at 450 ms, overshooting but <= 1.15', () => {
    expect(layerMotion('interface', 450)).toEqual({ translateY: expect.closeTo(26.23, 6), scale: 0.72, opacity: 0 });
    const s = Array.from({ length: 46 }, (_, i) => layerMotion('interface', 450 + i * 10).scale);
    expect(Math.max(...s)).toBeGreaterThan(1);
    expect(Math.max(...s)).toBeLessThanOrEqual(1.15);
    for (const t of [900, 1500, 5000]) expect(layerMotion('interface', t)).toEqual(IDENTITY);
  });

  it('every layer is exactly identity from the end of its timeline on', () => {
    for (const id of ['background', 'character', 'foreground', 'interface'] as const) {
      const [start, dur] = TIMELINE[id];
      for (const t of [start + dur, start + dur + 1, 10_000]) expect(layerMotion(id, t), `${id} ${t}`).toEqual(IDENTITY);
    }
  });

  it('frame 0: nothing is visible', () => {
    for (const id of ['background', 'character', 'foreground', 'interface'] as const) expect(layerMotion(id, 0).opacity, id).toBe(0);
  });

  it('durations and frames', () => {
    expect(stageDurationSec('none')).toBe(4);
    expect(stageDurationSec('still')).toBe(4);
    expect(stageDurationSec('animated')).toBe(5);
    expect(INTERFACE_ANIM_START_MS).toBe(900);
    expect(msToFrame(900)).toBe(27);
    expect(FOREGROUND_ANIM_START_MS).toBe(1300);
    expect(msToFrame(FOREGROUND_ANIM_START_MS)).toBe(39);
    // The pair's leg (90 frames, its 3 s) from frame 39 has played out inside the 5 s (150-frame) stage.
    expect(msToFrame(FOREGROUND_ANIM_START_MS) + 90).toBeLessThanOrEqual(stageDurationSec('animated') * FPS);
  });
});
