# Image type: avatar

Use when the output will be used as a profile picture, team member card, or small square
thumbnail. The face is always clearly visible and identifiable, but the shot distance,
angle, background, and occupation context vary to create natural diversity across a set.

An avatar can — and often should — relate to the character's occupation or scenario.
The occupation context makes the avatar feel like a real person with a story, not a
neutral headshot. A carpenter's avatar may show a workshop background; a developer's
avatar may have a monitor behind them; a baker might hold a cup.

## When to apply
Brief signals: "avatar", "profile photo", "team photo", "headshot for card", "square
format", any square crop intended to identify a specific person at small sizes.

## Aspect ratio
Always 1:1. The face must read clearly at thumbnail scale.

## Face rule (non-negotiable)
The main character's face must be 100% visible in every avatar — full forehead to chin, no
cropping at any angle. This is the single hard constraint; everything else is intentionally varied.

## Occupation and scenario context — first-class signal

The brief's character context (their job, setting, or story) should inform the avatar.
Apply it through one or more of these levers:

- **Background (strongest signal):** use the character's real work environment, softly
  blurred behind them (see Background mode C below). A workshop, studio, shop floor, or
  office in the background immediately communicates who they are.
- **Prop in hand:** at medium shot distance, the character holds a profession-relevant
  object. This single element identifies their role at a glance.
- **Attire:** work-appropriate clothing — an apron, a smart casual shirt, a hard hat —
  signals context without requiring a description.

When the brief says nothing about occupation, default to a neutral background (mode A or B)
but still populate the character with a plausible identity (see `shared-character-diversity`).

## Shot distance — choose one per generation
Do not default to the same distance every time. Rotate across distances to create variety:

| Distance | What's visible | Feel |
|----------|---------------|------|
| Close-up | Face, neck, hint of shoulder | Editorial, intimate |
| Medium close-up | Head, neck, chest, shoulder | Approachable, personal |
| Medium shot | Head to waist, hands may be visible | Contextual, grounded |

At medium shot distance the person may hold a relevant prop (tool, notebook, coffee cup,
device) to convey occupation — this adds story without losing face focus.

## Camera angle — vary per generation

Any angle where the face is clearly visible is valid. Do not restrict to front-facing
only — variety across a set of avatars is valuable. Valid options include:

- **Front view:** subject looks directly into the lens — warm, engaging, direct
- **3/4 view:** body turned 30–45° while face remains readable — natural, candid
- **Slight side:** head turned to ~60°, face clearly readable — editorial, confident
- **Looking slightly up or down:** angled with the face still fully in frame — dynamic
- **Candid angle:** caught mid-moment, slight turn, expression natural — authentic

Any angle further than ~75° from front-on risks losing the face; avoid those.
Avoid symmetrical dead-centre framing on every shot. Rule of thirds placement (face on
one vertical third) reads more naturally than dead-centre.

## Background — three valid modes
Pick the mode that best fits the character's context. Vary across a variant set.

**A. Studio / plain**
Neutral grey, soft white, or warm beige seamless backdrop. Clean, minimal, no distractions.
Works for any persona.

**B. Architectural / environmental**
Glass wall, concrete corridor, office window, or building exterior in soft focus behind the
subject. Creates depth and a real-world professional feel without showing a specific room.

**C. Real work environment (fitting-in)**
The character's actual workspace — shop, studio, office — visible but 1–2 stops under-
exposed and softly blurred. The person integrates naturally into the space; their attire and
optional prop should harmonise with the background. The background tells who they are,
the face tells who they are to you.

## Lighting — do not specify, let the model decide
Do NOT prescribe a lighting setup in the prompt or the SPEC. The model should choose
freely from its full photographic repertoire based on the character and background:

Examples of valid choices (non-exhaustive):
- Classic three-point softbox studio lighting
- Chiaroscuro — strong single light source, deep shadow on one side
- Rembrandt lighting — angled key light with the characteristic cheek triangle
- Natural window daylight — diffuse or direct depending on time of day
- Overcast outdoor light — soft, even, no harsh shadows
- Golden hour — warm directional backlight or sidelight
- Practical ambient — light from the environment itself (workshop lamp, office overhead)

Instructing the model to pick lighting defeats the purpose — omitting it produces more
authentic, varied, and photorealistic results. The prompt should describe the PERSON and
SETTING; the model fills in the photographic craft.

## Camera — do not specify, let the model decide
Do NOT name a specific camera, lens, or film stock in the prompt. The model will select
appropriate photographic qualities — sensor rendering, depth of field, colour science,
grain — that fit the character and background mode. Valid choices range from:
- Medium format studio camera — rich tones, sharp detail, commercial feel
- 35mm film SLR — natural grain, classic colour rendering
- Disposable / point-and-shoot — casual, intimate, lo-fi authenticity
- Modern mirrorless — clean, neutral, versatile

As with lighting: describe the person, not the gear. Authentic photographic diversity
comes from the model's creative judgment, not from prompting a specific camera.

## Negative prompt additions (avatar-specific)
Add to negativePrompt: "long shot, wide shot, full body, background sharply in focus
and competing with face, multiple people, group shot, face cropped, face cut off".
