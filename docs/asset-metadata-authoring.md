# Asset Metadata Authoring: IONOS Wireframe Asset Library

> **Audience:** designers maintaining the Figma asset library.
> **Home:** this doc belongs in the Figma file (paste into the library page or file description).

## The idea

The pipeline shows each asset's description to an AI model and asks it to pick the ones that fit
the current animation brief. Write descriptions the way you would brief a colleague: tell them what
is in the image, what kind of business or person it represents, and when to reach for it. The model
does the rest — you do not need to encode a vocabulary.

## Format

One short paragraph per asset, 2–4 sentences. Start with a type prefix in brackets. Everything
after the prefix is free prose.

```
[type] What the image shows. What business, person, or scenario it represents.
When to use it — including any important contrasts ("use for X, not for Y").
```

**Type prefixes** (pick one, nothing else structured is required):

| Prefix | When to use |
|---|---|
| `[photo]` | A standalone photo — people, products, scenes, hero images |
| `[website]` | A full website or app UI screenshot placed *as* the site being edited |
| `[mockup]` | A device or scene frame with a blank screen area to composite UI into |
| `[icon]` | A small brand or product icon used inline in generated UI |

That is the only structure. The rest is your words.

## What to include in the prose

**For `[photo]`:** Describe the subject and scene. Name the industry or business type it fits.
Note mood, lighting, or style if it matters. Say what kind of layout placement it suits (hero
banner, card image, background).

**For `[website]`:** Describe the site's theme (light/dark), layout, and what kind of business runs
it. Be specific about who would own this site (a small bakery, a freelance creative, a fitness
studio). Call out what it is *not* a good fit for — this is the most useful guidance the model gets.

**For `[mockup]`:** Describe the device (phone, laptop, browser window) and scene. Note where the
blank screen region sits.

**For `[icon]`:** Name the product or brand. Note color style (full-color vs monochrome) and size.

## Examples

```
[photo] A woman looking at a tablet in a warmly lit artisan bakery. Natural light,
bread on shelves in the background. Use as a hero image for food businesses — bakeries,
cafés, catering.

[website] Light-themed e-commerce homepage for a small fashion clothing shop. Shows a
product grid, branded header, and simple navigation. Good fit when the brief describes a
small business owner running an online store. Not a personal portfolio — the site clearly
belongs to a shop, not an individual.

[website] Minimal personal portfolio site on a white background. Sidebar layout with
profile photo and work samples. Use for creatives and freelancers presenting their own work.
Not the right choice for a business-owned website.

[website] Dark-themed fitness studio dashboard. Shows workout tracking, class schedule,
and member stats. Use for fitness or wellness businesses with a digital product.
Avoid when the brief asks for a light-background website.

[photo] Close-up of a man repairing the engine of a classic car in a garage workshop.
Grease on hands, tools visible. Use for automotive repair or car service businesses.

[mockup] A realistic iPhone frame with a white blank screen in portrait orientation.
Use when you need to composite a mobile app interface into a device shell.

[icon] WordPress logo, full-color square variant. Use inline in UI when the brief
involves WordPress-powered websites or the WordPress Builder product.
```

## Practical tips

Write the "not for" contrast when an asset is easy to confuse with another. The model is most
likely to pick the wrong asset when two descriptions sound similar without that contrast. The
`[website]` assets especially benefit from it.

Keep it honest. If you do not know what business context an image fits, say what you see and leave
the use-case sentence out. A plain visual description is better than a guessed context.

Frame name = asset slug. Keep it stable. Renaming breaks references in generated code.
The Figma page is the only other structural signal the pipeline reads — `asset/sync` for photos
and website screenshots, `asset/mockup` for device frames, `asset/social` for icons.
