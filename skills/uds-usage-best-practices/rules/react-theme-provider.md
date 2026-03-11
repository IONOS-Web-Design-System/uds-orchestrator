# ThemeProvider

## Import

```jsx
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';
```

## Props

| Prop       | Type              | Default | Description                       |
| ---------- | ----------------- | ------- | --------------------------------- |
| `children` | `React.ReactNode` | —       | **Required.** Application content |

## useTheme Hook

```jsx
const { brand, platform, color } = useTheme();
```

| Property   | Type     | Description                                 |
| ---------- | -------- | ------------------------------------------- |
| `brand`    | `string` | Current brand (e.g., `'ionos'`, `'strato'`) |
| `platform` | `string` | `'comfortable'` or `'compact'`              |
| `color`    | `string` | `'light'` or `'dark'`                       |

ThemeProvider reads `data-brand`, `data-platform`, and `data-color-scheme`
attributes from the document root element.

## Usage

### App root setup

```jsx
import ThemeProvider from '@ionos-web-design-system/react/theme-provider';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Consuming theme values

```jsx
function BrandBanner() {
  const { brand, color } = useTheme();
  return (
    <div>
      Current brand: {brand}, mode: {color}
    </div>
  );
}
```

### HTML root attributes

Set these on your HTML element for ThemeProvider to read:

```html
<html
  data-brand="ionos"
  data-platform="comfortable"
  data-color-scheme="light"
></html>
```

## Do

- Wrap your entire app with a single `ThemeProvider` at the root.
- Set `data-brand`, `data-platform`, and `data-color-scheme` on the `<html>`
  element.
- Use `useTheme()` to read the current theme in any descendant component.

## Don't

- Nest multiple `ThemeProvider` instances — use `ThemeInverter` for local theme
  changes.
- Mutate theme values from `useTheme()` — they are read-only. Change the HTML
  attributes instead.
- Use `ThemeProvider` without setting the `data-*` attributes on the document
  root.
