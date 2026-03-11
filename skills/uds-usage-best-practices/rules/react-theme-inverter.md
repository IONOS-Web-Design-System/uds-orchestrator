# ThemeInverter

## Import

```jsx
import ThemeInverter from '@ionos-web-design-system/react/theme-inverter';
```

## useThemeWithInversion Hook

```jsx
import { useThemeWithInversion } from '@ionos-web-design-system/react/theme-inverter';
```

## Props

| Prop               | Type                | Default | Description                                         |
| ------------------ | ------------------- | ------- | --------------------------------------------------- |
| `children`         | `React.ReactNode`   | —       | **Required.** Content to render with inverted theme |
| `invert`           | `boolean`           | `true`  | Toggle color scheme inversion                       |
| `forceColorScheme` | `'light' \| 'dark'` | —       | Force a specific color scheme instead of inverting  |

## useThemeWithInversion Hook

```jsx
const { brand, platform, color, isInverted } = useThemeWithInversion();
```

| Property     | Type      | Description                                    |
| ------------ | --------- | ---------------------------------------------- |
| `brand`      | `string`  | Current brand                                  |
| `platform`   | `string`  | Current platform                               |
| `color`      | `string`  | Effective color scheme (after inversion)       |
| `isInverted` | `boolean` | Whether the color scheme is currently inverted |

## Usage

### Invert color scheme

Flips light to dark and dark to light.

```jsx
<ThemeInverter>
  <Card>This card uses inverted colors</Card>
</ThemeInverter>
```

### Force a specific color scheme

```jsx
<ThemeInverter forceColorScheme="dark">
  <Surface variant="base">Always dark background</Surface>
</ThemeInverter>
```

### Conditional inversion

```jsx
<ThemeInverter invert={isHeroSection}>
  <section>Conditionally inverted content</section>
</ThemeInverter>
```

### Hook usage

```jsx
function MyComponent() {
  const { brand, color, isInverted } = useThemeWithInversion();
  return (
    <div>
      Color scheme: {color} (inverted: {String(isInverted)})
    </div>
  );
}
```

## Do

- Use for hero sections, footers, or callouts that need contrast against the
  page.
- Use `forceColorScheme` when you need a guaranteed light or dark context.
- Nest inside a `ThemeProvider` — ThemeInverter depends on the theme context.

## Don't

- Use for entire pages — set `data-color-scheme` on the HTML root element
  instead.
- Combine `invert` and `forceColorScheme` — `forceColorScheme` takes precedence,
  making `invert` redundant.
- Nest multiple ThemeInverters — double inversion cancels out and causes
  confusion.
