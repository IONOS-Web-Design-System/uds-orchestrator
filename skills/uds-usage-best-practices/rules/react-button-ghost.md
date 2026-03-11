# ButtonGhost

## Import

```tsx
import ButtonGhost from '@ionos-web-design-system/react/button-ghost';
```

## Props

| Prop       | Type              | Default      | Description                        |
| ---------- | ----------------- | ------------ | ---------------------------------- |
| `icon`     | `React.ReactNode` | **required** | Icon element displayed above label |
| `text`     | `string`          | **required** | Label text below icon              |
| `disabled` | `boolean`         | `false`      | Disables the button                |
| `onClick`  | `() => void`      | **required** | Click handler                      |

## Usage

### Basic

```tsx
import Icon from '@ionos-web-design-system/react/icon';
import { plus } from '@ionos-web-design-system/icon/system';

<ButtonGhost icon={<Icon icon={plus} />} text="Add" onClick={handleAdd} />;
```

### Disabled

```tsx
<ButtonGhost
  icon={<Icon icon={trash} />}
  text="Delete"
  onClick={handleDelete}
  disabled
/>
```

### In a toolbar

```tsx
<div className="flex gap-4">
  <ButtonGhost icon={<Icon icon={copy} />} text="Copy" onClick={handleCopy} />
  <ButtonGhost
    icon={<Icon icon={paste} />}
    text="Paste"
    onClick={handlePaste}
  />
  <ButtonGhost icon={<Icon icon={cut} />} text="Cut" onClick={handleCut} />
</div>
```

## Do

- Use for secondary navigation or toolbar actions.
- Keep `text` labels short (1-2 words).
- Group related ghost buttons together for consistent layout.

## Don't

- Use as a primary call-to-action — use `Button` with `concept="brand"` instead.
- Use without an icon — the icon-above-label layout is the core purpose.
- Use for destructive actions without clear visual indication.
