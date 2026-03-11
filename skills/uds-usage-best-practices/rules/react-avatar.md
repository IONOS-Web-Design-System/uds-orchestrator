# Avatar

## Import

```tsx
import Avatar from '@ionos-web-design-system/react/avatar';
```

## Props

| Prop       | Type                                                                                            | Default    | Description                        |
| ---------- | ----------------------------------------------------------------------------------------------- | ---------- | ---------------------------------- |
| `src`      | `string`                                                                                        | —          | Image URL                          |
| `alt`      | `string`                                                                                        | —          | Image alt text                     |
| `fallback` | `string`                                                                                        | —          | Fallback text (typically initials) |
| `size`     | `'xSmall' \| 'small' \| 'medium' \| 'large' \| 'xLarge' \| '2xLarge' \| '3xLarge' \| '4xLarge'` | `'medium'` | Avatar size                        |
| `variant`  | `'pink' \| 'yellow' \| 'orange' \| 'skeleton'`                                                  | `'pink'`   | Color variant or loading state     |

## Compound Components

For custom composition, use the lower-level parts:

- `AvatarRoot` — wrapper element
- `AvatarImage` — image element with loading detection
- `AvatarFallback` — fallback content when image fails

## Usage

### Image avatar

```tsx
<Avatar src="/user.jpg" alt="Jane Doe" size="large" />
```

### Initials fallback

```tsx
<Avatar fallback="JD" variant="pink" size="medium" />
```

### Loading skeleton

```tsx
<Avatar variant="skeleton" size="large" />
```

### Color variants for user lists

```tsx
<Avatar fallback="AB" variant="pink" />
<Avatar fallback="CD" variant="yellow" />
<Avatar fallback="EF" variant="orange" />
```

## Do

- Always provide `alt` text for image avatars.
- Use `fallback` with user initials when no image is available.
- Vary `variant` colors in lists to visually distinguish users.

## Don't

- Use `skeleton` variant for permanent display — it is for loading states only.
- Omit both `src` and `fallback` — the avatar will render empty.
- Use more than 2-3 characters in `fallback` — initials only.
