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

/**
 * INSETS, GAPS AND RADII ARE RATIOS OF `p.width`, APPLIED IN PX — never CSS percentages.
 *
 * A CSS percentage re-bases itself against a box this component does not control, differently
 * for each property (all three measured in Chromium against these exact declarations):
 *   - `padding`: percentages resolve against the CONTAINING BLOCK's width — on every side,
 *     top/bottom included. This window is `position:absolute` directly under the composition's
 *     root `AbsoluteFill`, so that block is the 1280px CANVAS, not the ~484px window, and
 *     `4.94%` painted 63.2px per side instead of 23.9px. That 2.6x over-pad on all four sides
 *     IS the original production defect this template exists to remove ("over-padded, content
 *     as a centred island") — it was never LLM drift; the prose skeleton it replaced carried
 *     the same percentages and the same wrong explanation.
 *   - `gap`: percentages resolve against the container's OWN CONTENT box in that axis, so a
 *     percentage gap drifts with the padding (`4.4%` gave 17.0px under the inflated padding,
 *     19.7px under the correct one, against 21.3px intended). Worse, `prompt-full` is a column
 *     with `height:auto`: a percentage ROW gap against an indefinite block size resolves to
 *     ZERO, so its 3.71% gap contributed literally nothing, and `1.54%` between the two ring
 *     buttons resolved against their shrink-to-fit row and gave 1.25px instead of 7.45px.
 *   - `borderRadius`: percentages resolve horizontally against width but VERTICALLY AGAINST
 *     HEIGHT, so one measured corner becomes an ellipse — `3.09%` on 484x187 is 14.96px x
 *     5.78px, not the uniform 14.96px corner that was measured.
 * px off `p.width` is the only basis that reproduces the Figma measurement in any containing
 * block at any width. Every Figma ratio below is unchanged; only the basis is.
 */

/** prompt-simple ratios. `aspect` is 451/72 from node 398:4507. */
export const SIMPLE = {
  aspect: 6.2639,
  /**
   * Fractions of WIDTH, asymmetric by design (3.25:1 left-to-right). The vertical inset is
   * deliberately absent, not forgotten: `alignItems:'center'` does all the vertical work.
   */
  padLeftOfW: 0.0576,
  padRightOfW: 0.0177,
  gapOfW: 0.044,
  fontOfH: 0.236,
  lineOfH: 0.306,
  sendOfH: 0.806,
  glyphOfSend: 0.44,
  /** px, not a ratio — a pill is a pill at any width. */
  radius: 9999,
} as const;

/** prompt-full ratios, all against WIDTH. Node 398:4489. */
export const FULL = {
  /** ONE value, all four sides — the design's inset is uniform. */
  padOfW: 0.0494,
  gapOfW: 0.0371,
  fontOfW: 0.0448,
  lineOfW: 0.0556,
  maxLines: 3,
  actionOfW: 0.0833,
  actionGapOfW: 0.0154,
  sendOfW: 0.084,
  glyphOfSend: 0.44,
  radiusOfW: 0.0309,
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
 *  painted style. The composition uses it as a JSX tag.
 *
 *  `surface` is wired straight from `b.full.surface` (now translucent glass, not opaque) — the
 *  same value the card itself paints. That was a deliberate choice, not an oversight: it keeps
 *  the ring's centre unable to drift from the card (the invariant this component's tests pin),
 *  and it means the ring's padding-box layer composites a TRANSLUCENT layer over the
 *  translucent card, landing at ~0.9856 effective alpha against the card's 0.88 — a ~1.6%
 *  mismatch, imperceptible in practice. The alternative — an opaque near-white just for the
 *  ring's centre — was rejected: it would paint a hard-edged opaque disc against a translucent
 *  card, which reads as a visible seam (worst over the composite's transparent root, where
 *  nothing else near the ring is opaque either) — a materially worse defect than a ~1.6% alpha
 *  mismatch nobody can see. */
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
        display: 'flex', alignItems: 'center', gap: p.width * SIMPLE.gapOfW,
        paddingTop: 0, paddingRight: p.width * SIMPLE.padRightOfW,
        paddingBottom: 0, paddingLeft: p.width * SIMPLE.padLeftOfW,
        borderRadius: SIMPLE.radius,
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
      display: 'flex', flexDirection: 'column', gap: p.width * FULL.gapOfW,
      padding: p.width * FULL.padOfW, borderRadius: p.width * FULL.radiusOfW,
      background: b.full.surface,
      backdropFilter: `blur(${b.full.blurPx}px)`,
      boxShadow: b.shadow,
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
        <span style={{ display: 'flex', gap: p.width * FULL.actionGapOfW }}>
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
