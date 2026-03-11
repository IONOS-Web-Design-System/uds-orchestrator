# Surface Tokens

Surface tokens control background colors across the design system. They adapt
automatically to the active brand and color scheme.

## Base Surfaces

Use these for primary layout backgrounds:

| Token                 | Tailwind Class         | Purpose                              |
| --------------------- | ---------------------- | ------------------------------------ |
| `--surface-base`      | `bg-surface-base`      | Default page/card background         |
| `--surface-subtle`    | `bg-surface-subtle`    | Secondary background, slightly muted |
| `--surface-subtlest`  | `bg-surface-subtlest`  | Tertiary background, most muted      |
| `--surface-highlight` | `bg-surface-highlight` | Highlighted/emphasized areas         |
| `--surface-disabled`  | `bg-surface-disabled`  | Disabled element backgrounds         |

## Invert Surfaces

Inverted surfaces provide contrast against the base palette (e.g., dark surfaces
in light mode):

| Token                       | Tailwind Class               |
| --------------------------- | ---------------------------- |
| `--surface-base-invert`     | `bg-surface-base-invert`     |
| `--surface-subtle-invert`   | `bg-surface-subtle-invert`   |
| `--surface-subtlest-invert` | `bg-surface-subtlest-invert` |

## Semantic Surfaces

Use semantic surfaces to convey status and meaning. Each semantic family has a
base, bolder, hover, and active variant:

| Family      | Base Token                   | Bolder                              | Hover                              | Active                              |
| ----------- | ---------------------------- | ----------------------------------- | ---------------------------------- | ----------------------------------- |
| **Danger**  | `--surface-semantic-danger`  | `--surface-semantic-danger-bolder`  | `--surface-semantic-danger-hover`  | `--surface-semantic-danger-active`  |
| **Success** | `--surface-semantic-success` | `--surface-semantic-success-bolder` | `--surface-semantic-success-hover` | `--surface-semantic-success-active` |
| **Caution** | `--surface-semantic-caution` | `--surface-semantic-caution-bolder` | `--surface-semantic-caution-hover` | `--surface-semantic-caution-active` |
| **Promo**   | `--surface-semantic-promo`   | `--surface-semantic-promo-bolder`   | `--surface-semantic-promo-hover`   | `--surface-semantic-promo-active`   |
| **Neutral** | `--surface-semantic-neutral` | `--surface-semantic-neutral-bolder` | `--surface-semantic-neutral-hover` | `--surface-semantic-neutral-active` |
| **AI**      | `--surface-semantic-ai`      | `--surface-semantic-ai-bolder`      | `--surface-semantic-ai-hover`      | `--surface-semantic-ai-active`      |

Tailwind usage: `bg-surface-semantic-danger`,
`bg-surface-semantic-success-bolder`, etc.

## Badge Surfaces

Specialized surfaces for badge components:

| Token                              | Tailwind Class                      |
| ---------------------------------- | ----------------------------------- |
| `--surface-semantic-badge-price`   | `bg-surface-semantic-badge-price`   |
| `--surface-semantic-badge-promo`   | `bg-surface-semantic-badge-promo`   |
| `--surface-semantic-badge-neutral` | `bg-surface-semantic-badge-neutral` |

## Input Surfaces

Background tokens for form inputs:

| Token                      | Tailwind Class              | State          |
| -------------------------- | --------------------------- | -------------- |
| `--surface-input-default`  | `bg-surface-input-default`  | Resting        |
| `--surface-input-hover`    | `bg-surface-input-hover`    | Hovered        |
| `--surface-input-active`   | `bg-surface-input-active`   | Focused/active |
| `--surface-input-disabled` | `bg-surface-input-disabled` | Disabled       |

## Usage Example

```html
<div class="bg-surface-base">
  <section class="bg-surface-subtle rounded-md p-4">
    <div class="bg-surface-semantic-danger rounded-sm p-2">
      <p>Error details here</p>
    </div>
  </section>
</div>
```

## Best Practices

**DO:**

- Use semantic surfaces for status indicators (errors, warnings, successes).
- Layer surfaces using base → subtle → subtlest for visual depth.
- Use invert surfaces for high-contrast sections like banners.

**DON'T:**

- Use raw color values (`bg-red-500`) — they bypass theming.
- Use `-bolder` variants for large areas — they are intended for emphasis
  accents.
- Mix semantic surfaces across unrelated contexts (e.g., success surface for a
  promo card).
