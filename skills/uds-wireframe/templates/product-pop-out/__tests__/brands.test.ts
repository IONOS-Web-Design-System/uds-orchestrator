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
    expect(b.full).toEqual({ surface: '#F5F5F5', face: 'Overpass' });
    expect(b.text).toBe('#001B41');
    expect(b.shadow).toBe('0 8px 24px rgba(0,27,65,0.10)');
  });

  it('never exposes the retired purple-500', () => {
    expect(JSON.stringify(PROMPT_WINDOW_BRANDS)).not.toContain('#B410E7');
  });
});
