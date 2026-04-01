# Icons Quick Reference

## Available Groups

| Group     | Import Path                               | Content               |
| --------- | ----------------------------------------- | --------------------- |
| system    | `@ionos-web-design-system/icon/system`    | UI action icons       |
| social    | `@ionos-web-design-system/icon/social`    | Social media logos    |
| ionos     | `@ionos-web-design-system/icon/ionos`     | IONOS product icons   |
| brandmark | `@ionos-web-design-system/icon/brandmark` | Brand logos           |
| flags     | `@ionos-web-design-system/icon/flags`     | Country flags         |
| fasthosts | `@ionos-web-design-system/icon/fasthosts` | Fasthosts brand icons |
| homepl    | `@ionos-web-design-system/icon/homepl`    | Home.pl brand icons   |
| strato    | `@ionos-web-design-system/icon/strato`    | Strato brand icons    |
| checkmark | `@ionos-web-design-system/icon/checkmark` | Checkmark variants    |

Pass icon inject functions as **references** — `icon={plus}` not
`icon={plus()}`. Import only the icons you need from a specific group for
tree-shaking. Do NOT use the `Icon` component for brand logos (see
`rules/workflow-figma-to-code.md` Category 4).

> For naming conventions, size map, and detailed rules, see
> `rules/react-icon.md` and `rules/icon-groups.md`.

## Static vs Dynamic Icon Loading — Decision Tree

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

| Aspect           | Static Import                     | useDynamicIcon                          |
| ---------------- | --------------------------------- | --------------------------------------- |
| Tree-shaking     | Yes — only imported icons bundled | No — loads entire barrel for the group  |
| Runtime cost     | Zero                              | Async load + WeakMap cache              |
| Icon name        | Known at build time               | String from data at runtime             |
| Variant handling | Manual (import correct variant)   | Auto-detected from ThemeProvider        |
| Use case         | Static UI, Figma implementations  | CMS pages, dashboards, API-driven lists |

> For full API reference, see `rules/react-use-dynamic-icon.md`.
