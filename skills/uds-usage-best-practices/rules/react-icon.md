# Icon

## Import

```tsx
import Icon from '@ionos-web-design-system/react/icon';
```

Icons are imported from the icon package by group:

```tsx
import { bell, plus, checkmark } from '@ionos-web-design-system/icon/system';
```

## Props

| Prop    | Type                                                     | Default      | Description                                               |
| ------- | -------------------------------------------------------- | ------------ | --------------------------------------------------------- |
| `icon`  | `InjectIconFunction`                                     | **required** | Icon inject function from `@ionos-web-design-system/icon` |
| `size`  | `'xSmall' \| 'small' \| 'medium' \| 'large' \| 'xLarge'` | `'medium'`   | Icon size                                                 |
| `title` | `string`                                                 | —            | Accessibility label (sets aria-label)                     |

### Size mapping

**System icons** (system group):

| Size     | Pixels |
| -------- | ------ |
| `xSmall` | 12px   |
| `small`  | 16px   |
| `medium` | 20px   |
| `large`  | 24px   |
| `xLarge` | 32px   |

**Brand icons** (ionos group) use a larger size mapping.

> **Note:** The `brandmark` group (brand logos) should NOT use the `Icon`
> component — logos need exact Figma dimensions via a `<div>` wrapper with a
> native `<img>` inside. See `rules/icon-groups.md` (brandmark section) and
> SKILL.md section 10 (Category 4).

## Usage

### Basic

```tsx
import { bell } from '@ionos-web-design-system/icon/system';

<Icon icon={bell} size="medium" title="Notifications" />;
```

### Different sizes

```tsx
import { plus } from '@ionos-web-design-system/icon/system'

<Icon icon={plus} size="xSmall" />
<Icon icon={plus} size="small" />
<Icon icon={plus} size="medium" />
<Icon icon={plus} size="large" />
<Icon icon={plus} size="xLarge" />
```

### Decorative icon (no title)

```tsx
import { checkmark } from '@ionos-web-design-system/icon/system';

<Icon icon={checkmark} size="small" />;
```

### Standalone icon with accessibility

```tsx
import { warning } from '@ionos-web-design-system/icon/system';

<Icon icon={warning} size="large" title="Warning" />;
```

## Icon groups

Icons are organized into 9 groups. See `rules/icon-groups.md` for all groups and
`rules/core-icon-name-lookup.md` for name verification.

## Dynamic icon loading

For icon names determined at runtime (from CMS, API, or configuration data), use
the `useDynamicIcon` hook instead of static imports. See
`rules/react-use-dynamic-icon.md`.

## Do

- Provide `title` for standalone icons that convey meaning.
- Omit `title` for decorative icons next to text labels.
- Use `size="medium"` as the default for most UI contexts.
- Pass the icon function directly to the `icon` prop.

## Don't

- Call the icon function yourself — pass it as a reference: `icon={bell}` not
  `icon={bell()}`.
- Use `xLarge` system icons in compact UI — reserve large sizes for feature
  displays.
- Import icons from the wrong group — check the icon catalog for correct paths.
- Guess icon names — verify against `icon-names.json` first (see
  `rules/core-icon-name-lookup.md`).
