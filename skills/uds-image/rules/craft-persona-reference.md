<!-- THE PERSONA IDENTITY-REFERENCE BLOCK — emitted when image-svc attaches a persona's
     turnaround sheet (an IDENTITY REFERENCE SHEET) to the image request alongside the prompt.
     It is NOT emitted for a persona that has identity text only, and never when a `condition`
     reference is supplied (that reference owns the person and suppresses every sheet).

     ITS ROLE. The craft model that writes the prompt is NOT shown the sheet — image-svc sends it
     to the image model only, as a labelled image part (see gen-persona-reference-label.md). So
     this block says what the model CANNOT see, what the image model will be holding, and what
     the prompt must therefore leave alone. It is a sibling of craft-reference-condition.md and
     written in the same register: PROHIBITIONS, because a positive claim about what the sheet
     owns does not stop the craft model writing the attribute itself, while a prohibition naming
     the dimensions does. No example of a banned phrase appears here on purpose: an illustration
     of what not to write hands the model the words.

     THE IDENTITY TEXT STAYS. Unlike a `condition` reference, the persona body (spliced in by
     craft-persona-framing.md above this block) is still delivered, so the prompt may restate
     what that text says. What is forbidden is going BEYOND it: the sheet and the text together
     are the whole identity, and any extra appearance word is a second author contradicting the
     first.

     WHY "EXACTLY ONCE". A turnaround sheet shows one person in several views, and an image model
     handed one will happily draw the views. The sentence is repeated in the label on the image
     part (the label is the stronger channel); here it keeps the written prompt from asking for
     two people, a group, or "the same person at two ages".

     DELIVERED VERBATIM: the LINE BREAKS ARE SEMANTIC — each paragraph below is one long line —
     and this comment is stripped before delivery on every profile, so it is author-only and must
     never carry instruction. -->

# Identity reference

An IDENTITY REFERENCE SHEET of the persona described above is supplied to the image model together with this prompt, and it is the visual ground truth for who that person is. You are NOT shown it, so you cannot see what it holds.

Refer to the persona in your prompt as "the person from the identity reference". Restating the identity text given above is expected: keep it consistent with that text, word for word where you can.

Do NOT add any appearance attribute beyond the identity text given above. An age, a hair length, style or colour, a garment or its colour, a skin tone, an accessory or a body type that is not in that text is not yours to write: any such word would contradict the sheet. Ignore any instruction above that tells you to encode age explicitly, or to choose a hair, clothing or accessory token — for a person with an identity reference this overrides it.

The person from the identity reference appears exactly once. The sheet shows them in several views; the image shows that person once, in one pose, doing what the Feature says. Do NOT write a second view or a second copy of that person, a mirrored or duplicated figure, or a collage or grid of views. Other people the scene calls for are still written, as different individuals who do not share the persona's face, hair or outfit.
