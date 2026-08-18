import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, SendButton, SIMPLE } from '../PromptWindow.js';
import { AI_SVG, AiIcon } from '../promptWindow.icons.js';

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

/** Depth-first walk of a returned element tree. Child COMPONENTS appear unexpanded — their
 *  `props` are what the composition passed them, which is exactly what these tests assert. */
function walk(el: unknown, out: StyledEl[] = []): StyledEl[] {
  if (!el || typeof el !== 'object') return out;
  const node = el as StyledEl;
  if (node.props) out.push(node);
  const c = node.props?.children;
  if (Array.isArray(c)) c.forEach((k) => walk(k, out));
  else if (c) walk(c, out);
  return out;
}

/** The direct children of an element, flattened, non-elements dropped. */
function kids(el: StyledEl): StyledEl[] {
  const c = el.props?.children;
  return (Array.isArray(c) ? c : [c]).filter(
    (k): k is StyledEl => !!k && typeof k === 'object',
  );
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

  it('wires the send button at 80.6% of height and gives it no way to offset itself', () => {
    const send = kids(render()).find((n) => 'glyph' in (n.props ?? {}));
    expect(send).toBeDefined();
    expect((send!.props as { size: number }).size).toBeCloseTo(H * 0.806, 3);
    // Equal clearance is what `alignItems:'center'` on the row guarantees. The button cannot
    // carry its own vertical offset because it receives NO style prop at all — that is how
    // prod ended up 5px/3.5px lopsided.
    expect((send!.props as { style?: unknown }).style).toBeUndefined();
    expect((render().props.style as Record<string, unknown>).alignItems).toBe('center');
    expect((render().props.style as Record<string, unknown>).flexDirection).toBeUndefined();
  });

  it('renders the send circle itself as a gradient disc with a flat white glyph', () => {
    // Invoking the sub-component directly is the TEST reaching in; the composition above
    // still uses a `<SendButton/>` JSX tag.
    const el = SendButton({ size: 62, brand: 'ionos', glyph: 'arrow' }) as StyledEl;
    const s = el.props.style as Record<string, unknown>;
    expect(s.background).toBe('linear-gradient(45deg, #095BB1, #D746F5)');
    expect(s.aspectRatio).toBe(1);
    expect(s.height).toBe(62);
    expect(s.marginTop).toBeUndefined();
    expect(s.alignSelf).toBeUndefined();
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

  it('wires the AI marker to the right glyph, as a real AiIcon element', () => {
    // Task 2 already proves AiIcon paints with the gradient and never backgroundColor.
    // What this task owns is the WIRING: the right svg, sized off the type ramp.
    const marker = kids(render()).find((n) => n.type === AiIcon);
    expect(marker).toBeDefined();
    const props = marker!.props as { svg: string; size: number; brand?: string };
    expect(props.svg).toBe(AI_SVG['filled-sparkles']);
    expect(props.size).toBeCloseTo(H * 0.236 * 1.15, 3);
    expect(props.brand).toBe('ionos');
  });

  it('honours a non-default AI marker', () => {
    const marker = kids(render({ leadingIcon: 'filled-chat-ai' })).find((n) => n.type === AiIcon);
    expect((marker!.props as { svg: string }).svg).toBe(AI_SVG['filled-chat-ai']);
  });

  it('wires the requested send glyph through', () => {
    const send = kids(render({ sendGlyph: 'paper-plane' })).find((n) => 'glyph' in (n.props ?? {}));
    expect((send!.props as { glyph: string }).glyph).toBe('paper-plane');
  });

  it('omits the marker when leadingIcon is none', () => {
    expect(kids(render({ leadingIcon: 'none' })).some((n) => n.type === AiIcon)).toBe(false);
  });
});
