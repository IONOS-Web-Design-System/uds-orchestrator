# No marketing heading / subheading in the asset (all brands)

A generated asset is embedded into a host surface (a landing-page module, a section, a slot)
that **renders its own heading and subheading** beside the asset. The asset therefore MUST NOT
render a marketing **headline** or **subheading / tagline** — the page's message line — anywhere:
not above, over, beside, or inside the interface/scene as a title.

- **Never draw a marketing headline or subline.** No large title + supporting tagline that states
  the product's message (e.g. "Intelligentes CRM-Management mit KI" + "Automatisieren Sie …").
  Repeating it doubles the host's heading and bakes one language into a reusable asset. Convey the
  message through the **composition itself** — the interface, the scene, the character, badges, and
  functional micro-labels — not a headline line.
- **Functional UI text STAYS.** This forbids only the marketing headline/subline. Keep the text the
  interface legitimately needs: nav/section labels, tab names, CTA buttons, status pills/badges,
  data values and row labels, an AI prompt bubble's text, and the interface's own product/title bar
  label (e.g. a dashboard's "CRM Dashboard" chrome title). These are functional, not the page's
  marketing heading.
- **Applies to every embed style and to plain illustrations/composites**, including
  headline-capable layouts (`background-pointer`, `floating-card`, the composites). Where a layout
  could host a headline, leave that slot out — do not synthesise a marketing headline to fill it.
- **Only exception:** an author's *explicit* instruction to render a specific piece of text (not the
  brief's component chrome) — then render exactly that. Absent such an instruction, no headline.
