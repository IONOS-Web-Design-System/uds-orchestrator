# Breadcrumbs

Navigational trail showing the user's current location within a site hierarchy.
The last item is automatically rendered as non-interactive text with
`aria-current="page"`. Supports icon-only items, inline icons, collapsible
trails with an expandable ellipsis, per-item truncation with tooltip, and two
separator styles.

## Import

```tsx
import { Breadcrumbs, BreadcrumbsItem } from '@ionos-web-design-system/react';
// or, for default export of the root:
// import Breadcrumbs, { BreadcrumbsItem } from '@ionos-web-design-system/react/breadcrumbs';
```

## Composition

- Render `Breadcrumbs` as the nav landmark; direct children must be
  `BreadcrumbsItem` elements in order from root → current page.
- The **last** `BreadcrumbsItem` is the current page — omit its `href` so it
  renders as `<span aria-current="page">`.
- For the common IONOS pattern, the first item is icon-only `Home`
  (`<BreadcrumbsItem href="/" icon={home} aria-label="Home" />`).
- Separators between items are rendered automatically and are hidden from
  assistive tech (`aria-hidden="true"`).

## Breadcrumbs Props

| Prop                  | Type                 | Default        | Description                                                                         |
| --------------------- | -------------------- | -------------- | ----------------------------------------------------------------------------------- |
| `children`            | `React.ReactNode`    | —              | **Required.** `BreadcrumbsItem` children in path order.                             |
| `variant`             | `'arrow' \| 'slash'` | `'arrow'`      | Separator style between items.                                                      |
| `collapsible`         | `boolean`            | `true`         | Collapse the trail to an ellipsis when items exceed `maxItems`.                     |
| `maxItems`            | `number`             | `5`            | Maximum visible items before collapsing. Must be `> itemsBeforeCollapse + itemsAfterCollapse`. |
| `itemsBeforeCollapse` | `number`             | `1`            | Items shown before the ellipsis when collapsed.                                     |
| `itemsAfterCollapse`  | `number`             | `1`            | Items shown after the ellipsis when collapsed.                                      |
| `expanded`            | `boolean`            | —              | Controlled expand state. When provided, the built-in ellipsis click no longer toggles state internally. |
| `onCollapse`          | `() => void`         | —              | Called when the ellipsis is clicked.                                                |
| `label`               | `string`             | `'Breadcrumb'` | Accessible label for the `<nav>` landmark.                                          |
| `testId`              | `string`             | —              | `data-testid` on the `<nav>`. Ellipsis button gets `${testId}--breadcrumb-ellipsis`.|
| `className`           | `string`             | —              | —                                                                                   |

Extends `React.ComponentPropsWithoutRef<'nav'>`.

## BreadcrumbsItem Props

| Prop             | Type                   | Default | Description                                                                               |
| ---------------- | ---------------------- | ------- | ----------------------------------------------------------------------------------------- |
| `children`       | `React.ReactNode`      | —       | Item label. Ignored when `icon` (icon-only) is set.                                       |
| `href`           | `string`               | —       | Link URL. Omit on the last item — it renders as the current page.                         |
| `icon`           | `InjectIconFunction`   | —       | Icon-only mode. **Requires `aria-label`** (dev warning emitted if omitted).               |
| `iconBefore`     | `InjectIconFunction`   | —       | Icon rendered before the text.                                                            |
| `iconAfter`      | `InjectIconFunction`   | —       | Icon rendered after the text.                                                             |
| `maxWidth`       | `number`               | —       | Max width in px before text is truncated with ellipsis. Enables a hover tooltip with the full label when truncated. |
| `asChild`        | `boolean`              | `false` | Render as the child element via Radix Slot (e.g. Next.js `<Link>`).                       |
| `onTooltipShown` | `() => void`           | —       | Called when a truncated item's tooltip is actually shown.                                 |
| `testId`         | `string`               | —       | `data-testid` on the `<li>`.                                                              |

Extends `Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>`.

## Usage

### Default (icon-only Home + text trail)

```tsx
import { Breadcrumbs, BreadcrumbsItem } from '@ionos-web-design-system/react';
import { home } from '@ionos-web-design-system/icon/system';

<Breadcrumbs>
  <BreadcrumbsItem href="/" icon={home} aria-label="Home" />
  <BreadcrumbsItem href="/hosting">Hosting</BreadcrumbsItem>
  <BreadcrumbsItem href="/hosting/packages">Packages</BreadcrumbsItem>
  <BreadcrumbsItem>Web Hosting Plus</BreadcrumbsItem>
</Breadcrumbs>;
```

### With section icons (iconBefore)

```tsx
import { server, cloud, shieldCheckmark, lock } from '@ionos-web-design-system/icon/system';

<Breadcrumbs>
  <BreadcrumbsItem href="/" icon={home} aria-label="Home" />
  <BreadcrumbsItem href="/servers" iconBefore={server}>Servers</BreadcrumbsItem>
  <BreadcrumbsItem href="/servers/vps-12345" iconBefore={cloud}>VPS Linux XL</BreadcrumbsItem>
  <BreadcrumbsItem href="/servers/vps-12345/security" iconBefore={shieldCheckmark}>Security</BreadcrumbsItem>
  <BreadcrumbsItem iconBefore={lock}>SSL Certificate</BreadcrumbsItem>
</Breadcrumbs>
```

### Collapsible deep path

```tsx
<Breadcrumbs maxItems={4} itemsBeforeCollapse={1} itemsAfterCollapse={2}>
  <BreadcrumbsItem href="/" icon={home} aria-label="Home" />
  <BreadcrumbsItem href="/hosting">Hosting</BreadcrumbsItem>
  <BreadcrumbsItem href="/hosting/packages">Packages</BreadcrumbsItem>
  <BreadcrumbsItem href="/hosting/packages/premium">Premium</BreadcrumbsItem>
  <BreadcrumbsItem href="/hosting/packages/premium/domains">Domains</BreadcrumbsItem>
  <BreadcrumbsItem href="/.../settings" iconBefore={gear}>Settings</BreadcrumbsItem>
  <BreadcrumbsItem>DNS Configuration</BreadcrumbsItem>
</Breadcrumbs>
```

The middle items collapse into a `…` button. Clicking it expands the full trail.

### Truncated long labels with tooltip

```tsx
<Breadcrumbs>
  <BreadcrumbsItem href="/" icon={home} aria-label="Home" />
  <BreadcrumbsItem href="/domains" maxWidth={140}>
    Domain Management Center
  </BreadcrumbsItem>
  <BreadcrumbsItem href="/domains/example.com" maxWidth={160} iconBefore={globe}>
    my-very-long-domain-name-example.com
  </BreadcrumbsItem>
  <BreadcrumbsItem maxWidth={180}>Advanced DNS Configuration Panel</BreadcrumbsItem>
</Breadcrumbs>
```

The tooltip opens only when the text is actually truncated (detected by
`scrollWidth > clientWidth`), not whenever the item is hovered.

### Slash separator

```tsx
<Breadcrumbs variant="slash">
  <BreadcrumbsItem href="/" icon={home} aria-label="Home" />
  <BreadcrumbsItem href="/webspace">public_html</BreadcrumbsItem>
  <BreadcrumbsItem href="/webspace/css">css</BreadcrumbsItem>
  <BreadcrumbsItem>styles.css</BreadcrumbsItem>
</Breadcrumbs>
```

### Polymorphic link (router integration)

```tsx
import NextLink from 'next/link';

<Breadcrumbs>
  <BreadcrumbsItem href="/" icon={home} aria-label="Home" />
  <BreadcrumbsItem asChild>
    <NextLink href="/hosting">Hosting</NextLink>
  </BreadcrumbsItem>
  <BreadcrumbsItem>Current Page</BreadcrumbsItem>
</Breadcrumbs>
```

### Controlled expand state

```tsx
const [expanded, setExpanded] = useState(false);

<Breadcrumbs expanded={expanded} onCollapse={() => setExpanded(true)}>
  {/* items */}
</Breadcrumbs>
```

## Accessibility

- Root renders as `<nav aria-label="Breadcrumb">` (label is configurable).
- Items render as `<ol>` / `<li>` for a proper landmark and reading order.
- The **last item** automatically receives `aria-current="page"` and renders as
  a non-interactive `<span>` — do not pass `href` on it.
- **Icon-only items require `aria-label`** — the component emits a dev warning
  if it is missing. The `aria-label` is also mirrored into an `sr-only` span
  so the label is announced.
- Separators (arrows, slashes) are `aria-hidden="true"`.
- The ellipsis button has `aria-label="Show more breadcrumbs"`.

## Do

- Keep the last item as the current page — omit its `href`.
- Give the first item an icon-only `Home` with `aria-label="Home"` for the
  standard IONOS pattern.
- Use `maxWidth` when labels can exceed the container — the tooltip makes the
  full label discoverable without breaking layout.
- Use `variant="slash"` only for file-path or developer-tool contexts; prefer
  the default `arrow` elsewhere.
- Use `asChild` to integrate with Next.js / React Router `<Link>` components.
- Provide a stable `key` on items if the list is rendered from data.

## Don't

- Put an `href` on the last item — that would make the current page clickable
  and break the `aria-current` semantics.
- Omit `aria-label` on icon-only items — screen readers will announce nothing.
- Mix controlled `expanded` with internal clicks unexpectedly — if you pass
  `expanded`, also handle `onCollapse` to update your state.
- Set `maxItems` below `itemsBeforeCollapse + itemsAfterCollapse + 1` — the
  collapse logic is disabled when the math doesn't allow a real ellipsis.
- Wrap children in non-`BreadcrumbsItem` elements — the root filters for valid
  elements and relies on positional context (last = current page).
