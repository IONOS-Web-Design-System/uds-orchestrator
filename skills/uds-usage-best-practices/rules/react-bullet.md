# Bullet

## Import

```tsx
import {
  BulletIndex,
  BrandCheckmark,
} from '@ionos-web-design-system/react/bullet';
```

## BulletIndex Props

| Prop    | Type     | Default    | Description      |
| ------- | -------- | ---------- | ---------------- |
| `index` | `number` | _required_ | Displayed number |

## BrandCheckmark Props

| Prop   | Type                 | Default | Description            |
| ------ | -------------------- | ------- | ---------------------- |
| `icon` | `InjectIconFunction` | —       | Explicit icon override |

## Description

Two components for list item markers:

- **BulletIndex** displays a number inside a circle, used for ordered steps or
  sequences.
- **BrandCheckmark** displays a theme-aware checkmark icon that automatically
  adapts to the current brand and color scheme.

## Usage

### Numbered steps

```tsx
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <BulletIndex index={1} />
  <Text>Create your account</Text>
</div>
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <BulletIndex index={2} />
  <Text>Choose your plan</Text>
</div>
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <BulletIndex index={3} />
  <Text>Start building</Text>
</div>
```

### Feature checklist

```tsx
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <BrandCheckmark />
  <Text>Free SSL certificate</Text>
</div>
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  <BrandCheckmark />
  <Text>24/7 support</Text>
</div>
```

### Custom icon override

```tsx
<BrandCheckmark icon={customCheckIcon} />
```

## Do

- Use `BulletIndex` for numbered lists, step indicators, and ordered sequences.
- Use `BrandCheckmark` for feature lists and benefit checklists.
- Let `BrandCheckmark` auto-adapt to the active brand — no configuration needed.

## Don't

- Use `BulletIndex` for more than single-digit numbers — the circle is sized for
  1-9.
- Mix `BulletIndex` and `BrandCheckmark` in the same list.
- Override the `BrandCheckmark` icon unless you have a specific brand
  requirement.
