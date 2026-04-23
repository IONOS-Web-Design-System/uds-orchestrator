# Theme System

UDS uses a 3D theming matrix: **Brand × Platform × Color Scheme**. Every design
token resolves based on the active combination, producing 24 total theme states.

## The Theming Matrix

| Dimension        | Options                                                          | Controls                        |
| ---------------- | ---------------------------------------------------------------- | ------------------------------- |
| **Brand**        | ionos, strato, fasthosts, homepl, strefa, udag, world4you, arsys | Colors, fonts, brand identity   |
| **Platform**     | comfortable, compact                                             | Spacing, sizing, density        |
| **Color Scheme** | light, dark                                                      | Surface and text color palettes |

## HTML Attribute Setup

Set all three attributes on the root element:

```html
<html
  data-brand="ionos"
  data-platform="comfortable"
  data-color-scheme="light"
></html>
```

Both attribute syntaxes are supported by the selectors:

```css
/* Both match: */
[data-brand="ionos"] .element { ... }
[brand="ionos"] .element { ... }
```

Pick one syntax and use it consistently throughout your project.

## Token Resolution Flow

```
Design Tokens (source)
    ↓
themes/interpreter (transforms + resolves)
    ↓
packages/core (CSS custom properties)
    ↓
Framework packages (React / Web Components)
```

Design tokens are extracted from the source files, processed through the
interpreter which resolves aliases and applies transforms, then compiled into
CSS custom properties scoped by `data-*` attribute selectors.

## Color Space

All color tokens use the **OKLch** color space. OKLch provides perceptually
uniform lightness, making it ideal for generating accessible color palettes
across brands and color schemes.

```css
/* Tokens resolve to OKLch values */
--surface-base: oklch(0.99 0.005 250);
```

## ThemeProvider (React)

The React package provides a `ThemeProvider` component that manages theme
attributes:

```tsx
import { ThemeProvider } from '@ionos-web-design-system/react';

<ThemeProvider brand="ionos" platform="comfortable" colorScheme="light">
  <App />
</ThemeProvider>;
```

`ThemeProvider` sets the `data-brand`, `data-platform`, and `data-color-scheme`
attributes on the root element. Changing props triggers an immediate token
update across the entire UI.

## Runtime Switching

Tokens update instantly when attributes change — no page reload or rebuild
needed:

```javascript
document.documentElement.dataset.brand = 'strato';
document.documentElement.dataset.colorScheme = 'dark';
```

## 32 Theme Combinations

Every combination of 8 brands × 2 platforms × 2 color schemes is fully
supported. Tokens are generated for all 32 combinations during the build step.
Example combinations:

- `ionos` + `comfortable` + `light`
- `strato` + `compact` + `dark`
- `fasthosts` + `comfortable` + `dark`

## Best Practices

**DO:**

- Set all three attributes (`data-brand`, `data-platform`, `data-color-scheme`)
  on the HTML root.
- Use `ThemeProvider` in React applications.
- Test components in multiple theme combinations.

**DON'T:**

- Mix attribute syntaxes (`data-brand` and `brand`) in one project.
- Hardcode color values — use tokens so themes work automatically.
- Forget to set a color scheme — components rely on it for contrast.
