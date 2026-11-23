import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow } from '../PromptWindow';
import { StratoPromptWindow, STRATO_FULL, STRATO_SIMPLE } from '../promptWindow.strato';

type El = ReactElement<{ style?: Record<string, unknown>; children?: unknown; [k: string]: unknown }>;

/** Expand the tree: function components are called with their props so their own output is
 *  inspected (PromptWindow → StratoPromptWindow → GlowText …). */
function walk(el: unknown, out: El[] = []): El[] {
  if (!el || typeof el !== 'object') return out;
  if (Array.isArray(el)) { el.forEach((k) => walk(k, out)); return out; }
  const node = el as El & { type?: unknown };
  if (typeof node.type === 'function') return walk((node.type as (p: unknown) => unknown)(node.props), out);
  if (node.props) out.push(node);
  walk(node.props?.children, out);
  return out;
}

const base = { promptText: 'Schreib die Überschrift für mein Fotostudio emotionaler', width: 497, left: 40, bottom: 60 };
const render = (over: Record<string, unknown> = {}) =>
  walk(PromptWindow({ variant: 'prompt-full', brand: 'strato', label: 'Anforderung KI Website-Generator', ...base, ...over } as Parameters<typeof PromptWindow>[0]));
const styles = (els: El[]) => els.map((e) => e.props.style ?? {});

describe('STRATO PromptWindow', () => {
  it('brand="strato" renders the strato design, not the IONOS recolour', () => {
    const s = styles(render());
    expect(s.some((x) => x.mixBlendMode === 'hard-light')).toBe(true);
    expect(s.some((x) => x.background === 'rgba(255,255,255,0.7)')).toBe(true);
    // IONOS's 0.88 glass never appears on strato.
    expect(s.some((x) => x.background === 'rgba(255,255,255,0.88)')).toBe(false);
  });
  it('the glass is the Subtle level (white 70 %)', () => {
    const s = styles(render());
    expect(s.some((x) => x.background === 'rgba(255,255,255,0.7)')).toBe(true);
    expect(s.some((x) => x.background === 'rgba(255,255,255,0.56)')).toBe(false);
  });
  it('the glow layer is at 40 % strength at glow=1', () => {
    const op = (glow: number) => styles(render({ glow })).find((x) => x.mixBlendMode === 'hard-light')!.opacity;
    expect(op(1)).toBe(0.4);
    expect(op(0.5)).toBe(0.2);
  });
  it('the prompt-simple AI button halo is 20 %', () => {
    const s = styles(render({ variant: 'prompt-simple', label: undefined, pulse: 0 }));
    expect(s.some((x) => String(x.boxShadow ?? '').includes('rgba(0,0,0,0.2)'))).toBe(true);
    expect(s.some((x) => String(x.boxShadow ?? '').includes('rgba(0,0,0,0.52)'))).toBe(false);
  });
  it('the wrapper creates NO stacking context so the hard-light glow blends with the canvas', () => {
    const root = render()[0]!.props.style!;
    expect(root.position).toBe('absolute');
    for (const k of ['zIndex', 'opacity', 'transform', 'filter', 'isolation', 'mixBlendMode']) expect(root[k]).toBeUndefined();
    // the glass card carries the z-index instead
    expect(styles(render()).some((x) => x.zIndex === 100 && x.background === 'rgba(255,255,255,0.7)')).toBe(true);
  });
  it('text glow is a plus-lighter blurred white copy (Figma linear dodge)', () => {
    const s = styles(render());
    expect(s.some((x) => x.mixBlendMode === 'plus-lighter' && String(x.color).startsWith('rgba(255,255,255'))).toBe(true);
  });
  it('geometry is px off width (never CSS %), multi-line clamps at 3, pill at 2', () => {
    const full = styles(render());
    const card = full.find((x) => x.zIndex === 100)!;
    expect(card.padding).toBeCloseTo(497 * STRATO_FULL.padOfW);
    expect(full.some((x) => x.WebkitLineClamp === 3)).toBe(true);
    const pill = styles(render({ variant: 'prompt-simple', width: 455 }));
    const pcard = pill.find((x) => x.zIndex === 100)!;
    expect(pcard.height).toBeCloseTo(455 / STRATO_SIMPLE.aspect);
    expect(pcard.borderRadius).toBe(9999);
    expect(pill.some((x) => x.WebkitLineClamp === 2)).toBe(true);
    for (const x of [...full, ...pill]) for (const [k, v] of Object.entries(x)) if (/^(padding|gap|borderRadius)/.test(k)) expect(typeof v).toBe('number');
  });
  it('the label shows on prompt-full only, uppercase', () => {
    const els = render();
    expect(els.some((e) => e.props.children === 'Anforderung KI Website-Generator' && e.props.style?.textTransform === 'uppercase')).toBe(true);
    const pill = render({ variant: 'prompt-simple', width: 455 });
    expect(pill.some((e) => e.props.children === 'Anforderung KI Website-Generator')).toBe(false);
  });
  it('motion props: glow 0 hides the glow, caret adds a caret, pulse scales the AI circle', () => {
    const glow0 = styles(render({ glow: 0 })).find((x) => x.mixBlendMode === 'hard-light')!;
    expect(glow0.opacity).toBe(0);
    const rest = styles(render()).filter((x) => typeof x.transform === 'string' && String(x.transform).startsWith('scale'));
    expect(rest).toHaveLength(0);
    const pulsed = styles(render({ pulse: 1 })).filter((x) => String(x.transform ?? '').startsWith('scale(1.08'));
    expect(pulsed.length).toBeGreaterThan(0);
    const withCaret = render({ caret: true });
    expect(withCaret.length).toBeGreaterThan(render().length);
  });
  it('glowAngleDeg rotates ONLY the glow layer; the AI badge gradient stays static', () => {
    const s = styles(render({ glowAngleDeg: 300 }));
    expect(s.find((x) => x.mixBlendMode === 'hard-light')!.background).toContain('linear-gradient(300deg');
    expect(s.filter((x) => String(x.background ?? '').includes('300deg'))).toHaveLength(1);
    expect(s.some((x) => x.background === 'linear-gradient(45deg, #0000FF, #00FFFF)')).toBe(true);
  });
  it('the AI badge / button glyph is white on the blue→cyan gradient (UDS text-semantic-ai)', () => {
    for (const variant of ['prompt-full', 'prompt-simple'] as const) {
      // FlatIcon renders a masked div whose fill is the glyph colour.
      const glyphs = styles(render({ variant })).filter((x) => x.maskImage !== undefined);
      expect(glyphs.length, variant).toBeGreaterThan(0);
      for (const g of glyphs) expect(g.backgroundColor, variant).toBe('#FFFFFF');
    }
  });
  it('the send-pulse flare uses the new AI end colour, never a retired one', () => {
    const shadows = styles(render({ variant: 'prompt-simple', pulse: 1 })).map((x) => String(x.boxShadow ?? '')).join(' ');
    expect(shadows).toMatch(/rgba\(0,255,255,0\.8\)/);
    expect(shadows).not.toMatch(/228,\s*152,\s*255/);
  });
  it('an IONOS window is unchanged by the strato branch', () => {
    const ionos = PromptWindow({ variant: 'prompt-simple', brand: 'ionos', ...base, width: 451 } as Parameters<typeof PromptWindow>[0]) as El;
    expect(ionos.props.style!.background).toBe('rgba(255,255,255,0.88)');
    expect(ionos.props.style!.zIndex).toBe(100);
  });
  it('StratoPromptWindow defaults the icon via PromptWindow when leadingIcon is none', () => {
    const el = PromptWindow({ variant: 'prompt-simple', brand: 'strato', ...base, leadingIcon: 'none' } as Parameters<typeof PromptWindow>[0]) as El & { type: unknown };
    expect(el.type).toBe(StratoPromptWindow);
    expect(el.props.icon).toBe('filled-sparkles');
  });
});
