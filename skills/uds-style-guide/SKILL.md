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
| **strato** | Poppins | `rules/strato.md` | Full |
| **fasthosts** | AntennaCond | `rules/fasthosts.md` | Stub |
| **homepl** | Azo Sans | `rules/homepl.md` | Full |
| **strefa** | Montserrat | `rules/strefa.md` | Stub |
| **udag** | Inter | `rules/udag.md` | Stub |
| **world4you** | Inter / Satoshi | `rules/world4you.md` | Stub |
| **arsys** | Open Sans / FS Blake | `rules/arsys.md` | Stub |

"Full" = Figma-sourced colors + typography + principles documented.  
"Stub" = font known; colors and detailed guidelines need Figma data to complete. For stub brands, read `rules/shared-identity-principles.md` for universal principles and note that brand-specific color data is not yet available.

Per-brand fonts/markets: see `rules/shared-brand-overview.md` (authoritative) and each brand's rule file.

## Reading Order

1. **`rules/shared-identity-principles.md`** — Principles that apply to all brands. Read this first regardless of target brand.
2. **Brand-specific rule files** — Navigate via the table above for colors and typography.
3. **`rules/ionos-ai-features.md`** — IONOS AI feature color language (blue→magenta gradient, AI tokens, Button `ai` concept). Read when building any AI affordance.

## Quick Reference — IONOS Brand

The three primary IONOS colors:

The three primary IONOS colors (the `Figma token` column is **reference notation only — not a CSS variable**):

| Color | HEX | Figma token (reference) | Role |
|-------|-----|-------------------------|------|
| IONOS Blue | `#003D8F` | `brand/ionos-blue-600` | Logo, primary anchor |
| Sky | `#11C7E6` | `brand/ionos-sky-300` | CTA, attention, energy |
| Dark Midnight | `#001B41` | `brand/ionos-blue-800` | Primary text on screen |

IONOS typefaces: **Overpass** for headlines, **Open Sans** for everything else.

**AI features** use the signature blue→magenta gradient — `<Button concept="ai">`, or in code the `--surface-semantic-ai` token. See `rules/ionos-ai-features.md`. Reserve it for AI affordances only.

> **Token path notation — Figma paths are NOT CSS variables.** This guide writes brand colours
> as Figma hierarchy paths (`brand/ionos-blue-600`). There is **no** matching CSS custom property
> for the brand colour scale — neither `var(--brand/ionos-blue-600)` (the `/` is a CSS parse error)
> nor `var(--brand-ionos-blue-600)` resolves; both silently drop the declaration and leave the
> element unstyled. **In code:** use the literal **hex** above for a specific brand colour, or use
> `@ionos-web-design-system/core` **semantic** tokens for UI roles — `var(--surface-base)` /
> `var(--text-base)`, `var(--surface-base-invert)` / `var(--text-base-invert)`,
> `var(--surface-subtlest)`, `var(--surface-semantic-ai)` / `var(--text-semantic-ai)` — always
> pairing a `--surface-*` with its matching `--text-*`. See `uds-usage-best-practices`.

## Quick Reference — Strato Brand

| Color | HEX | Role |
|-------|-----|------|
| Brand Orange | `#FF8800` | Logo, hero stage, primary brand anchor |
| Dark Orange | `#FF5C00` | Dark Orange Gradient endpoint |
| Light Orange | `#FFC700` | Brand Orange Gradient endpoint |
| Blue | `#272CB2` | CTA, buttons, interactive elements |
| Dark Blue | `#2F2F70` | Primary website text |

Strato typeface: **Poppins** for both headings and body.

Strato signature gradients:
- **Brand Orange**: `#FF8800` → `#FFC700` (warm/sunny hero)
- **Dark Orange**: `#FF5C00` → `#FF8800` (high-energy CTA)
- **Blue**: `#272CB2` → `#2F2F70` (dark/premium sections)

See `rules/strato.md` for the full palette, usage rules, and contrast-approved combinations.

## Quick Reference — home.pl Brand

| Color | HEX | Role |
|-------|-----|------|
| Brand Red | `#E20000` | Logo, primary CTAs, sole brand colour anchor |
| Light Red | `#FF2A2A` | Hover / interactive highlight state |
| Background | `#F5F7FA` | Default page surface (cool grey-blue) |
| Dark text | `#1B1B1B` | Primary text (soft near-black) |
| Dark sections | `#2E3842` | Nav, footer, dark UI areas |

home.pl typeface: **Azo Sans** for both headings and body.

Brand identity principle: **one red accent per composition, maximum** — never a red background, never multiple red elements. Warmth comes from the subject's expression and attire, not from lighting colour. See `rules/homepl.md` for the full palette and the three image rules (Timeless, Warmth over Tech, Red Accent).

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
