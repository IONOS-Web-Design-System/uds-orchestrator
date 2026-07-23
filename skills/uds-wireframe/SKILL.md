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

## Before You Start

Ask these before generating (skip any the user already answered):

1. **Images?** — "Do you want to include images? If so, paste a local file path or Figma URL."
2. **Fidelity?** — "Standard (real placeholder copy, light background) or **decorative** (dark/cinematic, bar placeholders, device frame, glass cards)?"

For **decorative mode only**, also ask:

3. **Size?** — Large (~750px) / Medium (~500px) / Small (~250px)
4. **Animations?** — "Should elements have interaction animations?"

If the prompt contains "decorative", "dark", "cinematic", "premium", or "marketing visual" → treat as decorative without asking question 2. Standard wireframes never include animations — skip questions 3 and 4.

## Rules Index

All rules are inlined below. Quick navigation:

| Rule file | Covers |
|---|---|
| `ionos/remotion-template.md` | **Read first for Remotion jobs** — VariantProps schema, Root.tsx contract, TypeScript error triage |
| `ionos/ai-animations.md` | **AI animation templates** — copy-ready Remotion code for button, loading state, radial bloom, sparkle pulse. Preview: http://localhost:4200/ai-templates |
| `ionos/product-frame.md` | Product frame structure, **verified icon allowlist** (system + brandmark), contrast rules, feature pop-out, **constrained viewport cropping patterns** (bottom bleed, zoom-to-highlight, counterbalance rule) |
| `ionos/composition.md` | Standard layout patterns, component selection, placeholder content guidelines |
| `ionos/decorative-mode.md` | Decorative mode setup, device frames, Bar/BarGroup helpers, glass card system, HTML preview |
| `ionos/micro-animations.md` | CSS animation patterns — cursor flow, card press, bar grow, float bob, fly-in, variant switcher |
| `ionos/asset-integration.md` | Local file and Figma URL asset integration, pipeline catalog `role:`-driven selection & placement, staggered reveal |
| `shared/embed-preamble.md` | **Hybrid embed-contract preamble — every brand.** Read first when brief contains `[HYBRID EMBED CONTRACT]`; then the per-style file below matching the brief's `Style:` line |
| `shared/embed-<style>.md` | Per-style embed geometry — one file per embed style (`product-pop-out`, `device-mockup`, `background-pointer`, `background-full`, `interface-asset`, `floating-card`); the loader inlines only the style this render uses |
| `shared/embed-color-harmony.md` | Color-harmony rule for the four opaque embed styles |
| `ionos/image-backdrop.md` | IONOS-specific embed-contract notes only — the geometry itself lives in `shared/embed-preamble.md` + the per-style `shared/embed-<style>.md` files |
| `ionos/small-format.md` | **Small-format illustrations** (< ~512px both axes) — icon-story grammar, cropped-product-frame pattern, icon sizing, loop motion rules, hybrid-in-small-format embed styles |

## Pattern → Rule routing

When the brief names a `Composition pattern:` (set by the moderator), load the corresponding rule **in addition to** `ionos/composition.md` and `ionos/product-frame.md`:

| Pattern name | Extra rule to load |
|---|---|
| `product-frame-full`, `product-frame-bottom-bleed`, `product-frame-zoom-cutout`, `product-frame-square` | `ionos/product-frame.md` (already in index — confirm loaded) |
| `product-frame-connector-line` | `ionos/product-frame.md` — read the "Connector Line" section |
| `image-backdrop-feature-pointer` | `shared/embed-preamble.md` + `shared/embed-image-backdrop-pointer.md` |
| `image-backdrop-full-bleed` | `shared/embed-preamble.md` + `shared/embed-image-backdrop-full.md` |
| `interface-asset` | `shared/embed-preamble.md` + `shared/embed-interface-asset.md` |
| `floating-card` | `shared/embed-preamble.md` + `shared/embed-floating-intersect.md` |
| `small-icon-story`, `small-cropped-frame` | `ionos/small-format.md` |

When `dimensions.w < 512 AND dimensions.h < 512` and no `Composition pattern:` is set, default to `small-cropped-frame` for product briefs and `small-icon-story` for abstract briefs.

When the brief contains `[HYBRID EMBED CONTRACT]`, always load `shared/embed-preamble.md` first, then the single `shared/embed-<style>.md` file matching the contract's `Style:` line (or, for the two composites, the `[PRODUCT-POP-OUT COMPOSITE]` / `[DEVICE-MOCKUP COMPOSITE]` tag): `embed-image-backdrop-pointer.md`, `embed-image-backdrop-full.md`, `embed-interface-asset.md`, `embed-floating-intersect.md`, `embed-product-pop-out.md`, or `embed-device-mockup.md`. For the four opaque styles, also load `shared/embed-color-harmony.md`.

## Output Format

Produce a single `src/Composition.tsx`. For Remotion jobs, the template's `Root.tsx` is pre-wired — only write `Composition.tsx`. Structure:

```tsx
// Wireframe illustration — not production code
import { type VariantProps } from './schema';          // Remotion: always use VariantProps
// OR for static wireframes:
import { ThemeProvider } from '@ionos-web-design-system/react';  // NOTE: there is no `Surface` export — use a div with a bg-surface-* utility class

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

## Related Skills

- **`uds-style-guide`** — brand colors, typography, AI feature color language (ionos-ai-features)
- **`uds-usage-best-practices`** — component APIs, token usage, prop patterns
- **`remotion-best-practices`** — advanced animation timing, spring physics, video export
