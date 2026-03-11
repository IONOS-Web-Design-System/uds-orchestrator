# Box

## Import

```tsx
import Box from '@ionos-web-design-system/react/box';
```

## Props

| Prop                 | Type                                                                        | Default | Description                       |
| -------------------- | --------------------------------------------------------------------------- | ------- | --------------------------------- |
| `visual`             | `object`                                                                    | —       | Top visual area configuration     |
| `visual.src`         | `string`                                                                    | —       | Image URL                         |
| `visual.ratio`       | `'1/1' \| 'golden' \| '16/9' \| '4/3' \| '2/1' \| '3/1' \| '9/16' \| '3/4'` | —       | Aspect ratio for the visual       |
| `visual.bleed`       | `boolean`                                                                   | `false` | Extends image to edges            |
| `visual.icon`        | `boolean`                                                                   | `false` | Icon mode (no aspect ratio)       |
| `visual.iconContent` | `React.ReactNode`                                                           | —       | Icon content when `icon` is true  |
| `visual.children`    | `React.ReactNode`                                                           | —       | Custom visual content             |
| `visual.className`   | `string`                                                                    | —       | Additional CSS classes for visual |
| `bleed`              | `boolean`                                                                   | `false` | Removes border radius             |
| `children`           | `React.ReactNode`                                                           | —       | Main content area                 |
| `footer`             | `React.ReactNode`                                                           | —       | Bottom section                    |
| `asChild`            | `boolean`                                                                   | `false` | Polymorphic root element          |
| `footerAsChild`      | `boolean`                                                                   | `false` | Polymorphic footer element        |

## Description

Flexible card-like layout with visual/content/footer sections.

## Usage

### Image visual with content

```tsx
<Box visual={{ src: '/hero.jpg', ratio: '16/9' }}>
  <Text variant="headingLg">Content area</Text>
</Box>
```

### Icon visual with footer action

```tsx
<Box
  visual={{ icon: true, iconContent: <Icon icon={cloudLight} size="xLarge" /> }}
  footer={<Button>Action</Button>}
>
  <Text>Description</Text>
</Box>
```

### Full-bleed image

```tsx
<Box visual={{ src: '/wide.jpg', ratio: '2/1', bleed: true }}>
  <Text>Full-width image above</Text>
</Box>
```

### Polymorphic root

```tsx
<Box asChild>
  <a href="/details">Entire box is a link</a>
</Box>
```

## Do

- Use `visual.bleed` for full-width images that extend to the card edges.
- Use `footer` for action buttons or secondary information.
- Combine `visual.icon` with `visual.iconContent` for icon-driven cards.

## Don't

- Put Box inside Box unless creating a deliberate nested layout.
- Use `asChild` without providing exactly one child element.
- Set both `visual.src` and `visual.icon` — pick one mode.
