# Spacing Tokens

UDS provides two families of spacing tokens: `--space-*` (structural/layout) and
`--gap-*` (fine-grained/decorative). They behave differently in Tailwind v4.

> **Unit note:** Figma designs use **px**, but UDS CSS custom properties use
> **rem** (base: 16px = 1rem). All tables below show both units so the full
> chain is visible: Figma px → CSS rem → Tailwind class.

## `--space-*` Tokens (platform-dependent)

These tokens are **natively recognized** by Tailwind v4 — no alias needed.
`p-{n}` resolves to `var(--space-{n})` automatically.

Values differ by platform (comfortable vs compact):

| Token        | Comfortable (px) | Comfortable (rem) | Compact (px) | Compact (rem) | Tailwind (padding) | Tailwind (gap) | Tailwind (margin) |
| ------------ | ---------------- | ----------------- | ------------ | ------------- | ------------------ | -------------- | ----------------- |
| `--space-0`  | 0                | 0                 | 0            | 0             | `p-0`              | `gap-0`        | `m-0`             |
| `--space-1`  | 4px              | 0.25rem           | 2px          | 0.125rem      | `p-1`              | `gap-1`        | `m-1`             |
| `--space-2`  | 8px              | 0.5rem            | 6px          | 0.375rem      | `p-2`              | `gap-2`        | `m-2`             |
| `--space-3`  | 16px             | 1rem              | 12px         | 0.75rem       | `p-3`              | `gap-3`        | `m-3`             |
| `--space-4`  | 24px             | 1.5rem            | 18px         | 1.125rem      | `p-4`              | `gap-4`        | `m-4`             |
| `--space-5`  | 32px             | 2rem              | 24px         | 1.5rem        | `p-5`              | `gap-5`        | `m-5`             |
| `--space-6`  | 40px             | 2.5rem            | 32px         | 2rem          | `p-6`              | `gap-6`        | `m-6`             |
| `--space-7`  | 48px             | 3rem              | 40px         | 2.5rem        | `p-7`              | `gap-7`        | `m-7`             |
| `--space-8`  | 64px             | 4rem              | 48px         | 3rem          | `p-8`              | `gap-8`        | `m-8`             |
| `--space-9`  | 80px             | 5rem              | 64px         | 4rem          | `p-9`              | `gap-9`        | `m-9`             |
| `--space-10` | 96px             | 6rem              | 80px         | 5rem          | `p-10`             | `gap-10`       | `m-10`            |
| `--space-11` | 128px            | 8rem              | 96px         | 6rem          | `p-11`             | `gap-11`       | `m-11`            |

Also supports directional variants: `px-4`, `py-4`, `pt-4`, `pb-4`, `pl-4`,
`pr-4`, `mx-4`, `my-4`, etc.

> **Important:** These values differ from default Tailwind (which uses
> `0.25rem = 4px` per unit). In UDS, `p-4` = 24px (comfortable) or 18px
> (compact), **not** 16px as in default Tailwind. Never assume standard Tailwind
> sizing — always reference the table above.

## `--gap-*` Tokens (fine-grained, platform-independent)

Gap tokens use even-number suffixes and require an explicit `gap` alias in the
Tailwind class. Unlike `--space-*`, gap values are identical across comfortable
and compact.

| Token      | Value (px) | Value (rem) | Tailwind (padding) | Tailwind (gap) | Tailwind (margin) |
| ---------- | ---------- | ----------- | ------------------ | -------------- | ----------------- |
| `--gap-0`  | 0          | 0           | `p-gap-0`          | `gap-gap-0`    | `m-gap-0`         |
| `--gap-2`  | 2px        | 0.125rem    | `p-gap-2`          | `gap-gap-2`    | `m-gap-2`         |
| `--gap-4`  | 4px        | 0.25rem     | `p-gap-4`          | `gap-gap-4`    | `m-gap-4`         |
| `--gap-6`  | 6px        | 0.375rem    | `p-gap-6`          | `gap-gap-6`    | `m-gap-6`         |
| `--gap-8`  | 8px        | 0.5rem      | `p-gap-8`          | `gap-gap-8`    | `m-gap-8`         |
| `--gap-10` | 10px       | 0.625rem    | `p-gap-10`         | `gap-gap-10`   | `m-gap-10`        |
| `--gap-12` | 12px       | 0.75rem     | `p-gap-12`         | `gap-gap-12`   | `m-gap-12`        |
| `--gap-14` | 14px       | 0.875rem    | `p-gap-14`         | `gap-gap-14`   | `m-gap-14`        |

Also supports directional variants: `px-gap-4`, `py-gap-2`, etc.

## Figma Spacing Token to Tailwind Mapping

Figma designs reference spacing tokens as `space/{n}` and `gap/{n}`. Use these
tables to translate any Figma spacing value to the exact Tailwind utility class.

### Figma `space/*` → Tailwind utility

| Figma Token | Comfortable (px) | CSS Variable | Tailwind (padding) | Tailwind (margin) | Tailwind (gap) |
| ----------- | ---------------- | ------------ | ------------------ | ----------------- | -------------- |
| `space/0`   | 0                | `--space-0`  | `p-0`              | `m-0`             | `gap-0`        |
| `space/1`   | 4                | `--space-1`  | `p-1`              | `m-1`             | `gap-1`        |
| `space/2`   | 8                | `--space-2`  | `p-2`              | `m-2`             | `gap-2`        |
| `space/3`   | 16               | `--space-3`  | `p-3`              | `m-3`             | `gap-3`        |
| `space/4`   | 24               | `--space-4`  | `p-4`              | `m-4`             | `gap-4`        |
| `space/5`   | 32               | `--space-5`  | `p-5`              | `m-5`             | `gap-5`        |
| `space/6`   | 40               | `--space-6`  | `p-6`              | `m-6`             | `gap-6`        |
| `space/7`   | 48               | `--space-7`  | `p-7`              | `m-7`             | `gap-7`        |
| `space/8`   | 64               | `--space-8`  | `p-8`              | `m-8`             | `gap-8`        |
| `space/9`   | 80               | `--space-9`  | `p-9`              | `m-9`             | `gap-9`        |
| `space/10`  | 96               | `--space-10` | `p-10`             | `m-10`            | `gap-10`       |
| `space/11`  | 128              | `--space-11` | `p-11`             | `m-11`            | `gap-11`       |

Directional variants: `px-{n}`, `py-{n}`, `pt-{n}`, `pb-{n}`, `pl-{n}`,
`pr-{n}`, `mx-{n}`, `my-{n}`, `mt-{n}`, `mb-{n}`, `ml-{n}`, `mr-{n}`.

### Figma `gap/*` → Tailwind utility

| Figma Token | Value (px) | CSS Variable | Tailwind (padding) | Tailwind (margin) | Tailwind (gap) |
| ----------- | ---------- | ------------ | ------------------ | ----------------- | -------------- |
| `gap/0`     | 0          | `--gap-0`    | `p-gap-0`          | `m-gap-0`         | `gap-gap-0`    |
| `gap/2`     | 2          | `--gap-2`    | `p-gap-2`          | `m-gap-2`         | `gap-gap-2`    |
| `gap/4`     | 4          | `--gap-4`    | `p-gap-4`          | `m-gap-4`         | `gap-gap-4`    |
| `gap/6`     | 6          | `--gap-6`    | `p-gap-6`          | `m-gap-6`         | `gap-gap-6`    |
| `gap/8`     | 8          | `--gap-8`    | `p-gap-8`          | `m-gap-8`         | `gap-gap-8`    |
| `gap/10`    | 10         | `--gap-10`   | `p-gap-10`         | `m-gap-10`        | `gap-gap-10`   |
| `gap/12`    | 12         | `--gap-12`   | `p-gap-12`         | `m-gap-12`        | `gap-gap-12`   |
| `gap/14`    | 14         | `--gap-14`   | `p-gap-14`         | `m-gap-14`        | `gap-gap-14`   |

### Figma pixel value → Token reverse lookup

When Figma shows a raw pixel value (e.g., in Auto Layout gap or padding), find
the matching token:

| Pixel Value | Space Token (comfortable) | Gap Token | Preferred Tailwind  |
| ----------- | ------------------------- | --------- | ------------------- |
| 0           | `space/0`                 | `gap/0`   | `p-0` / `gap-0`     |
| 2           | —                         | `gap/2`   | `gap-gap-2`         |
| 4           | `space/1`                 | `gap/4`   | `p-1` / `gap-gap-4` |
| 6           | —                         | `gap/6`   | `gap-gap-6`         |
| 8           | `space/2`                 | `gap/8`   | `p-2` / `gap-gap-8` |
| 10          | —                         | `gap/10`  | `gap-gap-10`        |
| 12          | —                         | `gap/12`  | `gap-gap-12`        |
| 14          | —                         | `gap/14`  | `gap-gap-14`        |
| 16          | `space/3`                 | —         | `p-3` / `gap-3`     |
| 24          | `space/4`                 | —         | `p-4` / `gap-4`     |
| 32          | `space/5`                 | —         | `p-5` / `gap-5`     |
| 40          | `space/6`                 | —         | `p-6` / `gap-6`     |
| 48          | `space/7`                 | —         | `p-7` / `gap-7`     |
| 64          | `space/8`                 | —         | `p-8` / `gap-8`     |
| 80          | `space/9`                 | —         | `p-9` / `gap-9`     |
| 96          | `space/10`                | —         | `p-10` / `gap-10`   |
| 128         | `space/11`                | —         | `p-11` / `gap-11`   |

> **Worked example:** Figma shows a price table with `gap: 8` between cards.
> Look up 8px → `space/2` (comfortable). Use `gap-2` in Tailwind. This resolves
> to `var(--space-2)` = 8px on comfortable, 6px on compact. The spacing is
> pixel-accurate on comfortable and platform-adaptive on compact.

## Arbitrary Values

Arbitrary spacing (`p-[20px]`, `gap-[10px]`) is allowed **ONLY** when no
existing token provides the needed value. Before using arbitrary values, verify
the value is not already covered by the token tables above. Always prefer tokens
for platform adaptability.

## px ↔ rem Conversion

UDS uses the CSS standard base of **16px = 1rem**. Figma designs show values in
**px**, while CSS custom properties store values in **rem**. When you inspect
computed styles in DevTools or Playwright, browsers resolve rem back to **px**.

**Formula:** `rem = px ÷ 16`

**Quick reference:**

| px    | rem      |
| ----- | -------- |
| 2px   | 0.125rem |
| 4px   | 0.25rem  |
| 6px   | 0.375rem |
| 8px   | 0.5rem   |
| 10px  | 0.625rem |
| 12px  | 0.75rem  |
| 14px  | 0.875rem |
| 16px  | 1rem     |
| 18px  | 1.125rem |
| 24px  | 1.5rem   |
| 32px  | 2rem     |
| 40px  | 2.5rem   |
| 48px  | 3rem     |
| 64px  | 4rem     |
| 80px  | 5rem     |
| 96px  | 6rem     |
| 128px | 8rem     |

> **Why this matters:** When verifying spacing with Playwright MCP or DevTools,
> `getComputedStyle()` returns values in **px** (browsers resolve rem → px),
> making the result directly comparable to Figma px values. The rem column in
> the token tables above helps when reading raw CSS source or style sheets.

## Decision Guide

| Situation                           | Use              | Reason                          |
| ----------------------------------- | ---------------- | ------------------------------- |
| Section/page layout padding         | `p-6`, `px-8`    | Space tokens, platform-adaptive |
| Component internal padding          | `p-4`            | Space tokens, platform-adaptive |
| Flex/grid layout gaps               | `gap-4`, `gap-6` | Space tokens, platform-adaptive |
| Small icon+label gap                | `gap-gap-4`      | Gap token, 4px fixed            |
| Tight row spacing                   | `gap-gap-2`      | Gap token, 2px fixed            |
| Design value not in any token table | `p-[value]`      | Arbitrary, last resort          |

## SUPER CRITICAL: Pixel-Accurate Spacing Verification

**Every spacing value in the implementation MUST be pixel-accurate compared to
the original Figma design.** This is non-negotiable.

### Verification Procedure

After implementing any layout, perform this spacing audit for **every** element:

1. **Read the Figma design** — for each container, card, section, and flex/grid
   layout, note the exact padding, margin, and gap values from Figma's Auto
   Layout or spacing properties.
2. **Identify the Figma token** — Figma shows either a token name (e.g.,
   `space/2`) or a raw pixel value (e.g., `8`). Use the reverse lookup table
   above to find the correct token.
3. **Map to the correct Tailwind class** — use the Figma-to-Tailwind tables
   above. Verify the token number matches exactly:
   - `space/2` (8px) → `p-2`, `gap-2`, `m-2` (NOT `p-8` or `gap-8`)
   - `space/4` (24px) → `p-4`, `gap-4` (NOT `p-24` or `p-6`)
   - `gap/8` (8px) → `gap-gap-8` (NOT `gap-8`, which is `--space-8` = 64px!)
4. **Double-check every value** — compare the Tailwind class's resolved pixel
   value against the Figma design value. They must match exactly for the
   comfortable platform.
5. **Watch for space vs gap confusion** — `gap-2` = `var(--space-2)` = 8px, but
   `gap-gap-2` = `var(--gap-2)` = 2px. Mixing these up is a common source of
   spacing bugs.
6. **Browser verification (Playwright MCP)** — if the app is running locally,
   use `browser_navigate` to open the page, `browser_snapshot` to identify
   element refs, then `browser_evaluate` with `getComputedStyle()` to extract
   actual computed spacing and cross-check against Figma px values:
   ```javascript
   (el) => {
     const s = getComputedStyle(el);
     return {
       paddingTop: s.paddingTop,
       paddingRight: s.paddingRight,
       paddingBottom: s.paddingBottom,
       paddingLeft: s.paddingLeft,
       marginTop: s.marginTop,
       marginRight: s.marginRight,
       marginBottom: s.marginBottom,
       marginLeft: s.marginLeft,
       gap: s.gap,
       rowGap: s.rowGap,
       columnGap: s.columnGap,
     };
   };
   ```
   > **Note:** `getComputedStyle()` returns values in **px** (browsers resolve
   > rem → px for computed values), so the result is directly comparable to
   > Figma px values. See the "Playwright MCP Spacing Verification" section in
   > `SKILL.md` for the full workflow.

### Common Pixel-Accuracy Mistakes

| Figma Shows      | WRONG           | CORRECT           | Why                                                    |
| ---------------- | --------------- | ----------------- | ------------------------------------------------------ |
| `space/2` (8px)  | `p-8` (64px)    | `p-2` (8px)       | Token number is 2, not the pixel value                 |
| `space/4` (24px) | `p-24` or `p-6` | `p-4` (24px)      | Use the token number, not px or Tailwind default scale |
| `gap/8` (8px)    | `gap-8` (64px)  | `gap-gap-8` (8px) | `gap-*` tokens need the `gap` alias prefix             |
| `gap/4` (4px)    | `gap-4` (24px)  | `gap-gap-4` (4px) | `gap-4` resolves to `--space-4` = 24px, not 4px        |
| 8px raw value    | `gap-[8px]`     | `gap-2` (8px)     | Always use a token; 8px = `space/2`                    |
| 16px padding     | `p-4` (24px)    | `p-3` (16px)      | UDS p-4 ≠ Tailwind default p-4; look up 16px → space/3 |
| 2px inner gap    | `gap-2` (8px)   | `gap-gap-2` (2px) | Small gaps use `--gap-*` tokens, not `--space-*`       |

> **Warning:** The most dangerous mistake is confusing token numbers with pixel
> values. `p-2` does NOT mean 2px — it means `var(--space-2)` = **8px**
> (comfortable). Always use the mapping tables, never guess.

## Do

- Always look up Figma spacing values in the mapping tables above before writing
  any Tailwind utility class.
- Use the reverse lookup table when Figma shows raw pixel values instead of
  token names.
- Verify every spacing class resolves to the correct pixel value for the
  comfortable platform after implementation.
- Use `--space-*` for structural spacing (section padding, layout gaps,
  component internal spacing).
- Use `--gap-*` for fine-grained/decorative spacing (icon-to-text gap, tight row
  spacing, small inner gaps).
- Prefer tokens over arbitrary values; use arbitrary only when the design value
  has no token match.

## Don't

- Assume UDS spacing numbers equal pixel values — `p-4` = 24px, NOT 4px.
- Assume standard Tailwind sizing — `p-4 ≠ 16px` in UDS.
- Use `gap-{n}` when you mean `gap-gap-{n}` — they resolve to completely
  different token families (`--space-*` vs `--gap-*`).
- Use arbitrary pixel values (`p-[8px]`) when a token exists (8px = `p-2`).
- Skip the post-implementation spacing audit — every spacing value must be
  verified pixel-accurate against the Figma design.
