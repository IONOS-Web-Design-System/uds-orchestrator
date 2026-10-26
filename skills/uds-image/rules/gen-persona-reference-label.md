<!-- THE LABEL on a persona's identity-reference image part — the text image-svc puts in front of
     the sheet so the image model reads it as a reference and not as a layout to copy.

     READ BY image-svc's attachPersonaSheets (src/craft/craft.ts) through loadOptionalCraftContext,
     with {{role}} = `MAIN CHARACTER` or `SECOND CHARACTER`. The text BEFORE the `## Closing`
     heading is the label (one per sheet). The body of `## Closing` is emitted ONCE, after the last
     sheet, as a plain text part: it is what stops a bystander inheriting a persona's face. Keep
     the heading spelled exactly `## Closing` on a line of its own.

     WHY THE NEGATIVE LIST. A turnaround sheet is a grid of views with captions on a white studio
     background with fabric swatches. Without the list the image model reproduces those
     furniture items (a multi-view collage, label text, a white backdrop, swatch chips) instead
     of casting the person into the scene. The list names exactly what the sheets carry.

     DELIVERED VERBATIM: the label is one paragraph on one line, and this comment is stripped
     before delivery, so it is author-only and must never carry instruction. -->
IDENTITY REFERENCE — {{role}}: this sheet shows ONE person in repeated views. Depict this person exactly ONCE, matching face, hair, skin, build, glasses and accessories, and wardrobe. It is NOT a layout: do not reproduce its grid, multiple views, text labels, white studio background or fabric swatches.

## Closing

Any other person in the image is someone else and must not resemble the person(s) in the identity reference(s).
