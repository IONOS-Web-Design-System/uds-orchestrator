# Dropdown

## Import

```jsx
import Dropdown from '@ionos-web-design-system/react/dropdown';
```

## Props

| Prop               | Type                        | Default     | Description                             |
| ------------------ | --------------------------- | ----------- | --------------------------------------- |
| `placeholder`      | `string`                    | —           | Placeholder text when no value selected |
| `label`            | `string`                    | —           | Label displayed above the value         |
| `variant`          | `'default' \| 'borderless'` | `'default'` | Visual style                            |
| `disabled`         | `boolean`                   | `false`     | Disable interaction                     |
| `defaultValue`     | `string`                    | —           | Initial selection (uncontrolled)        |
| `value`            | `string`                    | —           | Controlled selection                    |
| `contentMaxHeight` | `string \| number`          | `'300px'`   | Max height of dropdown panel            |
| `children`         | `DropdownItem[]`            | —           | **Required.** Option elements           |

## Usage

```jsx
<Dropdown placeholder="Select country" label="Country">
  <DropdownItem value="de">Germany</DropdownItem>
  <DropdownItem value="us">United States</DropdownItem>
  <DropdownItem value="gb">United Kingdom</DropdownItem>
</Dropdown>
```

### Borderless variant

```jsx
<Dropdown variant="borderless" defaultValue="en">
  <DropdownItem value="en">English</DropdownItem>
  <DropdownItem value="de">Deutsch</DropdownItem>
</Dropdown>
```

### Controlled

```jsx
const [country, setCountry] = useState('')

<Dropdown placeholder="Select country" value={country} onValueChange={setCountry}>
  <DropdownItem value="de">Germany</DropdownItem>
  <DropdownItem value="us">United States</DropdownItem>
</Dropdown>
```

### With max height

```jsx
<Dropdown placeholder="Select" contentMaxHeight="200px">
  {/* Long list of options */}
</Dropdown>
```

## Do

- Use `variant="borderless"` for inline/toolbar contexts (e.g., language
  switcher).
- Provide a `placeholder` when no default selection makes sense.
- Use `label` to describe what the dropdown controls.

## Don't

- Use Dropdown for fewer than 3 options — use RadioGroup instead.
- Nest Dropdowns inside other Dropdowns.
- Omit `value` on DropdownItem children — each option needs a unique value.
