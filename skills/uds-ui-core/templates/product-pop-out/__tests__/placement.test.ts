import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, SendButton } from '../PromptWindow';
import { PROMPT_WINDOW_BRANDS, aiGradient } from '../promptWindow.brands';

type StyledEl = ReactElement<{ style?: Record<string, unknown>; children?: unknown }>;
const base = { promptText: 'Eine App für mein Café', width: 360 } as const;

// User ruling 2026-10-07 (2nd): PromptWindow is ONLY a floating AI window — absolute, a direct child
// of the root — never inside an interface. A prompt inside an interface is KitInput + an AI button.
describe('PromptWindow is floating only', () => {
  for (const variant of ['prompt-simple', 'prompt-full'] as const) {
    it(`${variant}: always absolute, bottom-anchored and z-indexed from its left/bottom`, () => {
      const style = (PromptWindow({ ...base, variant, brand: 'ionos', left: 12, bottom: 40 }) as StyledEl).props.style!;
      expect(style.position).toBe('absolute');
      expect(style.left).toBe(12);
      expect(style.bottom).toBe(40);
      expect(style.zIndex).toBe(100);
    });
  }

  it('left and bottom are required (an in-flow window does not type-check)', () => {
    // @ts-expect-error — no in-flow placement: a floating window needs its rect
    PromptWindow({ ...base, variant: 'prompt-simple', brand: 'ionos' });
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
