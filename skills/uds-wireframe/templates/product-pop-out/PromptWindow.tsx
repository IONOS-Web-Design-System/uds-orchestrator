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
} from './promptWindow.brands';
import {
  AiIcon, FlatIcon, AI_SVG, SEND_SVG, ACTION_SVG,
  type AiIconName, type PromptAction, type SendGlyph,
} from './promptWindow.icons';

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

/** Exported so a test can invoke it directly and inspect its own painted style — the same
 *  way Task 2's tests inspect AiIcon/FlatIcon. The composition uses it as a JSX tag.
 *
 *  `glyphRatio` is REQUIRED and carries no default on purpose. A default would be a THIRD
 *  copy of the same number next to `SIMPLE.glyphOfSend` and `FULL.glyphOfSend`, and it is
 *  what let both call sites silently stop reading the ratio tables — the same
 *  looks-authoritative-but-read-by-nothing split as the 135°/45° gradient drift. */
export function SendButton({ size, brand, glyph, glyphRatio }: {
  size: number; brand: PromptWindowBrand; glyph: SendGlyph; glyphRatio: number;
}) {
  return (
    // The CIRCLE carries the AI gradient; the GLYPH is flat white. `alignItems:'center'` on
    // the parent row is what gives equal clearance above and below — this button must never
    // carry its own vertical offset.
    <div style={{
      flex: 'none', height: size, aspectRatio: 1, borderRadius: 9999,
      background: aiGradient(brand),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <FlatIcon svg={SEND_SVG[glyph]} size={size * glyphRatio} colour="#FFFFFF" />
    </div>
  );
}

/** Exported for the same reason as SendButton: a test invokes it directly to inspect its own
 *  painted style. The composition uses it as a JSX tag. */
export function RingButton({ action, size, brand, ink, surface }: {
  action: PromptAction; size: number; brand: PromptWindowBrand; ink: string; surface: string;
}) {
  return (
    // Outlined round button: transparent centre with a gradient RING. The two-layer
    // background is what draws a gradient border without a gradient fill.
    <div style={{
      flex: 'none', width: size, height: size, borderRadius: 9999,
      border: `${FULL.ringPx}px solid transparent`,
      background: `linear-gradient(${surface},${surface}) padding-box, ${aiGradient(brand)} border-box`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <FlatIcon svg={ACTION_SVG[action]} size={size * FULL.glyphOfSend} colour={ink} />
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
        display: 'flex', alignItems: 'center', gap: SIMPLE.gap,
        padding: SIMPLE.padding, borderRadius: SIMPLE.radius,
        background: b.simple.surface,
        backdropFilter: `blur(${b.simple.blurPx}px)`,
        boxShadow: b.shadow,
        // zIndex: 100 — carried over from the retired `shared/floating-card.md` skeleton rule,
        // which used this exact value for this exact floating element. Z-ORDER IS GEOMETRY: the
        // component decides it here, the same way it decides padding/gaps/type ramp/radii, rather
        // than exposing it as a prop codegen could omit or contradict (that gap is what let an
        // un-z-indexed window lose a stacking fight to the interface panel drawn after it).
        zIndex: 100,
      }}>
        {marker !== 'none' && (
          <AiIcon svg={AI_SVG[marker]} size={h * SIMPLE.fontOfH * 1.15} brand={p.brand} />
        )}
        <span style={{
          flex: 1, minWidth: 0, overflow: 'hidden',
          whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          color: b.text, fontFamily: b.simple.face, fontWeight: 400,
          fontSize: h * SIMPLE.fontOfH, lineHeight: `${h * SIMPLE.lineOfH}px`,
        }}>{p.promptText}</span>
        <SendButton size={h * SIMPLE.sendOfH} brand={p.brand} glyph={sendGlyph}
          glyphRatio={SIMPLE.glyphOfSend} />
      </div>
    );
  }

  // prompt-full — NO height. The column grows from its own wrapped line count, anchored on
  // `bottom`, so 1/2/3 lines all fit exactly: under-fill and mid-glyph clipping both become
  // unrepresentable. Safe because the sales badge's Y_MIN derives from the constant-shaped
  // `salesReservedBand`, not from this live rect.
  const actions = p.actions ?? (['edit', 'regenerate'] as const);
  return (
    <div style={{
      position: 'absolute', left: p.left, bottom: p.bottom,
      width: p.width, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: FULL.gap,
      padding: FULL.padding, borderRadius: FULL.radius,
      background: b.full.surface, boxShadow: b.shadow,
      // zIndex: 100 — carried over from the retired `shared/floating-card.md` skeleton rule,
      // which used this exact value for this exact floating element. Z-ORDER IS GEOMETRY: the
      // component decides it here, the same way it decides padding/gaps/type ramp/radii, rather
      // than exposing it as a prop codegen could omit or contradict (that gap is what let an
      // un-z-indexed window lose a stacking fight to the interface panel drawn after it).
      zIndex: 100,
    }}>
      <span style={{
        display: '-webkit-box', WebkitLineClamp: FULL.maxLines,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
        color: b.text, fontFamily: b.full.face, fontWeight: 400,
        fontSize: p.width * FULL.fontOfW,
        lineHeight: `${p.width * FULL.lineOfW}px`,
      }}>{p.promptText}</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ display: 'flex', gap: FULL.actionGap }}>
          {actions.map((a) => (
            <RingButton key={a} action={a} size={p.width * FULL.actionOfW}
              brand={p.brand} ink={b.text} surface={b.full.surface} />
          ))}
        </span>
        <SendButton size={p.width * FULL.sendOfW} brand={p.brand} glyph={sendGlyph}
          glyphRatio={FULL.glyphOfSend} />
      </div>
    </div>
  );
}
