import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, RingButton, FULL } from '../PromptWindow';
import { ACTION_SVG } from '../promptWindow.icons';
import { PROMPT_WINDOW_BRANDS } from '../promptWindow.brands';

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

  it('RESOLVES padding to px off its own width — one value, all four sides', () => {
    // The defect this replaced: `padding:'4.94%'` resolves against the CONTAINING BLOCK's
    // width, not the element's own — and for this absolutely-positioned window that block is
    // the root AbsoluteFill's 1280px canvas, so it painted 63.2px per side (measured in
    // Chromium) instead of 23.9px. The old assertion read the declaration STRING and did its
    // own arithmetic on it, so nothing in the suite observed what CSS computed. A NUMBER is
    // what makes that observable without a browser: it is already the resolved px.
    const style = render({ width: 484 }).props.style as Record<string, unknown>;
    expect(typeof style.padding).toBe('number');            // px — never a '%' string
    expect(style.padding as number).toBeCloseTo(23.9, 1);   // 0.0494 * 484, uniform
    expect(style.padding as number).toBeCloseTo(484 * FULL.padOfW, 6);  // the ratio, not a literal
    // ...and it tracks `width`, so it is right in any containing block at any width.
    const half = render({ width: 242 }).props.style as Record<string, unknown>;
    expect(half.padding as number).toBeCloseTo(11.95, 1);
  });

  it('RESOLVES the column gap to px — a percentage row-gap here resolves to ZERO', () => {
    // `gap` percentages resolve against the container's own content box in that axis. This card
    // is a column with `height:auto`, so the block axis is INDEFINITE and Chromium resolved
    // `3.71%` to 0px: the card was 18px short as well as over-padded, and the two Figma bands
    // touched. px off the width is what the ratio always meant.
    const style = render({ width: 484 }).props.style as Record<string, unknown>;
    expect(typeof style.gap).toBe('number');
    expect(style.gap as number).toBeCloseTo(17.96, 1);      // 0.0371 * 484
    expect(style.gap as number).toBeCloseTo(484 * FULL.gapOfW, 6);
  });

  it('RESOLVES the corner radius to px — a percentage radius is an ellipse, not a corner', () => {
    // `borderRadius` percentages resolve horizontally against width but VERTICALLY against
    // height, so `3.09%` on this 484x187 card is a 14.96 x 5.78 ELLIPSE (confirmed by
    // hit-testing the corner in Chromium: the px box clips the corner point, the % box does
    // not). One measured radius must therefore be one px value.
    const style = render({ width: 484 }).props.style as Record<string, unknown>;
    expect(typeof style.borderRadius).toBe('number');
    expect(style.borderRadius as number).toBeCloseTo(14.96, 1);   // 0.0309 * 484
  });

  it('RESOLVES the ring-button gap to px — the percentage resolved against a shrink-to-fit row', () => {
    // `1.54%` resolved against the action row's OWN content box, and that row shrink-wraps its
    // two buttons (81px), so Chromium painted 1.25px — the two rings all but touching — instead
    // of 7.45px.
    const controls = walk(render({ width: 484 })).find(
      (n) => (n.props?.style as Record<string, unknown> | undefined)?.justifyContent === 'space-between',
    );
    const group = kids(controls!).find(
      (n) => typeof (n.props?.style as Record<string, unknown> | undefined)?.gap !== 'undefined',
    );
    const gap = (group!.props.style as Record<string, unknown>).gap;
    expect(typeof gap).toBe('number');
    expect(gap as number).toBeCloseTo(7.45, 1);            // 0.0154 * 484
  });

  it('lets NO percentage padding survive anywhere in the tree', () => {
    // Padding is the one property whose percentage silently re-bases against the CANVAS (the
    // containing block), so a '%' here is never recoverable by scaling and never visible in a
    // ratio assertion. Deliberately padding-only: `gap` and `borderRadius` percentages resolve
    // against the element's own box, so they are legitimate CSS — this component still uses px
    // for them, for the separate reasons documented on FULL, but they are not banned.
    const trees = [
      ...walk(render()),
      ...walk(RingButton({ action: 'edit', size: 40, brand: 'ionos', ink: '#001B41', surface: '#F5F5F5' }) as StyledEl),
    ];
    for (const node of trees) {
      const style = (node.props?.style ?? {}) as Record<string, unknown>;
      for (const [key, value] of Object.entries(style)) {
        if (!/^padding/i.test(key)) continue;
        expect(String(value)).not.toContain('%');
      }
    }
  });

  it('reproduces the Figma box at 3 lines and is SHORTER when the copy is shorter', () => {
    // The component sets NO height — the browser computes it from the wrapped line count, and
    // jsdom has no layout, so this asserts the ARITHMETIC the component's own ratio table
    // produces. Every input is read from FULL, so a changed ratio fails here instead of passing
    // against a literal copied out of the spec. A Chromium measurement of these exact
    // declarations at width 484 returns 187.08px, so the arithmetic is the real height now; with
    // the percentages it returned 247.75px (63.2px padding per side and a collapsed 0px gap).
    const pad = W * FULL.padOfW, gap = W * FULL.gapOfW, line = W * FULL.lineOfW;
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
    // The ring's padding-box centre IS the card's surface — read from the brand table, so it can
    // never drift from it.
    expect(props.surface).toBe(PROMPT_WINDOW_BRANDS.ionos.full.surface);
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

  it('sets its own zIndex — 100, carried from the retired floating-card rule for this exact element — so codegen has no way to leave it un-stacked', () => {
    const style = render().props.style as Record<string, unknown>;
    expect(style.zIndex).toBe(100);
  });
});
