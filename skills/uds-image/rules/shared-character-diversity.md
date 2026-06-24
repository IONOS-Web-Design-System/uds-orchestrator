# Character diversity

Applies to all image types that include a person (avatar, portrait, scene, scenario).
When the brief does not specify ethnicity, body shape, age, or gender, the agent **must**
autonomously choose these characteristics. Never leave them undefined — image models default
to a narrow demographic when given no signal.

## Ethnicity

Choose **only** from this closed pool. Do not pick any ethnicity not listed here (e.g.
"Hispanic", "Latino", "Mediterranean", "Middle Eastern") — these are not in scope and the
image model interprets them inconsistently. Use only the exact encodings shown.

| Ethnicity | Approximate weight | Exact prompt encoding to use |
|---|---|---|
| White / Caucasian | ~50 % | "a white woman in her 40s" / "a white man in his 30s" |
| Black / African descent | ~25 % | "a Black man in his 30s" / "a Black woman in her 40s" |
| East or South-East Asian | ~15 % | "an East Asian woman in her 50s" / "an East Asian man in his 40s" |
| South Asian | ~10 % | "a South Asian man in his 40s" / "a South Asian woman in her 30s" |

**Rules:**
- **Closed pool — no exceptions.** If the chosen ethnicity is not in the table above, pick
  the next closest entry from the table instead.
- When generating multiple images in one session, rotate across ethnicities rather than
  defaulting to the same choice every time.
- Never infer ethnicity from a name unless the cultural context is load-bearing for the story
  (e.g., "traditional Japanese home cook" → East Asian).
- Always encode the chosen ethnicity explicitly in the prompt — do not rely on the model to
  infer diversity from a neutral brief.

## Body shape

**Mandatory.** Look up the role in the table below and use the listed build descriptor
verbatim in the prompt. Do not substitute a generic build (e.g. "average") when a
role-specific one is prescribed.

| Role / context | Required build descriptor |
|---|---|
| Manual trades (carpenter, builder, mechanic, farmer) | `stocky build` or `solid, muscular build` |
| Office / knowledge work | `average build` or `lean build` |
| Fitness / wellness | `lean, athletic build` |
| Creative / freelance | choose freely — vary across images |
| Healthcare / caregiving | choose freely — vary across images |
| Role not listed | choose freely, but not always "average" — vary across images |

Do not put build descriptors in `negativePrompt`. Do not write "stocky clichés" or similar
in the negative prompt — this directly cancels the mandatory build instruction above.

## Age

Default to a working-age adult (30s–50s) unless the brief clearly implies a different range
(e.g., "student" → 20s, "retired entrepreneur" → 60s+).

## Gender

If unspecified, choose based on story context. Vary gender across a session's image set.

## How to encode in the prompt

Add the chosen characteristics as a brief descriptor early in the `prompt` field, before the
scene description:

```
"a Black woman in her 40s with an average build, standing in …"
"a white man in his 30s, stocky build, wearing an apron in …"
"an East Asian woman in her 50s, lean build, at her …"
```

**Never** encode ethnicity, gender, age, or body shape in `negativePrompt` — put them in
`prompt` as positive descriptors only.
