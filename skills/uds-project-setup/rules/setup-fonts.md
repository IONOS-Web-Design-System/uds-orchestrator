# Font Setup

UDS brands declare `font-family` via two CSS tokens provided by `@ionos-web-design-system/core`:

- **`--font-base`** — body text and UI elements
- **`--font-title`** — headings and display text

The actual font files must be loaded by the project. The core package only sets the font-family name via CSS tokens — it does not bundle font files.

## Brand-to-Font Mapping

| Brand | `--font-base` (body) | `--font-title` (heading) | Availability |
|-------|---------------------|-------------------------|--------------|
| `ionos` | Open Sans | Overpass | Google Fonts |
| `strato` | Poppins | Poppins | Google Fonts |
| `fasthosts` | AntennaCond | AntennaCond | ⚠ Proprietary — must be self-hosted |
| `homepl` | Azo Sans | Azo Sans | ⚠ Commercial — must be self-hosted |
| `strefa` | Montserrat | Montserrat | Google Fonts |
| `udag` | Inter | Inter | Google Fonts |
| `world4you` | Inter (body) | Satoshi (heading) | Google Fonts / Fontshare |
| `arsys` | Open Sans | FS Blake | Open Sans: Google Fonts; FS Blake: ⚠ Proprietary |

> **Proprietary fonts** (AntennaCond, Azo Sans, FS Blake) are not publicly available via CDN. Provide them as self-hosted `.woff2` files.

## Google Fonts (recommended for brands with open fonts)

Add to `index.html` `<head>`:

```html
<!-- ionos: Open Sans + Overpass -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Overpass:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

```html
<!-- strato: Poppins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

```html
<!-- strefa: Montserrat -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
```

```html
<!-- udag: Inter -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

```html
<!-- world4you: Inter (body) + Satoshi (heading) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
```

```html
<!-- arsys: Open Sans (body) + FS Blake (heading, self-hosted) -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
<!-- FS Blake: provide as @font-face with self-hosted .woff2 files -->
```

## Local Font Import (using @fontsource)

For brands using Google Fonts, `@fontsource` packages provide self-hosted alternatives:

```bash
npm install @fontsource/open-sans @fontsource/overpass     # ionos
npm install @fontsource/poppins                             # strato
npm install @fontsource/montserrat                          # strefa
npm install @fontsource/inter                               # udag, world4you
```

```css
/* In CSS entry file, BEFORE tailwindcss import — ionos example */
@import '@fontsource/open-sans/400.css';
@import '@fontsource/open-sans/600.css';
@import '@fontsource/open-sans/700.css';
@import '@fontsource/overpass/400.css';
@import '@fontsource/overpass/600.css';

@import 'tailwindcss';
@import '@ionos-web-design-system/core/brands/ionos';
```

## CSS Token Reference

Use these tokens in custom styles to apply the active brand font:

```css
.my-body-text {
  font-family: var(--font-base);    /* resolves to the brand's body font */
}

.my-heading {
  font-family: var(--font-title);   /* resolves to the brand's heading font */
}
```

## Next.js Font Optimization

For Next.js projects (ionos example):

```tsx
// app/layout.tsx
import { Open_Sans, Overpass } from 'next/font/google';

const openSans = Open_Sans({ subsets: ['latin'], weight: ['400', '600', '700'] });
const overpass = Overpass({ subsets: ['latin'], weight: ['400', '600'] });

export default function RootLayout({ children }) {
  return (
    <html
      data-brand="ionos"
      data-platform="comfortable"
      data-color-scheme="light"
      style={{ fontFamily: openSans.style.fontFamily }}
    >
      <body>{children}</body>
    </html>
  );
}
```

## Verification

1. Open browser DevTools → Network tab → filter by "Font"
2. Verify the correct font files are downloaded
3. Inspect body `font-family` — should show the brand font, not system fallbacks
4. Use Playwright MCP: `getComputedStyle(document.body).fontFamily`
