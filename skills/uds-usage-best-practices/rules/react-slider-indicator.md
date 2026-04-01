# SliderIndicator

## Import

```tsx
import SliderIndicator from '@ionos-web-design-system/react/slider-indicator';
```

## Props

| Prop            | Type                         | Default     | Description                                      |
| --------------- | ---------------------------- | ----------- | ------------------------------------------------ |
| `count`\*       | `number`                     | —           | Total number of dots                             |
| `activeIndex`\* | `number`                     | —           | Zero-based index of the active dot               |
| `onDotClick`\*  | `(index: number) => void`    | —           | Called when a dot or arrow is clicked             |
| `getAriaLabel`  | `(index: number) => string`  | —           | Returns aria-label for each dot                  |
| `variant`       | `'default' \| 'light'`      | `'default'` | Visual variant                                   |

## Description

A row of clickable dot indicators for pagination or carousel navigation. The
`default` variant renders circular dots with prev/next arrow buttons on desktop,
switching to a "1 / 3" text indicator with arrows on mobile. The `light` variant
renders pill-shaped bars at all viewports with no arrows.

## Usage

### Basic (controlled)

```tsx
const [active, setActive] = useState(0);

<SliderIndicator
  count={5}
  activeIndex={active}
  onDotClick={setActive}
  getAriaLabel={(i) => `Slide ${i + 1}`}
/>
```

### Light variant

```tsx
<SliderIndicator
  count={3}
  activeIndex={active}
  onDotClick={setActive}
  variant="light"
  getAriaLabel={(i) => `Page ${i + 1}`}
/>
```

### With custom aria labels

```tsx
<SliderIndicator
  count={4}
  activeIndex={active}
  onDotClick={setActive}
  getAriaLabel={(i) => `Go to testimonial ${i + 1}`}
/>
```

## Do

- Always provide `getAriaLabel` for accessibility — dots without labels are
  inaccessible to screen readers.
- Use `default` variant for carousel/slider with prev/next navigation.
- Use `light` variant for compact pagination indicators.

## Don't

- Omit `getAriaLabel` — dots without labels are inaccessible.
- Use `light` variant when users need prev/next arrow navigation (arrows are
  only in `default`).
- Manage `activeIndex` outside valid range (0 to `count - 1`).
