/**
 * Per-brand values for the PromptWindow template.
 *
 * These moved OUT of `rules/ionos/product-pop-out/prompt-window.md`, where they were a
 * markdown table an LLM re-typed on every run. Values are hardcoded hex on purpose: CSS
 * custom properties do not reliably resolve in a Remotion render. Font families are names
 * only — the workspace's `src/fonts.ts` has already baked the brand's faces as data URIs.
 *
 * The faces differ by variant because the design source does: `prompt-simple` is UI text
 * (Open Sans), `prompt-full` reads as a prompt statement (Overpass).
 */

/** Static. Never animated or interpolated — see `ionos-ai-features.md`. */
export const AI_GRADIENT_ANGLE_DEG = 45;

export interface BrandValues {
  simple: { surface: string; blurPx: number; face: string };
  full: { surface: string; face: string };
  text: string;
  /** [start, end] — blue to magenta. A purple-only or pink-only pair is wrong. */
  gradient: readonly [string, string];
  shadow: string;
}

export const PROMPT_WINDOW_BRANDS = {
  ionos: {
    simple: { surface: '#FFFFFF', blurPx: 14, face: 'Open Sans' },
    full: { surface: '#F5F5F5', face: 'Overpass' },
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
