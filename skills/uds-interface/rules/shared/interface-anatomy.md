# Realistic interface anatomy

## Product Frame — Content Detail Rules

Always include these realistic anchors (scale with frame size):
- **Catalog image asset** — pick from available assets via `staticFile()`; place in hero
- **Big hero heading** — 24–40px, real contextual text (brand name, tagline)
- **Product logo** — brand logo in shell header; client logo in client-app header
- **Size-dependent detail**:
  - Large frame (>900px wide): left sidebar + hero + content grid + right properties panel
  - Medium (500–900px): left sidebar + hero + 1–2 content rows, no right panel
  - Small (<500px): hero only, minimal nav

Diagram below illustrates the dark shell **variant** (token names shown for orientation — see
the brand's color rule, e.g. `ionos/product-frame-color.md`, for the concrete hex values); the
light **default** renders the identical structure with the colorScheme-resolved tokens
(`var(--surface-subtle, #F4F7FA)` shell + both side rails — the left sidebar and the right
properties panel; `var(--surface-base, #FFFFFF)` content area and the cards/rows on it — see
`ionos/product-frame-color.md`; `surface-subtlest` is the canvas OUTSIDE the frame and must not
appear on chrome).
`DARK_SHELL_ACCENT` below is the brand's dark-shell-complementing accent for
data/highlights in the dark variant — resolve the concrete value from the brand's color rule (e.g.
`ionos/product-frame-color.md` "Product shell — dark variant") — never hardcode a brand hex
in this shared file.

```
┌─ Product Shell — dark variant (dark navy gradient) ─┐
│ [sidebar: dark navy gradient]  [CLIENT APP: #F4F7FA]  [panel: dark navy gradient]│
│  W logo                     ┌─────────────────┐    [real data, accent-colored]  │
│  ──────────────             │ [client header]  │    [dropdowns]     │
│  icon  ←white               │ [hero image]     │    [analytics]     │
│  icon                       │ "Brand Heading"  │                    │
│  icon (active strip)        │ "Row label — value"│                  │
│  icon                       │ "Row label — value"│                  │
└──────────────────────────── └─────────────────┘ ───────────────────┘
```

### Client-app zone (the website being edited)

This is a completely separate inner panel — a real website preview, not tool chrome — so it
keeps its own literal light theme regardless of the shell's `colorScheme`. It must always read
as a distinct layer from the shell:
- **Against the dark shell variant:** contrast is automatic — a light panel on a dark chrome.
- **Against the light shell default:** the shell is light too, so separate by elevation, not
  opposing color — a strong `boxShadow` plus a lighter/whiter surface than the shell's
  `var(--surface-base)`.

```tsx
// Client app zone — visually isolated from the product shell (light shell default:
// separated by elevation/shadow; dark shell variant: separated by light-on-dark contrast)
<div style={{
  background: '#F4F7FA',          // var(--surface-subtle) — the website's own fixed light theme
  borderRadius: 7,
  overflow: 'hidden',
  boxShadow: '2px 12px 26px rgba(0,0,0,0.22), 6px 48px 48px rgba(0,0,0,0.19)',
}}>
  {/* Website header — client's brand color (e.g. teal #436977 for car service) */}
  <div style={{ background: '#436977', height: 44, /* nav bar */ }} />
  {/* Hero: real catalog image, object-fit cover */}
  <Img src={staticFile(`${imageSlug}.png`)} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
  {/* Headline — real text, 24–36px Overpass or brand font */}
  {/* Content rows — real labels and values from the brief's context, in text colors that read on the light panel */}
</div>
```

**Content in the client app**: content rows carry real labels and values from the brief's context (never placeholder bars), in text colors that read on the client app's own fixed light theme in both shell branches. Any selection or highlight is a real UI state of the product, not a floating overlay.
