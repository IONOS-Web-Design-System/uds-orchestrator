# HeroFeatureGridWireframe — Implementation Notes

## What was built

A two-section IONOS hosting landing page wireframe:

1. **Hero section** — dark gradient background (`ionos-blue-900` → `ionos-blue-800`), Overpass headline, Open Sans subline, primary Sky CTA + ghost secondary, social proof bar.
2. **Feature grid** — Cloud (`cool-grey-100`) background, centered section heading, 3-column `Card` grid for Web Hosting, VPS, and Domains.

## Skill rules applied

### wireframe-composition.md
- Wrapped in `<ThemeProvider brand="ionos" colorScheme="light" platform="comfortable">`.
- `<ThemeInverter>` used around the hero `<Surface>` to flip tokens for the dark background — per the composition guide's hero pattern.
- `<Surface>` used for both layout regions (hero + feature grid).
- Stubs: `onClick={() => {}}` on all buttons.
- Placeholder content is contextually plausible (real IONOS hosting product names, realistic pricing, genuine feature descriptions).
- File header comment: `// Wireframe illustration — not production code`.

### wireframe-micro-animations.md
- Entrance `fadeInUp` keyframes injected via `<style>` tag — one per major section (hero elements staggered at 0ms, 150ms, 300ms; cards staggered at 0ms, 100ms, 200ms).
- Hover lift on cards: `transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg` — applied only to interactive elements.
- Stayed within 200–400ms duration for hover, 400–600ms for entrances.

### wireframe-asset-integration.md
- No image paths or Figma URLs were provided, so decorative placeholder div patterns were not needed.
- Decorative background radial glow done in CSS only (no `<img>`) — keeps the wireframe self-contained.

### uds-style-guide/ionos-color-palette.md
- Hero gradient uses `--brand/ionos-blue-900` and `--brand/ionos-blue-800` — the "blue gradient" documented in Supporting Darks.
- Sky (`--brand/ionos-sky-300`) used for one CTA per composition — the "one focal point" rule.
- Dark Midnight (`--brand/ionos-blue-800`) used for all body text.
- IONOS Blue (`--brand/ionos-blue-600`) used for price display.
- No secondary (utility) colors in the primary composition.
- No hard-coded hex values — all colors via CSS tokens.

### uds-style-guide/ionos-typography.md
- Overpass (`--base/font/heading`) for h1, h2, and price displays.
- Open Sans (`--base/font/body`) for all body copy, labels, and UI elements (buttons, badge text).
- `0.56px` letter-spacing on uppercase labels — per Figma spec.
- Overpass not used below ~18px.

## Design decisions not specified by user

- Added `<NavigationBar>` for realistic page framing — standard landing page composition.
- Added a "Most popular" badge on Web Hosting — communicates product hierarchy.
- Added a ghost secondary CTA ("See all products") alongside the primary — common conversion pattern, doesn't compete with the Sky CTA.
- Section heading added above the feature grid — helps viewers understand the grid's purpose in the layout.
- Used `clamp()` for responsive headline sizing — wireframe works at different viewport widths.

## Limitations / notes

- Icon names (`hosting`, `vps`, `domains`) assumed to exist in the `ionos` icon group. Actual available names should be verified against the installed icon set.
- `NavigationBar` import path assumes the component is available — verify against installed package version.
- Local paths and Figma screenshots: none provided, none embedded.
- Not wired to data or routing — stub wireframe only.
