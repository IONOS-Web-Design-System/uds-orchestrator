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
<div>
  <Badge variant="price">-30%</Badge>
</div>
```

### Promotional badge

```tsx
<div>
  <Badge variant="promo">New</Badge>
</div>
```

### Neutral badge

```tsx
<div>
  <Badge variant="neutral">Beta</Badge>
</div>
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

- **Always wrap `<Badge>` in a `<div>`** — without a wrapper, Badge stretches to
  full width of its parent container.
- Keep badge text to a **single line** (1-3 words).
- Use `variant="price"` specifically for pricing-related labels.
- Place badges adjacent to the content they describe.

## Don't

- Render `<Badge>` without a `<div>` wrapper — it will expand to full width.
- Use multi-line text or sentences inside a Badge.
- Stack multiple badges of the same variant next to each other.
- Use badges as interactive elements — they are display-only.
