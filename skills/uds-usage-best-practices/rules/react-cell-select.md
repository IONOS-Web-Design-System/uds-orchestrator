# CellSelect

## Import

```jsx
import CellSelect, { CellSelectGroup } from '@ionos-web-design-system/react/cell-select';
```

## Props

### CellSelect

| Prop       | Type                  | Default   | Description                                |
| ---------- | --------------------- | --------- | ------------------------------------------ |
| `label`    | `string`              | —         | Display text (alternative to children)     |
| `children` | `React.ReactNode`     | —         | Content (takes precedence over label)      |
| `value`    | `string`              | —         | **Required.** Option value                 |
| `icon`     | `InjectIconFunction`  | —         | Leading icon                               |
| `size`     | `'base' \| 'loose'`  | `'base'`  | Padding density                            |
| `selected` | `boolean`             | `false`   | Shows checkmark indicator                  |
| `disabled` | `boolean`             | `false`   | Disables interaction                       |
| `onClick`  | `() => void`          | —         | Click handler (not called when disabled)   |

Extends `React.HTMLAttributes<HTMLDivElement>` (excluding `onClick`).

Ref forwarding: `React.Ref<HTMLDivElement>`.

### CellSelectGroup

| Prop       | Type              | Default  | Description                         |
| ---------- | ----------------- | -------- | ----------------------------------- |
| `children` | `React.ReactNode` | —        | **Required.** Group header text     |
| `size`     | `'base' \| 'loose'` | `'base'` | Padding density                  |

Non-interactive group header for organizing options.

## Usage

### Basic

```jsx
<CellSelect label="Germany" value="de" />
```

### With label prop (Combobox pattern)

```jsx
<CellSelect label="Germany" value="de" selected />
```

### With children

```jsx
<CellSelect value="de" icon={flagDe}>
  Germany
</CellSelect>
```

### Grouped list

```jsx
<CellSelectGroup>Europe</CellSelectGroup>
<CellSelect label="Germany" value="de" selected />
<CellSelect label="France" value="fr" />
<CellSelect label="Spain" value="es" />
<CellSelectGroup>Asia</CellSelectGroup>
<CellSelect label="Japan" value="jp" />
```

### Loose size

```jsx
<CellSelect label="Germany" value="de" size="loose" />
```

## Do

- Use `label` prop when rendering inside Combobox — matches the option data
  structure pattern.
- Use `CellSelectGroup` for non-interactive section headers in option lists.
- Use `size="loose"` for touch-friendly layouts.

## Don't

- Use CellSelect outside of a list context (Combobox popup, Dropdown popup).
- Omit `value` — it is required for selection tracking.
- Use CellSelect for navigation — use Tabs or links instead.
