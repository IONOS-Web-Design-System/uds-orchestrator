# RadioGroup

## Import

```jsx
import RadioGroup, {
  RadioGroupItem,
  RadioGroupIndicator,
  RadioGroupLabel,
} from '@ionos-web-design-system/react/radio-group';
```

## Props

### RadioGroup

| Prop            | Type                         | Default      | Description                      |
| --------------- | ---------------------------- | ------------ | -------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction                 |
| `defaultValue`  | `string`                     | —            | Initial selection (uncontrolled) |
| `value`         | `string`                     | —            | Controlled selection             |
| `onValueChange` | `(value: string) => void`    | —            | Selection change handler         |

### RadioGroupItem

| Prop       | Type              | Default | Description                         |
| ---------- | ----------------- | ------- | ----------------------------------- |
| `id`       | `string`          | —       | **Required.** Associates with label |
| `value`    | `string`          | —       | **Required.** Option value          |
| `children` | `React.ReactNode` | —       | Must include `RadioGroupIndicator`  |

### Compound Components

- **RadioGroupIndicator** — Renders the selected dot inside the radio circle.
- **RadioGroupLabel** — Label component. Use `htmlFor` to match the item `id`.

## Usage

```jsx
<RadioGroup defaultValue="option1" orientation="vertical">
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <RadioGroupItem id="opt1" value="option1">
      <RadioGroupIndicator />
    </RadioGroupItem>
    <RadioGroupLabel htmlFor="opt1">Option 1</RadioGroupLabel>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <RadioGroupItem id="opt2" value="option2">
      <RadioGroupIndicator />
    </RadioGroupItem>
    <RadioGroupLabel htmlFor="opt2">Option 2</RadioGroupLabel>
  </div>
</RadioGroup>
```

### Horizontal layout

```jsx
<RadioGroup defaultValue="monthly" orientation="horizontal">
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <RadioGroupItem id="monthly" value="monthly">
      <RadioGroupIndicator />
    </RadioGroupItem>
    <RadioGroupLabel htmlFor="monthly">Monthly</RadioGroupLabel>
  </div>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <RadioGroupItem id="yearly" value="yearly">
      <RadioGroupIndicator />
    </RadioGroupItem>
    <RadioGroupLabel htmlFor="yearly">Yearly</RadioGroupLabel>
  </div>
</RadioGroup>
```

## Do

- Always set a `defaultValue` so one option is pre-selected.
- Use `orientation="horizontal"` for 2-3 short options.
- Include `RadioGroupIndicator` inside each `RadioGroupItem`.

## Don't

- Use RadioGroup for more than 7 options — use Dropdown instead.
- Omit labels — always pair each item with `RadioGroupLabel`.
- Use RadioGroup for multi-select — use Checkbox instead.
