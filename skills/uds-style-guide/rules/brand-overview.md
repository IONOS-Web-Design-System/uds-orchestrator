# Brand Overview — All 8 Brands

The UDS supports 8 brands across the IONOS Group. Each brand targets a different market and carries a distinct personality, but all share the same component library and token system. The active brand is set via `data-brand` on the root element and controls which CSS tokens are resolved.

## Brand × Font Mapping

Fonts are set via `--font-base` (body) and `--font-title` (heading) CSS tokens.

| Brand | `data-brand` | `--font-base` | `--font-title` | Market |
|-------|-------------|--------------|----------------|--------|
| IONOS | `ionos` | Open Sans | Overpass | Primary brand, international |
| Strato | `strato` | Poppins | Poppins | Germany / Europe |
| Fasthosts | `fasthosts` | AntennaCond ⚠ | AntennaCond ⚠ | United Kingdom |
| home.pl | `homepl` | Azo Sans ⚠ | Azo Sans ⚠ | Poland |
| Strefa | `strefa` | Montserrat | Montserrat | Poland (sub-brand) |
| UDAG | `udag` | Inter | Inter | Germany |
| World4You | `world4you` | Inter | Satoshi | Austria |
| Arsys | `arsys` | Open Sans | FS Blake ⚠ | Spain |

⚠ Proprietary/commercial fonts — not available via Google Fonts; must be self-hosted.

## CSS Import per Brand

```css
@import '@ionos-web-design-system/core/brands/ionos';
@import '@ionos-web-design-system/core/brands/strato';
@import '@ionos-web-design-system/core/brands/fasthosts';
@import '@ionos-web-design-system/core/brands/homepl';
@import '@ionos-web-design-system/core/brands/strefa';
@import '@ionos-web-design-system/core/brands/udag';
@import '@ionos-web-design-system/core/brands/world4you';
@import '@ionos-web-design-system/core/brands/arsys';
```

## Brand Activation

All brand switching happens at runtime via the HTML attribute — no code changes required:

```html
<!-- Root level -->
<html data-brand="strato">

<!-- Sub-tree level (component isolation) -->
<div data-brand="fasthosts">...</div>
```

```js
// Dynamic switching
document.documentElement.dataset.brand = 'homepl';
```

## Brand Documentation Status

| Brand | Colors | Typography | Identity Principles | Figma Source |
|-------|--------|------------|---------------------|--------------|
| ionos | ✓ Full | ✓ Full | ✓ Full | Style Guide v2.2 |
| strato | — | Font only | — | Needed |
| fasthosts | — | Font only | — | Needed |
| homepl | — | Font only | — | Needed |
| strefa | — | Font only | — | Needed |
| udag | — | Font only | — | Needed |
| world4you | — | Font only | — | Needed |
| arsys | — | Font only | — | Needed |

To complete a brand stub, pull its Figma style guide and populate the corresponding `rules/{brand}.md` file following the IONOS files as a template.

## What Differs Per Brand

Every brand controls these token layers independently:

- **Brand colors** — primary, secondary, accent palette (resolved by `data-brand`)
- **Typography** — font family for headings and body (see table above)
- **Component variants** — some components have brand-specific behavior (e.g., `CardTariff`'s `underTitle` prop only applies to `homepl`)

What stays consistent across all brands:

- **Token names** — `--brand/primary`, `--brand/surface`, etc. resolve to different values per brand but the names are identical
- **Spacing and layout** — controlled by `data-platform` (comfortable / compact), not by brand
- **Color scheme** — controlled by `data-color-scheme` (light / dark), not by brand
- **Component API** — same props across all brands unless explicitly noted
