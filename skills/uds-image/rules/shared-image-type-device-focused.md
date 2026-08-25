# Image type: device-focused

Use when a device, screen, app or software product-view is the HERO of the image. The device is
the subject; a person is at most partial context — a hand, an over-the-shoulder or partial
presence — never a co-equal full-frame portrait.

## When to apply

- The brief centres on a laptop, phone, tablet, dashboard, or a UI being used or shown.
- The product view IS the point, and any person is there to give it scale and human warmth.

If the brief is about a person doing something and the device is incidental, that is `scene`,
not `device-focused`.

Brief signals: "show the dashboard", "app on phone", "laptop with interface", "product
feature on screen", "website on device", "screen in context".

## Priority — fit the device into the scenario NATURALLY first, then show the full screen

For a screen-based product, **scenario fit and storytelling come FIRST.** Full-screen visibility
comes second and is achieved by where you place the **camera** — never by posing the device.

**1. A real, natural use moment (top priority).** The device is used exactly as a real person
uses it. Two hard anti-patterns:
- a **lone idle device** on an empty desk / propped on a stand with no one around, and
- a person **holding or turning the device up to "present" the screen to the lens** — nobody
  holds a phone or tablet flat to the camera in real life; it reads as a fake product demo. This
  is the #1 thing to avoid.

Anchor a genuine moment instead: tapping a phone on the contactless reader to **pay at a counter**,
glancing down at the phone in hand over a coffee, typing at a laptop mid-task, two people leaning
over a dashboard in discussion. Hands and posture are natural to the action. Encode it:
`"tapping their phone on the contactless card reader at the bakery counter, screen facing up"`,
`"glancing down at the phone held casually in one hand at the café table"`.

**2. Then make the full screen clearly visible — by MOVING THE CAMERA, not the device.**

Choose the camera angle that fits the brief. Three named patterns (detailed prompt templates
in `shared-image-type-scene.md`):

- **Overhead / top-down (Pattern B):** camera 50–75° above the workspace looking down.
  Screen faces upward and is fully visible. Person enters peripherally — only hands/forearms
  at the frame edge. The desk surface (warm wood, cream, light concrete) fills 30–50% of the
  frame as a texture layer. Best for: "workspace from above", laptop or phone on a table,
  overhead editorial feel. Describe a camera roughly 60 degrees above the surface, hands and
  forearms entering from one edge, and the device screen facing upward and clearly visible —
  in your own words, not a fixed phrase reused every time.

- **Behind-the-person / over-shoulder (Pattern C):** camera behind and slightly to the side,
  looking toward the screen. Back of head + shoulder as a **compositional shape at the frame
  edge** — face never appears. Screen faces the camera naturally. Best for: dashboard/app
  on laptop, "over someone's shoulder" feel. Describe the camera positioned behind and
  slightly above to one side, the back of the head and a shoulder forming a shape at the
  frame edge, and the device screen facing the viewer clearly.

- **Eye-level with surface anchor (Pattern A):** camera at eye-level or slightly elevated.
  Person sits or stands naturally, keyboard/device in front of them. Best for: two people
  at a screen, customer at a counter, team working together. Describe a slightly elevated
  eye-level shot with the person at their surface and the device screen visible from the
  side or front.

The screen faces the camera because the camera occupies the natural over-the-user /
over-the-counter viewpoint — NOT because the subject aimed the device at it.

Keep the **entire** screen in frame, unclipped (no head/hand covering it), in sharp focus and the
brightest element. If the natural angle can't show the whole screen, **move or widen the camera —
do not twist the device toward the lens.** (Back-shots that fully hide the screen, or extreme
oblique angles that skew it, belong to the device-in-context case where the screen is not the point.)

## Screen content — a relevant, real app interface

The screen shows a **clear, recognisable, relevant app interface** — NOT abstract colour blocks.
Render a believable layout for the actual product (navigation/sidebar, header, cards, a chart, a
product grid, a form — whatever that app really looks like), in sharp focus and fully visible.

- **Which interface?** Default to the **product the `showroom` refers to** (e.g. an e-commerce
  showroom → an online-shop admin / storefront UI; an email-marketing showroom → a campaign
  dashboard; a website-builder showroom → the builder canvas). If the showroom implies no
  specific product, show an interface that **reflects the image's own scenario**. In the
  `/imagine` flow, the agent ASKS the user what the screen should show (see `human-interactive`).
- **Layout over fine text.** Describe the app by its recognisable UI regions with at most short
  plausible labels/headings — never paragraphs of legible body text (image models still garble
  dense copy). The interface must read as the right product at a glance even if fine text is
  approximate. Example: `"the laptop screen clearly showing an e-commerce store-admin interface
  — left navigation rail, a product grid of photo thumbnails with price chips, a sales summary
  chart along the top — clean modern UI, full screen sharp and clearly visible"`.
- **For a pixel-accurate product UI**, use **hybrid mode** (`interface-asset`) instead — it
  composites a real rendered UDS interface; pure image generation renders a recognisable-but-
  approximate layout.

The screen should be the **brightest element in the frame** — `"screen emitting soft natural
light, slightly brighter than the ambient environment"`.

## Foreground context objects (essential)

Objects placed close to the camera in soft focus are what make screen-moment images
feel real rather than rendered. Choose 1–2 of them.

**Which objects: `shared-scenario-props`.** That rule is the only place prop objects are
named, keyed on the scenario's `place` and on who the person is. The table that stood here mixed
those two axes in ONE key column — three of its five keys were places and two were trades — so a
brief that matched on trade could pull the objects of a place it was never set in. Do not
restate its objects here.

What belongs to THIS rule is the depth layer: place the chosen objects on the desk surface near
the camera, softly out of focus, while the screen stays sharp behind them. Describe THIS scene's
objects in your own words — do not copy a fixed sentence shape between generations.

## Background

Soft, heavily blurred environment that suggests the setting without competing with the screen:
- `"background of a warm softly blurred café interior"` / `"warmly blurred home office"` / `"soft neutral desk surface receding into blur"`
- Avoid: plain white backdrop, blank walls, anything that makes the setting feel studio-shot

## Human presence (optional but powerful)

A partial human element — a hand holding the device, an arm, hair at the edge of frame,
a blurred figure behind the laptop — adds authenticity. Face must NOT be visible and in
focus (that becomes portrait type):
- Phone: `"a hand with natural skin texture holding the smartphone, partial sleeve visible"`
- Laptop: `"a person's hand resting on the keyboard, blurred figure seated behind the laptop, hair visible"`

## Full prompt structure for screen-moment images

Build in this order:

1. **Device + angle anchor:** `"[device] [angle description], screen as the focal point"`
2. **Screen content:** `"screen displaying [plausible but indistinct interface description]"`
3. **Human element (if any):** `"[partial human description]"`
4. **Foreground objects (optional):** 1–2 objects specific to this scene, placed near the
   camera and softly blurred — chosen for the story, not a repeated pair
5. **Background:** `"background of [environment] softly blurred"`
6. **Lighting:** `"[light source] with subtle screen glow as secondary fill"`
7. **Photography style:** `"product photography, editorial style, shallow depth of field"`

Example (laptop in café):
> `"open MacBook-style laptop on a café desk, lid at 105 degrees facing the camera, screen as
> the focal point, shot from slightly above and to the right. screen displaying a soft-focus
> business dashboard with chart elements and navigation, content indistinct but plausible.
> a woman's hand resting on the keyboard, blurred figure in background. [one object from this
> scenario's place row and one from its person row, per `shared-scenario-props`] sit on the desk
> near the camera, softly out of
> focus against the sharp screen behind them. background of a warm softly blurred café
> interior with large windows. warm natural window light with
> subtle screen glow as secondary fill on the keyboard surface. product photography,
> editorial style, shallow depth of field."`

Example (phone held showing app):
> `"smartphone held vertically in a hand, screen angled directly toward the viewer,
> photographed at slight elevation. screen displaying a warm-toned mobile app layout
> with product imagery, text blocks softly indistinct. partial arm and yellow sleeve
> visible behind the phone. a warm sandy surface with soft shadow sits just behind the
> phone, gently out of focus. background of a warm softly blurred interior
> with diffused natural light. warm ambient light with soft screen glow. product
> photography, editorial style, shallow depth of field."`
