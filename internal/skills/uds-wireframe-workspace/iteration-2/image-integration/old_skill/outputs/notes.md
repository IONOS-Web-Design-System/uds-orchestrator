# ImageIntegrationWireframe — Implementation Notes

## Rules Applied

### wireframe-asset-integration.md
- Hero image uses a plain `<img>` tag (acceptable for wireframes per the rule) with `object-cover` to fill the full width and fixed height (`h-[480px]`).
- Local path `/Users/boweixiao/Desktop/hero-mockup.png` is stored in a `const heroImageSrc` at the top of the file for easy replacement.
- An IONOS blue overlay (`--brand/ionos-blue-800`) is placed over the image at 55% opacity to ensure headline text remains legible — matching the "Hero image (full-width banner)" pattern from the rule.
- A note is embedded in code: local paths only work when the dev server has filesystem access; for production/Storybook, copy the file to `public/` and use a root-relative path.

### wireframe-micro-animations.md
- All animations are momentary UI interactions (entrance fades, hover lifts), so native CSS / Tailwind is used — no Remotion needed.
- A single `@keyframes fadeInUp` is defined inline via a `<style>` tag, consistent with the rule's pattern.
- Entrance animations: hero text fades in on load; left column (form) and right column (features heading) use staggered `animation-delay` classes.
- Feature cards use per-item staggered delays (`0.3s`, `0.4s`, `0.5s`) — one entrance animation per section, not per element.
- Hover lift (`hover:-translate-y-1 hover:shadow-lg`) is applied to feature Cards and the submit Button — interactive elements only.
- Animation durations: 450ms for entrance (within the 400–600ms guidance), 200ms for hover (within the 200–400ms guidance).

## Decisions Made Without wireframe-composition.md

Since `wireframe-composition.md` was explicitly excluded from reading, the following composition decisions were made from first principles and the SKILL.md quick rules:

- Root wraps in `<ThemeProvider data-brand="ionos">` as required.
- `<Surface>` wraps the 2-column layout region to handle background and text color theming.
- Form inputs are plain HTML `<input>` elements (no UDS Input component referenced, as the component API was not available in the read rules). They use inline `style` for brand-consistent border colors.
- `<Card>` components are used for the feature bullet points to give each item visual weight and enable the hover lift animation.
- `<Button variant="primary">` is used for the CTA as the most semantically obvious choice.

## Caveats

1. **Local image path**: `/Users/boweixiao/Desktop/hero-mockup.png` will only render in a dev environment with local filesystem access. Move the image to `public/hero-mockup.png` in a Next.js/Vite project and update `heroImageSrc` accordingly.
2. **CSS custom properties**: Brand token variable names (e.g. `--brand/ionos-blue-800`) follow the UDS token format. These resolve correctly only when the UDS CSS layer is imported. Fallback hex values are included for environments without UDS tokens loaded.
3. **Not production code**: Callbacks are stubbed (`onClick={() => {}}`, `onSubmit={(e) => e.preventDefault()}`). No form validation, no API calls.
