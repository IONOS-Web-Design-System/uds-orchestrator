import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fitStage } from '../geometry';
import { buildStageLayers } from '../layers';
import { interfaceLegStyle, layerStyle, stageRootStyle } from '../styles';

// styles.test.ts — the inline styles StratoStage puts on every layer, built purely so they can be
// pinned: the compose workspace imports Tailwind, whose preflight `img { max-width: 100%;
// height: auto }` squeezed the (since removed) powders x1.6-2.3 in the first smoke render (final review O-C1).
describe('strato-stage styles', () => {
  const base = {
    canvas: { w: 1280, h: 960 },
    safeArea: { right: 0.32, bottom: 0.22 },
    srcs: { character: 'c.png' },
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

  it('the interface leg box is the leg canvas: still clipped (overflow hidden), scaled down onto its rect from the top-left', () => {
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

  // Spec 2026-11-05 §4.1: the character is clipped only by the canvas (never at the right margin),
  // except that nothing below the content bottom shows: with the STRATO stage's `bottom: 0` that is
  // the canvas bottom, so the root clips nothing.
  it('the stage root has no content-box clip: with no bottom margin it is the canvas and clips nothing', () => {
    const canvas = { w: 1280, h: 960 };
    const root = stageRootStyle(canvas, fitStage(canvas, { right: 0.16, bottom: 0 }).content);
    expect(root).toEqual({ position: 'absolute', left: 0, top: 0, width: 1280, height: 960 });
    expect(root.overflow).toBeUndefined();
  });

  it('with a bottom margin (an older moderator) it cuts at the content bottom only, never at the right margin', () => {
    const canvas = { w: 1280, h: 960 };
    const content = fitStage(canvas, { right: 0.32, bottom: 0.22 }).content; // 870.4 x 748.8
    expect(stageRootStyle(canvas, content)).toEqual({ position: 'absolute', left: 0, top: 0, width: 1280, height: 748.8, overflow: 'hidden' });
  });

  it('StratoStage mounts its layers in stageRootStyle and adds no clip of its own', () => {
    const src = readFileSync(new URL('../StratoStage.tsx', import.meta.url), 'utf8');
    expect(src).toMatch(/style=\{stageRootStyle\(/);
    expect(src).not.toMatch(/overflow/);
  });
});
