import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { renderStageCard, renderStageBadge, renderStageTile, renderStageText, stageAccentFill, stageOutline, STAGE_INK } from '../StageCard';
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

describe('StageCard hugs its content', () => {
  const w = 400, h = 300;
  it('outer wrapper is a slot-size flex box centred vertically, no stacking context', () => {
    const root = card(true, w, h).props.style!;
    expect(root).toMatchObject({ width: w, height: h, display: 'flex', alignItems: 'center' });
    for (const k of ['position', 'transform', 'opacity', 'filter', 'zIndex', 'isolation']) expect(root[k]).toBeUndefined();
    const inner = (card(true, w, h).props.children as El).props.style!;
    expect(inner.position).toBe('relative');
    for (const k of ['transform', 'opacity', 'filter', 'zIndex', 'isolation']) expect(inner[k]).toBeUndefined();
  });
  it('the card is the wrapper\'s single relative child of slot width: glow first (absolute inset 0), then glass', () => {
    const root = card(true, w, h);
    const cardEl = root.props.children as El;
    expect(cardEl.props.style).toMatchObject({ position: 'relative', width: w });
    const [glow, glass] = cardEl.props.children as El[];
    expect(glow.props.style).toMatchObject({ position: 'absolute', inset: 0, mixBlendMode: 'hard-light' });
    expect(glass.props.style!.background).toBe(STRATO_AI_MATERIAL.glass);
  });
  it('the glass is normal flow with min and max height and unchanged padding', () => {
    for (const ai of [true, false]) {
      const glass = styles(walk(card(ai, w, h))).find((x) => x.background === STRATO_AI_MATERIAL.glass)!;
      expect(glass.position).toBe('relative');
      expect(glass.inset).toBeUndefined();
      expect(glass.maxHeight).toBe(h);
      expect(glass.minHeight).toBe((0.17 + 2 * 0.051) * w);
      expect(glass.padding).toBe(0.051 * w);
      expect(glass.overflow).toBeUndefined();
      expect(glass.textAlign).toBeUndefined();
    }
  });
});

describe('StageText', () => {
  it('defaults to the Figma headline: bold uppercase, sized off the card width', () => {
    const [, , crisp] = walk(renderStageText({ children: 'Hi', slot: { w: 400, h: 300 } }) as El);
    expect(crisp.props.style).toMatchObject({
      fontWeight: 700, textTransform: 'uppercase', fontSize: 0.068 * 400, lineHeight: 1.15, letterSpacing: '0.01em',
      color: '#29294D', fontFamily: 'Poppins',
    });
  });
  it('style overrides the defaults', () => {
    const [, , crisp] = walk(renderStageText({ children: 'Hi', style: { fontSize: 10, fontWeight: 400, textTransform: 'none' }, slot: { w: 400, h: 300 } }) as El);
    expect(crisp.props.style).toMatchObject({ fontSize: 10, fontWeight: 400, textTransform: 'none', lineHeight: 1.15 });
  });
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

const URI = 'data:image/svg+xml;base64,PHN2Zy8+';
const maskSpan = (root: El) => walk(root).map((e) => e.props.style ?? {}).find((x) => x.WebkitMaskImage !== undefined);

describe('R-J: a data-URI glyph is a white masked icon, never text', () => {
  const badge = (ai: boolean, glyph: unknown) => renderStageBadge({ ai, glyph, slot: { w: 400, h: 300 } } as never) as El;
  const tile = (ai: boolean, glyph: unknown) => renderStageTile({ ai, glyph, slot: { w: 400, h: 300 } } as never) as El;
  it('badge: masked span of the glyph size, URI not a child', () => {
    for (const ai of [true, false]) {
      const b = badge(ai, URI);
      const m = maskSpan(b)!;
      expect(m.backgroundColor).toBe('#FFFFFF');
      expect(m.WebkitMaskImage).toBe(`url("${URI}")`);
      expect(m.maskImage).toBe(`url("${URI}")`);
      for (const pre of ['', 'Webkit']) {
        const k = (n: string) => (pre ? `${pre}${n}` : n.charAt(0).toLowerCase() + n.slice(1));
        expect(m[k('MaskSize')]).toBe('contain');
        expect(m[k('MaskRepeat')]).toBe('no-repeat');
        expect(m[k('MaskPosition')]).toBe('center');
      }
      expect(m.width).toBe(0.17 * 400 * 0.55);
      expect(m.height).toBe(0.17 * 400 * 0.55);
      expect(walk(b).some((e) => e.props.children === URI)).toBe(false);
      expect(b.props.children).not.toBe(URI);
    }
  });
  it('tile: masked span of 0.55 of the tile, URI not a child', () => {
    const t = tile(false, URI);
    const m = maskSpan(t)!;
    expect(m.backgroundColor).toBe('#FFFFFF');
    expect(m.maskImage).toBe(`url("${URI}")`);
    expect(m.width).toBeCloseTo(0.2 * 400 * 0.55, 8);
    expect(walk(t).some((e) => e.props.children === URI)).toBe(false);
  });
  it('quotes the URI and escapes a double quote in it', () => {
    const m = maskSpan(badge(false, 'data:image/svg+xml;utf8,<svg a="b"/>'))!;
    expect(m.maskImage).toBe('url("data:image/svg+xml;utf8,<svg a=\\"b\\"/>")');
  });
  it('a ReactNode / non-data string glyph is unchanged', () => {
    expect(maskSpan(badge(false, 'GLYPH'))).toBeUndefined();
    expect(badge(false, 'GLYPH').props.children).toBe('GLYPH');
    expect(maskSpan(tile(false, 'GLYPH'))).toBeUndefined();
    expect(tile(false, 'GLYPH').props.children).toBe('GLYPH');
  });
});

describe('StageTile', () => {
  const tile = (p: Record<string, unknown>) => renderStageTile({ glyph: 'G', ...p, slot: { w: 400, h: 300 } } as never) as El;
  it('default size 0.2 of the slot width, radius 0.26 of the tile, badge shadow', () => {
    const t = tile({ ai: false });
    expect(t.props.style).toMatchObject({ width: 80, height: 80, borderRadius: 0.26 * 80, boxShadow: '0 4px 10px rgba(41,41,77,0.12)', color: '#FFFFFF' });
  });
  it('size is a ratio of the slot width', () => {
    expect(tile({ ai: false, size: 0.3 }).props.style).toMatchObject({ width: 120, height: 120, borderRadius: 0.26 * 120 });
  });
  it('ai fill is the strato AI gradient; non-AI the primary accent, no AI colours', () => {
    expect(tile({ ai: true }).props.style!.background).toBe(AI_GRAD);
    const n = tile({ ai: false });
    expect(n.props.style!.background).toBe(STRATO_AI_MATERIAL.nonAi.accent);
    expect(JSON.stringify(n)).not.toMatch(/#0000FF|#00FFFF/i);
  });
});
