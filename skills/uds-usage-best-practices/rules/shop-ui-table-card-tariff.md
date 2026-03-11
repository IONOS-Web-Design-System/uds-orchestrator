# TableCardTariff

Pricing card for product/plan comparison. Supports badges, structured price
display, and a call-to-action button.

## Import

```tsx
import TableCardTariff from '@ionos-web-design-system/shop-ui/table-card-tariff';
```

## Props

| Prop           | Type                                      | Default        | Description                                              |
| -------------- | ----------------------------------------- | -------------- | -------------------------------------------------------- |
| `title`        | `string`                                  | **(required)** | Plan or product name                                     |
| `badgeText`    | `string`                                  | —              | Highlights the card with a promotion border when present |
| `price`        | `PriceData`                               | —              | Pricing data (auto-expands price section)                |
| `priceVariant` | `'default' \| 'strike-below' \| 'simple'` | `'simple'`     | Price display layout                                     |
| `cta`          | `{ label: string, onClick: () => void }`  | **(required)** | Action button                                            |
| `state`        | `'default' \| 'active'`                   | `'default'`    | Visual state of the card                                 |

When `badgeText` is provided, the card is automatically highlighted with a
promotion border and the CTA uses the brand concept instead of monochrome.

### PriceData

Same structure as the UDS React Price component:

```ts
{
  prelines?: {
    primary?: { discount: string, strike: string }
  }
  main: {
    integerPrice: string
    comma: string
    decimalPrice: string
    currency: string
    currencySymbolPosition: 'before' | 'after'
  }
  postlines?: Array<{
    content: string
    weight?: string
    size?: string
  }>
}
```

## Usage

### Basic card without price

```tsx
<TableCardTariff
  title="Free Trial"
  cta={{ label: 'Start free', onClick: handleStart }}
/>
```

### Card with price

```tsx
<TableCardTariff
  title="Basic"
  cta={{ label: 'Select', onClick: handleSelect }}
  price={{
    main: {
      integerPrice: '4',
      comma: ',',
      decimalPrice: '99',
      currency: '€',
      currencySymbolPosition: 'after',
    },
    postlines: [{ content: '/month' }],
  }}
/>
```

### Highlighted card with discount

```tsx
<TableCardTariff
  title="Professional"
  badgeText="Most Popular"
  cta={{ label: 'Select', onClick: handleSelect }}
  price={{
    prelines: { primary: { discount: '-30%', strike: '9,99 €' } },
    main: {
      integerPrice: '6',
      comma: ',',
      decimalPrice: '99',
      currency: '€',
      currencySymbolPosition: 'after',
    },
    postlines: [{ content: '/month' }],
  }}
/>
```

## Do's and Don'ts

- **Do**: Use `badgeText` to highlight the recommended plan in a comparison row.
- **Do**: Provide `price` for expanded cards — cards without price render in a
  collapsed state.
- **Do**: Use `priceVariant="strike-below"` when showing original and discounted
  prices prominently.
- **Don't**: Set `state="active"` and `badgeText` on the same card — the badge
  takes visual priority and the combination creates conflicting emphasis.
- **Don't**: Use long badge text — keep it to 2-3 words (e.g., "Most Popular",
  "Best Value").
