# Border Tokens

Border tokens control border, outline, and divider colors. They follow the same
semantic structure as surface and text tokens but use a **double-dash**
convention in Tailwind v4 class names.

## Why Double-Dash?

In Tailwind v4, color utilities are derived from `@theme` aliases under
`--color-*`. Since text tokens already occupy `--color-{name}` (e.g.,
`--color-base` maps to `--text-base`), border tokens use `--color--{name}`
(double-dash) to avoid collisions. This produces class names like `border--base`
instead of `border-base`.

## Base Border Tokens

| Token             | CSS Alias         | Tailwind v4 Class |
| ----------------- | ----------------- | ----------------- |
| `--border-base`   | `--color--base`   | `border--base`    |
| `--border-bolder` | `--color--bolder` | `border--bolder`  |

## Semantic Border Tokens

| Token                             | CSS Alias                         | Tailwind v4 Class                |
| --------------------------------- | --------------------------------- | -------------------------------- |
| `--border-semantic-success`       | `--color--semantic-success`       | `border--semantic-success`       |
| `--border-semantic-danger`        | `--color--semantic-danger`        | `border--semantic-danger`        |
| `--border-semantic-caution`       | `--color--semantic-caution`       | `border--semantic-caution`       |
| `--border-semantic-promotion`     | `--color--semantic-promotion`     | `border--semantic-promotion`     |
| `--border-semantic-neutral`       | `--color--semantic-neutral`       | `border--semantic-neutral`       |
| `--border-semantic-badge-price`   | `--color--semantic-badge-price`   | `border--semantic-badge-price`   |
| `--border-semantic-badge-promo`   | `--color--semantic-badge-promo`   | `border--semantic-badge-promo`   |
| `--border-semantic-badge-neutral` | `--color--semantic-badge-neutral` | `border--semantic-badge-neutral` |

## Input Border Tokens

Standard input states:

| Token                     | Tailwind v4 Class        | State          |
| ------------------------- | ------------------------ | -------------- |
| `--border-input-default`  | `border--input-default`  | Resting        |
| `--border-input-hover`    | `border--input-hover`    | Hovered        |
| `--border-input-active`   | `border--input-active`   | Focused/active |
| `--border-input-disabled` | `border--input-disabled` | Disabled       |

Input root (checkbox/radio container) states:

| Token                             | Tailwind v4 Class                | State                |
| --------------------------------- | -------------------------------- | -------------------- |
| `--border-input-root-default`     | `border--input-root-default`     | Resting (unchecked)  |
| `--border-input-root-hover`       | `border--input-root-hover`       | Hovered (unchecked)  |
| `--border-input-root-active`      | `border--input-root-active`      | Active (unchecked)   |
| `--border-input-root-disabled`    | `border--input-root-disabled`    | Disabled (unchecked) |
| `--border-input-root-default-on`  | `border--input-root-default-on`  | Resting (checked)    |
| `--border-input-root-hover-on`    | `border--input-root-hover-on`    | Hovered (checked)    |
| `--border-input-root-active-on`   | `border--input-root-active-on`   | Active (checked)     |
| `--border-input-root-disabled-on` | `border--input-root-disabled-on` | Disabled (checked)   |

Switch input states:

| Token                               | Tailwind v4 Class                  |
| ----------------------------------- | ---------------------------------- |
| `--border-input-switch-default`     | `border--input-switch-default`     |
| `--border-input-switch-hover`       | `border--input-switch-hover`       |
| `--border-input-switch-active`      | `border--input-switch-active`      |
| `--border-input-switch-disabled`    | `border--input-switch-disabled`    |
| `--border-input-switch-default-on`  | `border--input-switch-default-on`  |
| `--border-input-switch-hover-on`    | `border--input-switch-hover-on`    |
| `--border-input-switch-active-on`   | `border--input-switch-active-on`   |
| `--border-input-switch-disabled-on` | `border--input-switch-disabled-on` |

## Button Border Tokens

See [button-tokens.md](./button-tokens.md) for the complete button border token
list.

## Usage Examples

```html
<!-- Semantic borders -->
<div class="border--semantic-danger rounded-md border p-4">
  <p class="text-semantic-danger">Error content</p>
</div>

<!-- Input border states -->
<input
  class="border--input-default hover:border--input-hover focus:border--input-active border"
/>

<!-- Base border -->
<div class="border--base border">Standard bordered container</div>
```

## Tailwind v3 Differences

In Tailwind v3 (via the `udsTokens` plugin), border classes use **single-dash**
names because the plugin strips the `border-` prefix from token names:

| Tailwind v4 Class         | Tailwind v3 Class        |
| ------------------------- | ------------------------ |
| `border--base`            | `border-base`            |
| `border--semantic-danger` | `border-semantic-danger` |
| `border--input-default`   | `border-input-default`   |

The v3 plugin reads raw CSS custom properties and registers them under
`borderColor`, so the class names naturally become single-dash.

## Best Practices

**DO:**

- Use semantic border tokens alongside matching surface and text tokens from the
  same family.
- Use input border state tokens for form elements that need hover/focus/disabled
  states.
- Remember the double-dash when writing Tailwind v4 classes: `border--base`, not
  `border-base`.

**DON'T:**

- Use raw Tailwind border color classes (`border-gray-300`) — they bypass
  theming.
- Mix border semantic families with mismatched surface/text families.
- Forget to add the `border` width utility alongside the color class (e.g.,
  `border border--base`).
