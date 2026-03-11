# Button

## Import

```tsx
import Button from '@ionos-web-design-system/react/button';
```

## Props

| Prop               | Type                                     | Default        | Description                             |
| ------------------ | ---------------------------------------- | -------------- | --------------------------------------- |
| `concept`          | `'brand' \| 'monochrome' \| 'ai'`        | `'monochrome'` | Visual concept theme                    |
| `variant`          | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'`    | Button emphasis level                   |
| `size`             | `'small' \| 'medium' \| 'large'`         | `'medium'`     | Button size                             |
| `icon`             | `InjectIconFunction`                     | —              | Icon inject function for icon-only mode |
| `loading`          | `boolean`                                | `false`        | Shows spinner, disables interaction     |
| `loadingText`      | `string`                                 | —              | Text displayed alongside spinner        |
| `spinnerPlacement` | `'start' \| 'end'`                       | `'start'`      | Spinner position relative to text       |
| `asChild`          | `boolean`                                | `false`        | Polymorphic rendering via Radix Slot    |
| `disabled`         | `boolean`                                | `false`        | Disables the button                     |

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.

### Compound Components

- `Button.Icon` — Custom icon slot
- `Button.Text` — Custom text slot

## Usage

### Basic

```tsx
<Button concept="brand" variant="primary" size="medium">
  Click me
</Button>
```

### Icon-only

```tsx
import { plus } from '@ionos-web-design-system/icon/system';

<Button icon={plus} />;
```

### Loading state

```tsx
<Button loading loadingText="Saving...">
  Save
</Button>
```

### AI concept

```tsx
<Button concept="ai" variant="primary">
  Generate
</Button>
```

### Polymorphic (render as link)

```tsx
<Button asChild>
  <a href="/next">Continue</a>
</Button>
```

## Variants

- **primary** — High emphasis, filled background
- **secondary** — Medium emphasis, outlined
- **tertiary** — Low emphasis, text-only

## Do

- Use `concept="brand"` for primary call-to-action buttons.
- Use `concept="ai"` exclusively for AI-powered features.
- Provide `loadingText` when using `loading` to communicate state.

## Don't

- Nest buttons inside other buttons.
- Use `variant="tertiary"` for primary actions.
- Use `concept="ai"` for non-AI functionality.
