# Banner

## Import

```tsx
import Banner from '@ionos-web-design-system/react/banner';
```

## Props

| Prop          | Type                                    | Default      | Description                    |
| ------------- | --------------------------------------- | ------------ | ------------------------------ |
| `variant`     | `'success' \| 'promotion' \| 'neutral'` | `'success'`  | Banner type with matching icon |
| `size`        | `'base' \| 'tight'`                     | `'base'`     | Vertical padding               |
| `dismissible` | `boolean`                               | `false`      | Shows close button             |
| `onDismiss`   | `() => void`                            | —            | Callback when dismissed        |
| `children`    | `React.ReactNode`                       | **required** | Banner content                 |

### Variant icons

Each variant includes a leading icon automatically:

- **success** — checkmark icon
- **promotion** — crown icon
- **neutral** — life-ring icon

## Usage

### Success

```tsx
<Banner variant="success">Your changes have been saved.</Banner>
```

### Dismissible promotion

```tsx
<Banner variant="promotion" dismissible onDismiss={handleDismiss}>
  Special offer: 50% off all plans!
</Banner>
```

### Neutral information

```tsx
<Banner variant="neutral">
  System maintenance scheduled for Sunday 2:00 AM.
</Banner>
```

### Tight size

```tsx
<Banner variant="success" size="tight">
  Saved successfully.
</Banner>
```

## Do

- Use `success` for confirmations and positive outcomes.
- Use `promotion` for offers, announcements, and marketing messages.
- Use `neutral` for informational or system-level notices.
- Provide `onDismiss` when `dismissible` is true.

## Don't

- Use banners for form validation errors — use inline error messages.
- Stack multiple banners of the same variant — consolidate the message.
- Use `dismissible` without `onDismiss` — the close button would do nothing.
