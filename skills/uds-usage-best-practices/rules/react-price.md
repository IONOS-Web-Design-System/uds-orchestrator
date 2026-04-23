# Price

## Import

```jsx
import Price from '@ionos-web-design-system/react/price';
```

## Props

| Prop        | Type                                      | Default     | Description                           |
| ----------- | ----------------------------------------- | ----------- | ------------------------------------- |
| `data`      | `PriceData`                               | —           | **Required.** Structured price object |
| `variant`   | `'default' \| 'strike-below' \| 'simple'` | `'default'` | Layout variant                        |
| `size`      | `'small' \| 'medium' \| 'large'`          | `'large'`   | Overall size                          |
| `alignment` | `'left' \| 'centered' \| 'right'`         | `'left'`    | Text alignment                        |
| `emphasis`  | `boolean`                                 | `false`     | Accent styling                        |

## PriceData Structure

```ts
{
  prelines?: {
    primary?: { discount?: string, strike?: string, preline?: string },
    secondary?: { discount?: string, strike?: string, preline?: string }
  },
  main?: {
    integerPrice?: string,
    comma?: string,
    decimalPrice?: string,
    currency?: string,
    currencySymbolPosition?: 'before' | 'after',
    range?: string,
    additionalInfo?: string
  },
  postlines?: [{
    content: string,
    tooltip?: string,
    weight?: 'normal' | 'bold' | 'black',
    size?: 'xs' | 'sm' | 'body'
  }]
}
```

## Variants

- **default** — Preline above main price. Use for prominent pricing displays.
- **strike-below** — Strikethrough price below main price.
- **simple** — Inline layout for compact contexts.

## PriceData Field Rules

### `main.integerPrice`

- **Type**: `string` — can be numeric (`'14'`, `'999'`) or text (`'Gratis'`,
  `'Free'`, `'Kostenlos'`).
- Defaults to `'0'` internally when omitted.

### `main.comma`

- The decimal separator displayed between `integerPrice` and `decimalPrice`.
- **Must be set when `decimalPrice` has a value** — otherwise the decimal part
  appears directly after the integer with no separator.
- Convention by currency/locale:
  - `.` (period) — USD (`$`), GBP (`£`), and most English-speaking countries
  - `,` (comma) — EUR (`€`) in Germany, France, Spain, Poland; PLN (`zł`)
- When `integerPrice` is non-numeric text (e.g., `'Gratis'`), omit both `comma`
  and `decimalPrice`.

### `main.currency` and `main.currencySymbolPosition`

- `currency` is the symbol string: `'€'`, `'$'`, `'£'`, `'zł'`, etc.
- `currencySymbolPosition` controls placement:
  - `'before'` (default) — `$9.99` (USD, GBP)
  - `'after'` — `9,99 €` (EUR in most European countries)
- Always set both to match the target locale.

### `main.range`

- Text displayed after the price, typically a billing period.
- Examples: `'/month'`, `'/mo'`, `'per year'`, `'/Jahr'`, `'HT/mois'`

### `main.additionalInfo`

- Tax or regulatory information displayed within the main price block (not in
  postlines).
- Used in countries requiring tax disclosure: France (`'(3,60 € TTC)'`), UK
  (`'excl. VAT'`), etc.
- Only include when legally required for the target market.

### `prelines`

- `discount`: Rendered as a `Badge` with `variant="price"` (e.g., `'-30%'`,
  `'SAVE 40%'`).
- `strike`: Rendered with line-through decoration (the original price before
  discount).
- `preline`: Plain descriptive text above the price.
- Only `primary` is rendered by the component — `secondary` exists in the type
  but is not rendered.

### `postlines`

- Array of supporting text lines below the price.
- Each item requires `content` (the only required field in the entire data
  structure).
- `tooltip`: Adds an info icon that shows the tooltip text on hover.
- `weight` / `size`: Control font weight and size independently per postline.

## Usage

```jsx
<Price
  variant="default"
  size="large"
  data={{
    prelines: { primary: { discount: '-30%', strike: '9.99' } },
    main: {
      integerPrice: '6',
      comma: ',',
      decimalPrice: '99',
      currency: '€',
      currencySymbolPosition: 'after',
    },
    postlines: [{ content: '/month', size: 'sm' }],
  }}
/>
```

```jsx
<Price
  variant="simple"
  size="small"
  data={{
    main: {
      integerPrice: '0',
      comma: '.',
      decimalPrice: '99',
      currency: '$',
      currencySymbolPosition: 'before',
    },
  }}
/>
```

### Non-numeric price (free tier)

```jsx
<Price
  variant="default"
  size="large"
  data={{
    prelines: { primary: { discount: 'SAVE 99%', strike: '100€' } },
    main: {
      integerPrice: 'Gratis',
      additionalInfo: '(46.54 € TTC)',
    },
    postlines: [
      { content: 'pour 6 mois', weight: 'black' },
      {
        content: 'Introduction offer',
        tooltip: 'Price valid for first 6 months',
      },
    ],
  }}
/>
```

## Do

- Always set `comma` when `decimalPrice` is provided (e.g., `comma: ','` for
  EUR, `comma: '.'` for USD).
- Set `currencySymbolPosition` to match the locale (`'before'` for `$`/`£`,
  `'after'` for `€`/`zł`).
- Use `variant="default"` for prominent pricing with discounts and postlines.
- Use `variant="simple"` for inline prices within text or compact layouts.
- Use non-numeric `integerPrice` for free-tier pricing (e.g., `'Gratis'`,
  `'Free'`) — omit `comma` and `decimalPrice` in this case.
- Include `additionalInfo` only when tax disclosure is required by the target
  market.

## Don't

- Omit `comma` when `decimalPrice` is set — the number will render without a
  separator.
- Omit the `currency` field — always specify the currency symbol.
- Use `size="large"` for inline/simple prices — use `"small"` or `"medium"`.
- Build price displays manually with Text/spans — always use the Price
  component.
- Put billing period text (e.g., '/month') in `additionalInfo` — use the `range`
  field instead.
- Hardcode price values — pass dynamic data from your pricing API/CMS.
