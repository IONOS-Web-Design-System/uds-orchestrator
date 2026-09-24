<!-- THE ABSTRACT-REQUEST SITUATION — pushed by image-svc `src/craft/prompt.ts` when, and only
     when, the brief carries `sceneContext.abstract === true`: the moderator's planner judged that
     the request describes no concrete situation, and `place`, `timeOfDay`, `activity` and `who`
     are absent from the brief as a result.

     WHAT IT REPLACES. It is not an addition to the `# Scene` block — it stands IN PLACE of the
     four rows that block can no longer print. Without it an abstract brief arrives with a Feature,
     a cast position and an intent and nothing else, and the model supplies the missing situation
     from its own priors. Measured on one abstract CRM brief (email filing, contact updates, deal
     pipelines) at three variants in each of two craft profiles: every single frame depicted an
     artisan at a trade — a designer and a ceramicist on `full`, a leatherworker, a jeweller and a
     woodworker on `minimal`. The `minimal` arm is the decisive half of that measurement: its plan
     text and its craft prompt carried ZERO trade words, and it invented three different trades
     anyway. So this is not a leakage of vocabulary from anywhere; it is what gets filled in when
     nothing says what the setting is.

     WHY THE CONSTRAINT IS "DO NOT PIN AN OCCUPATION" AND NOT A LIST OF ROOMS. A list of rooms is a
     list of sentences, and a supplied sentence gets reproduced — measured repeatedly in this
     workstream, where one literal example of a tradesperson at a counter accounted for seven of
     eight invented trades before it was deleted. So this file states the PROPERTY the setting must
     have, names the AXES the decision has to cover, and supplies no setting, no object and no
     phrase for anything to copy.

     WHY THE REGISTER IS NAMED BUT NO EXPRESSION IS. The planner is forbidden to write the face —
     that prohibition is measured and it stands: a planner asked for happiness put a happiness
     token into the generator feature on every problem brief, trading a uniform sad face for a
     uniform fixed grin. The face is craft's decision, read off the situation. On an abstract brief
     there was no situation to read it off, so the honest answer defaulted to neutral. This file
     supplies the situation and says which END of the register it produces. It deliberately names
     no expression word, and it does NOT point at the register ladder in
     `shared-character-presence.md` either: that file is inlined on `full` and `minimal` and absent
     on `none`, and this block is pushed on all three, so a pointer would dangle on the floor.

     IT NAMES NO CAMERA, NO LIGHT, NO HOUR AND NO ROOM PRESET. Those are the three axes' decisions
     and they are injected elsewhere in this prompt; the "how enclosed / how shared / what the
     surfaces are" axes below are about WHAT THE PLACE IS, never about how it is seen or lit. A
     fourth voice on an axis is the conflict scene authority exists to remove.

     UNCONDITIONAL ON ALL THREE PROFILES, including `none`, on the same argument
     `craft-plausibility.md` is: it is a correctness property rather than photographic guidance. An
     invented occupation is a false claim about the customer on the floor exactly as much as on
     `full`, this block adds no axis, and it is gated on a fact about the BRIEF rather than on the
     image type — so `none`'s contract, that its prompt is byte-identical across all four image
     types, is untouched.

     DELIVERED VERBATIM by loadCraftContext (image-svc/src/craft/skills.ts): the LINE BREAKS ARE
     SEMANTIC, and this comment is stripped before delivery on every profile — author-only, never
     instruction. -->

# There is no situation in this request — so keep the one you invent small

This request describes what the product does, not a moment in anybody's life. That is why this
prompt states no place, no hour, no activity and nobody in particular: the request supplies none of
them, and there is nothing here for you to recover. **Do not reconstruct one.** The frame still has
to happen somewhere, so you are choosing a setting — but it is a backdrop that makes the subject
legible, not a story the request is making a claim about.

**Nothing in the frame may pin an occupation.** No trade, craft, specialism or profession, and the
prohibition covers all three channels it arrives through: the kind of room, the objects and
materials in it, and what anybody is wearing. A space built around one kind of work names that
work; so do the tools, stock and machinery that belong to one trade, and so does workwear. The
request said nothing about how its reader earns a living, and a frame that answers the question
invents a customer.

Decide the setting rather than accepting the first one that comes to mind, and decide it along
these axes: how enclosed or open the space is; whether it is private, shared or somewhere people
pass through; what its surfaces and materials are; how much of it is in use and how much is clear;
and whether it is somewhere people settle or somewhere they pause. Each photograph in this set is
generated independently, so answer these axes afresh every time and never carry a setting over from
another prompt.

**Keep the moment light.** Nothing is being fixed, nothing is effortful and nothing is at stake —
this is an ordinary interval that is already going well, and the background is doing the work of
suggesting a life around it rather than depicting an episode in one.

If somebody is in frame, read their face off that moment — and because the moment is an easy one,
the honest answer sits at the positive end of the register rather than at the neutral middle, which
is the end that gets skipped when there is no situation to argue for it. It has to be the look such
a moment actually produces, held for no one: a display arranged for the camera is the failure at
this end of the register, the same way a borrowed difficulty is the failure at the other.
