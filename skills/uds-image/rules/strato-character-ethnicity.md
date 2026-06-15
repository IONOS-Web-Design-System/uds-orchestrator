# STRATO — character ethnicity by market

Overrides the ethnicity pool in `shared-character-diversity` for the `strato` brand.
STRATO is a German-market hosting brand, so its core customer base is predominantly
white / Northern-European. Before choosing an ethnicity, scan the brief's `showroom`
field and `feature` text for market signals. Apply the matching market pool below. If no
signal is found, use the STRATO brand default (also white-primary).

## Step 1 — Detect the target market

Scan `showroom` and `feature` for these signals (case-insensitive):

| Market | Signals to match |
|---|---|
| Germany (DE) | `de`, `de-`, `germany`, `german`, `deutschland`, `deutsch` |
| Spain (ES) | `es`, `es-`, `spain`, `spanish`, `spanien`, `españa`, `espana` |
| Italy (IT) | `it`, `it-`, `italy`, `italian`, `italia` |

Match against the `showroom` prefix first (e.g. `showroom: "de-app-builder"` → Germany),
then scan the `feature` text for country/language names if no prefix is found.

## Step 2 — Apply the market pool

### Germany (DE)

Primary market is white / Northern-European. Reflect the core customer demographic.

| Ethnicity | Weight | Exact prompt encoding |
|---|---|---|
| White / Northern-European | ~80 % | `"a white man in his 40s"` / `"a white woman in her 30s"` |
| Black / African descent | ~10 % | `"a Black man in his 30s"` |
| East or South-East Asian | ~7 % | `"an East Asian woman in her 50s"` |
| South Asian | ~3 % | `"a South Asian man in his 40s"` |

### Spain (ES) and Italy (IT)

Primary market is Mediterranean / Latin-European. Use the Mediterranean descriptor; do
NOT use "Latino" (which models read as Latin American) or "Hispanic" (outside the encoding list).

| Ethnicity | Weight | Exact prompt encoding |
|---|---|---|
| Mediterranean / Latin-European | ~65 % | `"a Mediterranean man in his 40s with olive complexion and dark hair"` / `"a Mediterranean woman in her 30s"` |
| White / Northern-European | ~20 % | `"a white man in his 50s"` |
| Black / African descent | ~10 % | `"a Black woman in her 40s"` |
| East or South-East Asian | ~5 % | `"an East Asian man in his 30s"` |

### No market signal detected — STRATO brand default

Do **not** fall back to the balanced global pool. When no market is named the brand
default skews white / Northern-European:

| Ethnicity | Weight | Exact prompt encoding |
|---|---|---|
| White / Northern-European | ~80 % | `"a white man in his 40s"` / `"a white woman in her 30s"` |
| Black / African descent | ~10 % | `"a Black man in his 30s"` |
| East or South-East Asian | ~7 % | `"an East Asian woman in her 50s"` |
| South Asian | ~3 % | `"a South Asian man in his 40s"` |

Do not guess a market — a detected market signal (Step 1) always overrides this default.

## Rules that still apply from shared-character-diversity

- Closed pool: use only the encodings listed above — do not invent descriptors.
- Always encode the chosen ethnicity explicitly in `prompt` — never leave it unspecified.
- Sample **in proportion to the weights above**: across a session the distribution should
  approximate the listed percentages, so the highest-weight entry (white) legitimately
  recurs most often. Vary within that distribution for realism, but never flatten the pool
  to an even rotation, which would erase the brand-default skew.
- Body-shape and age guidance from `shared-character-diversity` are unchanged.
- Never encode ethnicity in `negativePrompt`.
