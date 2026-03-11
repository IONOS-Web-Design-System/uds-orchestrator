# Progress

## Import

```tsx
import Progress from '@ionos-web-design-system/react/progress';
```

## Props

| Prop          | Type                      | Default     | Description                             |
| ------------- | ------------------------- | ----------- | --------------------------------------- |
| `value`       | `number \| null`          | —           | Current progress (null = indeterminate) |
| `max`         | `number`                  | `100`       | Maximum value                           |
| `type`        | `'linear' \| 'donut'`     | `'linear'`  | Visual style                            |
| `variant`     | `'default' \| 'semantic'` | `'default'` | Color behavior                          |
| `size`        | `number`                  | `48`        | Donut diameter in pixels                |
| `strokeWidth` | `number`                  | `6`         | Donut stroke width in pixels            |
| `showValue`   | `boolean`                 | `true`      | Display percentage text                 |

## Description

Displays completion progress as a linear bar or donut chart. The semantic
variant auto-colors based on value: danger (below 25%), caution (25-75%),
success (above 75%).

## Usage

### Linear progress

```tsx
<Progress value={65} />
```

### Semantic coloring

```tsx
<Progress value={15} variant="semantic" />  {/* Red - danger */}
<Progress value={50} variant="semantic" />  {/* Yellow - caution */}
<Progress value={90} variant="semantic" />  {/* Green - success */}
```

### Donut chart

```tsx
<Progress value={80} type="donut" size={64} />
```

### Indeterminate loading

```tsx
<Progress value={null} />
```

### Custom max

```tsx
<Progress value={3} max={5} />
```

## Do

- Use `variant="semantic"` for upload progress, storage usage, or quota
  indicators.
- Use `type="donut"` for dashboard widgets and compact displays.
- Pass `value={null}` for indeterminate/unknown-duration operations.

## Don't

- Omit `value` without reason — `null` explicitly means indeterminate loading.
- Use donut type for narrow layouts — linear works better in constrained spaces.
- Exceed `max` with the `value` — cap it at the maximum.
