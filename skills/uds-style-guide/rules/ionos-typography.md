# IONOS Typography

**`data-brand="ionos"` | Source: IONOS Style Guide Version 2.2 — Typefaces (Figma node 68:21846)**

Carefully executed typography ensures consistency across brand experiences and brings clarity and efficiency to content presentation. IONOS uses two typefaces to express brand presence and informational hierarchy.

---

## Typeface Overview

| Typeface | CSS Token | Character | Primary Use |
|----------|-----------|-----------|-------------|
| Overpass | `--base/font/heading` | Persuasive, guiding, impressive | Headlines, pull quotes, display |
| Open Sans | `--base/font/body` | Informative, reasonable, universal | Body text, UI, buttons — default |
| Overpass Mono | `--font/code-font` | Technical, structured | Code snippets, specifications |

**Download:**
- Overpass: https://github.com/RedHatOfficial/Overpass
- Open Sans: https://github.com/FontFaceKit/open-sans

---

## Overpass — Heading Typeface

Overpass catches the eye and is certain to guide and impress. It has high legibility at large sizes and is suited to punchy, emotional, and grabbing content.

**Weights available:**
- Regular (400)
- Semibold (600)

**Use Overpass when:**
- Writing headlines (h1, h2, marketing headers)
- Creating pull quotes or callout statements
- You need a strong, characteristic voice
- The text will be displayed at larger sizes

**Do not use Overpass for:**
- Running body copy (legibility degrades at small sizes)
- UI labels and button text (Open Sans is more neutral and universal here)
- Any text smaller than ~20px

### Overpass Mono

Available for specific technical contexts. Use for code snippets in communications, specification documents, and monospaced annotations. CSS token: `--font/code-font`.

---

## Open Sans — Body Typeface

Open Sans is the versatile workhorse. Never loud, but smart and familiar. It should be your default choice for anything that isn't a headline.

**Weights available:**
- Regular (400)
- Semibold (600)
- Bold (700)

**Use Open Sans for:**
- All body text and long-form copy
- UI elements: buttons, labels, navigation, form fields
- Titles in product interfaces
- Any context where legibility at small sizes matters
- Default choice when you're unsure which typeface to use

---

## The Core Decision Rule

```
Impact / emotion / grabbing attention  →  Overpass
Legibility / utility / information     →  Open Sans (default)
Technical / code / specs               →  Overpass Mono
```

If you find yourself debating which to use, pick Open Sans. It's designed to be universally appropriate. Overpass should feel like a deliberate choice, not a fallback.

---

## DO / DON'T

**DO:**
- Set Overpass at heading sizes (h1–h3) for brand-aligned marketing layouts
- Use Open Sans Regular as your base body style
- Use Open Sans Semibold or Bold for emphasis within body copy (instead of switching to Overpass)
- Use proper letter-spacing for labels — Figma spec shows `0.56px` tracking on small uppercase labels

**DON'T:**
- Mix Overpass and Open Sans in the same text block (one paragraph Overpass, next Open Sans)
- Use Overpass at small sizes (< 16px) — its personality disappears and legibility suffers
- Use system fonts or substitutes — the brand relies on consistent rendering of these specific faces
- Use Bold weight of Overpass (not in the brand system — only Regular and Semibold)

---

## CSS Token Usage in Code

When implementing in a project with `@ionos-web-design-system/core`:

```css
/* Headings — Overpass */
h1, h2, .headline {
  font-family: var(--base/font/heading);  /* Overpass */
  font-weight: 600;
}

/* Body / UI — Open Sans */
body, button, label, p {
  font-family: var(--base/font/body);     /* Open Sans */
  font-weight: 400;
}

/* Code / specs — Overpass Mono */
code, pre, .spec-text {
  font-family: var(--font/code-font);     /* Overpass Mono */
}
```

For Tailwind CSS font utilities and UDS component typography props, see `uds-usage-best-practices`.
