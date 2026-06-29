# home.pl Brand

**`data-brand="homepl"` | Font: Azo Sans | Market: Poland**

## CSS Import

```css
@import '@ionos-web-design-system/core/brands/homepl';
```

## Typography

| Role | Font | Weight scale | CSS Token |
|------|------|-------------|-----------|
| Headings | Azo Sans | Light (300) / Bold (400) / Black (500) | `--font-title` |
| Body | Azo Sans | Light (300) / Bold (400) | `--font-base` |

Azo Sans is a commercial geometric sans-serif. Files are bundled in the remotion-starter template; loaded automatically via `loadBrandFonts()`. Not available on Google Fonts.

---

## Brand Personality

home.pl is Poland's leading web hosting and domain registrar — a **warm, trusted SMB partner**. The brand identity is built around reliability and approachability, not technical coolness. Where IONOS leans "Professional Blue" and Strato leans "Energetic Orange", home.pl leans **"Warm SMB Red"**: serious enough to trust with your business, human enough to feel accessible.

The red is not aggressive or alarming — it is warm, confident, and Polish. It signals pride of place in the market without shouting.

---

## Color Palette

All hex values are sourced from the compiled `homepl.light.css` token file (OKLCH → sRGB conversion). Figma style paths listed as reference only — not CSS variables.

### Red — Brand Identity Anchor

| Token | Name | HEX | Role |
|-------|------|-----|------|
| R7 | Brand Red | `#E20000` | Logo, primary CTAs, sole brand colour anchor |
| R6 | Light Red | `#FF2A2A` | Hover / interactive highlight state |
| R5 | Soft Red | `#FD5D5D` | Active/pressed state, soft indicator fill |
| — | Red surface tint | `#FDF6F6` | Warm card background, highlight surface |

**The red is the entire brand colour language.** There is no brand blue, no brand orange. Red does all the work — used sparingly as a single accent, never as a background wash.

### Grey / Neutral Scale

| Token | Name | HEX | Role |
|-------|------|-----|------|
| K9 | Home Black | `#1B1B1B` | Primary body text, deep elements |
| K6 | Home Gray (dark) | `#2E3842` | Dark sections, nav, footer |
| K7 | Dark Grey | `#515D6C` | Secondary text on light backgrounds |
| K5 | Mid Grey | `#768494` | Captions, placeholder text, borders |
| K3 | Disabled | `#DEE5ED` | Disabled backgrounds, dividers |
| K2 | Light Grey | `#EBEFF4` | Card backgrounds, subtle section fills |
| K1 | Background | `#F5F7FA` | Default page background |
| — | White | `#FFFFFF` | Surfaces, card backgrounds |

> The neutral scale has a **slight cool blue-grey cast** (hue ~250°). This is intentional — it keeps the brand clean and professional. Warmth is delivered by the red alone, not by warm-toned greys.

---

## Color Usage Rules

**DO**
- Use `#E20000` (Brand Red) as the sole brand colour anchor — logos, primary buttons, one key accent per composition
- Use `#F5F7FA` (K1) as the default page background
- Use `#1B1B1B` (K9) for primary text — soft near-black, warmer than pure `#000000`
- Apply `#FDF6F6` for card highlights and hover tints that need subtle warmth
- Keep red restrained — one prominent element per layout, never a background wash

**DON'T**
- Never use red as a fill background — it reads as error/danger signal
- Don't mix warm-toned greys with the cool neutral scale — the blue-grey cast is structural
- Don't use `#E20000` for body text — it fails contrast at normal text sizes
- Don't add a second brand colour — home.pl has no brand blue or orange

---

## Contrast-Approved Combinations

| Foreground | Background | Usage |
|------------|------------|-------|
| `#FFFFFF` | `#E20000` Brand Red | Button labels — ✓ AA |
| `#FFFFFF` | `#2E3842` Home Gray | Dark section text — ✓ AA |
| `#FFFFFF` | `#1B1B1B` Home Black | Dark surface text — ✓ AA |
| `#1B1B1B` | `#FFFFFF` | Standard body text — ✓ AA |
| `#1B1B1B` | `#F5F7FA` K1 | Body text on page background — ✓ AA |
| `#1B1B1B` | `#EBEFF4` K2 | Text on card background — ✓ AA |
| `#E20000` | `#FFFFFF` | Large heading accent — ✓ AA (large text only) |

---

## Quick Summary — Primary Brand Colors

| Color | HEX | Role |
|-------|-----|------|
| Brand Red | `#E20000` | Logo, CTA, the sole brand colour anchor |
| Light Red | `#FF2A2A` | Hover / interactive states |
| Background | `#F5F7FA` | Default page surface |
| Dark text | `#1B1B1B` | Primary text (soft near-black) |
| Dark sections | `#2E3842` | Nav, footer, dark UI areas |

---

## Component Notes

- `CardTariff` with `underTitle` prop and `size="full"` is **only supported on the homepl brand** — do not use this combination on other brands.
