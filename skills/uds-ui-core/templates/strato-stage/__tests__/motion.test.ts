import { describe, it, expect } from 'vitest';
import { layerMotion, stageDurationSec, msToFrame, TIMELINE, INTERFACE_ANIM_START_MS } from '../motion';

// motion.test.ts — two layers (amendment 2026-11-03): character slide-up, interface pop-up
describe('strato-stage motion', () => {
  it('has exactly two layers on the new timeline', () => {
    expect(TIMELINE).toEqual({ character: [0, 550], interface: [450, 450] });
  });
  it('character slides up 0.28 x 610 from frame 0', () => {
    expect(layerMotion('character', 0)).toEqual({ translateY: expect.closeTo(170.8, 6), scale: 1, opacity: 0 });
    expect(layerMotion('character', 550)).toEqual({ translateY: 0, scale: 1, opacity: 1 });
  });
  it('interface pops up from 0.043 x 610 at 450 ms, overshooting but <= 1.15', () => {
    expect(layerMotion('interface', 450)).toEqual({ translateY: expect.closeTo(26.23, 6), scale: 0.72, opacity: 0 });
    const s = Array.from({ length: 46 }, (_, i) => layerMotion('interface', 450 + i * 10).scale);
    expect(Math.max(...s)).toBeGreaterThan(1);
    expect(Math.max(...s)).toBeLessThanOrEqual(1.15);
  });
  it('everything is exactly identity at 900 ms and after', () => {
    for (const id of ['character', 'interface'] as const)
      for (const t of [900, 1500, 5000])
        expect(layerMotion(id, t)).toEqual({ translateY: 0, scale: 1, opacity: 1 });
  });
  it('frame 0: nothing is visible', () => {
    for (const id of ['character', 'interface'] as const) expect(layerMotion(id, 0).opacity).toBe(0);
  });
  it('durations and frames', () => {
    expect(stageDurationSec('none')).toBe(4);
    expect(stageDurationSec('still')).toBe(4);
    expect(stageDurationSec('animated')).toBe(5);
    expect(INTERFACE_ANIM_START_MS).toBe(900);
    expect(msToFrame(900)).toBe(27);
  });
});
