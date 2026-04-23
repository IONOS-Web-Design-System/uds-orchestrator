# TileDomain

Domain-extension tile used in domain-search results and selection flows.
Displays a domain logo (e.g. `.com`, `.org`) alongside its price. Two visual
variants: `default` (vertical column, full price with discount / strike /
postlines) and `light` (compact horizontal row, simplified price). Renders as
a `<button>` when `onClick` is provided, otherwise as a `<div>`.

## Import

```tsx
import TileDomain from '@ionos-web-design-system/react/tile-domain';
import type { TileDomainProps, TileDomainVariants } from '@ionos-web-design-system/react/tile-domain';
```

## Props

| Prop          | Type                                | Default      | Description                                                                                    |
| ------------- | ----------------------------------- | ------------ | ---------------------------------------------------------------------------------------------- |
| `image`       | `React.ReactNode`                   | —            | **Required.** Logo node (e.g. `<img>` or `<Picture>`). Rendered in a fixed-height container per `size`. |
| `price`       | `PriceData`                         | —            | **Required.** Pricing data; passed to the internal `Price` component.                          |
| `size`        | `'large' \| 'medium' \| 'small'`    | `'large'`    | Logo container height: 56 / 40 / 24 px. `large` only pairs with `default` variant.             |
| `variant`     | `'default' \| 'light'`              | `'default'`  | `default` = vertical column with full price; `light` = horizontal row with compact price.      |
| `alignment`   | `'center' \| 'left' \| 'right'`     | `'center'`   | Horizontal alignment of the logo and price.                                                    |
| `onClick`     | `() => void`                        | —            | When provided, the tile renders as `<button type="button">` and is interactive.                |
| `className`   | `string`                            | —            | Merged onto the wrapper element.                                                               |

When `onClick` is set, the rest of the standard `<button>` attributes (except
`onClick` / `type`) are accepted. When `onClick` is absent, standard `<div>`
attributes are accepted. You cannot have both at once — this is enforced by the
prop type.

## `price` (`PriceData`) shape

The full `PriceData` shape is documented in `price.md`. Most common fields:

| Field         | Type                                                   | Description                                    |
| ------------- | ------------------------------------------------------ | ---------------------------------------------- |
| `prelines`    | `{ primary: { discount?: string; strike?: string } }`  | Discount badge + strike-through price          |
| `main`        | `{ integerPrice, decimalPrice?, comma?, currency?, currencySymbolPosition, range? }` | Integer + decimal price with currency and range |
| `postlines`   | `Array<{ content: string; weight?: 'normal' \| 'bold' }>` | Small text beneath the price                 |

`default` variant passes `size="medium"` to `Price`; `light` passes
`size="small"` and drops prelines/postlines from the visible output.

## Usage

### Large default tile (domain-search result card)

```tsx
<TileDomain
  size="large"
  variant="default"
  alignment="center"
  image={<img src="/logo-dotcom.svg" alt=".com" width={112} height={56} />}
  price={{
    prelines: { primary: { discount: '94% off', strike: '20 €' } },
    main: {
      integerPrice: '0',
      comma: ',',
      decimalPrice: '08',
      currency: '€',
      currencySymbolPosition: 'after',
      range: '/month',
    },
    postlines: [{ content: 'for 6 months', weight: 'bold' }],
  }}
  onClick={() => selectDomain('.com')}
/>
```

### Compact horizontal row (filter / sidebar)

```tsx
<TileDomain
  size="small"
  variant="light"
  image={<img src="/logo-dotorg.svg" alt=".org" width={40} height={24} />}
  price={{
    main: {
      integerPrice: '00',
      currency: '€',
      currencySymbolPosition: 'after',
      range: 'ex. VAT/mo',
    },
  }}
/>
```

### With a raster-optimized logo

If the logo is a raster image (PNG/JPG rather than SVG), use `Picture` for the
same format / retina / lazy-load story applied elsewhere in UDS:

```tsx
import Picture from '@ionos-web-design-system/react/picture';

<TileDomain
  size="medium"
  image={
    <Picture
      srcData={{
        src: '/logos/dotdev.png',
        srcWebp: '/logos/dotdev.webp',
        alt: '.dev',
        width: 80,
        height: 40,
      }}
    />
  }
  price={price}
/>
```

### Static (non-interactive) use

Omit `onClick` — the tile renders as a `<div>` and retains its hover / active
background transitions (purely visual).

```tsx
<TileDomain image={logo} price={price} />
```

## Visual / layout rules

- Interactive tiles render a `<button type="button">` with `w-full`,
  `cursor-pointer`, `text-left`.
- Background: `bg-surface-input-default` with hover / active variants
  (`surface-input-hover`, `surface-input-active`).
- Shadow: `shadow-sm` on most brands; `homepl` uses a solid border instead
  (`homepl:shadow-none homepl:border homepl:border--base`).
- Border radius: `rounded-(--protected-domain-search-domain-tile)` by default;
  the `light` variant uses `rounded-md`.
- Compound-variant behaviour: `variant="light"` + `size="medium" | "small"`
  switches the layout to `flex-row gap-2 px-3 py-2` (horizontal).

## Accessibility

- Always provide meaningful `alt` on the logo `<img>` (e.g. `alt=".com"`) so
  the extension is announced.
- When `onClick` is passed, the component renders as a native `<button>` — it
  is keyboard-focusable and respects `Enter` / `Space` activation.
- Do not nest other focusable elements inside the tile — a button inside a
  button has undefined semantics.
- For static tiles (no `onClick`), do not add `role="button"` or `tabIndex` —
  let them remain non-interactive `<div>`s.

## Do

- Use `large` + `default` for the primary domain-result card on a search
  results page.
- Use `light` + `medium|small` for compact lists (filter panels, sidebars,
  stacked selections).
- Pass `onClick` to get the keyboard-accessible `<button>` rendering — don't
  wrap a static `TileDomain` in a parent `<a>` / `<button>`.
- Supply `PriceData` shaped for the variant: full `prelines` + `postlines`
  for `default`; just `main` for `light`.
- Match `alignment` to the grid / container alignment — `left` for left-aligned
  lists, `center` inside card grids.

## Don't

- Combine `size="large"` with `variant="light"` — the compound variant only
  applies to `medium` / `small`, so large+light falls back to the vertical
  layout (confusing for users).
- Wrap the tile in another interactive element — either make it interactive
  via `onClick`, or keep both the tile and its parent inert.
- Reach for `<img>` for raster logos — use `Picture` to get modern-format
  delivery.
- Put large amounts of copy in the tile — it's a tight extension+price block.
  Use `Card` / `Surface` for richer content.
- Override `background-color` via `className` — theming comes from
  `surface-input-*` tokens, and overriding them breaks hover/active states.
