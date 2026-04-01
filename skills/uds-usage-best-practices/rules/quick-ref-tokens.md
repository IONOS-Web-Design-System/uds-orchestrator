# Token Quick Reference

## Variable Name Translation

Replace `/` separators with `-` to get the CSS variable name:

```
Token path                     CSS variable                       Tailwind class
surface/base                   --surface-base                     bg-surface-base
surface/semantic/ai            --surface-semantic-ai              bg-surface-semantic-ai
surface/semantic/danger-bolder --surface-semantic-danger-bolder   bg-surface-semantic-danger-bolder
text/subtle                    --text-subtle                      text-subtle
text/muted                     --text-muted                       text-muted
border/base                    --border-base                      border--base (double-dash!)
border/semantic/danger         --border-semantic-danger           border--semantic-danger (double-dash!)
space/4                        --space-4                          p-4, gap-4, m-4  (no alias — Tailwind v4 resolves directly)
gap/4                          --gap-4                            p-gap-4, gap-gap-4, m-gap-4  (requires 'gap' alias)
rounded/md                     --rounded-md                       rounded-md
ai-primary-start               --color-ai-primary-start           from-ai-primary-start (gradient stop)
ai-primary-end                 --color-ai-primary-end             to-ai-primary-end (gradient stop)
gradient-start                 --color-gradient-start             from-gradient-start (gradient stop)
gradient-end                   --color-gradient-end               to-gradient-end (gradient stop)
```

## Category to Tailwind Prefix

| Token Category | Tailwind Prefix                         | Usage                                      |
| -------------- | --------------------------------------- | ------------------------------------------ |
| `surface/...`  | `bg-{rest}`                             | Backgrounds                                |
| `text/...`     | `text-{rest}`                           | Text COLORS (not font sizes!)              |
| `border/...`   | `border--{rest}`                        | Border colors (double-dash in Tailwind v4) |
| `space/...`    | `p-{n}`, `m-{n}`, `gap-{n}`             | Padding, margin, flex/grid gaps            |
| `gap/...`      | `p-gap-{n}`, `m-gap-{n}`, `gap-gap-{n}` | Small decorative spacing                   |
| `rounded/...`  | `rounded-{rest}`                        | Border radius                              |
| `typo/...`     | Use Text component                      | Font sizing (via Text variant prop)        |
| `color/ai-*`   | `from-{name}`, `to-{name}`              | Gradient color stops                       |
| `font/...`     | `font-{rest}`                           | Font families                              |

**Important:** The `text/` category maps to text **colors**, not font sizes. For
typography, always use the `Text` component (see `rules/quick-ref-typography.md`).

## Border Double-Dash Convention

In Tailwind v4, border color classes use a **double-dash** (`--`):

```
CORRECT:  border--base          border--semantic-danger      border--bolder
WRONG:    border-base           border-semantic-danger       border-bolder
```

Always pair the border color class with a `border` width utility:

```tsx
<div className="border border--base">              {/* 1px base border */}
<div className="border-2 border--semantic-danger">  {/* 2px danger border */}
```

**Tailwind v3 note:** In v3 projects using the UDS plugin, borders use
single-dash (`border-base`). Only v4 requires double-dash.

> For Token Naming Convention details, see `rules/core-semantic-tokens.md`.
