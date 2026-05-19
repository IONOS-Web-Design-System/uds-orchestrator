# ButtonGhost

## Import

```tsx
import ButtonGhost from '@ionos-web-design-system/react/button-ghost';
```

## Props

| Prop       | Type              | Default      | Description                                                    |
| ---------- | ----------------- | ------------ | -------------------------------------------------------------- |
| `icon`     | `React.ReactNode` | **required** | Icon element displayed above label                             |
| `text`     | `string`          | **required** | Label text below icon (forms the accessible name)              |
| `disabled` | `boolean`         | `false`      | Disables the button                                            |
| `onClick`  | `() => void`      | —            | Click handler                                                  |
| `compact`  | `boolean`         | `false`      | Dense variant — reduces min-width to 96px, smaller padding/gap |
| `asChild`  | `boolean`         | `false`      | Render as consumer's element via Radix Slot (polymorphic)      |
| `testId`   | `string`          | —            | Rendered as `data-testid` for E2E selectors                    |

## Usage

### Basic

```tsx
import Icon from '@ionos-web-design-system/react/icon';
import { plus } from '@ionos-web-design-system/icon/system';

<ButtonGhost icon={<Icon icon={plus} />} text="Add" onClick={handleAdd} />;
```

### Compact grid

Use `compact` for dense product-launcher or feature-highlight grids where space is limited.

```tsx
<div className="grid grid-cols-4 gap-2">
  <ButtonGhost compact icon={<Icon icon={cloud} />} text="Cloud" onClick={...} />
  <ButtonGhost compact icon={<Icon icon={domain} />} text="Domains" onClick={...} />
</div>
```

### Polymorphic link (asChild)

Pass a child element (without its own children) to render ButtonGhost styles on an anchor or framework Link.

```tsx
import { globe } from '@ionos-web-design-system/icon/system';

<ButtonGhost asChild icon={<Icon icon={globe} size="medium" />} text="Domain">
  <a href="/domain" />
</ButtonGhost>
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
- Keep `text` labels short (1–2 words) — labels are clamped to one line with ellipsis.
- For long labels that cannot be shortened, add a `title` attribute so assistive tech and hover can access the full string.
- Group related ghost buttons together for consistent layout.
- Use `compact` for dense grids (product launchers, feature tiles).
- Use `asChild` with `<a>` or a framework `<Link>` when the tile should navigate.

## Don't

- Use as a primary call-to-action — use `Button` with `concept="brand"` instead.
- Use without an icon — the icon-above-label layout is the core purpose.
- Use for destructive actions without clear visual indication.
- Put `href` directly on `ButtonGhost` — use `asChild` with an `<a>` child instead.
