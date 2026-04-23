# Semantic Tokens

Semantic tokens assign meaning to colors, spacing, and shape. Use them to
communicate status, group related UI, and maintain consistency across themes.

## Semantic Color Families

Six semantic families cover all status and meaning use cases. Each family spans
surface, text, and border categories.

### Success — Positive outcomes, confirmations

| Category | Token                                                        | Tailwind v4 Class             |
| -------- | ------------------------------------------------------------ | ----------------------------- |
| Surface  | `--surface-semantic-success`, `-bolder`, `-hover`, `-active` | `bg-surface-semantic-success` |
| Text     | `--text-semantic-success`, `-bolder`                         | `text-semantic-success`       |
| Border   | `--border-semantic-success`                                  | `border--semantic-success`    |

### Danger — Errors, destructive actions

| Category | Token                                                       | Tailwind v4 Class            |
| -------- | ----------------------------------------------------------- | ---------------------------- |
| Surface  | `--surface-semantic-danger`, `-bolder`, `-hover`, `-active` | `bg-surface-semantic-danger` |
| Text     | `--text-semantic-danger`, `-bolder`                         | `text-semantic-danger`       |
| Border   | `--border-semantic-danger`                                  | `border--semantic-danger`    |

### Caution — Warnings, attention required

| Category | Token                                                        | Tailwind v4 Class             |
| -------- | ------------------------------------------------------------ | ----------------------------- |
| Surface  | `--surface-semantic-caution`, `-bolder`, `-hover`, `-active` | `bg-surface-semantic-caution` |
| Text     | `--text-semantic-caution`, `-bolder`                         | `text-semantic-caution`       |
| Border   | `--border-semantic-caution`                                  | `border--semantic-caution`    |

### Promo — Promotional content, offers

| Category | Token                                                      | Tailwind v4 Class            |
| -------- | ---------------------------------------------------------- | ---------------------------- |
| Surface  | `--surface-semantic-promo`, `-bolder`, `-hover`, `-active` | `bg-surface-semantic-promo`  |
| Text     | `--text-semantic-promo`, `-bolder`                         | `text-semantic-promo`        |
| Border   | `--border-semantic-promotion`                              | `border--semantic-promotion` |

### Neutral — Informational, non-urgent

| Category | Token                                                        | Tailwind v4 Class             |
| -------- | ------------------------------------------------------------ | ----------------------------- |
| Surface  | `--surface-semantic-neutral`, `-bolder`, `-hover`, `-active` | `bg-surface-semantic-neutral` |
| Text     | `--text-semantic-neutral`, `-bolder`                         | `text-semantic-neutral`       |
| Border   | `--border-semantic-neutral`                                  | `border--semantic-neutral`    |

### AI — AI-generated or AI-related content

| Category | Token                                                   | Tailwind v4 Class        |
| -------- | ------------------------------------------------------- | ------------------------ |
| Surface  | `--surface-semantic-ai`, `-bolder`, `-hover`, `-active` | `bg-surface-semantic-ai` |
| Text     | `--text-semantic-ai`, `-bolder`                         | `text-semantic-ai`       |

**Note on border classes:** In Tailwind v4, border color classes use a
**double-dash** prefix (`border--semantic-danger`) because of how `@theme`
aliases map border tokens. In Tailwind v3 (plugin), they use a single dash
(`border-semantic-danger`). See [border-tokens.md](./border-tokens.md) for
details.

## Token Pattern

All semantic tokens follow a predictable naming structure:

```
--{category}-semantic-{family}[-variant]
```

- **category**: `surface`, `text`, `border`
- **family**: `success`, `danger`, `caution`, `promo`/`promotion`, `neutral`,
  `ai`
- **variant**: `-bolder`, `-hover`, `-active` (surfaces); `-bolder` (text)

Note: Border tokens use `promotion` (full word) while surface and text tokens
use `promo` (abbreviation).

## Spacing Tokens

Spacing tokens are platform-dependent — `comfortable` provides larger values,
`compact` provides tighter values:

| Token        | Description           |
| ------------ | --------------------- |
| `--space-0`  | No spacing (0)        |
| `--space-1`  | Smallest spacing unit |
| `--space-2`  | Extra small spacing   |
| `--space-3`  | Small spacing         |
| `--space-4`  | Medium-small spacing  |
| `--space-5`  | Medium spacing        |
| `--space-6`  | Medium-large spacing  |
| `--space-7`  | Large spacing         |
| `--space-8`  | Extra large spacing   |
| `--space-9`  | 2XL spacing           |
| `--space-10` | 3XL spacing           |
| `--space-11` | Largest spacing unit  |

Tailwind usage: `p-4`, `gap-3`, `m-6`, etc. (Tailwind v4 resolves `p-{n}` →
`var(--space-{n})` automatically — no alias needed).

For `--gap-*` tokens, an explicit `gap` alias is required: `p-gap-4`,
`gap-gap-4`, `m-gap-4`.

See `rules/core-spacing-tokens.md` for the full spacing reference with exact
values per platform.

## Border Radius Tokens

| Token               | Tailwind Class    | Shape                                       |
| ------------------- | ----------------- | ------------------------------------------- |
| `--rounded-xs`      | `rounded-xs`      | Barely rounded                              |
| `--rounded-sm`      | `rounded-sm`      | Slightly rounded                            |
| `--rounded-md`      | `rounded-md`      | Medium rounding                             |
| `--rounded-lg`      | `rounded-lg`      | Large rounding                              |
| `--rounded-xl`      | `rounded-xl`      | Extra large rounding                        |
| `--rounded-2xl`     | `rounded-2xl`     | 2XL rounding                                |
| `--rounded-default` | `rounded-default` | Standard 16px — common for cards/containers |
| `--rounded-full`    | `rounded-full`    | Fully circular (999px)                      |

> For cards and container elements, prefer
> `rounded-(--protected-container-rounded)` which adapts to brand/platform
> context. See `rules/core-corner-radius.md` for full rules.

## Usage Example

```html
<!-- Success alert -->
<div
  class="bg-surface-semantic-success border--semantic-success rounded-md border p-4"
>
  <p class="text-semantic-success-bolder">Operation completed successfully.</p>
</div>

<!-- Danger alert -->
<div
  class="bg-surface-semantic-danger border--semantic-danger rounded-md border p-4"
>
  <p class="text-semantic-danger-bolder">Something went wrong.</p>
</div>

<!-- Caution banner -->
<div
  class="bg-surface-semantic-caution border--semantic-caution rounded-sm border p-3"
>
  <p class="text-semantic-caution">Please review before proceeding.</p>
</div>
```

## Best Practices

**DO:**

- Use matching semantic families across surface, text, and border (e.g., all
  "danger" together).
- Use spacing tokens instead of hardcoded pixel values for platform
  adaptability.
- Use border radius tokens for consistent rounding across components.

**DON'T:**

- Mix semantic families in a single component (e.g., danger surface with success
  text).
- Use semantic tokens for purely decorative purposes — they carry meaning.
- Bypass spacing tokens with arbitrary values — they break platform switching.
