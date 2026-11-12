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
a photograph or a composite stage layer; those keep their own rules.

## 2. How the copy becomes the picture

Requests arrive as the copy of the host component:

```
Context: <section headline>
# <card heading>
bento_box_item
<body sentence(s)>
```

The host renders that copy beside the asset. Never repeat it in the asset; read it for meaning.

| Copy part | Becomes |
|---|---|
| Body: the nouns | the objects — the central object and the satellites |
| Body: the verb / mechanism | the **moment**: the one thing that visibly acts (glows, arrives, moves). A sequence also becomes dashed connectors between the objects |
| Heading | the emphasis: which object is central and largest |
| Context | the family: sibling cards share one object vocabulary and treatment |

When the copy is not structured, the request's own nouns and verb play those roles.

The designers' five cards (Context "KANN SO EINIGES.", an AI phone assistant), each as its
opening sentence:

- **IMMER DRAN** · "Rund um die Uhr erreichbar. Ohne Wartezeit." → Highlight moment: a clock on a
  white disc in halo rings, with a speech bubble and a person disc; the moment: a live
  incoming-call wave-pill (AI); labels: none.
- **ALLES IM BLICK** · "Nach jedem Anruf kommen die wichtigsten Details direkt per E-Mail." →
  Highlight moment: a ghosted phone with skeleton rows, with a call pill and a mail disc linked by
  dashed connectors call pill → mail disc → summary card; the moment: the summary card arriving
  (AI); labels: none.
- **SCHNELL SCHLAUER** · "Dokumente hochladen und die Wissensbasis erweitern." → Highlight moment:
  a stack of three file pills on ghost cards, with no satellites; the moment: the upload disc
  lifting its arrow (AI); labels: Produktinfo.pdf, FAQ.pdf, Preise.pdf.
- **FLEXIBEL VERBUNDEN** · "Anrufe nach eigenen Regeln weiterleiten." → Highlight moment: an
  incoming-call node overlapping an AI node in halo rings, with a phone disc and a person disc
  linked by dashed connectors phone disc → AI node → person disc; the moment: the AI node routing
  the call (AI); labels: none.
- **DIREKT IM KALENDER** · "Google Kalender verbinden und Termine automatisch eintragen." →
  Highlight moment: a calendar card on ghost cards, with no satellites; the moment: the Verbinden
  button glowing as the cells fill in order (AI); labels: Google Kalender, Verbinden.

## 3. Canvas

- Opaque render: the root `<AbsoluteFill>` background is the brand gradient at 135°,
  `linear-gradient(135deg, var(--private-gradient-start, …), var(--private-gradient-end, …))`.
  This render's `CANVAS BACKGROUND` line names the exact value; follow it.
- Nothing wraps the composition: no frame, window, card or panel holds the cluster. Every piece
  sits directly on the gradient. Only the canvas carries the brand gradient.

## 4. Layout

- The cluster sits inside an inset of **~14%** of the canvas on every side (56–64px on 432).
- Roughly centred, often with a diagonal flow from top-left to bottom-right: a satellite near one
  corner, the highlight toward the opposite one.
- Satellites and the highlight may overlap the central object's edge; depth comes from overlap.
  Never a row or grid of equal tiles.
- The highlight and every label stay fully inside the canvas, at least ~8% from every edge.
- On a non-square canvas, size by the shorter side and spread satellites along the longer one.

## 5. The pieces

Sizes are shares of the canvas's **shorter side** (px at 432).

| Piece | Anatomy | Size |
|---|---|---|
| **Central object** (exactly 1) | One object the body names: a clock, phone, file stack, calendar, shield, server card, routing node, document. Simplified: white surfaces, ink details, skeleton bars. Never a product UI | spans 55–72% (238–311px) with its rings or ghosts; a disc inside halo rings is ~30–35% |
| **Halo rings** (optional) | 1–2 concentric white circles at 16–22% opacity behind a round central object | outer ring 55–65% |
| **Ghost layers** (optional) | 1–2 copies of the central card offset up and to the right, white at 25% and 40% opacity, for depth or "many" | as the card |
| **Satellites** (0–3) | Solid `--text-link-default` discs with a white filled glyph (person, mail, phone, lock, globe), or white speech bubbles with ink bars. Scattered toward the corners, never in a grid | 15–21% (65–91px), glyph ~50% of the disc |
| **Connectors** (only for a flow the body names) | White dashed lines, 2–3px, dash ~6 / gap ~7, straight or gently curved, a small arrowhead at the destination | – |
| **Highlight** (exactly 1) | The element where the feature acts. It carries the only glow in the tile (section 6) | as the object it is |
| **Labels** (0–3) | Real domain nouns from the body: the noun itself, a plain instance of it (a file name for "documents"), a named service, or the moment's short action verb. On white pills or as a card title, ink text, weight 500–600 | type ≥ 14px at 432 |
| **Skeleton bars** | Rounded bars in the ink or skeleton token stand in for every other text | 6–8px tall at 432 |

- Glyphs are filled system icons (`icon/system/filled-<name>`); name the concept and resolve it
  against the `# Icon name index`.
- Label pills, satellites and discs are drawn illustration pieces, not kit chips. An action
  button is a kit button (section 6).
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

Write every colour as `var(--token, <fallback>)`, the fallback taken from this render's
non-negotiables (a bare `var(--token)` when they list none). Never pick a colour of your own: the
same drawing switches brand by switching token values.

| Role | Token |
|---|---|
| Canvas | `--private-gradient-start` → `--private-gradient-end`, 135° |
| AI highlight | `--private-ai-primary-start` → `--private-ai-primary-end` |
| Glyph on the AI highlight | `--text-semantic-ai` |
| Satellite discs, non-AI highlight | `--text-link-default` |
| Ink: details, labels, bars on white | `--text-base` |
| Light surfaces: fills inside white objects | `--surface-subtle` |
| Skeleton bars | `--text-semantic-skeleton` |
| Rings, ghost layers | white at 16–40% opacity |
| Objects, pills, connectors, satellite glyphs | white |

## 8. A requested product screen

A brief that asks to show a product screen still gets this grammar. Its central object is ONE
simplified feature card: a white card (radius ~16px at 432) with a short title label, 2–5
skeleton rows, and the one control the feature acts on, which is the highlight. Ghost layers may
sit behind it. Never a product window with a browser bar, sidebar, header, navigation or tabs.

## 9. Logos

When the body names an external service or app (Google Calendar, Microsoft 365, WordPress …) and
the `# Available assets` catalog has its logo, that satellite is the real logo on a white disc via
`staticFile('<slug>.<format>')`, the logo ~55–60% of the disc. Otherwise it is a
`--text-link-default` disc with a filled glyph, plus the service name as a label if it matters.
Never draw or approximate a logo.

## 10. Transparent canvas

When the render is transparent (`transparent` is true, or the "Transparent background." cue), the
root background is `'transparent'` and every piece stays. White-on-gradient pieces switch so they
read on a white host page:
- halo rings and ghost layers take `var(--surface-subtle, …)`;
- white objects, pills and bubbles get a soft shadow `0 8px 24px` in the ink token at ~10%
  (`color-mix(in srgb, var(--text-base, …) 10%, transparent)`);
- connectors take the ink token at ~40% opacity;
- the highlight's glow stays.

## 11. Dark scheme

The canvas is the brand's dark canvas named by the `CANVAS BACKGROUND` line. The cluster always
renders in the light scheme, so its white objects and ink never invert into white on white. Wrap
it in its own themed `div`. It needs `data-brand` too: the light values are declared on
`data-brand` alone, so a scheme attribute without it changes nothing.

```tsx
// CANVAS = the value the CANVAS BACKGROUND line names
<AbsoluteFill style={{ background: transparent ? 'transparent' : CANVAS }}>
  <div data-brand={brand} data-platform={platform} data-color-scheme="light"
       style={{ position: 'absolute', inset: '14%' }}>
    {/* rings, ghosts, central object, connectors, satellites, the one highlight */}
  </div>
</AbsoluteFill>
```

## 12. Motion

Follow `shared/motion-choreography.md` for curves and export-safe properties. The beats (at
30 fps):

1. **Settle** (~0–0.6s): the central object scales from ~0.92 and fades in; halo rings expand
   from it; ghost layers slide into their offsets.
2. **Gather** (~0.4–1.2s): satellites pop in, staggered 4–8 frames; connectors draw along their
   path (reveal the static dashed path through a wrapper `div` whose width or height grows; never
   animate `strokeDashoffset` or anything inside an inline `<svg>`).
3. **The moment** (~1.2–2.4s): the highlight acts. Wave-pill bars start, the upload arrow lifts,
   a summary card arrives along the last connector, a button presses once, calendar cells fill
   in order. Its glow fades up at the same time.
4. **Hold / loop**: a calm loop on non-text layers only. Rings breathe, bars move, the glow
   breathes (`Math.sin(frame / p)`, p ≥ 10). Readable text (labels, pills, buttons) never moves
   after it lands.

A still shows the end state of beat 3.

## 13. Hybrid

A hybrid's generated photo (`floating-card` or `inline-asset` embed) is the central object: a
contained rounded photo card (radius ~16px at 432, `objectFit: 'cover'`) at 55–72% of the
shorter side with a soft static shadow, on the canvas. The satellites and the one highlight
overlap its edges under the same grammar. No interface frame holds the photo.

## 14. Anti-patterns

- Any product window, browser bar, app sidebar or header, whole or cut by the canvas edge.
- A UI shrunk to fit; a row or grid of equal tiles.
- More than one glow; more than one highlight; more than three satellites.
- The AI gradient on a non-AI feature; AI or brand gradients on satellites or connectors.
- Connector lines in any colour but white on the gradient canvas.
- Generic status chips or status words.
- The heading or body copy in the asset, or a marketing line.
- A hand-drawn logo.

## 15. The planner sentence

The planner's `illustrationBrief.feature` opens with exactly one sentence of this shape, then the
motion beat in a few words:

```
Highlight moment: <central object> [in halo rings | on ghost cards], with <0–3 satellites> [linked by dashed connectors <from → to>]; the moment: <what acts> (AI|brand); labels: <0–3 real nouns from the body, or none>.
```

- Write `AI` when `aiFeature` is true, `brand` otherwise. Drop the bracketed parts that do not
  apply; write "with no satellites" when there are none.
- Nothing in `feature` describes a product window, sidebar or browser, and it does not enumerate
  cards, segments or panels.
- The generator draws exactly what that sentence names.
