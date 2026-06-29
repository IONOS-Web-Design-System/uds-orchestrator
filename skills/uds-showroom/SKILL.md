---
name: uds-showroom
description: Per-(brand, showroom) persona definitions — the "initiative context" for a product showroom. Read by image-svc when generating the showroom's character, keyed by brand and showroom. Persona = WHO the character is; the brief supplies the scene/action.
---

# UDS Showroom personas

Each showroom (a product, e.g. `ai-app-builder`) has a persona that anchors the character
generated for its stage assets. Personas live in `rules/<brand>/<showroom>.md`:

- The **body** is a plain-language description of the character (look, age, vibe, wardrobe, pose).
- The **frontmatter** `figmaRefs` lists Figma node references to curated example images
  (empty for now; future: image-svc passes them to the image model as visual conditioning).

image-svc reads the rule for the request's `(brand, showroom)` and prepends the persona to the
character image prompt. The brief's feature text refines the scene/action; the persona fixes identity.
