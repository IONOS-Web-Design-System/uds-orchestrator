# Combobox

## Import

```jsx
import Combobox from '@ionos-web-design-system/react/combobox';
```

## Props

| Prop               | Type                                        | Default           | Description                                            |
| ------------------ | ------------------------------------------- | ------------------ | ------------------------------------------------------ |
| `options`          | `(ComboboxOption \| ComboboxGroup)[]`       | —                  | **Required.** Flat or grouped option list               |
| `value`            | `string \| string[]`                        | —                  | Controlled selection (string for single, array for multi) |
| `defaultValue`     | `string \| string[]`                        | —                  | Initial selection (uncontrolled)                        |
| `onValueChange`    | `(value: string \| string[]) => void`       | —                  | Selection change handler                                |
| `variant`          | `'default' \| 'borderless'`                 | `'default'`        | Visual style — full border or bottom-only               |
| `label`            | `string`                                    | —                  | Floating/static label text                              |
| `labelPosition`    | `'inside' \| 'top' \| 'left'`              | `'inside'`         | Label placement — overrides Form context                |
| `placeholder`      | `string`                                    | —                  | Placeholder when no value selected                      |
| `multiSelect`      | `boolean`                                   | `false`            | Enable multi-select with Pills                          |
| `searchable`       | `boolean`                                   | `true`             | Enable type-to-filter. `false` = closed select.         |
| `noMatchText`      | `string`                                    | `'No results found'` | Message when search yields no matches                 |
| `onSearchChange`   | `(query: string) => void`                   | —                  | Callback for async/server-side filtering                |
| `disabled`         | `boolean`                                   | `false`            | Disable all interaction                                 |
| `loading`          | `boolean`                                   | `false`            | Show Skeleton placeholder in popup                      |
| `validationState`  | `'success' \| 'error' \| 'warning'`         | —                  | Visual state (auto-set to 'error' from FormField)       |
| `validationMessage`| `string`                                    | —                  | Message shown below input for error/warning             |
| `clearable`        | `boolean`                                   | `false`            | Show clear button when has value                        |
| `cellSize`         | `'base' \| 'loose'`                         | `'base'`           | Density of option items in popup                        |
| `contentMaxHeight` | `string`                                    | `'340px'`          | Max height of popup panel                               |
| `name`             | `string`                                    | —                  | Form field name for native submission                   |

### Option Data Structure

```tsx
// Flat options
const options = [
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr', icon: flagDe },
  { label: 'Spain', value: 'es', disabled: true },
];

// Grouped options
const grouped = [
  {
    label: 'Europe',
    options: [
      { label: 'Germany', value: 'de' },
      { label: 'France', value: 'fr' },
    ],
  },
  {
    label: 'Asia',
    options: [{ label: 'Japan', value: 'jp' }],
  },
];
```

Ref forwarding: `React.Ref<HTMLInputElement>`.

## Usage

### Basic single select

```jsx
<Combobox
  label="Country"
  options={[
    { label: 'Germany', value: 'de' },
    { label: 'France', value: 'fr' },
    { label: 'Spain', value: 'es' },
  ]}
  onValueChange={(value) => console.log(value)}
/>
```

### Multi-select with Pills

```jsx
<Combobox
  label="Countries"
  multiSelect
  options={countries}
  defaultValue={['de', 'fr']}
  onValueChange={(values) => console.log(values)}
/>
```

### Grouped options

```jsx
<Combobox
  label="Food"
  options={[
    { label: 'Fruits', options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ]},
    { label: 'Vegetables', options: [
      { label: 'Carrot', value: 'carrot' },
    ]},
  ]}
/>
```

### Async search with loading

```jsx
const [options, setOptions] = useState([]);
const [loading, setLoading] = useState(false);

<Combobox
  label="Product"
  options={options}
  loading={loading}
  onSearchChange={(query) => {
    setLoading(true);
    fetchProducts(query).then((results) => {
      setOptions(results);
      setLoading(false);
    });
  }}
/>
```

### Inside a Form with validation

```jsx
<Form submit="Save">
  <FormField name="country" valueMissingMessage="Country is required.">
    <Combobox label="Country" options={countries} required />
  </FormField>
</Form>
```

### Controlled

```jsx
const [value, setValue] = useState('de');

<Combobox
  label="Country"
  options={countries}
  value={value}
  onValueChange={setValue}
  clearable
/>
```

## Do

- Wrap in `FormField` when using inside a `Form` for validation support.
- Use `onSearchChange` with `loading` for large datasets that need server-side
  filtering.
- Provide `noMatchText` customized to the context (e.g., "No countries found").
- Use `multiSelect` for tag/filter selection where multiple values are expected.

## Don't

- Set `validationState` manually when inside a `FormField` — the error state is
  set automatically from FormField validation context.
- Use Combobox for fewer than 3 options — use RadioGroup instead.
- Omit a `label` — the label provides accessible identification.
- Use `searchable={false}` and `multiSelect` together — multi-select needs
  search to manage many selections.
