---
name: uds-wireframe
description: >
  Build brand-specific interface wireframe illustrations using UDS components,
  Tailwind utilities, and the IONOS design system. Use this skill whenever the
  user wants to sketch, mock up, or illustrate an interface layout, screen, page,
  or UI composition using real UDS components — even if they say "wireframe",
  "mockup", "sketch", "prototype", "interface illustration", "lo-fi layout", or
  "show me what this screen could look like". Also triggers when the user wants to
  combine a pixel image or Figma frame with a component layout, or wants
  micro-animations on a UI illustration. Supports two fidelity levels: standard
  (mid-fi, real placeholder text, light backgrounds) and decorative (dark/gradient
  backgrounds, visual bar placeholders, icon-forward glass cards, cinematic feel —
  trigger words: "decorative", "dark", "cinematic", "premium", "marketing visual").
  Outputs a .tsx file — real UDS components, real IONOS brand colors. Not a full
  production implementation — a composed illustration of structure and intent.
  Requires uds-style-guide and uds-usage-best-practices. For animation: references
  remotion-best-practices.
---

# UDS Wireframe

A wireframe here means a **live, renderable React composition** using real UDS components arranged to illustrate a layout. Real IONOS brand colors and typography — "low fidelity" comes from placeholder content, not greyscale aesthetics.

**UDS kit.** Every interface element the kit covers (buttons/CTAs, icon actions, inputs, toggles,
checkboxes, status chips, tags, avatars, progress, loading placeholders, tabs, UI copy, content
cards) is a `Kit*` component from `./kit`. Its API card is in the prompt section "# UDS kit". The
rules below say WHERE an element goes and HOW BIG its container is, never how to draw it.
Hand-build only layout and decoration — plus the sanctioned measured Figma components: the
corporate_stage `PromptWindow` (and its fallback skeleton) and the product-pop-out brand badges
(`badges.md`). Kit components render inside the `data-brand` root.

## Before You Start

Ask these before generating (skip any the user already answered):

1. **Images?** — "Do you want to include images? If so, paste a local file path or Figma URL."
2. **Fidelity?** — "Standard (real placeholder copy, light background) or **decorative** (dark/cinematic, bar placeholders, device frame, glass cards)?"

For **decorative mode only**, also ask:

3. **Size?** — Large (~750px) / Medium (~500px) / Small (~250px)
4. **Animations?** — "Should elements have interaction animations?"

If the prompt contains "decorative", "dark", "cinematic", "premium", or "marketing visual" → treat as decorative without asking question 2. Standard wireframes never include animations — skip questions 3 and 4.

## Rules Index

The loader inlines the rules this render needs (by brand, motion, size and embed style):

| Rule file | Covers |
|---|---|
| `ionos/remotion-template.md` | **Read first for Remotion jobs** — VariantProps, Root.tsx contract, tsc triage |
| `ionos/ai-animations.md` | AI templates on the kit: `AIPillButton`, `AIFloatingHighlight`, `AITextGenerationArea`, `AIImageGenerationArea` |
| `ionos/product-frame-color.md` | IONOS product-frame colours, icon import form, AI icons |
| `ionos/composition.md` | Layout patterns, placeholder content |
| `shared/frame-anatomy.md` | Product-frame structure, content, contrast, layout |
| `shared/constrained-viewport.md` | Cropping patterns: bottom bleed, zoom-to-highlight, square, counterbalance |
| `shared/connector-line.md` | Pop-out with an axis-aligned connector line |
| `shared/floating-card.md` | Floating Highlight anatomy + panel chrome (all patterns) |
| `ionos/decorative-mode.md` + `shared/{device-frames,placeholder-bars,icon-cards,glass-card,background-patterns,decorative-primitives}.md` | Decorative mode: colours, logos, anchor, primitives |
| `ionos/micro-animations.md` | Floaters, card press, bar grow, float bob, fly-in |
| `ionos/asset-integration.md` | Local/Figma/catalog asset selection & placement, staggered reveal |
| `shared/embed-preamble.md` + `shared/embed-<style>.md`, `shared/product-pop-out/*.md`, `shared/embed-color-harmony.md`, `ionos/image-backdrop.md` | Hybrid embed contract (see routing below) |
| `ionos/small-format.md` | Small format (< ~512px both axes) |

## Pattern → Rule routing

When the brief names a `Composition pattern:` (set by the moderator), load the corresponding rule **in addition to** `ionos/composition.md`, `shared/frame-anatomy.md`, and `ionos/product-frame-color.md`:

| Pattern name | Extra rule to load |
|---|---|
| `product-frame-full`, `product-frame-bottom-bleed`, `product-frame-zoom-cutout`, `product-frame-square` | `shared/constrained-viewport.md` |
| `product-frame-connector-line` | `shared/connector-line.md` |
| `image-backdrop-feature-pointer` | `shared/embed-preamble.md` + `shared/embed-image-backdrop-pointer.md` |
| `image-backdrop-full-bleed` | `shared/embed-preamble.md` + `shared/embed-image-backdrop-full.md` |
| `interface-asset` | `shared/embed-preamble.md` + `shared/embed-interface-asset.md` |
| `floating-card` | `shared/embed-preamble.md` + `shared/embed-floating-intersect.md` |
| `small-icon-story`, `small-cropped-frame` | `ionos/small-format.md` |

When `dimensions.w < 512 AND dimensions.h < 512` and no `Composition pattern:` is set, default to `small-cropped-frame` for product briefs and `small-icon-story` for abstract briefs.

When the brief contains `[HYBRID EMBED CONTRACT]`, load `shared/embed-preamble.md` first, then the file(s) for the contract's `Style:` line (or the `[PRODUCT-POP-OUT COMPOSITE]` / `[DEVICE-MOCKUP COMPOSITE]` tag: every `shared/product-pop-out/` file, or `embed-device-mockup.md`). The five opaque styles also load `shared/embed-color-harmony.md`.

## Output Format

Produce a single `src/Composition.tsx`. For Remotion jobs, the template's `Root.tsx` is pre-wired — only write `Composition.tsx`. Structure:

```tsx
// Wireframe illustration — not production code
import { type VariantProps } from './schema';          // Remotion: always use VariantProps
// OR for static wireframes:
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';  // subpath import only; there is no `Surface` component

export const MyComposition: React.FC<VariantProps> = ({ headline, subline, variantId, brand, colorScheme, platform }) => {
  return (
    // ThemeProvider takes ONLY children. Brand/platform/colorScheme are applied
    // as data-* attributes on a wrapping element (NOT props on ThemeProvider).
    <div data-brand={brand} data-platform={platform} data-color-scheme={colorScheme}>
      <ThemeProvider>
        {/* layout composition */}
      </ThemeProvider>
    </div>
  );
};
```

## Density and spacing

Interfaces are app-dense (`compact` platform). Container padding and gaps use core spacing tokens —
`gap: 'var(--space-3)'`, `padding: 'var(--space-4)'` — never raw px (px only for
frame sizes and positions). Headings at most `headingLg`.

## Related Skills

- **`uds-style-guide`** — brand colors, typography, AI feature color language (ionos-ai-features)
- **`uds-usage-best-practices`** — component APIs, token usage, prop patterns
- **`remotion-best-practices`** — advanced animation timing, spring physics, video export
