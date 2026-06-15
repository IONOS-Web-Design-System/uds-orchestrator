# IONOS Color Palette

**`data-brand="ionos"` | Source: IONOS Style Guide Version 2.2 — Basic Palette (Figma node 55:20276)**

Color distinguishes the IONOS brand and enables a consistent experience across marketing and products. Use color purposefully, rationally, and in service of the content's purpose. AA contrast compliance is required at all times.

---

## Primary Palette

These colors are always available and form the foundation of every IONOS design.

| Name | Code | HEX | Figma path (ref) | Usage |
|------|------|-----|-----------|-------|
| IONOS Blue | B6 | `#003D8F` | `--brand/ionos-blue-600` | Logo, primary brand anchor. Frames the brand together with Dark Midnight. |
| Sky | S3 | `#11C7E6` | `--brand/ionos-sky-300` | Brand CTA, bold accents. Adds boldness and vibrance — use to direct eyes. |
| Dark Blue | B7 | `#0B2A63` | `--brand/ionos-blue-700` | Background specifically for the white logo. |
| Dark Midnight | B8 | `#001B41` | `--brand/ionos-blue-800` | Primary text color for screen. |
| Cloud | C1 | `#F4F7FA` | `--neutral/cool-grey-100` | Light backgrounds, subtle containers. |

### Supporting Darks

Used for gradients, deep backgrounds, and print contexts.

| Name | Code | HEX | Figma path (ref) | Usage |
|------|------|-----|-----------|-------|
| Blue Black | B9 | `#02102B` | `--brand/ionos-blue-900` | Base of the basic blue gradient. |
| Cool Black | C9 | `#0A121C` | `--neutral/cool-grey-900` | Deeper black for print work. |
| Black | — | `#000000` | — | Text for print only. |
| White | — | `#FFFFFF` | `--neutral/white` | Standard white. |

---

## Secondary Palette

> **Note: Use of secondary colors only with prior approval.**

Supplementary colors that provide flexibility and playfulness. Use to sprinkle in warmth and fun — but only with extreme care. Restraint is required.

When using secondary colors:
- The surrounding environment must guarantee high-level brand awareness (primary colors should dominate the composition)
- Control the number of secondary colors and their proportion
- Combine with the primary palette
- Ensure colors support the content hierarchy

| Name | Code | HEX | Figma path (ref) | HSL |
|------|------|-----|-----------|-----|
| Amber | Y3 | `#FFAA00` | `--utility/yellow-300` | 40° 100% 50% |
| Purple | P4 | `#D746F5` | `--utility/purple-400` | 290° 90% 62% |
| Green | G3 | `#12CF76` | `--utility/green-300` | 152° 84% 44% |
| Rose | R3 | `#FF6159` | `--utility/red-300` | 3° 100% 67% |

---

## Color Hierarchy Rules

1. **Lead with IONOS Blue and Dark Midnight** — these anchor the brand and communicate trust.
2. **Use Sky sparingly to create energy** — it's effective precisely because it contrasts the deep blues. Overusing it loses the effect.
3. **Cloud and White are backgrounds**, not brand colors — they provide breathing room.
4. **Secondary colors need a reason** — they work when the environment already feels unmistakably IONOS. Don't use them to make a composition "more interesting."

## DO / DON'T

**DO:**
- Pair IONOS Blue with White or Cloud for maximum legibility
- Use Dark Midnight (`#001B41`) for body text on screen — it's softer than pure black and on-brand
- Use Sky for one focal point CTA per composition
- Test all text/background combinations for WCAG AA (4.5:1 for normal text, 3:1 for large)

**DON'T:**
- Use secondary colors without brand context (they look out-of-place without the blue palette around them)
- Hard-code hex values in code — always use the CSS token so theming works
- Mix multiple secondary colors in one composition
- Use IONOS Blue as a text color on a white background without checking contrast (it passes AA for large text only)

## Using these colours in code

The `Figma path (ref)` column above (`brand/ionos-blue-600`, `neutral/white`, …) is **Figma hierarchy
notation — NOT a CSS variable.** `@ionos-web-design-system/core` exposes only **semantic** custom
properties (`--surface-*`, `--text-*`, `--border-*`, `--surface-semantic-*`); there is no
`--brand/...` or `--brand-...` CSS variable. Writing `var(--brand/ionos-blue-600)` is a CSS parse
error (the `/`), so the declaration is dropped and the element renders unstyled.

Two valid options — a **semantic core token** for UI roles, or the **literal hex** for a specific
brand-scale colour:

```css
/* ✅ Semantic core tokens (resolve per brand under ThemeProvider/data-brand) */
.cta-button   { background-color: var(--surface-base-invert); color: var(--text-base-invert); }
.body-text    { color: var(--text-base); }

/* ✅ Literal hex for a specific brand-scale colour (there is no core var for it) */
.brand-panel  { background: #003D8F; color: #fff; }
.hero-background { background: linear-gradient(#02102B, #001B41); }

/* ❌ Figma paths are not CSS variables — declaration dropped, element unstyled */
.bad { background-color: var(--brand/ionos-blue-600); color: var(--neutral/white); }
```

Always pair a `--surface-*` background with its matching `--text-*` foreground so contrast holds.
For Tailwind mappings and component-level implementation, see `uds-usage-best-practices`.

For Tailwind CSS mappings and component-level implementation, see `uds-usage-best-practices`.
