# HeroTile

Surface-colored tile for hero sections, main promo areas, and featured content
blocks. Renders a text slot on top and an optional decorative image anchored to
the bottom-right corner on desktop (centered on mobile). Deliberately minimal —
bring your own typography via `Text` components in the `text` slot.

## Import

```tsx
import HeroTile from '@ionos-web-design-system/react/hero-tile';
import type { HeroTileProps, BackgroundColorVariant } from '@ionos-web-design-system/react/hero-tile';
```

## Props

| Prop              | Type                       | Default  | Description                                                                 |
| ----------------- | -------------------------- | -------- | --------------------------------------------------------------------------- |
| `text`            | `React.ReactNode`          | —        | **Required.** Headline + body slot. Pass `Text` components for typography.  |
| `image`           | `React.ReactNode`          | —        | Optional decorative image. Anchored to bottom-right on `md+`, centered below. |
| `backgroundColor` | `BackgroundColorVariant`   | `'base'` | Surface background token. See variants below.                               |
| `className`       | `string`                   | —        | Merged onto the outer `<div>`.                                              |

Extends `React.HTMLAttributes<HTMLDivElement>`.

### `BackgroundColorVariant` values

| Value         | Background token                | When to use                              |
| ------------- | ------------------------------- | ---------------------------------------- |
| `base`        | `bg-surface-base`               | Default / neutral page area              |
| `subtle`      | `bg-surface-subtle`             | Slight contrast against page background  |
| `subtlest`    | `bg-surface-subtlest`           | Softest contrast                         |
| `highlight`   | `bg-surface-highlight`          | Brand-highlight section                  |
| `neutral`     | `bg-surface-semantic-neutral`   | Informational                            |
| `promo`       | `bg-surface-semantic-promo`     | Marketing / offer blocks                 |
| `success`     | `bg-surface-semantic-success`   | Success messaging                        |
| `caution`     | `bg-surface-semantic-caution`   | Caution messaging                        |

> The `textColor` CVA key is internal; `HeroTile` derives text color from the
> selected surface token. Use `Text` color props in the `text` slot to refine
> individual lines.

## Usage

### Basic tile with image

```tsx
import HeroTile from '@ionos-web-design-system/react/hero-tile';
import Text from '@ionos-web-design-system/react/text';

<HeroTile
  backgroundColor="subtle"
  text={
    <>
      <Text asChild variant="heading5xl" className="text-brand">
        <h2>
          For almost 30 years
          <Text className="text-base">we've co-built the Polish internet</Text>
        </h2>
      </Text>
      <Text asChild variant="body" className="pt-4 text-base">
        <p>
          We are pioneers of the Polish internet and leaders of the hosting
          market, offering a broad range of online services.
        </p>
      </Text>
    </>
  }
  image={<img src="/hero.png" alt="Person holding a laptop" width={400} height={300} />}
/>;
```

### Promotional variant, no image

```tsx
<HeroTile
  backgroundColor="promo"
  text={
    <>
      <Text asChild variant="heading4xl"><h2>Summer Sale</h2></Text>
      <Text asChild variant="body"><p>Save up to 50% on hosting plans.</p></Text>
    </>
  }
/>
```

### With responsive raster image

Prefer `Picture` over a raw `<img>` for raster images so you get modern-format
delivery, retina sources, lazy loading, and a built-in skeleton.

```tsx
import Picture from '@ionos-web-design-system/react/picture';

<HeroTile
  backgroundColor="highlight"
  text={<Text asChild variant="heading5xl"><h2>Built for scale</h2></Text>}
  image={
    <Picture
      srcData={{
        src: '/hero-team.jpg',
        srcWebp: '/hero-team.webp',
        alt: 'Team collaborating',
        width: 400,
        height: 300,
      }}
      fetchPriority="high"
      hasLazyLoading={false}
    />
  }
/>
```

## Layout behavior

- The outer container is `flex flex-col items-start justify-center gap-3
  overflow-hidden` — text stacks above the image.
- The text slot has `p-4 lg:p-7` padding; when an `image` is also provided the
  bottom padding is removed so the image can flush to the edge.
- On `md+`, the image is anchored to `justify-end` (bottom-right). Below `md`,
  the image is centered (`justify-center`) below the text.
- `overflow-hidden` means `border-radius` on the wrapper clips the image — set
  `className="rounded-xl"` to round the tile.

## Accessibility

- Pass a semantic heading inside `text` (e.g. `<Text asChild><h2>…</h2></Text>`).
  The component does not enforce a heading level.
- Always give the `image` an `alt` (or `alt=""` for purely decorative imagery).
- Tiles with `success` / `caution` semantic surfaces are visual cues only —
  convey the meaning in the `text` slot too, don't rely on color alone.

## Do

- Compose the `text` slot with `Text` components to get UDS typography tokens
  and variants — `heading*` for headlines, `body` for descriptions.
- Use `Picture` for raster images in the `image` slot (applies the UDS raster
  rule — see `picture.md`).
- Pick `backgroundColor` based on the section's *semantic* role: `promo` for
  marketing, `subtle` for a gentle lift from page background, etc.
- Add `rounded-xl` / `shadow-*` via `className` for card-like treatments.

## Don't

- Render a raw `<h1>`/`<p>` with Tailwind typography classes inside `text` —
  use `Text` to respect brand typography tokens.
- Use raw `<img>` for photographic / raster hero imagery — use `Picture`.
- Put interactive elements expecting `HeroTile` to form a card — it is a
  static layout primitive; wrap it in `Card` / `Surface` if you need
  hover/elevation behaviour.
- Stretch the image beyond the tile — `overflow-hidden` will clip it, but
  choose an image sized appropriately to the tile's max width.
- Rely on `backgroundColor="success"` or `"caution"` as the only signal — also
  reflect the meaning in text and/or icons.
