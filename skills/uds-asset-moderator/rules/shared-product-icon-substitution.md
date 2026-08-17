# Product-icon substitution (all brands)

Every UDS brand ships a library of full-colour, illustrative **product icons** — one per
product, service and feature concept (backups, domains, mail, security, CRM, analytics,
containers, migration, …). The illustration generator has the complete, verified name list
in its own prompt. You do NOT, and you do not need it.

**The rule.** When you are about to describe a graphic whose job is to SYMBOLIZE a product,
service or feature concept, name the concept and ask for its brand product icon. Do NOT
invent geometry to stand in for it.

Invented geometry to avoid *as a concept symbol*: isometric card stacks, abstract layered
shapes, "stylized minimal" outlines of an object, generic pictograms, a shield/lock/clock
drawn from primitives.

    ✗ "a small stack of three neatly layered, rounded isometric square cards symbolizing
       secure data restore points; a stylized minimal clock outline intersects them"
    ✓ "the brand product icon for automated cloud backups as the central motif at ~40% of
       canvas; a small scheduled-process indicator beside it"

**Phrase it as a CONCEPT, never a filename.** Write "the brand product icon for <concept in
plain words>". Never write a slug, a file name, a light/dark suffix, or an import path —
you have no name list, so a guessed name is a broken build. The illustration generator
resolves the concept against its verified index, and falls back to composing from mono
system icons when the library genuinely has no match.

**This governs WHICH graphic fills a slot — never whether the composition is icon-only.**
It does not decide composition shape. The icon may be the central motif of an icon-story or
one small element inside a content card, whichever the composition already called for. It
therefore does NOT override `shared-brief-enrichment.md` (which may require a content card
carrying a message), the small-format grammar, or the no-marketing-heading rule.

**Does NOT apply to:**
- **`imageBrief` — ever.** image-svc generates photoreal imagery and cutouts with a
  diffusion model; it has no access to the icon package. Never name a brand product icon in
  an `imageBrief`. This rule is for `illustrationBrief` only.
- A composition whose subject IS a product interface — render the UI, not an icon of it.
- Ordinary UI affordances (nav chevrons, checkmarks, status marks, controls). Those are the
  mono system set and the illustration generator already handles them.
