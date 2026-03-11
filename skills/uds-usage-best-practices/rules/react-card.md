# Card

## Import

```tsx
import Card from '@ionos-web-design-system/react/card';
```

## Props

| Prop       | Type                       | Default      | Description                            |
| ---------- | -------------------------- | ------------ | -------------------------------------- |
| `variant`  | `'default' \| 'clickable'` | `'default'`  | Card interaction mode                  |
| `visual`   | `object`                   | —            | Visual/image configuration (see below) |
| `children` | `React.ReactNode`          | **required** | Card body content                      |

### Visual prop

| Field         | Type                                                                        | Description                            |
| ------------- | --------------------------------------------------------------------------- | -------------------------------------- |
| `src`         | `string`                                                                    | Image URL                              |
| `ratio`       | `'1/1' \| 'golden' \| '16/9' \| '4/3' \| '2/1' \| '3/1' \| '9/16' \| '3/4'` | Aspect ratio                           |
| `bleed`       | `boolean`                                                                   | Image extends to card edges            |
| `icon`        | `boolean`                                                                   | Enable icon mode (no aspect ratio)     |
| `iconContent` | `React.ReactNode`                                                           | Icon element for visual area           |
| `children`    | `React.ReactNode`                                                           | Custom visual area content             |
| `className`   | `string`                                                                    | Additional CSS classes for visual area |

## Usage

### With image

```tsx
<Card visual={{ src: '/image.jpg', ratio: '16/9' }}>
  <Text variant="headingLg">Card Title</Text>
  <Text>Card description goes here.</Text>
</Card>
```

### Clickable with icon

```tsx
import Icon from '@ionos-web-design-system/react/icon';
import { cloudLight } from '@ionos-web-design-system/icon/system';

<Card
  variant="clickable"
  visual={{ icon: true, iconContent: <Icon icon={cloudLight} size="xLarge" /> }}
>
  <Text variant="headingLg">Cloud Feature</Text>
  <Text>Manage your cloud infrastructure.</Text>
</Card>;
```

### With bleed image

```tsx
<Card visual={{ src: '/hero.jpg', ratio: '2/1', bleed: true }}>
  <Text variant="headingLg">Full-width image</Text>
</Card>
```

### Content only (no visual)

```tsx
<Card>
  <Text variant="headingLg">Simple Card</Text>
  <Text>No image or icon, just content.</Text>
</Card>
```

## Do

- Use `variant="clickable"` when the entire card is interactive.
- Set an appropriate `ratio` for images to prevent layout shifts.
- Use `icon` mode for feature cards with iconographic visuals.

## Don't

- Put interactive elements (buttons, links) inside a `variant="clickable"` card.
- Use `bleed` without specifying a `ratio` — this can cause layout issues.
- Overload cards with too much content — keep them scannable.
