---
styles: [background-pointer, background-full]
---

# Image-backdrop hybrid compositions — IONOS notes

The full embed-contract geometry (all 6 styles — `background-full`, `background-pointer`,
`interface-asset`, `floating-card`, `product-pop-out`, `device-mockup` — plus the shared
color-harmony rule) has moved to `shared/embed-preamble.md` plus one `shared/embed-<style>.md`
file per style (`embed-image-backdrop-pointer.md`, `embed-image-backdrop-full.md`,
`embed-interface-asset.md`, `embed-floating-intersect.md`, `embed-device-mockup.md`, and
`embed-color-harmony.md` for the four opaque styles), which apply to every brand.
`product-pop-out` is the one exception — its geometry is a sub-folder,
`shared/product-pop-out/{composition,character,highlight-and-ai}.md`, split by concern rather
than a single file. Load the preamble plus the matching style file(s) when the brief contains
`[HYBRID EMBED CONTRACT]`.

This file now holds only IONOS-specific color values for the parts the shared file
references semantically:

- Brand gradient root (`var(--color-gradient-start) → var(--color-gradient-end)`): IONOS
  Blue → Dark Midnight — see `uds-style-guide`.
- Brand AI gradient (`var(--color-ai-primary-start) → var(--color-ai-primary-end)`, blue →
  magenta) — see `uds-style-guide/rules/ionos-ai-features.md` for the resolved hex.
- AI-generating accent purple (purple-600) used for the selection marquee only (never the
  AI CTA gradient) — see `ionos/product-frame-color.md`.
