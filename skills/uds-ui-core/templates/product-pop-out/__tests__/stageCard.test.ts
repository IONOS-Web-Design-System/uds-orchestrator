import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { renderStageCard, renderStageBadge, renderStageText, stageAccentFill, stageOutline, STAGE_INK } from '../StageCard';
import { AI_SVG } from '../promptWindow.icons';
import { GlowText, STRATO_AI_MATERIAL, STRATO_FULL, STRATO_PROMPT } from '../promptWindow.strato';

type El = ReactElement<{ style?: Record<string, number | string>; children?: unknown; svg?: string; colour?: string }>;

function walk(el: unknown, out: El[] = []): El[] {
  if (!el || typeof el !== 'object') return out;
  if (Array.isArray(el)) { el.forEach((k) => walk(k, out)); return out; }
  const node = el as El & { type?: unknown };
  if (typeof node.type === 'function') return walk((node.type as (p: unknown) => unknown)(node.props), out);
  if (node.props) out.push(node);
  walk(node.props?.children, out);
  return out;
}
const styles = (els: El[]) => els.map((e) => e.props.style ?? {});
const card = (ai: boolean, w = 400, h = 300) => renderStageCard({ ai, children: 'X', slot: { w, h } }) as El;
const AI_GRAD = 'linear-gradient(45deg, #0000FF, #00FFFF)';

describe('StageCard', () => {
  it('AI card: hard-light 45° AI gradient glow at 0.4 under 70 % glass', () => {
    const s = styles(walk(card(true)));
    const glow = s.find((x) => x.mixBlendMode === 'hard-light')!;
    expect(glow.background).toBe(AI_GRAD);
    expect(glow.opacity).toBe(0.4);
    expect(glow.filter).toBe(`blur(${0.067 * 400}px)`);
    expect(s.some((x) => x.background === 'rgba(255,255,255,0.7)')).toBe(true);
  });
  it('non-AI card: no #0000FF or #00FFFF anywhere; glow is the dimmed primary at 0.32', () => {
    const s = styles(walk(card(false)));
    expect(JSON.stringify(s)).not.toMatch(/#0000FF|#00FFFF/i);
    const glow = s.find((x) => x.mixBlendMode === 'hard-light')!;
    expect(glow.background).toBe(STRATO_AI_MATERIAL.nonAi.glow);
    expect(glow.opacity).toBe(0.32);
  });
  it('wrapper creates no stacking context', () => {
    for (const ai of [true, false]) {
      const root = card(ai).props.style!;
      for (const k of ['zIndex', 'opacity', 'transform', 'filter', 'isolation', 'mixBlendMode']) expect(root[k]).toBeUndefined();
    }
  });
  it('geometry is px off the slot width', () => {
    const s = styles(walk(card(true)));
    expect(s.some((x) => x.borderRadius === 0.0376 * 400)).toBe(true);
    expect(0.0376 * 400).toBeCloseTo(15.04, 5);
    expect(s.some((x) => x.padding === 0.051 * 400)).toBe(true);
    expect(s.some((x) => x.backdropFilter === `blur(${0.0103 * 400}px) saturate(1.15)`)).toBe(true);
  });
  it('the glass is the prompt window\'s: blurred and saturate(1.15)', () => {
    for (const ai of [true, false]) {
      const glass = styles(walk(card(ai))).find((x) => x.background === STRATO_AI_MATERIAL.glass)!;
      expect(glass.backdropFilter).toMatch(/^blur\([\d.]+px\) saturate\(1\.15\)$/);
    }
  });
  it('card content is #29294D Poppins (the prompt window\'s face)', () => {
    for (const ai of [true, false]) {
      const glass = styles(walk(card(ai))).find((x) => x.background === STRATO_AI_MATERIAL.glass)!;
      expect(glass.color).toBe('#29294D');
      expect(glass.fontFamily).toBe(STRATO_PROMPT.face);
      expect(glass.fontFamily).toBe('Poppins');
    }
  });
});

describe('StageText', () => {
  const text = (style?: Record<string, string | number>, w = 400) =>
    renderStageText({ children: 'Hello', style, slot: { w, h: 300 } }) as El;
  it('is the prompt window\'s GlowText (reused, not copied)', () => {
    expect(text().type).toBe(GlowText);
  });
  it('draws the plus-lighter white halo under the crisp #29294D Poppins text', () => {
    const [outer, halo, crisp] = walk(text({ fontSize: 24, fontWeight: 600 }));
    expect(outer.props.style).toEqual({ position: 'relative' });
    expect(halo.props.style).toMatchObject({
      mixBlendMode: 'plus-lighter', position: 'absolute', inset: 0,
      color: `rgba(255,255,255,${STRATO_FULL.textGlowAlpha})`,
      filter: `blur(${STRATO_FULL.textGlowBlurOfW * 400}px)`,
      fontSize: 24, fontWeight: 600, fontFamily: 'Poppins',
    });
    expect(crisp.props.style).toMatchObject({ color: '#29294D', fontFamily: 'Poppins', fontSize: 24, fontWeight: 600 });
    expect(halo.props.children).toBe('Hello');
  });
  it('the halo blur scales with the slot width; ink and face cannot be overridden', () => {
    const [, halo, crisp] = walk(text({ color: 'red', fontFamily: 'Arial' }, 600));
    expect(halo.props.style!.filter).toBe(`blur(${STRATO_FULL.textGlowBlurOfW * 600}px)`);
    expect(crisp.props.style).toMatchObject({ color: '#29294D', fontFamily: 'Poppins' });
  });
});

describe('StageBadge', () => {
  const badge = (ai: boolean, glyph?: unknown) => renderStageBadge({ ai, glyph, slot: { w: 400, h: 300 } } as never) as El;
  it('StageBadge AI is the gradient circle with a white glyph; non-AI is primary with the given glyph', () => {
    const a = badge(true);
    expect(a.props.style!.background).toBe(AI_GRAD);
    expect(a.props.style!.borderRadius).toBe('50%');
    expect(a.props.style!.width).toBe(0.17 * 400);
    expect(a.props.style!.boxShadow).toBe('0 4px 10px rgba(41,41,77,0.12)');
    const icon = a.props.children as El; // unresolved FlatIcon element
    expect(icon.props.svg).toBe(AI_SVG['filled-sparkles']);
    expect(icon.props.colour).toBe('#FFFFFF');
    const n = badge(false, 'GLYPH');
    expect(n.props.style!.background).toBe(STRATO_AI_MATERIAL.nonAi.accent);
    expect(n.props.style!.boxShadow).toBe('0 4px 10px rgba(41,41,77,0.12)');
    expect(JSON.stringify(n.props.children)).toContain('GLYPH');
    expect(JSON.stringify(n)).not.toMatch(/#0000FF|#00FFFF/i);
    expect(JSON.stringify(n)).not.toContain(AI_SVG['filled-sparkles']);
    expect(n.props.style!.color).toBe('#FFFFFF');
    expect(a.props.style!.color).toBe('#FFFFFF');
  });
});

describe('non-AI badge never shows the AI sparkle', () => {
  // Raw element tree (no function resolution), so a FlatIcon element is visible by its props.
  const raw = (el: unknown, out: El[] = []): El[] => {
    if (!el || typeof el !== 'object') return out;
    if (Array.isArray(el)) { el.forEach((k) => raw(k, out)); return out; }
    const node = el as El;
    if (node.props) { out.push(node); raw(node.props.children, out); }
    return out;
  };
  it('no glyph given: no sparkles FlatIcon anywhere, circle is empty', () => {
    // The type forbids this call; cast to exercise the runtime fallback.
    const b = renderStageBadge({ ai: false, slot: { w: 400, h: 300 } } as never) as El;
    expect(raw(b).some((e) => e.props.svg === AI_SVG['filled-sparkles'])).toBe(false);
    expect(b.props.children).toBeFalsy();
  });
  it('type pin: a non-AI badge requires a glyph', () => {
    // @ts-expect-error glyph is required when ai is false
    const call = () => renderStageBadge({ ai: false, slot: { w: 400, h: 300 } });
    expect(typeof call).toBe('function');
  });
});

describe('stage tokens', () => {
  it('accent fill / outline / ink', () => {
    expect(stageAccentFill(true)).toBe('linear-gradient(90deg, #0000FF, #00FFFF)');
    expect(stageAccentFill(false)).toBe(STRATO_AI_MATERIAL.nonAi.accent);
    expect(stageOutline(true)).toBe('#0000FF');
    expect(stageOutline(false)).toBe(STRATO_AI_MATERIAL.nonAi.accent);
    expect(STAGE_INK).toBe('#29294D');
  });
});
