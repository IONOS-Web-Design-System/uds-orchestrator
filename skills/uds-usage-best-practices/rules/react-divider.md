# Divider

## Import

```tsx
import Divider from '@ionos-web-design-system/react/divider';
```

## Props

| Prop          | Type                         | Default        | Description                                           |
| ------------- | ---------------------------- | -------------- | ----------------------------------------------------- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the divider                              |
| `decorative`  | `boolean`                    | `false`        | Marks as decorative (removes semantic separator role) |

## Description

A thin line that separates content sections. Renders with an accessible
separator role by default.

## Usage

### Horizontal divider

```tsx
<Divider />
```

### Vertical divider

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</div>
```

### Decorative divider

```tsx
<Divider decorative />
```

## Do

- Use `decorative` for visual-only dividers that don't represent a semantic
  content break.
- Use vertical dividers in flex layouts to separate inline elements.

## Don't

- Use multiple consecutive dividers — rethink the layout instead.
- Use a divider when whitespace alone provides sufficient separation.
