# CardMedia

## Import

```tsx
import CardMedia from '@ionos-web-design-system/react/card-media';
```

## Props

| Prop        | Type                          | Default | Description                                            |
| ----------- | ----------------------------- | ------- | ------------------------------------------------------ |
| `media`     | `CardMediaImage \| ReactNode` | —       | Media slot: image object or custom ReactNode           |
| `children`  | `ReactNode`                   | —       | Content area rendered beside the media                 |
| `alignment` | `'top' \| 'middle'`           | `'top'` | Vertical alignment of content relative to media        |
| `bleed`     | `boolean`                     | `true`  | When true, no padding/rounded corners on the container |
| `reverse`   | `boolean`                     | `false` | When true, content on left and media on right          |
| `className` | `string`                      | —       | Additional CSS classes (e.g., background token)        |

### CardMediaImage object

When `media` is a `CardMediaImage` object, an internal `AspectRatio` is rendered
automatically.

| Field   | Type                                                                        | Default      | Description        |
| ------- | --------------------------------------------------------------------------- | ------------ | ------------------ |
| `src`   | `string`                                                                    | **required** | Image URL          |
| `ratio` | `'1/1' \| 'golden' \| '16/9' \| '4/3' \| '2/1' \| '3/1' \| '9/16' \| '3/4'` | `'16/9'`     | Aspect ratio       |
| `alt`   | `string`                                                                    | —            | Alt text for image |

When `media` is a `ReactNode`, it is rendered directly without `AspectRatio`
wrapping.

## Usage

### Default (media + content)

```tsx
<CardMedia media={{ src: '/image.jpg', ratio: '16/9', alt: 'Hero image' }}>
  <Text asChild variant="heading3xl">
    <h3>Title</h3>
  </Text>
  <Text asChild variant="body">
    <p>Description text goes here.</p>
  </Text>
  <Button concept="brand" variant="primary" size="medium">
    CTA
  </Button>
</CardMedia>
```

### Middle-aligned content

```tsx
<CardMedia
  media={{ src: '/image.jpg', ratio: '16/9', alt: 'Feature' }}
  alignment="middle"
>
  <Text asChild variant="heading3xl">
    <h3>Centered Content</h3>
  </Text>
  <Text asChild variant="body">
    <p>Vertically centered beside the media.</p>
  </Text>
</CardMedia>
```

### Reversed layout (content left, media right)

```tsx
<CardMedia media={{ src: '/image.jpg', ratio: '16/9', alt: 'Product' }} reverse>
  <Text asChild variant="heading3xl">
    <h3>Reversed</h3>
  </Text>
  <Text asChild variant="body">
    <p>Content appears on the left.</p>
  </Text>
</CardMedia>
```

### Contained (non-bleed) with background

```tsx
<CardMedia
  media={{ src: '/image.jpg', ratio: '16/9', alt: 'Promo' }}
  bleed={false}
  className="bg-surface-subtle"
>
  <Text asChild variant="heading3xl">
    <h3>Contained Card</h3>
  </Text>
  <Text asChild variant="body">
    <p>Has padding and rounded corners.</p>
  </Text>
</CardMedia>
```

### With Price component

```tsx
<CardMedia media={{ src: '/image.jpg', ratio: '16/9', alt: 'Hosting plan' }}>
  <Text asChild variant="heading3xl">
    <h3>Hosting Premium</h3>
  </Text>
  <Text asChild variant="body">
    <p>Professional hosting with SSL and backups.</p>
  </Text>
  <Price
    variant="simple"
    size="medium"
    alignment="left"
    data={{
      prelines: { primary: { preline: 'From' } },
      main: {
        integerPrice: '4',
        comma: ',',
        decimalPrice: '99',
        currency: '€',
        currencySymbolPosition: 'after',
        range: '/month',
      },
      postlines: [{ content: 'Billed annually' }],
    }}
  />
  <Button concept="brand" variant="primary" size="medium">
    Get Started
  </Button>
</CardMedia>
```

### Custom ReactNode media

```tsx
<CardMedia media={<video src="/demo.mp4" autoPlay muted loop />}>
  <Text asChild variant="heading3xl">
    <h3>Video Demo</h3>
  </Text>
  <Text asChild variant="body">
    <p>Any ReactNode works in the media slot.</p>
  </Text>
</CardMedia>
```

## Responsive Behavior

- On viewports below `md`, the layout stacks vertically (media on top, content
  below).
- On `md` and above, the layout is horizontal two-column with equal flex basis.
- The `reverse` prop only affects the `md`+ horizontal layout.

## Do

- Use a `CardMediaImage` object for standard images — it handles `AspectRatio`
  automatically.
- Set `alt` text on all `CardMediaImage` objects for accessibility.
- Use `bleed={false}` with a `className` background token for contained
  card-style layouts.
- Combine with `Text`, `Button`, `Price`, and other UDS components in the
  content area.

## Don't

- Pass a raw `<img>` tag as the `media` prop when a `CardMediaImage` object
  would suffice — the object path gives you built-in `AspectRatio` handling.
- Forget that `bleed` defaults to `true` — the container has no padding or
  rounded corners by default.
- Use hardcoded background colors — apply UDS surface tokens via `className`
  (e.g., `bg-surface-subtle`).
