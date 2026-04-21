# Sidebar

Side navigation for app shells. The `Sidebar` is responsive by default: a
hamburger-triggered popover on mobile, a collapsed icon rail at tablet widths,
and a full-label column at desktop. State (active item, rail collapse, mobile
open) is managed by `SidebarProvider` and consumed via split-context hooks for
re-render efficiency.

## Import

```tsx
import Sidebar, {
  SidebarProvider,
  SidebarItem,
  SidebarGroup,
  SidebarSkeleton,
  useSidebar,
  useSidebarState,
  useSidebarOpen,
  useSidebarActions,
} from '@ionos-web-design-system/react/sidebar';
```

## Composition

- Wrap the app (or layout region) in `SidebarProvider` once — it owns
  `activeHref`, `open` (mobile), and `collapsed` state.
- Render `Sidebar` as the nav landmark with `SidebarItem` and `SidebarGroup` as
  direct children. `Sidebar` auto-wraps non-item children in a list item so the
  DOM stays valid.
- A `SidebarItem` with nested `SidebarItem`/`SidebarGroup` children becomes
  **expandable** automatically — no explicit flag required. In rail mode it
  renders as a flyout popover; in full-label mode it renders as an inline
  collapsible.
- Every top-level item must have a `prefix` icon for rail collapse to engage.
  Without full icon coverage the rail stays at full width even when
  `collapsed={true}` is set.
- Prefer the specialized hooks (`useSidebarState`, `useSidebarOpen`,
  `useSidebarActions`) over `useSidebar()` to scope re-renders.

## SidebarProvider Props

| Prop                 | Type                           | Default | Description                                                                                |
| -------------------- | ------------------------------ | ------- | ------------------------------------------------------------------------------------------ |
| `children`           | `React.ReactNode`              | —       | **Required.** Tree wrapped by the provider                                                 |
| `activeHref`         | `string`                       | —       | Controlled active href — auto-applies `aria-current="page"` on the matching `SidebarItem`  |
| `onActiveHrefChange` | `(href: string) => void`       | —       | Callback when the active href changes                                                      |
| `open`               | `boolean`                      | —       | Controlled mobile popover open state                                                       |
| `defaultOpen`        | `boolean`                      | `false` | Initial mobile open state (uncontrolled)                                                   |
| `onOpenChange`       | `(open: boolean) => void`      | —       | Callback when the mobile open state changes                                                |
| `collapsed`          | `boolean`                      | —       | Force the desktop rail collapse regardless of viewport                                     |
| `onCollapsedChange`  | `(collapsed: boolean) => void` | —       | Callback when the collapsed state changes                                                  |

## Sidebar Props

| Prop             | Type                 | Default             | Description                                                                      |
| ---------------- | -------------------- | ------------------- | -------------------------------------------------------------------------------- |
| `children`       | `React.ReactNode`    | —                   | **Required.** `SidebarItem` / `SidebarGroup` children                            |
| `aria-label`     | `string`             | `'Main navigation'` | Accessible label for the `<nav>` landmark                                        |
| `collapsedWidth` | `number \| string`   | `'52px'`            | Rail width. Exposed as `--sidebar-rail-width` for override                       |
| `responsive`     | `boolean`            | `true`              | Auto rail at `md`, full at `lg`. Set `false` to let `collapsed` drive the state  |
| `className`      | `string`             | —                   | —                                                                                |
| `testId`         | `string`             | —                   | —                                                                                |

Extends `React.HTMLAttributes<HTMLElement>`.

## SidebarGroup Props

| Prop            | Type              | Default | Description                                                                          |
| --------------- | ----------------- | ------- | ------------------------------------------------------------------------------------ |
| `children`      | `React.ReactNode` | —       | **Required.** `SidebarItem` children                                                 |
| `label`         | `string`          | —       | Group label displayed above the items                                                |
| `isSidebarItem` | `boolean`         | `false` | Internal flag — set when nested directly inside an expandable `SidebarItem`          |
| `className`     | `string`          | —       | —                                                                                    |
| `testId`        | `string`          | —       | —                                                                                    |

## SidebarItem Props

| Prop              | Type                                                              | Default  | Description                                                                         |
| ----------------- | ----------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `children`        | `React.ReactNode`                                                 | —        | **Required.** Label text (leaf) or nested `SidebarItem`/`SidebarGroup` (expandable) |
| `label`           | `string`                                                          | —        | Visible label when `children` are nested items                                      |
| `href`            | `string`                                                          | —        | Link URL. Required for leaf items; optional on expandable parents                   |
| `type`            | `'link' \| 'button'`                                              | `'link'` | Rendered element (`<a>` vs `<button>`)                                              |
| `asChild`         | `boolean`                                                         | `false`  | Polymorphic rendering via Radix Slot (e.g. Next.js `<Link>`, React Router)          |
| `prefix`          | `React.ReactNode`                                                 | —        | Leading node, typically an `Icon`. Required for rail collapse                       |
| `suffix`          | `React.ReactNode`                                                 | —        | Trailing node aligned to the end                                                    |
| `description`     | `string`                                                          | —        | Secondary text rendered below the label                                             |
| `actions`         | `React.ReactNode`                                                 | —        | Persistent action elements (e.g. `Badge`, counter)                                  |
| `actionsOnHover`  | `React.ReactNode`                                                 | —        | Action elements that replace `suffix` on hover                                      |
| `open`            | `boolean`                                                         | —        | Controlled expand state (expandable items only)                                     |
| `defaultOpen`     | `boolean`                                                         | `false`  | Initial expand state (uncontrolled)                                                 |
| `onOpenChange`    | `(open: boolean) => void`                                         | —        | Callback when the expand state changes                                              |
| `tooltip`         | `React.ReactNode`                                                 | —        | Tooltip override; defaults to the label in rail mode                                |
| `onClick`         | `React.MouseEventHandler<HTMLAnchorElement \| HTMLButtonElement>` | —        | —                                                                                   |
| `target`          | `string`                                                          | —        | `<a target>` pass-through                                                           |
| `disabled`        | `boolean`                                                         | `false`  | Disables interaction; keyboard navigation skips the item                            |
| `className`       | `string`                                                          | —        | —                                                                                   |
| `testId`          | `string`                                                          | —        | —                                                                                   |

Extends `Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'prefix' | 'type'>`.

## SidebarSkeleton Props

| Prop         | Type      | Default | Description                                                   |
| ------------ | --------- | ------- | ------------------------------------------------------------- |
| `items`      | `number`  | `4`     | Number of skeleton rows to render                             |
| `showGroups` | `boolean` | `false` | Render some rows as expandable groups with indented children  |
| `className`  | `string`  | —       | —                                                             |
| `testId`     | `string`  | —       | —                                                             |

## Hooks

All hooks throw if called outside `SidebarProvider`.

- `useSidebar()` — returns the full context (`isOpen`, `activeHref`,
  `collapsed`, `toggleSidebar`, `setActiveHref`, `setCollapsed`). Re-renders on
  any state change.
- `useSidebarState()` — `{ activeHref, collapsed }`. Use when reading state.
- `useSidebarOpen()` — `{ isOpen, toggleSidebar }`. Use for the mobile drawer.
- `useSidebarActions()` — `{ setActiveHref, setCollapsed }`. Stable callbacks
  for writers that do not need to read state.

## Usage

### Basic navigation

```tsx
import { gauge, globe, user } from '@ionos-web-design-system/icon/system';

<SidebarProvider activeHref="/dashboard">
  <Sidebar>
    <SidebarItem href="/dashboard" prefix={gauge}>
      Dashboard
    </SidebarItem>
    <SidebarItem href="/domains" prefix={globe}>
      Domains
    </SidebarItem>
    <SidebarItem href="/account" prefix={user}>
      Account
    </SidebarItem>
  </Sidebar>
</SidebarProvider>;
```

### Grouped items with a label

```tsx
<SidebarProvider activeHref="/domains/list">
  <Sidebar>
    <SidebarGroup label="Domains">
      <SidebarItem href="/domains/list" prefix={globe}>
        All domains
      </SidebarItem>
      <SidebarItem href="/domains/transfer" prefix={arrows}>
        Transfer
      </SidebarItem>
    </SidebarGroup>
  </Sidebar>
</SidebarProvider>
```

### Expandable item (auto-detected)

```tsx
<SidebarProvider activeHref="/mail/inbox">
  <Sidebar>
    <SidebarItem label="Mail" prefix={envelope}>
      <SidebarItem href="/mail/inbox">Inbox</SidebarItem>
      <SidebarItem href="/mail/sent">Sent</SidebarItem>
      <SidebarItem href="/mail/drafts">Drafts</SidebarItem>
    </SidebarItem>
  </Sidebar>
</SidebarProvider>
```

The parent auto-detects nested items and renders a flyout popover when the rail
is collapsed, or an inline collapsible when expanded.

### Custom collapse toggle

```tsx
function AppShell() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarProvider
      activeHref="/dashboard"
      collapsed={collapsed}
      onCollapsedChange={setCollapsed}
    >
      <Sidebar responsive={false}>
        <SidebarItem href="/dashboard" prefix={gauge}>
          Dashboard
        </SidebarItem>
      </Sidebar>
      <ButtonIcon
        icon={sidebarLeft}
        aria-label="Toggle sidebar"
        onClick={() => setCollapsed((c) => !c)}
      />
    </SidebarProvider>
  );
}
```

`responsive={false}` disables viewport-driven collapse so `collapsed` is the
single source of truth.

### Polymorphic link (router integration)

```tsx
<SidebarItem asChild prefix={gauge}>
  <Link to="/dashboard">Dashboard</Link>
</SidebarItem>
```

### Loading state

```tsx
{isLoading ? (
  <SidebarSkeleton items={6} showGroups />
) : (
  <Sidebar>{/* real items */}</Sidebar>
)}
```

## Accessibility

- Renders a `<nav>` landmark with `aria-label` (default `"Main navigation"`).
- Active item receives `aria-current="page"` automatically from `activeHref`.
- Roving tabindex — only the focused item is tabbable; the rest use
  `tabindex="-1"`.
- Keyboard bindings: `ArrowUp`/`ArrowDown` move focus, `ArrowRight` expands a
  collapsed parent, `ArrowLeft` collapses an expanded parent or jumps to the
  parent trigger, `Home`/`End` jump to first/last item, `Escape` blurs focus on
  desktop and closes the mobile popover.
- Disabled items are skipped by keyboard navigation and receive
  `aria-disabled="true"`.
- When an item has a `suffix` in rail mode, an indicator dot is paired with an
  `sr-only` label via `aria-describedby` so screen readers announce the status.

## Do

- Wrap the app once in `SidebarProvider` and drive routing with `activeHref`.
- Provide a `prefix` icon on every top-level `SidebarItem` so the rail can
  collapse.
- Use `asChild` to integrate with router-specific link components (Next.js
  `<Link>`, React Router) instead of hand-rolling an `<a>` wrapper.
- Use `SidebarSkeleton` during first-load data fetching so layout stays stable.
- Use the specialized hooks (`useSidebarState`, `useSidebarOpen`,
  `useSidebarActions`) when only part of the context is needed.
- Let nested `SidebarItem`/`SidebarGroup` children drive expandability — the
  parent detects them automatically.

## Don't

- Force `collapsed={true}` when some top-level items lack a `prefix` icon —
  the rail would be unusable and the component will keep it at full width.
- Apply custom classes to the child inside `asChild` (e.g. `<a className="…">`);
  put styling on `SidebarItem` itself.
- Set `aria-current` manually on items — drive it via `activeHref` on
  `SidebarProvider`.
- Build a separate mobile drawer; the provider's `open` + `toggleSidebar`
  already power the hamburger popover on `<md` viewports.
- Mix controlled and uncontrolled patterns for the same prop (e.g. pass
  `activeHref` without `onActiveHrefChange`).
- Nest a `Sidebar` inside another `Sidebar`.
