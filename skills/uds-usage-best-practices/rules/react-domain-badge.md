# DomainBadge

## Import

```tsx
import DomainBadge from '@ionos-web-design-system/react/domain-badge';
```

## Props

| Prop      | Type                         | Default        | Description                          |
| --------- | ---------------------------- | -------------- | ------------------------------------ |
| `tld`     | `string`                     | _required_     | Top-level domain text (e.g., '.com') |
| `type`    | `'logo' \| 'text'`           | `'text'`       | Display mode                         |
| `layout`  | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction                     |
| `logoUrl` | `string`                     | —              | Logo image URL (for `type='logo'`)   |
| `price`   | `PriceData`                  | —              | Integrated price display             |

### PriceData Structure

```ts
{
  main: {
    integerPrice: string;
    comma: string;
    decimalPrice: string;
    currency: string;
    currencySymbolPosition: 'before' | 'after';
  }
}
```

## Description

Displays a top-level domain with optional pricing and branding. Used in domain
marketplace and search result contexts.

## Usage

### Basic text badge

```tsx
<DomainBadge tld=".com" />
```

### With price

```tsx
<DomainBadge
  tld=".com"
  price={{
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

### Logo mode

```tsx
<DomainBadge tld=".de" type="logo" logoUrl="/de-logo.svg" layout="vertical" />
```

### Vertical layout

```tsx
<DomainBadge tld=".shop" layout="vertical" />
```

## Do

- Include price data for domain marketplace displays.
- Always include the dot prefix in `tld` values (e.g., ".com", not "com").
- Use `type="logo"` with `logoUrl` for branded TLD displays.

## Don't

- Omit the dot prefix from `tld` values.
- Use `type="logo"` without providing a `logoUrl`.
- Display more than 5-6 badges in a single row without wrapping.
