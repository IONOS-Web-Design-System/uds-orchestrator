import { describe, it, expect } from 'vitest';
import {
  INTERFACE_SLOTS, DEFAULT_METRICS, fitStage, characterRect, faceSafeRect, interfaceSlot,
  interfaceLegDims, interfaceMountRect, promptWindowLeg, placeStage, STRATO_SIMPLE_ASPECT, PROMPT_WINDOW_GLOW_PAD_OF_W,
  type InterfaceKind, type Rect, type StageFit, type StageMetrics,
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

// Placement (spec 2026-11-05 §4.1, task C3; the waist on the 8 % margin line, task C6): a waist-up
// character that is never clipped except below the waist, at the content bottom, grown into the
// height on portrait canvases; the interface keeps the width-fit scale and its offset from the
// character. Every expected value is computed here from the rules (or from today's mapping),
// never read back from placeStage.
describe('strato-stage placement (placeStage)', () => {
  const SA = { right: 0.16, bottom: 0.08 }; // the moderator's STRATO_STAGE safe area (C6, 2026-11-06)
  /** An upright, narrow waist-up pose (ruling C3a). */
  const NARROW: StageMetrics = {
    headTopFrac: 0.05, waistFrac: 0.55, leftFrac: 0.3, rightFrac: 0.7, subjectHeightFrac: 0.9, bottomFrac: 0.95,
    centerXFrac: 0.5, upperBodyLeftFrac: 0.3, upperBodyRightFrac: 0.7, imgW: 1536, imgH: 2048,
  };
  /** Arms flung wide (2 % to 99 % of the width) and raised to the image top (ruling C3b). */
  const WIDE: StageMetrics = { ...NARROW, leftFrac: 0.02, rightFrac: 0.99, headTopFrac: 0, subjectHeightFrac: 0.95, centerXFrac: 0.505 };
  /** A very wide pose: a square cutout, head-to-waist only 30 % of it, arms across the whole width.
   *  It shrinks hard, so the rule would put its live-app card into the 8 % strip (C6 fix). */
  const VERY_WIDE: StageMetrics = {
    ...NARROW, imgW: 2048, imgH: 2048, headTopFrac: 0.1, waistFrac: 0.4, leftFrac: 0, rightFrac: 1,
    subjectHeightFrac: 0.9, bottomFrac: 1, centerXFrac: 0.5,
  };
  /** One arm flung out to the left: the bbox centre (the anchor) sits left of the upper body, so the
   *  live-app card's right edge meets the face-safe band's left edge as the aspect changes. */
  const ONE_ARM: StageMetrics = { ...NARROW, leftFrac: 0.1, centerXFrac: 0.4, upperBodyLeftFrac: 0.35, upperBodyRightFrac: 0.6 };
  /** The same with the upper body further right: the live-app card sits clearly beside the face. */
  const FACE_RIGHT: StageMetrics = { ...ONE_ARM, upperBodyLeftFrac: 0.4, upperBodyRightFrac: 0.65 };
  /** The interface's vertical offset from the head top scales by the waist span on the waist path
   *  (ruling on C6 concern 3): head-to-waist 588 stands where the Figma's 661 stood. */
  const WAIST_RATIO = 588 / 661;
  type Leg = { kind: InterfaceKind; legW: number; legH: number };
  const HIGHLIGHT: Leg = { kind: 'feature-highlight', legW: 769, legH: 180 };
  const AI: Leg = { kind: 'feature-highlight', legW: 1231, legH: 621 }; // the AI prompt leg (promptWindowLeg)
  const LIVE_APP: Leg = { kind: 'live-app', legW: 760, legH: 570 };
  const CANVASES = [{ w: 1280, h: 960 }, { w: 1600, h: 900 }, { w: 1024, h: 1024 }, { w: 1536, h: 2048 }, { w: 2048, h: 2048 }];
  // Down to 1024 so the sweep still reaches nearly 3:4 with the 8 % bottom margin (at 1150 it is p = 0.80).
  const SWEEP: { w: number; h: number }[] = [];
  for (let w = 2048; w >= 1024; w -= 16) SWEEP.push({ w, h: 1280 });

  /** Today's layout: visual units through the fit (fitStage's scale and origin). */
  const today = (r: Rect, f: StageFit): Rect => ({ x: f.originX + r.x * f.scale, y: f.originY + r.y * f.scale, w: r.w * f.scale, h: r.h * f.scale });
  const expectRect = (a: Rect | null, b: Rect, digits = 9) => {
    expect(a).not.toBeNull();
    for (const k of ['x', 'y', 'w', 'h'] as const) expect(a![k], k).toBeCloseTo(b[k], digits);
  };
  /** The character's measured extent in canvas px, read off its rect. */
  const extent = (r: Rect, m: StageMetrics) => ({
    left: r.x + m.leftFrac * r.w,
    right: r.x + m.rightFrac * r.w,
    top: r.y + m.headTopFrac * r.h,
    waist: r.y + (m.waistFrac ?? m.bottomFrac) * r.h,
    centreX: r.x + m.centerXFrac * r.w,
  });
  /** The rules' numbers before the never-clipped step, from fitStage alone. */
  const rules = (canvas: { w: number; h: number }) => {
    const f = fitStage(canvas, SA);
    const p = Math.min(1, Math.max(0, (672 / 610 - f.content.w / f.content.h) / (672 / 610 - 0.75)));
    const c1 = (0.75 * f.content.h) / 588;
    return { f, p, c: f.scale + (c1 - f.scale) * p, x0: f.originX + 480 * f.scale };
  };
  /** The character in visual units with head-to-waist `span` tall (588 since C6; C3 had 661): head
   *  top on 22, centre on 480, at the native aspect. The rule itself, not characterRect. */
  const waistRule = (m: StageMetrics, span: number): Rect => {
    const k = span / ((m.waistFrac! - m.headTopFrac) * m.imgH);
    const w = m.imgW * k;
    const h = m.imgH * k;
    return { x: 480 - m.centerXFrac * w, y: 22 - m.headTopFrac * h, w, h };
  };
  /** The extent's offsets from the anchor centre (480), in visual units. */
  const offsets = (m: StageMetrics) => {
    const r = characterRect(m);
    return { dl: r.x + m.leftFrac * r.w - 480, dr: r.x + m.rightFrac * r.w - 480 };
  };
  const slotOf = (leg: Leg, m: StageMetrics) => interfaceSlot(leg.kind, faceSafeRect(m));
  /** The slot centre's offset below the head top, in visual units (feature-highlight: 345.45). */
  const slotDrop = (leg: Leg, m: StageMetrics) => slotOf(leg, m).y + slotOf(leg, m).h / 2 - 22;
  /** The face-safe band (faceSafeRect) placed with the character: its centre x, head top and final scale. */
  const placedFaceSafe = (pl: ReturnType<typeof placeStage>, m: StageMetrics): Rect => {
    const e = extent(pl.character, m);
    const fs = faceSafeRect(m);
    return { x: e.centreX + (fs.x - 480) * pl.charScale, y: e.top + (fs.y - 22) * pl.charScale, w: fs.w * pl.charScale, h: fs.h * pl.charScale };
  };
  const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const mountOf = (leg: Leg, m: StageMetrics) => interfaceMountRect(slotOf(leg, m), { w: leg.legW, h: leg.legH });
  /** The visible content of a placed leg (canvas px): for the AI prompt leg the pill, read off the
   *  shipped PromptWindow props (bottom-anchored at left/bottom in leg px), else the whole leg. */
  const visibleOf = (r: Rect, leg: Leg): Rect => {
    if (leg !== AI) return r;
    const pw = promptWindowLeg(INTERFACE_SLOTS['feature-highlight']);
    const k = r.w / leg.legW;
    const ph = pw.promptWindow.width / STRATO_SIMPLE_ASPECT;
    return { x: r.x + pw.promptWindow.left * k, y: r.y + (leg.legH - pw.promptWindow.bottom - ph) * k, w: pw.promptWindow.width * k, h: ph * k };
  };
  const expectInside = (r: Rect, canvas: { w: number; h: number }, at: string) => {
    expect(r.x, at).toBeGreaterThanOrEqual(-1e-9);
    expect(r.y, at).toBeGreaterThanOrEqual(-1e-9);
    expect(r.x + r.w, at).toBeLessThanOrEqual(canvas.w + 1e-9);
    expect(r.y + r.h, at).toBeLessThanOrEqual(canvas.h + 1e-9);
  };

  it('the AI leg fixture is the shipped promptWindowLeg canvas', () => {
    expect(promptWindowLeg(INTERFACE_SLOTS['feature-highlight']).canvas).toEqual({ w: AI.legW, h: AI.legH });
  });

  it('no waistFrac keeps bbox scaling (an older moderator): the subject bbox is 661 tall, as before', () => {
    const k = 661 / (0.95 * 2048);
    const r = characterRect(DEFAULT_METRICS);
    expectRect(r, { x: 480 - 0.5 * 1536 * k, y: 22 - 0.05 * 2048 * k, w: 1536 * k, h: 2048 * k }, 12);
    // Absent, or unusable (at or above the head top, or not a number), is the same: never Infinity.
    for (const waistFrac of [undefined, 0.05, 0.02, Number.NaN]) {
      expect(characterRect({ ...DEFAULT_METRICS, waistFrac }), String(waistFrac)).toEqual(r);
    }
    // A usable waist does change it, so the cases above are not vacuous.
    expect(characterRect({ ...DEFAULT_METRICS, waistFrac: 0.55 }).h).toBeGreaterThan(1.5 * r.h);
    // placeStage keeps the old placement too: the head top on content bottom - 588 c, the bbox
    // bottom 73 c below the content bottom (into the root clip), not on it.
    for (const canvas of [{ w: 1280, h: 960 }, { w: 1536, h: 2048 }]) {
      const { f, c } = rules(canvas);
      const pl = placeStage({ canvas, safeArea: SA });
      expect(pl.charScale).toBeCloseTo(c, 12); // a normal pose: not shrunk
      const e = extent(pl.character, DEFAULT_METRICS); // no waistFrac: `waist` is the bbox bottom
      expect(e.top).toBeCloseTo(f.content.h - 588 * c, 9);
      expect(e.waist).toBeCloseTo(f.content.h + 73 * c, 9);
    }
  });

  it('waistFrac sizes head-to-waist to 588 (610 - 22): head top on 22, centre on 480, the waist on the frame bottom', () => {
    for (const m of [NARROW, WIDE]) {
      const r = characterRect(m);
      expect((m.waistFrac! - m.headTopFrac) * r.h).toBeCloseTo(588, 9);
      expect(r.y + m.headTopFrac * r.h).toBeCloseTo(22, 9);
      expect(r.x + m.centerXFrac * r.w).toBeCloseTo(480, 9);
      expect(r.w / r.h).toBeCloseTo(1536 / 2048, 12);
      expect(r.y + m.waistFrac! * r.h).toBeCloseTo(610, 9); // the waist ON the frame bottom (C3: 73 below it)
      expectRect(r, waistRule(m, 588), 12);
      // 588/661 the size of C3's rule (about 11 % smaller), with the same head top and centre.
      expect(r.h / waistRule(m, 661).h).toBeCloseTo(588 / 661, 12);
    }
  });

  it('landscape 1280x960 and 1600x900 with {0.16, 0.08}: p = 0; the character keeps today\'s head top and centre at 588/661 the size, the interface today\'s x and size at its chest height', () => {
    for (const canvas of [{ w: 1280, h: 960 }, { w: 1600, h: 900 }]) {
      const f = fitStage(canvas, SA);
      for (const m of [NARROW, DEFAULT_METRICS]) {
        for (const leg of [HIGHLIGHT, AI, LIVE_APP]) {
          const pl = placeStage({ canvas, safeArea: SA, metrics: m, iface: leg });
          expect(pl.portraitness).toBe(0);
          expect(pl.charScale).toBeCloseTo(f.scale, 12);
          expect(pl.ifaceScale).toBeCloseTo(f.scale, 12);
          // A measured waist: the 588 rule. None (an older moderator): the subject bbox, as before.
          expectRect(pl.character, today(m === NARROW ? waistRule(m, 588) : characterRect(m), f));
          const t = today(mountOf(leg, m), f);
          if (m === DEFAULT_METRICS) {
            expectRect(pl.iface, t); // no waist: today's offset, exactly
          } else if (leg !== LIVE_APP) {
            // The offset from the head top scales by 588/661: up by (slotDrop - 22 ...) x s x 73/661.
            expectRect(pl.iface, { ...t, y: t.y - slotDrop(leg, m) * f.scale * (1 - WAIST_RATIO) });
          } else {
            // The live-app card is nudged below the face-safe band (see the face-safe test); x and size are today's.
            for (const k of ['x', 'w', 'h'] as const) expect(pl.iface![k], k).toBeCloseTo(t[k], 9);
          }
        }
      }
      // Against C3's 661 rule: 588/661 the size, the head top and centre unchanged.
      const c3 = today(waistRule(NARROW, 661), f);
      const pl = placeStage({ canvas, safeArea: SA, metrics: NARROW });
      expect(pl.character.w / c3.w).toBeCloseTo(588 / 661, 12);
      expect(pl.character.h / c3.h).toBeCloseTo(588 / 661, 12);
      expect(extent(pl.character, NARROW).top).toBeCloseTo(extent(c3, NARROW).top, 9);
      expect(extent(pl.character, NARROW).centreX).toBeCloseTo(extent(c3, NARROW).centreX, 9);
    }
    // Pinned at 1280x960: content 1075.2 x 883.2, scale 883.2/610, frame centred in the content width.
    const s = 883.2 / 610;
    const pl = placeStage({ canvas: { w: 1280, h: 960 }, safeArea: SA, metrics: NARROW });
    const e = extent(pl.character, NARROW);
    expect(e.top).toBeCloseTo(883.2 - 588 * s, 9); // 31.86: originY + 22 * scale
    expect(e.centreX).toBeCloseTo((1075.2 - 672 * s) / 2 + 480 * s, 9); // 746.11
    expect(e.waist).toBeCloseTo(883.2, 9); // on the content bottom (C3's rule: 883.2 + 73 s = 988.9)
    expect(pl.iface).toBeNull();
  });

  it('the waist sits exactly on the content bottom (the 8 % margin line) and head-to-waist is 588 x the scale', () => {
    for (const canvas of [{ w: 1280, h: 960 }, { w: 1600, h: 900 }, { w: 1536, h: 2048 }, { w: 2048, h: 2048 }]) {
      const { f, c } = rules(canvas);
      expect(f.content.h).toBeCloseTo(0.92 * canvas.h, 9);
      for (const m of [NARROW, WIDE]) {
        const at = `${canvas.w}x${canvas.h} ${m === NARROW ? 'narrow' : 'wide'}`;
        const pl = placeStage({ canvas, safeArea: SA, metrics: m, iface: AI });
        const e = extent(pl.character, m);
        expect(Math.abs(e.waist - f.content.h), at).toBeLessThanOrEqual(1); // C3's rule put it 73 c (>= 99 px) below
        expect(e.waist, at).toBeCloseTo(f.content.h, 9);
        expect(Math.abs(e.waist - e.top - 588 * pl.charScale), at).toBeLessThanOrEqual(1);
        if (m === NARROW) {
          expect(pl.charScale, at).toBeCloseTo(c, 12); // never shrunk, so ...
          expect(Math.abs(e.waist - e.top - 588 * c), at).toBeLessThanOrEqual(1); // ... head-to-waist is 588 c
        }
        // The cutout runs on below the waist, so it is the stage root's clip at the content bottom
        // (styles.test.ts) that hides it: the 8 % strip below stays empty.
        expect(pl.character.y + pl.character.h, at).toBeGreaterThan(f.content.h);
      }
    }
  });

  it('landscape: the AI prompt leg keeps today\'s x and size, raised to chest height; its glow pad may cross the edge as before, its pill is inside', () => {
    for (const canvas of [{ w: 1280, h: 960 }, { w: 1600, h: 900 }, { w: 1280, h: 1024 }]) {
      const f = fitStage(canvas, SA);
      const t = today(mountOf(AI, NARROW), f);
      const pl = placeStage({ canvas, safeArea: SA, metrics: NARROW, iface: AI });
      expect(pl.portraitness).toBe(0);
      const r = pl.iface!;
      const raised = { ...t, y: t.y - slotDrop(AI, NARROW) * f.scale * (1 - WAIST_RATIO) };
      expectRect(r, raised);
      expect(Math.abs(r.x - t.x)).toBeLessThanOrEqual(1); // the ruling's +-1 px horizontally (C3)
      expectInside(visibleOf(r, AI), canvas, `${canvas.w}x${canvas.h} pill`);
    }
    // At 1280x1024 the transparent pad runs ~20 px past the left edge (a content box would have cut it).
    expect(today(mountOf(AI, NARROW), fitStage({ w: 1280, h: 1024 }, SA)).x).toBeLessThan(-15);
  });

  it('the visible interface is clamped inside the canvas, not the AI prompt leg\'s glow pad', () => {
    // A card (live-app: the mount is the slot) beside a wide pose slid to the centre: the rule puts
    // it past the left edge, so it is clamped to touch the edge; its height follows the rule.
    {
      const canvas = { w: 1536, h: 2048 };
      const f = fitStage(canvas, SA);
      const pl = placeStage({ canvas, safeArea: SA, metrics: WIDE, iface: LIVE_APP });
      const e = extent(pl.character, WIDE);
      const slot = slotOf(LIVE_APP, WIDE);
      const w = (LIVE_APP.legW / 2) * f.scale;
      const h = (LIVE_APP.legH / 2) * f.scale;
      const cx = e.centreX - (480 - (slot.x + slot.w / 2)) * f.scale;
      expect(cx - w / 2).toBeLessThan(-50); // the guard can fail: unclamped it crosses (-76.8)
      // Its height: below the face-safe band (+ 8), where the chest-height rule would overlap it (face-safe test).
      expectRect(pl.iface, { x: 0, y: e.top + (207.4 + 8) * pl.charScale, w, h });
    }
    // The AI prompt leg with no right margin (s = W / 672): the rule puts the PILL past the left
    // edge. The pill is clamped to touch it; the leg runs past it by exactly its glow pad.
    {
      const canvas = { w: 1536, h: 2048 };
      const sa = { right: 0, bottom: 0 };
      const s = fitStage(canvas, sa).scale;
      const pl = placeStage({ canvas, safeArea: sa, metrics: WIDE, iface: AI });
      const e = extent(pl.character, WIDE);
      const pw = promptWindowLeg(INTERFACE_SLOTS['feature-highlight']);
      const pillW = (pw.promptWindow.width / 2) * s;
      const cx = e.centreX - (480 - (slotOf(AI, WIDE).x + slotOf(AI, WIDE).w / 2)) * s;
      expect(cx - pillW / 2).toBeLessThan(-100); // the guard can fail: unclamped the pill crosses (-122.8)
      const pill = visibleOf(pl.iface!, AI);
      expect(pill.x).toBeCloseTo(0, 9);
      expect(pl.iface!.x).toBeCloseTo(-(pw.promptWindow.left / 2) * s, 9); // the pad, 231 leg px at half scale
      expect(pl.iface!.w).toBeCloseTo((AI.legW / 2) * s, 9);
    }
  });

  it('portrait 1536x2048: p = 1, head top 25 % down the content height, waist on the content bottom, interface at the width-fit scale', () => {
    const canvas = { w: 1536, h: 2048 };
    const { f, p, x0 } = rules(canvas);
    const Hc = f.content.h; // 1884.16: the canvas minus the 8 % margin
    expect(p).toBe(1); // content 1290.24 x 1884.16 is narrower than 3:4
    const c1 = (0.75 * Hc) / 588; // 2.403, grown from the width-fit 1.92
    for (const leg of [HIGHLIGHT, AI, LIVE_APP]) {
      const pl = placeStage({ canvas, safeArea: SA, metrics: NARROW, iface: leg });
      expect(pl.portraitness).toBe(1);
      expect(pl.charScale).toBeCloseTo(c1, 12);
      expect(pl.ifaceScale).toBeCloseTo(f.scale, 12);
      const e = extent(pl.character, NARROW);
      expect(Math.abs(e.top - 0.25 * Hc)).toBeLessThanOrEqual(20);
      expect(e.top).toBeCloseTo(0.25 * Hc, 9); // 471.04
      expect(e.waist).toBeCloseTo(Hc, 9); // on the 8 % margin line (C3's rule: Hc + 73 c1, below the canvas)
      expect(e.centreX).toBeCloseTo(x0, 9); // a narrow pose fits where it is: no slide
      expect(pl.character.w).toBeCloseTo(waistRule(NARROW, 588).w * c1, 9);
      // Centre (charCentreX - (480 - slotCentreX) * s, headTop + (slotCentreY - 22) * c * 588/661), size at s.
      const slot = slotOf(leg, NARROW);
      const w = (leg.legW / 2) * f.scale;
      const h = (leg.legH / 2) * f.scale;
      const cx = x0 - (480 - (slot.x + slot.w / 2)) * f.scale;
      const cy = 0.25 * Hc + slotDrop(leg, NARROW) * c1 * WAIST_RATIO;
      expectRect(pl.iface, { x: cx - w / 2, y: cy - h / 2, w, h });
    }
  });

  it('wide and raised poses never cross the canvas: landscape keeps the centre and only shrinks, portrait slides then shrinks', () => {
    const { dl, dr } = offsets(WIDE);
    // The guard can fail: unshrunk, the wide pose crosses the right edge in today's 1280x960 layout ...
    expect(extent(today(characterRect(WIDE), fitStage({ w: 1280, h: 960 }, SA)), WIDE).right).toBeGreaterThan(1280);
    // ... and grown for portrait at 1536x2048, it crosses both edges.
    const port = rules({ w: 1536, h: 2048 });
    expect(port.x0 + dl * port.c).toBeLessThan(0);
    expect(port.x0 + dr * port.c).toBeGreaterThan(1536);

    for (const canvas of [{ w: 1280, h: 960 }, { w: 1536, h: 2048 }]) {
      const { f, p, c, x0 } = rules(canvas);
      const pl = placeStage({ canvas, safeArea: SA, metrics: WIDE, iface: AI });
      const e = extent(pl.character, WIDE);
      expect(e.left).toBeGreaterThanOrEqual(-1e-9);
      expect(e.right).toBeLessThanOrEqual(canvas.w + 1e-9);
      expect(e.top).toBeGreaterThanOrEqual(0);
      expect(Math.min(e.left, canvas.w - e.right)).toBeCloseTo(0, 9); // just enough: it touches an edge
      expect(e.waist).toBeCloseTo(f.content.h, 9); // shrunk about the waist line: it stays on the content bottom
      expect(pl.charScale).toBeLessThan(c);
      if (p === 0) {
        expect(e.centreX).toBeCloseTo(x0, 9); // landscape keeps the Figma anchor ...
        expect(pl.charScale).toBeCloseTo((canvas.w - x0) / dr, 9); // ... and shrinks until the right edge fits
      } else {
        // Wider than the canvas even after sliding: slid to where the least shrink fits (the
        // centre, for this symmetric extent), then shrunk to the width.
        expect(p).toBe(1);
        expect(e.centreX).toBeCloseTo(canvas.w / 2, 9);
        expect(Math.abs(e.centreX - x0)).toBeGreaterThan(100);
        expect(pl.charScale).toBeCloseTo(canvas.w / (dr - dl), 9);
      }
      // The interface follows the slid, shrunk character: its centre x, and its head top and final scale.
      const hl = placeStage({ canvas, safeArea: SA, metrics: WIDE, iface: HIGHLIGHT });
      const slot = slotOf(HIGHLIGHT, WIDE);
      const w = (HIGHLIGHT.legW / 2) * f.scale;
      const h = (HIGHLIGHT.legH / 2) * f.scale;
      const cx = e.centreX - (480 - (slot.x + slot.w / 2)) * f.scale;
      const cy = e.top + slotDrop(HIGHLIGHT, WIDE) * pl.charScale * WAIST_RATIO;
      expect(cx - w / 2).toBeGreaterThan(0); // inside: no clamp in play, so this is the offset rule itself
      expect(cy + h / 2).toBeLessThan(f.content.h);
      expectRect(hl.iface, { x: cx - w / 2, y: cy - h / 2, w, h });
    }
  });

  it('between landscape and portrait the slide is p x the needed shift, and the shrink covers the rest (1024x1024, 1104x1280)', () => {
    const { dl, dr } = offsets(WIDE);
    // 1024x1024: the pose would fit slid all the way, but p < 1 slides it only part way.
    {
      const canvas = { w: 1024, h: 1024 };
      const { p, c, x0 } = rules(canvas);
      expect(p).toBeGreaterThan(0.5); expect(p).toBeLessThan(0.6); // 0.536
      expect(x0 + dr * c).toBeGreaterThan(1024); // it crosses the right edge where it is
      expect((dr - dl) * c).toBeLessThan(1024); // the least move fits it
      const x1 = x0 + p * (1024 - (x0 + dr * c));
      const pl = placeStage({ canvas, safeArea: SA, metrics: WIDE });
      const e = extent(pl.character, WIDE);
      expect(e.centreX).toBeCloseTo(x1, 9);
      expect(pl.charScale).toBeCloseTo(Math.min(x1 / -dl, (1024 - x1) / dr), 9);
      expect(pl.charScale).toBeLessThan(c); // the shrink covers the rest
      expect(e.right).toBeCloseTo(1024, 9);
    }
    // 1104x1280: wider than the canvas, so slid p x toward where the least shrink fits it.
    {
      const canvas = { w: 1104, h: 1280 };
      const { p, c, x0 } = rules(canvas);
      expect(p).toBeGreaterThan(0.85); expect(p).toBeLessThan(0.95); // 0.893
      expect((dr - dl) * c).toBeGreaterThan(1104); // too wide to fit by sliding
      const x1 = x0 + p * ((1104 * -dl) / (dr - dl) - x0);
      const pl = placeStage({ canvas, safeArea: SA, metrics: WIDE });
      const e = extent(pl.character, WIDE);
      expect(e.centreX).toBeCloseTo(x1, 9);
      expect(pl.charScale).toBeCloseTo(Math.min(x1 / -dl, (1104 - x1) / dr), 9);
      expect(Math.min(e.left, 1104 - e.right)).toBeCloseTo(0, 9);
    }
  });

  it('portrait slides a pose that fits by sliding, without shrinking it', () => {
    const MID: StageMetrics = { ...NARROW, leftFrac: 0.2, rightFrac: 0.8 };
    const canvas = { w: 1536, h: 2048 };
    const { f, c, x0 } = rules(canvas);
    const { dl, dr } = offsets(MID);
    expect(x0 + dr * c).toBeGreaterThan(1536); // it would cross the right edge where it is
    expect((dr - dl) * c).toBeLessThan(1536); // but fits once slid
    const pl = placeStage({ canvas, safeArea: SA, metrics: MID });
    const e = extent(pl.character, MID);
    expect(pl.charScale).toBeCloseTo(c, 12);
    expect(e.right).toBeCloseTo(1536, 9);
    expect(e.centreX).toBeCloseTo(1536 - dr * c, 9);
    expect(e.top).toBeCloseTo(0.25 * f.content.h, 9);
  });

  it('a normal pose is never shrunk', () => {
    for (const canvas of [...CANVASES, ...SWEEP]) {
      expect(placeStage({ canvas, safeArea: SA, metrics: NARROW }).charScale, `${canvas.w}x${canvas.h}`).toBeCloseTo(rules(canvas).c, 12);
    }
  });

  // 2 px steps, so a jump shows: a smooth 2 px step moves anything by at most ~0.22 % here, while a
  // switch like the face push's former `if` (8 x charScale = 0.94 % of H) stands out against the bound.
  const k_ = (c: { w: number; h: number }) => `${c.w + 2} -> ${c.w}`;
  it('placement is continuous across aspects: no jump at 672:610 or anywhere else (2048 -> 1024 wide at 1280 high, 2 px steps, every leg)', () => {
    const FINE: { w: number; h: number }[] = [];
    for (let w = 2048; w >= 1024; w -= 2) FINE.push({ w, h: 1280 });
    for (const m of [NARROW, WIDE, ONE_ARM]) for (const leg of [AI, HIGHLIGHT, LIVE_APP]) {
      let prev: ReturnType<typeof placeStage> | undefined;
      let crossed = false;
      for (const canvas of FINE) {
        const pl = placeStage({ canvas, safeArea: SA, metrics: m, iface: leg });
        if (prev) {
          const a = prev.character;
          const b = pl.character;
          const ia = prev.iface!;
          const ib = pl.iface!;
          const steps: Record<string, number> = {
            charScale: Math.abs(pl.charScale / prev.charScale - 1),
            x: Math.abs(b.x - a.x) / canvas.w,
            y: Math.abs(b.y - a.y) / canvas.h,
            w: Math.abs(b.w / a.w - 1),
            h: Math.abs(b.h / a.h - 1),
            ifaceX: Math.abs(ib.x - ia.x) / canvas.w,
            ifaceY: Math.abs(ib.y - ia.y) / canvas.h,
            ifaceW: Math.abs(ib.w / ia.w - 1),
          };
          const at = `${m === NARROW ? 'narrow' : m === WIDE ? 'wide' : 'one arm'} ${leg.legW}x${leg.legH} ${k_(canvas)}`;
          for (const [k, v] of Object.entries(steps)) expect(v, `${k} ${at}`).toBeLessThan(0.005);
          if (prev.portraitness === 0 && pl.portraitness > 0) crossed = true;
        }
        prev = pl;
      }
      expect(crossed).toBe(true); // the sweep does cross 672:610 ...
      expect(prev!.portraitness).toBeGreaterThan(0.95); // ... and reaches nearly 3:4
    }
  });

  it('an interface leg larger than the canvas (the 1920 x 1080 leg cap) is centred on it, not pushed off one side', () => {
    const canvas = { w: 1280, h: 960 };
    const s = fitStage(canvas, SA).scale;
    const r = placeStage({ canvas, safeArea: SA, metrics: NARROW, iface: { kind: 'live-app', legW: 1920, legH: 1080 } }).iface!;
    expect(r.w).toBeCloseTo(960 * s, 9); // 1511 > 1280
    expect(r.x + r.w / 2).toBeCloseTo(1280 / 2, 9);
    expect(r.y).toBeGreaterThanOrEqual(0); // 540 * s = 782 fits the content height: clamped, not centred
    expect(r.y + r.h).toBeLessThanOrEqual(883.2 + 1e-9);
    // Taller than the content box (650 * s = 941 > 883.2): centred in the content box, not the canvas.
    const tall = placeStage({ canvas, safeArea: SA, metrics: NARROW, iface: { kind: 'live-app', legW: 760, legH: 1300 } }).iface!;
    expect(tall.h).toBeGreaterThan(883.2);
    expect(tall.y + tall.h / 2).toBeCloseTo(883.2 / 2, 9); // the canvas centre would be 480
  });

  it('the visible interface (the card, or the AI prompt\'s pill) stays inside the canvas, and above the 8 % margin line, for every case above', () => {
    for (const canvas of [...CANVASES, ...SWEEP]) {
      const content = fitStage(canvas, SA).content;
      for (const m of [NARROW, WIDE, DEFAULT_METRICS, VERY_WIDE]) {
        for (const leg of [HIGHLIGHT, AI, LIVE_APP]) {
          const r = placeStage({ canvas, safeArea: SA, metrics: m, iface: leg }).iface!;
          const at = `${canvas.w}x${canvas.h} ${leg.legW}x${leg.legH}`;
          expectInside(visibleOf(r, leg), canvas, at);
          // The root clips at the content bottom, so the clamp is to it: nothing lands in the 8 % strip.
          expect(visibleOf(r, leg).y + visibleOf(r, leg).h, at).toBeLessThanOrEqual(content.y + content.h + 1e-9);
        }
      }
    }
  });

  it('the AI prompt pill keeps its body-relative chest height on the waist path (1280x960, 1536x2048)', () => {
    const drop = slotDrop(AI, NARROW); // 345.45: the slot centre below the head top
    expect(drop).toBeCloseTo(345.45, 9);
    for (const canvas of [{ w: 1280, h: 960 }, { w: 1536, h: 2048 }]) {
      for (const m of [NARROW, WIDE]) {
        const at = `${canvas.w}x${canvas.h} ${m === NARROW ? 'narrow' : 'wide'}`;
        const pl = placeStage({ canvas, safeArea: SA, metrics: m, iface: AI });
        const e = extent(pl.character, m);
        const pill = visibleOf(pl.iface!, AI);
        const pillCy = pill.y + pill.h / 2;
        expect(pillCy, at).toBeCloseTo(e.top + drop * pl.charScale * WAIST_RATIO, 9);
        // As far down head-to-waist as the Figma's 661 character had it (52.3 %), not 59 %.
        const share = (pillCy - e.top) / (e.waist - e.top);
        expect(share, at).toBeCloseTo(drop / 661, 9);
        expect(Math.abs(share - drop / 588), at).toBeGreaterThan(0.05); // the guard can fail: without the ratio 58.7 %
      }
    }
    // No waist (an older moderator): today's offset, unscaled.
    const canvas = { w: 1280, h: 960 };
    const pl = placeStage({ canvas, safeArea: SA, iface: AI });
    const pill = visibleOf(pl.iface!, AI);
    expect(pill.y + pill.h / 2).toBeCloseTo(extent(pl.character, DEFAULT_METRICS).top + slotDrop(AI, DEFAULT_METRICS) * pl.charScale, 9);
  });

  it('the visible interface never covers the face-safe band (narrow and wide poses): a card the chest-height rule lifts into it is pushed down to 8 below it', () => {
    // Pinned: the live-app card beside the narrow pose at 1280x960. The rule would put its top inside the band.
    {
      const canvas = { w: 1280, h: 960 };
      const s = fitStage(canvas, SA).scale;
      const pl = placeStage({ canvas, safeArea: SA, metrics: NARROW, iface: LIVE_APP });
      const e = extent(pl.character, NARROW);
      const band = placedFaceSafe(pl, NARROW);
      expect(band.y).toBeCloseTo(e.top, 9);
      expect(band.h).toBeCloseTo(207.4 * s, 9);
      const ruleTop = e.top + slotDrop(LIVE_APP, NARROW) * s * WAIST_RATIO - (LIVE_APP.legH / 4) * s;
      expect(ruleTop).toBeLessThan(band.y + band.h - 20); // the guard can fail: 302.7 inside the band's 332.1
      expect(pl.iface!.y).toBeCloseTo(band.y + band.h + 8 * s, 9); // 343.7
    }
    // Every leg, canvas and the two fixture poses: no overlap, and a card under the face keeps a clear
    // 8 units below the band (a card the rule leaves within those 8 is pushed too); the highlight card
    // and the AI pill never need the push.
    for (const canvas of [...CANVASES, ...SWEEP]) {
      for (const m of [NARROW, WIDE]) {
        for (const leg of [HIGHLIGHT, AI, LIVE_APP]) {
          const pl = placeStage({ canvas, safeArea: SA, metrics: m, iface: leg });
          const at = `${canvas.w}x${canvas.h} ${m === NARROW ? 'narrow' : 'wide'} ${leg.legW}x${leg.legH}`;
          const v = visibleOf(pl.iface!, leg);
          const band = placedFaceSafe(pl, m);
          expect(overlaps(v, band), at).toBe(false);
          if (v.x < band.x + band.w && band.x < v.x + v.w) expect(v.y, at).toBeGreaterThanOrEqual(band.y + band.h + 8 * pl.charScale - 1e-9);
          if (leg !== LIVE_APP) {
            const v = visibleOf(pl.iface!, leg);
            expect(v.y + v.h / 2, at).toBeCloseTo(extent(pl.character, m).top + slotDrop(leg, m) * pl.charScale * WAIST_RATIO, 9);
          }
        }
      }
    }
  });

  it('the face push is a clamp: continuous where the rule meets the band and where the push lets go (narrow live-app card, content aspect ~0.736 -> ~0.687 at 1280 high)', () => {
    const h = 1280;
    const rows: { w: number; ruleTop: number; bandBottom: number; floor: number; top: number }[] = [];
    for (let w = 1040; w >= 950; w -= 2) {
      const canvas = { w, h };
      const s = fitStage(canvas, SA).scale;
      const pl = placeStage({ canvas, safeArea: SA, metrics: NARROW, iface: LIVE_APP });
      expect(pl.portraitness).toBe(1);
      const e = extent(pl.character, NARROW);
      const band = placedFaceSafe(pl, NARROW);
      const ruleTop = e.top + slotDrop(LIVE_APP, NARROW) * pl.charScale * WAIST_RATIO - (LIVE_APP.legH / 4) * s;
      const floor = band.y + band.h + 8 * pl.charScale;
      expect(pl.iface!.y, `${w}`).toBeCloseTo(Math.max(ruleTop, floor), 9); // max(rule, band + 8), never a jump between them
      rows.push({ w, ruleTop, bandBottom: band.y + band.h, floor, top: pl.iface!.y });
    }
    const at = (w: number) => rows.find((r) => r.w === w)!;
    // 1032 -> 1030 (content aspect 0.736): the rule's top crosses the band bottom. An `if (overlaps)` push
    // jumped here by 8 x charScale (12 px, 0.94 % of H); the clamp holds the card on band + 8 on both sides.
    expect(0.84 * 1032 / (0.92 * h)).toBeCloseTo(0.736, 3);
    expect(at(1032).ruleTop).toBeLessThan(at(1032).bandBottom);
    expect(at(1030).ruleTop).toBeGreaterThan(at(1030).bandBottom);
    expect(at(1032).top).toBeCloseTo(at(1032).floor, 9);
    expect(at(1030).top).toBeCloseTo(at(1030).floor, 9);
    // 964 -> 962 (~0.687): the push lets go. Active on the wider side, the rule on the narrower side.
    expect(at(964).floor).toBeGreaterThan(at(964).ruleTop);
    expect(at(962).ruleTop).toBeGreaterThan(at(962).floor);
    expect(at(962).top).toBeCloseTo(at(962).ruleTop, 9);
    // And the card is continuous through the whole window: every 2 px step is under 0.1 % of H.
    for (let i = 1; i < rows.length; i++) expect(Math.abs(rows[i].top - rows[i - 1].top) / h, `${rows[i - 1].w} -> ${rows[i].w}`).toBeLessThan(0.001);
  });

  it('the face push ramps in over the 8 units beside the face band, so it never jumps where a card starts to reach over it (one arm out)', () => {
    /** The live-app card against the band: how far it reaches over the band's width (< 0: beside it). */
    const probe = (m: StageMetrics, canvas: { w: number; h: number }) => {
      const s = fitStage(canvas, SA).scale;
      const pl = placeStage({ canvas, safeArea: SA, metrics: m, iface: LIVE_APP });
      const e = extent(pl.character, m);
      const band = placedFaceSafe(pl, m);
      const v = pl.iface!;
      const reach = Math.min(v.x + v.w, band.x + band.w) - Math.max(v.x, band.x);
      const ruleTop = e.top + slotDrop(LIVE_APP, m) * pl.charScale * WAIST_RATIO - (LIVE_APP.legH / 4) * s;
      const floor = band.y + band.h + 8 * pl.charScale;
      return { pl, band, reach, ruleTop, floor, cs: pl.charScale, top: v.y };
    };
    // 1280 high, 1200 -> 1080: the card goes from just beside the band (the ramp) to reaching over it at 1140.
    const h = 1280;
    let partial = 0;
    let prevTop: number | undefined;
    for (let w = 1200; w >= 1080; w -= 2) {
      const q = probe(ONE_ARM, { w, h });
      const weight = Math.min(1, Math.max(0, q.reach / (8 * q.cs) + 1));
      expect(q.top, `${w}`).toBeCloseTo(q.ruleTop + weight * Math.max(0, q.floor - q.ruleTop), 9);
      if (weight > 0 && weight < 1 && q.floor > q.ruleTop) partial++;
      expect(overlaps(q.pl.iface!, q.band), `${w}`).toBe(false);
      if (prevTop !== undefined) expect(Math.abs(q.top - prevTop) / h, `${w + 2} -> ${w}`).toBeLessThan(0.001);
      prevTop = q.top;
    }
    expect(partial).toBeGreaterThan(10); // the window does run through the ramp ...
    expect(probe(ONE_ARM, { w: 1142, h }).reach).toBeLessThan(0); // ... and the card starts to reach over the band here,
    expect(probe(ONE_ARM, { w: 1140, h }).reach).toBeGreaterThanOrEqual(0); // where an on/off overlap test would jump
    expect(probe(ONE_ARM, { w: 1140, h }).top).toBeCloseTo(probe(ONE_ARM, { w: 1140, h }).floor, 9);
    // Clearly beside the face (more than 8 units off its width) it is not pushed, though its top is level with the band.
    const far = probe(FACE_RIGHT, { w: 1280, h: 960 });
    expect(far.reach).toBeLessThan(-8 * far.cs - 50);
    expect(far.ruleTop).toBeLessThan(far.band.y + far.band.h); // a push would move it (302.7 vs the band's 332.1)
    expect(far.top).toBeCloseTo(far.ruleTop, 9);
  });

  it('the visible interface is clamped to the content bottom where the stage root clips (a very wide pose\'s live-app card)', () => {
    const canvas = { w: 1280, h: 960 };
    const f = fitStage(canvas, SA);
    const s = f.scale;
    const pl = placeStage({ canvas, safeArea: SA, metrics: VERY_WIDE, iface: LIVE_APP });
    const e = extent(pl.character, VERY_WIDE);
    expect(pl.charScale / s).toBeLessThan(0.4); // shrunk hard to fit the canvas width
    // The guard can fail: the chest-height rule ends the card inside the canvas but in the 8 % strip,
    // where a clamp to the canvas would leave it (948.7 between 883.2 and 960) ...
    const ruleBottom = e.top + slotDrop(LIVE_APP, VERY_WIDE) * pl.charScale * WAIST_RATIO + (LIVE_APP.legH / 4) * s;
    expect(ruleBottom).toBeGreaterThan(f.content.h + 50);
    expect(ruleBottom).toBeLessThan(canvas.h);
    // ... it ends exactly on the content bottom instead, at its own size and x.
    expect(pl.iface!.y + pl.iface!.h).toBeCloseTo(f.content.h, 9);
    expect(pl.iface!.h).toBeCloseTo((LIVE_APP.legH / 2) * s, 9);
    // Never clipped beats face-safe (as interfaceSlot's frame clamp beats its nudge): with no room below
    // the band, the card keeps to the content box and overlaps it.
    expect(overlaps(pl.iface!, placedFaceSafe(pl, VERY_WIDE))).toBe(true);
    // With no bottom margin the root clips nothing and the content bottom is the canvas bottom.
    const flush = placeStage({ canvas, safeArea: { right: 0.16, bottom: 0 }, metrics: VERY_WIDE, iface: LIVE_APP }).iface!;
    expect(flush.y + flush.h).toBeLessThanOrEqual(canvas.h + 1e-9);
  });
});
