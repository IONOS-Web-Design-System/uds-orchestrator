# SelectGroup

## Import

```jsx
import SelectGroup, {
  SelectGroupOption,
} from '@ionos-web-design-system/react/select-group';
```

## Props

### SelectGroup

| Prop            | Type                         | Default      | Description                      |
| --------------- | ---------------------------- | ------------ | -------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction                 |
| `defaultValue`  | `string`                     | —            | Initial selection (uncontrolled) |
| `value`         | `string`                     | —            | Controlled selection             |
| `onValueChange` | `(value: string) => void`    | —            | Selection change handler         |

### SelectGroupOption

| Prop       | Type              | Default | Description                     |
| ---------- | ----------------- | ------- | ------------------------------- |
| `id`       | `string`          | —       | **Required.** Unique identifier |
| `value`    | `string`          | —       | **Required.** Option value      |
| `label`    | `string`          | —       | **Required.** Display text      |
| `detail`   | `React.ReactNode` | —       | Right-aligned detail content    |
| `disabled` | `boolean`         | `false` | Disable this option             |

Built on RadioGroup internally for exclusive selection with richer option
rendering.

## Usage

```jsx
<SelectGroup defaultValue="basic">
  <SelectGroupOption
    id="basic"
    value="basic"
    label="Basic Plan"
    detail="$9/mo"
  />
  <SelectGroupOption id="pro" value="pro" label="Pro Plan" detail="$29/mo" />
  <SelectGroupOption
    id="enterprise"
    value="enterprise"
    label="Enterprise"
    detail="Custom"
    disabled
  />
</SelectGroup>
```

### Horizontal layout

```jsx
<SelectGroup defaultValue="monthly" orientation="horizontal">
  <SelectGroupOption
    id="monthly"
    value="monthly"
    label="Monthly"
    detail="No commitment"
  />
  <SelectGroupOption
    id="yearly"
    value="yearly"
    label="Yearly"
    detail="Save 20%"
  />
</SelectGroup>
```

### Controlled

```jsx
const [plan, setPlan] = useState('basic')

<SelectGroup value={plan} onValueChange={setPlan}>
  <SelectGroupOption id="basic" value="basic" label="Basic" detail="$9/mo" />
  <SelectGroupOption id="pro" value="pro" label="Pro" detail="$29/mo" />
</SelectGroup>
```

## Do

- Use for plan/tier selection or any exclusive choice with additional details.
- Provide `detail` to give users context (pricing, descriptions, badges).
- Set a `defaultValue` so one option is pre-selected.

## Don't

- Use when options need complex content (images, multi-line) — build a custom
  RadioGroup instead.
- Use for non-exclusive selection — use Checkbox instead.
- Omit `label` — it is the primary text for each option.
