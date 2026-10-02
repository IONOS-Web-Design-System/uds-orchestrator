---
decorative: true
---

# Icon Cards (Decorative Mode)

Icons are the visual focal points in decorative mode: `system/` glyphs for UI/concepts, the brand's product-icon group (full-colour, per `shared-uds-icons.md`) for products. Names come from the `# Icon name index` only.

> **No emoji anywhere** as icon substitutes — import the icon's `svgData` (as below), or use `KitIcon` inside UI.

## Icon color keys

The container background/border/icon colors are brand-specific — resolve the concrete
`ICON_COLORS` table (keyed `sky` / `green` / `amber` / `rose`) from the brand's decorative
color rule (e.g. `ionos/decorative-mode.md` "Decorative Color Values") — never hardcode a
brand hex in this shared file. Shape expected by `IconBlock` below:

```tsx
type IconColorKey = 'sky' | 'green' | 'amber' | 'rose';
// ICON_COLORS[key] = { bg: string; border: string; icon: string } — concrete values
// live in the brand's decorative color rule.
```

Colour assignment rule: `sky` for the primary / hero feature; cycle green → amber for supporting features; `rose` only for error/alert states.

## IconBlock helper

```tsx
// icon = a system/ icon's svgData, masked in the colour key's icon colour
import { svgData as cloudSvg } from '@ionos-web-design-system/icon/system/cloud';

const IconBlock = ({
  icon, colorKey = 'sky', size = 36, containerSize = 64,
}: {
  icon: string; colorKey?: IconColorKey; size?: number; containerSize?: number;
}) => {
  const c = ICON_COLORS[colorKey];
  const mask = `url(${icon}) center / contain no-repeat`;
  return (
    <div style={{
      width: containerSize, height: containerSize,
      borderRadius: containerSize * 0.25,
      background: c.bg, border: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{ width: size, height: size, backgroundColor: c.icon, WebkitMask: mask, mask }} />
    </div>
  );
};
```

## Usage patterns

**Hero icon (large, standalone — above a headline):**
```tsx
<IconBlock icon={cloudSvg} colorKey="sky" size={40} containerSize={80} />
```

**Feature icon grid (3-column):**
```tsx
import { svgData as gearSvg } from '@ionos-web-design-system/icon/system/gear';
import { svgData as lockSvg } from '@ionos-web-design-system/icon/system/lock';
import { svgData as performanceSvg } from '@ionos-web-design-system/icon/system/performance';

{([
  { icon: gearSvg, colorKey: 'sky' },
  { icon: lockSvg, colorKey: 'green' },
  { icon: performanceSvg, colorKey: 'amber' },
] as const).map(({ icon, colorKey }, i) => (
  <div key={i} style={glassCard}>
    <IconBlock icon={icon} colorKey={colorKey} size={28} containerSize={52} />
    <div style={{ marginTop: 16 }}>
      <Bar w="70%" h={11} op={0.25} />
      <div style={{ marginTop: 10 }}>
        <BarGroup lines={2} op={0.14} />
      </div>
    </div>
  </div>
))}
```

**Icon + text row (list / timeline item):**
```tsx
import { svgData as circleCheckmarkSvg } from '@ionos-web-design-system/icon/system/circle-checkmark';

<div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
  <IconBlock icon={circleCheckmarkSvg} colorKey="green" size={20} containerSize={40} />
  <div style={{ flex: 1, paddingTop: 4 }}>
    <Bar w="55%" h={10} op={0.25} />
    <div style={{ marginTop: 8 }}><BarGroup lines={2} op={0.14} /></div>
  </div>
</div>
```
