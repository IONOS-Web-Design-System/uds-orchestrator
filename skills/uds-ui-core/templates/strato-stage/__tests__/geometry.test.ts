import { describe, it, expect } from 'vitest';
import {
  POSES, INTERFACE_SLOTS, fitStage, characterRect, faceSafeRect, interfaceSlot,
  interfaceLegDims, interfaceMountRect, type Rect, type StageMetrics,
} from '../geometry';

// geometry.test.ts — values measured from Figma 663:8787 / 663:9864 / 663:8718 (see README table)
describe('strato-stage geometry', () => {
  it('poses match Figma', () => {
    expect(POSES.boxBack).toEqual({ cx: 564.002, cy: 315.415, rotateDeg: -173, mirror: false });
    expect(POSES.boxFore).toEqual({ cx: 563.78, cy: 340.414, rotateDeg: -15, mirror: false });
    // powder component export = raw image mirrored, so poses are relative to the EXPORT:
    expect(POSES.powderBack).toEqual({ cx: 822.994, cy: 370.458, rotateDeg: 8.934, mirror: false });
    expect(POSES.powderFore).toEqual({ cx: 705.323, cy: 600.561, rotateDeg: -18, mirror: true });
  });

  it('fits 1280x960 into the content box', () => {
    const f = fitStage({ w: 1280, h: 960 }, { right: 0.32, bottom: 0.22 });
    expect(f.content).toEqual({ x: 0, y: 0, w: 870.4, h: 748.8 });
    expect(f.scale).toBeCloseTo(1.22754, 4); expect(f.originX).toBeCloseTo(22.746, 2); expect(f.originY).toBeCloseTo(0, 6);
  });
  it('fits 1600x900 (wide) — centred', () => { const f = fitStage({ w: 1600, h: 900 }, { right: 0.32, bottom: 0.22 }); expect(f.scale).toBeCloseTo(1.15082, 4); expect(f.originX).toBeCloseTo(157.32, 1); });
  it('fits 960x1080 (portrait) — bottom-anchored', () => { const f = fitStage({ w: 960, h: 1080 }, { right: 0.32, bottom: 0.22 }); expect(f.scale).toBeCloseTo(0.971429, 5); expect(f.originY).toBeCloseTo(249.83, 1); });
  it('no safeArea = whole canvas', () => { expect(fitStage({ w: 672, h: 610 }).scale).toBe(1); });

  const M: StageMetrics = { headTopFrac: 0.05, bottomFrac: 1, leftFrac: 0.1, rightFrac: 0.9, subjectHeightFrac: 0.95, centerXFrac: 0.5, imgW: 960, imgH: 1280, upperBodyLeftFrac: 0.3, upperBodyRightFrac: 0.7 };
  it('characterRect puts head top and centre on the anchor', () => {
    const r = characterRect(M);
    expect(r.y + M.headTopFrac * r.h).toBeCloseTo(22, 6); expect(r.x + M.centerXFrac * r.w).toBeCloseTo(480, 6);
    expect(M.subjectHeightFrac * r.h).toBeCloseTo(661, 6); expect(r.w / r.h).toBeCloseTo(960 / 1280, 6);
  });
  it('faceSafeRect', () => { const r = characterRect(M), f = faceSafeRect(M);
    expect(f.y).toBeCloseTo(22, 6); expect(f.h).toBeCloseTo(207.4, 6);
    expect(f.x).toBeCloseTo(r.x + 0.3 * r.w - 13.44, 6); expect(f.w).toBeCloseTo(0.4 * r.w + 26.88, 6); });
  it('slots', () => {
    expect(INTERFACE_SLOTS['feature-highlight']).toEqual({ x: 90.2, y: 328.3, w: 384.7, h: 78.3 }); // Figma 663:9895
    expect(INTERFACE_SLOTS['live-app']).toEqual({ x: 40, y: 250, w: 380, h: 285 });             // provisional
    expect(interfaceSlot('feature-highlight', faceSafeRect(M))).toEqual(INTERFACE_SLOTS['feature-highlight']);
    expect(interfaceSlot('feature-highlight', { x: 0, y: 300, w: 672, h: 100 }).y).toBeCloseTo(408, 6); // nudged below + 8
    expect(interfaceSlot('live-app', { x: 0, y: 200, w: 672, h: 300 }).y).toBeCloseTo(610 - 285, 6);   // clamped to frame
  });
  it('leg dims', () => {
    expect(interfaceLegDims(INTERFACE_SLOTS['feature-highlight'])).toEqual({ w: 769, h: 180 });
    expect(interfaceLegDims(INTERFACE_SLOTS['live-app'])).toEqual({ w: 760, h: 570 });
    expect(interfaceLegDims({ x: 0, y: 0, w: 100, h: 100 })).toEqual({ w: 513, h: 321 }); // 320x200 both ≤512 → long side 513
  });
  it('mount rect = leg at half scale centred on slot', () => {
    expect(interfaceMountRect(INTERFACE_SLOTS['feature-highlight'], { w: 769, h: 180 }))
      .toEqual({ x: expect.closeTo(90.3, 1), y: expect.closeTo(322.45, 2), w: 384.5, h: 90 });
  });
  it('extreme canvases keep head and interface inside the content box', () => {  // Review Focus 1
    for (const c of [{ w: 1920, h: 256 }, { w: 320, h: 1080 }, { w: 960, h: 1080 }]) {
      const f = fitStage(c, { right: 0.32, bottom: 0.22 });
      const toCanvas = (r: Rect) => ({ x: f.originX + r.x * f.scale, y: f.originY + r.y * f.scale, w: r.w * f.scale, h: r.h * f.scale });
      const head = toCanvas({ x: 480, y: 22, w: 0, h: 0 });
      const ifc = toCanvas(interfaceMountRect(INTERFACE_SLOTS['live-app'], interfaceLegDims(INTERFACE_SLOTS['live-app'])));
      for (const p of [head, ifc]) { expect(p.x).toBeGreaterThanOrEqual(0); expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.x + p.w).toBeLessThanOrEqual(f.content.w + 1e-6); expect(p.y + p.h).toBeLessThanOrEqual(f.content.h + 1e-6); }
    }
  });
});
