---
decorative: true
---

# Icon Cards (Decorative Mode)

Icons are the visual focal points in decorative mode. Use `group="system"` for UI/concept icons; use the brand's own product-icon group (e.g. `group="{brand}"` — see the brand's rule for the exact value) for product icons.

> **No emoji anywhere.** The `.tsx` output must never use emoji characters as icon substitutes — always use `<Icon group="system" name="..." />`.

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
const IconBlock = ({
  name, colorKey = 'sky', size = 36, containerSize = 64,
}: {
  name: string; colorKey?: IconColorKey; size?: number; containerSize?: number;
}) => {
  const c = ICON_COLORS[colorKey];
  return (
    <div style={{
      width: containerSize, height: containerSize,
      borderRadius: containerSize * 0.25,
      background: c.bg, border: `1px solid ${c.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon group="system" name={name} size={size} style={{ color: c.icon }} />
    </div>
  );
};
```

## Usage patterns

**Hero icon (large, standalone — above a headline):**
```tsx
<IconBlock name="cloud" colorKey="sky" size={40} containerSize={80} />
```

**Feature icon grid (3-column):**
```tsx
{[
  { icon: 'settings', colorKey: 'sky' as IconColorKey },
  { icon: 'lock',     colorKey: 'green' as IconColorKey },
  { icon: 'chart',    colorKey: 'amber' as IconColorKey },
].map(({ icon, colorKey }) => (
  <div key={icon} style={glassCard}>
    <IconBlock name={icon} colorKey={colorKey} size={28} containerSize={52} />
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
<div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
  <IconBlock name="check-circle" colorKey="green" size={20} containerSize={40} />
  <div style={{ flex: 1, paddingTop: 4 }}>
    <Bar w="55%" h={10} op={0.25} />
    <div style={{ marginTop: 8 }}><BarGroup lines={2} op={0.14} /></div>
  </div>
</div>
```
