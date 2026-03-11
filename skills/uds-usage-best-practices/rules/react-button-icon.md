# ButtonIcon

## Import

```tsx
import ButtonIcon from '@ionos-web-design-system/react/button-icon';
```

## Props

| Prop        | Type                                         | Default      | Description                          |
| ----------- | -------------------------------------------- | ------------ | ------------------------------------ |
| `icon`      | `InjectIconFunction`                         | **required** | Icon inject function                 |
| `size`      | `'xSmall' \| 'small' \| 'medium' \| 'large'` | `'medium'`   | Button size                          |
| `disabled`  | `boolean`                                    | `false`      | Disables the button                  |
| `asChild`   | `boolean`                                    | `false`      | Polymorphic rendering via Radix Slot |
| `iconTitle` | `string`                                     | —            | Accessibility label (aria-label)     |
| `count`     | `number`                                     | —            | Badge counter (capped at 99+)        |
| `ai`        | `boolean`                                    | `false`      | AI gradient styling                  |
| `loading`   | `boolean`                                    | `false`      | Shows loading spinner                |

## Usage

### Basic

```tsx
import { bell } from '@ionos-web-design-system/icon/system';

<ButtonIcon icon={bell} iconTitle="Notifications" />;
```

### With badge counter

```tsx
<ButtonIcon icon={bell} count={5} iconTitle="5 notifications" />
```

### AI styled with loading

```tsx
import { plus } from '@ionos-web-design-system/icon/system';

<ButtonIcon icon={plus} ai loading />;
```

### Size variants

```tsx
<ButtonIcon icon={bell} size="xSmall" iconTitle="Notifications" />
<ButtonIcon icon={bell} size="small" iconTitle="Notifications" />
<ButtonIcon icon={bell} size="medium" iconTitle="Notifications" />
<ButtonIcon icon={bell} size="large" iconTitle="Notifications" />
```

### Polymorphic (render as link)

```tsx
<ButtonIcon icon={externalLink} iconTitle="Open in new tab" asChild>
  <a href="https://example.com" target="_blank" />
</ButtonIcon>
```

## Do

- Always provide `iconTitle` for accessibility — icon-only buttons need labels.
- Use `count` to show notification badges; values above 99 display as "99+".
- Use `ai` only for AI-related actions.

## Don't

- Use without `iconTitle` — screen readers cannot interpret icon-only buttons.
- Use for actions that need a text label — use `Button` instead.
- Set `count` to 0 — hide the badge entirely when there are no items.
