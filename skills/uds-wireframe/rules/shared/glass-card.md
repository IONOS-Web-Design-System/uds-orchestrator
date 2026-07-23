---
decorative: true
---

# Glass Card System (Decorative Mode)

```tsx
// Standard glass card — most containers
const glassCard: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
  borderRadius: 16,
  backdropFilter: 'blur(16px)',
  padding: 24,
};

// Elevated glass card — one highlighted card per section
const glassCardElevated: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  borderRadius: 16,
  backdropFilter: 'blur(16px)',
  padding: 24,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
};
```

**Sky-tinted card** — for a highlighted "featured" variant. The tint color is brand-specific;
resolve `ACCENT_SKY` from the brand's decorative color rule (e.g. `ionos/decorative-mode.md`
"Decorative Color Values") — never hardcode a brand hex in this shared file:
```tsx
const glassCardSky: React.CSSProperties = {
  background: 'rgba(ACCENT_SKY, 0.06)',
  border: '1px solid rgba(ACCENT_SKY, 0.20)',
  borderRadius: 16,
  backdropFilter: 'blur(16px)',
  padding: 24,
};
```

Use `glassCard` for standard content blocks. Use `glassCardElevated` for one primary/featured card per section. Use `glassCardSky` (or the brand's accent tint) when you want to tie a card visually to the brand's accent color.
