/**
 * The STRATO corporate stage's glass card, AI and non-AI. The AI card and the STRATO prompt
 * window read the same STRATO_AI_MATERIAL constant, so glass, glow and badge shadow cannot
 * drift. The card fills its StagePair slot and sizes everything in px off the slot width.
 * The wrapper creates no stacking context (as PromptWindow does).
 */
import type { ReactNode } from 'react';
import { aiGradient, PROMPT_WINDOW_BRANDS } from './promptWindow.brands';
import { AI_SVG, FlatIcon } from './promptWindow.icons';
import { STRATO_AI_MATERIAL, STRATO_PROMPT } from './promptWindow.strato';
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

export const stageAccentFill = (ai: boolean): string =>
  ai ? `linear-gradient(90deg, ${AI_START}, ${AI_END})` : STRATO_AI_MATERIAL.nonAi.accent;
export const stageOutline = (ai: boolean): string => (ai ? AI_START : PRIMARY);

/** Hook-free body (tests call this directly with an explicit slot). */
export function renderStageCard(p: { ai: boolean; children: ReactNode; slot: Slot }) {
  const w = p.slot.w;
  const radius = RADIUS_OF_W * w;
  return (
    <div style={{ position: 'relative', width: w, height: p.slot.h }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        background: p.ai ? aiGradient('strato') : STRATO_AI_MATERIAL.nonAi.glow,
        mixBlendMode: 'hard-light',
        filter: `blur(${GLOW_BLUR_OF_W * w}px)`,
        opacity: p.ai ? STRATO_AI_MATERIAL.glowStrength : STRATO_AI_MATERIAL.nonAi.glowStrength,
      }} />
      <div style={{
        position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: radius,
        background: STRATO_AI_MATERIAL.glass,
        backdropFilter: `blur(${GLASS_BLUR_OF_W * w}px)`,
        boxShadow: STRATO_PROMPT.rim,
        padding: PAD_OF_W * w,
        color: STAGE_INK,
      }}>
        {p.children}
      </div>
    </div>
  );
}

/** The AI sparkle is the default glyph for an AI badge only; a non-AI badge must be given its glyph. */
export type StageBadgeProps = { ai: true; glyph?: ReactNode } | { ai: false; glyph: ReactNode };

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
      {p.ai ? (p.glyph ?? <FlatIcon svg={AI_SVG['filled-sparkles']} size={d * BADGE_GLYPH_OF_BADGE} colour="#FFFFFF" />) : p.glyph}
    </div>
  );
}

export function StageCard(props: { ai: boolean; children: ReactNode }) {
  return renderStageCard({ ...props, slot: useStageSlot() });
}

export function StageBadge(props: StageBadgeProps) {
  return renderStageBadge({ ...props, slot: useStageSlot() });
}
