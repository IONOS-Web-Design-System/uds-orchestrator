# Brief parsing: structured component copy (all brands)

Some briefs are free-form prose; others arrive as the **content copy of the component the asset
will be placed into**. This rule governs the second kind, and is **self-gating** — on a free-form
brief it does nothing.

## Activation & scope — do NOT touch other requests

Engage the parsing below ONLY on text carrying an explicit structural marker: a leading
`Context:` line, a Markdown heading (`#`/`##`/`###`), or a module status badge (a `Schritt N` /
`Step N` ordinal, `Coming Soon`, `In Entwicklung`, `Geplant`, `Beta`).

- **No markers → no-op.** A brief written as ordinary prose is free-form: parse nothing, strip
  nothing, enrich it exactly as `shared-brief-enrichment.md` says. Both the machine `/create` path
  and the `/imagine` interactive path load this file — this gate is what keeps `/imagine` briefs
  untouched.
- **Per-field, not wholesale.** Detect each part independently; one marker never implies another.
- **Partial is normal — never fabricate.** `Context:`, the `##` subheading, and the description may
  each be absent (a bare `# Heading` + one paragraph is valid; so is `#`+`##`+bullets with no
  `Context:`). Parse what is present; treat the rest as absent. Never invent a missing part, and
  never treat missing structure as malformed.
- **Never suppress explicitly-requested text.** This rule strips only *component chrome* (heading /
  subheading / description). It never overrides an author's explicit instruction to render text in
  the asset (e.g. "a banner reading 'Summer Sale'") — honor those as usual.

## What each part is (and is NOT)

These parts are the host component's **own** copy — it renders them as real text around the asset.
They tell you what the section means and where the asset sits; they are **source material for the
subject, never text to reproduce in the asset**.

| Part | Marker | Meaning | Use it for |
|---|---|---|---|
| Context | leading `Context: …` | the section's framing, shared by sibling assets | bias `sharedContext` tone / subject family so siblings cohere — NOT this asset's subject |
| Heading | `#` | the component's headline | infer the focal subject (paraphrased, English) |
| Subheading | `##` | eyebrow / step ordinal / status badge / person role | an intent signal (see table below) |
| Description | trailing paragraph(s) | body copy | flesh out subject + mood |
| Bullets | `- …` | feature list | supporting detail; never a text list drawn in the asset |

## The hard rule — never echo the component's copy into the asset

Do NOT instruct any generator to render the brief's Context / heading / subheading / description
(or a bullet's text) as words in the asset:

- **image** — already forbidden (models garble glyphs); unchanged.
- **illustration / animation / hybrid** — do NOT place the heading, subheading, or description text
  into the UI as labels, headlines, sublines, or captions. The component already shows that copy
  beside the asset; repeating it doubles the headline and hard-codes one language into a reusable
  asset.
- **Allowed:** short *synthesized* UI micro-labels the brief never contained, when they make the UI
  read as real (a generic status pill, a nav item, a placeholder metric, lorem / █ redaction). They
  must be generic and must not restate the component's copy. Prefer icons, bars, and gradient chips
  wherever a real label is not load-bearing.
- **No marketing headline / subheading — even in headline-capable slots.** Do NOT render a
  marketing headline or subheading/tagline in the asset (the page's message line), even where an
  embed style could structurally host one (e.g. `background-pointer`, `floating-card`, the
  composites). The host component renders the heading/subheading beside the asset, so the asset must
  not carry it — not even a synthesized restatement. Leave the headline slot out and convey the
  message through the composition (interface, scene, badges, functional micro-labels). See
  `uds-wireframe/rules/shared/no-marketing-heading.md`. (An author's *explicit*
  render-this-text instruction is still honoured per "Never suppress explicitly-requested text".)

## Structural markers are chrome — consume them as intent, never draw them

Strip and never render: `Context:`, `#`/`##`/`###`, step ordinals (`Schritt 1`, `Step 2`),
roadmap/status badges (`Coming Soon`, `In Entwicklung`, `Geplant`, `Beta`), testimonial identity
lines (person name + role/company). Each is a *signal* folded into intent:

| Module | `#` heading is | `##` subheading → intent |
|---|---|---|
| `corporate_stage` | product / value headline | value tagline |
| `content_card_gallery_item` | feature name | (often absent) |
| `step_card_accordion_item` / `step_accordion_item` | the step's action | step ordinal → this is step N of a sequence; convey progression, not the words |
| `bento_box_item` | feature name | roadmap status → aspirational / in-progress tone, not a drawn badge |
| `testimonial_slider` | person name | role / company → a portrait subject; drop the name/role text |
| `textmedia` | section headline | short claim |

## Deriving the subject

Synthesize the focal subject from the *meaning* of heading + description (biased by `Context:` for
sibling consistency), phrased as a concrete English visual subject — never the source string. E.g.
`# AI Phone Receptionist – Ihr 24/7-Telefonempfang` + its description → subject "an AI
phone-receptionist interface handling calls around the clock", not the German line. Then enrich per
`shared-brief-enrichment.md`.
