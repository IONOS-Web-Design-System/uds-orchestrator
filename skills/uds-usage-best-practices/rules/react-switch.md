# Switch

## Import

```jsx
import Switch, {
  SwitchThumb,
  SwitchLabel,
} from '@ionos-web-design-system/react/switch';
```

## Props

### Switch

| Prop              | Type                         | Default | Description                  |
| ----------------- | ---------------------------- | ------- | ---------------------------- |
| `defaultChecked`  | `boolean`                    | —       | Initial state (uncontrolled) |
| `checked`         | `boolean`                    | —       | Controlled state             |
| `onCheckedChange` | `(checked: boolean) => void` | —       | State change handler         |
| `disabled`        | `boolean`                    | `false` | Disable interaction          |
| `id`              | `string`                     | —       | Associates with label        |
| `name`            | `string`                     | —       | Form field name              |
| `value`           | `string`                     | —       | Form field value             |
| `required`        | `boolean`                    | `false` | Mark as required             |

### Compound Components

- **SwitchThumb** — Inner thumb element with checkmark animation.
- **SwitchLabel** — Label component. Use `htmlFor` to associate with the Switch
  `id`.

## Usage

```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Switch id="notifications" defaultChecked>
    <SwitchThumb />
  </Switch>
  <SwitchLabel htmlFor="notifications">Enable notifications</SwitchLabel>
</div>
```

### Controlled

```jsx
const [enabled, setEnabled] = useState(false)

<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  <Switch id="darkMode" checked={enabled} onCheckedChange={setEnabled}>
    <SwitchThumb />
  </Switch>
  <SwitchLabel htmlFor="darkMode">Dark mode</SwitchLabel>
</div>
```

## Do

- Always pair with `SwitchLabel` for accessibility.
- Use for settings that take effect immediately (e.g., toggles, preferences).
- Include `SwitchThumb` as a child — it renders the toggle indicator.

## Don't

- Use Switch for actions that require a submit button — use Checkbox instead.
- Omit the label — screen readers need it.
- Use Switch for multi-option selection — use Checkbox or RadioGroup.
