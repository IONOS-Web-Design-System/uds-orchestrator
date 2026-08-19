import { describe, it, expect } from 'vitest';
import type { ReactElement } from 'react';
import { PromptWindow, SendButton, SIMPLE } from '../PromptWindow';
import { AI_SVG, AiIcon } from '../promptWindow.icons';

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

  it('RESOLVES the measured 3.3:1 horizontal padding to px — not the 10:1 prod drift', () => {
    // The defect this replaced: `padding:'0 1.77% 0 5.76%'` resolves against the CONTAINING
    // BLOCK's width, not the element's own. This bar is absolutely positioned under the root
    // AbsoluteFill, so Chromium painted 73.7px left / 22.6px right off the 1280px canvas instead
    // of 27.9 / 8.6. The old assertion read the declaration STRING and did its own arithmetic on
    // it, so nothing observed what CSS computed. Numbers ARE the resolved px, so they can be
    // asserted with no layout engine.
    const style = render({ width: 484 }).props.style as Record<string, unknown>;
    expect(style.padding).toBeUndefined();                        // no shorthand, so no '%' string
    expect(style.paddingLeft as number).toBeCloseTo(27.9, 1);     // 0.0576 * 484
    expect(style.paddingRight as number).toBeCloseTo(8.6, 1);     // 0.0177 * 484
    expect(style.paddingLeft as number).toBeCloseTo(484 * SIMPLE.padLeftOfW, 6);
    expect(style.paddingRight as number).toBeCloseTo(484 * SIMPLE.padRightOfW, 6);
    // Vertical inset is 0 BY DESIGN — `alignItems:'center'` does the vertical work.
    expect(style.paddingTop).toBe(0);
    expect(style.paddingBottom).toBe(0);
    expect((style.paddingLeft as number) / (style.paddingRight as number)).toBeCloseTo(3.25, 1);
    // ...and it tracks `width`, so it is right in any containing block at any width.
    const half = render({ width: 242 }).props.style as Record<string, unknown>;
    expect(half.paddingLeft as number).toBeCloseTo(13.95, 1);
  });

  it('RESOLVES the row gap to px off the width, not against a padding-dependent content box', () => {
    // `gap` percentages resolve against the container's own CONTENT box, so `4.4%` moved with the
    // padding: Chromium measured 17.0px under the inflated padding and 19.7px with it corrected,
    // against the 21.3px the ratio means. px off `width` is the only stable reading.
    const style = render({ width: 484 }).props.style as Record<string, unknown>;
    expect(typeof style.gap).toBe('number');
    expect(style.gap as number).toBeCloseTo(21.3, 1);             // 0.044 * 484
    expect(style.gap as number).toBeCloseTo(484 * SIMPLE.gapOfW, 6);
  });

  it('keeps the pill radius in px — a percentage radius would be an ellipse', () => {
    // `borderRadius` percentages resolve horizontally against width and VERTICALLY against
    // height, so a percentage could never express this pill. 9999px can.
    const style = render().props.style as Record<string, unknown>;
    expect(style.borderRadius).toBe(9999);
  });

  it('lets NO percentage padding survive anywhere in the tree', () => {
    // Padding is the one property whose percentage silently re-bases against the CANVAS (the
    // containing block), so a '%' there is unrecoverable and invisible to a ratio assertion.
    // Deliberately padding-only: `gap` and `borderRadius` percentages resolve against the
    // element's own box and are legitimate CSS — not banned, just not used here.
    const trees = [
      ...walk(render()),
      ...walk(SendButton({ size: 62, brand: 'ionos', glyph: 'arrow', glyphRatio: SIMPLE.glyphOfSend }) as StyledEl),
    ];
    for (const node of trees) {
      const style = (node.props?.style ?? {}) as Record<string, unknown>;
      for (const [key, value] of Object.entries(style)) {
        if (!/^padding/i.test(key)) continue;
        expect(String(value)).not.toContain('%');
      }
    }
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
    // The call site reads the ratio table. `glyphRatio` has NO default, so a call site that
    // forgot it would not compile — but this pins that the value comes from SIMPLE, not FULL.
    expect((send!.props as { glyphRatio: number }).glyphRatio).toBe(SIMPLE.glyphOfSend);
    expect((render().props.style as Record<string, unknown>).alignItems).toBe('center');
    expect((render().props.style as Record<string, unknown>).flexDirection).toBeUndefined();
  });

  it('renders the send circle itself as a gradient disc with a flat white glyph', () => {
    // Invoking the sub-component directly is the TEST reaching in; the composition above
    // still uses a `<SendButton/>` JSX tag.
    const el = SendButton({
      size: 62, brand: 'ionos', glyph: 'arrow', glyphRatio: SIMPLE.glyphOfSend,
    }) as StyledEl;
    const s = el.props.style as Record<string, unknown>;
    expect(s.background).toBe('linear-gradient(45deg, #095BB1, #D746F5)');
    expect(s.aspectRatio).toBe(1);
    expect(s.height).toBe(62);
    expect(s.marginTop).toBeUndefined();
    expect(s.alignSelf).toBeUndefined();
    const glyph = el.props.children as StyledEl;
    expect((glyph.props as { colour: string }).colour).toBe('#FFFFFF');
    // Off the ratio table, not a bare 0.44 — a literal here is what let SIMPLE.glyphOfSend
    // become a member nothing read while the button used its own default.
    expect((glyph.props as { size: number }).size).toBeCloseTo(62 * SIMPLE.glyphOfSend, 3);
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

  it('sets its own zIndex — 100, carried from the retired floating-card rule for this exact element — so codegen has no way to leave it un-stacked', () => {
    const style = render().props.style as Record<string, unknown>;
    expect(style.zIndex).toBe(100);
  });
});
