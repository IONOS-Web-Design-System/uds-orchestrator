---
name: uds-ui-core
description: >
  Shared foundations for every generated UDS interface composition, in both directions
  (low-fidelity demonstration wireframe and high-fidelity realistic interface): the Remotion
  template contract, asset integration, surface theme, brand product-frame colours and icons,
  the hybrid embed contracts (image backdrops, interface/inline assets, floating intersect,
  device mockup), the product-pop-out module and its PromptWindow template, and the wide-format
  canvas grammar. Inlined by agent-svc together with exactly one direction skill.
---

# UDS UI core

Every composition is a live, renderable React composition built from the UDS kit (`./kit`, API
in the prompt section "# UDS kit") inside a `data-brand` root. This skill holds what both
directions share; the direction skill inlined next to it (uds-wireframe for a demonstration
wireframe, uds-interface for a realistic interface) decides HOW MUCH interface to draw.

## Output Format

Produce `src/Composition.tsx` and `src/Root.tsx` (see `ionos/remotion-template.md`). Structure:

```tsx
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';  // subpath import only
import { type VariantProps } from './schema';

export const MyComposition: React.FC<VariantProps> = ({ brand, platform, colorScheme, texts }) => (
  // ThemeProvider takes ONLY children; brand/platform/colorScheme are data-* attributes.
  <div data-brand={brand} data-platform={platform} data-color-scheme={colorScheme}>
    <ThemeProvider>{/* composition */}</ThemeProvider>
  </div>
);
```

## Rules in this skill

| Rule file | Covers |
|---|---|
| `ionos/remotion-template.md` | VariantProps, Root.tsx contract, tsc triage |
| `ionos/composition.md` | Mental model, setup, icons, placeholder content, colours |
| `ionos/product-frame-color.md` | Product-shell colours, brandmark and system icon imports, AI icons |
| `shared/frame-anatomy.md` | Contrast, frame layout, base plate, animated overflow, surface separation |
| `shared/surface-theme.md`, `shared/no-marketing-heading.md` | Canvas surface, no marketing headline in UI |
| `ionos/asset-integration.md` | Local/Figma/catalog asset selection and placement |
| `shared/embed-preamble.md` + `shared/embed-*.md`, `ionos/image-backdrop.md`, `shared/product-pop-out/*.md`, `ionos/product-pop-out/*.md` | Hybrid embed contracts and the product-pop-out module |
| `ionos/wide-format.md` | Extended-landscape canvases (≥ 2.2:1) |

When the brief contains `[HYBRID EMBED CONTRACT]`, load `shared/embed-preamble.md` first, then the
file(s) for the contract's `Style:` line (or every `shared/product-pop-out/` file for
`[PRODUCT-POP-OUT COMPOSITE]`, `embed-device-mockup.md` for `[DEVICE-MOCKUP COMPOSITE]`). The
five opaque styles also load `shared/embed-color-harmony.md`.
