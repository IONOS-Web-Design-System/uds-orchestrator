---
decorative: true
---

# Background Patterns (Decorative Mode)

Three options — pick based on composition needs. The concrete color values referenced below
(`DECORATIVE_BG_START`, `DECORATIVE_BG_END`, `ACCENT_SKY`) are brand-specific — resolve them
from the brand's decorative color rule (e.g. `ionos/decorative-mode.md` "Decorative Color
Values") — never hardcode a brand hex in this shared file:

```tsx
// Option 1 — Solid dark using surface token (neutral, safe default)
// CSS contexts: var(--surface-base-invert)  |  Remotion fallback: DECORATIVE_BG_START
background: 'var(--surface-base-invert, DECORATIVE_BG_START)'

// Option 2 — Directional gradient using design tokens (preferred for most layouts)
// CSS: var(--color-gradient-start) → var(--color-gradient-end)
// Remotion fallbacks: DECORATIVE_BG_START → DECORATIVE_BG_END
background: 'linear-gradient(135deg, var(--color-gradient-start, DECORATIVE_BG_START) 0%, var(--color-gradient-end, DECORATIVE_BG_END) 100%)'

// Option 3 — Radial spotlight (most cinematic — clear top focal point)
background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(ACCENT_SKY, 0.15) 0%, var(--color-gradient-start, DECORATIVE_BG_START) 70%)'
```

Default to Option 2. Use Option 3 when hero content is at the top. Use Option 1 for secondary/nested dark panels.

**Dark background surfaces (dark colorScheme):**
- `var(--surface-base-invert)` — deepest dark, equivalent to the brand's `DECORATIVE_BG_START`
- `var(--surface-subtle-invert)` — slightly lighter dark, for elevated panels within a dark layout

**CSS variables don't resolve in Remotion renders** — always provide the hex fallback via `var(--token, #hexFallback)` (substituting the brand's concrete value for the placeholder above) or use the hex directly.
