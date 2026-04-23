# Figma-to-Code Workflow

Complete reference for translating Figma designs to UDS React code, including
asset handling and custom component creation. Referenced from SKILL.md
section 10.

## Token Usage

- Use design tokens from the core package for ALL styling
- Remember tokens are 3D (brand x platform x color-scheme):
  - Color tokens: same token has light/dark values — invert sections with
    `ThemeInverter`
  - Spacing tokens (`--space-*`): platform-adaptive — use `p-4`, `gap-4`, `m-4`
    (Tailwind v4 resolves `p-{n}` -> `var(--space-{n})` automatically)
  - Gap tokens (`--gap-*`): use with `gap` alias — `p-gap-4`, `gap-gap-8` (for
    small decorative gaps)
  - See `rules/core-spacing-tokens.md` for the full reference and Figma token
    mapping tables
- Never use hardcoded hex/px values from Figma's generated output

## SUPER CRITICAL: Spacing Pixel Accuracy

Every spacing value MUST be pixel-accurate compared to the original Figma
design. When translating Figma spacing:

1. **Find the Figma token** — e.g., `space/2` or raw value `8`
2. **Look up the correct Tailwind class** in `rules/core-spacing-tokens.md`:
   - `space/2` (8px) -> `p-2`, `gap-2`, `m-2`
   - `gap/8` (8px) -> `gap-gap-8` (NOT `gap-8` which is 64px!)
3. **Verify after implementation** — the resolved pixel value must match the
   Figma design exactly for the comfortable platform
4. **Browser verification (Playwright MCP)** — if the app is running locally,
   programmatically verify spacing with Playwright MCP (see
   `rules/workflow-verification.md` for detailed Playwright snippets)

> **Warning:** UDS token numbers are NOT pixel values. `p-4` = 24px, not 4px or
> 16px. `gap-2` = 8px, not 2px. Always use the mapping tables in
> `rules/core-spacing-tokens.md`.

## Asset Handling — 4 Categories

Every non-text asset from Figma falls into one of four categories. Use this
decision tree to determine the correct handling:

```
Asset from Figma design
  |
  +- Is it in the UDS icon package?
  |   +- YES, in `brandmark` group -------> Category 4: Brand Logo (<img>)
  |   +- YES, in any other group ---------> Category 3: Icon Instance (Icon component)
  |
  +- NOT in the UDS icon package
      +- Is it a vector SVG? -------------> Category 2: Vector SVG (inline SVG / <img>)
      +- Is it raster (PNG/JPG/photo)? ---> Category 1: Raster Asset (Picture)
```

### Category 1: Raster Assets (photos, screenshots, PNGs, JPGs)

**Use the `Picture` component — never raw `<img>` tags for raster images. Reach
for `AspectRatio` only when the Figma frame locks a fixed ratio, the asset is a
video, or the `decorative`/`fallback` props are required.**

1. **Download the asset(s)** from Figma and store in `public/` or `assets/`.
   Where possible, export AVIF and/or WebP plus a JPEG fallback, each at 1x and
   2x.
2. **Pick the `srcData` shape** on `Picture`:
   - Single URL, no retina / alternate formats → plain string.
   - Multi-format and/or retina variants → `ImageProps` object.
   - Different image per breakpoint → `ImageBreakpoints` object.
3. **Set `width` / `height`** to the Figma frame size to prevent CLS.
4. **Tune loading** — above-the-fold / LCP → `fetchPriority="high"` and
   `hasLazyLoading={false}`; below-the-fold → leave defaults.
5. **If the Figma frame locks a fixed aspect ratio** (tile, square thumb, card
   media), compose `Picture` inside an aspect-ratio wrapper — do not use bare
   `AspectRatio` unless you also need video, `decorative`, or `fallback`.
6. **Verify after implementation** — no raw `<img>`; dimensions match; AVIF/WebP
   `<source>` tags present where formats were exported; LCP images are not
   lazy-loaded.

```tsx
import Picture from '@ionos-web-design-system/react/picture';

{
  /* Plain raster image — Picture alone */
}
<Picture
  srcData={{
    src: '/product-photo.jpg',
    srcWebp: '/product-photo.webp',
    alt: 'Product',
    width: 800,
    height: 600,
  }}
/>;

{
  /* Figma frame locks a fixed ratio — compose Picture inside a ratio wrapper */
}
<div className="aspect-[4/3] overflow-hidden">
  <Picture
    srcData={{
      src: '/card.jpg',
      srcWebp: '/card.webp',
      alt: 'Card media',
    }}
    objectFit="cover"
    style={{ width: '100%', height: '100%' }}
  />
</div>;
```

See `rules/react-picture.md` for the full prop reference, `srcData` shapes, and
verification checklist. See `rules/react-aspect-ratio.md` for the narrower cases
(video, `decorative`/`fallback`, or wrapper mode around `Picture`).

### Category 2: Vector SVGs NOT in the UDS Icon Package

**Download the SVG from Figma. Use inline SVG or `<img>` inside a sized `<div>`
wrapper — do NOT wrap in `AspectRatio`.**

These are illustrations, decorative graphics, or diagrams that aren't part of
the UDS icon library. Follow the Figma MCP's download suggestions for the asset
URL, then:

```tsx
{
  /* Option A: inline SVG (when you need styling control) */
}
<div className="h-[160px] w-[240px]">
  <svg viewBox="0 0 240 160" className="h-full w-full">
    {/* ... SVG content from Figma ... */}
  </svg>
</div>;

{
  /* Option B: <img> tag (simpler, for static illustrations) */
}
<div className="h-[160px] w-[240px]">
  <img
    src="/illustration.svg"
    className="h-full w-full"
    alt="Feature illustration"
  />
</div>;
```

- **Always use a `<div>` wrapper** to control size — set `width` and `height`
  from the Figma frame on the wrapper, not the `<img>`/`<svg>` directly
- The `<img>`/`<svg>` fills its container with `h-full w-full`
- Do NOT wrap SVGs in `AspectRatio` — SVGs have intrinsic aspect ratios
- Store downloaded SVGs in `public/` or `assets/`

### Category 3: Icon Instances (icons in UDS icon groups)

**Use the UDS `Icon` component with inject functions.**

```tsx
import Icon from '@ionos-web-design-system/react/icon';
import { bell } from '@ionos-web-design-system/icon/system';

<Icon icon={bell} size="medium" title="Notifications" />;
```

Icon groups: `system`, `ionos`, `fasthosts`, `homepl`, `strato`, `social`,
`flags`, `checkmark`. See `rules/icon-groups.md` and `rules/react-icon.md`.

> Before importing any icon, verify the name in `rules/core-icon-name-lookup.md`
> or `icon-names.json`. Never guess based on Figma layer names.

### Category 4: Brand Logos (`brandmark` icon group)

**Wrap a native `<img>` inside a sized `<div>` — do NOT use the `Icon` component
for brand logos.**

The `Icon` component applies fixed icon sizing that distorts logo proportions.
Brand logos need the exact width/height from the Figma design, controlled via a
`<div>` wrapper.

```tsx
// Import the logo SVG as a URL
import ionosLightSrc from '@ionos-web-design-system/icon/brandmark/ionosLight?url';

// div controls size, img fills container
<div className="h-[32px] w-[120px]">
  <img src={ionosLightSrc} className="h-full w-full" alt="IONOS" />
</div>;
```

- **Always use a `<div>` wrapper** to control size — set Figma dimensions on the
  wrapper, not the `<img>` directly
- The `<img>` fills its container with `h-full w-full`
- Choose the Light/Dark variant matching the active color scheme (e.g.,
  `ionosLight` for light mode, `ionosDark` for dark mode)
- Do NOT wrap in `AspectRatio` — logos have fixed, exact dimensions
- Do NOT use the `Icon` component — it will distort the logo

## Component Mapping

- Map every Figma component to the closest UDS React component first
- For Figma component instances with no UDS equivalent: apply the atomic design
  pattern (see Custom Component Creation below)

## Price Sections

- **NEVER** recreate price display from scratch
- Use the `Price` component for ALL pricing, including discounts, strike-through
  prices, and postlines

## Custom Component Creation (Atomic Design Pattern)

When a Figma component instance has no matching UDS React component:

1. Analyse which UDS atom components make up the design (e.g., a "product card"
   may use: `Surface`, `Text`, `Badge`, `Button`, `Price`, `Icon`)
2. Build the custom component composing only UDS atoms + UDS design tokens
3. Use `rounded-(--protected-container-rounded)` for container corner radius
4. Use spacing tokens (`p-4`, `gap-4`) — never hardcoded pixel values
5. Apply `ThemeInverter` if the component has a visually inverted mode

```tsx
// Example: custom product card from UDS atoms
function ProductCard({ title, price, badge }) {
  return (
    <Surface
      variant="base"
      className="flex flex-col gap-3 rounded-(--protected-container-rounded) p-4"
    >
      {badge && <Badge variant="promo">{badge}</Badge>}
      <Text variant="headingLg" weight="bold" asChild>
        <h3>{title}</h3>
      </Text>
      <Price data={price} />
      <Button variant="primary" size="medium">
        Order now
      </Button>
    </Surface>
  );
}
```

See `rules/core-corner-radius.md` for corner radius rules.
