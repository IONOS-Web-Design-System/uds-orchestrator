# Link (ButtonLink)

> The component is exported as `Link`, not `ButtonLink`.

## Import

```tsx
import Link from '@ionos-web-design-system/react/button-link';
```

## Props

| Prop       | Type                                    | Default       | Description                          |
| ---------- | --------------------------------------- | ------------- | ------------------------------------ |
| `concept`  | `'brand' \| 'mono'`                     | `'brand'`     | Color concept                        |
| `variant`  | `'underline' \| 'dashline' \| 'inline'` | `'underline'` | Visual style                         |
| `size`     | `'base' \| 'small'`                     | `'base'`      | Text size                            |
| `icon`     | `InjectIconFunction`                    | —             | Icon inject function                 |
| `position` | `'prefix' \| 'suffix'`                  | `'prefix'`    | Icon position relative to text       |
| `asChild`  | `boolean`                               | `false`       | Polymorphic rendering via Radix Slot |

Extends `React.AnchorHTMLAttributes<HTMLAnchorElement>`.

## Usage

### Basic

```tsx
<Link href="/about">About us</Link>
```

### With icon

```tsx
import { arrowRight } from '@ionos-web-design-system/icon/system';

<Link href="/docs" icon={arrowRight} position="suffix">
  Documentation
</Link>;
```

### Inline within text

```tsx
<Text>
  Read our{' '}
  <Link variant="inline" concept="mono" href="/terms">
    terms of service
  </Link>{' '}
  for details.
</Text>
```

### Monochrome concept

```tsx
<Link concept="mono" href="/privacy">
  Privacy Policy
</Link>
```

### Polymorphic (with router)

```tsx
<Link asChild>
  <RouterLink to="/dashboard">Dashboard</RouterLink>
</Link>
```

## Variants

- **underline** — Solid underline, use for standalone links
- **dashline** — Dashed underline, lighter visual weight
- **inline** — Blends into surrounding text, use inside paragraphs

## Choosing Concept and Variant from a Design

### Concept Decision (color)

| Design Observation                                    | Concept   |
| ----------------------------------------------------- | --------- |
| Link uses the brand/accent color (blue, green, etc.)  | `brand`   |
| Link is neutral/gray, blends with body text           | `mono`    |
| Link is in a footer, breadcrumb, or secondary nav     | `mono`    |
| Link is a primary call-to-action or main navigation   | `brand`   |

### Variant Decision (underline style)

| Design Observation                                    | Variant     |
| ----------------------------------------------------- | ----------- |
| Link has a solid underline visible at rest            | `underline` |
| Link has a dashed/dotted underline                    | `dashline`  |
| Link sits inline in a paragraph with no underline     | `inline`    |
| Link shows underline only on hover                    | `inline`    |

### Common Combinations

| Use Case                          | Props                                    |
| --------------------------------- | ---------------------------------------- |
| Primary standalone link           | `concept="brand" variant="underline"`    |
| Secondary/footer link             | `concept="mono" variant="underline"`     |
| Inline link in body text          | `concept="mono" variant="inline"`        |
| Inline link in body (branded)     | `concept="brand" variant="inline"`       |
| Tooltip trigger / decorative link | `concept="mono" variant="dashline"`      |
| "Learn more" suffix link          | `concept="brand"` + `icon` + `position="suffix"` |

## Do

- Use `variant="inline"` inside body text for contextual links.
- Use `variant="underline"` for standalone navigation links.
- Use `asChild` with your router's link component for SPA navigation.
- Compare the link's rest state and hover state in the design to determine the
  correct `variant` — `underline` has a visible line at rest, `inline` only
  shows it on hover.
- Use `concept="mono"` for links inside inverted/dark sections where brand color
  may clash with the background.

## Don't

- Use links for actions (form submissions, toggles) — use `Button` instead.
- Mix `concept="brand"` and `concept="mono"` links in the same context.
- Omit `href` — links without destinations should be buttons.
- Guess the variant without checking the design — `underline` vs `inline` is a
  deliberate design choice, not interchangeable.
- Use `variant="underline"` inside flowing paragraph text — it disrupts reading
  flow. Use `variant="inline"` instead.
