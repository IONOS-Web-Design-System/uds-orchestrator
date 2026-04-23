# Advanced Project Setup

Details for CSS import optimization, Tailwind v3, `useTheme` hook, and component
conventions. Referenced from SKILL.md section 3.

## CSS Import Optimization (Single Brand)

When deploying for a single brand, import only that brand and platform CSS:

| Brand       | CSS Import                                       |
| ----------- | ------------------------------------------------ |
| `ionos`     | `@ionos-web-design-system/core/brands/ionos`     |
| `strato`    | `@ionos-web-design-system/core/brands/strato`    |
| `fasthosts` | `@ionos-web-design-system/core/brands/fasthosts` |
| `homepl`    | `@ionos-web-design-system/core/brands/homepl`    |
| `strefa`    | `@ionos-web-design-system/core/brands/strefa`    |
| `udag`      | `@ionos-web-design-system/core/brands/udag`      |
| `world4you` | `@ionos-web-design-system/core/brands/world4you` |
| `arsys`     | `@ionos-web-design-system/core/brands/arsys`     |

| Platform      | CSS Import                                            |
| ------------- | ----------------------------------------------------- |
| `comfortable` | `@ionos-web-design-system/core/platforms/comfortable` |
| `compact`     | `@ionos-web-design-system/core/platforms/compact`     |

## Tailwind v3 Setup

For projects using Tailwind v3, use the unified plugin:

```javascript
import udsTokens from '@ionos-web-design-system/core/plugin/udsTokens';

export default {
  plugins: [udsTokens({ brand: 'ionos', platform: 'comfortable' })],
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
};
```

## useTheme Hook

Access current theme values anywhere inside the ThemeProvider tree:

```tsx
import { useTheme } from '@ionos-web-design-system/react/theme-provider';

function MyComponent() {
  const { brand, platform, color } = useTheme();
  return <p>Current brand: {brand}</p>;
}
```

## Component Conventions

All UDS React components follow these patterns:

- **CSS custom properties** — Every component reads visual tokens from core. No
  hardcoded values.
- **Ref forwarding** — All components forward refs to their root DOM element.
- **Polymorphic rendering** — Components with `asChild` render their child
  element instead of the default wrapper, passing all props and behavior
  through.
