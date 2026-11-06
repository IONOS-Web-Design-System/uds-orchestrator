/**
 * strato-stage styles — the inline styles StratoStage puts on its layers, built purely from the
 * layer list so they are testable without a renderer. Only a type comes from React.
 *
 * Import specifiers carry NO file extension (see geometry.ts).
 */
import type { CSSProperties } from 'react';
import type { Rect } from './geometry';
import type { StageLayer } from './layers';

/**
 * The box StratoStage mounts its layers in: the canvas, from its top-left. With a bottom margin
 * it cuts at the content bottom, so nothing below that line shows: the STRATO stage's 8 %
 * (`safeArea.bottom` 0.08, task C6, 2026-11-06) puts the character's waist exactly there, so this
 * is the cut below the waist and the strip under it stays empty (a moderator older than 2026-11-05
 * sends 0.22, cut the same way). It never cuts at the right margin, which only positions the
 * character (an outstretched arm may reach into it). While the content box reaches the canvas
 * bottom (`safeArea.bottom` 0) it clips nothing: then only the canvas does.
 */
export function stageRootStyle(canvas: { w: number; h: number }, content: Rect): CSSProperties {
  const height = content.y + content.h;
  const root: CSSProperties = { position: 'absolute', left: 0, top: 0, width: canvas.w, height };
  return height < canvas.h ? { ...root, overflow: 'hidden' } : root;
}

/**
 * One placed layer: its rect (canvas px), its motion transform
 * about the rect's centre, its opacity.
 *
 * `maxWidth` / `maxHeight: 'none'` are load-bearing. The compose workspace's `src/index.css`
 * imports Tailwind, whose preflight sets `img, video { max-width: 100%; height: auto; }` on every
 * `<img>`. An inline `width` cannot beat `max-width`, while the inline `height` does beat
 * `height: auto`, so without these a wide cutout's character is squeezed or stretched (the first smoke render
 * squeezed the then-present powders x1.6-2.3).
 *
 * The character is also `object-fit: contain`, top-centred: with correct metrics the rect has
 * the cutout's own aspect and this changes nothing, but a cutout placed with DEFAULT_METRICS
 * (a 3:4 guess) is letterboxed instead of stretched.
 */
export function layerStyle(l: StageLayer): CSSProperties {
  return {
    position: 'absolute',
    left: l.rect.x,
    top: l.rect.y,
    width: l.rect.w,
    height: l.rect.h,
    maxWidth: 'none',
    maxHeight: 'none',
    transform: l.transform,
    transformOrigin: '50% 50%',
    opacity: l.opacity,
    ...(l.id === 'character' ? { objectFit: 'contain', objectPosition: '50% 0' } : {}),
  };
}

/**
 * The interface's leg canvas inside its layer: `legW` x `legH` CSS px, scaled down onto the
 * layer's rect (half scale) from its top-left. It is a canvas, so it crops: overflow is clipped
 * here, before the scale, as in the leg's own render.
 */
export function interfaceLegStyle(rect: Rect, leg: { legW: number; legH: number }): CSSProperties {
  return {
    position: 'absolute',
    left: 0,
    top: 0,
    width: leg.legW,
    height: leg.legH,
    overflow: 'hidden',
    transform: `scale(${rect.w / leg.legW})`,
    transformOrigin: '0 0',
  };
}
