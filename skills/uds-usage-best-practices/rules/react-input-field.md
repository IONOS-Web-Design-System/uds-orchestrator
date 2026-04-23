# InputField

## Import

```jsx
import InputField from '@ionos-web-design-system/react/input-field';
```

## Props

| Prop                | Type                                | Default     | Description                                       |
| ------------------- | ----------------------------------- | ----------- | ------------------------------------------------- |
| `variant`           | `'default' \| 'borderless'`         | `'default'` | Visual style — full border or bottom-only         |
| `label`             | `string`                            | —           | Label text (floating, static, or inline)          |
| `labelPosition`     | `'inside' \| 'top' \| 'left'`       | `'inside'`  | Label placement — overrides Form context value    |
| `validationState`   | `'success' \| 'error' \| 'warning'` | —           | Visual state (auto-set to 'error' from FormField) |
| `validationMessage` | `string`                            | —           | Message shown below input for error/warning       |
| `clearable`         | `boolean`                           | `false`     | Show clear button when input has value            |
| `onClear`           | `() => void`                        | —           | Callback when clear button is clicked             |
| `loading`           | `boolean`                           | `false`     | Show inline loading spinner (hides clear button)  |
| `testId`            | `string`                            | —           | Test identifier                                   |

Extends `React.InputHTMLAttributes<HTMLInputElement>` (excluding `size`).
Supports all native input props: `type`, `required`, `minLength`, `maxLength`,
`pattern`, `name`, `placeholder`, `disabled`, `value`, `defaultValue`, etc.

Ref forwarding: `React.Ref<HTMLInputElement>`.

## Usage

```jsx
<InputField label="Email" type="email" placeholder="Enter your email" />
```

### Label positions

```jsx
<InputField label="Inside (floating)" labelPosition="inside" />
<InputField label="Top" labelPosition="top" placeholder="Type here" />
<InputField label="Left" labelPosition="left" placeholder="Type here" />
```

- **inside** — Floating label animates up on focus or when input has value.
- **top** — Static label above the input.
- **left** — Label inline to the left (width set by Form's `labelWidth`).

### Validation states

```jsx
<InputField
  label="Email"
  validationState="success"
  defaultValue="valid@email.com"
/>
<InputField
  label="Email"
  validationState="error"
  validationMessage="Email is invalid."
  defaultValue="bad-email"
/>
<InputField
  label="Email"
  validationState="warning"
  validationMessage="Email looks unusual."
/>
```

### Clearable

```jsx
<InputField label="Search" clearable defaultValue="Some text" />
```

### Loading

```jsx
<InputField label="Validating" loading defaultValue="checking@email.com" />
```

### Borderless variant

```jsx
<InputField label="Name" variant="borderless" />
```

### Controlled

```jsx
const [value, setValue] = useState('')

<InputField
  label="Username"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  clearable
  onClear={() => setValue('')}
/>
```

### Inside a Form with validation

```jsx
<Form submit="Submit">
  <FormField name="email" valueMissingMessage="Email is required.">
    <InputField label="Email" type="email" required />
  </FormField>
</Form>
```

## Do

- Wrap in `FormField` when using inside a `Form` for validation support.
- Use `labelPosition` on the parent `Form` for consistent layout, and override
  on individual fields only when needed.
- Provide `validationMessage` alongside `validationState` for error/warning
  states.
- Use `clearable` for search fields and inputs users frequently re-enter.

## Don't

- Omit a `label` — the label provides accessible identification for the input.
- Set `validationState` manually when inside a `FormField` — the error state is
  set automatically from FormField validation context.
- Use `loading` and `clearable` at the same time for the same purpose — loading
  hides the clear button.
- Use InputField for multi-line text — use InputTextArea instead.
