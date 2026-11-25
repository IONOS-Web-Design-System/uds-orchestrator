/**
 * The STRATO corporate stage's glass card, AI and non-AI. The AI card and the STRATO prompt
 * window read the same STRATO_AI_MATERIAL constant, so glass, glow and badge shadow cannot
 * drift. The card takes its StagePair slot's width, HUGS its content's height (capped at the slot height, and CLIPS
 * anything beyond: the glass is overflow hidden)
 * and sits vertically centred in the slot; everything is sized in px off the slot width.
 * The wrapper creates no stacking context (as PromptWindow does). Card text is #29294D Poppins;
 * `StageText` adds the window's plus-lighter white halo (its `GlowText`, reused).
 */
import type { ReactNode } from 'react';
import { aiGradient, PROMPT_WINDOW_BRANDS } from './promptWindow.brands';
import { AI_SVG, FlatIcon } from './promptWindow.icons';
import { GlowText, STRATO_AI_MATERIAL, STRATO_FULL, STRATO_PROMPT } from './promptWindow.strato';
import { useStageSlot } from './stagePair.layout';

type Slot = { w: number; h: number };

export const STAGE_INK = STRATO_PROMPT.ink;

const [AI_START, AI_END] = PROMPT_WINDOW_BRANDS.strato.gradient;
const PRIMARY = STRATO_AI_MATERIAL.nonAi.accent;

const RADIUS_OF_W = 0.0376;
const PAD_OF_W = 0.051;
const GLOW_BLUR_OF_W = 0.067;
const GLASS_BLUR_OF_W = 0.0103;
const BADGE_OF_W = 0.17;
const BADGE_GLYPH_OF_BADGE = 0.55;
const TILE_OF_W = 0.2;
const TILE_RADIUS_OF_TILE = 0.26;
const TILE_MIN_OF_W = 0.08;
const TILE_MAX_OF_W = 0.3;
const HEADLINE_OF_W = 0.068;

export const stageAccentFill = (ai: boolean): string =>
  ai ? `linear-gradient(90deg, ${AI_START}, ${AI_END})` : STRATO_AI_MATERIAL.nonAi.accent;
export const stageOutline = (ai: boolean): string => (ai ? AI_START : PRIMARY);

/** Hook-free body (tests call this directly with an explicit slot). */
export function renderStageCard(p: { ai: boolean; children: ReactNode; slot: Slot }) {
  const w = p.slot.w;
  const radius = RADIUS_OF_W * w;
  return (
    <div style={{ width: w, height: p.slot.h, display: 'flex', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: w }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: radius,
          background: p.ai ? aiGradient('strato') : STRATO_AI_MATERIAL.nonAi.glow,
          mixBlendMode: 'hard-light',
          filter: `blur(${GLOW_BLUR_OF_W * w}px)`,
          opacity: p.ai ? STRATO_AI_MATERIAL.glowStrength : STRATO_AI_MATERIAL.nonAi.glowStrength,
        }} />
        <div style={{
          position: 'relative', boxSizing: 'border-box', borderRadius: radius,
          minHeight: (BADGE_OF_W + 2 * PAD_OF_W) * w, maxHeight: p.slot.h,
          background: STRATO_AI_MATERIAL.glass,
          backdropFilter: `blur(${GLASS_BLUR_OF_W * w}px) saturate(1.15)`,
          boxShadow: STRATO_PROMPT.rim,
          padding: PAD_OF_W * w,
          overflow: 'hidden',
          color: STAGE_INK,
          fontFamily: STRATO_PROMPT.face,
        }}>
          {p.children}
        </div>
      </div>
    </div>
  );
}

/** A glyph that is an icon data URI (`svgData` of a UDS icon) renders as a white masked icon of
 *  `size` px, never as text; any other glyph renders as given. */
function renderGlyph(glyph: ReactNode | string, size: number): ReactNode {
  if (typeof glyph === 'string' && glyph.startsWith('data:image/')) {
    const mask = `url("${glyph.replace(/"/g, '\\"')}")`;
    return (
      <span style={{
        display: 'block', width: size, height: size, backgroundColor: '#FFFFFF',
        WebkitMaskImage: mask, maskImage: mask,
        WebkitMaskSize: 'contain', maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center', maskPosition: 'center',
      }} />
    );
  }
  return glyph;
}

/** The AI sparkle is the default glyph for an AI badge only; a non-AI badge must be given its glyph. */
export type StageBadgeProps = { ai: true; glyph?: ReactNode | string } | { ai: false; glyph: ReactNode | string };

export function renderStageBadge(p: StageBadgeProps & { slot: Slot }) {
  const d = BADGE_OF_W * p.slot.w;
  return (
    <div style={{
      width: d, height: d, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: p.ai ? aiGradient('strato') : PRIMARY,
      color: '#FFFFFF',
      boxShadow: STRATO_AI_MATERIAL.badgeShadow,
    }}>
      {p.ai ? (p.glyph != null ? renderGlyph(p.glyph, d * BADGE_GLYPH_OF_BADGE) : <FlatIcon svg={AI_SVG['filled-sparkles']} size={d * BADGE_GLYPH_OF_BADGE} colour="#FFFFFF" />) : renderGlyph(p.glyph, d * BADGE_GLYPH_OF_BADGE)}
    </div>
  );
}

/** The comp's glass icon tile: a rounded square. `size` is the tile's side in PIXELS, clamped to
 *  [0.08, 0.3] x the slot width; absent, it is 0.2 x the slot width. `glow`: the tile FLOATS on its
 *  own (the icons foreground, no card around it) and carries the card's glow, blurred behind it. */
export type StageTileProps = { ai: boolean; glyph: ReactNode | string; size?: number; glow?: boolean };

const TILE_GLOW_SPREAD_OF_TILE = 0.12;
const TILE_GLOW_BLUR_OF_TILE = 0.28;

export function renderStageTile(p: StageTileProps & { slot: Slot }) {
  const w = p.slot.w;
  const d = Math.min(TILE_MAX_OF_W * w, Math.max(TILE_MIN_OF_W * w, p.size ?? TILE_OF_W * w));
  const tile = renderTileFace(p, d);
  if (!p.glow) return tile;
  return (
    <div style={{ position: 'relative', width: d, height: d }}>
      <div style={{
        position: 'absolute', inset: -TILE_GLOW_SPREAD_OF_TILE * d, borderRadius: TILE_RADIUS_OF_TILE * d,
        background: p.ai ? aiGradient('strato') : STRATO_AI_MATERIAL.nonAi.glow,
        mixBlendMode: 'hard-light',
        filter: `blur(${TILE_GLOW_BLUR_OF_TILE * d}px)`,
        opacity: p.ai ? STRATO_AI_MATERIAL.glowStrength : STRATO_AI_MATERIAL.nonAi.glowStrength,
      }} />
      <div style={{ position: 'relative' }}>{tile}</div>
    </div>
  );
}

function renderTileFace(p: StageTileProps, d: number) {
  return (
    <div style={{
      width: d, height: d, borderRadius: TILE_RADIUS_OF_TILE * d,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: p.ai ? aiGradient('strato') : PRIMARY,
      color: '#FFFFFF',
      boxShadow: STRATO_AI_MATERIAL.badgeShadow,
    }}>
      {renderGlyph(p.glyph, d * BADGE_GLYPH_OF_BADGE)}
    </div>
  );
}

export type StageTextProps = {
  children: ReactNode;
  /** Overrides the headline defaults (bold, uppercase, 6.8 % of the card width, 1.15, 0.01em): size, weight, alignment, clamping. Colour and face are fixed (#29294D Poppins). */
  style?: Record<string, string | number>;
  /** Show the typing caret after the text. */
  caret?: boolean;
};

/** Hook-free body (tests call this directly with an explicit slot). The halo is the prompt
 *  window's prompt-full halo (`STRATO_FULL.textGlow*`), its blur a ratio of the slot width. */
export function renderStageText(p: StageTextProps & { slot: Slot }) {
  return (
    <GlowText
      blurPx={STRATO_FULL.textGlowBlurOfW * p.slot.w}
      alpha={STRATO_FULL.textGlowAlpha}
      caret={p.caret}
      style={{
        fontWeight: 700, textTransform: 'uppercase', fontSize: HEADLINE_OF_W * p.slot.w,
        lineHeight: 1.15, letterSpacing: '0.01em',
        ...p.style, color: STAGE_INK, fontFamily: STRATO_PROMPT.face,
      }}
    >{p.children}</GlowText>
  );
}

export function StageCard(props: { ai: boolean; children: ReactNode }) {
  return renderStageCard({ ...props, slot: useStageSlot() });
}

export function StageBadge(props: StageBadgeProps) {
  return renderStageBadge({ ...props, slot: useStageSlot() });
}

export function StageTile(props: StageTileProps) {
  return renderStageTile({ ...props, slot: useStageSlot() });
}

/** Card text with the prompt window's plus-lighter white halo. */
export function StageText(props: StageTextProps) {
  return renderStageText({ ...props, slot: useStageSlot() });
}
