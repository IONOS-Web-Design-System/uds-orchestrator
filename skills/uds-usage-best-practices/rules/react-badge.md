# Badge

## Import

```tsx
import Badge from '@ionos-web-design-system/react/badge';
```

## Props

| Prop       | Type                              | Default      | Description   |
| ---------- | --------------------------------- | ------------ | ------------- |
| `variant`  | `'price' \| 'promo' \| 'neutral'` | `'neutral'`  | Visual style  |
| `children` | `React.ReactNode`                 | **required** | Badge content |

## Usage

### Price badge

```tsx
<Badge variant="price">-30%</Badge>
```

### Promotional badge

```tsx
<Badge variant="promo">New</Badge>
```

### Neutral badge

```tsx
<Badge variant="neutral">Beta</Badge>
```

### Alongside other components

```tsx
<div className="flex items-center gap-2">
  <Text variant="headingLg">Product Name</Text>
  <Badge variant="promo">New</Badge>
</div>
```

## Variants

- **price** — Highlight pricing discounts or savings
- **promo** — Promotional labels (new, sale, featured)
- **neutral** — Informational labels (beta, draft, archived)

## Do

- Keep badge text short (1-3 words).
- Use `variant="price"` specifically for pricing-related labels.
- Place badges adjacent to the content they describe.

## Don't

- Use badges for long text or sentences.
- Stack multiple badges of the same variant next to each other.
- Use badges as interactive elements — they are display-only.
