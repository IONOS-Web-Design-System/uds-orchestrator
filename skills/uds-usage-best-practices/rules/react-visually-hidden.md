# VisuallyHidden

## Import

```tsx
import VisuallyHidden from '@ionos-web-design-system/react/visually-hidden';
```

## Props

| Prop       | Type              | Default    | Description                            |
| ---------- | ----------------- | ---------- | -------------------------------------- |
| `children` | `React.ReactNode` | _required_ | Content visible only to screen readers |

## Description

Renders content that is visually hidden but remains accessible to screen readers
and assistive technology. The content is present in the DOM and announced by
screen readers, but invisible on screen.

## Usage

### Accessible icon button

```tsx
<button>
  <Icon icon={plus} />
  <VisuallyHidden>Add new item</VisuallyHidden>
</button>
```

### Accessible link context

```tsx
<a href="/settings">
  <Icon icon={gear} />
  <VisuallyHidden>Account settings</VisuallyHidden>
</a>
```

### Additional table context

```tsx
<th>
  <VisuallyHidden>Actions</VisuallyHidden>
</th>
```

## Do

- Use for providing accessible labels when visual context (icons, layout) is
  sufficient for sighted users.
- Use for adding screen-reader-only instructions or context.

## Don't

- Hide important content that sighted users also need to see.
- Use as a replacement for proper `aria-label` attributes when those are more
  appropriate.
- Wrap large blocks of content — keep hidden text concise.
