# AspectRatio

## Import

```tsx
import AspectRatio from '@ionos-web-design-system/react/aspect-ratio';
```

## Props

| Prop            | Type                                                                        | Default   | Description                           |
| --------------- | --------------------------------------------------------------------------- | --------- | ------------------------------------- |
| `ratio`         | `'1/1' \| 'golden' \| '16/9' \| '4/3' \| '2/1' \| '3/1' \| '9/16' \| '3/4'` | `'16/9'`  | Aspect ratio                          |
| `src`           | `string`                                                                    | —         | Image or video URL                    |
| `objectFit`     | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'`                  | `'cover'` | CSS object-fit value                  |
| `alt`           | `string`                                                                    | —         | Alt text for images                   |
| `decorative`    | `boolean`                                                                   | `false`   | Marks image as decorative (empty alt) |
| `loading`       | `'lazy' \| 'eager'`                                                         | `'lazy'`  | Image loading strategy                |
| `fetchPriority` | `'high' \| 'low' \| 'auto'`                                                 | —         | Fetch priority hint                   |
| `fallback`      | `React.ReactNode`                                                           | —         | Error fallback content                |
| `asChild`       | `boolean`                                                                   | `false`   | Custom children mode                  |

## Description

Constrains images and videos to a fixed aspect ratio. Videos automatically
display a play button overlay.

## Usage

### Standard image

```tsx
<AspectRatio src="/photo.jpg" ratio="16/9" alt="Product photo" />
```

### Above-the-fold hero image

```tsx
<AspectRatio
  src="/hero.jpg"
  ratio="4/3"
  decorative
  fetchPriority="high"
  loading="eager"
/>
```

### Video

```tsx
<AspectRatio src="/demo.mp4" ratio="16/9" alt="Product demo" />
```

### Custom content

```tsx
<AspectRatio ratio="1/1" asChild>
  <div className="custom-content">Custom content</div>
</AspectRatio>
```

## SUPER CRITICAL: Raster Asset Size & Proportion Accuracy

When the Figma design contains **raster images** (photos, screenshots, product
images, PNGs, JPGs) that are NOT from the UDS icon library, they MUST be
rendered using `AspectRatio` — never a raw `<img>` tag. After implementation,
the displayed size and proportions must match the original Figma design exactly.

> **Note:** This rule applies to **raster images only**. Vector SVGs
> (illustrations, graphics) and brand logos (`brandmark` group) have different
> handling — see SKILL.md section 10 for the full 4-category asset decision
> tree.

### Figma-to-AspectRatio Workflow

1. **Identify the asset in Figma** — note its width, height, and any aspect
   ratio constraint from the Auto Layout or frame properties.
2. **Download the asset** — use Figma MCP or manual export. Store in the
   project's `public/` or `assets/` directory.
3. **Calculate the aspect ratio** — divide width by height from the Figma frame:
   - 1:1 → `ratio="1/1"`
   - 16:9 → `ratio="16/9"`
   - 4:3 → `ratio="4/3"`
   - 3:4 → `ratio="3/4"`
   - 2:1 → `ratio="2/1"`
   - 3:1 → `ratio="3/1"`
   - 9:16 → `ratio="9/16"`
   - ~1.618:1 → `ratio="golden"`
4. **Choose `objectFit`** — match the Figma frame's fill/fit behavior:
   - Image fills the frame (cropped) → `objectFit="cover"` (default)
   - Image fits inside with letterboxing → `objectFit="contain"`
   - Image stretches to fill → `objectFit="fill"`
5. **Control the container width** — `AspectRatio` fills its parent's width.
   Use a wrapper with explicit width to match the Figma design's dimensions:

```tsx
{/* Figma shows a 320×180 hero image (16:9) */}
<div className="w-full max-w-[320px]">
  <AspectRatio src="/hero.jpg" ratio="16/9" alt="Hero image" />
</div>

{/* Figma shows a 200×200 avatar (1:1) */}
<div className="w-[200px]">
  <AspectRatio src="/avatar.jpg" ratio="1/1" alt="User avatar" />
</div>

{/* Figma shows a full-width banner (3:1) */}
<AspectRatio src="/banner.jpg" ratio="3/1" decorative />
```

### Ratio Reference

| `ratio` Prop | Aspect Ratio | Padding-Bottom | Common Use Case         |
| ------------ | ------------ | -------------- | ----------------------- |
| `'1/1'`      | 1:1          | 100%           | Avatars, thumbnails     |
| `'golden'`   | ~1.618:1     | 61.8%          | Aesthetically balanced  |
| `'16/9'`     | 16:9         | 56.25%         | Videos, hero images     |
| `'4/3'`      | 4:3          | 75%            | Product photos          |
| `'2/1'`      | 2:1          | 50%            | Wide banners            |
| `'3/1'`      | 3:1          | 33.33%         | Ultra-wide banners      |
| `'9/16'`     | 9:16         | 177.77%        | Vertical/mobile content |
| `'3/4'`      | 3:4          | 133.33%        | Portrait photos         |

### Post-Implementation Verification

After rendering, verify these against the Figma design:

1. **Aspect ratio matches** — the displayed image has the same width:height
   proportion as in Figma. No stretching, no unexpected cropping.
2. **Container width matches** — the wrapper constrains the image to the same
   width as in the Figma design (or scales proportionally in responsive layouts).
3. **Object-fit matches** — the image fills/fits the frame the same way as in
   Figma (cropped edges match, no unexpected letterboxing).
4. **No raw `<img>` tags for raster images** — every raster asset uses `AspectRatio`.

## Do

- Use `AspectRatio` for all **raster** images and media — never raw `<img>` tags for raster assets.
- Set `fetchPriority="high"` and `loading="eager"` for above-the-fold images.
- Use `decorative` for background or purely visual images.
- Provide `fallback` for images that may fail to load.
- Match the `ratio` prop to the Figma frame's aspect ratio.
- Control width via a parent wrapper to match Figma dimensions.
- Verify displayed size and proportions against the Figma design after
  implementation.

## Don't

- Use raw `<img>` tags for **raster** assets — always use `AspectRatio` for raster images.
- Omit `alt` text for meaningful images — use `decorative` only for
  non-informative visuals.
- Use `asChild` with `src` — they are mutually exclusive modes.
- Guess the aspect ratio — always calculate from the Figma frame dimensions.
- Assume images will display at the correct size without controlling the parent
  container width.
