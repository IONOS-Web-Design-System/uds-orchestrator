/**
 * Icons for the PromptWindow template — `system` group only.
 *
 * The import form below is the ONLY one that works in a Remotion render
 * (`remotion-best-practices/rules/shared-uds-icons.md`): the React `<Icon>` component and
 * the package's inject functions both depend on CSS injected at runtime, which is
 * unreliable in the headless renderer. Never insert `dist/` into these paths — it is not
 * in the package's exports map and fails tsc with TS2307 — and never silence an icon
 * import error with `@ts-ignore`, because that also switches off the only check that
 * catches a misspelled name.
 */
import { svgData as filledSparkles } from '@ionos-web-design-system/icon/system/filled-sparkles';
import { svgData as filledGenerativeWrite } from '@ionos-web-design-system/icon/system/filled-generative-write';
import { svgData as filledGenerativeWand } from '@ionos-web-design-system/icon/system/filled-generative-wand';
import { svgData as filledChatAi } from '@ionos-web-design-system/icon/system/filled-chat-ai';
import { svgData as filledEnvelopeAi } from '@ionos-web-design-system/icon/system/filled-envelope-ai';
import { svgData as arrowRight } from '@ionos-web-design-system/icon/system/arrow-right';
import { svgData as filledPaperPlane } from '@ionos-web-design-system/icon/system/filled-paper-plane';
import { svgData as editSquare } from '@ionos-web-design-system/icon/system/edit-square';
import { svgData as refresh } from '@ionos-web-design-system/icon/system/refresh';
import { svgData as attachement } from '@ionos-web-design-system/icon/system/attachement';
import { svgData as mic } from '@ionos-web-design-system/icon/system/mic';
import { aiGradient, type PromptWindowBrand } from './promptWindow.brands';

/**
 * The AI icons that EXIST in the package. `filled-ai-phone` is documented for AI
 * receptionist / phone scenarios but is not shipped (verified against icon-names.json);
 * its documented fallback is `filled-sparkles`, which is this list's first entry.
 *
 * `star` and `filled-star` exist in the package but are NEVER AI icons. Because
 * `leadingIcon` is typed as `AiIconName`, passing one is a compile error.
 */
export const AI_ICON_NAMES = [
  'filled-sparkles',
  'filled-generative-write',
  'filled-generative-wand',
  'filled-chat-ai',
  'filled-envelope-ai',
] as const;

export type AiIconName = (typeof AI_ICON_NAMES)[number];
export type PromptAction = 'edit' | 'regenerate' | 'attach' | 'voice';
export type SendGlyph = 'arrow' | 'paper-plane';

export const AI_SVG: Record<AiIconName, string> = {
  'filled-sparkles': filledSparkles,
  'filled-generative-write': filledGenerativeWrite,
  'filled-generative-wand': filledGenerativeWand,
  'filled-chat-ai': filledChatAi,
  'filled-envelope-ai': filledEnvelopeAi,
};

/** Send-glyph key -> the real `system` glyph name. Paired with SEND_SVG below; kept as a
 *  name map so tests can assert every referenced name still exists in the package. */
export const SEND_ICON = {
  arrow: 'arrow-right',
  'paper-plane': 'filled-paper-plane',
} as const satisfies Record<SendGlyph, string>;

export const SEND_SVG: Record<SendGlyph, string> = {
  arrow: arrowRight,
  'paper-plane': filledPaperPlane,
};

/** Action key -> the real `system` glyph name, for documentation and tests. */
export const ACTION_ICON = {
  edit: 'edit-square',
  regenerate: 'refresh',
  attach: 'attachement',
  voice: 'mic',
} as const satisfies Record<PromptAction, string>;

export const ACTION_SVG: Record<PromptAction, string> = {
  edit: editSquare,
  regenerate: refresh,
  attach: attachement,
  voice: mic,
};

const MASK_BASE = {
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
} as const;

/**
 * An AI marker. Painted with the GRADIENT as `background` — `backgroundColor` would give a
 * solid colour and is explicitly wrong for an AI icon.
 */
export function AiIcon({ svg, size, brand = 'ionos' }: {
  svg: string; size: number; brand?: PromptWindowBrand;
}) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      background: aiGradient(brand),
      WebkitMaskImage: `url(${svg})`, maskImage: `url(${svg})`,
      ...MASK_BASE,
    }} />
  );
}

/**
 * Any non-AI glyph: send arrows, action glyphs. Flat `backgroundColor` + mask. The send
 * button's own circle carries the gradient, so its glyph is flat WHITE — a gradient glyph
 * on a gradient fill is invisible, and send is an affordance, not an AI marker.
 */
export function FlatIcon({ svg, size, colour }: { svg: string; size: number; colour: string }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      backgroundColor: colour,
      WebkitMaskImage: `url(${svg})`, maskImage: `url(${svg})`,
      ...MASK_BASE,
    }} />
  );
}
