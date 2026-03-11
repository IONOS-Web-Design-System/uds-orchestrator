# UDS Audit Checklist

Structured checklist for auditing an existing project's UDS configuration.
Run through each section to identify and fix configuration issues.

## 1. Package Installation

- [ ] `@ionos-web-design-system/core` is installed
- [ ] `@ionos-web-design-system/react` is installed
- [ ] Versions are compatible (same major version)
- [ ] Optional: `@ionos-web-design-system/icon` if icons are used
- [ ] Optional: `@ionos-web-design-system/shop-ui` if Shop-UI organisms are used

**Check:** `npm ls @ionos-web-design-system/core @ionos-web-design-system/react`

## 2. CSS Entry File

- [ ] CSS entry file exists (`index.css`, `globals.css`, or similar)
- [ ] `@import 'tailwindcss'` is the FIRST import
- [ ] Brand CSS import is present and correct for the target brand
- [ ] Platform CSS import is present (`comfortable` or `compact`)
- [ ] `@import '@ionos-web-design-system/react/style.css'` is present
- [ ] No CSS imports in JS/TS files (check `App.tsx`, `main.tsx`, `layout.tsx`)
- [ ] If Shop-UI: `@import '@ionos-web-design-system/shop-ui/style.css'` present
- [ ] No Tailwind v3 directives (`@tailwind base`, `@tailwind components`, etc.)

**Check:** Read the CSS entry file and verify import order.

## 3. HTML Root Attributes

- [ ] `data-brand` is set on `<html>` element
- [ ] `data-platform` is set on `<html>` element
- [ ] `data-color-scheme` is set on `<html>` element
- [ ] Values match the imported brand/platform CSS

**Check for Vite:** Read `index.html`
**Check for Next.js:** Read `app/layout.tsx` — look for `data-*` on `<html>`

## 4. ThemeProvider

- [ ] `ThemeProvider` imported from `@ionos-web-design-system/react/theme-provider`
- [ ] `ThemeProvider` wraps the entire component tree (or the UDS-using portion)
- [ ] No UDS components rendered outside of `ThemeProvider`

**Check:** Grep for `ThemeProvider` in the entry component (`App.tsx` or `layout.tsx`).

## 5. Font Loading

- [ ] Brand font is loaded (Google Fonts link, @fontsource, or next/font)
- [ ] Font weights include at minimum: 400 (regular) and 700 (bold)
- [ ] Font is loading in production (check Network tab)

**Check:** Read `index.html` for Google Fonts links, or grep for font imports.

## 6. Raw Color Scan

Scan for hardcoded colors that should use UDS tokens:

- [ ] No hex colors (`#fff`, `#000`, `#[0-9a-fA-F]{3,8}`)
- [ ] No `rgb(` or `rgba(` values
- [ ] No raw Tailwind colors (`bg-red-500`, `text-gray-700`, `border-blue-300`)
- [ ] No `text-base` used for font sizing (it's a UDS color token)

**Check:** `grep -rn '#[0-9a-fA-F]\{3,8\}' src/` and `grep -rn 'rgb\(|rgba\(' src/`

## 7. Border Convention (Tailwind v4)

- [ ] All UDS border colors use double-dash: `border--base`, `border--semantic-*`
- [ ] No single-dash border tokens: `border-base`, `border-semantic-*`
- [ ] Border color classes paired with border width: `border border--base`

**Check:** Grep for `border-base` (without double-dash) in TSX/JSX files.

## 8. Component Usage

- [ ] `Text` component used for all styled text (not raw `<h1>`, `<p>` with Tailwind)
- [ ] `Price` component used for pricing displays (not manual price markup)
- [ ] `AspectRatio` used for raster images (not raw `<img>`)
- [ ] `ThemeInverter` used for inverted sections (not manual `dark:` classes)
- [ ] Icon inject functions passed as references (`icon={plus}` not `icon={plus()}`)

## 9. Tailwind Configuration

- [ ] Using Tailwind v4 (`@import 'tailwindcss'` syntax)
- [ ] OR using Tailwind v3 with UDS plugin (`udsTokens` in `tailwind.config.js`)
- [ ] No conflicting Tailwind config that overrides UDS tokens

## Summary Actions

After completing the audit, address issues by priority:
1. **Critical:** CSS import order, missing imports, missing ThemeProvider
2. **High:** Raw colors, missing data attributes, font not loading
3. **Medium:** Border convention, component misuse, text-base confusion
4. **Low:** Wildcard imports in production, missing optional packages
