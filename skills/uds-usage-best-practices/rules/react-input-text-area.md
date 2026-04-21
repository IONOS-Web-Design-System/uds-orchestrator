# InputTextArea

## Import

```jsx
import InputTextArea from '@ionos-web-design-system/react/input-text-area';
```

## Props

| Prop                | Type                                 | Default     | Description                                       |
| ------------------- | ------------------------------------ | ----------- | ------------------------------------------------- |
| `variant`           | `'default' \| 'borderless'`         | `'default'` | Visual style — full border or bottom-only         |
| `label`             | `string`                             | —           | Label text (floating, static, or inline)          |
| `labelPosition`     | `'inside' \| 'top' \| 'left'`       | `'inside'`  | Label placement — overrides Form context value    |
| `validationState`   | `'success' \| 'error' \| 'warning'` | —           | Visual state (auto-set to 'error' from FormField) |
| `validationMessage` | `string`                             | —           | Message shown below input for error/warning       |
| `clearable`         | `boolean`                            | `false`     | Show clear button when input has value            |
| `onClear`           | `() => void`                         | —           | Callback when clear button is clicked             |
| `rows`              | `number`                             | `3`         | Number of visible text rows                       |
| `autoResize`        | `boolean`                            | `false`     | Auto-grow height to fit content                   |
| `loading`           | `boolean`                            | `false`     | Show inline loading spinner                       |
| `testId`            | `string`                             | —           | Test identifier                                   |

Extends `React.TextareaHTMLAttributes<HTMLTextAreaElement>` (excluding `size`).
Supports native textarea props: `required`, `minLength`, `maxLength`, `name`,
`placeholder`, `disabled`, `value`, `defaultValue`, etc.

Ref forwarding: `React.Ref<HTMLTextAreaElement>`.

## Usage

```jsx
<InputTextArea label="Description" placeholder="Enter a description" />
```

### Auto-resize

The textarea grows with content when `autoResize` is enabled. Native resize
is disabled in this mode.

```jsx
<InputTextArea
  label="Bio"
  autoResize
  defaultValue="This textarea grows as you type more content."
/>
```

### Validation states

```jsx
<InputTextArea
  label="Comments"
  validationState="error"
  validationMessage="Comments are required."
/>
<InputTextArea
  label="Bio"
  validationState="warning"
  validationMessage="Bio exceeds recommended length."
/>
<InputTextArea
  label="Notes"
  validationState="success"
  defaultValue="Looks good!"
/>
```

### Label positions

```jsx
<InputTextArea label="Inside" labelPosition="inside" />
<InputTextArea label="Top" labelPosition="top" />
<InputTextArea label="Left" labelPosition="left" />
```

### Custom row count

```jsx
<InputTextArea label="Notes" rows={6} />
```

### Inside a Form with validation

```jsx
<Form submit="Save">
  <FormField name="bio">
    <InputTextArea label="Bio" rows={3} autoResize />
  </FormField>
</Form>
```

## Do

- Use `autoResize` for fields where content length varies (e.g., bios,
  descriptions).
- Wrap in `FormField` when using inside a `Form` for validation support.
- Set `rows` to a reasonable default that matches expected content length.

## Don't

- Use InputTextArea for single-line input — use InputField instead.
- Set `validationState` manually when inside a `FormField` — the error state is
  set automatically from FormField validation context.
- Combine `autoResize` with a CSS `max-height` unless you also add
  `overflow: auto` — content will be clipped without scrolling.
