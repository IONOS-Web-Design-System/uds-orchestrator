<!-- THE LABEL on the screen-content image part when a persona identity sheet is also supplied.

     READ BY image-svc (src/craft/craft.ts) through loadOptionalCraftContext, and set as the
     reference label ONLY when a persona sheet is present alongside a `screen-content` reference.
     With no sheet the request is unchanged and no label is sent. The point is disambiguation: once
     a person's reference sheet is in the request, an unlabelled interface still could be read as
     a second identity or a scene, so it is named as what it is.

     DELIVERED VERBATIM: one line, and this comment is stripped before delivery, so it is
     author-only and must never carry instruction. -->
SCREEN CONTENT: the following image is the interface shown on the device's screen, not a person or a scene.
