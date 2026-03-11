# Pill

## Import

```tsx
import Pill from '@ionos-web-design-system/react/pill';
```

## Props

| Prop        | Type                                                             | Default     | Description                                 |
| ----------- | ---------------------------------------------------------------- | ----------- | ------------------------------------------- |
| `variant`   | `'neutral' \| 'caution' \| 'danger' \| 'success' \| 'promotion'` | `'neutral'` | Visual style and semantic meaning           |
| `actionBtn` | `boolean`                                                        | `false`     | Show close/remove button                    |
| `onClick`   | `() => void`                                                     | —           | Click handler for the pill                  |
| `onClose`   | `() => void`                                                     | —           | Close button handler (requires `actionBtn`) |
| `children`  | `React.ReactNode`                                                | —           | Label text                                  |

## Description

A compact label for status, categories, or tags. Each variant includes a leading
icon that matches its semantic meaning.

## Variants

| Variant     | Use case                           |
| ----------- | ---------------------------------- |
| `neutral`   | Default tags, categories, filters  |
| `success`   | Active states, completed, enabled  |
| `caution`   | Warnings, pending, needs attention |
| `danger`    | Errors, critical, expired          |
| `promotion` | Promotional offers, special deals  |

## Usage

### Status indicators

```tsx
<Pill variant="success">Active</Pill>
<Pill variant="danger">Error</Pill>
<Pill variant="caution">Warning</Pill>
```

### Removable tag

```tsx
<Pill variant="neutral" actionBtn onClose={handleRemove}>
  Tag name
</Pill>
```

### Promotional label

```tsx
<Pill variant="promotion">50% Off</Pill>
```

## Do

- Use `actionBtn` with `onClose` for removable tags and filters.
- Match the variant to the semantic meaning of the content.

## Don't

- Use pills for navigation — use tabs or links instead.
- Set `actionBtn` without providing an `onClose` handler.
- Use long text in pills — keep labels short (1-3 words).
