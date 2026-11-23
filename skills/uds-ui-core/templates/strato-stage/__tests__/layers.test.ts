import { describe, it, expect } from 'vitest';
import { buildStageLayers } from '../layers';
import { DEFAULT_METRICS, VISUAL, characterRect, fitStage, placeStage, type StageMetrics } from '../geometry';

// layers.test.ts — the pure layer list StratoStage maps onto <Img>s
describe('strato-stage layers', () => {
  const base = { canvas: { w: 1280, h: 960 }, safeArea: { right: 0.32, bottom: 0.22 }, srcs: { character: 'c.png' } };
  it('is just the character, plus the interface over it only when given', () => {
    expect(buildStageLayers(base, 2000).map((l) => l.id)).toEqual(['character']);
    expect(buildStageLayers({ ...base, iface: { kind: 'feature-highlight', legW: 769, legH: 180 } }, 2000).map((l) => l.id)).toEqual(['character', 'interface']);
  });
  it('settled character sits on the Figma anchor with an identity-motion transform', () => {
    const c = buildStageLayers(base, 2000)[0];
    const f = fitStage(base.canvas, base.safeArea);
    expect(c.src).toBe('c.png');
    expect(c.transform).toBe('translateY(0px) scale(1)');
    expect(c.rect.w).toBeCloseTo(characterRect(DEFAULT_METRICS).w * f.scale, 3);
    expect(c.rect.x).toBeCloseTo(f.originX + characterRect(DEFAULT_METRICS).x * f.scale, 3);
  });
  it('frame 0 paints nothing', () => {
    const withIface = { ...base, iface: { kind: 'feature-highlight' as const, legW: 769, legH: 180 } };
    expect(buildStageLayers(withIface, 0).every((l) => l.opacity === 0)).toBe(true);
  });
  it('default metrics when metrics absent', () => {
    const a = buildStageLayers(base, 2000)[0];
    const b = buildStageLayers({ ...base, metrics: DEFAULT_METRICS }, 2000)[0];
    expect(a.rect).toEqual(b.rect);
  });
  it('every rect comes from placeStage, bottom to top: the character, then the interface', () => {
    const SA = { right: 0.16, bottom: 0.08 }; // the moderator's STRATO_STAGE safe area
    const srcs = { character: 'c.png' };
    const NARROW: StageMetrics = {
      headTopFrac: 0.05, waistFrac: 0.55, leftFrac: 0.3, rightFrac: 0.7, subjectHeightFrac: 0.9, bottomFrac: 0.95,
      centerXFrac: 0.5, upperBodyLeftFrac: 0.3, upperBodyRightFrac: 0.7, imgW: 1536, imgH: 2048,
    };
    const WIDE: StageMetrics = { ...NARROW, leftFrac: 0.02, rightFrac: 0.99, headTopFrac: 0, subjectHeightFrac: 0.95, centerXFrac: 0.505 };
    const cases = [
      { canvas: { w: 1280, h: 960 }, safeArea: SA, srcs, iface: { kind: 'feature-highlight' as const, legW: 1231, legH: 621 } },
      { canvas: { w: 1536, h: 2048 }, safeArea: SA, metrics: NARROW, srcs, iface: { kind: 'feature-highlight' as const, legW: 769, legH: 180 } },
      { canvas: { w: 1024, h: 1024 }, safeArea: SA, metrics: WIDE, srcs, iface: { kind: 'live-app' as const, legW: 760, legH: 570 } },
    ];
    for (const input of cases) {
      const pl = placeStage(input);
      const layers = buildStageLayers(input, 2000);
      expect(layers.map((l) => l.id)).toEqual(['character', 'interface']);
      expect(layers[0].rect).toEqual(pl.character);
      expect(layers[1].rect).toEqual(pl.iface);
      const { iface: _none, ...bare } = input;
      expect(buildStageLayers(bare, 2000).map((l) => l.rect)).toEqual([placeStage(bare).character]);
    }
  });
});

// The pair (spec 2026-11-23): three layers, bottom to top: the leg's background, the character, the
// leg's foreground, each pair layer in its mount box (`placeStage(...).pair`).
describe('strato-stage layers: the pair', () => {
  const SA = { right: 0.16, bottom: 0.08 };
  const srcs = { character: 'c.png' };
  const PAIR = { kind: 'pair' as const, legW: 1383, legH: 1049 };
  /** A catalog character (`strato-<showroom>-stage`, 1942 x 1473, `waistFrac := bottomFrac`). */
  const CATALOG: StageMetrics = {
    headTopFrac: 0.016, bottomFrac: 1, waistFrac: 1, centerXFrac: 0.52, leftFrac: 0.29, rightFrac: 0.75,
    subjectHeightFrac: 0.984, upperBodyLeftFrac: 0.29, upperBodyRightFrac: 0.68, imgW: 1942, imgH: 1473,
  };
  /** A generated 3:4 cutout (standalone, or a missing catalog row). */
  const GENERATED: StageMetrics = {
    headTopFrac: 0.05, waistFrac: 0.62, bottomFrac: 1, leftFrac: 0.2, rightFrac: 0.8, subjectHeightFrac: 0.95,
    centerXFrac: 0.5, upperBodyLeftFrac: 0.3, upperBodyRightFrac: 0.7, imgW: 1536, imgH: 2048,
  };
  const CASES: [string, StageMetrics, boolean][] = [['catalog', CATALOG, true], ['generated', GENERATED, false]];
  /** The prod default, landscape, portrait, and a tall canvas where the slots move and shrink. */
  const CANVASES = [{ w: 750, h: 570 }, { w: 1280, h: 960 }, { w: 810, h: 1080 }, { w: 1024, h: 2048 }];

  it('bottom to top: background, character, foreground, in the pair mount boxes and the character rect', () => {
    for (const [name, metrics, characterFramed] of CASES) {
      for (const canvas of CANVASES) {
        const at = `${name} ${canvas.w}x${canvas.h}`;
        const input = { canvas, safeArea: SA, metrics, srcs, iface: PAIR, characterFramed };
        const pl = placeStage(input);
        const layers = buildStageLayers(input, 2000);
        expect(layers.map((l) => l.id), at).toEqual(['background', 'character', 'foreground']);
        expect(layers[0].rect, at).toEqual(pl.pair!.background);
        expect(layers[1].rect, at).toEqual(pl.character);
        expect(layers[2].rect, at).toEqual(pl.pair!.foreground);
        // Only the character is an image; the pair layers are the leg, a React node.
        expect(layers.map((l) => l.src), at).toEqual([undefined, 'c.png', undefined]);
        // Settled: every layer at rest.
        for (const l of layers) {
          expect(l.transform, `${at} ${l.id}`).toBe('translateY(0px) scale(1)');
          expect(l.opacity, `${at} ${l.id}`).toBe(1);
        }
      }
    }
  });

  it('frame 0 is empty: every opacity is 0', () => {
    for (const [name, metrics, characterFramed] of CASES) {
      for (const canvas of CANVASES) {
        const layers = buildStageLayers({ canvas, safeArea: SA, metrics, srcs, iface: PAIR, characterFramed }, 0);
        expect(layers.map((l) => l.opacity), `${name} ${canvas.w}x${canvas.h}`).toEqual([0, 0, 0]);
      }
    }
  });

  it('the entrances: the background drifts in, the character pops at 1.2x, the foreground scales from 0.92', () => {
    const canvas = { w: 750, h: 570 };
    const input = { canvas, safeArea: SA, metrics: CATALOG, srcs, iface: PAIR, characterFramed: true };
    const s = fitStage(canvas, SA).scale;
    const [bg, ch, fg] = buildStageLayers(input, 0);
    // The drift is visual units at the frame's fit, as every offset.
    expect(bg.transform).toBe(`translateY(${0.01 * VISUAL.h * s}px) scale(1)`);
    expect(ch.transform).toBe('translateY(0px) scale(1.2)');
    expect(fg.transform).toBe('translateY(0px) scale(0.92)');
    // At 1040 ms the background and the character are at rest; the foreground starts.
    const at1040 = buildStageLayers(input, 1040);
    expect(at1040.map((l) => l.opacity)).toEqual([1, 1, 0]);
    expect(at1040[2].transform).toBe('translateY(0px) scale(0.92)');
  });

  it('characterFramed reaches placeStage: a catalog cutout framed by its image box, else a virtual frame', () => {
    const input = { canvas: { w: 750, h: 570 }, safeArea: SA, metrics: CATALOG, srcs, iface: PAIR };
    const framed = buildStageLayers({ ...input, characterFramed: true }, 2000);
    const virtual = buildStageLayers({ ...input, characterFramed: false }, 2000);
    expect(framed[0].rect).toEqual(placeStage({ ...input, characterFramed: true }).pair!.background);
    expect(virtual[0].rect).toEqual(placeStage({ ...input, characterFramed: false }).pair!.background);
    // Unclamped at 750 x 570, the box IS the image box (up to the float noise of layerBox's map).
    for (const k of ['x', 'y', 'w', 'h'] as const) expect(framed[0].rect[k], k).toBeCloseTo(framed[1].rect[k], 9);
    expect(virtual[0].rect.x).not.toBeCloseTo(framed[0].rect.x, 0);
    expect(buildStageLayers(input, 2000)[0].rect).toEqual(virtual[0].rect); // absent = false
  });

  it('a pair whose character frame is degenerate falls back to the character alone', () => {
    // A no-waist strip mask on a tall canvas: its virtual frame has a negative height (geometry.test.ts).
    const STRIP: StageMetrics = {
      headTopFrac: 0.35, bottomFrac: 0.65, leftFrac: 0, rightFrac: 1, subjectHeightFrac: 0.3, centerXFrac: 0.5,
      upperBodyLeftFrac: 0.1, upperBodyRightFrac: 0.9, imgW: 1536, imgH: 2048,
    };
    const input = { canvas: { w: 320, h: 2048 }, safeArea: SA, metrics: STRIP, srcs, iface: PAIR };
    expect(buildStageLayers(input, 2000).map((l) => l.id)).toEqual(['character']);
  });
});

// Review Focus 1: a compose payload with a legacy kind (from a moderator deployed earlier) still renders
// the two-layer stage: the character, then the interface, at the rects of ba87648 (frozen from it bit for
// bit) and with the interface's 450-900 ms pop. Only the character's entrance changed: it gets the Figma
// pop-in like every stage character (controller ruling).
describe('strato-stage layers: legacy kinds unchanged', () => {
  const SA = { right: 0.16, bottom: 0.08 };
  const NARROW: StageMetrics = {
    headTopFrac: 0.05, waistFrac: 0.55, leftFrac: 0.3, rightFrac: 0.7, subjectHeightFrac: 0.9, bottomFrac: 0.95,
    centerXFrac: 0.5, upperBodyLeftFrac: 0.3, upperBodyRightFrac: 0.7, imgW: 1536, imgH: 2048,
  };
  type Frozen = { character: number[]; iface: number[]; at450: string; at600: string };
  const CASES: [{ w: number; h: number }, { kind: 'feature-highlight' | 'live-app'; legW: number; legH: number }, Frozen][] = [
    [{ w: 750, h: 570 }, { kind: 'feature-highlight', legW: 1231, legH: 621 }, {
      character: [59.677377049180336, -31.635934426229504, 758.2308196721311, 1010.9744262295081],
      iface: [4.486426229508197, 149.62502403214205, 529.1281967213115, 266.92819672131145],
      at450: 'translateY(22.549199999999995px) scale(0.72)',
      at600: 'translateY(1.0021866666666703px) scale(0.9875555555555555)',
    }],
    [{ w: 1280, h: 960 }, { kind: 'feature-highlight', legW: 769, legH: 180 }, {
      character: [107.58295081967219, -53.28157377049173, 1277.0203278688525, 1702.6937704918032],
      iface: [181.85862295081978, 411.62758145879326, 556.7055737704918, 130.30819672131148],
      at450: 'translateY(37.977599999999995px) scale(0.72)',
      at600: 'translateY(1.68789333333334px) scale(0.9875555555555555)',
    }],
    [{ w: 810, h: 1080 }, { kind: 'live-app', legW: 760, legH: 570 }, {
      character: [-72.90000000000009, 173.87999999999997, 1117.8000000000002, 1490.4],
      iface: [40.5, 521.8140601361574, 384.75, 288.5625],
      at450: 'translateY(26.557874999999996px) scale(0.72)',
      at600: 'translateY(1.1803500000000045px) scale(0.9875555555555555)',
    }],
  ];
  const flat = (r: { x: number; y: number; w: number; h: number }) => [r.x, r.y, r.w, r.h];

  it('the character, then the interface, at the frozen rects, with the interface pop of 2026-11-03', () => {
    for (const [canvas, iface, frozen] of CASES) {
      const at = `${canvas.w}x${canvas.h} ${iface.kind}`;
      const input = { canvas, safeArea: SA, metrics: NARROW, srcs: { character: 'c.png' }, iface };
      for (const t of [0, 450, 600, 2000]) {
        const layers = buildStageLayers(input, t);
        expect(layers.map((l) => l.id), `${at} ${t}`).toEqual(['character', 'interface']);
        expect(flat(layers[0].rect), `${at} ${t}`).toEqual(frozen.character);
        expect(flat(layers[1].rect), `${at} ${t}`).toEqual(frozen.iface);
      }
      const [, i450] = buildStageLayers(input, 450);
      expect([i450.transform, i450.opacity], at).toEqual([frozen.at450, 0]);
      const [c600, i600] = buildStageLayers(input, 600);
      expect([i600.transform, i600.opacity], at).toEqual([frozen.at600, 0.8333333333333333]);
      // The character: the Figma pop-in, so it is still invisible while the interface pops.
      expect([c600.transform, c600.opacity], at).toEqual(['translateY(0px) scale(1.2)', 0]);
      for (const l of buildStageLayers(input, 2000)) expect([l.transform, l.opacity], `${at} ${l.id}`).toEqual(['translateY(0px) scale(1)', 1]);
    }
  });

  it('characterFramed changes nothing on a legacy kind', () => {
    for (const [canvas, iface] of CASES) {
      const input = { canvas, safeArea: SA, metrics: NARROW, srcs: { character: 'c.png' }, iface };
      expect(buildStageLayers({ ...input, characterFramed: true }, 2000)).toEqual(buildStageLayers(input, 2000));
    }
  });
});
