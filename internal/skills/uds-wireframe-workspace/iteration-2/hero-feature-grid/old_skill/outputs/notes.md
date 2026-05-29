# Baseline Run Notes — Old Skill (iteration-2 / hero-feature-grid)

## Skill files used
- `skills/uds-wireframe/SKILL.md`
- `skills/uds-wireframe/rules/wireframe-asset-integration.md`
- `skills/uds-wireframe/rules/wireframe-micro-animations.md`
- `wireframe-composition.md` was explicitly excluded (updated file, not part of old baseline)

## What was generated
`HeroFeatureGridWireframe.tsx` — a single renderable React/TSX wireframe with:

### Hero section
- Dark background using `var(--brand/ionos-blue-900, #003d8f)` via inline `style` prop
- Headline styled with Overpass (per IONOS brand typography rule in SKILL.md)
- Subline styled with Open Sans (body copy font)
- Primary `<Button variant="primary" size="large">` CTA
- Entrance fade-in animation (`hero-enter` keyframe, 0.5s ease-out) applied to the hero content block

### Feature card row
- Three `<Card>` components in a `grid-cols-3` responsive grid
- Cards: Web Hosting, VPS, Domains — each with icon placeholder div, title, description, secondary CTA button
- Staggered card entrance animation (80 ms delay per card) per `wireframe-micro-animations.md` pattern
- Hover lift (`hover:-translate-y-1 hover:shadow-lg`) on each card per the same rule

## Skill gaps observed (old version, pre-fix)

1. **No `wireframe-composition.md`** — The old skill had no dedicated composition rule file being read. The SKILL.md mentions it in section "Wireframe Composition Rules" but that file was the one updated in the fix. Without it, the model has no explicit guidance on:
   - Which `<Surface>` `data-color-scheme` values to use (dark vs light vs inverted)
   - Whether `ThemeProvider` needs `data-platform` and `data-color-scheme` at root
   - Grid column patterns, section spacing conventions
   - When to use `<NavigationBar>` vs a custom header

2. **Hero dark background via inline style, not tokens** — Because the composition rule was absent, the hero dark background was achieved with an inline `style` prop (`background: var(--brand/ionos-blue-900, #003d8f)`). A proper composition rule would specify using `<Surface data-color-scheme="dark">` with the theme's built-in dark surface color instead of an ad-hoc CSS variable reference.

3. **`data-color-scheme` on `<Surface>` may be incorrect** — `data-color-scheme` is typically a root attribute on `ThemeProvider` or the HTML element, not on individual `<Surface>` instances. The old skill had no rule clarifying this, leading to potentially incorrect attribute placement.

4. **No `ThemeProvider` root attributes beyond `brand`** — The output wraps everything in `<ThemeProvider brand="ionos">` but does not set `data-platform` (e.g., `"web"`) or `data-color-scheme` at root level. The new `wireframe-composition.md` likely clarifies this.

5. **Icon placeholder uses emoji instead of UDS `<Icon>` component** — The `wireframe-asset-integration.md` fallback pattern uses the UDS `<Icon>` component. Without a composition rule enforcing consistent placeholder patterns, the model defaulted to emoji characters in the icon slot.

## Animation approach
Followed `wireframe-micro-animations.md` exactly: CSS keyframes for entrance (section-level, not per-element), hover lift on interactive cards only. No Remotion needed — all interactions are momentary UI effects.

## Image approach
No images were requested/provided. Per `wireframe-asset-integration.md`, no placeholder image divs were added because there was no natural image slot in the described layout (hero is text + CTA, not a photo hero). If a hero photo were needed, the `relative/absolute overlay` pattern from the asset integration rule would apply.
