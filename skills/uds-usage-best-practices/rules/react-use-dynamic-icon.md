# useDynamicIcon

React hook for dynamically loading icons by string name at runtime. Use this
when icon names come from data (CMS, API, database) rather than being hardcoded
in JSX.

## Import

```tsx
import { useDynamicIcon } from '@ionos-web-design-system/react';
```

Type imports (when needed):

```tsx
import type {
  IconBarrelLoader,
  UseDynamicIconResult,
  UseDynamicIconOptions,
  IconGroup,
} from '@ionos-web-design-system/react';
```

## When to Use

```
Icon needed in the UI -->
  1. Is the icon name known at build time (hardcoded in JSX)?
     YES → Static named import (tree-shakeable, zero runtime cost)
           import { bell } from '@ionos-web-design-system/icon/system';
           <Icon icon={bell} size="medium" />

     NO  → Continue to step 2

  2. Does the icon name come from data (API, CMS, database, config)?
     YES → useDynamicIcon hook
           const loader = () => import('@ionos-web-design-system/icon/ionos');
           const { icon } = useDynamicIcon(loader, dataItem.iconName);
           icon ? <Icon icon={icon} size="medium" /> : null

     NO  → Re-evaluate: the name is likely known at build time (step 1)
```

**Typical use cases for `useDynamicIcon`:**

- CMS-driven feature lists where icon names are stored in content
- API responses that include icon identifiers
- Configurable dashboards with user-selected icons
- Dynamic product pages with data-driven icon grids

**When NOT to use `useDynamicIcon`:**

- Static UIs built from Figma designs (use static imports)
- Icons hardcoded in component JSX (use static imports)
- Any case where you know the icon name at build time

## Parameters

| Parameter | Type                          | Required | Description                                                                                                        |
| --------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `loader`  | `IconBarrelLoader`            | Yes      | Arrow function with a **static** import path: `() => import('@ionos-web-design-system/icon/{group}')`              |
| `name`    | `string \| undefined \| null` | Yes      | Icon name in **kebab-case** (e.g., `"account-security"`, `"arrow-down"`). Pass `null`/`undefined` to skip loading. |
| `options` | `UseDynamicIconOptions`       | No       | `{ variant?: string }` — override the color-scheme variant (default: auto-detected from ThemeProvider)             |

### Loader definition

The loader **must** use a static import path so bundlers (Vite, webpack) can
resolve and code-split the barrel:

```tsx
// CORRECT — static path, defined at module scope
const loadIonosIcons = () => import('@ionos-web-design-system/icon/ionos');
const loadSystemIcons = () => import('@ionos-web-design-system/icon/system');

// WRONG — template literal prevents bundler resolution
const loadIcons = (group: string) =>
  import(`@ionos-web-design-system/icon/${group}`);
```

## Return Value

```tsx
interface UseDynamicIconResult {
  icon: InjectIconFunction | null; // Loaded icon inject function, or null
  isLoading: boolean; // true while barrel import is in progress
  error: string | null; // Error message if import or lookup failed
}
```

| Field       | When `null`/`false`          | When set                                   |
| ----------- | ---------------------------- | ------------------------------------------ |
| `icon`      | Loading, error, or null name | Successfully resolved — pass to `<Icon>`   |
| `isLoading` | Resolved or no name given    | Barrel import in progress                  |
| `error`     | Success or still loading     | Icon not found in barrel, or import failed |

## How It Works

1. **Barrel caching** — Uses a `WeakMap` keyed by loader function reference.
   Each barrel is loaded at most once, regardless of how many components use the
   same loader.

2. **Variant auto-detection** — Reads the current color scheme from
   `ThemeProvider` (`useTheme().color`). For groups with light/dark variants, it
   tries `{camelName}{Variant}` first (e.g., `accountSecurityLight`), then falls
   back to the exact camelCase name.

3. **Race condition protection** — If the component unmounts or the name/variant
   changes before the barrel resolves, stale state updates are cancelled via a
   cleanup flag.

4. **Null passthrough** — Passing `null` or `undefined` as `name` immediately
   returns `{ icon: null, isLoading: false, error: null }` with no async work.

## Variant Groups

| Groups with Light/Dark variants                          | Groups without variants               |
| -------------------------------------------------------- | ------------------------------------- |
| `ionos`, `brandmark`, `fasthosts`, `homepl`, `checkmark` | `system`, `social`, `flags`, `strato` |

For variant groups, the hook automatically appends the active color scheme
(`Light` or `Dark`) to the camelCase icon name. For non-variant groups, it uses
the exact camelCase name directly.

## Usage

### Basic — Brand icon with auto variant

```tsx
import { useDynamicIcon } from '@ionos-web-design-system/react';
import Icon from '@ionos-web-design-system/react/icon';

// Define loader at module scope — stable reference for caching
const loadIonosIcons = () => import('@ionos-web-design-system/icon/ionos');

function ProductFeature({ iconName }: { iconName: string }) {
  const { icon, isLoading, error } = useDynamicIcon(loadIonosIcons, iconName);

  if (error) return <span>Icon error</span>;
  if (isLoading || !icon) return <span>Loading…</span>;
  return <Icon icon={icon} size="medium" />;
}
```

### System icon (no variants)

```tsx
const loadSystemIcons = () => import('@ionos-web-design-system/icon/system');

function ActionIcon({ name }: { name: string }) {
  const { icon } = useDynamicIcon(loadSystemIcons, name);
  return icon ? <Icon icon={icon} size="small" /> : null;
}
```

### Explicit variant override

```tsx
const loadIonosIcons = () => import('@ionos-web-design-system/icon/ionos');

// Force dark variant regardless of active theme
const { icon } = useDynamicIcon(loadIonosIcons, 'account-security', {
  variant: 'dark',
});
```

### CMS-driven feature list

```tsx
const loadIonosIcons = () => import('@ionos-web-design-system/icon/ionos');

interface Feature {
  icon: string; // e.g., "cloud-data-backup"
  label: string;
}

function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {features.map((f) => (
        <li key={f.label} className="flex items-center gap-2">
          <FeatureIcon name={f.icon} />
          <span>{f.label}</span>
        </li>
      ))}
    </ul>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const { icon, isLoading } = useDynamicIcon(loadIonosIcons, name);

  if (isLoading || !icon)
    return <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />;
  return <Icon icon={icon} size="medium" />;
}
```

### Error handling

```tsx
const loadIonosIcons = () => import('@ionos-web-design-system/icon/ionos');

function SafeIcon({ name }: { name: string }) {
  const { icon, isLoading, error } = useDynamicIcon(loadIonosIcons, name);

  if (error) {
    console.warn(`Icon "${name}" failed:`, error);
    return null; // graceful fallback
  }
  if (isLoading || !icon) return null;
  return <Icon icon={icon} size="medium" />;
}
```

### Conditional icon (null/undefined name)

```tsx
const loadSystemIcons = () => import('@ionos-web-design-system/icon/system');

function OptionalIcon({ name }: { name?: string }) {
  // Passing undefined skips loading entirely — no async work, no loading state
  const { icon } = useDynamicIcon(loadSystemIcons, name ?? null);
  return icon ? <Icon icon={icon} size="small" /> : null;
}
```

## Do

- Define barrel loaders at **module scope** (outside components) for stable
  WeakMap caching.
- Use **static import paths** in the loader arrow function so bundlers can
  resolve the barrel.
- Handle **all three states** (`isLoading`, `error`, `icon`) in your UI.
- Pass the returned `icon` to `<Icon icon={icon}>` — same pattern as static
  imports.
- Use `null` or `undefined` as `name` to skip loading when no icon is needed.
- Use kebab-case for icon names (e.g., `"account-security"`, not
  `"accountSecurity"`).

## Don't

- Use `useDynamicIcon` for icons known at build time — it loads the **entire
  barrel** for the group (no tree-shaking). Use static named imports instead.
- Create loader functions inside the component body — a new function reference
  every render defeats the WeakMap cache and re-triggers the barrel load.
- Ignore the `error` state — barrel loads can fail (network issues) and icon
  names can be misspelled.
- Call the returned icon function manually — pass it as a reference:
  `icon={icon}` not `icon={icon()}`.
- Use template literal import paths in the loader — bundlers cannot resolve
  dynamic paths like ``import(`.../${group}`)``.
