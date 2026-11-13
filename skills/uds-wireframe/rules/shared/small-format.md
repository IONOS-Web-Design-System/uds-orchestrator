---
small: true
---

# Small-format illustrations — the highlight moment

## 1. When it applies

Every canvas with **both sides ≤ 512px** (bento tiles of 400×300 and 432×432, cards, badges), for
every brand and every module. On a larger canvas ignore this rule.

At this size the asset is ONE **highlight moment**: one central object, 0–3 scattered satellites,
dashed connectors only for a flow, and exactly one glowing highlight where the feature acts, all
drawn directly on the canvas. It replaces every interface layout: no product window, browser bar,
app sidebar or header, whole or cut by the canvas edge. It does not govern a device screen inside
a photograph, a composite (product-pop-out, device-mockup), a stage layer or a Figma
reconstruction; those keep their own rules.

## 2. How the copy becomes the picture

Requests arrive as the host component's copy:

```
Context: <section headline>
# <card heading>
bento_box_item
<body sentence(s)>
```

The host renders that copy beside the asset: read it for meaning, never repeat it.

| Copy part | Becomes |
|---|---|
| Body: the nouns | the objects — the central object and the satellites |
| Body: the verb / mechanism | the **moment**: the one thing that visibly acts (glows, arrives, moves). A sequence also becomes dashed connectors between the objects |
| Heading | the emphasis: which object is central and largest |
| Context | the family: sibling cards share one object vocabulary and treatment |

Unstructured copy: the request's own nouns and verb play those roles.

Type: a process — something arrives, is forwarded, is sent, or turns into something else — is a **story**; the user doing something to the product — upload, connect, add, drag, click — is an **interaction**; a lasting claim — secure, compliant, included, every night — is a **state**. A user action wins over a process, a process over a claim.

Examples (Context "KANN SO EINIGES.", an AI phone assistant):

- **IMMER DRAN** · "Rund um die Uhr erreichbar. Ohne Wartezeit." → Highlight moment (story): a
  clock on a white disc in halo rings, with a speech bubble and a person disc; the moment:
  stretch, a disc from the clock into the live-call wave-pill (AI); labels: none.
- **ALLES IM BLICK** · "Nach jedem Anruf … Details direkt per E-Mail." → Highlight moment (story):
  a ghosted phone with skeleton rows, with a call pill and a mail disc linked by dashed
  connectors call pill → mail disc → summary card; the moment: unfold, the mail disc into the
  summary card (AI); labels: none.
- **FLEXIBEL VERBUNDEN** · "Anrufe nach eigenen Regeln weiterleiten." → Highlight moment (story):
  a call node overlapping an AI node in halo rings, with a phone disc and a person disc linked by
  dashed connectors phone disc → AI node → person disc; the moment: split,
  the call node into the AI node (AI); labels: none.
- **SCHNELL SCHLAUER** · "Dokumente hochladen und die Wissensbasis erweitern." → Highlight moment
  (interaction): a stack of three file pills on ghost cards, with an upload slot; the moment: the
  cursor drags Produktinfo.pdf into the slot, which checks (AI); labels: Produktinfo.pdf,
  FAQ.pdf, Preise.pdf.
- **DIREKT IM KALENDER** · "Google Kalender verbinden und Termine automatisch eintragen." →
  Highlight moment (interaction): a calendar card on ghost cards, with no satellites; the moment:
  "Verbinden" pressed, appointments filling the grid (AI); labels: Google Kalender, Verbinden.
- **100 % DSGVO-konform** → Highlight moment (state): a shield on a white disc in halo rings, with
  no satellites; the moment: ripples (brand); labels: none.

## 3. Canvas

- The root `<AbsoluteFill>` background is exactly what the `CANVAS BACKGROUND` line names: for a
  brand with its own canvas, the brand gradient at 135°,
  `linear-gradient(135deg, var(--private-gradient-start, …), var(--private-gradient-end, …))`.
- When there is no such line, the brand has no canvas of its own: keep the render's default
  canvas (transparent, or the surface the non-negotiables name). Never paint a gradient there.
- Nothing wraps the composition: no frame, window, card or panel holds the cluster. Only the
  canvas carries a brand gradient.

## 4. Layout

- The cluster sits inside a **~14%** inset on every side (56–64px on 432).
- Centred, often on a top-left to bottom-right diagonal: a satellite near one corner, the
  highlight toward the opposite one.
- Satellites and the highlight may overlap the central object's edge: depth is overlap.
  Never a row or grid of equal tiles.
- The highlight and every label stay inside the canvas, at least ~8% from every edge.
- On a non-square canvas, size by the shorter side and spread satellites along the longer one.

## 5. The pieces

Sizes are shares of the canvas's **shorter side** (px at 432).

| Piece | Anatomy | Size |
|---|---|---|
| **Central object** (exactly 1) | One object the body names: a clock, phone, file stack, calendar, shield, server card, routing node, document. Drawn in white surfaces, ink details and skeleton bars; never a product UI | spans 55–72% (238–311px) with its rings or ghosts; a disc inside halo rings is ~30–35% |
| **Halo rings** (optional) | 1–2 concentric white circles at 16–22% opacity behind a round central object | outer ring 55–65% |
| **Ghost layers** (optional) | 1–2 copies of the central card offset up and right, white at 25% and 40% opacity, for depth or "many" | as the card |
| **Satellites** (0–3) | Solid `--text-link-default` discs with a white filled glyph (person, mail, phone, lock, globe), or white speech bubbles with ink bars. Scattered toward the corners | 15–21% (65–91px), glyph ~50% of the disc |
| **Connectors** (only for a flow the body names) | White dashed lines, 2–3px, dash ~6 / gap ~7, straight or gently curved, a small arrowhead at the end | – |
| **Highlight** (exactly 1) | The element where the feature acts. It carries the only glow (section 6) | as the object it is |
| **Labels** (0–3) | Real domain nouns from the body: the noun, a plain instance of it (a file name for "documents"), a named service, or the moment's short action verb. On white pills or as a card title, ink text, weight 500–600 | type ≥ 14px at 432 |
| **Skeleton bars** | Rounded bars in the ink or skeleton token stand in for other text | 6–8px tall at 432 |

- Glyphs are filled system icons (`icon/system/filled-<name>`); name the concept and resolve it
  against the `# Icon name index`.
- In a story or a state, a brand product icon (the brand product icon for <concept>) may be the
  central object or a satellite — full colour on a white disc, never recoloured; system icons stay
  for glyphs inside discs, buttons and UI pieces.
- Label pills, satellites and discs are drawn pieces, not kit chips; an action button is a kit
  button (section 6).
- A label is never the heading, the body sentence, a status word, a number, a price or a claim
  the brief does not make.

## 6. Highlight colour

**AI feature** (the brief's `aiFeature`, or this render's AI styling, `aiStyled`):
- The highlight is an AI-gradient element,
  `linear-gradient(135deg, var(--private-ai-primary-start, …), var(--private-ai-primary-end, …))`,
  with a white glyph in `--text-semantic-ai`.
- Its glow is a blurred copy of the same gradient behind it at 60–70% opacity
  (`filter: 'blur(16px)'` to `'blur(24px)'`, static; animate only its opacity).
- An AI wave-pill is white glass at ~86% opacity holding an AI-gradient disc with the glyph and
  AI-gradient bars.
- An AI action button is `<KitButton concept="ai" size="small" label={…} icon={…} />` in a
  positioned parent `div`; its glow is the kit's `glow` prop, not a drawn blur.

**Non-AI feature:**
- The highlight is a `--text-link-default` disc or element with a white glyph.
- Its glow is a soft WHITE blurred circle behind it at ~45% opacity, ~1.3× its size.
- It never uses the AI gradient, `concept="ai"` or `ai`.

## 7. Token roles

Write every colour as `var(--token, <fallback>)`, the fallback from this render's non-negotiables
(a bare `var(--token)` when they list none). Never pick a colour of your own.

| Role | Token |
|---|---|
| Canvas (a brand with its own canvas) | `--private-gradient-start` → `--private-gradient-end`, 135° |
| AI highlight | `--private-ai-primary-start` → `--private-ai-primary-end` |
| Glyph on the AI highlight | `--text-semantic-ai` |
| Satellite discs, non-AI highlight | `--text-link-default` |
| Ink: details, labels, bars on white | `--text-base` |
| Light surfaces: fills inside white objects | `--surface-subtle` |
| Skeleton bars | `--text-semantic-skeleton` |
| Rings, ghost layers | white at 16–40% opacity |
| Objects, pills, connectors, satellite glyphs | white |

## 8. A requested product screen

A brief asking for a product screen still gets this grammar. Its central object is ONE
simplified feature card: a white card (radius ~16px at 432) with a short title label, 2–5
skeleton rows, and the one control the feature acts on, which is the highlight. Ghost layers may sit
behind it. Never a product window with a browser bar, sidebar, header, navigation or tabs.

## 9. Logos

When the body names an external service (Google Calendar, Microsoft 365, WordPress …) and the
`# Available assets` catalog has its logo, that satellite is the real logo on a white disc via
`staticFile('<slug>.<format>')`, the logo ~55–60% of the disc. Otherwise it is a
`--text-link-default` disc with a filled glyph, plus the service name as a label if it matters.
Never draw or approximate a logo.

## 10. Transparent or light canvas

When the render is transparent (`transparent` is true, or the "Transparent background." cue), the
root background is `'transparent'` and every piece stays. The same holds on a light default
canvas. White-on-gradient pieces switch so they read on a light page:
- halo rings and ghost layers take `var(--surface-subtle, …)`;
- white objects, pills and bubbles get a soft shadow `0 8px 24px` in the ink token at ~10%
  (`color-mix(in srgb, var(--text-base, …) 10%, transparent)`);
- connectors take the ink token at ~40% opacity;
- the highlight's glow stays.

## 11. Dark scheme

The canvas is the dark canvas the `CANVAS BACKGROUND` line names, else the render's default.
The cluster always renders in the light scheme, so white objects and ink never invert: wrap it in
its own themed `div` with `data-brand` too (a scheme attribute without it changes nothing).

```tsx
<AbsoluteFill style={{ background: transparent ? 'transparent' : CANVAS }}>
  <div data-brand={brand} data-platform={platform} data-color-scheme="light"
       style={{ position: 'absolute', inset: '14%' }}>
    {/* the cluster */}
  </div>
</AbsoluteFill>
```

## 12. Motion

A still shows the type's end frame (story: the result after the climax; interaction: the result
landed, no cursor; state: the icon at rest). An animation follows
`shared/small-format-motion.md`.

## 13. Hybrid

A hybrid's generated photo (any embed style) is the central object, placed via `staticFile()`,
never redrawn: a rounded photo card (radius ~16px at 432, `objectFit: 'cover'`) at 55–72% of
the shorter side with a soft static shadow, on the canvas, never full-bleed. The satellites and
the one highlight overlap its edges. No interface frame holds the photo.

## 14. Anti-patterns

- Any product window, browser bar, app sidebar or header, whole or cut by the canvas edge; a UI
  shrunk to fit; a row or grid of equal tiles.
- More than one glow; more than one highlight; more than three satellites.
- The AI gradient on a non-AI feature; AI or brand gradients on satellites or connectors;
  connector lines in any colour but white on the gradient canvas.
- Generic status chips or words; the heading or body copy in the asset, or a marketing line; a
  hand-drawn logo.

## 15. The planner sentence

The planner's `illustrationBrief.feature` opens with exactly one sentence of this shape, then the
motion beat in a few words; the motion beat follows the type:

```
Highlight moment (story|interaction|state): <central object> [in halo rings | on ghost cards], with <0–3 satellites> [linked by dashed connectors <from → to>]; the moment: <what acts> (AI|brand); labels: <0–3 real nouns from the body, or none>.
```

- Type: the section 2 test.
- A story's moment clause starts with its morph move: unfold, stretch, split, settle in or launch.
  An interaction's moment clause names the cursor, the control it acts on and the result. A
  state's names its background device: ripples, particles, dot field, dot orbit or light sweep;
  a state's background device moves; its icon and satellites never move (dot orbit = small dots
  on a faint ring).
- Write `AI` when `aiFeature` is true, `brand` otherwise. Drop the bracketed parts that do not
  apply; write "with no satellites" when there are none.
- `feature` names no product window, sidebar or browser, and enumerates no cards, segments or
  panels.
- The generator draws exactly what that sentence names.
