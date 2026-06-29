# STRATO — character ethnicity by market

Overrides the ethnicity pool in `shared-character-diversity` for the `strato` brand.
STRATO is a German-market hosting brand. Its audience is **younger** than IONOS —
early-to-mid 20s to early 30s. Age encodings below reflect this. Before choosing an
ethnicity, scan the brief's `showroom` field and `feature` text for market signals.

## Age range — brand default
STRATO characters are in their **20s to early 30s**. Use this unless the brief
specifies otherwise. Example encodings: `"a white woman in her mid-20s"`,
`"a white man in his late 20s"`, `"a Mediterranean man in his early 30s"`.
Never default to 40s or 50s — that is the IONOS audience profile.

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

Primary market is white / Northern-European. Age range: 20s–early 30s.

| Ethnicity | Weight | Exact prompt encoding |
|---|---|---|
| White / Northern-European | ~80 % | `"a white woman in her mid-20s"` / `"a white man in his late 20s"` |
| Black / African descent | ~10 % | `"a Black man in his late 20s"` |
| East or South-East Asian | ~7 % | `"an East Asian woman in her early 30s"` |
| South Asian | ~3 % | `"a South Asian man in his late 20s"` |

### Spain (ES) and Italy (IT)

Primary market is Mediterranean / Latin-European. Use the Mediterranean descriptor; do
NOT use "Latino" (which models read as Latin American) or "Hispanic".

| Ethnicity | Weight | Exact prompt encoding |
|---|---|---|
| Mediterranean / Latin-European | ~65 % | `"a Mediterranean woman in her mid-20s with olive complexion"` / `"a Mediterranean man in his late 20s with olive complexion"` |
| White / Northern-European | ~20 % | `"a white woman in her early 30s"` |
| Black / African descent | ~10 % | `"a Black man in his late 20s"` |
| East or South-East Asian | ~5 % | `"an East Asian woman in her mid-20s"` |

### No market signal detected — STRATO brand default

Do **not** fall back to the balanced global pool. When no market is named the brand
default skews white / Northern-European, age 20s–early 30s:

| Ethnicity | Weight | Exact prompt encoding |
|---|---|---|
| White / Northern-European | ~80 % | `"a white woman in her mid-20s"` / `"a white man in his late 20s"` |
| Black / African descent | ~10 % | `"a Black man in his late 20s"` |
| East or South-East Asian | ~7 % | `"an East Asian woman in her early 30s"` |
| South Asian | ~3 % | `"a South Asian man in his late 20s"` |

Do not guess a market — a detected market signal (Step 1) always overrides this default.

## Rules that still apply from shared-character-diversity

- Closed pool: use only the encodings listed above — do not invent descriptors.
- Always encode the chosen ethnicity explicitly in `prompt` — never leave it unspecified.
- Sample **in proportion to the weights above**: across a session the distribution should
  approximate the listed percentages. Vary within that distribution for realism, but never
  flatten the pool to an even rotation, which would erase the brand-default skew.
- Never encode ethnicity in `negativePrompt`.

## Character appearance (Strato-specific — supplements ethnicity encoding)

After choosing ethnicity and age, apply the Strato character appearance signals from
`strato-image-style`. **Vary the combination across images** — do not repeat the same
hair + accessory + clothing combination. The goal is a cast of distinct individuals who
all feel unmistakably Strato, not the same person rendered repeatedly.

- **Hair:** choose ONE from the hair variety pool in `strato-image-style`. When the brief
  does not specify hair, omit the hair token and let the image model vary naturally.
- **Accessory:** choose ONE or none from the accessory pool. Do not stack.
- **Clothing:** choose ONE from the clothing pool — hoodie is NOT the default every time.
- **Never** encode all three dimensions as the same combination across multiple images.
