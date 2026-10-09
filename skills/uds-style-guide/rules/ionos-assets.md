# IONOS Assets — Illustration & Animation Rules

**`data-brand="ionos"` | Applies to: marketing animations, hero illustrations, showroom assets, Figma frames, Remotion compositions.**

IONOS visual identity is **restraint over decoration**. Assets — whether a static
illustration, a Remotion animation, a marketing hero, or a Figma frame — earn
attention through content (product, motion, type) rather than background
ornament.

---

## Background treatment

- **No technical grid lines.** Do not draw a grid of dots, hairlines,
  blueprint cross-hatches, or any "engineering-paper" texture as background.
  Other brands (especially developer-tool products) lean on grids; IONOS
  deliberately does not.
- **No decorative lines.** No sweeping curves, diagonal accent lines, "circuit
  trace" paths, or geometric line-art behind content. The background is a
  calm surface, not an active element.
- **Solid or gradient only.** Use a flat brand color or a two-stop linear /
  radial gradient between brand hexes (e.g. `#003D8F` → `#001B41`), or a clean
  off-white (`var(--surface-base)`). Use literal hex for brand-scale colours and
  semantic `var(--surface-*)` tokens for surfaces — never Figma `/`-paths like
  `var(--brand/ionos-blue-600)` (not valid CSS). Subtle vignette/radial fade is
  acceptable; explicit lines are not.
- **Content carries the energy.** Motion, color, and product detail should
  earn the viewer's attention — not background ornamentation.

If a brief asks for a "technical feel" or "developer aesthetic", reach for
typography weight, content density, or product-screen detail — not grid lines.

---

## Icon usage

Icons come from `@ionos-web-design-system/icon` — **two tiers, no overlap**:

| Tier | Use for | Rendering |
|---|---|---|
| `system/` | affordances, controls, status indicators, inline UI markers | mono SVG mask, colour via `backgroundColor` |
| `<brand>/` | the product, service or feature the asset is **about** | full-colour, no colour override |

A nav chevron, a checkmark, a settings gear is always `system/`. A "Cloud Backup",
"Domain Guard" or "AI Mail Assistant" motif — the thing the illustration is *for* —
is the brand tier, never a grey `system/` stand-in. The boundary is **role, not size**.

**Import form and available names:** see `remotion-best-practices/rules/shared-uds-icons.md`
for the `svgData` recipe, and the `# Icon name index` in the illustration generator's own
prompt for every name that exists. That index is generated from the installed package —
nothing outside it exists, and everything in it resolves.

**Strictly forbidden:**

- Emoji characters (`✨`, `📦`, `→`, `✔`, etc.) — including as decorative
  accents on buttons, cards, or callouts. They render inconsistently across
  platforms and break brand control.
- Custom inline `<svg>` paths for icon roles. Even a single-glyph SVG for a
  check or close icon is a hard no — use the package.
- Icon names not in that index. Guessing breaks the build.
- Never use `@ts-ignore` on an icon import, or any `dist/` segment in an
  icon path — both are symptoms of a wrong path; fix the path instead.

**Common name confusions to avoid** (these names from other libraries do NOT
exist in this package; use the right-hand column instead — these are the
actual module names, i.e. what appears in the `# Icon name index`, not the
package's camelCase inject-function names, which do not resolve as import
paths):

| Don't write | Use instead |
|-------------|-------------|
| `check` | `checkmark` |
| `close` / `x` / `cross` | `circle-x` (for filled), or a non-circle variant from the `# Icon name index` |
| `edit` / `pencil` | `edit-square` |
| `menu` / `hamburger` | `bars` |
| `eye` / `eyeOff` | `visibility` / `visibility-off` |
| `mail` / `email` | `envelope` |
| `users` (plural) | `user-group` |
| `checkCircle` | `circle-checkmark` |
| `settings` / `cog` | `gear` |

If the icon you need isn't in the package at all (e.g. `filter` — confirmed
missing as of this writing): use a semantic neighbor. For "filter" reach for
`bars` or `gear`. Never improvise an SVG.

---

## Feature-highlight composition

The IONOS pop-out pattern (INPUT pops out from OUTPUT) is a demonstration-wireframe rule: see `uds-wireframe/rules/ionos/feature-pop-out.md`.

## Reserved for future rules

This file is the home for further IONOS-specific asset rules as they're
identified. Planned sections (added as iteration surfaces them):
motion pacing, depth & layering.
