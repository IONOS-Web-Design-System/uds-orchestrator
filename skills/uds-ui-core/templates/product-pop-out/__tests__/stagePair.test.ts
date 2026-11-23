import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import {
  CHARACTER_FRAME_ASPECT, PAIR_SLOTS, pairSlotRects, visibleLayers, StageLayerContext, StageSlotContext,
} from '../stagePair.layout';
import { renderStagePair, StageLayerContext as ReExported } from '../StagePair';

type El = ReactElement<{ style?: Record<string, number | string>; children?: unknown; value?: unknown }>;
const kids = (el: El): El[] => ([] as El[]).concat((el.props.children ?? []) as El[]).filter(Boolean);

describe('stagePair geometry', () => {
  it('frame aspect', () => expect(CHARACTER_FRAME_ASPECT).toBeCloseTo(1.31869, 4));
  it('slots are the Figma fractions', () => {
    expect(PAIR_SLOTS.background).toEqual({ x: 0.14, y: 0.13, w: 0.5, h: 0.42 });
    expect(PAIR_SLOTS.foreground).toEqual({ x: 0.12, y: 0.24, w: 0.31, h: 0.4 });
  });
  it('pairSlotRects in px', () => {
    const r = pairSlotRects({ w: 1383, h: 1049 });
    const near = (a: Record<string, number>, b: Record<string, number>) =>
      Object.keys(b).forEach((k) => expect(Math.abs(a[k] - b[k])).toBeLessThanOrEqual(0.01));
    near(r.background, { x: 193.62, y: 136.37, w: 691.5, h: 440.58 });
    near(r.foreground, { x: 165.96, y: 251.76, w: 428.73, h: 419.6 });
  });
  it('visibleLayers', () => {
    expect(visibleLayers('both')).toEqual(['background', 'foreground']);
    expect(visibleLayers('background')).toEqual(['background']);
    expect(visibleLayers('foreground')).toEqual(['foreground']);
  });
  it('contexts default', () => {
    expect((StageLayerContext as unknown as { _currentValue: unknown })._currentValue).toBe('both');
    expect((StageSlotContext as unknown as { _currentValue: unknown })._currentValue).toEqual({ w: 253, h: 173 });
  });
});

describe('StagePair', () => {
  const run = (layer: 'both' | 'background' | 'foreground') =>
    renderStagePair({ background: 'BG', foreground: 'FG', layer, width: 1383, height: 1049 }) as El;
  it('layer=foreground renders only the foreground child, in its box', () => {
    const boxes = kids(run('foreground'));
    expect(boxes).toHaveLength(1);
    const inner = kids(boxes[0])[0];
    expect(inner.props.children).toBe('FG');
    expect(inner.props.value).toEqual({ w: expect.closeTo(428.73, 1), h: expect.closeTo(419.6, 1) });
    expect(boxes[0].props.style).toMatchObject({ position: 'absolute' });
  });
  it('both renders two, background first', () => {
    const boxes = kids(run('both'));
    expect(boxes.map((b) => kids(b)[0].props.children)).toEqual(['BG', 'FG']);
  });
  it('re-exports the layer context', () => expect(ReExported).toBe(StageLayerContext));
});
