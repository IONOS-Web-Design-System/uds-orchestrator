# IONOS Color Palette

**`data-brand="ionos"` | Source: IONOS Style Guide Version 2.2 — Basic Palette (Figma node 55:20276)**

Color distinguishes the IONOS brand and enables a consistent experience across marketing and products. Use color purposefully, rationally, and in service of the content's purpose. AA contrast compliance is required at all times.

---

## Primary Palette

These colors are always available and form the foundation of every IONOS design.

| Name | Code | HEX | CSS Token | Usage |
|------|------|-----|-----------|-------|
| IONOS Blue | B6 | `#003D8F` | `--brand/ionos-blue-600` | Logo, primary brand anchor. Frames the brand together with Dark Midnight. |
| Sky | S3 | `#11C7E6` | `--brand/ionos-sky-300` | Brand CTA, bold accents. Adds boldness and vibrance — use to direct eyes. |
| Dark Blue | B7 | `#0B2A63` | `--brand/ionos-blue-700` | Background specifically for the white logo. |
| Dark Midnight | B8 | `#001B41` | `--brand/ionos-blue-800` | Primary text color for screen. |
| Cloud | C1 | `#F4F7FA` | `--neutral/cool-grey-100` | Light backgrounds, subtle containers. |

### Supporting Darks

Used for gradients, deep backgrounds, and print contexts.

| Name | Code | HEX | CSS Token | Usage |
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

| Name | Code | HEX | CSS Token | HSL |
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

## CSS Token Usage in Code

When implementing in a project with `@ionos-web-design-system/core`:

```css
/* Use CSS custom properties — never hard-code hex values */
.cta-button {
  background-color: var(--brand/ionos-blue-600);  /* IONOS Blue */
  color: var(--neutral/white);
}

.hero-background {
  background: linear-gradient(
    var(--brand/ionos-blue-900),  /* Blue Black */
    var(--brand/ionos-blue-800)   /* Dark Midnight */
  );
}
```

For Tailwind CSS mappings and component-level implementation, see `uds-usage-best-practices`.
