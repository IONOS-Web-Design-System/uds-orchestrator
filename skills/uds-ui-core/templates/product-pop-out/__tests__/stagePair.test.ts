import { describe, it, expect, vi } from 'vitest';
import { createElement, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  CHARACTER_FRAME_ASPECT, PAIR_SLOTS, pairSlotRects, visibleLayers, StageLayerContext, useStageSlot,
} from '../stagePair.layout';
import { renderStagePair, StagePair, StageLayerContext as ReExported, type StageLayerName } from '../StagePair';

// StagePair reads the canvas from Remotion; outside a Remotion render there is no config, so the
// two Remotion names it uses are stubbed: the canvas is the pair leg's 1383 x 1049, the fill a div.
vi.mock('remotion', () => ({
  useVideoConfig: () => ({ width: 1383, height: 1049, fps: 30, durationInFrames: 90 }),
  AbsoluteFill: ({ children }: { children?: ReactNode }) => createElement('div', { 'data-fill': '' }, children),
}));

type El = ReactElement<{ style?: Record<string, number | string>; children?: unknown; value?: unknown }>;
const kids = (el: El): El[] => ([] as El[]).concat((el.props.children ?? []) as El[]).filter(Boolean);

/** A layer child that reports which layer it is and the slot box it was given. */
function Probe({ name }: { name: string }) {
  const s = useStageSlot();
  return createElement('i', { 'data-layer': name, 'data-slot': `${Math.round(s.w)}x${Math.round(s.h)}` });
}

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
  it('the slot context defaults to 253 x 173 outside a pair', () => {
    expect(renderToStaticMarkup(createElement(Probe, { name: 'X' }))).toBe('<i data-layer="X" data-slot="253x173"></i>');
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

describe('StagePair reads the layer from StageLayerContext (as /compose mounts it)', () => {
  const pair = createElement(StagePair, {
    background: createElement(Probe, { name: 'BG' }),
    foreground: createElement(Probe, { name: 'FG' }),
  });
  const html = (layer?: StageLayerName) =>
    renderToStaticMarkup(layer ? createElement(StageLayerContext.Provider, { value: layer }, pair) : pair);
  const layers = (markup: string) => [...markup.matchAll(/data-layer="(\w+)" data-slot="(\d+x\d+)"/g)].map((m) => `${m[1]}@${m[2]}`);

  it('provider "foreground": only the foreground child, in its slot box', () => {
    expect(layers(html('foreground'))).toEqual(['FG@429x420']);
  });
  it('provider "background": only the background child, in its slot box', () => {
    expect(layers(html('background'))).toEqual(['BG@692x441']);
  });
  it('no provider: both, background first', () => {
    expect(layers(html())).toEqual(['BG@692x441', 'FG@429x420']);
  });
  it('the re-exported context is the one StagePair reads (the compose source imports it from StagePair)', () => {
    const viaReExport = renderToStaticMarkup(createElement(ReExported.Provider, { value: 'foreground' }, pair));
    expect(layers(viaReExport)).toEqual(['FG@429x420']);
  });
});
