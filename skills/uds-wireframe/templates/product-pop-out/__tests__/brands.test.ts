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
    expect(b.simple).toEqual({ surface: 'rgba(255,255,255,0.88)', blurPx: 14, face: 'Open Sans' });
    // BOTH variants are real glass now — translucent nearly-white + a blur that actually takes
    // effect (an opaque backdrop makes `backdropFilter` a no-op). `prompt-full` previously had
    // no blur at all and an opaque #F5F5F5/#FFFFFF fill; it now matches `simple`'s material.
    expect(b.full).toEqual({ surface: 'rgba(255,255,255,0.88)', blurPx: 14, face: 'Overpass' });
    expect(b.full.surface).toBe('rgba(255,255,255,0.88)');
    expect(b.text).toBe('#001B41');
    expect(b.shadow).toBe('0 8px 24px rgba(0,27,65,0.10)');
  });

  it('never exposes the retired purple-500', () => {
    expect(JSON.stringify(PROMPT_WINDOW_BRANDS)).not.toContain('#B410E7');
  });

  it('no longer carries the retired off-white card surface', () => {
    // #F5F5F5 was `prompt-full`'s old surface. It must not survive anywhere — including in a ring
    // button's padding-box layer, which reads `full.surface` rather than a literal of its own.
    expect(JSON.stringify(PROMPT_WINDOW_BRANDS)).not.toContain('#F5F5F5');
  });

  it('gives both variants a WORKING blur — translucent surface, non-zero blurPx', () => {
    // The regression this guards: an opaque surface makes `backdropFilter` a complete no-op.
    // Asserting the alpha is < 1 (not just "equals this exact string") is what actually pins
    // "the blur can take effect" — an equality-only check would pass even if some future edit
    // silently swapped back to an opaque hex with the same shape of assertion.
    const b = PROMPT_WINDOW_BRANDS.ionos;
    for (const variant of [b.simple, b.full] as const) {
      expect(variant.blurPx).toBe(14);
      expect(variant.blurPx).toBeGreaterThan(0);
      const match = variant.surface.match(/^rgba\(\s*255,\s*255,\s*255,\s*([\d.]+)\s*\)$/);
      expect(match).not.toBeNull();
      const alpha = Number(match![1]);
      expect(alpha).toBeLessThan(1);
      expect(alpha).toBeCloseTo(0.88, 5);
    }
  });
});
