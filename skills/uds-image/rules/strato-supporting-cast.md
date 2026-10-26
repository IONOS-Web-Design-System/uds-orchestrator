<!-- STRATO SUPPORTING CAST — who the OTHER people in a persona scene are.

     WHY THIS FILE EXISTS. When a showroom persona fixes the main character, the invent-a-person
     rules (casting pool, ethnicity, age band, garment variety) are withheld because they would
     argue with the persona. That left every OTHER person in the frame uncast, and the craft model
     filled the gap with the same maximal contrast to the persona every time: in a 7-frame local
     test (2026-10-26) a young woman with dark curly hair stood next to the persona in 4 of 7.
     Prose asking for "variety" cannot fix that — the model has nothing to vary between. This is a
     closed catalog that image-svc ROTATES through by a stable hash of the request and variant
     (the same mechanism as the camera / lighting presets), so the choice is made in code.

     FORMAT (read by image-svc): one `## <slug>` section per entry; the first line is the casting
     description, delivered verbatim; `HairColour:` is metadata only — image-svc skips an entry
     whose hair colour also appears in the persona's identity text, so the other person never
     shares the persona's most visible trait. Use one of: blonde, light-brown, brown, dark-brown,
     black, red, grey, bald.

     THE MIX follows strato-character-ethnicity.md for Germany (the STRATO market): mostly white /
     Northern-European, with Black, East Asian and South Asian entries, and a wider age range than
     the main character because a customer, colleague or client need not be the brand's core
     age. Genders alternate; builds and hair lengths are spread on purpose. Adding an entry widens
     the rotation; nothing else needs to change. -->

# Supporting cast — STRATO

## man-30s-short-lightbrown-beard
a white man in his early 30s with short light-brown hair and a close-trimmed beard, average build
HairColour: light-brown

## woman-20s-blonde-bob
a white woman in her late 20s with a chin-length blonde bob, slim build
HairColour: blonde

## man-40s-greying-glasses
a white man in his mid-40s with short greying hair and thin metal glasses, stocky build
HairColour: grey

## woman-30s-red-ponytail
a white woman in her early 30s with long red hair tied in a low ponytail and light freckles, average build
HairColour: red

## man-20s-black-fade
a Black man in his late 20s with a short black fade and a clean-shaven face, athletic build
HairColour: black

## woman-30s-eastasian-straight
an East Asian woman in her early 30s with straight black shoulder-length hair, slim build
HairColour: black

## man-20s-blond-undercut
a white man in his mid-20s with dark-blond hair in a short undercut, lean build
HairColour: blonde

## woman-40s-brown-pixie
a white woman in her early 40s with a short brown pixie cut and round tortoiseshell glasses, average build
HairColour: brown

## man-30s-southasian-beard
a South Asian man in his late 30s with short black hair and a full trimmed beard, average build
HairColour: black

## woman-20s-darkbrown-bun
a white woman in her mid-20s with dark-brown hair in a loose top bun, slim build
HairColour: dark-brown

## man-50s-bald-moustache
a white man in his early 50s, bald, with a neat grey moustache, broad build
HairColour: bald

## woman-30s-lightbrown-braid
a white woman in her mid-30s with light-brown hair in a single long braid, athletic build
HairColour: light-brown
