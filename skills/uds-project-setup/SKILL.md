---
name: uds-project-setup
description: >
  UDS project scaffolding, CSS configuration, and audit workflow. Use when the
  user asks to set up a new project with UDS, configure Tailwind v4 with UDS
  tokens, troubleshoot missing styles or tokens not resolving, audit an existing
  project for UDS configuration issues, or when mentions of UDS install, CSS
  imports, data-brand, data-platform, or data-color-scheme appear. Does NOT
  trigger on component usage or Figma-to-code — see uds-usage-best-practices.
---

# UDS Project Setup

Complete guide for scaffolding new UDS projects, configuring CSS/Tailwind, and
auditing existing projects for configuration issues.

## 1. Reading Order

1. **Read this file first** — quickstart, CSS imports, font setup, audit
   workflow.
2. **For CSS import details**: `rules/setup-css-imports.md`
3. **For font configuration**: `rules/setup-fonts.md`
4. **For audit checklist**: `rules/setup-audit-checklist.md`
5. **For troubleshooting**: `rules/setup-troubleshooting.md`
6. **For advanced setup** (v3 plugin, useTheme, CSS optimization):
   `rules/setup-advanced.md`

## 2. Project Creation Quickstart

### Prerequisites

The `@ionos-web-design-system/*` packages are published on an internal JFrog
registry, not the public npm registry. Before installing:

- **npm must be configured** with an auth token for the
  `@ionos-web-design-system` scope
- If `npm install` fails with **401**, **403**, or **E404** errors, the registry
  auth token is missing or invalid
- Contact **bowei.xiao@ionos.com** to obtain JFrog registry access

### Install Packages

```bash
npm install @ionos-web-design-system/react @ionos-web-design-system/core
```

Optional packages:

```bash
npm install @ionos-web-design-system/icon      # Icons
```

### CSS Entry File (`index.css`)

All CSS imports go here — never in JS/TS files:

```css
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/ionos'; /* match your brand */
@import '@ionos-web-design-system/core/platforms/comfortable'; /* match your platform */
@import '@ionos-web-design-system/react/style.css';
```

> **Import order is critical.** `@import 'tailwindcss'` must come first,
> followed by brand CSS, platform CSS, then component styles. See
> `rules/setup-css-imports.md` for all scenarios.

### HTML Root Attributes

Set required `data-*` attributes on the `<html>` element:

```html
<html
  data-brand="ionos"
  data-platform="comfortable"
  data-color-scheme="light"
></html>
```

| Attribute           | Values                                                                           |
| ------------------- | -------------------------------------------------------------------------------- |
| `data-brand`        | `ionos`, `strato`, `fasthosts`, `homepl`, `strefa`, `udag`, `world4you`, `arsys` |
| `data-platform`     | `comfortable`, `compact`                                                         |
| `data-color-scheme` | `light`, `dark`                                                                  |

All design tokens resolve automatically based on these attributes. Change any
attribute at runtime and every token updates instantly — no rebuild required.

### ThemeProvider in App.tsx

```tsx
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      <div className="text-base">
        {/* All UDS components go inside ThemeProvider */}
      </div>
    </ThemeProvider>
  );
}
```

> **Important:** The `text-base` class on the root wrapper sets the UDS base
> text color (`--text-base`). Without it, all text inherits the browser default
> `#000` black because the `Text` component does not set a color by default.

### Minimal Working Example

```tsx
// index.css
// @import 'tailwindcss';
// @import '@ionos-web-design-system/core/brands/ionos';
// @import '@ionos-web-design-system/core/platforms/comfortable';
// @import '@ionos-web-design-system/react/style.css';

import ThemeProvider from '@ionos-web-design-system/react/theme-provider';
import Button from '@ionos-web-design-system/react/button';

function App() {
  return (
    <ThemeProvider>
      <div className="text-base">
        <Button variant="primary" size="medium">
          Get Started
        </Button>
      </div>
    </ThemeProvider>
  );
}
```

## 3. CSS Import Order (Critical)

The correct import order in the CSS entry file is essential. Misordering causes
tokens to fail silently.

### Standard Single-Brand Setup

```css
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/{brand}';
@import '@ionos-web-design-system/core/platforms/{platform}';
@import '@ionos-web-design-system/react/style.css';
```

### Development (Multi-Brand Switching)

For runtime theme switching during development:

```css
@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/*';
@import '@ionos-web-design-system/core/platforms/*';
@import '@ionos-web-design-system/react/style.css';
```

### With Icons

Icons don't need CSS imports — they're SVG inject functions. Just install and
import:

```bash
npm install @ionos-web-design-system/icon
```

> For all import scenarios and edge cases, see `rules/setup-css-imports.md`.

## 4. Font Setup

UDS brands use specific font families. The core CSS declares `font-family` via
tokens, but the actual font files must be loaded by the project.

| Brand       | Font Family | Source             |
| ----------- | ----------- | ------------------ |
| `ionos`     | Inter       | Google Fonts / npm |
| `strato`    | Nunito Sans | Google Fonts / npm |
| `fasthosts` | Poppins     | Google Fonts / npm |
| `homepl`    | Lato        | Google Fonts / npm |
| `strefa`    | Lato        | Google Fonts / npm |
| `udag`      | Nunito Sans | Google Fonts / npm |
| `world4you` | Nunito Sans | Google Fonts / npm |
| `arsys`     | Inter       | Google Fonts / npm |

Add the font in `index.html` via Google Fonts or import locally. The UDS
`font-family` token will reference it automatically once loaded.

> For detailed font setup instructions, see `rules/setup-fonts.md`.

## 5. Tailwind v4 Verification Checklist

Before building, confirm Tailwind v4 is wired up correctly:

- [ ] `@import 'tailwindcss'` is in the CSS entry file (`index.css`), **not** in
      `vite.config` or `main.tsx`
- [ ] UDS CSS imports follow `@import 'tailwindcss'` — order matters
- [ ] No `tailwind.config.js` unless explicitly using the v3 plugin path
- [ ] `border--base` (double dash) works — single dash means v4 is misconfigured
- [ ] `@import '@ionos-web-design-system/react/style.css'` is present
- [ ] `data-brand`, `data-platform`, `data-color-scheme` set on `<html>`
- [ ] `<ThemeProvider>` wraps all UDS component usage in React
- [ ] Root element has `text-base` class for base text color fallback
- [ ] Brand font is loaded (via Google Fonts link or local import)

## 6. Audit Workflow

When auditing an existing project for UDS configuration issues:

1. **Check CSS entry file** — Verify import order and completeness
2. **Check HTML attributes** — Verify `data-brand`, `data-platform`,
   `data-color-scheme`
3. **Check ThemeProvider** — Verify it wraps the component tree
4. **Scan for raw colors** — Grep for hex values (`#[0-9a-fA-F]`), `rgb(`,
   `rgba(`
5. **Scan for raw Tailwind colors** — Grep for `bg-red`, `text-gray`,
   `border-blue`, etc.
6. **Check border convention** — Grep for `border-base` (should be
   `border--base` in v4)
7. **Check text misuse** — Grep for `text-base` used as font size (should be
   Text component)
8. **Verify token resolution** — Use Playwright MCP to check computed styles at
   runtime

> For the full structured checklist, see `rules/setup-audit-checklist.md`.

## 7. Playwright MCP Audit Snippets

Use Playwright MCP to verify tokens are mounting correctly at runtime:

### Check Token Resolution

Navigate to the running app and inspect that CSS custom properties resolve:

```javascript
// Check if UDS tokens are loaded on :root / html
const brand = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--surface-base')
);
// If empty string, tokens are not resolving — check CSS imports
```

### Check Data Attributes

```javascript
const html = await page.locator('html');
const brand = await html.getAttribute('data-brand');
const platform = await html.getAttribute('data-platform');
const colorScheme = await html.getAttribute('data-color-scheme');
// All three should be non-null
```

### Check Font Loading

```javascript
const font = await page.evaluate(
  () => getComputedStyle(document.body).fontFamily
);
// Should contain the brand's font (e.g., "Inter" for ionos)
```

## 8. MCP Prerequisites

### Playwright MCP

This plugin configures Playwright MCP via `.mcp.json`. Requirements:

- Node.js installed (for `npx` execution)
- The user's app must be running locally for browser verification
- First run may take a moment to download `@playwright/mcp`

### Figma MCP

The Figma MCP is platform-managed by Claude Code (via `claude.ai Figma`). It is
**NOT** declared in this plugin's `.mcp.json`.

**Auth troubleshooting:**

- If Figma MCP calls return auth errors, the user needs to re-authenticate
- OAuth tokens may expire — re-connect via Claude Code's Figma MCP settings
- The Figma MCP uses the user's Figma account permissions — they must have
  access to the file being queried

> For advanced CSS optimization, Tailwind v3 plugin, and useTheme hook, see
> `rules/setup-advanced.md`.
