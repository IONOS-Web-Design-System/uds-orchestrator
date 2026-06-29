# Image type: scenario

Use when the brief focuses on how a product, service, or digital experience is used in
context — the interaction IS the subject; people are supporting characters.

## When to apply
Brief signals: "app in use", "payment", "checkout", "customer using", "device usage",
"meeting with screen", "product in context", "hands on device", any brief where the
product/action is more important than who is doing it.

**Tie-breaker — person + device ≠ automatically `scenario`.** A handheld device (phone,
tablet, laptop) in the brief does NOT by itself make this a `scenario`. If the brief **names a
person as the subject** doing a task (a baker checking reservations, an owner managing orders),
the device is *held/used* and the person is part of the scene → use **`scene`** instead and
ensure the face remains fully visible. Only choose `scenario` when the brief makes the
**screen/device itself the hero** — "close-up of the app", "the dashboard on screen", "the
checkout moment", a deliberate over-the-shoulder/back shot of the screen — i.e. the face is
genuinely not the point.

## Composition rules
- Focal point is the product interaction: device screen, hands on terminal, interface visible
  on a laptop in a meeting, transaction moment at a counter
- People may be cropped (partial figure), blurred (shallow DOF), or in the background
- Close-up or medium shot centred on the interaction; environmental context visible but secondary
- Use depth of field to keep the key product element sharp and people/background soft
- Camera angles that reveal the interaction naturally: over-the-shoulder, slightly elevated
  looking down at hands + device, from-across-the-counter perspective

## Story direction
- The image should communicate a complete micro-story: what is happening, where, and why
- Show the moment of engagement — card tapping terminal, fingers mid-scroll, team leaning
  toward a shared screen — not before or after
- Context objects (coffee cups, notebooks, plants, shop decor) reinforce setting authenticity
- If a screen is incidental here (device-in-context, screen NOT the focus), it may show
  abstract colour blocks or blurred content — never readable paragraphs, logos, or UI chrome.
  (When the **screen-based product itself is the focus**, the opposite applies — full screen
  clearly visible showing a relevant real interface; see the Screen-moment variant below.)

## Lighting
- Ambient and practical — coffee shop window, office overhead, meeting room diffused light
- Screen glow as a secondary fill light is acceptable and adds authenticity
- Avoid flash or overly even studio lighting

## Screen-moment variant

Use when the brief is specifically about a product feature shown ON a device screen —
a dashboard, an app, a website — and that screen is the hero of the image.

### When to apply this sub-type
Brief signals: "show the dashboard", "app on phone", "laptop with interface", "product
feature on screen", "website on device", "screen in context".

### Priority — fit the device into the scenario NATURALLY first, then show the full screen

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
in `image-type-scene.md`):

- **Overhead / top-down (Pattern B):** camera 50–75° above the workspace looking down.
  Screen faces upward and is fully visible. Person enters peripherally — only hands/forearms
  at the frame edge. The desk surface (warm wood, cream, light concrete) fills 30–50% of the
  frame as a texture layer. Best for: "workspace from above", laptop or phone on a table,
  overhead editorial feel. Encode: `"overhead shot from approximately 60 degrees above,
  looking down at [surface] desk surface, hands and forearms entering from [left/bottom],
  device screen facing upward clearly visible"`.

- **Behind-the-person / over-shoulder (Pattern C):** camera behind and slightly to the side,
  looking toward the screen. Back of head + shoulder as a **compositional shape at the frame
  edge** — face never appears. Screen faces the camera naturally. Best for: dashboard/app
  on laptop, "over someone's shoulder" feel. Encode: `"over-the-shoulder shot from behind
  and slightly above to the right, partial back of head and shoulder at the frame edge,
  [device] with screen clearly visible and facing the viewer"`.

- **Eye-level with surface anchor (Pattern A):** camera at eye-level or slightly elevated.
  Person sits or stands naturally, keyboard/device in front of them. Best for: two people
  at a screen, customer at a counter, team working together. Encode: `"slightly elevated
  eye-level shot, [person] at a [surface], [device] screen visible from the side/front"`.

The screen faces the camera because the camera occupies the natural over-the-user /
over-the-counter viewpoint — NOT because the subject aimed the device at it.

Keep the **entire** screen in frame, unclipped (no head/hand covering it), in sharp focus and the
brightest element. If the natural angle can't show the whole screen, **move or widen the camera —
do not twist the device toward the lens.** (Back-shots that fully hide the screen, or extreme
oblique angles that skew it, belong to the device-in-context case where the screen is not the point.)

### Screen content — a relevant, real app interface

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

### Foreground context objects (essential)

Objects placed close to the camera in soft focus are what make screen-moment images
feel real rather than rendered. Choose 2–3 objects that tell the story of who owns
this device and what they are doing:

| Context / setting | Foreground objects to include |
|---|---|
| Café / casual work | latte art coffee cup (held or on saucer), ceramic plate, a film camera, a small plant |
| Home office | open notebook with handwritten notes, a pen, reading glasses set down beside the device |
| E-commerce / creative | a product sample (candle, fabric swatch, ceramic piece), packaging material |
| Meeting / office | printed documents, a water glass, a laptop bag strap visible at the edge |
| Developer / tech | mechanical keyboard, a mug with steam, sticky notes on the desk surface |

Encode foreground objects using the depth-layer pattern from `shared-environment-storytelling`:
`"[object A] and [object B] sitting on the desk surface immediately in front of the camera
lens, rendered as soft out-of-focus bokeh in the lower foreground, screen in sharp focus
behind them"`

### Background

Soft, heavily blurred environment that suggests the setting without competing with the screen:
- `"background of a warm softly blurred café interior"` / `"warmly blurred home office"` / `"soft neutral desk surface receding into blur"`
- Avoid: plain white backdrop, blank walls, anything that makes the setting feel studio-shot

### Human presence (optional but powerful)

A partial human element — a hand holding the device, an arm, hair at the edge of frame,
a blurred figure behind the laptop — adds authenticity. Face must NOT be visible and in
focus (that becomes portrait type):
- Phone: `"a hand with natural skin texture holding the smartphone, partial sleeve visible"`
- Laptop: `"a person's hand resting on the keyboard, blurred figure seated behind the laptop, hair visible"`

### Full prompt structure for screen-moment images

Build in this order:

1. **Device + angle anchor:** `"[device] [angle description], screen as the focal point"`
2. **Screen content:** `"screen displaying [plausible but indistinct interface description]"`
3. **Human element (if any):** `"[partial human description]"`
4. **Foreground objects:** `"[object A] and [object B] immediately in front of the camera lens, softly blurred"`
5. **Background:** `"background of [environment] softly blurred"`
6. **Lighting:** `"[light source] with subtle screen glow as secondary fill"`
7. **Photography style:** `"product photography, editorial style, shallow depth of field"`

Example (laptop in café):
> `"open MacBook-style laptop on a café desk, lid at 105 degrees facing the camera, screen as
> the focal point, shot from slightly above and to the right. screen displaying a soft-focus
> business dashboard with chart elements and navigation, content indistinct but plausible.
> a woman's hand resting on the keyboard, blurred figure in background. a latte art coffee
> cup held in a hand and a ceramic saucer with a spoon sitting on the desk immediately in
> front of the camera lens, rendered as out-of-focus bokeh in the lower foreground. background
> of a warm softly blurred café interior with large windows. warm natural window light with
> subtle screen glow as secondary fill on the keyboard surface. product photography,
> editorial style, shallow depth of field."`

Example (phone held showing app):
> `"smartphone held vertically in a hand, screen angled directly toward the viewer,
> photographed at slight elevation. screen displaying a warm-toned mobile app layout
> with product imagery, text blocks softly indistinct. partial arm and yellow sleeve
> visible behind the phone. warm sandy surface and soft shadow immediately in front
> of the camera lens as natural foreground. background of a warm softly blurred interior
> with diffused natural light. warm ambient light with soft screen glow. product
> photography, editorial style, shallow depth of field."`

## Avoid
- Person posing or looking at camera (this becomes `portrait` or `scene` type)
- Screen content that is sharp and readable — put "sharp readable screen text, UI text, legible interface labels" in negativePrompt
- Plain white or studio backdrop — always suggest a real environment in the background
- Device floating in blank space with no foreground or environmental context
- Sterile stock-photo compositions with everyone looking pleased at nothing in particular
- Cropping that removes the product/interaction from the frame
- Screen angle so oblique the interface is not recognisable as a screen
