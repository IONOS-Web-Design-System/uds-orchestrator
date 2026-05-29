---
name: uds-wireframe
description: >
  Build brand-specific interface wireframe illustrations using UDS components,
  Tailwind utilities, and the IONOS design system. Use this skill whenever the
  user wants to sketch, mock up, or illustrate an interface layout, screen, page,
  or UI composition using real UDS components — even if they say "wireframe",
  "mockup", "sketch", "prototype", "interface illustration", "lo-fi layout", or
  just "show me what this screen could look like". Also triggers when the user
  wants to combine a pixel image or Figma frame with a component layout, or wants
  micro-animations on a UI illustration. Supports two fidelity levels: standard
  (mid-fi, real placeholder text, light backgrounds) and decorative (dark/gradient
  backgrounds, visual bar placeholders, icon-forward glass cards, cinematic feel —
  trigger words: "decorative", "dark", "cinematic", "premium", "marketing visual").
  Outputs a .tsx file — real UDS components, real IONOS brand colors. Not a full
  production implementation — a composed illustration of structure and intent.
  Requires uds-style-guide and uds-usage-best-practices. For animation: references
  remotion-best-practices.
---

# UDS Wireframe

A wireframe here means a **live, renderable React composition** using real UDS components arranged to illustrate a layout. It uses real IONOS brand colors and typography — the "low fidelity" comes from placeholder content and simplified interaction, not greyscale or outline aesthetics.

Think of it as the middle ground between a Figma mockup and production code: structurally complete, visually on-brand, but not wired up to data or full business logic.

## Before You Start — Ask These Questions

Always ask the user these before generating, unless already answered in the prompt:

1. **Images?** — "Do you want to include any images? If so, paste a local file path or a Figma URL."
2. **Fidelity level?** — "Standard (real placeholder copy, light backgrounds) or **decorative** (dark/cinematic, bar placeholders, device frame, glass cards)?"

For **decorative mode only**, also ask:

3. **Size?** — "What size will this illustration be used at?
   - **Large** (~750px) — full carousel or hero section
   - **Medium** (~500px) — half-screen panel or feature callout
   - **Small** (~250px) — inline card or thumbnail"
4. **Animations?** — "Should elements have interaction animations (mouse cursor flow, card press, element fly-in)?"

If the user's prompt contains "decorative", "dark", "cinematic", "premium", or "marketing visual" — treat fidelity as **decorative** without asking question 2. Infer size from context when obvious (e.g. "for a sidebar card" → small, "for the hero section" → large). For decorative mode, read `rules/wireframe-decorative-mode.md` before composing.

Standard wireframes **never** include animations or a size parameter. Skip questions 3 and 4 entirely for standard mode.

These shape the output significantly. Skip any question the user has already answered.

## Wireframe Composition Rules

Read `rules/wireframe-composition.md` for the full layout and component selection guide.

Key principles:
- Wrap everything in `<ThemeProvider brand="ionos">` (or user-specified brand)
- Use `<Surface>` for layout regions — it handles background, text color, and theming
- Select components for visual structure: `Card`, `Button`, `NavigationBar`, `Hero`, `Grid` etc.
- Stub callbacks: `onClick={() => {}}`, `onChange={() => {}}`
- Placeholder text should be contextually appropriate — not generic "Lorem ipsum" but plausible content matching the layout intent
- Mark the file clearly: add a comment at the top: `// Wireframe illustration — not production code`

## Brand Reference

Before choosing colors or fonts, check `uds-style-guide`:
- IONOS primary brand colors and when to use each
- Typography rules (Overpass for headlines, Open Sans for body)
- `data-brand="ionos"` on the ThemeProvider root

Currently only `ionos` brand is fully documented in `uds-style-guide`. For other brands, set `data-brand` appropriately and note that brand-specific tokens will resolve via CSS.

## Image Integration

Read `rules/wireframe-asset-integration.md` for the full image workflow.

Quick rules:
- **Local path** → use UDS `Picture` component with `src` prop, or plain `<img>` for simplicity
- **Figma URL** → use the Figma MCP tool (`get_screenshot`) to fetch a rendered image of the frame, then embed that URL
- Images are content elements inside the wireframe, not backgrounds or overlays

**Catalog assets as image placeholders.** When asset files are available in `public/` (e.g. PNG
screenshots, product mockups), use them to fill image placeholder areas inside wireframes via
`<Img src={staticFile('filename.png')} />` (Remotion) or `<img src={staticFile('filename.png')} />`
(static wireframe). These replace grey/coloured placeholder boxes wherever a real image would
appear — hero shots, app screenshots, dashboard thumbnails, etc. Never leave an image area as a
plain coloured rectangle when a relevant catalog asset exists.

## Interaction Animations — Decorative Mode Only

Read `rules/wireframe-micro-animations.md`. **Only applies to decorative mode** — standard wireframes have no animations.

Animation patterns simulate real interactions:
- Mouse cursor flow (guided tour of clicks)
- Card press / highlight (lifts toward cursor)
- Bar grow / typing (content appearing progressively)
- Float / bob (pop-out elements feeling alive)
- Element fly-in (notifications, AI results arriving)
- Complex sequences → use `remotion-best-practices` skill

## Decorative Mode

For dark/cinematic/premium compositions, read `rules/wireframe-decorative-mode.md`.

Key differences from standard mode:
- **Transparent outer canvas** — `background: transparent` on the root; dark gradient only inside the device frame's screen
- `colorScheme="dark"` on ThemeProvider root (not ThemeInverter for sections)
- **Brand logo** in the nav bar using `@ionos-web-design-system/icon/brandmark` — import the
  named export that matches the background: `ionosDark` for dark/gradient backgrounds, `ionosLight`
  for light. Never use the internal `dist/` path directly; it bypasses the package exports map.
- Text replaced by `Bar` / `BarGroup` blocks + **1–2 readable typography anchors** (context strings from the prompt)
- **Contrast for all highlighted elements** — follow the **Background-Driven Contrast Rule**
  (see below). For dark gradients this means white text anchors, white-tinted glass surfaces, and
  white-tinted borders on every floating / featured element. Never use mid-grey tokens
  (`var(--color-neutral-500)`, `var(--color-neutral-400)`) over dark backgrounds — they fail WCAG.
- **Highlighted / featured elements** use liquid-glass: `backdropFilter: 'blur(20px)'` + surface
  and border colours per the Background-Driven Contrast Rule table.
- Icons sized 32–48px in colored glass containers using utility token palette
- Glass cards with `backdropFilter: blur(16px)` + rgba borders
- Always wrapped in a device frame (macOS window / laptop / phone / Windows)
- Floating pop-out elements: 3–4 (large), 1–2 (medium), 1 pill (small)
- **4 animation variants** offered in the HTML preview (A: Cursor Journey, B: Cascade Reveal, C: Pulse Radiate, D: AI Generation); TSX generated with Variant A + comment listing all options
- **Always** generate `/tmp/uds-decorative-preview.html` with variant switcher bar — open it after writing

## Background-Driven Contrast Rule

**Scene Inversion Principle — mandatory unless the brief explicitly names a colour for a specific object:**

Every surface in the composition must invert against the scene background. A dark panel on a
dark scene is effectively invisible. There is no "dark on dark" or "light on light".

- **Dark scene** (navy, indigo, black gradient) → ALL major panels use **white/light** base colours
- **Light scene** (white, light-grey) → ALL major panels use **dark** base colours

### Per-object alpha values (dark scene example — flip base colours for light scene)

On dark navy/indigo scenes, backdrop-blur causes dark background to bleed through any
transparency below ~0.88. Keep alpha high — panels must look clearly white, not grey.

| Object | Background                                                                   | backdropFilter | Text colour |
|---|------------------------------------------------------------------------------|---|---|
| **Main product frame** (large app panel) | `rgba(255,255,255,0.72–0.86)` **or** `#ffffff` — choose randomly per variant | `blur(12px)` | `#001B41` |
| **Input / highlight popup** (prompt card, callout) | `rgba(255,255,255,0.80–0.94)`                                                | `blur(10px)` | `#001B41` |
| **Secondary decorations** (floating pills, stat chips) | `rgba(255,255,255,0.08–0.14)`                                                | `blur(16px)` | `#ffffff` or light token |

**Why near-opaque?** At alpha 0.7 on `#02102B`, the perceived colour is roughly
`0.7 × #fff + 0.3 × #001B41 ≈ #B0B8C3` — medium grey, not white. At 0.92 it resolves
to `≈ #EEF0F3`, which reads clearly as a bright white panel.

**❌ WRONG — too transparent, looks grey on dark scene:**
```tsx
// Scene: linear-gradient(135deg, #02102B, #001B41)
background: 'rgba(255,255,255,0.4)'  // ← blends to grey, not bright white
background: 'rgba(8,16,28,0.6)'      // ← dark on dark, invisible
```

**✓ CORRECT — bright white panel on dark scene:**
```tsx
// Option A — near-opaque frosted glass (main frame)
{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', color: '#001B41' }

// Option B — solid white card (main frame)
{ background: '#ffffff', color: '#001B41' }

// Input popup (near-opaque, slightly less than main frame)
{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', color: '#001B41' }
```

Secondary decorations (floating stat pills, notification chips) still use low-opacity glass —
they are accents, not focal panels, and the semi-transparency is intentional for depth.

**Recursive application — icon and logo colours inside panels:**
The contrast rule applies at every nesting level. When a panel is itself inverted
(e.g. a white panel on a dark scene), elements INSIDE that panel must use the opposite
colour scheme — do NOT inherit the scene background for colour decisions:

| Direct container surface | System icon `backgroundColor` | Brandmark variant |
|---|---|---|
| **White / near-opaque white panel** (`0.88+`) | dark: `#001B41` or `#003D8F` | `ionos-light` |
| **White panel at 0.4–0.87 alpha** | dark: `#001B41` or `#003D8F` | `ionos-light` |
| **Dark / near-opaque dark panel** (`0.4+`) | light: `#ffffff` | `ionos-dark` |
| **Low-opacity glass** (`< 0.4`) | match the scene: white on dark scene, dark on light scene | scene-matched variant |

Always key the icon colour on the container's own `background` value, not on the outer
scene gradient. A white bolt icon on a white chat bubble is invisible — always check the
immediate parent before choosing `backgroundColor` for masked icons.

**Why:** `ionos-light` has the blue #003d8f brand fill — readable on white. `ionos-dark` is
all-white fills — readable only on dark. Putting `ionos-dark` on a white panel makes the logo
invisible. This is the opposite of how the names might suggest.

**Alpha threshold for semi-transparent surfaces:** for `background: rgba(R, G, B, alpha)`
surfaces, the base color determines the effective surface category when `alpha ≥ 0.4`. A
white base at 0.6 alpha is a **light** surface → use `ionos-light`. A dark base at 0.6 alpha
is a **dark** surface → use `ionos-light`. Below 0.4 the background bleeds through too
strongly — treat as transparent and key off the parent container instead.

## IONOS Product Frame Rule

When the brief explicitly names a specific IONOS product (e.g. "IONOS AI App-Builder", "IONOS Email",
"IONOS WordPress", "IONOS AI Website Builder"), build a **realistic product wireframe panel** as the
visual centrepiece. This is a recognisable simplified UI — not a bar-chart skeleton.

**Frame structure (adapt to the product type):**

```
┌─ browser / app chrome ──────────────────────────────┐
│  ● ● ●   [IONOS logo]   [nav items as Bars]         │ ← nav bar, 40–48px tall
├─────────────────────────────────────────────────────┤
│  [hero / main content area]                         │ ← image placeholder or
│  Use <Img src={staticFile('...')}> if a catalog     │   catalog asset via staticFile
│  asset matches the product context.                 │
│                                                     │
│  [Bar][Bar][Bar]   sidebar or card grid             │ ← content rows / BarGroups
│  [Bar][Bar]                                         │
└─────────────────────────────────────────────────────┘
```

Rules:
- **IONOS logo in the nav bar** — use the `svgData` approach from `remotion-best-practices`.
  Select the variant based on the **panel's own background** (not the scene):
  - Panel is white/light (`0.88+` opacity) → import `ionos-light` (has blue #003d8f, readable on white)
  - Panel is dark/glass → import `ionos-dark` (all white fills, readable on dark)
  Render with `backgroundImage: \`url(\${svgData})\``. Never substitute with a text label or bar.
- **System icons inside the panel** — apply the recursive contrast table above: dark icons
  (`backgroundColor: '#001B41'`) inside white panels, light icons (`backgroundColor: '#ffffff'`)
  inside dark panels.
- **Image areas** — only use `<Img src={staticFile('filename')}>` when the prompt or system
  context **explicitly names** an available catalog asset filename. Never guess filenames — if
  no asset filename is provided, render a coloured placeholder `<div>` (dark rounded rectangle,
  `background: 'rgba(255,255,255,0.06)'`, `borderRadius: 8`) instead. When an asset IS used,
  place it inside a **designated sub-region** of the content area (a dashboard canvas, hero
  screenshot slot, or thumbnail cell) — constrained by `flex: 1` within a bordered sub-section,
  never spanning the full content container. Use `objectFit: 'cover'`.
- **Minimum wireframe structure** — even when an image is present the frame MUST contain:
  1. Nav bar row: IONOS logo **plus** 2–3 `<Bar>` items for nav links — never logo-only
  2. At least one content row (sidebar `<BarGroup>`, stat grid, or card row) below the nav
  3. The catalog image or placeholder constrained to one content sub-region; the image element
     must sit **inside a grid cell or flex child** alongside other content

  **NEVER** write `<Img style={{ width: '100%', height: '100%' }} />` directly inside the
  `flex: 1` container that spans the entire content area below the nav — that collapses the
  wireframe into a screenshot wrapper with no structural content visible.

  Correct content-area structure (sidebar + constrained image sub-region):

```tsx
{/* Content area — sidebar + main; image lives inside the main cell only */}
<div style={{ flex: 1, display: 'grid', gridTemplateColumns: '180px 1fr', overflow: 'hidden' }}>
  <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', padding: '16px 12px',
    display: 'flex', flexDirection: 'column', gap: 12 }}>
    <BarGroup lines={3} op={0.14} />
    <BarGroup lines={2} op={0.10} />
  </div>
  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
    {/* Image constrained to one cell — NOT width/height 100% of full content area */}
    <div style={{ flex: 1, borderRadius: 8, overflow: 'hidden' }}>
      <Img src={staticFile(assetName)} style={{ width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'top' }} />
    </div>
    <BarGroup lines={2} op={0.12} />
  </div>
</div>
```
- **Glass treatment** — this panel is a primary focal element and MUST invert against the scene.
  On dark scenes: `rgba(255,255,255,0.92–0.96)` or `#ffffff` (choose randomly per variant) + `backdropFilter: 'blur(12px)'`.
  On light scenes: `rgba(8,16,28,0.92–0.96)` or `#001B41` + `backdropFilter: 'blur(12px)'`.
  Do NOT use `0.08–0.14` glass — that is for secondary decorative overlays only.
- **Depth** — give it generous whitespace and a `boxShadow` that lifts it off the background.
- This rule applies to both standard and decorative fidelity levels.

## Output Format

Produce a single `.tsx` file. Structure:

```tsx
// Wireframe illustration — not production code
import { ThemeProvider, Surface, Button, Card } from '@ionos-web-design-system/react';
// ... other imports

export default function [ScreenName]Wireframe() {
  return (
    <ThemeProvider brand="ionos">
      {/* layout composition */}
    </ThemeProvider>
  );
}
```

Name the file descriptively based on the screen/layout (e.g. `HeroBannerWireframe.tsx`, `DashboardLayoutWireframe.tsx`).

## Related Skills

- **`uds-style-guide`** — brand colors, typography, identity principles for IONOS
- **`uds-usage-best-practices`** — component APIs, token usage, prop patterns
- **`remotion-best-practices`** — when animations go beyond CSS transitions
