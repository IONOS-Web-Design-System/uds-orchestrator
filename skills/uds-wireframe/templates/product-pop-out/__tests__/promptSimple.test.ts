import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, SIMPLE } from '../PromptWindow.js';
import { AI_SVG, SEND_SVG } from '../promptWindow.icons.js';

const W = 483.6;                       // the contract width at 1280x960
const H = W / SIMPLE.aspect;           // 77.2px

/** `ReactElement`'s P defaults to `unknown` in @types/react 19, so a bare cast makes
 *  `.props` unreadable and tsc fails TS18046. These tests read only `style` and
 *  `children`, so name that shape once. */
type StyledEl = ReactElement<{ style?: Record<string, unknown>; children?: unknown }>;

const render = (over: Partial<Parameters<typeof PromptWindow>[0]> = {}) =>
  PromptWindow({
    variant: 'prompt-simple', brand: 'ionos',
    promptText: 'Erstelle eine moderne App',
    leadingIcon: 'filled-sparkles', sendGlyph: 'arrow',
    width: W, left: 0, bottom: 100, ...over,
  } as Parameters<typeof PromptWindow>[0]) as StyledEl;

/** Depth-first walk of a returned element tree. */
function walk(el: unknown, out: StyledEl[] = []): StyledEl[] {
  if (!el || typeof el !== 'object') return out;
  const node = el as StyledEl;
  if (node.props) out.push(node);
  const kids = node.props?.children;
  if (Array.isArray(kids)) kids.forEach((k) => walk(k, out));
  else if (kids) walk(kids, out);
  return out;
}

describe('prompt-simple geometry', () => {
  it('derives its height from the measured Figma aspect, not from a prop', () => {
    expect(SIMPLE.aspect).toBe(6.2639);                 // 451 / 72, node 398:4507
    const style = render().props.style as Record<string, unknown>;
    expect(style.height).toBeCloseTo(77.2, 1);
    expect(style.width).toBe(W);
    // Agrees with the contract's h (0.0801 * 960 = 76.9) to within a rounding error.
    expect(Math.abs((style.height as number) - 76.9)).toBeLessThan(0.5);
  });

  it('keeps the measured 3.3:1 horizontal padding — not the 10:1 prod drift', () => {
    const style = render().props.style as Record<string, unknown>;
    expect(style.padding).toBe('0 1.77% 0 5.76%');
    // 5.76% and 1.77% of WIDTH: 27.9px and 8.6px.
    expect(W * 0.0576).toBeCloseTo(27.9, 1);
    expect(W * 0.0177).toBeCloseTo(8.6, 1);
    expect(0.0576 / 0.0177).toBeCloseTo(3.25, 1);
  });

  it('anchors on `bottom` and never sets a clipping overflow', () => {
    const style = render().props.style as Record<string, unknown>;
    expect(style.position).toBe('absolute');
    expect(style.bottom).toBe(100);
    expect(style.left).toBe(0);
    expect(style.top).toBeUndefined();
    expect(style.overflow).toBeUndefined();
  });

  it('sizes the send button at 80.6% of height with EQUAL clearance', () => {
    const send = walk(render()).find((n) => {
      const s = n.props?.style as Record<string, unknown> | undefined;
      return typeof s?.background === 'string' && String(s.background).includes('linear-gradient(45deg');
    });
    expect(send).toBeDefined();
    const s = send!.props.style as Record<string, unknown>;
    expect(s.height).toBeCloseTo(H * 0.806, 3);
    expect(s.aspectRatio).toBe(1);
    // Equal clearance is what `alignItems:'center'` on the row guarantees — the button must
    // NOT carry its own vertical offset, which is how prod ended up 5px/3.5px lopsided.
    expect(s.marginTop).toBeUndefined();
    expect(s.marginBottom).toBeUndefined();
    expect(s.alignSelf).toBeUndefined();
    expect((render().props.style as Record<string, unknown>).alignItems).toBe('center');
  });

  it('ellipsises one line of text and never wraps', () => {
    const text = walk(render()).find((n) => n.props?.children === 'Erstelle eine moderne App');
    const s = text!.props.style as Record<string, unknown>;
    expect(s.whiteSpace).toBe('nowrap');
    expect(s.textOverflow).toBe('ellipsis');
    expect(s.overflow).toBe('hidden');
    expect(s.flex).toBe(1);
    expect(s.minWidth).toBe(0);
    expect(s.fontFamily).toBe('Open Sans');
    expect(s.fontSize).toBeCloseTo(H * 0.236, 3);
    expect(s.lineHeight).toBe(`${H * 0.306}px`);
  });

  it('renders the AI marker gradient-filled and the send glyph flat white', () => {
    const nodes = walk(render());
    const marker = nodes.find((n) => (n.props?.style as Record<string, unknown>)?.maskImage === `url(${AI_SVG['filled-sparkles']})`);
    expect((marker!.props.style as Record<string, unknown>).background).toContain('linear-gradient(45deg');
    const glyph = nodes.find((n) => (n.props?.style as Record<string, unknown>)?.maskImage === `url(${SEND_SVG.arrow})`);
    expect((glyph!.props.style as Record<string, unknown>).backgroundColor).toBe('#FFFFFF');
    expect((glyph!.props.style as Record<string, unknown>).background).toBeUndefined();
  });

  it('omits the marker when leadingIcon is none', () => {
    const nodes = walk(render({ leadingIcon: 'none' }));
    expect(nodes.some((n) => String((n.props?.style as Record<string, unknown>)?.maskImage ?? '')
      .includes(AI_SVG['filled-sparkles']))).toBe(false);
  });
});
