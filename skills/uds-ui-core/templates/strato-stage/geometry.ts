/**
 * strato-stage geometry — the pure numbers of the fixed STRATO corporate-stage template (character + optional floating interface).
 * No React, no DOM, no `remotion`: everything here is arithmetic, so it is testable without a
 * renderer and importable by the component, the tests and (by copy) agent-svc alike.
 *
 * Sources: Figma "Assets for AI" `StkUOHcGRMDXOZWT0E2nft`
 *   663:8787  target stage, character only (lg 1440 x 682); its right part is the 672 x 610 visual
 *   663:4371  library component `strato-stage-visual` (the 672 x 610 frame)
 *   663:9864  target stage with an AI-prompt interface over the character
 *   663:9895  the feature-highlight interface inside 663:9864
 *
 * Units: every `Rect` and offset below is in VISUAL units (the 672 x 610 frame), except
 * `StageFit.content`, which is in canvas pixels. The component scales visual units to canvas
 * pixels with `fitStage`, so nothing here knows the canvas size.
 *
 * Import specifiers carry NO file extension (webpack/Remotion cannot resolve `.js` -> `.ts`).
 */

export type Rect = { x: number; y: number; w: number; h: number };

/** The Figma visual frame the whole stage is designed in. Node 663:4371 (placed in 663:8787). */
export const VISUAL = { w: 672, h: 610 } as const;

/**
 * Where the character lands, from 663:8787: the head top is `headTopY` from the frame top, the
 * subject is `subjectHeight` tall (the body runs off the bottom, waist-cropped), and its
 * horizontal centre is `centerX`.
 */
export const CHARACTER_ANCHOR = { headTopY: 22, subjectHeight: 661, centerX: 480 } as const;

/**
 * The measured alpha bounding box of the character cutout. Field-for-field the moderator's
 * `CutoutMetrics` (src/orchestrate/measure.ts), so the request body can be passed straight in.
 */
export type StageMetrics = {
  headTopFrac: number; // top of the subject bbox / height (0 = touches top)
  bottomFrac: number; // bottom of the subject bbox / height
  leftFrac: number;
  rightFrac: number;
  subjectHeightFrac: number; // bottom - top
  centerXFrac: number; // bbox horizontal centre / width
  imgW: number; // native pixel width of the cutout
  imgH: number; // native pixel height of the cutout
  upperBodyLeftFrac: number; // bbox left over the top upper-body band / width
  upperBodyRightFrac: number; // bbox right over the same band / width
};

/**
 * Fallback when a cutout was never measured: a 3:4 portrait, head near the top, centred.
 * Not a Figma measurement (there is no node for it); it only has to be a plausible portrait.
 * The anchor it is placed on is still 663:8787 (`CHARACTER_ANCHOR`).
 */
export const DEFAULT_METRICS: StageMetrics = {
  headTopFrac: 0.05,
  bottomFrac: 1,
  leftFrac: 0.15,
  rightFrac: 0.85,
  subjectHeightFrac: 0.95,
  centerXFrac: 0.5,
  imgW: 1536,
  imgH: 2048,
  upperBodyLeftFrac: 0.3,
  upperBodyRightFrac: 0.7,
};

export type InterfaceKind = 'live-app' | 'feature-highlight';

/**
 * Fixed interface slots, in visual units.
 *  feature-highlight  Figma 663:9895 (the prompt pill over the character in 663:9864).
 *  live-app           PROVISIONAL: no Figma node yet. Left of the character at chest height,
 *                     as the spec describes for 663:9864 / 663:9453; replace when 663:9453 opens.
 */
export const INTERFACE_SLOTS: Record<InterfaceKind, Rect> = {
  'feature-highlight': { x: 90.2, y: 328.3, w: 384.7, h: 78.3 }, // Figma 663:9895
  'live-app': { x: 40, y: 250, w: 380, h: 285 }, // provisional, no Figma node
};

/** Where the visual frame lands on the canvas. `content` is in canvas px; `scale` maps visual
 *  units to canvas px; `originX/originY` are the canvas px of the visual frame's top-left. */
export type StageFit = { content: Rect; scale: number; originX: number; originY: number };

/**
 * Contain the 672 x 610 visual frame (663:4371) into the content box (the canvas minus the
 * transparent `safeArea` margin on the right and bottom), bottom-anchored and horizontally
 * centred. Layers are clipped to `content` by the caller.
 */
export function fitStage(
  canvas: { w: number; h: number },
  safeArea?: { right: number; bottom: number },
): StageFit {
  const right = safeArea?.right ?? 0;
  const bottom = safeArea?.bottom ?? 0;
  // `W - W*right`, not `W*(1-right)`: 1280*(1-0.32) is 870.3999999999999, this is 870.4.
  const content: Rect = { x: 0, y: 0, w: canvas.w - canvas.w * right, h: canvas.h - canvas.h * bottom };
  const scale = Math.min(content.w / VISUAL.w, content.h / VISUAL.h);
  return {
    content,
    scale,
    originX: (content.w - VISUAL.w * scale) / 2,
    originY: content.h - VISUAL.h * scale,
  };
}

/**
 * The character's <Img> box in visual units: sized so the subject is `subjectHeight` tall at
 * its native aspect, with its head top and horizontal centre on `CHARACTER_ANCHOR` (663:8787).
 */
export function characterRect(m: StageMetrics): Rect {
  const s = CHARACTER_ANCHOR.subjectHeight / (m.subjectHeightFrac * m.imgH);
  const w = m.imgW * s;
  const h = m.imgH * s;
  return { x: CHARACTER_ANCHOR.centerX - m.centerXFrac * w, y: CHARACTER_ANCHOR.headTopY - m.headTopFrac * h, w, h };
}

/** Face-safe band, mirroring the moderator's popOutGeometry.ts (FACE_SAFE_H 0.34, FACE_SAFE_PAD
 *  0.02) applied to the 672 x 610 frame. */
const FACE_SAFE_H = 0.34 * VISUAL.h;
const FACE_SAFE_PAD = 0.02 * VISUAL.w;

/** The upper-body + face area an interface must not cover, in visual units. */
export function faceSafeRect(m: StageMetrics): Rect {
  const r = characterRect(m);
  return {
    x: r.x + m.upperBodyLeftFrac * r.w - FACE_SAFE_PAD,
    y: r.y + m.headTopFrac * r.h,
    w: (m.upperBodyRightFrac - m.upperBodyLeftFrac) * r.w + 2 * FACE_SAFE_PAD,
    h: FACE_SAFE_H,
  };
}

const intersects = (a: Rect, b: Rect): boolean =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/**
 * The interface's rect: its fixed slot, nudged below the face-safe rect (+ 8) when it would
 * intersect it, then clamped to stay inside the frame. Never moves the slot sideways.
 */
export function interfaceSlot(kind: InterfaceKind, faceSafe: Rect): Rect {
  const slot = INTERFACE_SLOTS[kind];
  let y = slot.y;
  if (intersects(slot, faceSafe)) y = faceSafe.y + faceSafe.h + 8;
  y = Math.min(y, VISUAL.h - slot.h);
  return { x: slot.x, y, w: slot.w, h: slot.h };
}

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/**
 * Canvas size of the interface leg: 2x the slot, raised to 320 x 180, capped at 1920 x 1080,
 * and never with both sides <= 512 (image-svc's small-format band): then scaled up so the long
 * side is 513. The composite mounts it at half scale, centred on the slot.
 */
export function interfaceLegDims(slot: Rect): { w: number; h: number } {
  let w = clamp(Math.round(2 * slot.w), 320, 1920);
  let h = clamp(Math.round(2 * slot.h), 180, 1080);
  if (w <= 512 && h <= 512) {
    const long = Math.max(w, h);
    // multiply before dividing so an exact multiple (320 * 513 / 320) stays exact before `ceil`
    w = Math.ceil((w * 513) / long);
    h = Math.ceil((h * 513) / long);
    w = Math.min(w, 1920);
    h = Math.min(h, 1080);
  }
  return { w, h };
}

/** The rect the interface leg occupies in the frame: the leg at half scale, centred on `slot`. */
export function interfaceMountRect(slot: Rect, leg: { w: number; h: number }): Rect {
  const w = leg.w / 2;
  const h = leg.h / 2;
  return { x: slot.x + slot.w / 2 - w / 2, y: slot.y + slot.h / 2 - h / 2, w, h };
}
