# Corner Radius Tokens

## Token Reference

| Token               | Tailwind Class    | Approximate Value | Typical Use Case                 |
| ------------------- | ----------------- | ----------------- | -------------------------------- |
| `--rounded-xs`      | `rounded-xs`      | ~2px              | Tight UI (chips, small tags)     |
| `--rounded-sm`      | `rounded-sm`      | ~4px              | Input fields, small cards        |
| `--rounded-md`      | `rounded-md`      | ~6px              | Buttons, badges, tooltips        |
| `--rounded-lg`      | `rounded-lg`      | ~8px              | Panels, dropdown menus           |
| `--rounded-xl`      | `rounded-xl`      | ~12px             | Section cards, modals            |
| `--rounded-2xl`     | `rounded-2xl`     | ~16px             | Large feature cards              |
| `--rounded-default` | `rounded-default` | 16px              | Standard containers              |
| `--rounded-full`    | `rounded-full`    | 999px             | Pills, circular buttons, avatars |

## Protected Container Radius

For most card and container elements, use the CSS variable:

```
rounded-(--protected-container-rounded)
```

This adapts to the brand/platform context automatically. It is the **PRIMARY
choice** for card, panel, and container corner radius.

```tsx
<div className="bg-surface-base rounded-(--protected-container-rounded) p-4">
  Card content
</div>
```

## Decision Tree

| Element type                              | Corner radius to use                      |
| ----------------------------------------- | ----------------------------------------- |
| Cards, panels, sections, modal dialogs    | `rounded-(--protected-container-rounded)` |
| Buttons                                   | Handled by Button component internally    |
| Input fields                              | Handled by form components internally     |
| Pill/tag shapes                           | `rounded-full`                            |
| Avatar/circular                           | `rounded-full`                            |
| Small UI badges                           | `rounded-md`                              |
| Special override (design specifies level) | Use the specific `rounded-{level}` token  |

## Rules

- **ALWAYS** use token-based radius — never `rounded-[16px]` or arbitrary values
- Prefer `rounded-(--protected-container-rounded)` for generic card/container
  shapes
- Never mix arbitrary values with token classes in the same component
