# Selectbox

## Import

```tsx
import Selectbox, {
  SelectboxItem,
  SelectboxContent,
  SelectboxValue,
  SelectboxSeparator,
  SelectboxLabel,
  SelectboxGroup,
} from '@ionos-web-design-system/react/selectbox';
```

> **Migration note:** `Dropdown` has been renamed to `Selectbox`. See
> `rules/react-dropdown.md` for the alias mapping.

## Selectbox Props

| Prop               | Type                               | Default             | Description                                                     |
| ------------------ | ---------------------------------- | ------------------- | --------------------------------------------------------------- |
| `label`            | `string`                           | —                   | Floating/static label text                                      |
| `labelPosition`    | `'inside' \| 'top' \| 'left'`      | Form context / `'inside'` | Label placement — overrides Form context                  |
| `placeholder`      | `string`                           | —                   | Shown when no value is selected                                 |
| `variant`          | `'default' \| 'borderless'`        | `'default'`         | Visual style — `default` (full border) or bottom-border-only   |
| `value`            | `string`                           | —                   | Controlled selected value                                       |
| `defaultValue`     | `string`                           | —                   | Uncontrolled initial value                                      |
| `onValueChange`    | `(value: string) => void`          | —                   | Fires when selection changes                                    |
| `open`             | `boolean`                          | —                   | Controlled open state                                           |
| `defaultOpen`      | `boolean`                          | —                   | Uncontrolled initial open state                                 |
| `onOpenChange`     | `(open: boolean) => void`          | —                   | Fires when open state changes                                   |
| `disabled`         | `boolean`                          | `false`             | Disables all interaction                                        |
| `name`             | `string`                           | —                   | Form field name for native form submission                      |
| `validationState`  | `'success' \| 'error' \| 'warning'`| —                   | Visual validation state (auto-set to `'error'` from FormField) |
| `validationMessage`| `string`                           | —                   | Message shown below trigger for error/warning states            |
| `loading`          | `boolean`                          | `false`             | Show spinner in trailing-icon slot (replaces chevron)           |
| `contentMaxHeight` | `string \| number`                 | `'300px'`           | Max height of the dropdown panel                                |
| `testId`           | `string`                           | —                   | Rendered as `data-testid`                                       |
| `className`        | `string`                           | —                   | Extra CSS classes on the container                              |
| `contentClassName` | `string`                           | —                   | Extra CSS classes on the popover panel                          |

## SelectboxItem Props

| Prop       | Type              | Default      | Description                                                        |
| ---------- | ----------------- | ------------ | ------------------------------------------------------------------ |
| `value`    | `string`          | **required** | Unique option value (passed to `onValueChange`)                    |
| `children` | `React.ReactNode` | **required** | Item label text                                                    |
| `size`     | `'base' \| 'loose'` | `'base'`   | Padding density                                                    |
| `prefix`   | `React.ReactNode` | —            | Leading content — icon, flag, avatar, product image, etc.          |
| `suffix`   | `React.ReactNode` | —            | Trailing content before checkmark — price badge, status, etc.      |
| `disabled` | `boolean`         | `false`      | Disable this option                                                |

## Sub-components (Advanced)

Use these for fully custom dropdown panel layouts:

| Component           | Description                                   |
| ------------------- | --------------------------------------------- |
| `SelectboxContent`  | Custom popover panel (manages portal + scroll)|
| `SelectboxValue`    | Renders the currently selected value          |
| `SelectboxSeparator`| Visual divider between option groups          |
| `SelectboxLabel`    | Non-interactive section label above a group   |
| `SelectboxGroup`    | Groups related options (Radix `Select.Group`) |

## Usage

### Basic with label

```tsx
<Selectbox label="Country" placeholder="Select country">
  <SelectboxItem value="de">Germany</SelectboxItem>
  <SelectboxItem value="us">United States</SelectboxItem>
  <SelectboxItem value="gb">United Kingdom</SelectboxItem>
</Selectbox>
```

### Inside a Form (validation auto-propagated)

Wrap in `FormField` — validation state is read from context automatically.

```tsx
import Form, { FormField } from '@ionos-web-design-system/react/form';

<Form submit="Save" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
  <FormField name="country" valueMissingMessage="Please select a country.">
    <Selectbox label="Country" placeholder="Select country">
      <SelectboxItem value="de">Germany</SelectboxItem>
      <SelectboxItem value="us">United States</SelectboxItem>
    </Selectbox>
  </FormField>
</Form>
```

### With prefix (flag icon)

```tsx
import { de, us, gb } from '@ionos-web-design-system/icon/flags';

<Selectbox label="Country">
  <SelectboxItem value="de" prefix={<Icon icon={de} size="medium" />}>Germany</SelectboxItem>
  <SelectboxItem value="us" prefix={<Icon icon={us} size="medium" />}>United States</SelectboxItem>
  <SelectboxItem value="gb" prefix={<Icon icon={gb} size="medium" />}>United Kingdom</SelectboxItem>
</Selectbox>
```

### With suffix (price badge)

The item label always gets at least 45% of the row width, so the suffix never
crushes the text.

```tsx
<Selectbox label="Plan">
  <SelectboxItem value="starter" suffix={<Price size="small" data={starterPrice} />}>Starter</SelectboxItem>
  <SelectboxItem value="pro" suffix={<Price size="small" data={proPrice} />}>Professional</SelectboxItem>
</Selectbox>
```

### Borderless variant

Use in toolbars, inline selectors, or language switchers.

```tsx
<Selectbox variant="borderless" defaultValue="en">
  <SelectboxItem value="en">English</SelectboxItem>
  <SelectboxItem value="de">Deutsch</SelectboxItem>
  <SelectboxItem value="es">Español</SelectboxItem>
</Selectbox>
```

### Controlled

```tsx
const [country, setCountry] = useState('');

<Selectbox
  label="Country"
  value={country}
  onValueChange={setCountry}
  placeholder="Select country"
>
  <SelectboxItem value="de">Germany</SelectboxItem>
  <SelectboxItem value="us">United States</SelectboxItem>
</Selectbox>
```

### Grouped options

```tsx
<Selectbox label="Location">
  <SelectboxLabel>Europe</SelectboxLabel>
  <SelectboxGroup>
    <SelectboxItem value="de">Germany</SelectboxItem>
    <SelectboxItem value="fr">France</SelectboxItem>
  </SelectboxGroup>
  <SelectboxSeparator />
  <SelectboxLabel>Americas</SelectboxLabel>
  <SelectboxGroup>
    <SelectboxItem value="us">United States</SelectboxItem>
    <SelectboxItem value="ca">Canada</SelectboxItem>
  </SelectboxGroup>
</Selectbox>
```

### Loading state

Show a spinner while options are being fetched.

```tsx
<Selectbox label="Region" loading={isLoadingRegions} disabled={isLoadingRegions}>
  {regions.map((r) => (
    <SelectboxItem key={r.id} value={r.id}>{r.name}</SelectboxItem>
  ))}
</Selectbox>
```

## Do

- Use `variant="borderless"` for inline/toolbar contexts (e.g., language switcher).
- Provide a `placeholder` when no default selection makes sense.
- Use `label` to describe what the field controls.
- Wrap in `FormField` when inside a `Form` — validation state propagates automatically.
- Use `prefix` for visual cues like flags, icons, or avatars that aid option recognition.
- Use `suffix` for supplemental data (price, status) — the layout always keeps the label readable.

## Don't

- Use for fewer than 3 options — prefer `RadioGroup` or `SelectGroup` instead.
- Nest Selectboxes inside other Selectboxes.
- Omit `value` on `SelectboxItem` — each option needs a unique value.
- Use `Dropdown` in new code — it is deprecated; use `Selectbox`.
