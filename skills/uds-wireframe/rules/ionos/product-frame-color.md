---
name: ionos-wireframe-product-frame
description: Rules for IONOS product frame compositions — product UI wireframe structure, icon imports (brandmark + system), background-driven contrast, and feature pop-out placement.
metadata:
  tags: ionos, wireframe, product-frame, icon, contrast, pop-out, decorative
---

# IONOS Product Frame — Color & Icon Rules

The frame/highlight-card **geometry** (composition rule, content detail rules, contrast rule,
frame layout rules, animated overflow, constrained-viewport cropping, the connector-line
pattern, and the floating-card anatomy) is brand-agnostic and lives in
`shared/frame-anatomy.md`, `shared/constrained-viewport.md`, `shared/connector-line.md`, and
`shared/floating-card.md`. This file holds only the IONOS concrete color values, brandmark
import, and icon rules that those shared geometry files reference semantically (tokens like
`var(--surface-subtle)`, or named colors like "sky" / "steel-blue").

## IONOS Product Frame — Color System (Figma node 65:606)

The product shell and the client-app zone are two visually distinct layers. Never mix their colors.

**Base shell follows `shared/surface-theme.md`; do NOT hardcode a dark panel on a
light render.** The shell's frame/sidebar/panel backgrounds derive from `colorScheme`-resolved
UDS surface tokens, and **light is the default**. Render the dark-navy shell ONLY when
`colorScheme === 'dark'`, or the brief is explicitly decorative/cinematic (see
`ionos/decorative-mode.md`) — a generic "AI feature" or "premium" brief is NOT, by
itself, a dark request.

### Product shell — light default (`colorScheme !== 'dark'`, non-decorative)

| Zone | Background | Icon / text color |
|---|---|---|
| Outer frame | `var(--surface-base)` | — |
| Left tool sidebar | `var(--surface-subtle)` | `var(--text-base)`, 0.8 opacity idle / 1.0 active |
| Right properties panel | `var(--surface-subtlest)` | `var(--text-subtle)` for bars/data, `var(--text-base)` for labels |
| Active sidebar item | next-darker surface tier (e.g. `var(--surface-subtlest)` against a `var(--surface-subtle)` sidebar) | `var(--text-base)` |
| Header action: "Publish" | `#1A91DE` (sky blue fill) — brand CTA, unaffected by scheme | white |
| Header action: "Preview" | transparent + `border: 1px solid var(--border-subtle)` | `var(--text-base)` |

**Decorative/abstract elements inside a light shell:**
- Icon buttons: `var(--text-base)` SVG icons, `opacity: 0.8` idle, `1.0` active
- Property panel rows: `var(--surface-subtlest)` background, bar fill `var(--text-subtle)`
- Analytics / stat indicators: `var(--text-subtle)` for values and bars
- Placeholder bars in the shell: `var(--surface-subtlest)` (neutral cool-grey) — NOT the
  steel-blue-on-dark treatment below, NOT sky `#11C7E6`

### Product shell — dark variant (`colorScheme === 'dark'`, or explicit decorative brief ONLY)

Use this branch only when the composition is genuinely dark-themed or decorative — never as
the default. Values use the defined IONOS palette darks (`ionos-color-palette.md`: Dark
Midnight `#001B41`, Dark Blue `#0B2A63`, Blue Black `#02102B`) rather than invented hex — Dark
Blue is the palette's own "background specifically for the white logo," which is exactly the
sidebar's role here.

| Zone | Background | Icon / text color |
|---|---|---|
| Outer frame | `linear-gradient(180deg, #001B41, #02102B)` | — |
| Left tool sidebar | `linear-gradient(180deg, #001B41, #0B2A63)` | white `rgba(255,255,255,0.8)` |
| Right properties panel | `linear-gradient(180deg, #001B41, #0B2A63)` | `#9DC2D9` for bars/data, white for labels |
| Active sidebar item | `rgba(255,255,255,0.12)` overlay on sidebar | white |
| Header action: "Publish" | `#1A91DE` (sky blue fill) | white |
| Header action: "Preview" | transparent + `border: 1px solid rgba(255,255,255,0.5)` | white |

**Decorative/abstract elements inside the dark shell variant:**
- Icon buttons: white SVG icons, `opacity: 0.8` idle, `1.0` active
- Property panel rows: `background: rgba(63,94,135,0.6)`, bar fill `#9DC2D9`
- Analytics / stat indicators: `#9DC2D9` for values and bars
- All placeholder bars in the shell: `rgba(157,194,217,0.5)` — the steel-blue family, NOT white, NOT sky `#11C7E6`

### Opaque base-plate fallback hex (transparent-root composite styles)

Per `shared/frame-anatomy.md` "Opaque base plate," `product-pop-out` / `device-mockup` interface
surfaces must use `var(--surface-base, <hex>)` — token plus a hardcoded same-scheme fallback,
never a bare token — because the composition root there is transparent and an unresolved token
collapses to see-through. The fallback only fires if the token itself fails to resolve, and it
always matches the current `colorScheme`, so it does not conflict with the "do NOT hardcode a
dark panel on a light render" rule above — the light fallback applies exactly when the light
branch already applies, and the dark fallback applies exactly when the dark branch already
applies:

- **Light default** (`colorScheme !== 'dark'`, non-decorative): `var(--surface-base, #FFFFFF)`
- **Dark variant** (`colorScheme === 'dark'`, or explicit decorative): `var(--surface-base, #001B41)`
  — Dark Midnight, the same hex this file's own dark-shell gradients (outer frame, sidebar, panel
  above) already start from

### Client-app zone (the website being edited)

This is a completely separate inner panel — a real website preview, not tool chrome — so it
keeps its own literal light theme regardless of the shell's `colorScheme`. It must always read
as a distinct layer from the shell:
- **Against the dark shell variant:** contrast is automatic — a light panel on a dark chrome.
- **Against the light shell default:** the shell is light too, so separate by elevation, not
  opposing color — a strong `boxShadow` plus a lighter/whiter surface than the shell's
  `var(--surface-base)`.

```tsx
// Client app zone — visually isolated from the product shell (light shell default:
// separated by elevation/shadow; dark shell variant: separated by light-on-dark contrast)
<div style={{
  background: '#F4F7FA',          // var(--surface-subtle) — the website's own fixed light theme
  borderRadius: 7,
  overflow: 'hidden',
  boxShadow: '2px 12px 26px rgba(0,0,0,0.22), 6px 48px 48px rgba(0,0,0,0.19)',
}}>
  {/* Website header — client's brand color (e.g. teal #436977 for car service) */}
  <div style={{ background: '#436977', height: 44, /* nav bar */ }} />
  {/* Hero: real catalog image, object-fit cover */}
  <Img src={staticFile(`${imageSlug}.png`)} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
  {/* Headline — real text, 24–36px Overpass or brand font */}
  {/* Content rows — Bars in #BCC8D4 (cool-grey-300) */}
</div>
```

**Text placeholder bars in the client app**: `#BCC8D4` (cool-grey-300), NOT white or dark —
fixed, part of the client-app's own light theme in both shell branches.
**AI selection target inside client app**: `border: 2px dashed #8212C2` — the text-selection marquee ONLY. The floating highlight card itself has NO border; it uses a plain neutral drop shadow (no AI glow — the AI glow is on the CTA button only) (see `shared/floating-card.md`).

## IONOS Brandmark Import

Import the `svgData` named export from the sub-path export — **always without `dist/`**:

```tsx
// Panel is white/light (0.88+ opacity) → ionos-light (blue #003d8f, readable on white)
import { svgData as ionosLogoSvg } from '@ionos-web-design-system/icon/brandmark/ionos-light';
// Panel is dark/glass → ionos-dark (white fills, readable on dark)
import { svgData as ionosLogoSvg } from '@ionos-web-design-system/icon/brandmark/ionos-dark';

// Use directly as backgroundImage — svgData is a base64 data URI constant:
<div style={{
  backgroundImage: `url(${ionosLogoSvg})`,
  width: 80, height: 24,
  backgroundSize: 'contain', backgroundRepeat: 'no-repeat',
}} />
```

**Anti-pattern — NEVER do this (webpack will fail, `@ts-ignore` does not fix it):**
```tsx
// ❌ dist/ path is NOT in the package exports map:
import { svgData as ionosDarkSvg } from '@ionos-web-design-system/icon/dist/brandmark/ionos-dark';
// ❌ @ts-ignore suppresses TypeScript errors but webpack still cannot resolve the module:
// @ts-ignore
import { svgData as iconSvg } from '@ionos-web-design-system/icon/dist/system/star';
```
If TypeScript reports an error on an icon import, the **path is wrong** — fix the path, do not add `@ts-ignore`.

**Available brandmark variants for IONOS:**

| Import name | Fills | Use in |
|---|---|---|
| `ionos-dark` | White only (`#fff`) | Nav bar on dark screen (default for decorative) |
| `ionos-light` | Blue (#003d8f) + white | Nav bar on light surface / inverted white panel |
| `ionos-mono-dark` | White mono | Minimal / monochrome nav on dark backgrounds |
| `ionos-cloud-dark` | White "IONOS Cloud" | Cloud product illustrations on dark backgrounds |

**`ionos-light` vs `ionos-dark` — the naming is counterintuitive:**
- `ionos-light` has blue fills → readable on **light/white** backgrounds
- `ionos-dark` has white fills → readable on **dark** backgrounds

Pick the variant per `colorScheme`, not a fixed default (see `shared/surface-theme.md`
"Match the brandmark to the scheme"): the product shell is light by default, so `ionos-light` is
the shell's default brandmark; `ionos-dark` applies only in the dark shell variant.

## AI Icon Usage Guidelines

All 6 IONOS AI icons use **ai-primary gradient fill** (`linear-gradient(45deg, #095BB1, #D746F5)`).
Apply via `background: AI_GRADIENT` + `maskImage` — NOT `backgroundColor` (which gives solid color only).

```tsx
// Gradient-filled AI icon pattern:
<div style={{
  width: 24, height: 24, flexShrink: 0,
  background: 'linear-gradient(45deg, #095BB1, #D746F5)',
  maskImage: `url(${writeSvg})`, WebkitMaskImage: `url(${writeSvg})`,
  maskSize: 'contain', maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat',
}} />
```

| Import name | Use for | Import path |
|---|---|---|
| `filled-sparkles` | **Primary / general AI** — any AI affordance, CTA badge | `icon/system/filled-sparkles` |
| `filled-generative-write` | Text generation, copywriting, AI writer | `icon/system/filled-generative-write` |
| `filled-generative-wand` | Non-text generation, image AI, advanced products | `icon/system/filled-generative-wand` |
| `filled-chat-ai` | AI chat, assistant, conversational products | `icon/system/filled-chat-ai` |
| `filled-envelope-ai` | Email generation, AI email products | `icon/system/filled-envelope-ai` |
| `filled-ai-phone` | AI receptionist, call / phone scenarios | **Not yet in package — use `filled-sparkles` as fallback** |

> `star`, `filled-star` are **not AI icons**. Never use them for AI affordances.

## System Icon Import (non-AI)

Import without `dist/` — sub-path export only. **Do not guess names — webpack will fail.**

**Status / feedback:**
`checkmark` · `filled-checkmark` · `circle-checkmark` · `filled-circle-checkmark` · `info` · `filled-info` · `warning` · `filled-warning` · `xmark`

**Loading / progress:**
`progress-activity` · `filled-progress-activity` · `hourglass` · `filled-hourglass` · `refresh` · `sync`

**Common wireframe:**
`bell` · `bell-ring` · `filled-bell` · `bolt` · `filled-bolt` · `cloud` · `filled-cloud` · `database` · `document` · `download` · `edit-square` · `gear` · `filled-gear` · `lightbulb` · `lightbulb-shining` · `lock` · `filled-lock` · `pen` · `performance` · `plus` · `search` · `server` · `filled-server` · `upload` · `user` · `user-avatar` · `filled-user` · `arrow-right` · `chevron-right`

**Rule:** If a name is not listed above, pick the closest match. Never guess.
