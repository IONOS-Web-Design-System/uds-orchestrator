<!-- THE PERSONA FRAMING — emitted when the brief wants a person (any cutout, or a photoreal
     brief whose imageType or feature says a person is a subject) AND uds-showroom has a persona
     file for this (brand, showroom).

     It is the FRAMING ONLY. The persona body itself is per-(brand, showroom) content and stays in
     uds-showroom/rules/<brand>/<showroom>.md; {{persona}} is where image-svc splices it in. What
     this file owns is the CONTRACT between the persona and the brief — which fields each one
     wins — and that is the part a designer would change without a deploy.

     THE MULTI-PERSON PARAGRAPH (the last one before {{persona}}) makes the persona the MAIN
     character only, and says every other person is a different individual. The persona is a
     reference for ONE face; without the paragraph a bystander in the scene inherits it, which
     is the twins failure the vision gate's `When a showroom persona was supplied` section checks.

     DELIVERED VERBATIM: the two bullets and the paragraph breaks below are real line breaks, and
     everything within a line is one long line. This comment is stripped before delivery on every
     profile, so it is author-only and must never carry instruction. -->

# Persona — the character's FIXED identity (render THIS exact person)

The persona and the Feature own DIFFERENT fields. There is no overlap and no exception:
- IDENTITY (from the persona, always): face, age, gender, ethnicity, hair, build, personal style and wardrobe.
- SCENE (from the Feature, always): action, pose, expression, setting, props, framing context.
On any conflict, identity fields resolve to the persona and scene fields resolve to the Feature. If the persona text also describes an activity or a location, that is SCENE — ignore it and use the Feature's. If the Feature describes clothing, that is IDENTITY — ignore it and use the persona's.

The persona describes the MAIN character only. If a SECOND CHARACTER section follows it, that is the second person. Every other person in the frame is a different individual cast from the scene, visibly different in face, hair, age or build, and in wardrobe colour. Never write two people who look alike.

{{persona}}
