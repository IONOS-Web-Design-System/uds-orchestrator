# Skeleton

## Import

```jsx
import Skeleton from '@ionos-web-design-system/react/skeleton';
```

## Props

| Prop      | Type                                      | Default       | Description                                      |
| --------- | ----------------------------------------- | ------------- | ------------------------------------------------ |
| `variant` | `'rectangle' \| 'circle' \| 'text'`      | `'rectangle'` | Shape of the placeholder                         |
| `width`   | `string \| number`                        | variant-based | Width (number = px). rectangle=100%, circle=40px |
| `height`  | `string \| number`                        | variant-based | Height (number = px). rect/circle=40px, text=16px |
| `lines`   | `number`                                  | `1`           | Number of text lines (text variant only)         |
| `rounded` | `string`                                  | —             | Border-radius override                           |
| `animate` | `boolean`                                 | `true`        | Enable shimmer animation                         |

## Usage

### Rectangle (default)

```jsx
<Skeleton />
```

### Circle (avatar placeholder)

```jsx
<Skeleton variant="circle" width={48} height={48} />
```

### Text lines

```jsx
<Skeleton variant="text" lines={3} />
```

Last line renders at 70% width for a natural look.

### Card placeholder

```jsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
  <Skeleton variant="rectangle" height={160} />
  <Skeleton variant="text" lines={2} />
  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <Skeleton variant="circle" width={32} height={32} />
    <Skeleton variant="text" width={120} />
  </div>
</div>
```

### No animation

```jsx
<Skeleton animate={false} />
```

## Do

- Use Skeleton as a placeholder while content is loading.
- Match the Skeleton shape and size to the content it replaces.
- Use `variant="text"` with `lines` for paragraph placeholders.
- Skeleton respects `prefers-reduced-motion` — animation disabled
  automatically for users who prefer reduced motion.

## Don't

- Use Skeleton for empty states — use a message component instead.
- Use Skeleton indefinitely — always resolve to actual content or an error.
- Override animation with CSS — use the `animate` prop.
