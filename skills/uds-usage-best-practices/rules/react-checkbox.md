# Checkbox

## Import

```jsx
import Checkbox, {
  CheckboxIndicator,
  CheckboxLabel,
} from '@ionos-web-design-system/react/checkbox';
```

## Props

### Checkbox

| Prop              | Type                                            | Default | Description                  |
| ----------------- | ----------------------------------------------- | ------- | ---------------------------- |
| `defaultChecked`  | `boolean \| 'indeterminate'`                    | —       | Initial state (uncontrolled) |
| `checked`         | `boolean \| 'indeterminate'`                    | —       | Controlled state             |
| `onCheckedChange` | `(checked: boolean \| 'indeterminate') => void` | —       | State change handler         |
| `disabled`        | `boolean`                                       | `false` | Disable interaction          |
| `id`              | `string`                                        | —       | Associates with label        |
| `name`            | `string`                                        | —       | Form field name              |
| `value`           | `string`                                        | —       | Form field value             |
| `required`        | `boolean`                                       | `false` | Mark as required             |

### Compound Components

- **CheckboxIndicator** — Renders the checkmark or minus icon based on state.
- **CheckboxLabel** — Label component. Use `htmlFor` to associate with the
  Checkbox `id`.

## Usage

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Checkbox id="terms" defaultChecked>
    <CheckboxIndicator />
  </Checkbox>
  <CheckboxLabel htmlFor="terms">I agree to the terms</CheckboxLabel>
</div>
```

### Indeterminate State

Use for "select all" when only some child items are checked.

```jsx
<Checkbox checked="indeterminate">
  <CheckboxIndicator />
</Checkbox>
```

### Controlled

```jsx
const [checked, setChecked] = useState(false)

<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Checkbox id="subscribe" checked={checked} onCheckedChange={setChecked}>
    <CheckboxIndicator />
  </Checkbox>
  <CheckboxLabel htmlFor="subscribe">Subscribe to newsletter</CheckboxLabel>
</div>
```

## Do

- Always pair with `CheckboxLabel` for accessibility.
- Use `'indeterminate'` for parent checkboxes when only some children are
  selected.
- Include `CheckboxIndicator` as a child — it renders the check/minus icon.

## Don't

- Omit the label — screen readers need it.
- Use Checkbox for mutually exclusive options — use RadioGroup instead.
- Use Checkbox for instant-effect toggles — use Switch instead.
