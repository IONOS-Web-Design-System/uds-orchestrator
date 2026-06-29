# Strato Brand

**`data-brand="strato"` | Font: Poppins | Market: Germany / Europe**

## CSS Import

```css
@import '@ionos-web-design-system/core/brands/strato';
```

## Brand Personality

STRATO's core brand value is **orange** — more than a colour, it's an attitude:
> *"ORANGE is positive — optimistic, light, bright, sunny, making progress."*

Orange drives every branded moment: logo, icons, headers, stage backgrounds. Blue provides the structural backbone for interactive elements and text. Grey and white handle long-form content. The palette is warm, energetic, and approachable.

---

## Typography

| Role | Font | Weight | CSS Token |
|------|------|--------|-----------|
| Headings | Poppins | Bold | `--font-title` |
| Body | Poppins | Regular | `--font-base` |

Poppins is a geometric sans-serif (Google Fonts). Use it exclusively — no fallback brands, no mixing with other typefaces in Strato contexts.

---

## Color Palette

All Figma paths below are **reference notation only** — not CSS variables. Use the hex values in code, or UDS semantic tokens (`--surface-base`, `--text-base`, etc.) for UI roles.

### Orange — Primary Brand Colors

| Token | Name | HEX | Role |
|-------|------|-----|------|
| Or1000 | Brand Orange | `#FF8800` | Logo, stage backgrounds, branded hero elements |
| Or1100 | Dark Orange | `#FF5C00` | Dark Orange Gradient endpoint; high-energy accents |
| Or800 | Light Orange | `#FFC700` | Brand Orange Gradient endpoint; sunny highlights |
| Or300 | Soft Orange | `#FFEAD3` | Card backgrounds, hero tile tints |

### Blue — Interactive & Structural

| Token | Name | HEX | Role |
|-------|------|-----|------|
| Blu1000 | Blue | `#272CB2` | Interactive elements, buttons (PMS 2736 C) |
| Blu1100 | Dark Blue | `#2F2F70` | Primary website & advertisement text (PMS 2756 C) |
| Blu300 | Light Blue | `#EDEEF3` | Backgrounds for emphasised cards or tiles |
| Blu100 | Soft Blue | `#F7F7F9` | Default website background |

### Neutral — Support Colors

| Token | Name | HEX | Role |
|-------|------|-----|------|
| — | Black | `#000000` | Logo in third-party tools (PMS Black) |
| Gr900 | Grey | `#555555` | Text in internal communications, business stationery, blog/help |
| Gr500 | Light Grey | `#BBBBBB` | Secondary text, business stationery, blog/help (PMS Cool Gray 11C) |
| Gr50 | Soft Grey | `#F9F9F9` | Card and tile backgrounds |
| — | White | `#FFFFFF` | Logo on dark surfaces, page backgrounds |

---

## Brand Gradients

Gradients are core STRATO identity elements — use them for hero stages, banners, and prominent branded surfaces.

### Brand Orange Gradient
Warm, sunny, optimistic. The primary STRATO hero gradient.

```css
background: linear-gradient(to right, #FF8800, #FFC700);
/* Or1000 → Or800 */
```

### Dark Orange Gradient
High-energy, bold. Used for strong CTA contexts and impactful callouts.

```css
background: linear-gradient(to right, #FF5C00, #FF8800);
/* Or1100 → Or1000 */
```

### Blue Gradient
Trusted, structural. Used for dark hero sections and premium backgrounds.

```css
background: linear-gradient(to right, #272CB2, #2F2F70);
/* Blu1000 → Blu1100 */
```

---

## Color Usage Rules

**DO**
- Use `#FF8800` (Brand Orange) as the primary anchor for logos, icons, headers, and stage backgrounds
- Apply Brand Orange Gradient (`#FF8800` → `#FFC700`) for hero sections and main stage areas
- Use `#272CB2` for all interactive elements (buttons, links, focus rings)
- Use `#2F2F70` for primary body text on digital surfaces
- Use `#F7F7F9` (Soft Blue) as the default page background
- Apply `#FFEAD3` (Soft Orange) as a warm card tint to reinforce the orange brand presence

**DON'T**
- Don't swap Orange for Blue as a primary brand color — orange is always the hero
- Don't use `#555555` (Gr900) for web UI text; reserve it for internal documents and print
- Don't use the dark orange gradient where the brand gradient would be more appropriate — the dark gradient is for energy, not general decoration
- Don't use gradients for small UI elements (badges, chips) — solid brand colors only at small scale

---

## Contrast-Approved Combinations

| Foreground | Background | Usage |
|------------|------------|-------|
| `#FFFFFF` | `#272CB2` Blu1000 | Button label text — ✓ AA |
| `#FFFFFF` | `#2F2F70` Blu1100 | Body text on dark backgrounds — ✓ AA |
| `#FFFFFF` | `#FF8800` Or1000 | Logo text, hero headline text — verify per weight |
| `#2F2F70` | `#FFFFFF` | Standard web body text — ✓ AA |
| `#2F2F70` | `#F7F7F9` Blu100 | Body text on page background — ✓ AA |
| `#2F2F70` | `#EDEEF3` Blu300 | Text on emphasised card background — ✓ AA |
| `#555555` | `#FFFFFF` | Internal/print documents only |

---

## Photography & Image Guidelines

Strato imagery centres on **real, relatable people** — warm, natural, and progress-oriented, reflecting the brand value "ORANGE is positive." All motifs should feel like a moment from real life, never staged or stock-photo stiff.

### Universal Rules (all contexts)

**People & poses**
- Poses as natural as possible — candid energy, not directed stiffness
- Expression: genuine smile or engaged concentration — never forced, never neutral/blank
- Open body language at all times — no crossed arms, no hunched shoulders, no turned-away postures
- Framing: **frontal or half-profile only** — never a pure side profile

**Camera angle**
- Eye-level is default — slight tilt (±15°) is acceptable
- No extreme frog's-eye (very low) or bird's-eye (very high) angles
- Keep the camera roughly at subject's face/chest height

**Lighting**
- Soft, even, diffused natural or studio light
- No strong directional shadows across the face
- Avoid harsh side-lighting or dramatic chiaroscuro — Strato is optimistic, not dramatic

**Clothing**
- Clean, casual to smart-casual — solid colors or simple, large-scale patterns preferred
- No busy small-patterned fabrics (fine checks, dense micro-prints, loud florals)
- Colors: warm neutrals, whites, soft tones work well; avoid anything that competes with brand orange

**Background**
- Clean, uncluttered — never visually busy or distracting
- Softly blurred (bokeh) or plain neutral backgrounds
- Environments: home, modern office/coworking, bright indoor spaces — lived-in but tidy

---

### Website Motifs

Used in: hero sections, product pages, feature tiles, editorial headers.

**Subject & pose**
- Single person or small group (2–3) in active, engaged poses
- If a device is present: **it must be clearly visible** — positioned so both person and screen are readable
- Device held naturally in front of the body or resting on a surface — not tucked away or partially cropped
- Subject may look into the camera **or** look at a device — both read as engaged and authentic

**Angle & depth**
- Strictly frontal or half-profile
- No or only very slight angle variation — frog's-eye and bird's-eye are off-limits
- **No blurred objects in the foreground** — keep the path to the subject unobstructed

**Environment**
- Background softly blurred but identifiable — coworking space, bright home, airy office
- No detailed, distracting elements behind the subject (busy shelving, cluttered desks)
- Light, neutral or warm-toned surroundings

**Reference examples observed:**
- Man in pink hoodie, glasses, curly hair — frontal, smiling at camera, gently blurred open-plan office background; no device; approachable and direct
- Middle-aged man in white polo — holding tablet on lap, smiling at camera, large bright windows behind; warm, confident, at ease
- Woman with curly hair, glasses — looking at smartphone held close to body; soft bokeh window; half-profile; focus on the active task

---

### External Motifs (Social Media, Ads)

Used in: social posts, display ads, banners, out-of-home.

**Subject & pose**
- Poses as natural as possible, friendly — energy can be slightly more dynamic than website shots
- Open body language; if a device is in frame: **held close to the body**, not extended or angled away

**Angle & depth**
- **Moderate perspective variation is allowed** — a slight frog's-eye or bird's-eye angle adds dynamism for ads
- **Sharpness/blur variation is allowed** — foreground or background bokeh can add editorial quality
- Avoid extremes even here: angles should enhance, not distort

**Environment**
- **Light background and surroundings** — bright, airy, positive mood
- No detailed, distracting backgrounds — clean but warmer and more lifestyle-oriented than website shots
- More social/natural settings are appropriate: café, outdoor, living room

**Reference examples observed:**
- Young woman on sofa, white tee — both hands holding tablet in front, smiling at screen; bright home with plants; slight depth-of-field; relaxed and joyful
- Two people at a café table — both leaning toward a laptop, genuinely smiling; warm ambient café light; social, collaborative energy

---

### Photography DO / DON'T

| DO | DON'T |
|----|-------|
| Natural, genuine smile or engaged expression | Forced grin, blank look, or overly serious pose |
| Open, relaxed posture | Crossed arms, hunched shoulders, closed-off stance |
| Device clearly visible and in active use | Device hidden, partially cropped, or decorative prop |
| Frontal or half-profile framing | Pure side profile |
| Soft, diffused even lighting on the face | Strong shadows, harsh sidelighting, dramatic contrast |
| Softly blurred or clean neutral background | Busy, detailed, or distracting background |
| Solid or large-pattern clothing | Fine checks, dense micro-prints, or visually noisy fabrics |
| Eye-level or slight angle (website) | Extreme low/high angles (website) |
| Moderate frog's/bird's-eye angle (social/ads) | Extreme distorted perspectives even in ads |
| Clean foreground, unobstructed path to subject | Blurred objects in the foreground (website context) |

---

## Quick Summary — Primary Brand Colors

| Color | HEX | Role |
|-------|-----|------|
| Brand Orange | `#FF8800` | Logo, hero, primary brand anchor |
| Dark Orange | `#FF5C00` | Gradient endpoint (dark energy) |
| Light Orange | `#FFC700` | Gradient endpoint (sunny warmth) |
| Blue | `#272CB2` | CTA, buttons, interactive |
| Dark Blue | `#2F2F70` | Primary text |
