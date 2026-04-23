# CSS Import Order Rules

Detailed import order rules for every UDS project scenario. The CSS entry file
(typically `index.css` or `globals.css`) is the single source for all CSS
imports.

## Golden Rule

**Never import UDS CSS in JS/TS files.** All `@import` statements go in the CSS
entry file.

## Import Order

The order is strict — misordering causes tokens to fail silently:

1. `@import 'tailwindcss'` — Must be FIRST
2. Brand CSS — `@ionos-web-design-system/core/brands/{brand}`
3. Platform CSS — `@ionos-web-design-system/core/platforms/{platform}`
4. React component styles — `@ionos-web-design-system/react/style.css`
5. App-specific styles

## Single-Brand Production

Import only the specific brand and platform for smaller bundle size:

```css
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/ionos';
@import '@ionos-web-design-system/core/platforms/comfortable';
@import '@ionos-web-design-system/react/style.css';
```

## Multi-Brand Development

Use wildcards for runtime theme switching during development:

```css
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/*';
@import '@ionos-web-design-system/core/platforms/*';
@import '@ionos-web-design-system/react/style.css';
```

**Warning:** Never use wildcards in production — they include all 8 brands and 2
platforms, significantly increasing bundle size.

## With Icons

Icons are SVG inject functions — they do NOT require CSS imports:

```bash
npm install @ionos-web-design-system/icon
```

```tsx
import { plus } from '@ionos-web-design-system/icon/system';
// Use: icon={plus}
```

## Next.js Projects

In Next.js, the CSS entry file is typically `app/globals.css` or
`styles/globals.css`:

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/ionos';
@import '@ionos-web-design-system/core/platforms/comfortable';
@import '@ionos-web-design-system/react/style.css';
```

Import it in `app/layout.tsx`:

```tsx
import './globals.css';
```

## Vite Projects

The CSS entry file is typically `src/index.css`. Import it in `src/main.tsx`:

```tsx
import './index.css';
```

Do NOT put `@import 'tailwindcss'` in `vite.config.ts` — it belongs in the CSS
file.

## Common Mistakes

| Mistake                                                      | Fix                                                      |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| `@import 'tailwindcss'` after brand CSS                      | Move Tailwind import to first position                   |
| Missing `react/style.css` import                             | Add `@import '@ionos-web-design-system/react/style.css'` |
| CSS imports in `App.tsx`                                     | Move all CSS imports to the CSS entry file               |
| Wildcard imports in production                               | Use specific brand/platform imports                      |
| `@tailwind base; @tailwind components; @tailwind utilities;` | Replace with `@import 'tailwindcss'` (v4 syntax)         |
