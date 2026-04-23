# CardTariff

A specialized card for displaying product tariff/pricing plans with promotional
badges, pricing information, and call-to-action buttons. Uses CSS subgrid for
perfect cross-column alignment when multiple cards are placed side by side.

## Import

```tsx
import CardTariff from '@ionos-web-design-system/react/card-tariff';
```

## Props

| Prop            | Type                             | Default  | Description                                                                                        |
| --------------- | -------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `title`         | `string`                         | —        | **Required.** Plan name rendered as a bold heading                                                 |
| `button`        | `React.ReactNode`                | —        | **Required.** String → default UDS Button (primary/callout, full-width). ReactNode → renders as-is |
| `size`          | `'full' \| 'light' \| 'compact'` | `'full'` | Controls which sections are visible and their sizing                                               |
| `badgeText`     | `React.ReactNode`                | —        | When truthy, wraps card in an accent-colored promotional frame with badge                          |
| `promotion`     | `boolean`                        | `false`  | Inverts the color scheme on the card content area (light↔dark)                                     |
| `priceEmphasis` | `boolean`                        | `false`  | Renders the Price component with emphasis styling                                                  |
| `underTitle`    | `string`                         | —        | Promotional text below the title. **homepl brand only**, visible only at `size="full"`             |
| `subtitle`      | `string`                         | —        | Text below the title. Hidden for compact size                                                      |
| `priceData`     | `PriceData`                      | —        | Price data object. See [price.md](price.md) for `PriceData` structure                              |
| `onButtonClick` | `() => void`                     | —        | Click handler for the default button. Only used when `button` is a string                          |
| `disclaimer`    | `React.ReactNode`                | —        | Content below the button (legal text, guarantee). Hidden for compact size                          |
| `hidePrice`     | `boolean`                        | `false`  | Hides the price section with a CSS transition. Used by ComparisonTable for sticky header scenarios |
| `className`     | `string`                         | —        | Additional CSS classes on the card wrapper                                                         |
| `children`      | `React.ReactNode`                | —        | Content below the CTA area. Only visible for `size="full"`                                         |

## Size Variants

| Size      | Title | Subtitle | Price        | Button | Disclaimer | Children |
| --------- | ----- | -------- | ------------ | ------ | ---------- | -------- |
| `full`    | Yes   | Yes      | Large        | Medium | Yes        | Yes      |
| `light`   | Yes   | Yes      | Medium       | Medium | Yes        | No       |
| `compact` | Yes   | No       | Small (opt.) | Small  | No         | No       |

- **full** — Complete card with all sections including detailed feature lists
  and large price display. Used primarily in core product showrooms (hosting
  services and related IONOS group products) for the most prominent marketing
  presentation.
- **light** — Same as full but without children slot. Used primarily in cloud
  product showrooms where products require a prominent but more streamlined
  presentation.
- **compact** — Minimal card with title and small button. Used in
  space-restricted contexts such as the ComparisonTable organism.

## Promotional Features

Three orthogonal concerns that can be combined independently:

| Prop            | Visual effect                                       |
| --------------- | --------------------------------------------------- |
| `badgeText`     | Accent-colored frame around card + badge text above |
| `promotion`     | Inverts card color scheme (light↔dark)              |
| `priceEmphasis` | Accent styling on the Price component               |

Common combinations:

- **Bestseller**: `badgeText="Bestseller" priceEmphasis` — highlighted frame +
  emphasized price, normal card background.
- **Full promo**: `badgeText="Best Value" promotion priceEmphasis` — all three
  active.
- **Subtle promo**: `promotion` only — inverted background, no badge.

## Usage

### Basic

```tsx
<CardTariff
  title="Starter"
  subtitle="For personal projects"
  priceData={{
    main: {
      integerPrice: '9',
      comma: ',',
      decimalPrice: '90',
      currency: '€',
      currencySymbolPosition: 'after',
      range: '/month',
    },
  }}
  button="Select"
  onButtonClick={() => console.log('selected')}
  disclaimer="No credit card required"
/>
```

### With badge and price emphasis

```tsx
<CardTariff
  title="Premium"
  subtitle="Our most popular plan"
  badgeText="Bestseller"
  priceEmphasis
  priceData={priceData}
  button="Select"
  disclaimer="30-day money-back guarantee"
>
  <Text color="subtle">
    {`- **250 GB** SSD Storage
- **Unlimited** Bandwidth
- **Free** SSL Certificate`}
  </Text>
</CardTariff>
```

### Compact

```tsx
<CardTariff size="compact" title="Free Tier" button="Get Started" />
```

### Column alignment with subgrid

Place multiple cards in a CSS grid container. Subgrid ensures rows (badge,
title, price, button, children) align across columns:

```tsx
<div className="grid grid-cols-[repeat(3,1fr)] grid-rows-[repeat(6,auto)] gap-x-4">
  <CardTariff
    size="full"
    title="Starter"
    priceData={starterPrice}
    button="Select"
  />
  <CardTariff
    size="full"
    title="Premium"
    badgeText="Best"
    priceData={premiumPrice}
    button="Select"
  >
    <Text>Feature list...</Text>
  </CardTariff>
  <CardTariff
    size="full"
    title="Enterprise"
    priceData={enterprisePrice}
    button="Contact Sales"
  />
</div>
```

### Home.pl brand with underTitle

The `underTitle` prop renders promotional text below the title, styled with
`color="promotion"`. It is brand-specific to homepl and only visible at
`size="full"`:

```tsx
<CardTariff
  size="full"
  title="Premium"
  underTitle="+ SSL w niskiej cenie"
  subtitle="Dla początkujących"
  badgeText="Oferta specjalna"
  priceEmphasis
  priceData={premiumPrice}
  button="Zamów"
>
  <Divider />
  <HomeplFeatureList />
</CardTariff>
```

### Custom CTA button

Pass a ReactNode for full control over the button:

```tsx
<CardTariff
  title="Enterprise"
  priceData={priceData}
  button={
    <Button
      variant="secondary"
      concept="monochrome"
      size="medium"
      className="w-full"
    >
      Contact Sales
    </Button>
  }
/>
```

## Do

- Use `size="full"` for core product showrooms (hosting, domains, etc.) where
  detailed feature lists and large price displays are needed.
- Use `size="light"` for cloud product showrooms that need a prominent but
  streamlined card without the children slot.
- Use `size="compact"` in space-restricted contexts like ComparisonTable.
- Wrap multiple cards in a CSS grid with `grid-rows-[repeat(6,auto)]` for
  subgrid alignment.
- Pass `w-full` on custom Button elements to match the default full-width style.
- Combine `badgeText`, `promotion`, and `priceEmphasis` independently based on
  how prominently the plan should stand out.
- Use `underTitle` for homepl brand promotional highlights (e.g. upsell text
  like "+ SSL w niskiej cenie") — it renders with `color="promotion"` styling.

## Don't

- Use `footer` — it is deprecated; use `disclaimer` instead.
- Put complex interactive content (forms, nested cards) inside `children` — keep
  it to feature lists, dividers, and upsell rows.
- Omit the grid container's `grid-rows-[repeat(6,auto)]` when placing cards side
  by side — without it, subgrid alignment breaks.
- Use `size="compact"` with `subtitle` or `disclaimer` — they are not rendered.
- Manually style price displays — use the `priceData` prop with `PriceData`.
- Use `underTitle` with non-homepl brands or with `size="light"` /
  `size="compact"` — it only renders for homepl at `size="full"`.
