---
name: strato-visual-language
description: STRATO-only illustration style — the brand-gradient canvas, the orange accent header or sidebar logo tile (dark scheme inside), the dark browser bar on a floating web window, logo sizing for the padded STRATO SVG, and filled-only system icons.
metadata:
  tags: strato, wireframe, product-frame, canvas, header, sidebar, browser, logo, icon
---

# STRATO visual language

STRATO-only. The frame geometry (`shared/frame-anatomy.md`) and the surface binding
(`shared/surface-theme.md`) still apply; this file supplies the STRATO values they defer to.

## Canvas — the brand gradient

The canvas (the asset background outside the interface) is the STRATO brand gradient token:

```tsx
background: 'linear-gradient(135deg, var(--color-gradient-start, #FF8800), var(--color-gradient-end, #FFC700))'
```

- That is the default for every STRATO illustration, on light and dark `colorScheme`.
- A dark or premium canvas (`colorScheme === 'dark'`, or a brief that asks for a dark stage)
  uses the STRATO blue gradient token instead:
  `linear-gradient(135deg, #2F2F70, #272CB2)`.
- Only the canvas carries a gradient. The product frame, its cards and floating cards stay
  white/light surfaces on top of it (the frame reads as a white window on orange).
- When this render's non-negotiables carry a `CANVAS BACKGROUND:` line, it wins.

## Product shell — orange accent, dark scheme inside it

A STRATO product UI is light (`surface-base` / `surface-subtle` panels, `text-base` copy) with
ONE orange accent area that carries the logo. Pick ONE of the two:

- **Accent header**: a full-width top bar, `background: '#FF8800'` (Brand Orange), about 48–56px
  tall on a 1280px frame. Logo left; header actions right.
- **Accent logo tile**: a light sidebar (`var(--surface-base, #FFFFFF)`) whose top logo area is
  a square `#FF8800` tile; the rest of the sidebar is light, with filled system icons in
  the muted STRATO light blue `#8493B3`.

**Everything inside the orange area uses the DARK colour scheme** for contrast: wrap the bar
or tile in its own `<div data-brand="strato" data-color-scheme="dark">`, so text, icons and
kit components inside resolve to their dark-scheme (light-on-dark) values. The logo there is
the white `strato-mono-dark` brandmark. Kit buttons inside it are dark-scheme buttons; never a
dark-blue label on orange.

## Floating web window — dark browser bar

When a website or web app is shown in a floating browser window (a site preview, a customer
site from the catalog, a builder's preview pane), its top bar is the REVERSED (dark) scheme,
whatever the scheme of the rest of the render:

```tsx
<div data-brand="strato" data-color-scheme="dark"
     style={{ height: 36, display: 'flex', alignItems: 'center', gap: 16, padding: '0 14px',
              background: 'var(--surface-subtlest, #3E4451)' }}>
  {/* three dots: 10px circles, 4px apart, var(--text-subtle, #FFFFFF) */}
  {/* URL field: flex 1, height 20, borderRadius 999, background var(--surface-base, #33363E),
      padding '0 12px'; a filled shield/lock icon then the domain in
      var(--text-base, #F7F7F9), 12px Poppins regular */}
</div>
```

- Bar: `surface-subtlest`. URL field: `surface-base`, fully rounded. Dots: `text-subtle`.
  Domain text: `text-base`. All resolved by the dark-scheme wrapper; the hex fallbacks are the
  STRATO dark values.
- No coloured traffic-light dots, no tabs, no light-grey bar.
- The page below the bar is the site itself (see the CLIENT SITE rule when present).

## STRATO logo sizing — the SVG is padded

The STRATO brandmark SVGs carry built-in padding: `strato-*` has a 156×60 viewBox but its ink
is only ~120×25 (centred), and `strato-lite-*` (the cube) has a 60×60 viewBox with ~24×24 ink.
Sized like other brands' logos, the STRATO wordmark renders far too small. Crop the padding
with `backgroundSize` so the box is the ink:

```tsx
// Wordmark: the box IS the visible logo. Height H = the visible wordmark height.
<div style={{ width: H * 4.9, height: H, backgroundImage: `url(${stratoLogo})`,
              backgroundSize: '130% auto', backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat' }} />
// Cube only (strato-lite-*): square box, backgroundSize: '245% auto'.
```

- Visible wordmark height H: 20–24px in a 1280px-wide header, 16–18px in a sidebar tile or a
  small (≤512px) canvas. Never size the raw 156×60 box to the header height.
- Import from `@ionos-web-design-system/icon/brandmark/strato-light` on light surfaces,
  `strato-mono-dark` (white) on the orange accent or any dark surface.

## System icons — filled only

STRATO uses only the FILLED system icons: `@ionos-web-design-system/icon/system/filled-<name>`
(e.g. `filled-home`, `filled-cart`, `filled-lock`). Never the default outline names or the
`<name>300` weights. The icon name index for this render lists only the filled names.
