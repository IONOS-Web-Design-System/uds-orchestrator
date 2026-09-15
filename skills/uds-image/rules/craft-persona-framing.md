<!-- THE PERSONA FRAMING — emitted when the brief wants a person (any cutout, or a photoreal
     brief whose imageType or feature says a person is a subject) AND uds-showroom has a persona
     file for this (brand, showroom).

     It is the FRAMING ONLY. The persona body itself is per-(brand, showroom) content and stays in
     uds-showroom/rules/<brand>/<showroom>.md; {{persona}} is where image-svc splices it in. What
     this file owns is the CONTRACT between the persona and the brief — which fields each one
     wins — and that is the part a designer would change without a deploy.

     DELIVERED VERBATIM: the two bullets and the paragraph breaks below are real line breaks, and
     everything within a line is one long line. This comment is stripped before delivery on every
     profile, so it is author-only and must never carry instruction. -->

# Persona — the character's FIXED identity (render THIS exact person)

The persona and the Feature own DIFFERENT fields. There is no overlap and no exception:
- IDENTITY (from the persona, always): face, age, gender, ethnicity, hair, build, personal style and wardrobe.
- SCENE (from the Feature, always): action, pose, expression, setting, props, framing context.
On any conflict, identity fields resolve to the persona and scene fields resolve to the Feature. If the persona text also describes an activity or a location, that is SCENE — ignore it and use the Feature's. If the Feature describes clothing, that is IDENTITY — ignore it and use the persona's.

{{persona}}
