# Wireframe Notes — HeroFeatureGridWireframe

## Key Decisions

The hero section uses `ThemeInverter` wrapping a `Surface` to flip UDS semantic tokens, producing white text on the dark gradient without hard-coding text colors — this is the correct UDS pattern for dark-background sections. The gradient itself is applied inline using CSS variables (`--brand/ionos-blue-900` → `--brand/ionos-blue-800`) per the IONOS color palette guide, which describes this combination as the canonical "basic blue gradient" for deep backgrounds. The Sky (`--brand/ionos-sky-300`) token is used sparingly: once on the eyebrow label in the hero and once on the pricing callout in each card, following the palette rule that Sky should appear at one focal point per composition. Both headline elements use `var(--base/font/heading)` (Overpass) for impact, while body copy and button text inherit the default Open Sans body token.

## Component and Layout Choices

A `NavigationBar` is included above the hero so the wireframe communicates full-page context. The three feature cards use the UDS `Card` component with an inline icon-placeholder div (styled with IONOS Blue) in lieu of actual product icons, since icon name verification against `icon-names.json` was skipped for this wireframe illustration. The card grid is a plain Tailwind `grid-cols-3` rather than a UDS grid primitive, which is appropriate here given the fixed three-up layout. No animations were added because the prompt did not request them; the skill asks to confirm before generating animations.
