import { describe, it, expect } from 'vitest';
import { INTERFACE_ANIM_START_MS, interfacePhase, msToFrame } from '../motion';

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
