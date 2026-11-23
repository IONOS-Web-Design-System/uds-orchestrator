import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { Freeze, Img, Sequence } from 'remotion';
import { FOREGROUND_ANIM_START_MS, INTERFACE_ANIM_START_MS, interfacePhase, msToFrame } from '../motion';
import { placeStage, type StageMetrics } from '../geometry';
import { buildStageLayers } from '../layers';
import { interfaceLegStyle, layerStyle } from '../styles';
import { renderStratoStage, type StratoStageProps } from '../StratoStage';

// interfacePhase.test.ts — which of its OWN frames the interface shows at each stage frame.
// Final review O-I1 / O-M1 and ruling R23: an animated interface is frozen at its frame 0 during
// the pop-in, plays from frame 27 and holds its last frame; a still one shows its LAST frame (the
// one its own still gate validated) for the whole stage.
describe('strato-stage interfacePhase', () => {
  const START = 27;
  const DUR = 90;

  it('the interface animation starts at frame 27 (900 ms at 30 fps)', () => {
    expect(msToFrame(INTERFACE_ANIM_START_MS)).toBe(START);
  });

  it('animated: frozen at 0 through the pop-in, plays from 27, holds its last frame after 116', () => {
    expect(interfacePhase(0, START, DUR, 'animated')).toEqual({ phase: 'pop-in', frame: 0 });
    expect(interfacePhase(26, START, DUR, 'animated')).toEqual({ phase: 'pop-in', frame: 0 });
    expect(interfacePhase(27, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 0 });
    expect(interfacePhase(28, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 1 });
    expect(interfacePhase(116, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 89 });
    expect(interfacePhase(117, START, DUR, 'animated')).toEqual({ phase: 'held', frame: 89 });
    expect(interfacePhase(149, START, DUR, 'animated')).toEqual({ phase: 'held', frame: 89 });
  });

  it('animated: never shows a frame outside 0 .. durationInFrames - 1', () => {
    for (let f = 0; f < 300; f++) {
      const { frame } = interfacePhase(f, START, DUR, 'animated');
      expect(frame).toBeGreaterThanOrEqual(0);
      expect(frame).toBeLessThanOrEqual(DUR - 1);
    }
  });

  it('still: its LAST frame (89) at every stage frame, pop-in included', () => {
    for (const f of [0, 26, 27, 116, 117, 149]) {
      expect(interfacePhase(f, START, DUR, 'still'), `frame ${f}`).toEqual({ phase: 'still', frame: DUR - 1 });
    }
  });

  it('4 s composite (120 frames, 27 + 90 = 117): animated has played out and holds frame 89 on the last frame; still shows 89', () => {
    // The composite ends before the interface's own animation does; nothing jumps to the end early.
    expect(interfacePhase(116, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 89 });
    expect(interfacePhase(119, START, DUR, 'animated')).toEqual({ phase: 'held', frame: 89 });
    expect(interfacePhase(0, START, DUR, 'still')).toEqual({ phase: 'still', frame: 89 });
    expect(interfacePhase(119, START, DUR, 'still')).toEqual({ phase: 'still', frame: 89 });
  });

  it('no known length: a still shows frame 0; an animated one plays on unbounded after the pop-in', () => {
    expect(interfacePhase(100, START, undefined, 'still')).toEqual({ phase: 'still', frame: 0 });
    expect(interfacePhase(26, START, undefined, 'animated')).toEqual({ phase: 'pop-in', frame: 0 });
    expect(interfacePhase(200, START, undefined, 'animated')).toEqual({ phase: 'playing', frame: 173 });
  });
});

// The pair's leg is mounted twice and released later than the legacy interface: from 1300 ms (frame
// 39), once the character has landed and the foreground has entered.
describe('strato-stage interfacePhase: the pair', () => {
  const START = 39;
  const DUR = 90;

  it('the pair leg starts at frame 39 (1300 ms at 30 fps)', () => {
    expect(msToFrame(FOREGROUND_ANIM_START_MS)).toBe(START);
  });

  it('animated: frozen at 0 until frame 38, plays from 39, holds its last frame after 128', () => {
    for (const f of [0, 26, 27, 38]) expect(interfacePhase(f, START, DUR, 'animated'), `frame ${f}`).toEqual({ phase: 'pop-in', frame: 0 });
    expect(interfacePhase(39, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 0 });
    expect(interfacePhase(40, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 1 });
    expect(interfacePhase(128, START, DUR, 'animated')).toEqual({ phase: 'playing', frame: 89 });
    expect(interfacePhase(129, START, DUR, 'animated')).toEqual({ phase: 'held', frame: 89 });
    expect(interfacePhase(149, START, DUR, 'animated')).toEqual({ phase: 'held', frame: 89 });
  });
});

// What StratoStage mounts (its hook-free body, so no renderer is needed): which layer goes where, and
// which of its own frames each interface mount shows at every stage frame.
describe('StratoStage mounts', () => {
  type Props = { style?: Record<string, unknown>; children?: unknown; frame?: number; width?: number; height?: number; durationInFrames?: number; src?: string };
  type El = ReactElement<Props>;
  const kids = (el: El): El[] => ([] as El[]).concat((el.props.children ?? []) as El[]).filter(Boolean);
  /** The stage root's children: the character <Img>, and each interface mount unwrapped down to its node. */
  const mounts = (root: El) => kids(kids(root)[0]).map((el) => {
    if (el.type === Img) return { id: String(el.key), src: el.props.src, style: el.props.style };
    const leg = kids(el)[0];
    const freeze = kids(leg)[0];
    const seq = kids(freeze)[0];
    expect(freeze.type).toBe(Freeze);
    expect(seq.type).toBe(Sequence);
    return {
      id: String(el.key), style: el.props.style, leg: leg.props.style, frame: freeze.props.frame,
      seq: { durationInFrames: seq.props.durationInFrames, width: seq.props.width, height: seq.props.height },
      node: seq.props.children,
    };
  });

  const SA = { right: 0.16, bottom: 0.08 };
  const CATALOG: StageMetrics = {
    headTopFrac: 0.016, bottomFrac: 1, waistFrac: 1, centerXFrac: 0.52, leftFrac: 0.29, rightFrac: 0.75,
    subjectHeightFrac: 0.984, upperBodyLeftFrac: 0.29, upperBodyRightFrac: 0.68, imgW: 1942, imgH: 1473,
  };
  const LEG = { legW: 1383, legH: 1049 };
  const pairProps = (calls: string[] = []): StratoStageProps => ({
    canvas: { w: 750, h: 570 }, safeArea: SA, metrics: CATALOG, srcs: { character: 'char.png' },
    iface: { kind: 'pair', ...LEG }, characterFramed: true, interfaceDurationInFrames: 90,
    renderInterface: (layer) => { calls.push(layer); return `LEG:${layer}`; },
  });
  const legacyProps: StratoStageProps = {
    canvas: { w: 750, h: 570 }, safeArea: SA, metrics: CATALOG, srcs: { character: 'char.png' },
    iface: { kind: 'feature-highlight', legW: 769, legH: 180 }, interfaceDurationInFrames: 90, interfaceNode: 'LEGACY',
  };

  it('the pair: the leg below the character and above it, each mount its own layer, in its box', () => {
    const calls: string[] = [];
    const props = pairProps(calls);
    const frame = 60;
    const m = mounts(renderStratoStage(props, frame, 30) as El);
    expect(m.map((x) => x.id)).toEqual(['background', 'character', 'foreground']);
    expect(calls).toEqual(['background', 'foreground']);
    const layers = buildStageLayers(props, (frame * 1000) / 30);
    const pl = placeStage(props);
    expect(m[1]).toEqual({ id: 'character', src: '/char.png', style: layerStyle(layers[1]) });
    for (const [i, layer] of [[0, 'background'], [2, 'foreground']] as const) {
      const mount = m[i];
      expect(mount.style, layer).toEqual(layerStyle(layers[i]));
      expect(layers[i].rect, layer).toEqual(pl.pair![layer]); // the mount box of placeStage, characterFramed included
      expect(mount.leg, layer).toEqual(interfaceLegStyle(pl.pair![layer], LEG));
      expect(mount.seq, layer).toEqual({ durationInFrames: 90, width: LEG.legW, height: LEG.legH });
      expect(mount.node, layer).toBe(`LEG:${layer}`);
    }
  });

  it('characterFramed passes through to placeStage', () => {
    const framed = mounts(renderStratoStage(pairProps(), 60, 30) as El);
    const virtual = mounts(renderStratoStage({ ...pairProps(), characterFramed: false }, 60, 30) as El);
    const box = (s: Record<string, unknown> | undefined) => [s?.left, s?.top, s?.width, s?.height];
    const f = placeStage(pairProps()).pair!.background;
    const v = placeStage({ ...pairProps(), characterFramed: false }).pair!.background;
    expect(box(framed[0].style)).toEqual([f.x, f.y, f.w, f.h]);
    expect(box(virtual[0].style)).toEqual([v.x, v.y, v.w, v.h]);
    expect(f.x).not.toBeCloseTo(v.x, 0);
  });

  it('animated pair: both mounts frozen at the leg\'s frame 0 until frame 38, playing from 39', () => {
    for (let f = 0; f < 150; f++) {
      const m = mounts(renderStratoStage(pairProps(), f, 30) as El);
      const own = interfacePhase(f, 39, 90, 'animated').frame;
      expect([m[0].frame, m[2].frame], `frame ${f}`).toEqual([own, own]);
    }
    expect(mounts(renderStratoStage(pairProps(), 38, 30) as El)[2].frame).toBe(0);
    expect(mounts(renderStratoStage(pairProps(), 39, 30) as El)[2].frame).toBe(0);
    expect(mounts(renderStratoStage(pairProps(), 40, 30) as El)[2].frame).toBe(1);
  });

  it('still pair: both mounts show the leg\'s last frame throughout', () => {
    for (const f of [0, 38, 39, 149]) {
      const m = mounts(renderStratoStage({ ...pairProps(), interfaceMotion: 'still' }, f, 30) as El);
      expect([m[0].frame, m[2].frame], `frame ${f}`).toEqual([89, 89]);
    }
  });

  it('a pair without renderInterface paints only the character; a degenerate pair mounts nothing', () => {
    const { renderInterface: _none, ...bare } = pairProps();
    expect(mounts(renderStratoStage(bare, 60, 30) as El).map((x) => x.id)).toEqual(['character']);
    const calls: string[] = [];
    const STRIP: StageMetrics = {
      headTopFrac: 0.35, bottomFrac: 0.65, leftFrac: 0, rightFrac: 1, subjectHeightFrac: 0.3, centerXFrac: 0.5,
      upperBodyLeftFrac: 0.1, upperBodyRightFrac: 0.9, imgW: 1536, imgH: 2048,
    };
    const degenerate = { ...pairProps(calls), canvas: { w: 320, h: 2048 }, metrics: STRIP, characterFramed: false };
    expect(mounts(renderStratoStage(degenerate, 60, 30) as El).map((x) => x.id)).toEqual(['character']);
    expect(calls).toEqual([]);
  });

  it('legacy: one mount of interfaceNode over the character, released at frame 27 as before', () => {
    const calls: string[] = [];
    const props = { ...legacyProps, renderInterface: (layer: 'background' | 'foreground') => { calls.push(layer); return 'NO'; } };
    for (let f = 0; f < 150; f++) {
      const m = mounts(renderStratoStage(props, f, 30) as El);
      expect(m.map((x) => x.id), `frame ${f}`).toEqual(['character', 'interface']);
      expect(m[1].frame, `frame ${f}`).toBe(interfacePhase(f, 27, 90, 'animated').frame);
      expect(m[1].node).toBe('LEGACY');
    }
    expect(calls).toEqual([]); // renderInterface is the pair's; a legacy kind never calls it
    expect(mounts(renderStratoStage(props, 28, 30) as El)[1].frame).toBe(1);
    const { interfaceNode: _gone, ...noNode } = legacyProps;
    expect(mounts(renderStratoStage(noNode, 60, 30) as El).map((x) => x.id)).toEqual(['character']);
  });
});
