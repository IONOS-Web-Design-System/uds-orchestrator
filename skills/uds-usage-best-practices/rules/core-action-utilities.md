# Action Interaction Utilities

The `uds-action-*` utility classes are **compound interaction classes** that bundle
`cursor-pointer`, `transition-all`, and state-dependent shadow/border effects into
a single class name. Apply one class to make any element feel interactive — no need
to wire up `hover:`, `active:`, `cursor-pointer`, and `transition-*` individually.

Use these on elements that **lack** built-in interaction styles (e.g., a plain `Box`
used as a clickable card). Do **not** apply to components that already handle
hover/active states internally (`Button`, `Card` with `clickable`, `ButtonGhost`).

## Class Reference

| Class                  | Transition     | Description                                    |
| ---------------------- | -------------- | ---------------------------------------------- |
| `uds-action-loud`     | `duration-300` | Maximum emphasis — border + shadow effects      |
| `uds-action-moderate` | `duration-300` | Balanced — subtle to medium shadow effects      |
| `uds-action-quiet`    | `duration-200` | Low-key — minimal shadow, slight lift on hover  |
| `uds-action-whisper`  | `duration-200` | Cursor + transition only, no visual decoration  |

All levels share a base of `cursor-pointer transition-all`.

## What Each Level Provides

### Base Properties (all brands)

Every `uds-action-*` class applies `cursor-pointer transition-all duration-{ms}`.
Without brand overrides, all four levels behave like `whisper` (cursor + transition
only).

### Brand-Specific Visual Effects

Currently only **homepl** adds shadow/border overrides. Other brands (ionos, strato,
fasthosts, etc.) get cursor + transition only — no visual decoration yet.

#### homepl

| Level      | Idle                                     | Hover              | Active             |
| ---------- | ---------------------------------------- | ------------------ | ------------------ |
| `loud`     | `shadow-bottom-xs` + `border-1 border--base` | `shadow-bottom-md border--base` | `shadow-bottom-sm border--base` |
| `moderate` | `shadow-bottom-xs`                       | `shadow-bottom-md` | `shadow-bottom-sm` |
| `quiet`    | `shadow-bottom-xs`                       | `shadow-bottom-sm` | `shadow-bottom-xs` |
| `whisper`  | (none)                                   | (none)             | (none)             |

## Decision Tree

| Scenario                                    | Recommended Level   |
| ------------------------------------------- | ------------------- |
| Hero tile / featured product                | `uds-action-loud`     |
| Standard card / clickable container         | `uds-action-moderate` |
| Secondary element / supporting content      | `uds-action-quiet`    |
| List item / subtle interactive element      | `uds-action-whisper`  |
| Components with built-in hover (Button, Card clickable, ButtonGhost) | Do **not** apply |

## Usage Examples

### Interactive Card with Box

```tsx
import Box from '@ionos-web-design-system/react/box';
import Text from '@ionos-web-design-system/react/text';

<Box className="uds-action-moderate bg-surface-subtle overflow-hidden rounded-(--protected-container-rounded)">
  <div className="bg-surface-base flex h-48 items-center justify-center">
    <Text className="text-subtle text-4xl opacity-30">Image</Text>
  </div>
  <div className="space-y-2 p-6">
    <Text variant="headingXl" weight="bold">Interactive Card</Text>
    <Text color="subtle" variant="bodySm">
      Hover and click — interaction states are handled by the single utility class.
    </Text>
  </div>
</Box>
```

### Visual Hierarchy Grid

```tsx
<div className="grid grid-cols-3 gap-6">
  {/* Featured — maximum emphasis */}
  <Box className="uds-action-loud bg-surface-subtle p-6 rounded-(--protected-container-rounded)">
    <Text variant="headingXl" weight="bold">Featured</Text>
  </Box>

  {/* Standard — balanced emphasis */}
  <Box className="uds-action-moderate bg-surface-subtle p-6 rounded-(--protected-container-rounded)">
    <Text variant="headingXl" weight="bold">Standard</Text>
  </Box>

  {/* Secondary — low-key */}
  <Box className="uds-action-quiet bg-surface-subtle p-6 rounded-(--protected-container-rounded)">
    <Text variant="headingXl" weight="bold">Secondary</Text>
  </Box>
</div>
```

### Combining with Surface, Border, and Spacing Tokens

```tsx
<Box className="uds-action-moderate border border--base bg-surface-base p-6 rounded-(--protected-container-rounded)">
  <Text variant="heading2xl" weight="bold">Plan Name</Text>
  <Text color="muted" variant="bodySm" className="mt-2">
    Description of the plan features and benefits.
  </Text>
</Box>
```

## Best Practices

**DO:**

- Use `uds-action-*` on elements that lack built-in interaction styles (plain
  `Box`, `div`, custom wrappers).
- Choose the level based on visual hierarchy — `loud` for primary, `moderate` for
  standard, `quiet` for secondary, `whisper` for minimal.
- Test on the **homepl** brand to verify shadow/border effects render correctly.
- Use a single action class per element — don't combine multiple levels.

**DON'T:**

- Apply to `Button`, `Card` with `clickable`, `ButtonGhost`, or other components
  that already have built-in hover/active styles.
- Manually wire `hover:shadow-bottom-md active:shadow-bottom-sm cursor-pointer
  transition-all` — use the compound utility instead.
- Use `uds-action-loud` on every element — reserve it for high-emphasis items.
- Add redundant `cursor-pointer` or `transition-all` alongside `uds-action-*` —
  these are already included.
- Expect shadow/border effects on non-homepl brands — currently only homepl has
  visual overrides. Other brands get cursor + transition only.

## Tailwind v3 Note

The same `uds-action-*` class names are emitted as plain CSS utilities. Brand
overrides are baked in at build time, so the classes work identically in both
Tailwind v3 and v4 projects.
