# Wireframe Notes — Without Skill (Baseline)

## Approach

Built from general knowledge of React and @ionos-web-design-system without any skill guidance.

## Component Choices

- `ThemeProvider` — wraps the app with brand/platform/colorScheme props (guessed as `ionos`, `web`, `light`)
- `Surface` — used as a top-level container; unsure if this is the correct semantic usage
- `Text` — used for headline and body copy; variant names (`headline-l`, `headline-xs`, `body-m`, `body-s`) were guessed from common design system conventions
- `TextInput` — used for email and password fields; prop names (`label`, `type`, `placeholder`, `name`) guessed
- `Button` — used for form submit; `variant="primary"` and `fullWidth` guessed

## Uncertainties / Likely Errors

1. **Text variants** — Names like `headline-l`, `headline-xs`, `body-m`, `body-s` are guesses. The real UDS may use different naming conventions (e.g. `display-l`, `copy-s`, or numerical scales).
2. **TextInput props** — The `label` prop pattern is assumed; the real component may require a separate `<Label>` element or use `id`/`htmlFor` associations.
3. **Button props** — `fullWidth` is a common pattern but may not exist; could be `block`, `stretch`, or a CSS approach instead.
4. **ThemeProvider prop names** — `brand`, `platform`, `colorScheme` are guesses; actual API could differ (e.g. `data-brand`, `data-platform` as HTML attributes rather than React props).
5. **Surface usage** — Unsure if `Surface` is a layout container or purely a visual/semantic component. May need a different wrapper.
6. **No icon components used** — Used emoji placeholders instead of the actual UDS icon library (e.g. `@ionos-web-design-system/icons`), since the correct import path and component API were unknown.
7. **Hero image path** — Used an absolute local file path directly in `src`. In a real app this would need to be a public URL or a bundler-resolved import.

## Layout Decisions

- Hero image uses `objectFit: cover` at a fixed 480px height — fills the top of the page
- 2-column grid uses raw CSS Grid via inline styles (no UDS layout primitives used, as their API was unknown)
- Padding/gap values are arbitrary; a skill would guide using design tokens instead (e.g. `--spacing-24`)
