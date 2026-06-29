# Shared character appearance — reasoning from brief signals

When a brief mentions an age range, occupation, or life-stage signal, use that context
to **reason** about who this specific person is and what they would naturally wear and
look like. Do not enumerate a fixed list and pick option A — synthesize tokens that feel
authentic to this particular character.

## The reasoning chain

1. **Read the brief for identity signals** — age range (20s / 30s / 40s / 50s),
   occupation or role, setting (home office / café / workshop / outdoors), and brand.
2. **Ask: who is this person?** What is their life stage, work style, and personality?
   A 25-year-old freelance developer has different hair and clothes than a 44-year-old
   restaurant owner. Let the answer shape the appearance.
3. **Derive ONE token per dimension** — hair style, accessory (or none), clothing item.
   Keep each token short and concrete. Do not stack all dimensions into one dense phrase.
4. **Encode only what the image model needs to make a choice** — a vibe word like
   `"casual knitwear"` leaves more natural variety than `"a cream chunky-knit sweater"`.
   The more specific the token, the more it locks all variants into one look.

## Occupation → appearance signals

These are reasoning examples, not a lookup table. Use them as inspiration to infer what
feels authentic — then write your own tokens for the specific person in the brief.

### 20s — self-employed / freelance / creative (Strato range)

| Occupation signal | Likely hair | Likely accessory | Likely clothing |
|---|---|---|---|
| Developer / coder | tousled, natural, practical | headphones around neck | hoodie, plain tee |
| Designer / creative | loose natural waves, or pulled back casually | statement glasses, or scarf | casual jacket over tee, knitwear |
| Photographer / maker | loose, slightly wind-blown | camera strap, or wristband | overshirt and tee, relaxed layers |
| Barista / food creative | pulled back in a practical bun | small earrings, or apron detail | casual tee, apron edge visible |
| Student / young entrepreneur | natural texture, relaxed | friendship bracelet, or none | plain tee, loose jeans |
| Remote worker / freelancer at home | loose and unstyled | none | soft knitwear, comfortable top |

### 30s–50s — established professional / small business owner (IONOS range)

| Occupation signal | Likely hair | Likely accessory | Likely clothing |
|---|---|---|---|
| Small business owner | neat but natural — shoulder-length, slight wave | watch, or simple jewellery | smart casual — fitted knitwear, neat shirt |
| Marketing / consultant | styled naturally — neat bob or layered | simple stud earrings, or reading glasses | blouse, smart-casual top |
| IT professional / engineer | short and clean | none, or functional watch | clean polo or casual button-down |
| Shop / restaurant owner | practical updo or neat shoulder | none | practical smart-casual |
| HR / operations | neat natural style | simple jewellery | blouse or soft knit |
| Craftsperson / trades | practical, tied back or short | none | functional casual, practical layers |

## How to encode

After reasoning, write the appearance as a short phrase inserted into the character
description — after ethnicity/age/build, before the scene:

```
"a white woman in her mid-20s, lean build, tousled natural hair, wearing a soft sage
hoodie, seated at a bright home office desk…"

"a Black man in his late 20s, average build, wireless headphones resting around his
neck, wearing a plain grey t-shirt, standing in a bright coworking space…"

"a white woman in her early 40s, average build, neat natural shoulder-length hair,
wearing a fitted navy knit sweater, standing in her small bakery…"

"a South Asian man in his late 30s, average build, short neat hair, a functional watch
on his wrist, wearing a clean casual button-down, at a modern office desk…"
```

## Variety rule — do not repeat the same combination

Across variants of the same run (or multiple runs from the same session), vary the
appearance combination. The goal is a cast of distinct individuals, not the same
archetype re-rendered. Specifically:
- Vary hair between straight / wavy / curly / short-tousled — do not default to one
- Rotate accessory presence — some characters have one, some have none
- Vary clothing category — not every character wears a hoodie or a blouse

When variants > 1 and the brief is generic (no explicit appearance request), **omit
specific hair and accessory tokens** and encode only clothing vibe (`"casual knitwear"`,
`"smart-casual top"`) — the image model will vary hair and accessories naturally across
variants.
