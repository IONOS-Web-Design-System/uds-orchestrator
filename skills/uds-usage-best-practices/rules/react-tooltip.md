# Tooltip

## Import

```jsx
import Tooltip from '@ionos-web-design-system/react/tooltip';
```

## Props

| Prop            | Type                                     | Default     | Description                       |
| --------------- | ---------------------------------------- | ----------- | --------------------------------- |
| `children`      | `React.ReactElement`                     | —           | **Required.** Trigger element     |
| `content`       | `React.ReactNode`                        | —           | **Required.** Tooltip text        |
| `side`          | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'`     | Tooltip placement                 |
| `align`         | `'start' \| 'center' \| 'end'`           | `'center'`  | Alignment along the side          |
| `sideOffset`    | `number`                                 | `4`         | Distance from trigger in px       |
| `width`         | `'default' \| 'wide'`                    | `'default'` | Tooltip width                     |
| `open`          | `boolean`                                | —           | Controlled visibility             |
| `defaultOpen`   | `boolean`                                | —           | Initial visibility (uncontrolled) |
| `delayDuration` | `number`                                 | `250`       | Delay before showing (ms)         |

Tooltip uses `ThemeInverter` internally (forced dark background) for visibility
contrast.

## Usage

```jsx
<Tooltip content="Delete this item">
  <ButtonIcon icon={bin} iconTitle="Delete" />
</Tooltip>
```

```jsx
<Tooltip
  content="This is a longer explanation of the feature"
  width="wide"
  side="bottom"
>
  <span>Hover for info</span>
</Tooltip>
```

### Controlled visibility

```jsx
const [open, setOpen] = useState(false)

<Tooltip content="Controlled tooltip" open={open} onOpenChange={setOpen}>
  <Button>Trigger</Button>
</Tooltip>
```

## Do

- Use for supplementary, non-essential information.
- Keep content concise — one or two sentences maximum.
- Use `width="wide"` only when the content genuinely needs more space.

## Don't

- Put interactive elements (links, buttons) inside tooltips.
- Use tooltips for critical information the user must see — use inline text
  instead.
- Wrap elements that are not focusable — the trigger must be
  keyboard-accessible.
