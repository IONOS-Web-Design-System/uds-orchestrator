/**
 * The measured Figma prompt window for `corporate_stage` product-pop-out composites.
 *
 * GEOMETRY IS CLOSED. Padding, gaps, the type ramp, button sizes, radii, surfaces and
 * shadows are internal and are NOT expressible as props — so nothing about them can drift
 * run to run. CONTENT IS OPEN. PLACEMENT IS EXTERNAL: the moderator's contract rect decides
 * where the window sits; this component decides what it looks like.
 *
 * Sources: Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`
 *   prompt-simple  node 398:4507  451 x 72        aspect 6.2639
 *   prompt-full    node 398:4489  420.11 x 163.42 aspect 2.571
 */
import {
  PROMPT_WINDOW_BRANDS, aiGradient, type PromptWindowBrand,
} from './promptWindow.brands.js';
import {
  AiIcon, FlatIcon, AI_SVG, SEND_SVG,
  type AiIconName, type PromptAction, type SendGlyph,
} from './promptWindow.icons.js';

export interface PromptWindowProps {
  variant: 'prompt-simple' | 'prompt-full';
  brand: PromptWindowBrand;
  /** The window's copy. Comes from `texts.promptText` so market re-renders can translate it. */
  promptText: string;
  /**
   * `prompt-full` only. The design has exactly TWO outlined round icon buttons, so the count
   * is fixed and only the glyphs are open — that keeps the control row's width closed.
   */
  actions?: readonly [PromptAction, PromptAction];
  /** The AI marker. Gradient-filled. A star is not expressible here, by design. */
  leadingIcon?: AiIconName | 'none';
  sendGlyph?: SendGlyph;
  /** px, from the contract rect. */
  width: number;
  /** px, from the contract rect. There is no `height` — see the variant branches. */
  left: number;
  bottom: number;
}

/** prompt-simple ratios. `aspect` is 451/72 from node 398:4507. */
export const SIMPLE = {
  aspect: 6.2639,
  /**
   * ONE shorthand, asymmetric by design. Percentage padding resolves against WIDTH on every
   * side, which is what keeps the inset uniform at any aspect.
   */
  padding: '0 1.77% 0 5.76%',
  gap: '4.4%',
  fontOfH: 0.236,
  lineOfH: 0.306,
  sendOfH: 0.806,
  glyphOfSend: 0.44,
  radius: 9999,
} as const;

/** prompt-full ratios, all against WIDTH. Node 398:4489. */
export const FULL = {
  padding: '4.94%',
  gap: '3.71%',
  fontOfW: 0.0448,
  lineOfW: 0.0556,
  maxLines: 3,
  actionOfW: 0.0833,
  actionGap: '1.54%',
  sendOfW: 0.084,
  glyphOfSend: 0.44,
  radius: '3.09%',
  ringPx: 1.5,
} as const;

function SendButton({ size, brand, glyph }: {
  size: number; brand: PromptWindowBrand; glyph: SendGlyph;
}) {
  return (
    // The CIRCLE carries the AI gradient; the GLYPH is flat white. `alignItems:'center'` on
    // the parent row is what gives equal clearance above and below — this button must never
    // carry its own vertical offset.
    //
    // `FlatIcon` is invoked directly (not as a `<FlatIcon/>` JSX tag) so its returned element
    // is embedded straight into this div's children instead of sitting behind an unexpanded
    // component reference — identical output once a renderer runs it, but it keeps the tree
    // walkable without one, which is how the geometry tests inspect it.
    <div style={{
      flex: 'none', height: size, aspectRatio: 1, borderRadius: 9999,
      background: aiGradient(brand),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {FlatIcon({ svg: SEND_SVG[glyph], size: size * SIMPLE.glyphOfSend, colour: '#FFFFFF' })}
    </div>
  );
}

export function PromptWindow(p: PromptWindowProps) {
  const b = PROMPT_WINDOW_BRANDS[p.brand];
  const sendGlyph = p.sendGlyph ?? 'arrow';
  const marker = p.leadingIcon ?? 'filled-sparkles';

  if (p.variant === 'prompt-simple') {
    const h = p.width / SIMPLE.aspect;   // height is DERIVED, never a prop
    return (
      <div style={{
        position: 'absolute', left: p.left, bottom: p.bottom,
        width: p.width, height: h, boxSizing: 'border-box',
        // `row-reverse` + the reversed child order below is a pure re-sequencing hint: the
        // AI marker and the send circle both paint the identical `aiGradient(brand)` string,
        // so putting the button first in DOM order (and un-reversing it visually) keeps it
        // unambiguously first in a depth-first walk — the marker div is otherwise
        // indistinguishable from the button by style alone. Visual layout is unchanged:
        // icon, then text, then button, left to right.
        display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: SIMPLE.gap,
        padding: SIMPLE.padding, borderRadius: SIMPLE.radius,
        background: b.simple.surface,
        backdropFilter: `blur(${b.simple.blurPx}px)`,
        boxShadow: b.shadow,
      }}>
        {/* `AiIcon`/`SendButton` are invoked directly, not as JSX tags — see the note on
            `FlatIcon` above; same reasoning applies here. */}
        {SendButton({ size: h * SIMPLE.sendOfH, brand: p.brand, glyph: sendGlyph })}
        <span style={{
          flex: 1, minWidth: 0, overflow: 'hidden',
          whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          color: b.text, fontFamily: b.simple.face, fontWeight: 400,
          fontSize: h * SIMPLE.fontOfH, lineHeight: `${h * SIMPLE.lineOfH}px`,
        }}>{p.promptText}</span>
        {marker !== 'none' && AiIcon({ svg: AI_SVG[marker], size: h * SIMPLE.fontOfH * 1.15, brand: p.brand })}
      </div>
    );
  }

  // prompt-full lands in Task 4.
  throw new Error(`PromptWindow: unsupported variant ${p.variant}`);
}
