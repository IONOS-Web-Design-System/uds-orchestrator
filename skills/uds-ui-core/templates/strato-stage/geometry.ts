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

/** agent-svc's canvas range for a `/generate` run (its `DimensionsSchema`). */
const LEG_MIN = { w: 320, h: 180 } as const;
const LEG_MAX = { w: 1920, h: 1080 } as const;

/**
 * The leg-canvas clamps: raised to 320 x 180, capped at 1920 x 1080, and never with both sides
 * <= 512 (agent-svc's small-format band): then scaled up so the long side is 513.
 */
function fitLegCanvas(w0: number, h0: number): { w: number; h: number } {
  let w = clamp(w0, LEG_MIN.w, LEG_MAX.w);
  let h = clamp(h0, LEG_MIN.h, LEG_MAX.h);
  if (w <= 512 && h <= 512) {
    const long = Math.max(w, h);
    // multiply before dividing so an exact multiple (320 * 513 / 320) stays exact before `ceil`
    w = Math.ceil((w * 513) / long);
    h = Math.ceil((h * 513) / long);
    w = Math.min(w, LEG_MAX.w);
    h = Math.min(h, LEG_MAX.h);
  }
  return { w, h };
}

/**
 * Canvas size of the interface leg: 2x the slot, raised to 320 x 180, capped at 1920 x 1080,
 * and never with both sides <= 512 (image-svc's small-format band): then scaled up so the long
 * side is 513. The composite mounts it at half scale, centred on the slot.
 * MIRROR: the moderator's `legDimsForSlot` (src/orchestrate/stagePayloads.ts) decides the size the
 * leg is actually requested at; this copy documents and tests the rule. Change both.
 */
export function interfaceLegDims(slot: Rect): { w: number; h: number } {
  return fitLegCanvas(Math.round(2 * slot.w), Math.round(2 * slot.h));
}

/**
 * The STRATO `prompt-simple` pill's width / height. MIRRORS `STRATO_SIMPLE.aspect` in
 * `product-pop-out/promptWindow.strato.tsx` (Figma 587:6992); geometry.test.ts asserts the two
 * are equal. Not imported from there: this directory is copied ALONE into the compose workspace
 * (`src/uds/strato-stage/`, while product-pop-out lands flat in `src/uds/`), so a
 * `../product-pop-out/...` import cannot resolve there, and it would pull React and the icon
 * package into this pure module (selfContained.test.ts).
 */
export const STRATO_SIMPLE_ASPECT = 4.8404;

/**
 * Transparent room on every side of the pill, as a fraction of the pill's width. The pill's glow
 * is the pill itself blurred by 0.13 x width (`STRATO_SIMPLE.glowBlurOfW`) and scaled up to 1.06
 * at the send pulse; the leg canvas clips it (`interfaceLegStyle`), so a canvas the size of the
 * pill would cut the glow off in a hard edge. 0.3 x width is ~2.3 blur radii.
 */
export const PROMPT_WINDOW_GLOW_PAD_OF_W = 0.3;

/** The AI prompt highlight leg: its canvas, and the literal props of the ONE shipped
 *  `<PromptWindow>` drawn on it (leg-canvas px; `left`/`bottom` anchor the pill's bottom-left). */
export type PromptWindowLeg = {
  canvas: { w: number; h: number };
  promptWindow: { variant: 'prompt-simple'; width: number; left: number; bottom: number };
};

/**
 * The leg of a `feature-highlight` interface that IS the AI prompt (Figma 663:9864: the floating
 * STRATO prompt-simple pill over the character's chest). The pill is 2x the slot wide (as every
 * leg is 2x its slot) at its own aspect, padded by `PROMPT_WINDOW_GLOW_PAD_OF_W` of its width on
 * every side for the glow, and CENTRED in its canvas, so `interfaceMountRect` (half scale,
 * centred on the slot) puts the pill on the slot. The slot's height plays no part: the pill's
 * height is its width / `STRATO_SIMPLE_ASPECT`.
 *
 * The same clamps as `interfaceLegDims`. Over 1920 x 1080 the pill and its pad shrink together
 * (the largest pill whose padded canvas fits); under 320 x 180 or inside the small band only the
 * canvas grows, around the pill. Either way the pill stays centred and the props match the canvas.
 * MIRROR: the moderator's `promptWindowLeg` (src/orchestrate/stagePayloads.ts). Change both.
 */
export function promptWindowLeg(slot: { w: number; h: number }): PromptWindowLeg {
  const padded = (pw: number): { w: number; h: number } => {
    const pad = Math.round(PROMPT_WINDOW_GLOW_PAD_OF_W * pw);
    return { w: pw + 2 * pad, h: Math.round(pw / STRATO_SIMPLE_ASPECT + 2 * pad) };
  };
  // Both sides of the padded canvas only grow with the pill, so walking down finds the largest fit.
  let pw = Math.round(2 * slot.w);
  while (padded(pw).w > LEG_MAX.w || padded(pw).h > LEG_MAX.h) pw -= 1;
  const natural = padded(pw);
  const canvas = fitLegCanvas(natural.w, natural.h); // within the cap now, so it can only grow
  return {
    canvas,
    promptWindow: {
      variant: 'prompt-simple',
      width: pw,
      left: (canvas.w - pw) / 2,
      bottom: (canvas.h - pw / STRATO_SIMPLE_ASPECT) / 2,
    },
  };
}

/** The rect the interface leg occupies in the frame: the leg at half scale, centred on `slot`. */
export function interfaceMountRect(slot: Rect, leg: { w: number; h: number }): Rect {
  const w = leg.w / 2;
  const h = leg.h / 2;
  return { x: slot.x + slot.w / 2 - w / 2, y: slot.y + slot.h / 2 - h / 2, w, h };
}
