import { describe, it, expect } from 'vitest';
import { buildStageLayers } from '../layers';
import { DEFAULT_METRICS, characterRect, fitStage, placeStage, type StageMetrics } from '../geometry';

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
