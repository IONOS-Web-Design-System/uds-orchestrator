---
name: uds-showroom
description: Per-(brand, showroom) persona definitions — the "initiative context" for a product showroom. Read by image-svc when generating the showroom's character, keyed by brand and showroom. Persona = WHO the character is; the brief supplies the scene/action.
personaModules: ["corporate_stage", "testimonial", "testimonial_slider"]
---

# UDS Showroom personas

Each showroom (a product, e.g. `ai-app-builder`) has a persona that anchors the character
generated for its stage assets. Personas live in `rules/<brand>/<showroom>.md`:

- The **frontmatter** carries the catalog metadata the moderator reads to resolve a request to this showroom:
  - `displayName` — human name, e.g. `"AI Website Builder"`.
  - `category` — one of `ai | email-office | website-tools | ecommerce | wordpress | hosting | server | cloud`.
  - `aiTier` — `1` for AI showrooms (top), `2` otherwise.
  - `aliases` — inline list of extra match terms, e.g. `["website builder", "site builder"]`.
  - `figmaRefs` — Figma node references to curated example images (empty for now).
  - `personaRefs` — inline list of the persona options' Figma slugs, option 1 first, e.g.
    `["strato-ai-app-builder-persona-1", "strato-ai-app-builder-persona-2"]`. Each slug is the name of
    a character turnaround sheet in the Figma catalog (see "Persona sheets" below) and has exactly
    one matching `## <slug>` section in the body. Absent key = no sheets.
  - Optional provenance keys (read by no service; they record where the persona came from):
    `pageUrl`, `tagline`, `stageType`, `stageScene` (the source stage description, verbatim),
    `stageImage`.
- The **body** is a plain-language description of the character's identity ONLY: face, age, gender,
  ethnicity, hair, build, and wardrobe/personal style. A frontmatter-only file (empty body) is a
  *registered* showroom that resolves but injects no persona. The body has one section per
  persona option:

  ```
  ## strato-ai-app-builder-persona-1
  Signature: ...
  Who: ...

  ## strato-ai-app-builder-persona-2
  Signature: ...
  ```

  A section heading matches `^## (\S+)\s*$` and its text is the slug, which must be one of
  `personaRefs`; the section runs to the next such heading or the end of the file. A body with NO
  `## ` heading is a legacy single persona (one option, no sheet) and keeps working unchanged.

Each brand has its own rule set, and a brand only ever sees its own directory:

- `rules/ionos/` — the IONOS showrooms.
- `rules/strato/` — the 37 STRATO products from the STRATO main navigation, one file per product.
  `displayName` is the German product name as STRATO sells it (`KI Telefonassistent`,
  `Homepage-Baukasten`); the aliases add the URL slug spellings and the English names callers send
  (`STRATO AI App Builder`). All 37 strato showrooms have character turnaround sheets
  on the Figma page `persona/strato`; a strato persona's text is written from its sheet, one
  `## <slug>` section per sheet (see "Persona sheets" below). `stageScene` and `stageImage` record
  which strato.de stage image the product is shown with; they are provenance only, not the source
  of the persona text.

## Persona sheets

Each persona option is a character TURNAROUND SHEET: one person in repeated views (front, side,
back, details) on a white studio background. It is made in Figma and read by the moderator's
catalog, then sent to the image model as a labelled reference image next to the identity text.

- The Figma page is named `persona/<brand>`, e.g. `persona/strato`.
- Each sheet is a component named `<brand>-<showroom>-persona-<n>`, e.g.
  `strato-ai-app-builder-persona-1`. That name is the slug listed in `personaRefs` and used as the
  `## <slug>` heading in the body, so the three always agree.
- The component description starts with the prefix `[persona]`, which is how the catalog tells a
  persona sheet apart from an ordinary asset.

The sheet owns what the person looks like; the `## <slug>` text states the same identity in words
and is what a request without a sheet falls back to.

## Which persona option a request gets

For a showroom with several options the planner picks, from the module, brief and showroom, which
option is the MAIN character. Contract:

- The pick is a slug from `personaRefs`. With no pick, an invalid pick, or a showroom the planner
  inferred rather than the caller named, the default is option 1 (`personaRefs[0]`).
- The planner may add an optional `personaSecondary` for a scene with two people. There is at most
  one second persona, it is a different option from the main one, and a character cutout never gets
  one. Two identical people never appear: the same slug cannot be main and second.
- The testimonial modules (`testimonial`, `testimonial_slider`) may answer `none`, meaning no persona
  for this request; no other module may.
- A request carrying a `condition` reference photograph gets no persona sheets (that photograph
  owns the person). A `screen-content` reference is unaffected and is sent alongside the sheets.
- Every other person in the frame is a different individual from the persona; the image gate fails
  a run where the same person, or two lookalikes, appear.

## Which modules use a persona

`personaModules` in this file's frontmatter lists the modules a persona applies to, for every
brand. Today that is `corporate_stage` and the testimonial modules (`testimonial` and
`testimonial_slider`; production traffic uses both names). A request for any other module,
or with no module, never receives the persona, even for a showroom that has one: its character is
chosen freely, exactly as for a showroom without a persona. Names match the request's `module`
exactly. Remove the key to apply personas to every module again; `[]` turns them off everywhere.

image-svc reads the rule for the request's `(brand, showroom)` and prepends the persona to the
character image prompt. The persona and the brief's feature own different fields, with no overlap:
the persona fixes IDENTITY (face, age, gender, ethnicity, hair, build, wardrobe); the feature owns
SCENE (action, pose, expression, setting, props). Write personas as identity only — if a persona body
also describes an activity or a setting, that part is ignored in favor of the feature's scene.

## Writing a persona that renders the same person every time

The image prompt is rewritten by a model before it is rendered. That model keeps the first cues
it reads and drops fine cues buried mid-paragraph, such as glasses, a greying beard or a hair
length. The `rules/strato/` files use this layout, one line per facet:

```
Signature: the 2-3 cues that make this person recognisable at a glance (hair, glasses, beard, a signature garment).
Who: age, role, build.
Face: face shape, cheekbones, nose, lips, brows.
Eyes: colour.
Skin: tone and undertone, freckles, make-up.
Hair: colour (including roots and ends), texture, length, parting, how it is worn.
Facial hair / Accessories: only when present, with the exact frame style or beard colour.
Wardrobe: garments and their exact colours.
```

Write it from the real reference image at full size, not from the alt text. Name exact colours
(`pale-grey translucent acrylic`, `salt-and-pepper`), not generic ones.
