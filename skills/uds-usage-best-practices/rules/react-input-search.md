# InputSearch

## Import

```tsx
import InputSearch from '@ionos-web-design-system/react/input-search';
```

## Props

| Prop                | Type                                | Default      | Description                                                       |
| ------------------- | ----------------------------------- | ------------ | ----------------------------------------------------------------- |
| `prefix`            | `React.ReactNode`                   | —            | Slot before the input (typically ButtonIcon or Button)             |
| `suffix`            | `React.ReactNode`                   | —            | Slot after the input (typically ButtonIcon)                        |
| `children`          | `React.ReactNode`                   | —            | Popover content — consumer-controlled search results              |
| `onSearchChange`    | `(query: string) => void`           | —            | Debounced callback fired when the search query changes             |
| `debounceMs`        | `number`                            | `300`        | Debounce delay in ms for `onSearchChange`                          |
| `open`              | `boolean`                           | —            | Controlled popover open state                                      |
| `defaultOpen`       | `boolean`                           | `false`      | Initial popover open state (uncontrolled)                          |
| `onOpenChange`      | `(open: boolean) => void`           | —            | Callback when popover open state changes                           |
| `contentMaxHeight`  | `string`                            | `'340px'`    | Max height of the popover content                                  |
| `clearable`         | `boolean`                           | `false`      | Show clear button when input has a value                           |
| `onClear`           | `() => void`                        | —            | Callback when the clear button is clicked                          |
| `loading`           | `boolean`                           | `false`      | Show Skeleton loading indicator in popover                         |
| `variant`           | `'default' \| 'borderless'`         | `'default'`  | Visual style — full border or bottom-only                          |
| `validationState`   | `'success' \| 'error' \| 'warning'` | —            | Validation state for border color and message                      |
| `validationMessage` | `string`                            | —            | Message shown below input for error/warning                        |
| `infoText`          | `string`                            | —            | Helper text shown below the input                                  |
| `testId`            | `string`                            | —            | Test identifier rendered as `data-testid`                          |

Extends `React.InputHTMLAttributes<HTMLInputElement>` (except `prefix` and `children`).

Ref forwarding: `React.Ref<HTMLInputElement>`.

## Usage

### Basic with ButtonIcon slots

```tsx
import { ButtonIcon } from '@ionos-web-design-system/react/button-icon';
import { search, mic } from '@ionos-web-design-system/icon/system';

<InputSearch
  placeholder="Search products..."
  prefix={<ButtonIcon icon={mic} size="small" iconTitle="Voice search" />}
  suffix={<ButtonIcon icon={search} size="small" iconTitle="Search" />}
/>
```

### Async search with debounced results

```tsx
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);

<InputSearch
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  onSearchChange={(q) => {
    setLoading(true);
    fetchResults(q).then((r) => { setResults(r); setLoading(false); });
  }}
  debounceMs={300}
  placeholder="Search..."
  prefix={<ButtonIcon icon={mic} size="small" iconTitle="Voice" />}
  suffix={<ButtonIcon icon={search} size="small" iconTitle="Search" />}
  clearable
  onClear={() => { setQuery(''); setResults([]); }}
  loading={loading}
>
  {results.map((r) => (
    <CellSelect key={r.value} value={r.value} label={r.label} />
  ))}
</InputSearch>
```

### Custom prefix with Button (category selector)

```tsx
<InputSearch
  placeholder={`Search in ${category}...`}
  prefix={
    <Button size="small" variant="tertiary" concept="monochrome" onClick={toggleMenu}>
      <Button.Text>{category}</Button.Text>
      <Button.Icon icon={chevronDown} />
    </Button>
  }
  suffix={<ButtonIcon icon={search} size="small" iconTitle="Search" />}
/>
```

### Custom popover with grouped sections and footer

```tsx
<InputSearch placeholder="Search..." contentMaxHeight="500px">
  {/* White background section */}
  <div className="px-4 py-3">
    <Text variant="bodyXs" weight="bold" className="uppercase">CATEGORIES</Text>
    {categories.map((c) => <ResultItem key={c.id} {...c} />)}
  </div>

  {/* Subtle background footer */}
  <div className="bg-surface-subtle px-4 py-3">
    <Text variant="bodyXs" weight="bold" className="uppercase">DOMAINS</Text>
    {domains.map((d) => <DomainItem key={d.id} {...d} />)}
  </div>
</InputSearch>
```

### Inside a Form with validation

```tsx
<Form submit="Save">
  <FormField name="search">
    <InputSearch
      placeholder="Search..."
      validationState="error"
      validationMessage="Search service is unavailable"
    />
  </FormField>
</Form>
```

## Comparison with Combobox

| Feature              | InputSearch                     | Combobox                          |
| -------------------- | ------------------------------- | --------------------------------- |
| Options list         | Consumer-provided via `children` | Component-managed via `options`    |
| Filtering            | Consumer handles (async)         | Built-in client-side filtering     |
| Result rendering     | Fully customizable               | CellSelect items                   |
| Prefix/suffix slots  | Any ReactNode (ButtonIcon, etc.) | None (chevron indicator)           |
| Label support        | No (placeholder only)            | Floating/static label              |
| Multi-select         | No                               | Yes (Pills)                        |
| Keyboard navigation  | Consumer-managed in results      | Built-in arrow/enter/escape        |

Use **InputSearch** for navigation search bars with async results and custom rendering.
Use **Combobox** for form-based select with a static or server-filtered options list.

## Do

- Use `onSearchChange` with `debounceMs` for async search — it debounces automatically.
- Pass `clearable` when the input commonly has values the user needs to reset.
- Put complex popover layouts in `children` — grouped sections, footers with different backgrounds, links.
- Use `ButtonIcon` for prefix/suffix when the action is a single icon click (voice, search, scan).
- Use `Button` (small, tertiary) for prefix when the action needs a label (category selector, scope).
- Set `contentMaxHeight` for long result lists to prevent the popover from overflowing the viewport.

## Don't

- Use InputSearch for form-based select with a known options list — use Combobox instead.
- Set `validationState` manually when inside a `FormField` — the error state is set automatically from FormField validation context.
- Forget to handle the empty state in `children` — when there are no results, render a "No results found" message.
- Omit `iconTitle` on prefix/suffix ButtonIcons — this provides accessible labels.
- Nest interactive elements (buttons, links) inside `children` without ensuring keyboard accessibility.
