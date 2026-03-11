# Common Setup Failures & Troubleshooting

Solutions for the most frequently encountered UDS setup issues.

## Tokens Not Resolving

**Symptom:** UDS token classes (`bg-surface-base`, `text-muted`) have no effect.
Elements appear unstyled or use browser defaults.

**Causes & Fixes:**

1. **Missing brand/platform CSS import**
   - Verify `@import '@ionos-web-design-system/core/brands/{brand}'` is in the CSS entry file
   - Verify `@import '@ionos-web-design-system/core/platforms/{platform}'` is present

2. **Wrong import order**
   - `@import 'tailwindcss'` MUST come before UDS imports
   - Brand CSS must come before platform CSS
   - Both must come before `react/style.css`

3. **Missing `data-*` attributes on `<html>`**
   - Tokens resolve based on `data-brand`, `data-platform`, `data-color-scheme`
   - Check with: `document.documentElement.dataset`
   - If all three are missing, no tokens will resolve

4. **CSS imports in JS instead of CSS**
   - UDS CSS must be imported in the CSS entry file, not in `App.tsx` or `main.tsx`
   - Move imports to `index.css` or `globals.css`

## Component Styles Missing

**Symptom:** UDS components render but look unstyled (no padding, no colors,
raw HTML appearance).

**Causes & Fixes:**

1. **Missing `react/style.css` import**
   - Add `@import '@ionos-web-design-system/react/style.css'` to CSS entry file
   - Must come AFTER brand and platform imports

2. **Missing `ThemeProvider`**
   - UDS components require `ThemeProvider` as an ancestor
   - Wrap your app root: `<ThemeProvider>...</ThemeProvider>`

## Borders Not Working (v4)

**Symptom:** `border-base` class has no visible effect in Tailwind v4.

**Fix:** Use double-dash convention: `border--base` (not `border-base`).

```tsx
// Wrong (v3 syntax)
<div className="border border-base">

// Correct (v4 syntax)
<div className="border border--base">
```

## `text-base` Confusion

**Symptom:** Using `text-base` expecting font-size styling, but getting a color change.

**Explanation:** In UDS, `text-base` is a **text color** token (maps to `--text-base`),
NOT the Tailwind font-size utility.

**Fix:** Use the `Text` component for font sizing:

```tsx
// Wrong
<p className="text-base">Body text</p>

// Correct
<Text variant="body" asChild><p>Body text</p></Text>
```

## Tailwind v3 vs v4 Confusion

**Symptom:** Project has both `tailwind.config.js` and `@import 'tailwindcss'`,
causing conflicts.

**How to identify the version:**
- **v4:** Uses `@import 'tailwindcss'` in CSS, no `tailwind.config.js` needed
- **v3:** Uses `@tailwind base; @tailwind components; @tailwind utilities;` and
  requires `tailwind.config.js` with UDS plugin

**Fix:** Choose one approach:
- **v4 (recommended):** Delete `tailwind.config.js`, use `@import 'tailwindcss'`
- **v3:** Keep `tailwind.config.js` with `udsTokens` plugin, use `@tailwind` directives

## Shop-UI Styles Missing

**Symptom:** Shop-UI organisms (`ModuleWrapper`, `TableCardTariff`) render without
proper styling.

**Fix:** Add the Shop-UI stylesheet AFTER React styles:

```css
@import '@ionos-web-design-system/react/style.css';
@import '@ionos-web-design-system/shop-ui/style.css';  /* Must come after react styles */
```

## Icons Not Rendering

**Symptom:** Icon props passed but nothing renders, or `icon={bell()}` throws an error.

**Causes & Fixes:**

1. **Calling the icon function** — Pass as reference, not invocation:
   ```tsx
   // Wrong
   icon={bell()}

   // Correct
   icon={bell}
   ```

2. **Wrong import group** — Icons are organized by group:
   ```tsx
   import { plus } from '@ionos-web-design-system/icon/system';     // UI icons
   import { facebook } from '@ionos-web-design-system/icon/social';  // Social
   ```

3. **Using `Icon` for brand logos** — Brand logos should use `<img>` in a `<div>`,
   not the `Icon` component.

## Dark Mode Not Working

**Symptom:** `dark:` Tailwind variants have no effect.

**Explanation:** UDS overrides Tailwind's built-in `dark:` variant to use
`data-color-scheme="dark"` instead of `@media (prefers-color-scheme: dark)`.

**Fix:** Ensure `data-color-scheme="dark"` is set on `<html>`:

```html
<html data-brand="ionos" data-platform="comfortable" data-color-scheme="dark">
```

For sections that should always be dark regardless of page scheme, use
`ThemeInverter` with `forceColorScheme="dark"`.

## Spacing Values Don't Match Figma

**Symptom:** Using `p-4` expecting 16px but getting 24px.

**Explanation:** UDS spacing tokens don't follow Tailwind's default scale.
`p-4` = `--space-4` = 24px (comfortable platform).

**Fix:** Always look up the spacing token table in `rules/core-spacing-tokens.md`.
For 16px, use `p-3` (comfortable).
