# Button Tokens

Button tokens define surface, text, and border colors for every button type and
state. These tokens are consumed by Button components — prefer using the
component directly over building buttons from raw tokens.

## Surface Tokens

Pattern: `--surface-button-{type}-{state}` → Tailwind:
`bg-surface-button-{type}-{state}`

### Types and States

| Type          | Default                              | Hover                              | Active                              | Disabled                              |
| ------------- | ------------------------------------ | ---------------------------------- | ----------------------------------- | ------------------------------------- |
| **primary**   | `--surface-button-primary-default`   | `--surface-button-primary-hover`   | `--surface-button-primary-active`   | `--surface-button-primary-disabled`   |
| **secondary** | `--surface-button-secondary-default` | `--surface-button-secondary-hover` | `--surface-button-secondary-active` | `--surface-button-secondary-disabled` |
| **tertiary**  | `--surface-button-tertiary-default`  | `--surface-button-tertiary-hover`  | `--surface-button-tertiary-active`  | `--surface-button-tertiary-disabled`  |
| **icon**      | `--surface-button-icon-default`      | `--surface-button-icon-hover`      | `--surface-button-icon-active`      | `--surface-button-icon-disabled`      |
| **callout**   | `--surface-button-callout-default`   | `--surface-button-callout-hover`   | `--surface-button-callout-active`   | —                                     |
| **switcher**  | `--surface-button-switcher-default`  | `--surface-button-switcher-hover`  | `--surface-button-switcher-active`  | `--surface-button-switcher-disabled`  |

Tailwind v4 usage: `bg-surface-button-primary-default`,
`hover:bg-surface-button-primary-hover`, etc.

## Text Tokens

Pattern: `--text-button-{type}-{state}` → Tailwind: `text-button-{type}-{state}`

| Type          | Default                           | Hover                           | Active                           | Disabled                           |
| ------------- | --------------------------------- | ------------------------------- | -------------------------------- | ---------------------------------- |
| **primary**   | `--text-button-primary-default`   | `--text-button-primary-hover`   | `--text-button-primary-active`   | `--text-button-primary-disabled`   |
| **secondary** | `--text-button-secondary-default` | `--text-button-secondary-hover` | `--text-button-secondary-active` | `--text-button-secondary-disabled` |
| **tertiary**  | `--text-button-tertiary-default`  | `--text-button-tertiary-hover`  | `--text-button-tertiary-active`  | `--text-button-tertiary-disabled`  |
| **icon**      | `--text-button-icon-default`      | `--text-button-icon-hover`      | `--text-button-icon-active`      | `--text-button-icon-disabled`      |
| **callout**   | `--text-button-callout-default`   | `--text-button-callout-hover`   | `--text-button-callout-active`   | `--text-button-callout-disabled`   |
| **switcher**  | `--text-button-switcher-default`  | `--text-button-switcher-hover`  | `--text-button-switcher-active`  | `--text-button-switcher-disabled`  |

Tailwind v4 usage: `text-button-primary-default`,
`hover:text-button-primary-hover`, etc.

## Border Tokens

Pattern: `--border-button-{type}-{state}` → Tailwind v4:
`border--button-{type}-{state}` (double-dash)

| Type          | Default                             | Hover                             | Active                             | Disabled                             |
| ------------- | ----------------------------------- | --------------------------------- | ---------------------------------- | ------------------------------------ |
| **primary**   | `--border-button-primary-default`   | `--border-button-primary-hover`   | `--border-button-primary-active`   | `--border-button-primary-disabled`   |
| **secondary** | `--border-button-secondary-default` | `--border-button-secondary-hover` | `--border-button-secondary-active` | `--border-button-secondary-disabled` |
| **tertiary**  | `--border-button-tertiary-default`  | `--border-button-tertiary-hover`  | `--border-button-tertiary-active`  | `--border-button-tertiary-disabled`  |

Tailwind v4 usage: `border--button-primary-default`,
`hover:border--button-primary-hover`, etc.

**v4/v3 difference:** In Tailwind v4, border classes use double-dash
(`border--button-primary-default`). In Tailwind v3, they use single-dash
(`border-button-primary-default`). See [border-tokens.md](./border-tokens.md).

## Monochrome Variants

Monochrome button tokens provide black/white button styles for use on
brand-colored or photographic backgrounds:

```
--surface-button-mono-primary-default
--surface-button-mono-primary-hover
--surface-button-mono-primary-active
--surface-button-mono-primary-disabled
```

The same pattern applies for `text` and `border` categories with the `mono-`
prefix.

## Protected Sizing Tokens

Button height tokens are "protected" — they remain constant across themes to
ensure consistent layout:

| Token                          | Size                           |
| ------------------------------ | ------------------------------ |
| `--protected-button-height-sm` | Small button height            |
| `--protected-button-height-md` | Medium button height (default) |
| `--protected-button-height-lg` | Large button height            |

These values do not change between brands or color schemes, ensuring buttons
maintain consistent sizing in all theme combinations.

## Usage Guidance

Prefer using the `Button` component from `@ionos-web-design-system/react`
instead of manually applying these tokens. The component handles all states,
accessibility, and token mapping internally.

If you must use tokens directly (e.g., for custom button-like elements):

```css
.custom-button {
  background: var(--surface-button-primary-default);
  color: var(--text-button-primary-default);
  border-color: var(--border-button-primary-default);
  height: var(--protected-button-height-md);
}

.custom-button:hover {
  background: var(--surface-button-primary-hover);
  color: var(--text-button-primary-hover);
  border-color: var(--border-button-primary-hover);
}
```

## Best Practices

**DO:**

- Use the Button component when possible.
- Apply all three token categories (surface, text, border) together for each
  state.
- Use protected sizing tokens for consistent button heights.

**DON'T:**

- Mix token types across states (e.g., primary surface with secondary text).
- Override protected sizing tokens — they ensure layout stability.
- Forget disabled states when building custom button-like elements.
