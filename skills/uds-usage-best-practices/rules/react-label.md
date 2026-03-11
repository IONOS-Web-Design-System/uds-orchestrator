# Label

## Import

```jsx
import Label from '@ionos-web-design-system/react/label';
```

## Props

| Prop       | Type                            | Default  | Description                                      |
| ---------- | ------------------------------- | -------- | ------------------------------------------------ |
| `size`     | `'xSmall' \| 'small' \| 'base'` | `'base'` | Text size                                        |
| `htmlFor`  | `string`                        | —        | Associates the label with a form control by `id` |
| `children` | `React.ReactNode`               | —        | **Required.** Label text                         |

## Usage

```jsx
<Label htmlFor="email" size="base">Email address</Label>
<input id="email" type="email" />
```

```jsx
<Label htmlFor="name" size="small">Name</Label>
<input id="name" type="text" />
```

### Size variants

```jsx
<Label size="base">Base size label</Label>
<Label size="small">Small label</Label>
<Label size="xSmall">Extra small label</Label>
```

### With UDS form components

```jsx
<Label htmlFor="country">Country</Label>
<Dropdown id="country" placeholder="Select country">
  <DropdownItem value="de">Germany</DropdownItem>
  <DropdownItem value="us">United States</DropdownItem>
</Dropdown>
```

## Do

- Always use `htmlFor` to associate the label with its form control.
- Match `size` to the form control's size for visual consistency.
- Use `size="xSmall"` for helper text or secondary labels.

## Don't

- Use Label for non-form text — use the Text component instead.
- Omit `htmlFor` — clicking the label should focus its associated control.
- Wrap the form control inside the Label — use `htmlFor`/`id` association
  instead.
