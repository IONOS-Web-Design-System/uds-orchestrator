import { describe, it, expect } from 'vitest';
import { buildStageLayers } from '../layers';
import { DEFAULT_METRICS, fitStage } from '../geometry';

// layers.test.ts — the pure layer list StratoStage maps onto <Img>s
describe('strato-stage layers', () => {
  const base = { canvas: { w: 1280, h: 960 }, safeArea: { right: 0.32, bottom: 0.22 }, srcs: { box: 'b.png', powder: 'p.png', character: 'c.png' } };
  it('orders layers bottom→top, interface only when given', () => {
    expect(buildStageLayers(base, 2000).map((l) => l.id)).toEqual(['boxBack','boxFore','powderBack','character','powderFore']);
    expect(buildStageLayers({ ...base, iface: { kind: 'feature-highlight', legW: 769, legH: 180 } }, 2000).at(-1)!.id).toBe('interface');
  });
  it('settled transforms carry the Figma pose', () => {
    const L = Object.fromEntries(buildStageLayers(base, 2000).map((l) => [l.id, l]));
    expect(L.boxBack.transform).toContain('rotate(-173deg)'); expect(L.powderFore.transform).toContain('scaleX(-1)');
    expect(L.powderBack.transform).not.toContain('scaleX(-1)');
    const f = fitStage(base.canvas, base.safeArea);
    expect(L.boxBack.rect.w).toBeCloseTo(638 * (559.19 / 558) * f.scale, 3);
    expect(L.boxBack.rect.x + L.boxBack.rect.w / 2).toBeCloseTo(f.originX + 564.002 * f.scale, 3);
  });
  it('frame 0 paints nothing', () => { expect(buildStageLayers(base, 0).every((l) => l.opacity === 0)).toBe(true); });
  it('default metrics when metrics absent', () => {                         // Review Focus 2
    const a = buildStageLayers(base, 2000).find((l) => l.id === 'character')!;
    const b = buildStageLayers({ ...base, metrics: DEFAULT_METRICS }, 2000).find((l) => l.id === 'character')!;
    expect(a.rect).toEqual(b.rect);
  });
});
