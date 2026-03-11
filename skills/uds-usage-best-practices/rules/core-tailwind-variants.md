# Tailwind Theme Variants

UDS provides custom Tailwind variants for conditional styling based on the
active brand, platform, or color scheme. These variants use `data-*` attribute
selectors and work at both the element level and ancestor level.

## Brand Variants

Apply styles only when a specific brand is active:

| Variant      | Matches                  |
| ------------ | ------------------------ |
| `ionos:`     | `data-brand="ionos"`     |
| `strato:`    | `data-brand="strato"`    |
| `fasthosts:` | `data-brand="fasthosts"` |
| `homepl:`    | `data-brand="homepl"`    |
| `strefa:`    | `data-brand="strefa"`    |
| `udag:`      | `data-brand="udag"`      |
| `world4you:` | `data-brand="world4you"` |
| `arsys:`     | `data-brand="arsys"`     |

## Platform Variants

Apply styles based on the active platform:

| Variant        | Matches                       |
| -------------- | ----------------------------- |
| `comfortable:` | `data-platform="comfortable"` |
| `compact:`     | `data-platform="compact"`     |

## Color Scheme Variants

Apply styles based on light or dark mode:

| Variant  | Matches                     |
| -------- | --------------------------- |
| `light:` | `data-color-scheme="light"` |
| `dark:`  | `data-color-scheme="dark"`  |

**WARNING:** The `dark:` variant overrides Tailwind's built-in dark mode
variant. It only responds to the `data-color-scheme="dark"` attribute — not
`@media (prefers-color-scheme: dark)` and not the `.dark` CSS class. This is
intentional for consistency with the UDS theme system.

## Usage Examples

### Brand-specific styling

```html
<button class="ionos:bg-blue-500 strato:bg-green-500 fasthosts:bg-purple-500">
  Brand-aware button
</button>
```

### Platform-responsive density

```html
<div class="comfortable:p-6 compact:p-3 comfortable:gap-4 compact:gap-2">
  Adapts spacing to platform
</div>
```

### Color scheme styling

```html
<div class="light:bg-white light:text-black dark:bg-gray-900 dark:text-white">
  Theme-aware container
</div>
```

### Combined variants

```tsx
<Button className="ionos:bg-blue-500 strato:bg-green-500 compact:text-sm comfortable:text-base hover:opacity-90 dark:ring-2 dark:ring-white">
  Multi-variant button
</Button>
```

Variants compose freely with each other and with standard Tailwind variants like
`hover:`, `focus:`, `sm:`, etc.

## Setup

### Tailwind v4

Works out of the box after importing brand and platform CSS:

```css
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/*';
@import '@ionos-web-design-system/core/platforms/*';
```

The `@variant` directives are included in the imported CSS files — no
configuration needed.

### Tailwind v3

Use the `udsTokens` plugin, which includes both tokens and variant definitions:

```javascript
import udsTokens from '@ionos-web-design-system/core/plugin/udsTokens';

export default {
  plugins: [udsTokens({ brand: 'ionos', platform: 'comfortable' })],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
};
```

No separate variant import is needed — the unified plugin handles everything.

## Selector Pattern

Each variant generates a single `:is()` selector that matches both the element
itself and any descendant of a themed container:

```css
/* Generated selector for ionos: variant (Tailwind v4) */
@variant ionos (&:is([brand="ionos"], [data-brand="ionos"], [brand="ionos"] *, [data-brand="ionos"] *));
```

This selector matches:

- An element with `brand="ionos"` or `data-brand="ionos"` directly
- Any descendant (`*`) of an element with either attribute

This means variants work when the attribute is on the HTML root (global
theming), on the element itself, or on any ancestor wrapper (local theming with
`ThemeProvider` or `ThemeInverter`).

**Note:** Both bare `brand` and `data-brand` attributes are supported. Platform
variants check `platform`/`data-platform`, and color scheme variants check
`color`/`data-color-scheme`.

### Tailwind v3 Selector Pattern

In the v3 plugin, variants use a multi-selector array instead of a single
`:is()`:

```javascript
addVariant('ionos', [
  '&:is([brand="ionos"], [data-brand="ionos"])',
  '[brand="ionos"] &',
  '[data-brand="ionos"] &',
]);
```

## Best Practices

**DO:**

- Use brand variants for brand-specific visual tweaks that tokens alone cannot
  express.
- Use platform variants for density adjustments beyond what spacing tokens
  provide.
- Combine UDS variants with standard Tailwind pseudo-class variants.

**DON'T:**

- Rely on `@media (prefers-color-scheme: dark)` — use the `dark:` variant
  instead.
- Apply the `.dark` CSS class expecting it to activate `dark:` styles — it will
  not.
- Use brand variants as a replacement for design tokens — tokens handle most
  cases automatically.
