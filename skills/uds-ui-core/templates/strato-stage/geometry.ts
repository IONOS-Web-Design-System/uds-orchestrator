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
 * horizontal centre is `centerX`. Since 2026-11-06 `subjectHeight` sizes only an unmeasured waist
 * (the subject bbox); a measured one is sized by `WAIST_SUBJECT_HEIGHT`.
 */
export const CHARACTER_ANCHOR = { headTopY: 22, subjectHeight: 661, centerX: 480 } as const;

/**
 * Head top to WAIST, in visual units: 610 - 22 = 588, so the waist lands exactly on the frame
 * bottom, which `placeStage` puts on the content bottom (the moderator's 8 % bottom-margin line).
 * Task C6, 2026-11-06 (the user's "less cropped, moved up, slightly smaller"): it replaces the
 * Figma's 661, whose waist ran 73 units past the frame bottom. The head top stays on 22.
 */
export const WAIST_SUBJECT_HEIGHT = VISUAL.h - CHARACTER_ANCHOR.headTopY;

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
  /**
   * The estimated waist row / IMAGE height (the frame `headTopFrac` is in). Optional: a moderator
   * older than 2026-11-05 does not send it, and then the subject bbox is scaled as before.
   */
  waistFrac?: number;
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
 * The span the character is sized by: `frac` of the image height stands for `visual` units.
 * Head top to waist is `WAIST_SUBJECT_HEIGHT` (588) when the waist is known and below the head
 * top; else (an older moderator, or an empty or head-only mask) the whole subject bbox is
 * `CHARACTER_ANCHOR.subjectHeight` (661), as before 2026-11-05.
 */
function anchoredSpan(m: StageMetrics): { frac: number; visual: number } {
  const waist = m.waistFrac;
  return waist !== undefined && Number.isFinite(waist) && waist > m.headTopFrac
    ? { frac: waist - m.headTopFrac, visual: WAIST_SUBJECT_HEIGHT }
    : { frac: m.subjectHeightFrac, visual: CHARACTER_ANCHOR.subjectHeight };
}

/**
 * The character's <Img> box in visual units, at its native aspect with its head top and
 * horizontal centre on `CHARACTER_ANCHOR` (663:8787). Sized so head top to waist (`waistFrac`) is
 * `WAIST_SUBJECT_HEIGHT` (588) tall: the waist lands exactly on the frame bottom (610). Without a
 * usable waist the whole subject bbox is `subjectHeight` (661) tall, as before: its bottom lands
 * 22 + 661 - 610 = 73 below the frame bottom.
 */
export function characterRect(m: StageMetrics): Rect {
  const span = anchoredSpan(m);
  const s = span.visual / (span.frac * m.imgH);
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
 * and never with both sides <= 512 (agent-svc's small-format band): then scaled up so the long
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
  if (!(Number.isFinite(slot.w) && Number.isFinite(slot.h) && slot.h > 0 && Math.round(2 * slot.w) >= 1)) {
    throw new RangeError(
      `promptWindowLeg: the slot needs a finite, positive width and height and room for a pill at least 1 px wide; got ${slot.w} x ${slot.h}`,
    );
  }
  const padded = (pw: number): { w: number; h: number } => {
    const pad = Math.round(PROMPT_WINDOW_GLOW_PAD_OF_W * pw);
    return { w: pw + 2 * pad, h: Math.round(pw / STRATO_SIMPLE_ASPECT + 2 * pad) };
  };
  // Both sides of the padded canvas only grow with the pill, so walking down finds the largest fit.
  // A pill as wide as the cap already overflows it, so the walk starts there (fewer than 720 steps).
  let pw = Math.min(Math.round(2 * slot.w), LEG_MAX.w);
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

/** What `placeStage` needs. `StageInput` (layers.ts) is this plus the image path. */
export type StagePlacementInput = {
  canvas: { w: number; h: number };
  /** Transparent margin on the right / bottom, as fractions of the canvas. Default: none. */
  safeArea?: { right: number; bottom: number };
  /** Measured alpha bbox (and waist) of the character cutout. Default: `DEFAULT_METRICS`. */
  metrics?: StageMetrics;
  /** The interface leg (the canvas the moderator rendered it at), mounted at half scale. */
  iface?: { kind: InterfaceKind; legW: number; legH: number };
};

/**
 * Where the stage lands. Rects are canvas px (the content box starts at the canvas origin);
 * `charScale` / `ifaceScale` are canvas px per visual unit; `portraitness` is 0 (landscape) to 1.
 */
export type StagePlacement = {
  character: Rect;
  iface: Rect | null;
  portraitness: number;
  charScale: number;
  ifaceScale: number;
};

/** Content aspect (w / h) at and below which the stage is fully portrait: 3:4 (spec 2026-11-05 §4.1). */
const PORTRAIT_ASPECT = 3 / 4;
/** Fully portrait, the head top lands this far down the content height (mockup B, 1536 x 2048). */
const PORTRAIT_HEAD_TOP_OF_H = 0.25;
/** Head top to the frame bottom, 610 - 22 = 588 visual units. */
const HEAD_TO_FRAME_BOTTOM = VISUAL.h - CHARACTER_ANCHOR.headTopY;

/** 0 while the content box is at least as wide as the 672:610 frame, 1 at 3:4 and narrower, linear between. */
function portraitness(content: Rect): number {
  const landscape = VISUAL.w / VISUAL.h;
  return clamp((landscape - content.w / content.h) / (landscape - PORTRAIT_ASPECT), 0, 1);
}

/**
 * How far to move centre `x` so the extent `[x + a, x + b]` (a <= 0 <= b) lies in `[0, W]`: the
 * least move when it fits; when it is wider than `W`, the move to `W * -a / (b - a)`, where the
 * shrink about the centre that follows needs the least shrink. At a width of exactly `W` the two
 * agree, so the shift is continuous.
 */
function fitShift(x: number, a: number, b: number, W: number): number {
  if (b - a >= W) return clamp((W * -a) / (b - a), 0, W) - x;
  if (x + a < 0) return -(x + a);
  if (x + b > W) return W - (x + b);
  return 0;
}

/**
 * The visible part of an interface leg mounted at half scale, in visual units; it shares the
 * mount's centre. For the AI prompt leg (a `feature-highlight` leg whose canvas is
 * `promptWindowLeg(slot).canvas`, the size the moderator requests it at) that is the pill: the
 * glow pad around it is transparent (edge alpha <= 4/255) and is not content. For every other
 * leg (a card) it is the whole mounted leg, which is the slot.
 */
function visibleInterfaceSize(kind: InterfaceKind, slot: Rect, leg: { w: number; h: number }): { w: number; h: number } {
  if (kind === 'feature-highlight') {
    const pw = promptWindowLeg(slot);
    if (pw.canvas.w === leg.w && pw.canvas.h === leg.h) {
      return { w: pw.promptWindow.width / 2, h: pw.promptWindow.width / STRATO_SIMPLE_ASPECT / 2 };
    }
  }
  return { w: leg.w / 2, h: leg.h / 2 };
}

/** Centre `v` of a box `size` long, clamped so the box lies in `[0, extent]` (centred if it cannot). */
const clampCentre = (v: number, size: number, extent: number): number =>
  size >= extent ? extent / 2 : clamp(v, size / 2, extent - size / 2);

/**
 * The stage on the canvas (spec 2026-11-05 §4.1, decisions 1-4).
 *
 * Character. Scale `c = lerp(s, c1, p)`: `s` is the frame's fit (`fitStage`), `c1` puts the head
 * top 25 % down the content height with the waist on the content bottom, `p` is the portraitness.
 * The head top sits at `content bottom - 588 c` (at `c = s` that is `originY + 22 s`, the Figma's),
 * the centre x at `originX + 480 s`, and head-to-waist is `WAIST_SUBJECT_HEIGHT` (588) x the scale,
 * so the waist lies exactly on the content bottom: with the moderator's 8 % bottom margin the stage
 * root clips there (`stageRootStyle`), so nothing below the waist shows (task C6). Without a waist
 * the subject bbox is 661 tall and its bottom 73 c below the content bottom, as before. Then never
 * clipped: the measured extent (`leftFrac` / `rightFrac`, which include outstretched arms) must
 * lie inside the canvas width. When `p > 0` the character first slides inward by `p` x the shift
 * that would fit it (so nothing jumps as `p` leaves 0), then it shrinks about the centre of its
 * waist line until it fits, so the waist stays on the content bottom. Landscape (`p = 0`) only
 * shrinks. The top cannot cross: the head top (`headTopFrac`, raised arms included) is at
 * `content bottom - 588 c`, which is `originY + 22 s > 0` at `c = s` and a quarter of the content
 * height at `c = c1`, so positive in between, and shrinking about the waist only lowers it.
 *
 * Interface. Its leg at half scale (`interfaceMountRect`) at the frame's scale `s`, its centre at
 * the slot's offset from the anchor: horizontally `(slotCentreX - 480) s` from the character's
 * centre, vertically `(slotCentreY - 22)` x the character's final scale x `588 / 661` below its
 * head top (x 1 without a waist), so it keeps its share of head-to-waist, the chest height, on the
 * 588 body (the slot of `interfaceSlot(kind, faceSafe)`, per kind). Its VISIBLE part
 * (`visibleInterfaceSize`: the card, or the AI prompt's pill) is then kept inside the canvas width,
 * nudged below the face-safe rect placed with the character (+ 8, `interfaceSlot`'s rule) when it
 * would cover it, and kept between the canvas top and the line the stage root clips at (the content
 * bottom with a bottom margin, else the canvas bottom), centred when taller; that last clamp wins
 * over the face nudge. The AI prompt leg's transparent glow pad may run past the edge, as it always
 * could (controller ruling, 2026-11-05). Rulings on the C6 concerns, 2026-11-06.
 *
 * At `p = 0`, with a pose that fits, the character is exactly the frame's fit applied to
 * `characterRect`, and so is the interface's x and size; its y is the fit's raised by the 588/661
 * offset rule (exactly the fit's without a waist), unless the face nudge or a clamp moves it.
 */
export function placeStage(input: StagePlacementInput): StagePlacement {
  const { canvas } = input;
  const m = input.metrics ?? DEFAULT_METRICS;
  const f = fitStage(canvas, input.safeArea);
  const s = f.scale;
  const p = portraitness(f.content);
  const c1 = ((1 - PORTRAIT_HEAD_TOP_OF_H) * f.content.h) / HEAD_TO_FRAME_BOTTOM;
  const c = s + (c1 - s) * p;
  // The bottom of the sized span (the waist; without one, the bbox bottom) lies `22 + span - 610`
  // below the content bottom: 0 for the waist, so the head top is `content bottom - 588 c` either way.
  const span = anchoredSpan(m);
  const waistY = f.content.y + f.content.h + (CHARACTER_ANCHOR.headTopY + span.visual - VISUAL.h) * c;
  const x0 = f.content.x + f.originX + CHARACTER_ANCHOR.centerX * s;

  // The measured extent as offsets from the centre x, in canvas px at scale `c`.
  const r = characterRect(m);
  const a = (r.x + m.leftFrac * r.w - CHARACTER_ANCHOR.centerX) * c;
  const b = (r.x + m.rightFrac * r.w - CHARACTER_ANCHOR.centerX) * c;
  const x = x0 + p * fitShift(x0, a, b, canvas.w);
  let k = 1;
  if (a < 0) k = Math.min(k, x / -a);
  if (b > 0) k = Math.min(k, (canvas.w - x) / b);
  const charScale = c * k;
  const headTop = waistY - span.visual * charScale;
  const character: Rect = {
    x: x + (r.x - CHARACTER_ANCHOR.centerX) * charScale,
    y: headTop + (r.y - CHARACTER_ANCHOR.headTopY) * charScale,
    w: r.w * charScale,
    h: r.h * charScale,
  };

  let iface: Rect | null = null;
  if (input.iface) {
    const slot = interfaceSlot(input.iface.kind, faceSafeRect(m));
    const mount = interfaceMountRect(slot, { w: input.iface.legW, h: input.iface.legH });
    const w = mount.w * s;
    const h = mount.h * s;
    const vis = visibleInterfaceSize(input.iface.kind, slot, { w: input.iface.legW, h: input.iface.legH });
    const vw = vis.w * s;
    const vh = vis.h * s;
    // x: the slot's offset from the character centre at `s`, the visible part kept in the canvas width.
    const cx = clampCentre(x - (CHARACTER_ANCHOR.centerX - (slot.x + slot.w / 2)) * s, vw, canvas.w);
    // y: the slot's drop below the head top, at the character's final scale and, on the waist path,
    // times 588/661, so it keeps its share of head-to-waist (chest height) on the smaller body.
    const bodyRatio = span.visual / CHARACTER_ANCHOR.subjectHeight;
    let cy = headTop + (slot.y + slot.h / 2 - CHARACTER_ANCHOR.headTopY) * charScale * bodyRatio;
    // Never over the face: interfaceSlot's nudge (below the face-safe rect, + 8), re-applied to the
    // placed visible part and the face-safe rect placed with the character.
    const fs = faceSafeRect(m);
    const face: Rect = {
      x: x + (fs.x - CHARACTER_ANCHOR.centerX) * charScale,
      y: headTop + (fs.y - CHARACTER_ANCHOR.headTopY) * charScale,
      w: fs.w * charScale,
      h: fs.h * charScale,
    };
    if (intersects({ x: cx - vw / 2, y: cy - vh / 2, w: vw, h: vh }, face)) cy = face.y + face.h + 8 * charScale + vh / 2;
    // Then kept above the line the stage root clips at (`stageRootStyle`: the content bottom when
    // there is a bottom margin, else the canvas bottom); this wins over the face nudge.
    const clipBottom = Math.min(canvas.h, f.content.y + f.content.h);
    iface = { x: cx - w / 2, y: clampCentre(cy, vh, clipBottom) - h / 2, w, h };
  }
  return { character, iface, portraitness: p, charScale, ifaceScale: s };
}
