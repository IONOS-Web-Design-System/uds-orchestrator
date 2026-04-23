# ButtonIcon

## Import

```tsx
import ButtonIcon from '@ionos-web-design-system/react/button-icon';
```

## Props

| Prop        | Type                                         | Default      | Description                                         |
| ----------- | -------------------------------------------- | ------------ | --------------------------------------------------- |
| `icon`      | `InjectIconFunction`                         | **required** | Icon inject function                                |
| `size`      | `'xSmall' \| 'small' \| 'medium' \| 'large'` | `'medium'`   | Button size                                         |
| `disabled`  | `boolean`                                    | `false`      | Disables the button                                 |
| `asChild`   | `boolean`                                    | `false`      | Polymorphic rendering via Radix Slot                |
| `iconTitle` | `string`                                     | —            | Accessibility label (aria-label)                    |
| `count`     | `number`                                     | —            | Badge counter (capped at 99+)                       |
| `ai`        | `boolean`                                    | `false`      | AI gradient styling                                 |
| `loading`   | `boolean`                                    | `false`      | Shows loading state (spinner or AI comet animation) |

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

### Loading behavior

- Non-AI: replaces icon with a spinner
- AI (`ai` + `loading`): keeps icon with pulse animation + rotating comet border
- Both set `aria-busy="true"` and disable pointer events
- Animations respect `prefers-reduced-motion`

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

## ButtonIcon vs Button Icon-Only — CRITICAL

`ButtonIcon` and `Button` with `icon` prop look similar but are **different
components** with different sizing, tokens, and features. Confusing them is a
common mistake when translating Figma designs.

### Key differences

| Aspect            | `ButtonIcon`                                                     | `Button icon={...}`                              |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| **Sizes**         | `xSmall` (24px), `small` (28px), `medium` (32px), `large` (40px) | `small`, `medium`, `large` (token-based heights) |
| **Concepts**      | None (neutral styling)                                           | `brand`, `monochrome`, `ai`                      |
| **Variants**      | None                                                             | `primary`, `secondary`, `tertiary`               |
| **Badge counter** | Yes (`count` prop)                                               | No                                               |
| **Accessibility** | `iconTitle` required (→ `aria-label`)                            | Developer must add manually                      |
| **AI mode**       | `ai` boolean prop                                                | `concept="ai"`                                   |
| **Design tokens** | `surface-button-icon-*`                                          | `surface-button-*`                               |

### When to use ButtonIcon

- Standalone icon actions (close, menu toggle, notification bell)
- Needs badge counter
- Needs `xSmall` size (only available on ButtonIcon)
- Toolbar or icon button grids
- Figma layer named "ButtonIcon" or "Button Icon"

### When to use Button icon-only

- Icon button that needs concept/variant styling (brand primary, etc.)
- Part of a button group with text buttons (visual consistency)
- Figma layer named "Button" with icon-only variant

### How to verify from Figma

1. Check the component/layer name in Figma — it tells you which component
2. Check if the design shows a badge counter → `ButtonIcon`
3. Check if the design shows brand/concept coloring → `Button icon={...}`
4. Measure the size — ButtonIcon has fixed pixel heights; Button uses
   token-based heights

## Do

- Always provide `iconTitle` for accessibility — icon-only buttons need labels.
- Use `count` to show notification badges; values above 99 display as "99+".
- Use `ai` only for AI-related actions.
- Double-check Figma component name before choosing between `ButtonIcon` and
  `Button` icon-only.

## Don't

- Use without `iconTitle` — screen readers cannot interpret icon-only buttons.
- Use for actions that need a text label — use `Button` instead.
- Set `count` to 0 — hide the badge entirely when there are no items.
- Confuse with `Button icon={...}` — they have different sizes and tokens.
