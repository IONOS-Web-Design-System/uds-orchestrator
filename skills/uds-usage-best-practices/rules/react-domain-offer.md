# DomainOffer

Compact horizontal card for a single domain extension + price, with an optional
promo `Badge`. Fixed 48px height, 1px solid border, simple layout:
logo · simple price · (optional) badge. Designed for dense lists and inline
promos — use `TileDomain` for the full, tariff-style domain result card.

## Import

```tsx
import DomainOffer from '@ionos-web-design-system/react/domain-offer';
import type { DomainOfferProps } from '@ionos-web-design-system/react/domain-offer';
```

## Props

| Prop         | Type                | Default | Description                                                                                    |
| ------------ | ------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `image`      | `React.ReactNode`   | —       | **Required.** Logo node (e.g. `<img>` or `<Picture>`). Rendered in a fixed 32px-tall container. |
| `price`      | `PriceData`         | —       | **Required.** Pricing data; rendered via `Price variant="simple" size="small" alignment="left"`. |
| `badgeText`  | `string`            | —       | Optional badge label. Renders a `Badge variant="price"` at the end of the row.                 |
| `onClick`    | `() => void`        | —       | When provided, the card becomes a `<button type="button">` and behaves as a keyboard-accessible control. |
| `className`  | `string`            | —       | Merged onto the wrapper element.                                                               |

When `onClick` is set, the remaining `<button>` attributes (except `onClick` /
`type`) are accepted. When `onClick` is absent, standard `<div>` attributes are
accepted. You cannot have both at once — enforced by the prop union type.

## Usage

### Basic offer (static)

```tsx
<DomainOffer
  image={<img src="/logos/dotcom.svg" alt=".com" width={72} height={32} />}
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

### Interactive offer with badge

```tsx
<DomainOffer
  image={<img src="/logos/dotorg.svg" alt=".org" width={72} height={32} />}
  price={{
    main: {
      integerPrice: '12',
      decimalPrice: '99',
      currency: '€',
      currencySymbolPosition: 'after',
      range: 'ex. VAT/yr',
    },
  }}
  badgeText="Best seller"
  onClick={() => selectDomain('.org')}
/>
```

### List of offers in a grid

```tsx
<div className="grid gap-4" style={{ width: '400px' }}>
  <DomainOffer image={logoCom} price={priceCom} badgeText="Discounts" />
  <DomainOffer image={logoNet} price={priceNet} />
  <DomainOffer image={logoDev} price={priceDev} badgeText="Popular" />
</div>
```

### With a raster logo

```tsx
import Picture from '@ionos-web-design-system/react/picture';

<DomainOffer
  image={
    <Picture
      srcData={{
        src: '/logos/dotdev.png',
        srcWebp: '/logos/dotdev.webp',
        alt: '.dev',
        width: 72,
        height: 32,
      }}
    />
  }
  price={price}
/>
```

## Visual / layout rules

- Fixed height: `h-12` (48px). Use inside a grid or flex column for consistent
  rows — do not override with `className="h-…"`.
- Background: `bg-surface-base`; border: `border--base` (note the double-dash
  UDS border token), radius `rounded-md`.
- Logo container: `h-[32px]`, `shrink-0`, vertically centered.
- Price slot uses `Price` in simple small-size left-aligned mode — don't pass a
  `Price` node in `image` expecting different rendering.
- Badge slot is only rendered when `badgeText` is a non-empty string; to skip
  it, omit the prop.

## Accessibility

- Always give the logo `<img>` meaningful `alt` (e.g. `alt=".com"`).
- When interactive, the component renders a native `<button>` — keyboard
  activation (`Enter`/`Space`) works out of the box.
- Do not wrap an interactive `DomainOffer` in another `<a>` or `<button>`.
- For purely decorative, non-interactive use, omit `onClick` — don't add a
  fake click handler just to suppress button styles.

## Comparison with `TileDomain`

| Need                                                 | Use            |
| ---------------------------------------------------- | -------------- |
| Dense compact row (list, sidebar, inline promo)      | `DomainOffer`  |
| Full search-result card with promotional pricing (prelines, strike, postlines) | `TileDomain` (`default` variant) |
| Compact horizontal row where a tariff-style price is needed | `TileDomain` (`light` variant) |
| Single promotional badge next to a simple price      | `DomainOffer`  |

## Do

- Use inside a 400px–480px-wide column as a stacked list of domain offers.
- Provide `alt` on the logo naming the TLD (`".com"`, `".org"`).
- Pass `onClick` when the card should select / navigate — don't hand-roll a
  wrapping `<button>`.
- Use `badgeText` sparingly — one or two items per list, not every row.
- Combine with `Picture` for raster logos.

## Don't

- Use `DomainOffer` for the primary search-result card — that's `TileDomain`'s
  job (more visual weight, bigger price slot).
- Set `h-*`, `border-*`, or `rounded-*` via `className` expecting them to
  stick — the base `cva` class already locks these.
- Render multiple `Badge`s in a single offer — only one `badgeText` is
  supported.
- Nest interactive children inside the card when `onClick` is set — it's a
  button; a button inside a button is a click-handling hazard.
- Use empty string as `badgeText` to force the badge slot to render — falsy
  values are intentionally skipped.
