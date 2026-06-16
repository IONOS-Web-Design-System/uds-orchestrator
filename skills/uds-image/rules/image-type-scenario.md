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
the device is *held/used* and the **person stays the anchor** → use **`person-scenario`** (face
visible, headroom, especially on landscape — a head must never be cropped just because a phone
is in the shot). Only choose `scenario` when the brief makes the **screen/device itself the
hero** — "close-up of the app", "the dashboard on screen", "the checkout moment", a deliberate
over-the-shoulder/back shot of the screen — i.e. the face is genuinely not the point.

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
- If a screen is visible, it may show abstract colour blocks or blurred content — never
  readable text, logos, or UI chrome

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

### Device placement and angle

The screen must face the viewer at an angle that reads as natural and legible:

| Device | Camera position | Device angle |
|---|---|---|
| Smartphone | slightly elevated (10–20° above), shooting at the front face of the screen | held vertically in hand, tilted 5–10° toward viewer, screen facing camera |
| Laptop | slightly elevated (20–30° above), slightly to one side | open at 100–110°, lid angled toward viewer so screen is visible; keyboard partially visible |
| Tablet | slightly elevated (15–25° above) | held in both hands or resting on surface, screen facing viewer at 10–20° tilt |

Encode the device angle explicitly in the prompt:
- `"smartphone held vertically in hand, screen angled directly toward viewer, photographed at slight elevation"`
- `"open laptop on desk, lid at 105-degree angle facing the camera, shot from slightly above and to the side"`

**Vary the angle — do NOT default to the flat front-on screen view every time.** A straight-on
screen is the weakest, most generic framing (and the screen content is faked anyway). Pick the
angle that tells the story best:

| Angle | When to use | Prompt phrasing |
|---|---|---|
| **Over-the-shoulder / back shot** | the user's act of looking at the screen is the point | `"shot from behind and over the user's shoulder, looking past them at the glowing screen, the back of their head and shoulder soft in the foreground"` |
| **Telephoto / compressed** | a clean, premium product feel; isolates the device from a busy room | `"telephoto lens, compressed perspective, shallow depth of field isolating the device, background softly blurred"` |
| **Three-quarter / side** | shows device + hands + a slice of environment | `"three-quarter side angle on the device, hands interacting, environment visible behind"` |
| **Slight-elevated front** | the screen layout itself is the hero (use sparingly) | the table above |

Mix these across a set of variants rather than repeating the front-on shot.

### Screen content

**Never generate readable text or legible UI on screen** — image models garble it.
Instead, describe a visually plausible but indistinct screen:
- `"screen displaying a soft-focus dashboard interface with coloured chart elements and navigation areas, content intentionally unreadable at this distance"`
- `"phone screen showing a warm-toned e-commerce app layout with product images, text blocks indistinct"`

The screen should be the **brightest element in the frame** — use natural screen glow:
- `"screen emitting soft natural light, slightly brighter than the ambient environment"`

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
- Person posing or looking at camera (this becomes portrait or person-scenario type)
- Screen content that is sharp and readable — put "sharp readable screen text, UI text, legible interface labels" in negativePrompt
- Plain white or studio backdrop — always suggest a real environment in the background
- Device floating in blank space with no foreground or environmental context
- Sterile stock-photo compositions with everyone looking pleased at nothing in particular
- Cropping that removes the product/interaction from the frame
- Screen angle so oblique the interface is not recognisable as a screen
