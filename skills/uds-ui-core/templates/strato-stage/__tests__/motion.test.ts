import { describe, it, expect } from 'vitest';
import { layerMotion, stageDurationSec, msToFrame } from '../motion';

// motion.test.ts — option B, the four fixed patterns picked in the stage-b mockup
describe('strato-stage motion', () => {
  it('box rotates in', () => {
    expect(layerMotion('boxBack', 0)).toEqual({ translateY: 0, rotateDeg: -38, scale: 0.82, opacity: 0 });
    expect(layerMotion('boxBack', 500)).toEqual({ translateY: 0, rotateDeg: 0, scale: 1, opacity: 1 });
    expect(layerMotion('boxFore', 100).rotateDeg).toBe(34);
  });
  it('character slides up 0.28 × 610', () => {
    expect(layerMotion('character', 420)).toMatchObject({ translateY: expect.closeTo(170.8, 6), opacity: 0 });
    expect(layerMotion('character', 970)).toMatchObject({ translateY: 0, opacity: 1 });
  });
  it('powder pop overshoots but stays ≤ 1.15', () => {
    const s = Array.from({ length: 46 }, (_, i) => layerMotion('powderBack', 300 + i * 10).scale);
    expect(Math.max(...s)).toBeGreaterThan(1); expect(Math.max(...s)).toBeLessThanOrEqual(1.15); expect(s[0]).toBeCloseTo(0.35, 6);
  });
  it('interface pops up from 0.043 × 610', () => { expect(layerMotion('interface', 850)).toMatchObject({ translateY: expect.closeTo(26.23, 6), scale: 0.72, opacity: 0 }); });
  it('everything settled at 1350 ms', () => {
    for (const id of ['boxBack','boxFore','powderBack','character','powderFore','interface'] as const)
      expect(layerMotion(id, 1350)).toEqual({ translateY: 0, rotateDeg: 0, scale: 1, opacity: 1 });
  });
  it('durations and frames', () => { expect(stageDurationSec('none')).toBe(4); expect(stageDurationSec('still')).toBe(4); expect(stageDurationSec('animated')).toBe(5); expect(msToFrame(1350)).toBe(41); });
});
