import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, RingButton, FULL } from '../PromptWindow';
import { ACTION_SVG } from '../promptWindow.icons';

const W = 483.6;

/** `ReactElement`'s P defaults to `unknown` in @types/react 19, so a bare cast makes
 *  `.props` unreadable and tsc fails TS18046. These tests read only `style` and
 *  `children`, so name that shape once. */
type StyledEl = ReactElement<{ style?: Record<string, unknown>; children?: unknown }>;

const render = (over: Record<string, unknown> = {}) =>
  PromptWindow({
    variant: 'prompt-full', brand: 'ionos',
    promptText: 'Erstelle eine moderne Website für ein Bistro',
    actions: ['edit', 'regenerate'], leadingIcon: 'filled-sparkles',
    sendGlyph: 'arrow', width: W, left: 0, bottom: 100, ...over,
  } as Parameters<typeof PromptWindow>[0]) as StyledEl;

function walk(el: unknown, out: StyledEl[] = []): StyledEl[] {
  if (!el || typeof el !== 'object') return out;
  const node = el as StyledEl;
  if (node.props) out.push(node);
  const c = node.props?.children;
  if (Array.isArray(c)) c.forEach((k) => walk(k, out));
  else if (c) walk(c, out);
  return out;
}

/** The direct children of an element, flattened, non-elements dropped. Child COMPONENTS
 *  appear unexpanded — their `props` are what the composition passed them. */
function kids(el: StyledEl): StyledEl[] {
  const c = el.props?.children;
  return (Array.isArray(c) ? c : [c]).filter(
    (k): k is StyledEl => !!k && typeof k === 'object',
  );
}

describe('prompt-full geometry', () => {
  it('sets NO height — the column grows from its own content', () => {
    const style = render().props.style as Record<string, unknown>;
    expect(style.height).toBeUndefined();
    expect(style.minHeight).toBeUndefined();
    expect(style.flexDirection).toBe('column');
    expect(style.bottom).toBe(100);       // bottom-anchored, so it grows UPWARD
    expect(style.top).toBeUndefined();
  });

  it('uses ONE single-percentage padding on all four sides', () => {
    // Percentage padding resolves against WIDTH on every side. Deriving separate
    // horizontal and vertical insets is what makes the card look skewed.
    const style = render().props.style as Record<string, unknown>;
    expect(style.padding).toBe('4.94%');
    expect(String(style.padding)).not.toContain(' ');   // one value, not four
    expect(W * (parseFloat(String(style.padding)) / 100)).toBeCloseTo(23.9, 1);
  });

  it('reproduces the Figma box at 3 lines and is SHORTER when the copy is shorter', () => {
    // The component sets NO height — the browser computes it from the wrapped line count, and
    // jsdom has no layout, so this asserts the ARITHMETIC the component's own ratio table
    // produces. Every input is read from FULL (including the percentage strings), so a changed
    // ratio fails here instead of passing against a literal copied out of the spec.
    const pct = (v: string) => parseFloat(v) / 100;
    const pad = W * pct(FULL.padding), gap = W * pct(FULL.gap), line = W * FULL.lineOfW;
    const controls = Math.max(W * FULL.actionOfW, W * FULL.sendOfW);
    const at = (n: number) => pad * 2 + n * line + gap + controls;
    expect(at(FULL.maxLines)).toBeCloseTo(187.0, 0);   // contract h = 0.1961 * 960 = 188.3
    expect(Math.abs(at(FULL.maxLines) - 188.3)).toBeLessThan(1.5);
    expect(at(1)).toBeLessThan(at(FULL.maxLines) - 50); // ~55px shorter — the empty band, gone
  });

  it('clamps the text at 3 lines instead of hard-clipping a glyph', () => {
    const text = walk(render()).find((n) => typeof n.props?.children === 'string');
    const s = text!.props.style as Record<string, unknown>;
    expect(s.display).toBe('-webkit-box');
    expect(s.WebkitLineClamp).toBe(3);
    expect(s.WebkitBoxOrient).toBe('vertical');
    expect(s.overflow).toBe('hidden');
    expect(s.fontFamily).toBe('Overpass');
    expect(s.fontSize).toBeCloseTo(W * 0.0448, 3);
    expect(s.lineHeight).toBe(`${W * 0.0556}px`);
  });

  it('puts the send button IN the control row, not centred on the card', () => {
    const row = walk(render()).find((n) => {
      const s = n.props?.style as Record<string, unknown> | undefined;
      return s?.justifyContent === 'space-between' && s?.display === 'flex';
    });
    expect(row).toBeDefined();
    // The button must be inside the row — prod floated it at the card's vertical centre.
    // Its element carries a `glyph` prop, which nothing else in the tree has.
    const send = walk(row).find((n) => 'glyph' in (n.props ?? {}));
    expect(send).toBeDefined();
    // Sized AND glyph-scaled off FULL's ratio table — the send button must not inherit
    // prompt-simple's numbers or a hardcoded component default.
    expect((send!.props as { glyphRatio: number }).glyphRatio).toBe(FULL.glyphOfSend);
    expect((row!.props.style as Record<string, unknown>).alignItems).toBe('center');
    // ...and NOT a direct child of the card, which is what "centred on the card" looked like.
    expect(kids(render()).some((n) => 'glyph' in (n.props ?? {}))).toBe(false);
  });

  it('wires exactly two ring buttons, sized off the width ratio', () => {
    const rings = walk(render()).filter((n) => n.type === RingButton);
    expect(rings).toHaveLength(2);
    const props = rings[0].props as { action: string; size: number; ink: string; surface: string };
    expect(props.size).toBeCloseTo(W * 0.0833, 3);
    expect(props.action).toBe('edit');
    expect(props.ink).toBe('#001B41');
    expect(props.surface).toBe('#F5F5F5');
    expect((rings[1].props as { action: string }).action).toBe('regenerate');
  });

  it('paints a ring button as a gradient ring around a surface-coloured centre', () => {
    // The TEST invokes the sub-component directly; the composition uses a `<RingButton/>` tag.
    const el = RingButton({
      action: 'edit', size: 40, brand: 'ionos', ink: '#001B41', surface: '#F5F5F5',
    }) as StyledEl;
    const s = el.props.style as Record<string, unknown>;
    expect(s.border).toBe('1.5px solid transparent');
    expect(String(s.background)).toContain('linear-gradient(#F5F5F5,#F5F5F5) padding-box');
    expect(String(s.background)).toContain('linear-gradient(45deg, #095BB1, #D746F5) border-box');
    expect(s.borderRadius).toBe(9999);
    const glyph = walk(el).find((n) => (n.props as { svg?: string })?.svg === ACTION_SVG.edit);
    expect((glyph!.props as { colour: string }).colour).toBe('#001B41');
  });

  it('defaults actions to edit + regenerate', () => {
    const actions = walk(render({ actions: undefined }))
      .filter((n) => n.type === RingButton)
      .map((n) => (n.props as { action: string }).action);
    expect(actions).toEqual(['edit', 'regenerate']);
  });
});
