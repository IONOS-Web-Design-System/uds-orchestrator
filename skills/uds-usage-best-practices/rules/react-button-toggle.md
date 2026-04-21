# ButtonToggle

A toggle button that switches between pressed and unpressed states. Supports
three content modes (icon-only, text-only, icon+text) with an optional inline
counter pill. Built on Radix UI Toggle for accessible toggle behavior.

## Import

```tsx
import ButtonToggle from '@ionos-web-design-system/react/button-toggle';
```

## Props

| Prop              | Type                                         | Default    | Description                                                              |
| ----------------- | -------------------------------------------- | ---------- | ------------------------------------------------------------------------ |
| `icon`            | `InjectIconFunction`                         | —          | Icon inject function from `@ionos-web-design-system/icon/{group}`        |
| `children`        | `React.ReactNode`                            | —          | Text content                                                             |
| `size`            | `'xSmall' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Button size                                                              |
| `pressed`         | `boolean`                                    | —          | Controlled pressed/toggled state                                         |
| `defaultPressed`  | `boolean`                                    | —          | Uncontrolled default pressed state                                       |
| `onPressedChange` | `(pressed: boolean) => void`                 | —          | Callback when pressed state changes                                      |
| `disabled`        | `boolean`                                    | `false`    | Disables interaction                                                     |
| `count`           | `number`                                     | —          | Inline counter pill (renders when > 0)                                   |
| `label`           | `string`                                     | —          | Accessible label (aria-label and title). **Required** for icon-only mode |
| `className`       | `string`                                     | —          | Additional CSS classes                                                   |
| `testId`          | `string`                                     | —          | Test ID; counter gets `${testId}--counter`                               |

Extends `Omit<React.ComponentPropsWithoutRef<typeof Toggle.Root>, 'children'>`.

### Content Modes

The component automatically detects content mode from the props you provide:

- **Icon-only** — `icon` provided, no `children` → renders a square button
- **Text-only** — `children` provided, no `icon` → renders a text pill
- **Icon + text** — both `icon` and `children` → icon left, text right

## Usage

### Icon-only

```tsx
import { sliderVertical } from '@ionos-web-design-system/icon/system';

<ButtonToggle icon={sliderVertical} label="Filter" />;
```

### Text-only

```tsx
<ButtonToggle label="Active">Active</ButtonToggle>
```

### Icon + text

```tsx
import { sliderVertical } from '@ionos-web-design-system/icon/system';

<ButtonToggle icon={sliderVertical} label="Filter">
  Filter
</ButtonToggle>;
```

### With counter

```tsx
import { sliderVertical } from '@ionos-web-design-system/icon/system';

<ButtonToggle icon={sliderVertical} label="Filter" count={12}>
  Filter
</ButtonToggle>;
```

### Controlled toggle

```tsx
const [pressed, setPressed] = useState(false);

<ButtonToggle pressed={pressed} onPressedChange={setPressed} label="Bold">
  Bold
</ButtonToggle>;
```

### Filter group

```tsx
import { sliderVertical } from '@ionos-web-design-system/icon/system';

const [active, setActive] = useState<Set<string>>(new Set());

const toggle = (key: string) =>
  setActive((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

<div style={{ display: 'flex', gap: 8 }}>
  <ButtonToggle
    pressed={active.has('new')}
    onPressedChange={() => toggle('new')}
  >
    New
  </ButtonToggle>
  <ButtonToggle
    pressed={active.has('sale')}
    onPressedChange={() => toggle('sale')}
  >
    Sale
  </ButtonToggle>
  <ButtonToggle
    icon={sliderVertical}
    label="More filters"
    pressed={active.has('more')}
    onPressedChange={() => toggle('more')}
    count={3}
  />
</div>;
```

## Do

- Provide `label` for icon-only toggles so screen readers can announce the
  purpose.
- Use `count` to surface the number of active filters or results.
- Use controlled state (`pressed` + `onPressedChange`) when toggle state drives
  other UI.
- Group related toggles together as filter pills with consistent sizing.

## Don't

- Omit `label` on icon-only toggles — they become inaccessible.
- Use ButtonToggle as a navigation element — it is a stateful toggle, not a link
  or tab.
- Set `count={0}` expecting a visible pill — the counter only renders when
  `count > 0`.
- Mix different `size` values within the same toggle group.
