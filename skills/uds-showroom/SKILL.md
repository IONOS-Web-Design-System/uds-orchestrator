---
name: uds-showroom
description: Per-(brand, showroom) persona definitions — the "initiative context" for a product showroom. Read by image-svc when generating the showroom's character, keyed by brand and showroom. Persona = WHO the character is; the brief supplies the scene/action.
personaModules: ["corporate_stage", "testimonial_slider"]
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
  - Optional provenance keys (read by no service; they record where the persona came from):
    `pageUrl`, `tagline`, `stageType`, `stageScene` (the source stage description, verbatim),
    `stageImage`.
- The **body** is a plain-language description of the character's identity ONLY: face, age, gender,
  ethnicity, hair, build, and wardrobe/personal style. A frontmatter-only file (empty body) is a
  *registered* showroom that resolves but injects no persona.

Each brand has its own rule set, and a brand only ever sees its own directory:

- `rules/ionos/` — the IONOS showrooms.
- `rules/strato/` — the 37 STRATO products from the STRATO main navigation, one file per product.
  `displayName` is the German product name as STRATO sells it (`KI Telefonassistent`,
  `Homepage-Baukasten`); the aliases add the URL slug spellings and the English names callers send
  (`STRATO AI App Builder`). Each persona is written from that product's stage image on
  strato.de (`stageScene`, `stageImage`). Products whose stage shows no person (servers,
  STRATO GPT, KI Chat-Assistent, Domain-Umzug, Domain Guard, Cyber Protect, Cyber Protect
  Defender) are registered without a persona. One campaign face (a woman with dark corkscrew
  curls and an orange neckerchief) recurs on four stages: KI Telefonassistent,
  KI App & Site Builder, Homepage-Baukasten and Hosting. Those four describe the same person and
  differ only in wardrobe.

## Which modules use a persona

`personaModules` in this file's frontmatter lists the modules a persona applies to, for every
brand. Today that is `corporate_stage` and `testimonial_slider`. A request for any other module,
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
