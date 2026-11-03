import { describe, it, expect } from 'vitest';
import { buildStageLayers } from '../layers';
import { interfaceLegStyle, layerStyle } from '../styles';

// styles.test.ts — the inline styles StratoStage puts on every layer, built purely so they can be
// pinned: the compose workspace imports Tailwind, whose preflight `img { max-width: 100%;
// height: auto }` squeezed every powder x1.6-2.3 in the first smoke render (final review O-C1).
describe('strato-stage styles', () => {
  const base = {
    canvas: { w: 1280, h: 960 },
    safeArea: { right: 0.32, bottom: 0.22 },
    srcs: { box: 'b.png', powder: 'p.png', character: 'c.png' },
    iface: { kind: 'feature-highlight' as const, legW: 769, legH: 180 },
  };
  const layers = buildStageLayers(base, 2000);
  const byId = Object.fromEntries(layers.map((l) => [l.id, l]));

  it('every layer escapes the Tailwind preflight clamp (max-width/max-height none)', () => {
    for (const l of layers) {
      const s = layerStyle(l);
      expect(s.maxWidth, l.id).toBe('none');
      expect(s.maxHeight, l.id).toBe('none');
    }
  });

  it('every layer is the rect, transformed about its centre', () => {
    for (const l of layers) {
      expect(layerStyle(l)).toMatchObject({
        position: 'absolute',
        left: l.rect.x,
        top: l.rect.y,
        width: l.rect.w,
        height: l.rect.h,
        transform: l.transform,
        transformOrigin: '50% 50%',
        opacity: l.opacity,
      });
    }
  });

  it('the character is contained, top-anchored, never stretched (DEFAULT_METRICS on a non-3:4 cutout)', () => {
    expect(layerStyle(byId.character)).toMatchObject({ objectFit: 'contain', objectPosition: '50% 0' });
  });

  it('boxes and powders keep their exact export aspect (no object-fit)', () => {
    for (const id of ['boxBack', 'boxFore', 'powderBack', 'powderFore']) {
      expect(layerStyle(byId[id]).objectFit, id).toBeUndefined();
    }
  });

  it('the interface leg box is the leg canvas: clipped, scaled down onto its rect from the top-left', () => {
    const rect = byId.interface.rect;
    expect(interfaceLegStyle(rect, { legW: 769, legH: 180 })).toEqual({
      position: 'absolute',
      left: 0,
      top: 0,
      width: 769,
      height: 180,
      overflow: 'hidden',
      transform: `scale(${rect.w / 769})`,
      transformOrigin: '0 0',
    });
  });
});
