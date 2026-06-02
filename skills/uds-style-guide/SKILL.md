---
name: uds-style-guide
description: >
  Multi-brand style guide for the IONOS Universal Design System. Use whenever the
  user asks about brand colors, typography, design language, visual identity, color
  palette, or brand elements for any of the 8 UDS brands — even if code isn't
  mentioned. Triggers on: "brand colors", "brand font", "brand style", "design
  guidelines", "color palette", "illustration style", "creative direction", "brand
  identity", "which colors should I use", "brand typography", "IONOS blue",
  "Overpass", "Open Sans", "Poppins", "Nunito Sans", "Lato", "Inter", "strato
  colors", "fasthosts brand", "homepl style". For component usage and CSS token
  code patterns, see uds-usage-best-practices.
---

# UDS Style Guide — Multi-Brand

The UDS supports 8 brands. Each brand has its own color palette, typeface, and personality — but all share the same underlying design principles: **purposeful color**, **typographic clarity**, and **restraint over decoration**.

## Brand Navigation

Identify the target brand first, then go to the matching rule file:

| Brand | Font | Rule File | Status |
|-------|------|-----------|--------|
| **ionos** | Overpass / Open Sans | `rules/ionos-color-palette.md`, `rules/ionos-typography.md`, `rules/ionos-assets.md` | Full |
| **strato** | Nunito Sans | `rules/strato.md` | Stub |
| **fasthosts** | Poppins | `rules/fasthosts.md` | Stub |
| **homepl** | Lato | `rules/homepl.md` | Stub |
| **strefa** | Lato | `rules/strefa.md` | Stub |
| **udag** | Nunito Sans | `rules/udag.md` | Stub |
| **world4you** | Nunito Sans | `rules/world4you.md` | Stub |
| **arsys** | Inter | `rules/arsys.md` | Stub |

"Full" = Figma-sourced colors + typography + principles documented.  
"Stub" = font known; colors and detailed guidelines need Figma data to complete. For stub brands, read `rules/shared-identity-principles.md` for universal principles and note that brand-specific color data is not yet available.

## Reading Order

1. **`rules/shared-identity-principles.md`** — Principles that apply to all brands. Read this first regardless of target brand.
2. **Brand-specific rule files** — Navigate via the table above for colors and typography.
3. **`rules/ionos-ai-features.md`** — IONOS AI feature color language (blue→magenta gradient, AI tokens, Button `ai` concept). Read when building any AI affordance.

## Quick Reference — IONOS Brand

The three primary IONOS colors:

| Color | HEX | CSS Token | Role |
|-------|-----|-----------|------|
| IONOS Blue | `#003D8F` | `--brand/ionos-blue-600` | Logo, primary anchor |
| Sky | `#11C7E6` | `--brand/ionos-sky-300` | CTA, attention, energy |
| Dark Midnight | `#001B41` | `--brand/ionos-blue-800` | Primary text on screen |

IONOS typefaces: **Overpass** (`--base/font/heading`) for headlines, **Open Sans** (`--base/font/body`) for everything else.

**AI features** use the signature blue→magenta gradient — `--color-ai-primary-start` → `--color-ai-primary-end`, or `<Button concept="ai">`. See `rules/ionos-ai-features.md`. Reserve it for AI affordances only.

> **Token path notation:** this guide uses `/` as a hierarchy separator (Figma convention). In CSS, use hyphenated custom properties: `var(--brand-ionos-blue-600)`. See `uds-usage-best-practices` for correct token usage in code.

## CSS Import Pattern

Each brand ships its own CSS file. Import only the active brand:

```css
/* Single brand */
@import '@ionos-web-design-system/core/brands/ionos';

/* Development: load all brands for switching */
@import '@ionos-web-design-system/core/brands/*';
```

Activate a brand via HTML attribute:

```html
<html data-brand="ionos">
```

## Scope

For technical implementation (React components, Tailwind variants, token names in code), see `uds-usage-best-practices`. This skill covers visual identity: which colors, which fonts, and why.
