/**
 * Per-brand values for the PromptWindow template.
 *
 * These moved OUT of `rules/ionos/product-pop-out/prompt-window.md`, where they were a
 * markdown table an LLM re-typed on every run. Values are hardcoded (hex, or rgba for the
 * translucent glass surface) on purpose: CSS custom properties do not reliably resolve in a
 * Remotion render. Font families are names only — the workspace's `src/fonts.ts` has already
 * baked the brand's faces as data URIs.
 *
 * The faces differ by variant because the design source does: `prompt-simple` is UI text
 * (Open Sans), `prompt-full` reads as a prompt statement (Overpass).
 */

/** Static. Never animated or interpolated — see `ionos-ai-features.md`. */
export const AI_GRADIENT_ANGLE_DEG = 45;

export interface BrandValues {
  simple: { surface: string; blurPx: number; face: string };
  full: { surface: string; blurPx: number; face: string };
  text: string;
  /** [start, end] — blue to magenta. A purple-only or pink-only pair is wrong. */
  gradient: readonly [string, string];
  shadow: string;
}

export const PROMPT_WINDOW_BRANDS = {
  ionos: {
    simple: { surface: 'rgba(255,255,255,0.88)', blurPx: 14, face: 'Open Sans' },
    // BOTH variants are REAL GLASS now, per the designer's instruction: a translucent
    // nearly-white backdrop with a blur that actually takes effect (an opaque backdrop made
    // `blurPx` a no-op — there is nothing behind the surface for the browser to blur). 0.88 is
    // this codebase's established glass alpha, named as such in
    // `rules/shared/floating-card.md`'s "0.88 + backdrop-blur glass" (that file previously
    // reserved 0.88 for the AI generation area only; it now carries an explicit exception for
    // this shipped component). `blur(14px)` is shared by both variants on purpose — `simple`
    // was already measured at 14 from the design source, and `full` adopts the same value so
    // the bar and the card read as one material, not two different glasses.
    //
    // `prompt-full`'s ring buttons take their padding-box centre from THIS value (see
    // `RingButton` below), so the ring's centre follows the surface automatically. Because that
    // padding-box layer composites `full.surface` OVER the already-translucent card, the ring's
    // visual centre lands at an effective alpha of ~0.9856 against the card's 0.88 — a ~1.6%
    // mismatch, judged imperceptible and left as-is; see `RingButton`'s comment for the
    // alternative (an opaque ring centre) that was considered and rejected.
    full: { surface: 'rgba(255,255,255,0.88)', blurPx: 14, face: 'Overpass' },
    text: '#001B41',
    gradient: ['#095BB1', '#D746F5'],
    shadow: '0 8px 24px rgba(0,27,65,0.10)',
  },
} as const satisfies Record<string, BrandValues>;

export type PromptWindowBrand = keyof typeof PROMPT_WINDOW_BRANDS;

/** The ONE place the gradient string is built, so the angle cannot drift again. */
export function aiGradient(brand: PromptWindowBrand): string {
  const [start, end] = PROMPT_WINDOW_BRANDS[brand].gradient;
  return `linear-gradient(${AI_GRADIENT_ANGLE_DEG}deg, ${start}, ${end})`;
}
