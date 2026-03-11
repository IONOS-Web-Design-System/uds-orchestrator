# DropdownItem

## Import

```jsx
import DropdownItem from '@ionos-web-design-system/react/dropdown-item';
```

## Props

| Prop          | Type                            | Default  | Description                                         |
| ------------- | ------------------------------- | -------- | --------------------------------------------------- |
| `value`       | `string`                        | —        | **Required.** Option value (from Radix Select.Item) |
| `size`        | `'base' \| 'loose'`             | `'base'` | Vertical padding                                    |
| `type`        | `'base' \| 'flag' \| 'product'` | `'base'` | Item rendering style                                |
| `flagIcon`    | `InjectIconFunction`            | —        | Icon for `type='flag'`                              |
| `productIcon` | `InjectIconFunction`            | —        | Icon for `type='product'`                           |
| `children`    | `React.ReactNode`               | —        | Item label text                                     |

Extends Radix `Select.Item` props.

## Usage

### Base items

```jsx
<DropdownItem value="de">Germany</DropdownItem>
<DropdownItem value="us">United States</DropdownItem>
```

### Flag items

```jsx
import { de, us } from '@ionos-web-design-system/icon/flags'

<DropdownItem value="de" type="flag" flagIcon={de}>Germany</DropdownItem>
<DropdownItem value="us" type="flag" flagIcon={us}>United States</DropdownItem>
```

### Product items

```jsx
import { hostingLight } from '@ionos-web-design-system/icon/product';

<DropdownItem value="hosting" type="product" productIcon={hostingLight}>
  Web Hosting
</DropdownItem>;
```

### Loose sizing

```jsx
<DropdownItem value="option1" size="loose">
  Spacious option
</DropdownItem>
```

## Do

- Use `type="flag"` for country/locale selectors with flag icons.
- Use `type="product"` for product pickers with product icons.
- Keep all items within one Dropdown the same `type`.

## Don't

- Mix item types within a single Dropdown — pick one type and use it
  consistently.
- Use `flagIcon` without setting `type="flag"` — the icon will not render.
- Omit the `value` prop — it is required for selection to work.
