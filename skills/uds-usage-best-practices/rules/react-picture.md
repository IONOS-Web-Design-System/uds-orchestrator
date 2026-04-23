# Picture

## Import

```tsx
import Picture from '@ionos-web-design-system/react/picture';
```

## Description

Renders a responsive `<picture>` element for **raster** image assets (photos,
screenshots, PNG/JPG). Negotiates the best format the browser supports (AVIF →
WebP → JPEG), serves retina variants via `srcSet`, switches sources per
breakpoint, lazy-loads via `IntersectionObserver`, shows a built-in `Skeleton`
while loading, and swaps to a broken-image icon on error.

Picture is the **default primitive for raster image assets in UDS.** Use
`AspectRatio` only for fixed-ratio containers, video, or when you need its
`decorative` / `fallback` props (see
[Choosing between Picture and AspectRatio](#choosing-between-picture-and-aspectratio)).

## Props

| Prop             | Type                                                       | Default | Description                                                                                                                                         |
| ---------------- | ---------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `srcData`        | `string \| ImageProps \| ImageBreakpoints`                 | —       | **Required.** See [srcData shapes](#srcdata-shapes) below.                                                                                          |
| `alt`            | `string`                                                   | `''`    | Alt text. Used as a fallback when `srcData` is a plain string. When `srcData` is `ImageProps` or `ImageBreakpoints`, the nested `alt` field wins.   |
| `hasLazyLoading` | `boolean`                                                  | `true`  | Enables `IntersectionObserver`-based lazy loading. Sets `loading="lazy"` until the image is in the viewport, then removes the attribute (one-shot). |
| `objectFit`      | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | —       | Maps to the `object-fit` CSS property on the `<img>` element.                                                                                       |
| `className`      | `string`                                                   | —       | Merged onto the wrapper `<div>` (not the `<img>`). Use for border-radius, shadow, ring, etc.                                                        |
| `fetchPriority`  | `'high' \| 'low' \| 'auto'`                                | —       | Standard HTML fetch-priority hint. Pass `"high"` for above-the-fold LCP images.                                                                     |
| `width`          | `number`                                                   | —       | Passes through to `<img>`. Set together with `height` to prevent CLS.                                                                               |
| `height`         | `number`                                                   | —       | Passes through to `<img>`. Set together with `width` to prevent CLS.                                                                                |
| ...restProps     | `React.ImgHTMLAttributes<HTMLImageElement>`                | —       | Any standard `<img>` attribute except `src`, `alt`, `srcSet` is forwarded to the `<img>`.                                                           |

## srcData shapes

Picture accepts one of three shapes in `srcData`.

### 1. Plain URL string

```tsx
<Picture srcData="/photo.jpg" alt="Product photo" />
```

Use when you only have a single format. The top-level `alt` prop supplies the
alt text.

### 2. `ImageProps` — multi-format and retina

| Field           | Type     | Description                                  |
| --------------- | -------- | -------------------------------------------- |
| `src`           | `string` | **Required.** JPEG/PNG fallback URL.         |
| `retinaSrc`     | `string` | 2x retina variant for the JPEG/PNG.          |
| `srcWebp`       | `string` | WebP format URL.                             |
| `retinaSrcWebp` | `string` | 2x retina variant for the WebP.              |
| `srcAvif`       | `string` | AVIF format URL (smallest modern format).    |
| `retinaSrcAvif` | `string` | 2x retina variant for the AVIF.              |
| `alt`           | `string` | **Required.** Alt text.                      |
| `width`         | `number` | Intrinsic width, in px. Set to prevent CLS.  |
| `height`        | `number` | Intrinsic height, in px. Set to prevent CLS. |
| `title`         | `string` | Native `title` attribute (tooltip on hover). |

Sources render in priority order AVIF → WebP → JPEG; the browser picks the first
it can decode.

### 3. `ImageBreakpoints` — different images per breakpoint

| Field    | Type                   | Breakpoint media query                       |
| -------- | ---------------------- | -------------------------------------------- |
| `small`  | `string \| ImageProps` | `(max-width: 767px)`                         |
| `medium` | `string \| ImageProps` | `(min-width: 768px) and (max-width: 1023px)` |
| `large`  | `string \| ImageProps` | `(min-width: 1024px)` — **required**         |

Use when the design ships a different crop or resolution per breakpoint. `large`
is required (and also acts as the `<img>` fallback). Breakpoint pixel values are
read from the UDS tokens `--breakpoint-md` (768px) and `--breakpoint-lg`
(1024px) at module load time.

## Usage

### Plain string URL

```tsx
<Picture srcData="/photo.jpg" alt="Product photo" />
```

### Multi-format with retina

```tsx
<Picture
  srcData={{
    src: '/hero.jpg',
    retinaSrc: '/hero@2x.jpg',
    srcWebp: '/hero.webp',
    retinaSrcWebp: '/hero@2x.webp',
    srcAvif: '/hero.avif',
    retinaSrcAvif: '/hero@2x.avif',
    alt: 'Team meeting in a modern office',
    width: 1600,
    height: 900,
  }}
/>
```

### Responsive per-breakpoint sources

```tsx
<Picture
  srcData={{
    small: '/hero-mobile.jpg',
    medium: { src: '/hero-tablet.jpg', alt: 'Hero' },
    large: {
      src: '/hero-desktop.jpg',
      srcWebp: '/hero-desktop.webp',
      alt: 'Hero',
      width: 1600,
      height: 600,
    },
  }}
/>
```

### Above-the-fold hero (LCP-optimised)

```tsx
<Picture
  srcData={{
    src: '/hero.jpg',
    srcWebp: '/hero.webp',
    alt: 'Homepage hero',
    width: 1600,
    height: 900,
  }}
  fetchPriority="high"
  hasLazyLoading={false}
/>
```

### Lazy-loaded below the fold

```tsx
<Picture srcData="/gallery-item.jpg" alt="Gallery item" hasLazyLoading />
```

### `objectFit` in a fixed-size container

```tsx
<div className="h-48 w-48">
  <Picture
    srcData="/landscape.jpg"
    alt="Landscape"
    objectFit="cover"
    style={{ width: '100%', height: '100%' }}
  />
</div>
```

### Rounded corners and shadow

```tsx
<Picture
  srcData="/card.jpg"
  alt="Card image"
  className="rounded-xl shadow-lg"
/>
```

## SUPER CRITICAL: Use Picture for raster image assets

When the Figma design contains **raster images** (photos, screenshots, product
images, PNGs, JPGs) that are NOT from the UDS icon library, they MUST be
rendered using `Picture` — never a raw `<img>` tag and, by default, not
`AspectRatio`. Picture delivers the modern-format + retina + lazy-load

- Skeleton + broken-image story as a single primitive; raw `<img>` and
  `AspectRatio` do not.

> **Note:** This rule applies to **raster images only**. Vector SVGs
> (illustrations, graphics) and brand logos (`brandmark` group) have different
> handling — see SKILL.md section 10 / `workflow-figma-to-code.md` for the full
> 4-category asset decision tree.

### Figma-to-Picture workflow

1. **Identify the asset in Figma** — note its width, height, and whether the
   design ships a different crop per breakpoint.
2. **Export the asset(s)** — use Figma MCP or manual export. Where possible,
   export AVIF and/or WebP plus a JPEG fallback, each at 1x and 2x.
3. **Pick the `srcData` shape:**
   - Single URL, no retina, no alternate formats → **plain string**.
   - Multi-format and/or retina variants → **`ImageProps`**.
   - Different image per breakpoint → **`ImageBreakpoints`**.
4. **Set `width` and `height`** to the Figma frame size. This reserves layout
   space and prevents Cumulative Layout Shift.
5. **Tune loading for the viewport position:**
   - Above-the-fold (LCP) → `fetchPriority="high"` and `hasLazyLoading={false}`.
   - Below-the-fold → leave defaults (`hasLazyLoading` is `true`).
6. **If the Figma frame enforces a fixed ratio** (tile, square thumbnail, card
   media), **compose** Picture with an aspect-ratio wrapper — see the next
   section.

### When a fixed aspect ratio is required

`Picture` does not enforce an aspect ratio — it sizes from `width`/`height` or
the natural image. When Figma shows media that must fill a ratio-locked
container regardless of image dimensions:

```tsx
{
  /* CSS aspect-ratio wrapper + Picture */
}
<div className="aspect-[16/9] overflow-hidden rounded-sm">
  <Picture
    srcData={{
      src: '/photo.jpg',
      srcWebp: '/photo.webp',
      alt: 'Product photo',
    }}
    objectFit="cover"
    style={{ width: '100%', height: '100%' }}
  />
</div>;
```

Use `AspectRatio` directly only when you also need video playback, a
`decorative` prop, or a custom `fallback` slot. See
[`aspect-ratio.md`](./aspect-ratio.md).

### Post-implementation verification

After rendering, verify against the Figma design:

1. **No raw `<img>` for raster assets** — every raster asset uses `Picture`.
2. **Dimensions match** — the displayed image has the same width:height as
   Figma; `width`/`height` are set to prevent CLS.
3. **Format delivery** — the `<picture>` element contains `<source>` tags for
   AVIF/WebP when those formats are available for the asset.
4. **Lazy loading is correct** — LCP hero images are NOT lazy-loaded; below-
   the-fold images use the default lazy behavior.
5. **`objectFit`** — if a fixed-ratio wrapper is present, the image fills or
   fits the frame the same way Figma shows it.

## Choosing between Picture and AspectRatio

| Need                                     | Use                                                                                          |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| Plain raster image (photo, PNG/JPG)      | **Picture**                                                                                  |
| Multi-format (AVIF/WebP/JPEG) + retina   | **Picture**                                                                                  |
| Different image per breakpoint           | **Picture** (`ImageBreakpoints`)                                                             |
| IntersectionObserver lazy loading        | **Picture**                                                                                  |
| Guaranteed aspect-ratio container        | **AspectRatio** (or compose CSS `aspect-ratio` + `Picture`)                                  |
| Video with play/pause overlay            | **AspectRatio**                                                                              |
| `decorative` (empty alt + `aria-hidden`) | **AspectRatio**                                                                              |
| Custom `fallback` node on error          | **AspectRatio**                                                                              |
| Raster image at a fixed ratio            | Compose: wrapper with CSS `aspect-ratio` (or `AspectRatio` in wrapper mode) around `Picture` |

## Do

- Use `Picture` for every raster image asset — never a raw `<img>` tag.
- Provide multi-format variants via `ImageProps` (at minimum WebP + JPEG) for
  hero / LCP images.
- Set `width` and `height` on the image (via `ImageProps` or the top-level
  props) to prevent CLS.
- Use `fetchPriority="high"` and `hasLazyLoading={false}` for above-the-fold
  (LCP) images.
- Pass styling (`rounded-*`, `shadow-*`, `ring-*`, `overflow-hidden`) via
  `className` on the wrapper.
- Let the built-in `Skeleton` handle the loading state — don't layer another
  spinner on top.

## Don't

- Use a raw `<img>` tag for raster assets — always use `Picture`.
- Reach for `AspectRatio` when a simple raster image would work — use `Picture`
  (compose with a ratio wrapper if the design requires a fixed ratio).
- Lazy-load an LCP/hero image — it delays the Largest Contentful Paint.
- Pass both `ImageProps.alt` and the top-level `alt` prop — `ImageProps.alt`
  wins. Choose one source of truth.
- Expect `Picture` to enforce an aspect ratio — it uses the image's natural
  dimensions (or the `width`/`height` you supply) unless you wrap it.
- Apply `className` expecting it to land on the `<img>` — it's merged onto the
  wrapper `<div>`.
