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
| `ionos-wireframe-remotion-template` | **Read first for Remotion jobs** — VariantProps schema, Root.tsx contract, TypeScript error triage |
| `ionos-wireframe-ai-animations` | **AI animation templates** — copy-ready Remotion code for button, loading state, radial bloom, sparkle pulse. Preview: http://localhost:4200/ai-templates |
| `ionos-wireframe-product-frame` | Product frame structure, **verified icon allowlist** (system + brandmark), contrast rules, feature pop-out |
| `ionos-wireframe-composition` | Standard layout patterns, component selection, placeholder content guidelines |
| `ionos-wireframe-decorative-mode` | Decorative mode setup, device frames, Bar/BarGroup helpers, glass card system, HTML preview |
| `ionos-wireframe-micro-animations` | CSS animation patterns — cursor flow, card press, bar grow, float bob, fly-in, variant switcher |
| `ionos-wireframe-asset-integration` | Local file and Figma URL asset integration, pipeline Figma asset enrichment |

## Output Format

Produce a single `src/Composition.tsx`. For Remotion jobs, the template's `Root.tsx` is pre-wired — only write `Composition.tsx`. Structure:

```tsx
// Wireframe illustration — not production code
import { type VariantProps } from './schema';          // Remotion: always use VariantProps
// OR for static wireframes:
import { ThemeProvider, Surface } from '@ionos-web-design-system/react';

export const MyComposition: React.FC<VariantProps> = ({ headline, subline, variantId, brand, colorScheme }) => {
  return (
    <ThemeProvider brand={brand} colorScheme={colorScheme} platform="comfortable">
      {/* layout composition */}
    </ThemeProvider>
  );
};
```

## Related Skills

- **`uds-style-guide`** — brand colors, typography, AI feature color language (ionos-ai-features)
- **`uds-usage-best-practices`** — component APIs, token usage, prop patterns
- **`remotion-best-practices`** — advanced animation timing, spring physics, video export
