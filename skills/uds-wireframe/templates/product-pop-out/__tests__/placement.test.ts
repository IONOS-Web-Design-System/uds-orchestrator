// PromptWindow as THE AI prompt template everywhere (2026-10-07): besides the corporate_stage
// contract rect (absolute, left/bottom), it renders IN FLOW inside a card / panel / step layout.
import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, SendButton, SIMPLE } from '../PromptWindow';
import { PROMPT_WINDOW_BRANDS, aiGradient } from '../promptWindow.brands';

type StyledEl = ReactElement<{ style?: Record<string, unknown>; children?: unknown }>;
const base = { promptText: 'Eine App für mein Café', width: 360 } as const;

describe('PromptWindow in-flow placement (no left/bottom)', () => {
  for (const variant of ['prompt-simple', 'prompt-full'] as const) {
    it(`${variant}: flows in its parent — no absolute position, no offsets, no stacking override`, () => {
      const style = (PromptWindow({ ...base, variant, brand: 'ionos' }) as StyledEl).props.style!;
      expect(style.position).toBe('relative');
      expect(style.left).toBeUndefined();
      expect(style.bottom).toBeUndefined();
      expect(style.zIndex).toBeUndefined();
      expect(style.width).toBe(360);
    });

    it(`${variant}: the contract rect keeps the absolute, bottom-anchored, z-indexed window`, () => {
      const style = (PromptWindow({ ...base, variant, brand: 'ionos', left: 12, bottom: 40 }) as StyledEl).props.style!;
      expect(style.position).toBe('absolute');
      expect(style.left).toBe(12);
      expect(style.bottom).toBe(40);
      expect(style.zIndex).toBe(100);
    });
  }

  it('in-flow geometry is the same measured geometry (height from the Figma aspect)', () => {
    const style = (PromptWindow({ ...base, variant: 'prompt-simple', brand: 'ionos' }) as StyledEl).props.style!;
    expect(style.height).toBeCloseTo(360 / SIMPLE.aspect, 5);
  });
});

describe('PromptWindow strato', () => {
  it('uses the STRATO AI concept: cyan→pink gradient, dark label, Poppins, strato body text', () => {
    expect(aiGradient('strato')).toBe('linear-gradient(45deg, #1FD7FF, #E498FF)');
    const b = PROMPT_WINDOW_BRANDS.strato;
    expect(b.onGradient).toBe('#29294D');
    expect(b.text).toBe('#2F2F70');
    expect(b.simple.face).toBe('Poppins');
    expect(b.full.face).toBe('Poppins');
  });

  it('the send glyph takes the brand on-gradient colour — dark on strato, white on ionos', () => {
    const glyph = (brand: 'ionos' | 'strato') => {
      const btn = SendButton({ size: 40, brand, glyph: 'arrow', glyphRatio: 0.44 }) as StyledEl;
      return (btn.props.children as ReactElement<{ colour: string }>).props.colour;
    };
    expect(glyph('ionos')).toBe('#FFFFFF');
    expect(glyph('strato')).toBe('#29294D');
  });

  it('never paints the IONOS gradient on strato', () => {
    expect(JSON.stringify(PROMPT_WINDOW_BRANDS.strato)).not.toMatch(/#095BB1|#D746F5/i);
  });
});
