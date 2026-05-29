# ImageIntegrationWireframe — Notes

## What was generated

A single-page wireframe for an IONOS web hosting product page, structured as:

1. **NavigationBar** — top nav with product links
2. **Hero image** — fills the top of the page using a `<div>` with `overflow-hidden` and `object-cover`, embedding the user-supplied local path (`/Users/boweixiao/Desktop/hero-mockup.png`). A semi-transparent gradient overlay (ionos-blue-900 → ionos-blue-800) sits over the image so it reads as a proper hero backdrop while the image remains visually dominant.
3. **Two-column layout** (Tailwind `grid grid-cols-2`):
   - **Left column**: headline (Overpass, ionos-blue-800), a short description, and a sign-up form with two `TextField` components (email + password) and a `Button` styled with the Sky CTA color.
   - **Right column**: 3 feature bullet points, each with a Sky-colored icon badge (`Icon group="system"`) and a headline + body copy pair.
4. **Footer strip** — dark midnight background with copyright and legal links.

## Skill guidance applied

- `ThemeProvider brand="ionos" colorScheme="light" platform="comfortable"` wraps the whole composition per `wireframe-composition.md`.
- Image embedded using plain `<img>` per `wireframe-asset-integration.md` (local path pattern, `object-cover`, no background treatment).
- Colors use CSS tokens (`--brand/ionos-blue-800`, `--brand/ionos-sky-300`, `--brand/ionos-blue-900`) never hard-coded hex, per `ionos-color-palette.md`.
- Typography uses CSS tokens (`--base/font/heading` = Overpass for h1/h2, `--base/font/body` = Open Sans for all other text), per `ionos-typography.md`.
- Sky color used for exactly one focal CTA per composition, and for icon badges — satisfying the "use sparingly" rule.
- Placeholder content is contextually realistic (real hosting value props, real CTA copy) — not Lorem ipsum.

## Local path caveat

The hero image uses the absolute local path `/Users/boweixiao/Desktop/hero-mockup.png`. This only renders in a dev server that has filesystem access to that path. To use in a standard project (Next.js, Vite), copy the image into the `public/` folder and update `heroImageSrc` to `/hero-mockup.png`.
