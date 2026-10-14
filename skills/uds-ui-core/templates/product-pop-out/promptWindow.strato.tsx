/**
 * The STRATO floating AI prompt window. Rendered by `PromptWindow` when `brand="strato"`; the
 * IONOS window is a different design, not a recolour, so it keeps its own renderer.
 *
 * Sources: Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`, page "strato ref"
 *   prompt-full    node 587:6893  497 x 203   badge + uppercase label + prompt (multi-line)
 *   prompt-simple  node 587:6992  455 x 94    pill: prompt (<= 2 lines) + round AI button
 *
 * The three layers are the design, not decoration:
 *   1. GLOW  — the AI gradient, `mix-blend-mode: hard-light`, heavily blurred, behind the card.
 *      It must blend with whatever is painted under the window (canvas, frame), exactly like the
 *      Figma pass-through group, so the wrapper below deliberately creates NO stacking context
 *      (no z-index, opacity, transform or filter on it). Only the glass card carries z-index.
 *   2. GLASS — white at 56% with a backdrop blur and a light rim (Figma "Glass" effect).
 *   3. TEXT GLOW — Figma's white LINEAR_DODGE shadow. CSS cannot blend a `text-shadow` on its
 *      own, so it is a blurred white copy of the text with `mix-blend-mode: plus-lighter`
 *      (CSS's linear dodge) underneath the crisp text.
 *
 * Geometry is closed: every inset, gap, size and blur is a ratio of `width`, applied in px
 * (see the CSS-percentage note in PromptWindow.tsx). Motion is OPEN but only through the
 * numeric props below, which codegen drives from `useCurrentFrame()`.
 */
import type { ReactNode } from 'react';
import { PROMPT_WINDOW_BRANDS, aiGradient } from './promptWindow.brands';
import { AI_SVG, FlatIcon, type AiIconName } from './promptWindow.icons';

/** STRATO literals (Figma variables: strato/blue-700, white, private/ai/primary-*). */
export const STRATO_PROMPT = {
  ink: '#29294D',
  onGradient: '#29294D',
  glass: 'rgba(255,255,255,0.56)',
  rim: 'inset 0 0 0 1px rgba(255,255,255,0.55), inset 0 1px 1px rgba(255,255,255,0.85)',
  face: 'Poppins',
} as const;

/** prompt-full (multi-line) ratios, all of WIDTH. Node 587:6893 (497 x 203). */
export const STRATO_FULL = {
  padOfW: 0.0584,
  gapOfW: 0.0431,
  radiusOfW: 0.0362,
  glowBlurOfW: 0.04,
  glassBlurOfW: 0.008,
  badgeOfW: 0.1046,
  badgeGlyphOfBadge: 0.615,
  rowGapOfW: 0.0443,
  labelFontOfW: 0.0388,
  labelLine: 1.2,
  labelMaxLines: 2,
  fontOfW: 0.0604,
  lineOfW: 0.0724,
  maxLines: 3,
  textGlowBlurOfW: 0.04,
  textGlowAlpha: 1,
} as const;

/** prompt-simple (pill) ratios. Node 587:6992 (455 x 94); height is derived from `aspect`. */
export const STRATO_SIMPLE = {
  aspect: 4.8404,
  padLeftOfW: 0.066,
  padRightOfW: 0.0198,
  gapOfW: 0.033,
  glowBlurOfW: 0.13,
  glassBlurOfW: 0.0102,
  buttonOfH: 0.798,
  glyphOfButton: 0.45,
  fontOfW: 0.0508,
  lineOfW: 0.0661,
  maxLines: 2,
  textGlowBlurOfW: 0.019,
  textGlowAlpha: 0.7,
} as const;

export interface StratoMotion {
  /** 0..1 — the glow layer's strength. 1 = the design. Fade it in as the window appears. */
  glow?: number;
  /** Show the typing caret after the text (blink it from the frame while typing). */
  caret?: boolean;
  /** 0..1 — the "send" pulse intensity: the AI badge/button swells and the glow flares. Drive it
   *  up and back down (e.g. `Math.sin(Math.PI * t)`); 0 = at rest. */
  pulse?: number;
  /** degrees — rotates the GLOW layer's gradient (the "thinking" orbit after the send pulse).
   *  Omit = the static design. The badge / button gradient never rotates. */
  glowAngleDeg?: number;
}

export interface StratoPromptProps extends StratoMotion {
  variant: 'prompt-simple' | 'prompt-full';
  promptText: string;
  /** prompt-full only: the uppercase context line above the prompt ("Anforderung KI …"). */
  label?: string;
  /** The AI glyph — in the badge (full) or the round button (simple). */
  icon: AiIconName;
  width: number;
  left: number;
  bottom: number;
}

const clamp01 = (v: number | undefined, fallback: number) =>
  v === undefined || Number.isNaN(v) ? fallback : Math.min(1, Math.max(0, v));

/** Crisp text over a blurred white copy blended with plus-lighter (Figma LINEAR_DODGE). */
function GlowText({ children, style, blurPx, alpha, caret }: {
  children: ReactNode; style: Record<string, string | number>; blurPx: number; alpha: number; caret?: boolean;
}) {
  const caretEl = caret
    ? <span style={{ display: 'inline-block', width: '0.08em', height: '1em', marginLeft: '0.06em', verticalAlign: '-0.12em', background: STRATO_PROMPT.ink, borderRadius: 1 }} />
    : null;
  return (
    <div style={{ position: 'relative' }}>
      <div aria-hidden style={{
        ...style, position: 'absolute', inset: 0, color: `rgba(255,255,255,${alpha})`,
        filter: `blur(${blurPx}px)`, mixBlendMode: 'plus-lighter', pointerEvents: 'none',
      }}>{children}</div>
      <div style={{ ...style, position: 'relative' }}>{children}{caretEl}</div>
    </div>
  );
}

function clampLines(lines: number): Record<string, string | number> {
  return { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' };
}

export function StratoPromptWindow(p: StratoPromptProps) {
  const full = p.variant === 'prompt-full';
  const w = p.width;
  const pulse = clamp01(p.pulse, 0);
  const glow = clamp01(p.glow, 1) * (1 + 0.35 * pulse);
  const angle = p.glowAngleDeg ?? (full ? 135 : 45);
  const radius = full ? w * STRATO_FULL.radiusOfW : 9999;
  const h = full ? undefined : w / STRATO_SIMPLE.aspect;
  const glowBlur = w * (full ? STRATO_FULL.glowBlurOfW : STRATO_SIMPLE.glowBlurOfW);

  const card: Record<string, string | number> = full
    ? {
      display: 'flex', flexDirection: 'column', gap: w * STRATO_FULL.gapOfW,
      padding: w * STRATO_FULL.padOfW,
    }
    : {
      height: h!, display: 'flex', alignItems: 'center', gap: w * STRATO_SIMPLE.gapOfW,
      paddingTop: 0, paddingBottom: 0,
      paddingLeft: w * STRATO_SIMPLE.padLeftOfW, paddingRight: w * STRATO_SIMPLE.padRightOfW,
    };

  const iconSize = full ? w * STRATO_FULL.badgeOfW : h! * STRATO_SIMPLE.buttonOfH;
  const glyph = iconSize * (full ? STRATO_FULL.badgeGlyphOfBadge : STRATO_SIMPLE.glyphOfButton);
  const aiCircle = (
    <div style={{
      flex: 'none', width: iconSize, height: iconSize, borderRadius: 9999,
      background: aiGradient('strato'),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: pulse > 0 ? `scale(${1 + 0.08 * pulse})` : undefined,
      boxShadow: full
        ? `0 ${w * 0.02}px ${w * 0.03}px -${w * 0.006}px rgba(0,0,0,0.10), 0 ${w * 0.008}px ${w * 0.012}px -${w * 0.008}px rgba(0,0,0,0.10)`
        : `0 0 ${w * 0.025}px rgba(0,0,0,${0.52 * (1 - 0.4 * pulse)})${pulse > 0 ? `, 0 0 ${w * 0.06 * pulse}px rgba(228,152,255,${0.8 * pulse})` : ''}`,
    }}>
      <FlatIcon svg={AI_SVG[p.icon]} size={glyph} colour={STRATO_PROMPT.onGradient} />
    </div>
  );

  const text = (
    <GlowText
      blurPx={w * (full ? STRATO_FULL.textGlowBlurOfW : STRATO_SIMPLE.textGlowBlurOfW)}
      alpha={full ? STRATO_FULL.textGlowAlpha : STRATO_SIMPLE.textGlowAlpha}
      caret={p.caret}
      style={{
        ...clampLines(full ? STRATO_FULL.maxLines : STRATO_SIMPLE.maxLines),
        color: STRATO_PROMPT.ink, fontFamily: STRATO_PROMPT.face,
        fontWeight: full ? 500 : 600,
        fontSize: w * (full ? STRATO_FULL.fontOfW : STRATO_SIMPLE.fontOfW),
        lineHeight: `${w * (full ? STRATO_FULL.lineOfW : STRATO_SIMPLE.lineOfW)}px`,
      }}
    >{p.promptText}</GlowText>
  );

  return (
    // NO stacking context here (no z-index / opacity / transform / filter): the glow below must
    // blend with what is painted under the window. The glass card alone carries the z-index.
    <div style={{ position: 'absolute', left: p.left, bottom: p.bottom, width: w }}>
      <div aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        background: `linear-gradient(${angle}deg, ${PROMPT_WINDOW_BRANDS.strato.gradient[0]}, ${PROMPT_WINDOW_BRANDS.strato.gradient[1]})`,
        mixBlendMode: 'hard-light', filter: `blur(${glowBlur}px)`, opacity: Math.min(1, glow),
        transform: glow > 1 ? `scale(${1 + 0.06 * (glow - 1) / 0.35})` : undefined,
      }} />
      <div style={{
        position: 'relative', zIndex: 100, boxSizing: 'border-box', width: w,
        borderRadius: radius, overflow: 'hidden',
        background: STRATO_PROMPT.glass,
        backdropFilter: `blur(${w * (full ? STRATO_FULL.glassBlurOfW : STRATO_SIMPLE.glassBlurOfW)}px) saturate(1.15)`,
        boxShadow: STRATO_PROMPT.rim,
        ...card,
      }}>
        {full ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: w * STRATO_FULL.rowGapOfW }}>
              {aiCircle}
              {p.label ? (
                <div style={{
                  ...clampLines(STRATO_FULL.labelMaxLines),
                  color: STRATO_PROMPT.ink, fontFamily: STRATO_PROMPT.face, fontWeight: 500,
                  fontSize: w * STRATO_FULL.labelFontOfW, lineHeight: STRATO_FULL.labelLine,
                  textTransform: 'uppercase', maxWidth: w * 0.45,
                }}>{p.label}</div>
              ) : null}
            </div>
            {text}
          </>
        ) : (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>{text}</div>
            {aiCircle}
          </>
        )}
      </div>
    </div>
  );
}
