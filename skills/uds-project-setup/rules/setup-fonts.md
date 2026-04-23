# Font Setup

UDS brands declare `font-family` via design tokens, but the actual font files
must be loaded by the project. Without loading the font, the browser falls back
to system fonts and the design won't match.

## Brand-to-Font Mapping

| Brand       | Font Family | Google Fonts URL Parameter | Weights Needed     |
| ----------- | ----------- | -------------------------- | ------------------ |
| `ionos`     | Inter       | `Inter`                    | 400, 500, 600, 700 |
| `strato`    | Nunito Sans | `Nunito+Sans`              | 400, 600, 700      |
| `fasthosts` | Poppins     | `Poppins`                  | 400, 500, 600, 700 |
| `homepl`    | Lato        | `Lato`                     | 400, 700           |
| `strefa`    | Lato        | `Lato`                     | 400, 700           |
| `udag`      | Nunito Sans | `Nunito+Sans`              | 400, 600, 700      |
| `world4you` | Nunito Sans | `Nunito+Sans`              | 400, 600, 700      |
| `arsys`     | Inter       | `Inter`                    | 400, 500, 600, 700 |

## Google Fonts (Recommended)

Add to `index.html` `<head>`:

```html
<!-- Example for ionos brand (Inter) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

```html
<!-- Example for strato brand (Nunito Sans) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

```html
<!-- Example for fasthosts brand (Poppins) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

## Local Font Import (Alternative)

If using a font package (e.g., `@fontsource/inter`):

```bash
npm install @fontsource/inter
```

```css
/* In CSS entry file, BEFORE tailwindcss import or in a separate early import */
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';

@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/ionos';
/* ... rest of imports */
```

## Next.js Font Optimization

For Next.js projects, use `next/font` for optimal loading:

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html
      className={inter.variable}
      data-brand="ionos"
      data-platform="comfortable"
      data-color-scheme="light"
    >
      <body>{children}</body>
    </html>
  );
}
```

## Verification

Check that fonts are loading correctly:

1. Open browser DevTools → Network tab → filter by "Font"
2. Verify the correct font files are downloaded
3. Inspect body `font-family` — should show the brand font, not system fallbacks
4. Use Playwright MCP: `getComputedStyle(document.body).fontFamily`
