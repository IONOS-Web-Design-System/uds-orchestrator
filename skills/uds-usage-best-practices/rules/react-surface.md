# Surface

## Import

```jsx
import Surface from '@ionos-web-design-system/react/surface';
```

## Props

| Prop       | Type                                                                                                                          | Default | Description                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------- |
| `variant`  | `'base' \| 'subtle' \| 'subtlest' \| 'highlight' \| 'disabled' \| 'success' \| 'danger' \| 'caution' \| 'promo' \| 'neutral'` | —       | **Required.** Background and text color scheme              |
| `asChild`  | `boolean`                                                                                                                     | `false` | Merge props onto child element instead of wrapping in a div |
| `children` | `React.ReactNode`                                                                                                             | —       | **Required.** Content                                       |

Text color auto-adjusts based on the variant for proper contrast.

## Variants

| Variant     | Use case                           |
| ----------- | ---------------------------------- |
| `base`      | Default background                 |
| `subtle`    | Slightly muted background          |
| `subtlest`  | Minimal background differentiation |
| `highlight` | Emphasized section                 |
| `disabled`  | Inactive/disabled content area     |
| `success`   | Positive feedback or confirmation  |
| `danger`    | Error or destructive context       |
| `caution`   | Warning or attention needed        |
| `promo`     | Promotional or special content     |
| `neutral`   | Neutral informational area         |

## Usage

```jsx
<Surface variant="base">Default background content</Surface>
<Surface variant="success">Operation completed successfully</Surface>
<Surface variant="danger">Error: Something went wrong</Surface>
<Surface variant="caution">Warning: This action cannot be undone</Surface>
<Surface variant="promo">Special offer available!</Surface>
<Surface variant="highlight">Highlighted section</Surface>
```

### Polymorphic rendering with asChild

```jsx
<Surface variant="subtle" asChild>
  <section>This renders as a section element</section>
</Surface>
```

## Do

- Use semantic variants (`success`, `danger`, `caution`) for status feedback.
- Use `asChild` when you need Surface styling on a specific HTML element.
- Combine with other components for contextual backgrounds.

## Don't

- Use Surface as a button or interactive element — it is a container only.
- Apply `variant="disabled"` to hide content — it styles but does not disable
  interaction.
- Nest Surfaces with the same variant — it adds no visual value.
