import { describe, it, expect } from 'vitest';
import {
  INTERFACE_SLOTS, fitStage, characterRect, faceSafeRect, interfaceSlot,
  interfaceLegDims, interfaceMountRect, promptWindowLeg, STRATO_SIMPLE_ASPECT, PROMPT_WINDOW_GLOW_PAD_OF_W,
  type Rect, type StageMetrics,
} from '../geometry';
// Test-only: the stage's shipped files may not import across directories (see selfContained.test.ts).
import { STRATO_SIMPLE } from '../../product-pop-out/promptWindow.strato';

// geometry.test.ts — values measured from Figma 663:8787 / 663:9864 (see README table)
describe('strato-stage geometry', () => {
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

// The AI prompt highlight leg (ruling R33): the canvas IS the floating STRATO prompt-simple pill,
// padded on every side so its glow (the pill blurred by 0.13 x width) is not clipped by the leg.
describe('strato-stage prompt-window leg', () => {
  const FH = INTERFACE_SLOTS['feature-highlight'];
  /** The pill's own rect in leg px: PromptWindow is absolute, bottom-anchored at (left, bottom). */
  const pillInLeg = (l: ReturnType<typeof promptWindowLeg>) => {
    const ph = l.promptWindow.width / STRATO_SIMPLE_ASPECT;
    return { x: l.promptWindow.left, y: l.canvas.h - l.promptWindow.bottom - ph, w: l.promptWindow.width, h: ph };
  };
  /** Every leg must keep the pill centred and its props consistent with the canvas. */
  const expectCentred = (l: ReturnType<typeof promptWindowLeg>) => {
    const p = pillInLeg(l);
    expect(p.x + p.w / 2).toBeCloseTo(l.canvas.w / 2, 9);
    expect(p.y + p.h / 2).toBeCloseTo(l.canvas.h / 2, 9);
    expect(p.x).toBeGreaterThanOrEqual(0); expect(p.y).toBeGreaterThanOrEqual(0);
  };

  it('the pill aspect is the shipped STRATO_SIMPLE.aspect; the pad is 0.3 of the pill width', () => {
    expect(STRATO_SIMPLE_ASPECT).toBe(STRATO_SIMPLE.aspect);
    expect(STRATO_SIMPLE_ASPECT).toBe(4.8404);
    expect(PROMPT_WINDOW_GLOW_PAD_OF_W).toBe(0.3);
  });

  it('feature-highlight slot: pill 769 wide, pad 231, canvas 1231 x 621, PromptWindow at (231, 231.06)', () => {
    const l = promptWindowLeg(FH);
    expect(l.canvas).toEqual({ w: 1231, h: 621 });
    expect(l.promptWindow).toEqual({ variant: 'prompt-simple', width: 769, left: 231, bottom: (621 - 769 / 4.8404) / 2 });
    expect(l.promptWindow.bottom).toBeCloseTo(231.0644, 4);
    expectCentred(l);
  });

  it('mounted at half scale on the slot, the pill lands on the slot (Figma 663:9895)', () => {
    const l = promptWindowLeg(FH);
    const m = interfaceMountRect(FH, l.canvas);
    const p = pillInLeg(l);
    const pill = { x: m.x + p.x / 2, y: m.y + p.y / 2, w: p.w / 2, h: p.h / 2 };
    // Width: within 1 px (2 x 384.7 rounds to 769, so 384.5 vs 384.7).
    expect(Math.abs(pill.x - FH.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(pill.w - FH.w)).toBeLessThanOrEqual(1);
    expect(Math.abs(pill.x + pill.w - (FH.x + FH.w))).toBeLessThanOrEqual(1);
    // Height: the pill's own aspect (4.8404) is not the slot's (4.913), so it may differ by that much
    // (1.18 visual units), centred on the slot.
    expect(Math.abs(pill.h - FH.h)).toBeLessThanOrEqual(Math.abs(FH.w / STRATO_SIMPLE_ASPECT - FH.h));
    expect(pill.y + pill.h / 2).toBeCloseTo(FH.y + FH.h / 2, 9);
    expect(pill).toEqual({ x: expect.closeTo(90.3, 9), y: expect.closeTo(327.73, 2), w: 384.5, h: expect.closeTo(79.436, 3) });
  });

  it('raised canvas (min 320 x 180, then out of the <= 512 band): the pill keeps its size, centred', () => {
    // natural 320 x 161 -> 320 x 180 -> both <= 512 -> long side 513
    const l = promptWindowLeg({ w: 100, h: 20 });
    expect(l.canvas).toEqual({ w: 513, h: 289 });
    expect(l.promptWindow).toMatchObject({ variant: 'prompt-simple', width: 200, left: 156.5 });
    expect(l.promptWindow.bottom).toBeCloseTo((289 - 200 / 4.8404) / 2, 9);
    expectCentred(l);
    // natural 512 x 258 is inside the band too: only the canvas grows.
    const edge = promptWindowLeg({ w: 160, h: 10 });
    expect(edge.canvas).toEqual({ w: 513, h: 259 });
    expect(edge.promptWindow).toMatchObject({ width: 320, left: 96.5 });
    expectCentred(edge);
    // natural 516 x 261 is already out of the band: unchanged, left = pad.
    expect(promptWindowLeg({ w: 161, h: 10 }).canvas).toEqual({ w: 516, h: 261 });
    expect(promptWindowLeg({ w: 161, h: 10 }).promptWindow).toMatchObject({ width: 322, left: 97 });
  });

  it('capped canvas (max 1920 x 1080): the pill and its pad shrink together, centred', () => {
    // 2 x 700 = 1400 would need a 2240-wide canvas; the largest pill that fits is 1200 (pad 360).
    const l = promptWindowLeg({ w: 700, h: 100 });
    expect(l.canvas).toEqual({ w: 1920, h: 968 });
    expect(l.promptWindow).toMatchObject({ variant: 'prompt-simple', width: 1200, left: 360 });
    expect(l.promptWindow.bottom).toBeCloseTo((968 - 1200 / 4.8404) / 2, 9);
    expectCentred(l);
    // One more px of pill would not fit.
    expect(1201 + 2 * Math.round(0.3 * 1201)).toBeGreaterThan(1920);
  });

  it('every slot width gives a canvas inside agent-svc\'s range, out of the small band, with the pill centred', () => {
    for (let w = 1; w <= 1000; w += 7.3) {
      const l = promptWindowLeg({ w, h: 50 });
      expect(Number.isInteger(l.canvas.w) && Number.isInteger(l.canvas.h)).toBe(true);
      expect(l.canvas.w).toBeGreaterThanOrEqual(320); expect(l.canvas.w).toBeLessThanOrEqual(1920);
      expect(l.canvas.h).toBeGreaterThanOrEqual(180); expect(l.canvas.h).toBeLessThanOrEqual(1080);
      expect(l.canvas.w > 512 || l.canvas.h > 512).toBe(true);
      expectCentred(l);
    }
  });

  it('the slot height plays no part: the pill height comes from its own aspect', () => {
    expect(promptWindowLeg({ w: FH.w, h: 1 })).toEqual(promptWindowLeg(FH));
  });

  it('rejects a slot it cannot draw a pill for: non-finite or non-positive sizes, or a pill under 1 px', () => {
    // Infinity last: before R37 the cap walk never ended on it.
    const bad = [
      { w: 0, h: 50 }, { w: -1, h: 50 }, { w: NaN, h: 50 }, { w: 0.2, h: 50 },
      { w: 100, h: 0 }, { w: 100, h: -5 }, { w: 100, h: NaN }, { w: 100, h: Infinity }, { w: Infinity, h: 50 },
    ];
    for (const slot of bad) {
      expect(() => promptWindowLeg(slot), JSON.stringify(slot)).toThrow(RangeError);
      expect(() => promptWindowLeg(slot)).toThrow(/promptWindowLeg: the slot needs/);
    }
    // The smallest slot that draws a 1 px pill is accepted.
    expect(promptWindowLeg({ w: 0.25, h: 50 }).promptWindow.width).toBe(1);
  });

  it('the cap walk is bounded: a huge slot width gives the capped leg at once', () => {
    expect(promptWindowLeg({ w: 1e12, h: 50 })).toEqual(promptWindowLeg({ w: 700, h: 100 }));
    expect(promptWindowLeg({ w: 1e12, h: 50 }).canvas).toEqual({ w: 1920, h: 968 });
  });
});
