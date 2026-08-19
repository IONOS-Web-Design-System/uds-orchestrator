import { describe, it, expect } from 'vitest';
import { PROMPT_WINDOW_BRANDS, AI_GRADIENT_ANGLE_DEG, aiGradient } from '../promptWindow.brands';

describe('promptWindow.brands', () => {
  it('uses the 45deg AI gradient — never 135deg', () => {
    // Two shipped rules disagreed; 45deg is confirmed by ionos-ai-features.md AND by
    // pixel-sampling prod run 2ded5927 (blue strongest bottom-left). See spec section 5b.
    expect(AI_GRADIENT_ANGLE_DEG).toBe(45);
    expect(aiGradient('ionos')).toBe('linear-gradient(45deg, #095BB1, #D746F5)');
    expect(aiGradient('ionos')).not.toContain('135deg');
  });

  it('carries the measured IONOS surfaces and faces per variant', () => {
    const b = PROMPT_WINDOW_BRANDS.ionos;
    expect(b.simple).toEqual({ surface: '#FFFFFF', blurPx: 14, face: 'Open Sans' });
    // BOTH surfaces are `--surface-base` — "white on light", per the designer. `prompt-full` was
    // #F5F5F5, a second fill tier the design never asked for.
    expect(b.full).toEqual({ surface: '#FFFFFF', face: 'Overpass' });
    expect(b.full.surface).toBe('#FFFFFF');
    expect(b.text).toBe('#001B41');
    expect(b.shadow).toBe('0 8px 24px rgba(0,27,65,0.10)');
  });

  it('never exposes the retired purple-500', () => {
    expect(JSON.stringify(PROMPT_WINDOW_BRANDS)).not.toContain('#B410E7');
  });

  it('no longer carries the retired off-white card surface', () => {
    // #F5F5F5 was `prompt-full`'s surface. The floating window is `--surface-base` white now, so
    // the off-white must not survive anywhere — including in a ring button's padding-box layer,
    // which reads `full.surface` rather than a literal of its own.
    expect(JSON.stringify(PROMPT_WINDOW_BRANDS)).not.toContain('#F5F5F5');
  });
});
