# ImageIntegrationWireframe — Notes

## What Was Built

A product-page wireframe for an IONOS web hosting offering. Follows the `uds-wireframe` skill rules throughout.

## Structure

1. **NavigationBar** — standard IONOS nav with product links
2. **Full-width hero** — the provided `hero-mockup.png` fills the top via `object-cover`. A semi-transparent Dark Midnight (`--brand/ionos-blue-800`, 55 % opacity) overlay is applied so white text and the Sky CTA remain legible against any photo content.
3. **2-column section** (inside `<Surface>`):
   - **Left**: Headline + sign-up form (`TextField` × 2 + `Button`)
   - **Right**: 3 feature bullet points, each with an icon badge and descriptive text

## Image Integration

- The hero image is referenced via the local path supplied by the user: `/Users/boweixiao/Desktop/hero-mockup.png`.
- **Important**: This path only resolves when rendered in a dev server that has access to the local filesystem (e.g., `vite dev` or `next dev` with the file on the same machine). To use it reliably in Storybook or a hosted environment, copy the file into `public/hero-mockup.png` and change the `src` to `/hero-mockup.png`.
- The `wireframe-asset-integration.md` rule recommends the UDS `Picture` component for full format/retina support; a plain `<img>` was used here for simplicity, which is explicitly allowed for quick wireframes.

## Hero image was not found at provided path

The file `/Users/boweixiao/Desktop/hero-mockup.png` did not exist on disk at generation time. The `src` prop is set to that path anyway — the wireframe will render correctly once the file is present at that location (or the path is updated).

## Skill Rules Applied

| Rule | How it was applied |
|------|--------------------|
| `wireframe-composition.md` — wrap in ThemeProvider | `<ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">` |
| `wireframe-composition.md` — use Surface for layout regions | `<Surface>` wraps the 2-column section |
| `wireframe-composition.md` — stub callbacks | All `onClick`/`onChange` are `() => {}` |
| `wireframe-composition.md` — plausible placeholder content | Real hosting copy, no "Lorem ipsum" |
| `wireframe-asset-integration.md` — local path → img element | `<img src={heroImageSrc} ...>` with `object-cover` |
| `wireframe-asset-integration.md` — hero placement pattern | Relative container + absolute overlay + absolute text |
| `wireframe-micro-animations.md` — entrance fade-in per section | `fadeInUp` keyframe, one class per column, staggered delays |
| `wireframe-micro-animations.md` — restraint (one animation/section) | Only entrance fades; no hover animations on feature bullets |
| `uds-style-guide` IONOS brand | IONOS Blue (`--brand/ionos-blue-800`) for text, Sky (`--brand/ionos-sky-300`) for accents |
| `uds-style-guide` typography | `var(--base/font/heading)` (Overpass) for headlines, `var(--base/font/body)` (Open Sans) for body |

## Icon Usage

The feature bullets use `<Icon group="system" name={...} size={22} />` with icon names `shield`, `speed`, and `support`. These are illustrative — the actual icon names depend on what is available in the installed `@ionos-web-design-system/react/icon` package. Swap to valid names from the icon catalogue if any are missing.

## Not Included

- No dark mode variant (not requested)
- No Remotion animations (entrance fades are CSS-only — appropriate per `wireframe-micro-animations.md`)
- No responsive breakpoints (wireframe-level illustration; add `md:` / `lg:` Tailwind prefixes for production)
